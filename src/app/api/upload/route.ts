import { NextResponse } from "next/server";
import { UPLOAD_BUCKET, supabase } from "@/lib/supabase";
import { IS_LIVE } from "@/config/launch";
import { SITE } from "@/config/site";

/**
 * Signed upload URLs for the order flow.
 *
 * WHY THIS ROUTE EXISTS AT ALL
 * ----------------------------
 * The eng-uploads bucket is private and there is no publishable key on this
 * site, so the browser has no credential that can write to storage and is not
 * going to be given one. Instead it asks this route for one short-lived signed
 * URL per file, uploads directly to that URL, and posts the resulting object
 * key back with the form. The service role never leaves the server and the
 * bucket never becomes writable by anybody holding a page.
 *
 * Uploading direct to storage rather than through the server also keeps a
 * fifteen megabyte site plan out of a function's request body.
 */

/** Extensions a plan reviewer or an underwriter would actually send. */
const ALLOWED = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "heic",
  "webp",
  "dwg",
  "dxf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "zip",
]);

const MAX_BYTES = 40 * 1024 * 1024;

/**
 * Strip everything that is not a safe filename character.
 *
 * The name arrives from a stranger's file picker. Path separators, traversal
 * segments, and control characters are removed rather than escaped, because an
 * object key is not a place to be clever about encoding.
 */
function safeName(input: string): string {
  const base = input.split(/[\\/]/).pop() || "file";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/\.{2,}/g, ".")
    .slice(0, 120);
  return cleaned || "file";
}

export async function POST(request: Request) {
  // The gate is enforced here and not only in the component that renders the
  // upload control. A route that trusts the UI to have hidden it is not gated.
  if (!IS_LIVE) {
    return NextResponse.json({ error: "Ordering is not open yet." }, { status: 403 });
  }

  let body: { filename?: unknown; size?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const filename = typeof body.filename === "string" ? safeName(body.filename) : "";
  const size = typeof body.size === "number" ? body.size : 0;

  if (!filename) {
    return NextResponse.json({ error: "A filename is required." }, { status: 400 });
  }
  const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "";
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { error: `That file type is not accepted. Allowed: ${[...ALLOWED].join(", ")}.` },
      { status: 400 },
    );
  }
  if (size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Files are limited to ${Math.round(MAX_BYTES / 1024 / 1024)} MB.` },
      { status: 400 },
    );
  }

  // Keyed by site and by day so the bucket stays navigable when three brands
  // are writing into it. crypto.randomUUID rather than the filename alone, so
  // two people uploading "roof.pdf" do not overwrite each other.
  const day = new Date().toISOString().slice(0, 10);
  const path = `${SITE.siteKey}/orders/${day}/${crypto.randomUUID()}-${filename}`;

  const { data, error } = await supabase().storage.from(UPLOAD_BUCKET).createSignedUploadUrl(path);

  if (error || !data) {
    console.error(`[upload] could not sign ${path}: ${error?.message}`);
    return NextResponse.json({ error: "Could not prepare the upload. Try again." }, { status: 500 });
  }

  return NextResponse.json({ path: data.path, token: data.token, signedUrl: data.signedUrl });
}
