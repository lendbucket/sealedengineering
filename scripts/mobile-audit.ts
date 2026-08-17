/**
 * Runtime mobile audit harness.
 *
 * Stands up `next dev`, drives Chromium through every template at
 * 320/375/390/430px, and asserts three things:
 *
 *   1. document.documentElement.scrollWidth === clientWidth. Zero horizontal
 *      scroll. This is the assertion that catches a long unbroken string, a
 *      table, or a fixed width that a desktop review never sees.
 *   2. Every interactive control is at least 44px on its shortest side, which
 *      is the WCAG 2.5.5 target size most often missed on a phone.
 *   3. The mobile drawer opens, locks body scroll, closes on navigation, and
 *      restores scroll afterwards.
 *
 *   npm run mobile-audit
 *   BASE_URL=http://localhost:3125 npm run mobile-audit
 */
import { chromium, type Browser } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { OK_TEMPLATES } from "./lib/targets.mjs";

const WIDTHS = [320, 375, 390, 430];
const HEIGHT = 844;
const PORT = Number(process.env.MOBILE_PORT || 3123);
/** WCAG 2.5.5 Target Size (Enhanced) is 44 CSS pixels. */
const MIN_TARGET = 44;

type Cell = { hscroll: boolean; targets: boolean; note: string };
type Row = { name: string; cells: Record<number, Cell> };

function log(msg: string) {
  process.stdout.write(msg + "\n");
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

async function measurePage(
  base: string,
  browser: Browser,
  url: string,
  width: number,
): Promise<Cell> {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT } });
  const page = await context.newPage();
  try {
    const res = await page.goto(base + url, { waitUntil: "networkidle", timeout: 120_000 });
    if (!res || res.status() >= 400) {
      return { hscroll: false, targets: false, note: `HTTP ${res ? res.status() : "no response"}` };
    }

    // Scroll to the bottom before measuring. globals.css sets scroll-behavior:
    // smooth, so behavior must be forced to instant or the measurement lands
    // mid-flight and reports a height nobody has.
    await page.evaluate(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, left: 0, behavior: "instant" as ScrollBehavior });
    });
    await page.waitForTimeout(150);

    const m = await page.evaluate((min) => {
      const de = document.documentElement;

      // Name the widest offender rather than only reporting that overflow
      // exists. "scrollW 412 != clientW 390" sends somebody hunting; the
      // element that is 412 wide ends the hunt.
      let widest: { tag: string; cls: string; w: number } | null = null;
      if (de.scrollWidth > de.clientWidth) {
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && (!widest || r.right > widest.w)) {
            widest = {
              tag: el.tagName.toLowerCase(),
              cls: (el.className || "").toString().slice(0, 70),
              w: Math.round(r.right),
            };
          }
        }
      }

      // Only controls that are actually visible and actually interactive.
      //
      // The exemptions below are each a specific thing WCAG 2.5.5 does not ask
      // for. They are written as named cases rather than as a size threshold,
      // because a threshold that quietly swallows a real 40px button is how a
      // check stops being one.
      const small: string[] = [];
      const controls = document.querySelectorAll<HTMLElement>(
        'a[href], button, input:not([type="hidden"]), select, textarea, summary',
      );
      for (const el of Array.from(controls)) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;

        // Anything inside an aria-hidden container is not offered to the user
        // at all. The honeypot lives there by design.
        if (el.closest('[aria-hidden="true"]')) continue;

        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;

        // Visually hidden until focused: the skip link is clipped to a single
        // pixel and grows to a real target the moment a keyboard reaches it,
        // which is exactly the intended behaviour rather than a small target.
        if (r.width <= 1 || r.height <= 1) continue;

        // Inline links inside flowing text are exempt under WCAG 2.5.5, and
        // that is not a loophole: an underlined word in a sentence has no
        // other sensible size, and inflating it would break the sentence.
        if (el.tagName === "A" && el.closest("p, li, dd, .prose")) continue;

        // A radio or checkbox is operated through its label. Measuring the
        // 16px dot rather than the row the user actually taps would report a
        // failure that does not exist, so the enclosing label is measured
        // instead where there is one.
        const type = el.getAttribute("type");
        let box = r;
        if (type === "radio" || type === "checkbox") {
          const label = el.closest("label");
          if (label) box = label.getBoundingClientRect();
        }

        if (box.width < min || box.height < min) {
          small.push(
            `${el.tagName.toLowerCase()}"${(el.textContent || "").trim().slice(0, 24)}" ` +
              `${Math.round(box.width)}x${Math.round(box.height)}`,
          );
        }
      }

      return {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        widest,
        small: small.slice(0, 4),
        smallCount: small.length,
      };
    }, MIN_TARGET);

    const hscroll = m.scrollWidth === m.clientWidth;
    const targets = m.smallCount === 0;
    const notes: string[] = [];
    if (!hscroll) {
      notes.push(
        `scrollW ${m.scrollWidth} != clientW ${m.clientWidth}` +
          (m.widest ? ` (widest: <${m.widest.tag} class="${m.widest.cls}"> reaches ${m.widest.w})` : ""),
      );
    }
    if (!targets) {
      notes.push(`${m.smallCount} control(s) under ${MIN_TARGET}px: ${m.small.join("; ")}`);
    }
    return { hscroll, targets, note: notes.join("; ") };
  } catch (err) {
    return { hscroll: false, targets: false, note: `error: ${(err as Error).message.split("\n")[0]}` };
  } finally {
    await context.close();
  }
}

type MenuResult = { opened: boolean; locked: boolean; closed: boolean; restored: boolean; note: string };

async function checkMenu(base: string, browser: Browser): Promise<MenuResult> {
  const context = await browser.newContext({ viewport: { width: 375, height: HEIGHT } });
  const page = await context.newPage();
  try {
    await page.goto(base + "/", { waitUntil: "networkidle", timeout: 120_000 });
    const openBtn = page.locator('button[aria-label="Open menu"]');
    await openBtn.waitFor({ state: "visible", timeout: 15_000 });
    // Hydration has to finish or the click hits markup with no handler on it.
    await page.waitForTimeout(1500);
    await openBtn.click({ timeout: 10_000 });

    const menu = page.locator('[data-testid="mobile-menu"]');
    await menu.waitFor({ state: "visible", timeout: 5_000 });
    const opened = true;
    const locked = (await page.evaluate(() => getComputedStyle(document.body).overflow)) === "hidden";

    await menu.locator("a", { hasText: "Services" }).first().click({ timeout: 10_000 });
    await page.waitForURL("**/services", { timeout: 20_000 });

    // waitFor detached rather than counting immediately. The drawer closes in
    // an effect that runs after the navigation commits, so sampling the count
    // the instant waitForURL resolves reports a failure that is really a race
    // in the harness. A wait with a deadline still fails a drawer that genuinely
    // never closes; it just stops failing one that closes a frame later.
    let closed = true;
    try {
      await page.locator('[data-testid="mobile-menu"]').waitFor({ state: "detached", timeout: 5_000 });
    } catch {
      closed = false;
    }
    const restored = (await page.evaluate(() => getComputedStyle(document.body).overflow)) !== "hidden";

    return { opened, locked, closed, restored, note: closed ? "" : "drawer still present after navigating" };
  } catch (err) {
    return {
      opened: false,
      locked: false,
      closed: false,
      restored: false,
      note: `error: ${(err as Error).message.split("\n")[0]}`,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const externalBase = process.env.BASE_URL;
  let server: { base: string; stop: () => Promise<void> } | null = null;
  let base = externalBase;

  try {
    if (externalBase) {
      log(`Using ${externalBase} (BASE_URL is set).\n`);
    } else {
      log(`Starting next dev on port ${PORT} ...`);
      server = await startNextServer({ port: PORT, command: "dev", timeoutMs: 180_000 });
      base = server.base;
    }
    log(`Server ready at ${base}\n`);

    const browser = await chromium.launch();
    const rows: Row[] = [];
    const failures: string[] = [];

    for (const t of OK_TEMPLATES) {
      const cells: Record<number, Cell> = {};
      for (const w of WIDTHS) {
        cells[w] = await measurePage(base as string, browser, t.path, w);
        const c = cells[w];
        log(
          `  ${pad(t.name, 24)} @${w}: hscroll=${c.hscroll ? "ok" : "FAIL"} targets=${c.targets ? "ok" : "FAIL"}` +
            `${c.note ? "  (" + c.note + ")" : ""}`,
        );
      }
      rows.push({ name: t.name, cells });
    }

    log("\nChecking mobile menu (open / body-scroll lock / close on navigate) ...");
    const menu = await checkMenu(base as string, browser);
    await browser.close();

    log("\n================ MOBILE AUDIT: template x width ================");
    const header = pad("template", 26) + WIDTHS.map((w) => pad(String(w), 10)).join("");
    log(header);
    log("-".repeat(header.length));
    for (const row of rows) {
      let line = pad(row.name, 26);
      for (const w of WIDTHS) {
        const c = row.cells[w];
        const ok = c.hscroll && c.targets;
        line += pad(ok ? "pass" : "FAIL", 10);
        if (!ok) failures.push(`${row.name} @${w}: ${c.note || "fail"}`);
      }
      log(line);
    }

    log("\n================ MOBILE MENU ================");
    log(`  opens:                 ${menu.opened ? "pass" : "FAIL"}`);
    log(`  body scroll locked:    ${menu.locked ? "pass" : "FAIL"}`);
    log(`  closes on navigate:    ${menu.closed ? "pass" : "FAIL"}`);
    log(`  body scroll restored:  ${menu.restored ? "pass" : "FAIL"}`);
    if (menu.note) log(`  note: ${menu.note}`);
    if (!(menu.opened && menu.locked && menu.closed && menu.restored)) {
      failures.push(`menu: ${menu.note || "one or more menu checks failed"}`);
    }

    log("\n================ RESULT ================");
    if (failures.length === 0) {
      log(`ALL GREEN. Zero horizontal scroll and no undersized targets across ${rows.length} templates.`);
      process.exitCode = 0;
    } else {
      log(`${failures.length} FAILURE(S):`);
      failures.forEach((f) => log("  - " + f));
      process.exitCode = 1;
    }
  } catch (err) {
    log(`Harness error: ${(err as Error).message}`);
    process.exitCode = 1;
  } finally {
    if (server) await server.stop();
  }
}

main();
