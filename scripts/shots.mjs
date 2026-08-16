// Screenshot harness. Shoots every requested route at 390 (phone) and 1280
// (laptop), which are the two widths this repo reviews at.
//
//   BASE_URL=http://localhost:3125 node scripts/shots.mjs /
//   node scripts/shots.mjs / /services /texas/houston      (spawns its own dev server)
//
// Full-page by default. SHOT_FOLD=1 captures the viewport only, which is what
// you want when reviewing a hero rather than a whole page.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";

const WIDTHS = [390, 1280];
const HEIGHT = 900;
const PORT = Number(process.env.SHOT_PORT || 3128);
const OUT = process.env.SHOT_DIR || "screenshots";

const routes = process.argv.slice(2);
if (routes.length === 0) routes.push("/");

const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/[\/?=&]/g, "-"));

let server = null;
let base = process.env.BASE_URL;

try {
  if (!base) {
    console.log(`Starting next dev on port ${PORT} ...`);
    server = await startNextServer({ port: PORT, command: "dev" });
    base = server.base;
  }
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  for (const route of routes) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: HEIGHT },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      const res = await page.goto(base + route, { waitUntil: "networkidle", timeout: 120000 });
      if (!res || res.status() >= 400) {
        console.log(`  ${route} @${width}: HTTP ${res ? res.status() : "no response"}`);
        await context.close();
        continue;
      }
      // next/font swaps in after first paint; a shot taken too early captures
      // the fallback face and misrepresents the typography being reviewed.
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      const file = path.join(OUT, `${slug(route)}-${width}.png`);
      await page.screenshot({ path: file, fullPage: !process.env.SHOT_FOLD });
      console.log(`  wrote ${file}`);
      await context.close();
    }
  }
  await browser.close();
} catch (err) {
  console.error(`shots: ${err.message}`);
  process.exitCode = 1;
} finally {
  if (server) await server.stop();
}
