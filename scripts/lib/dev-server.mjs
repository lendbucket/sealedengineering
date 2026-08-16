import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Boot and reliably tear down a Next server for a harness to drive.
 *
 * WHY THIS IS A MODULE AND NOT FOUR LINES INLINE
 * ----------------------------------------------
 * Two failure modes, both of which produce a run that reports a result about a
 * server nobody meant to test:
 *
 *   1. `server.kill()` does not stop `next start` on Windows. The child is a
 *      shell, so killing it kills the shell and orphans the node process
 *      holding the port.
 *
 *   2. A naive `waitForServer` treats any answer on the port as success.
 *      Combined with (1), a fresh run whose own server failed to bind silently
 *      attaches to the orphan, an older build pointed at different config, and
 *      reports whatever that stranger happened to do.
 *
 * So: refuse to start if the port is taken, and kill the whole process tree.
 */

/**
 * Resolves true when nothing answers at `url`.
 *
 * Deliberately a connect probe and not a bind probe. On Windows a stray server
 * can hold the port on IPv6 while `localhost` resolves to ::1 first, so a probe
 * that binds 127.0.0.1 succeeds while every request the harness makes still
 * reaches the stranger. Asking the same question the harness asks, over the
 * same name resolution, is the only probe that cannot disagree with it.
 */
async function nothingAnswersAt(url) {
  try {
    await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(2000) });
    return false;
  } catch {
    return true;
  }
}

async function waitForServer(url, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} never came up.`);
}

/**
 * Start a Next server on `port` with `env` layered over the current
 * environment. Returns the base URL and a stop() that actually stops it.
 *
 * `command` picks `next start` (the default, for a harness driving a built app)
 * or `next dev`. contrast-audit uses dev deliberately: it reads CSS the browser
 * computes, so a production bundle buys it nothing and costs a build step.
 */
export async function startNextServer({ port, env = {}, timeoutMs = 150000, command = "start" }) {
  const base = `http://localhost:${port}`;

  if (!(await nothingAnswersAt(`${base}/`))) {
    throw new Error(
      `Something is already serving ${base}. Refusing to start, because ` +
        `attaching to whatever is there would report results about the wrong ` +
        `server. Stop it and re-run.`,
    );
  }

  // The server's own output goes to a file, not to /dev/null. A harness that
  // silences the one process that knows why a page failed turns a clear server
  // error into an inscrutable Playwright timeout.
  const logDir = process.env.AUDIT_LOG_DIR || os.tmpdir();
  fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, `next-${command}-${port}.log`);
  const log = fs.openSync(logPath, "w");
  console.log(`  [dev-server] port ${port} logging to ${logPath}`);

  const child = spawn("npx", ["next", command, "-p", String(port)], {
    env: { ...process.env, ...env },
    stdio: ["ignore", log, log],
    shell: process.platform === "win32",
  });

  try {
    await waitForServer(`${base}/`, timeoutMs);
  } catch (err) {
    await stopTree(child);
    throw new Error(`${err.message}\n\nLast lines of ${logPath}:\n${tailOf(logPath)}`);
  } finally {
    fs.closeSync(log);
  }

  return { base, logPath, stop: () => stopTree(child) };
}

/** Last `lines` of a log file, for pasting into an error. Never throws. */
function tailOf(file, lines = 25) {
  try {
    return fs.readFileSync(file, "utf8").trimEnd().split(/\r?\n/).slice(-lines).join("\n") || "(empty)";
  } catch {
    return "(log unreadable)";
  }
}

/**
 * Kill a child and everything it spawned.
 *
 * On Windows `taskkill /T` is what walks the tree; killing the shell alone
 * would leave the server behind.
 */
function stopTree(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();

    if (process.platform === "win32" && child.pid) {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      killer.on("exit", () => resolve());
      killer.on("error", () => {
        child.kill();
        resolve();
      });
      return;
    }

    child.once("exit", () => resolve());
    child.kill();
    setTimeout(resolve, 5000).unref?.();
  });
}
