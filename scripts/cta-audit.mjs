// Conversion path audit.
//
// Asserts that every indexable page offers a way to convert, that the path it
// offers is the one the current launch mode permits, and that the language
// around it is honest about whether the business is open.
//
// WHY THIS IS ITS OWN GATE
// ------------------------
// A page with no conversion path is a page that ranks and earns nothing, and
// it is invisible in every other check: it renders, it scores 100 on SEO, it
// passes contrast, and it quietly wastes every visitor it attracts. The
// failure has no symptom.
//
// The launch-mode half is not a marketing concern. In prelaunch a CTA that
// reads "Order now" is the site stating it is open for engineering work while
// firm registration is pending.
//
//   BASE_URL=http://localhost:3125 node scripts/cta-audit.mjs
const BASE = process.env.BASE_URL || "http://localhost:3125";
const LAUNCH_MODE = (process.env.LAUNCH_MODE || "prelaunch").trim().toLowerCase();
const IS_LIVE = LAUNCH_MODE === "live";

const CONVERSION_PATH = IS_LIVE ? "/order" : "/waitlist";
const FORBIDDEN_PATH = IS_LIVE ? "/waitlist" : "/order";
const EXPECTED_LABEL = IS_LIVE ? "Order now" : "Join the waitlist";

/**
 * Pages that are themselves the conversion path, or that are legal text where
 * a CTA would be inappropriate. Each needs a reason.
 */
const EXEMPT = {
  "/waitlist": "This page is the conversion path. Its form is the CTA.",
  "/order": "This page is the conversion path. Its form is the CTA.",
  "/privacy": "Legal text. A conversion prompt inside a privacy policy is a dark pattern.",
  "/terms": "Legal text, same reason.",
  "/contact": "The contact form is the conversion path on this page.",
  "/careers":
    "A routing stub for hiring, which the keyword registry assigns to 254 Engineering Services. Its only action is an outbound link to that firm, and a waitlist prompt on a hiring page would be a non sequitur.",
};

const problems = [];
const note = (route, message) => problems.push({ route, message });

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
}

function textOf(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Just the main element, so header and footer chrome do not satisfy the check. */
function mainOf(html) {
  const m = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : "";
}

const sm = await get("/sitemap.xml");
if (sm.status !== 200) {
  console.error(`cta-audit: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const routes = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(/^https:\/\/sealedengineering\.com/, "") || "/",
  );

  if (routes.length === 0) {
    console.error("cta-audit: sitemap contained no URLs; refusing to pass on zero routes");
    process.exitCode = 1;
  } else {
    let checked = 0;
    let exempted = 0;

    for (const route of routes) {
      const { status, html } = await get(route);
      if (status !== 200) {
        note(route, `unreachable: HTTP ${status}`);
        continue;
      }

      const main = mainOf(html);
      if (!main) {
        note(route, "no <main> element, so the conversion path cannot be located");
        continue;
      }

      // The forbidden path must not be linked from anywhere, on any page,
      // including the exempt ones. In prelaunch a link to /order is a link to
      // a redirect at best and an invitation to transact at worst.
      const linksToForbidden = new RegExp(`href="${FORBIDDEN_PATH}(?:[/?#"]|")`).test(html);
      if (linksToForbidden) {
        note(route, `links to ${FORBIDDEN_PATH}, which is not the conversion path in ${LAUNCH_MODE} mode`);
      }

      if (EXEMPT[route]) {
        exempted++;
        continue;
      }
      checked++;

      // At least one link to the conversion path, inside main.
      const ctaLinks = [...main.matchAll(new RegExp(`href="${CONVERSION_PATH}(?:\\?[^"]*)?"`, "g"))];
      if (ctaLinks.length === 0) {
        note(route, `no link to ${CONVERSION_PATH} inside <main>`);
        continue;
      }

      // And the label has to say the right thing for the mode.
      const mainText = textOf(main);
      if (!mainText.includes(EXPECTED_LABEL)) {
        note(route, `no CTA reading "${EXPECTED_LABEL}" in <main>`);
      }

      // In prelaunch, the page must also disclose that ordering is not open.
      // A waitlist button with no explanation is a waitlist for something the
      // visitor reasonably believes is already running.
      if (!IS_LIVE) {
        const discloses =
          mainText.includes("Firm registration is pending") ||
          mainText.includes("not yet accepting orders") ||
          mainText.includes("Opening soon");
        if (!discloses) {
          note(route, "prelaunch page offers a waitlist CTA without disclosing that ordering is not open");
        }
      }
    }

    console.log("=== CTA AUDIT ===");
    console.log(
      `${routes.length} sitemap routes against ${BASE} in ${LAUNCH_MODE} mode: ` +
        `${checked} checked, ${exempted} exempt by design.`,
    );
    console.log(`conversion path: ${CONVERSION_PATH} labelled "${EXPECTED_LABEL}"`);

    if (problems.length === 0) {
      console.log("\nPASS: every page offers the launch-mode-correct conversion path and discloses status.");
      for (const [path, why] of Object.entries(EXEMPT)) console.log(`  exempt ${path}: ${why}`);
    } else {
      console.log(`\nFAIL: ${problems.length} problem(s):`);
      for (const p of problems) console.log(`  ${p.route}\n    ${p.message}`);
      process.exitCode = 1;
    }
  }
}
