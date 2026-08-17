// forms-audit preflight.
//
// forms-audit spawns two `next start` servers of its own, sequentially, on
// ports outside the main :3125 slot. That means:
//
//   - The build guard would be wrong. It refuses when anything is listening in
//     the audit range, and a `next start` on :3125 is a perfectly safe state
//     for this harness. A guard that fires on a safe state is the one people
//     learn to bypass with an environment variable and then never remove.
//
//   - The stale-server check would be wrong too. It asks whether :3125 is
//     serving the current build, and forms-audit does not read :3125 at all.
//
// What forms-audit actually needs is narrower and this file checks exactly it:
// a build exists on disk, because `next start` reads .next rather than creating
// it, and the three ports it claims are free.
import { readFileSync } from "node:fs";
import net from "node:net";

const PORTS = [
  Number(process.env.FORMS_PORT || 3126),
  Number(process.env.FORMS_LIVE_PORT || 3127),
  Number(process.env.FORMS_STUB_PORT || 3128),
];

const problems = [];

let buildId = null;
try {
  buildId = readFileSync(new URL("../.next/BUILD_ID", import.meta.url), "utf8").trim();
} catch {
  problems.push(
    "No .next/BUILD_ID on disk. forms-audit drives `next start`, which serves a build rather\n" +
      "than creating one. Run `npm run build` first.",
  );
}

/**
 * Connect probe rather than a bind probe.
 *
 * On Windows a stray server can hold a port on IPv6 while localhost resolves to
 * ::1 first, so a bind on 127.0.0.1 succeeds and reports "free" about a port
 * that is serving. Asking the same question the harness will ask is the only
 * probe that cannot disagree with it.
 */
function inUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "localhost" });
    const done = (answer) => {
      socket.destroy();
      resolve(answer);
    };
    socket.setTimeout(1500);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

for (const port of PORTS) {
  if (await inUse(port)) {
    problems.push(
      `Something is already listening on ${port}. forms-audit refuses to attach to a server it\n` +
        `did not start, because results about the wrong server are worse than no results.`,
    );
  }
}

if (problems.length === 0) {
  console.log(`preflight (forms-audit): build ${buildId} on disk, ports ${PORTS.join(", ")} free.`);
} else {
  console.error(`\n=== FORMS-AUDIT PREFLIGHT FAILED ===\n\n${problems.join("\n\n")}\n`);
  process.exitCode = 1;
}
