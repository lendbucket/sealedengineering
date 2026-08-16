// Build preflight. Wired as `prebuild` in package.json, so it runs on every
// `npm run build` without anybody having to remember it, including builds
// invoked from other scripts, which is the point. A guard you have to call by
// hand protects the runs you were already being careful about.
//
//   npm run build                      refuses if a server holds .next
//   AUDIT_KILL_STALE=1 npm run build   kills the holders first
import { assertClearToBuild } from "./lib/build-guard.mjs";

const kill = process.argv.includes("--kill") || process.env.AUDIT_KILL_STALE === "1";

try {
  const { skipped, killed } = assertClearToBuild({ kill, label: "build" });
  if (skipped) console.log("[build-guard] CI or deploy environment, skipped.");
  else if (killed) console.log("[build-guard] cleared stale server(s), proceeding.");
  else console.log("[build-guard] nothing holding .next, proceeding.");
} catch (err) {
  console.error(err.message);
  // process.exitCode, not process.exit(): an abrupt exit with child process
  // handles still open trips a libuv assertion on Windows and replaces the
  // intended status with a crash code.
  process.exitCode = 1;
}
