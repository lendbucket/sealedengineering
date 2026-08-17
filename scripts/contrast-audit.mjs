/**
 * Runtime contrast and accessibility audit.
 *
 * Stands up `next dev`, loads every template at a mobile (390px) and a desktop
 * (1280px) viewport, injects axe-core, and runs the WCAG 2.1 A/AA ruleset.
 *
 * Contrast is broken out into its own section with the exact foreground,
 * background, and ratio for every failing node, because the palette was chosen
 * against the AA floor and this is the check that proves the browser agrees
 * with the intent. Everything else axe finds is listed underneath, so this
 * doubles as a general accessibility gate rather than only a colour one.
 *
 *   npm run contrast-audit
 *   BASE_URL=http://localhost:3125 npm run contrast-audit   # use a running server
 *
 * The two interactive states that a crawl cannot reach, the open mobile drawer
 * and a form showing validation errors, are audited explicitly. A menu that is
 * closed has no contrast to measure, and an audit that reports a pass on a
 * component it never rendered is the false green worth guarding against.
 */
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { TEMPLATES } from "./lib/targets.mjs";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const WIDTHS = [390, 1280];
const HEIGHT = 900;
const PORT = Number(process.env.CONTRAST_PORT || 3124);

/**
 * States reached by interacting rather than by navigating.
 *
 * `only` restricts a state to widths where it exists: the drawer is hidden
 * above the lg breakpoint, so auditing it at 1280 would measure nothing and
 * report a pass.
 */
const STATES = [
  {
    name: "mobile menu open",
    path: "/",
    only: [390],
    async prepare(page) {
      const open = page.locator('button[aria-label="Open menu"]');
      await open.waitFor({ state: "visible", timeout: 10_000 });
      // Let hydration settle, or the click lands on markup with no handler yet.
      await page.waitForTimeout(1200);
      await open.click({ timeout: 10_000 });
      await page.locator('[data-testid="mobile-menu"]').waitFor({ state: "visible", timeout: 5000 });
    },
  },
  {
    name: "waitlist errors",
    path: "/waitlist",
    async prepare(page) {
      await page.waitForTimeout(1200);
      // Submitting empty is the fastest route to every error style at once:
      // the red borders, the message text, and the aria-describedby wiring.
      await page.getByRole("button", { name: /join the waitlist/i }).last().click({ timeout: 10_000 });
      await page.locator("#name-error").waitFor({ state: "visible", timeout: 10_000 });
    },
  },
  {
    name: "careers errors",
    path: "/careers",
    async prepare(page) {
      await page.waitForTimeout(1200);
      await page.getByRole("button", { name: /send application/i }).click({ timeout: 10_000 });
      await page.locator("#name-error").waitFor({ state: "visible", timeout: 10_000 });
    },
  },
  {
    name: "faq open",
    path: "/services/solar-structural-letters",
    async prepare(page) {
      // details/summary needs no JavaScript, so no hydration wait is required.
      const summaries = page.locator("details > summary");
      const n = await summaries.count();
      for (let i = 0; i < n; i++) await summaries.nth(i).click();
      await page.waitForTimeout(200);
    },
  },
];

function log(msg) {
  process.stdout.write(msg + "\n");
}

async function auditPage(browser, base, t, width) {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT } });
  const page = await context.newPage();
  try {
    const res = await page.goto(base + t.path, { waitUntil: "networkidle", timeout: 120_000 });
    // The 404 template is a real page at HTTP 404 and is audited on purpose.
    const expected = t.name === "404" ? 404 : 200;
    if (!res || res.status() !== expected) {
      return { error: `HTTP ${res ? res.status() : "no response"}, expected ${expected}`, contrast: [], other: [] };
    }

    if (t.prepare) {
      try {
        await t.prepare(page);
      } catch (err) {
        // A state that could not be reached is an error, never a pass. This is
        // the specific false green this harness exists to prevent: auditing the
        // page behind an unopened drawer and reporting it clean.
        return {
          error: `could not reach state: ${String(err.message).split("\n")[0]}`,
          contrast: [],
          other: [],
        };
      }
    }

    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      return await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        resultTypes: ["violations"],
      });
    });

    const contrast = [];
    const other = [];
    for (const v of result.violations) {
      const bucket = v.id === "color-contrast" ? contrast : other;
      for (const node of v.nodes) {
        bucket.push({
          id: v.id,
          impact: node.impact || v.impact || "",
          target: Array.isArray(node.target) ? node.target.join(" ") : String(node.target),
          summary: node.failureSummary ? node.failureSummary.replace(/\s+/g, " ").trim() : "",
          data: node.any?.[0]?.data || null,
        });
      }
    }
    return { error: null, contrast, other };
  } catch (err) {
    return { error: `error: ${String(err.message).split("\n")[0]}`, contrast: [], other: [] };
  } finally {
    await context.close();
  }
}

function fmtContrast(n) {
  const d = n.data;
  if (d && d.fgColor && d.bgColor) {
    const ratio = d.contrastRatio != null ? `${d.contrastRatio}:1` : "?";
    const need = d.expectedContrastRatio || "?";
    return (
      `${n.target}\n      fg ${d.fgColor} on bg ${d.bgColor} - ratio ${ratio}, needs ${need}` +
      `${d.fontSize ? ` (${d.fontSize}, ${d.fontWeight})` : ""}`
    );
  }
  return `${n.target} - ${n.summary}`;
}

async function main() {
  const externalBase = process.env.BASE_URL;
  let server = null;
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
    // Dedupe identical (template, target, colours) hits across widths, so the
    // summary counts distinct problems rather than viewport repeats.
    const contrastSeen = new Map();
    const otherSeen = new Map();
    let pageErrors = 0;

    const all = [...TEMPLATES, ...STATES];
    for (const t of all) {
      for (const w of WIDTHS) {
        if (t.only && !t.only.includes(w)) continue;
        const r = await auditPage(browser, base, t, w);
        if (r.error) {
          log(`  ${t.name} @${w}: ${r.error}`);
          pageErrors++;
          continue;
        }
        const cN = r.contrast.length;
        const oN = r.other.length;
        log(
          `  ${t.name} @${w}: contrast=${cN === 0 ? "ok" : cN + " FAIL"}  other-a11y=${oN === 0 ? "ok" : oN + " FAIL"}`,
        );
        for (const n of r.contrast) {
          const key = `${t.name}|${n.target}|${n.data?.fgColor}|${n.data?.bgColor}`;
          if (!contrastSeen.has(key)) contrastSeen.set(key, { template: t.name, ...n });
        }
        for (const n of r.other) {
          const key = `${t.name}|${n.id}|${n.target}`;
          if (!otherSeen.has(key)) otherSeen.set(key, { template: t.name, ...n });
        }
      }
    }
    await browser.close();

    log("\n================ COLOR CONTRAST (WCAG AA) ================");
    if (contrastSeen.size === 0) {
      log("  PASS: no color-contrast violations on any template or state.");
    } else {
      log(`  ${contrastSeen.size} distinct contrast violation(s):`);
      for (const n of contrastSeen.values()) log(`  - [${n.template}] ${fmtContrast(n)}`);
    }

    log("\n================ OTHER A11Y (WCAG A/AA) ================");
    if (otherSeen.size === 0) {
      log("  PASS: no other WCAG A/AA violations on any template or state.");
    } else {
      log(`  ${otherSeen.size} distinct violation(s):`);
      for (const n of otherSeen.values()) log(`  - [${n.template}] ${n.id} (${n.impact}): ${n.target}`);
    }

    const total = contrastSeen.size + otherSeen.size;
    log("\n================ RESULT ================");
    log(`${TEMPLATES.length} templates plus ${STATES.length} interactive states, at ${WIDTHS.join(" and ")}px.`);
    if (total === 0 && pageErrors === 0) {
      log("ALL GREEN. No WCAG A/AA violations.");
      process.exitCode = 0;
    } else {
      log(
        `${contrastSeen.size} contrast + ${otherSeen.size} other violation(s)` +
          `${pageErrors ? `, ${pageErrors} page error(s)` : ""}.`,
      );
      process.exitCode = 1;
    }
  } catch (err) {
    log(`Harness error: ${err.message}`);
    process.exitCode = 1;
  } finally {
    if (server) await server.stop();
  }
}

main();
