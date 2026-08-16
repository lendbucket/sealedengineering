// Harness preflight. Wired as `premobile-audit` and `precontrast-audit`: the
// two scripts that stand up their own `next dev`, and so need the same
// protection `npm run build` has.
//
// WHY THESE TWO AND NOT THE OTHER SPAWNERS
// ----------------------------------------
//   next dev    WRITES .next, exactly as `next build` does. Starting one while
//               a `next start` serves out of .next is the same tearing incident
//               the build guard exists to prevent, arriving through the door it
//               was not watching. These two get this file.
//
//   next start  READS .next. forms-audit spawns one for the live-mode leg and
//               requires the :3125 server for the prelaunch leg, so the build
//               guard would refuse it in its normal, correct workflow. It takes
//               preflight-audit.mjs instead, which is the check it actually
//               wants. A guard that fires on a safe state is the one people
//               learn to bypass.
//
// TWO MODES, BECAUSE THESE HARNESSES HAVE TWO MODES
// -------------------------------------------------
//   BASE_URL set    The harness will NOT spawn anything. A running server is
//                   the point, so refusing because one exists would cry wolf.
//                   What can still go wrong is measuring a stale build, so it
//                   gets the BUILD_ID handshake.
//
//   BASE_URL unset  The harness is about to spawn `next dev` into `.next`.
//                   Anything already holding `.next` or an audit port is a
//                   hazard, so this is the build guard, unmodified.
import { assertClearToBuild } from "./lib/build-guard.mjs";
import { checkServingCurrentBuild } from "./lib/stale-server.mjs";

const label = (process.env.npm_lifecycle_event || "preharness").replace(/^pre/, "");
const kill = process.argv.includes("--kill") || process.env.AUDIT_KILL_STALE === "1";

if (process.env.BASE_URL) {
  const result = await checkServingCurrentBuild(process.env.BASE_URL);
  if (result.ok) {
    console.log(`preflight (${label}): BASE_URL is set, ${result.message}`);
  } else {
    console.error(`\n=== ${label.toUpperCase()} PREFLIGHT FAILED ===\n\n${result.message}`);
    process.exitCode = 1;
  }
} else {
  try {
    const { skipped, killed } = assertClearToBuild({ kill, label });
    if (skipped) console.log(`[build-guard] CI or deploy environment, skipped (${label}).`);
    else if (killed) console.log(`[build-guard] cleared stale server(s), running ${label}.`);
    else console.log(`[build-guard] nothing holding .next, running ${label}.`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
