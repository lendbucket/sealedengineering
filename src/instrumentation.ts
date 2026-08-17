/**
 * Startup guard: refuse to serve an artifact whose launch mode does not match
 * the environment it was started in.
 *
 * WHY THIS IS NOT PARANOIA
 * ------------------------
 * Almost every page here is statically prerendered, and the footer's licensure
 * disclosure is rendered into each one at build time. `next.config.ts` inlines
 * the build's LAUNCH_MODE as BUILD_LAUNCH_MODE; the running process reads
 * LAUNCH_MODE fresh. When those disagree, the site does something worse than
 * break: it works, while telling two different stories.
 *
 *   build prelaunch + run live   Ordering activates. Fifty prerendered pages
 *                                still say firm registration is pending, and
 *                                the footer disclosure is wrong sitewide.
 *   build live + run prelaunch   The footer publishes a TBPELS firm number on
 *                                a site whose order flow refuses every request.
 *
 * The first is a licensure disclosure failure. Nothing about it is visible in
 * a smoke check, because every page returns 200 and looks finished.
 *
 * `npm run forms-audit` found the same class of bug one level up, in the
 * /order and /waitlist redirect pair, which is why this exists rather than a
 * note in the README asking people to remember.
 *
 * Failing at startup is deliberate. A deploy that does not come up is a page
 * somebody fixes in ten minutes. A deploy that comes up wrong is one nobody
 * notices until it matters.
 */
export async function register() {
  // Only the Node.js server runtime. The edge runtime registers separately and
  // has no business deciding whether the deployment is coherent.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const built = (process.env.BUILD_LAUNCH_MODE || "prelaunch").trim().toLowerCase();
  const running = (process.env.LAUNCH_MODE || "prelaunch").trim().toLowerCase();

  if (built === running) return;

  /**
   * The one deliberate exception, for scripts/forms-audit.mjs.
   *
   * The audit has to exercise the live order flow, and building the site twice
   * inside an audit run would put a two minute build in the middle of a check
   * people are supposed to run often. So it starts a live server against a
   * prelaunch build with this set, and asserts separately that a server
   * WITHOUT it refuses to start. That second assertion is what keeps this
   * escape hatch honest.
   */
  if (process.env.ALLOW_LAUNCH_MODE_MISMATCH === "1") {
    console.warn(
      `[launch] LAUNCH_MODE=${running} against a build made with ${built}. ` +
        `Allowed by ALLOW_LAUNCH_MODE_MISMATCH=1. Statically prerendered pages, ` +
        `including the footer disclosure, still reflect ${built}.`,
    );
    return;
  }

  const message =
    `\n=== LAUNCH MODE MISMATCH: REFUSING TO SERVE ===\n\n` +
    `This artifact was built with LAUNCH_MODE=${built} and the process was started with\n` +
    `LAUNCH_MODE=${running}.\n\n` +
    `Nearly every page on this site is statically prerendered, and the footer's licensure\n` +
    `disclosure is baked into each one at build time. Serving this combination would\n` +
    `activate one launch mode's behaviour while displaying the other's disclosure, which\n` +
    `is exactly the failure the compliance gate exists to prevent.\n\n` +
    `Fix it by rebuilding with the launch mode you intend to run:\n` +
    `  LAUNCH_MODE=${running} npm run build\n\n` +
    `On Vercel, change the environment variable and redeploy. Changing it without a new\n` +
    `deployment is what produces this state.\n`;

  console.error(message);

  // Exiting rather than throwing. A thrown error in register() is logged and
  // the server keeps serving, which would turn a fatal misconfiguration into a
  // warning nobody reads.
  //
  // Reached through globalThis rather than as a bare `process.exit` because
  // instrumentation.ts is compiled for both runtimes, and the bundler's static
  // scan flags the Node-only API even though the guard above means the edge
  // runtime returns three lines earlier. The indirection keeps the build output
  // free of a warning that would be a false positive.
  const nodeProcess = globalThis.process as unknown as { exit: (code: number) => never };
  nodeProcess.exit(1);
}
