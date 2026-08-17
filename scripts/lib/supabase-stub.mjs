import http from "node:http";

/**
 * An in-memory stand-in for the Supabase REST and storage APIs.
 *
 * WHY THIS EXISTS
 * ---------------
 * forms-audit submits every form on the site for real, which is the only way to
 * test a server action end to end. Doing that against the shared production
 * project would write junk rows into eng_leads and eng_applications on every
 * run, in a table another site also reads. Nobody wants to be the person who
 * put "Audit Bot" in the founders waitlist forty times.
 *
 * So the harness starts this, points the server it spawns at it with
 * SUPABASE_URL, and asserts against rows captured here. Nothing about the
 * application is mocked: the real server action runs, the real Supabase client
 * makes the real HTTP request, and the real Zod parse decides what reaches it.
 * Only the far end of the socket is different.
 *
 * It implements the narrow slice of PostgREST and storage that this site uses
 * and deliberately nothing else. A fuller fake would be a second product to
 * maintain, and the moment it diverges it starts lying.
 */
export async function startSupabaseStub({ port = 3128 } = {}) {
  /** Captured inserts, keyed by table name. */
  const tables = {
    eng_leads: [],
    eng_orders: [],
    eng_applications: [],
  };
  /** Every signed upload path handed out, so the harness can assert on them. */
  const signedUploads = [];
  /** Set true to make the next insert fail, for exercising the error path. */
  const control = { failNextInsert: false };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const send = (status, payload) => {
        const json = JSON.stringify(payload);
        res.writeHead(status, {
          "content-type": "application/json; charset=utf-8",
          "content-range": "*/*",
        });
        res.end(json);
      };

      // ---- PostgREST inserts ------------------------------------------------
      const restMatch = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
      if (restMatch && req.method === "POST") {
        const table = restMatch[1];
        if (control.failNextInsert) {
          control.failNextInsert = false;
          // Shaped like a real PostgREST error so the action's error branch
          // reads it the same way it would in production.
          return send(400, {
            message: "stub: deliberate failure",
            code: "STUB01",
            details: null,
            hint: null,
          });
        }
        if (!tables[table]) tables[table] = [];
        let rows;
        try {
          rows = JSON.parse(body || "[]");
        } catch {
          return send(400, { message: "stub: unparseable body" });
        }
        const list = Array.isArray(rows) ? rows : [rows];
        const stored = list.map((r, i) => ({
          id: `00000000-0000-4000-8000-${String(tables[table].length + i).padStart(12, "0")}`,
          created_at: new Date(0).toISOString(),
          ...r,
        }));
        tables[table].push(...stored);

        // `.select().single()` asks for a single object rather than an array,
        // via the Accept header. Answering with an array there makes the client
        // report a shape error rather than the insert it actually performed.
        const wantsSingle = (req.headers.accept || "").includes("vnd.pgrst.object");
        const wantsBody = (req.headers.prefer || "").includes("return=representation");
        if (!wantsBody) return send(201, wantsSingle ? null : []);
        return send(201, wantsSingle ? stored[0] : stored);
      }

      // ---- Storage: signed upload URLs -------------------------------------
      const signMatch = url.pathname.match(/^\/storage\/v1\/object\/upload\/sign\/([^/]+)\/(.+)$/);
      if (signMatch && req.method === "POST") {
        const [, bucket, objectPath] = signMatch;
        const decoded = decodeURIComponent(objectPath);
        signedUploads.push({ bucket, path: decoded });
        return send(200, {
          url: `/object/upload/sign/${bucket}/${objectPath}?token=stub-token`,
          token: "stub-token",
        });
      }

      // ---- Storage: the PUT the browser then makes -------------------------
      if (url.pathname.startsWith("/storage/v1/object/upload/sign/") && req.method === "PUT") {
        return send(200, { Key: url.pathname });
      }

      send(404, { message: `stub: no route for ${req.method} ${url.pathname}` });
    });
  });

  await new Promise((resolve) => server.listen(port, resolve));

  return {
    url: `http://localhost:${port}`,
    tables,
    signedUploads,
    control,
    /** Every row across every table, for a total count. */
    allRows: () => Object.values(tables).flat(),
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

/**
 * The environment a spawned Next server needs to talk to the stand-in.
 *
 * Passed to the child rather than written to .env.local, because @next/env only
 * applies a dotenv key when it is undefined in the initial process.env. A value
 * handed to the child therefore wins, and that is what keeps an audit run off
 * the production database even when .env.local points at it.
 */
export function stubEnv(stubUrl, extra = {}) {
  return {
    SUPABASE_URL: stubUrl,
    SUPABASE_SERVICE_ROLE_KEY: "stub-service-role-key",
    // Deliberately absent: RESEND_API_KEY. lib/email.ts treats a missing key as
    // "skip and warn" rather than an error, which is exactly the behaviour the
    // audit wants and also the behaviour it should be proving.
    ...extra,
  };
}
