// Lighthouse SEO-category audit across every template and a broad sample of
// pages. Asserts the SEO score is 100 everywhere.
//
// SEO category only rather than the full Lighthouse run, so it can cover twenty
// plus pages in one pass and still finish in a coffee break. Performance and
// best-practices are worth measuring and are not what this gate is for: the
// master prompt names metadata and titles as the single highest priority, and a
// gate that mixes them with a flaky performance number is a gate people learn
// to ignore.
//
//   BASE_URL=http://localhost:3125 node scripts/seo-audit.mjs
import { chromium } from "playwright";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { OK_TEMPLATES } from "./lib/targets.mjs";

const BASE = process.env.BASE_URL || "http://localhost:3125";

const chromePath = chromium.executablePath();
const chrome = await chromeLauncher.launch({
  chromePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const rows = [];
for (const { name, path } of OK_TEMPLATES) {
  try {
    const result = await lighthouse(
      `${BASE}${path}`,
      { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["seo"] },
      {
        extends: "lighthouse:default",
        settings: {
          formFactor: "mobile",
          screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false },
        },
      },
    );
    const seo = Math.round(result.lhr.categories.seo.score * 100);
    // Name the failing audits rather than only the score. A score without the
    // reason sends somebody to open a report by hand, which is the step that
    // makes an audit feel expensive to run.
    const failed = Object.values(result.lhr.audits)
      .filter(
        (a) =>
          a.score !== null &&
          a.score < 1 &&
          result.lhr.categories.seo.auditRefs.some((r) => r.id === a.id && r.weight > 0),
      )
      .map((a) => a.id);
    rows.push({ name, path, seo, failed });
  } catch (err) {
    rows.push({ name, path, seo: 0, failed: [`error: ${String(err.message).split("\n")[0]}`] });
  }
}

console.log("=== LIGHTHOUSE SEO (mobile) ===");
console.log(`base: ${BASE}\n`);
console.log("page\tpath\tSEO");
for (const r of rows) {
  console.log(`${r.name}\t${r.path}\t${r.seo}${r.failed.length ? `\t<- ${r.failed.join(", ")}` : ""}`);
}

const under = rows.filter((r) => r.seo < 100);
console.log(
  under.length
    ? `\n${under.length}/${rows.length} page(s) below SEO 100:\n${under
        .map((r) => `  ${r.path}: ${r.seo} (${r.failed.join(", ") || "see report"})`)
        .join("\n")}`
    : `\nPASS: all ${rows.length} sampled pages score SEO 100.`,
);

try {
  await chrome.kill();
} catch {
  // Nothing useful to do about a browser that already exited.
}
// process.exitCode rather than process.exit(): an abrupt exit with sockets from
// the run still open trips a libuv assertion on Windows and replaces the
// intended status with a crash code.
process.exitCode = under.length ? 1 : 0;
