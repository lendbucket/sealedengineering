// Email template audit.
//
// Every notification this site sends is built by src/lib/email.ts and dispatched
// through Resend. This renders each one from real submission payloads, without
// a network call, and asserts the things that are invisible until an email is
// already in somebody's inbox.
//
// WHY THIS EXISTS
// ---------------
// An email template is the one surface with no page to look at, no audit
// crawling it, and no visitor to complain. The failure mode is silent: a lead
// arrives, the row is written, the notification goes out with a broken layout,
// an unescaped apostrophe rendered as an entity, or a subject line that says
// "undefined". Nobody finds out until somebody reads one carefully.
//
// It also enforces the same content rules the pages obey. An operator-facing
// email is still this brand writing, and a dollar amount or a fabricated
// credential is exactly as wrong in an inbox as on a page.
//
//   npm run email-audit
import { buildNotification, notify } from "../src/lib/email.ts";
import { BANNED_PATTERN, CLAIM_RULES, voiceAllowed } from "./lib/voice-blocklist.mjs";

/**
 * Payloads shaped like the real ones in src/app/actions.ts, including the
 * awkward characters: an apostrophe, an ampersand, and an angle bracket.
 * Those three are what break naive HTML assembly, so they are in every case.
 */
const CASES = [
  {
    name: "waitlist",
    subject: "Sealed waitlist: Dana O'Neill (Ridge & Sons)",
    replyTo: "dana@example.invalid",
    lines: [
      ["Name", "Dana O'Neill"],
      ["Email", "dana@example.invalid"],
      ["Phone", "512 555 0000"],
      ["Company", "Ridge & Sons <Roofing>"],
      ["Deliverable", "Solar Structural Letters"],
      ["City", "Lubbock"],
      ["Timeline", "Within 30 days"],
      ["Monthly volume", "6 to 20 per month"],
      ["Message", "Plan review comment says \"provide sealed letter\"."],
      ["Source", null],
      ["Campaign", undefined],
      ["Landing page", "/services/solar-structural-letters"],
    ],
  },
  {
    name: "contact",
    subject: "Sealed contact: Dana O'Neill",
    replyTo: "dana@example.invalid",
    lines: [
      ["Name", "Dana O'Neill"],
      ["Email", "dana@example.invalid"],
      ["Phone", ""],
      ["Company", null],
      ["Topic", "A question about a specific deliverable"],
      ["Message", "Underwriter condition attached."],
      ["Landing page", "/contact"],
    ],
  },
  {
    name: "application",
    subject: "Sealed field application: Dana O'Neill (Waco)",
    replyTo: "dana@example.invalid",
    lines: [
      ["Name", "Dana O'Neill"],
      ["Email", "dana@example.invalid"],
      ["Phone", "254 555 0000"],
      ["Based in", "Waco"],
      ["Applying for", "Field technician, foundation and elevation surveys"],
      ["Availability", "Full time"],
      ["Reliable transport", "Yes"],
      ["Experience", "Six years framing."],
      ["Anything else", null],
    ],
  },
  {
    name: "order",
    subject: "Sealed order: Solar Structural Letters (Lubbock)",
    replyTo: "dana@example.invalid",
    lines: [
      ["Reference", "A1B2C3D4"],
      ["Deliverable", "Solar Structural Letters"],
      ["Contact", "Dana O'Neill"],
      ["Email", "dana@example.invalid"],
      ["Phone", "806 555 0000"],
      ["Company", "Ridge & Sons"],
      ["Property", "1 Test Street, Lubbock, TX 79401"],
      ["Rush", "No"],
      ["Files", "sealed/orders/2026-08-17/abc-plans.pdf"],
      ["Notes", "Attic photos attached."],
    ],
  },
  {
    name: "every-field-empty",
    subject: "Sealed contact: edge case",
    replyTo: null,
    // Every value falsy. The template must produce something coherent rather
    // than an empty document or the word undefined.
    lines: [
      ["Name", null],
      ["Email", undefined],
      ["Phone", ""],
      ["Message", "   "],
    ],
  },
];

const results = [];
const record = (name, ok, note = "") => {
  results.push({ name, ok, note });
  process.stdout.write(`  ${ok ? "pass" : "FAIL"}  ${name}${note ? `  (${note})` : ""}\n`);
};

// Content rules, matching the ones placeholder-audit enforces on pages.
const DASHES = /[–—]/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
const MONEY = /(?:\$\s?\d|\b\d[\d,]*\s?(?:dollars|USD)\b)/i;

/**
 * Capture what notify() would send instead of sending it.
 *
 * RESEND_API_KEY is deliberately cleared. lib/email.ts treats a missing key as
 * "log and skip", which means the real send path is never reached and no audit
 * run can put mail in anybody's inbox. What is under test is the assembly of
 * subject, text, and html, which happens before that branch.
 */
delete process.env.RESEND_API_KEY;

let captured = [];
const originalWarn = console.warn;
console.warn = () => {};

for (const c of CASES) {
  const result = await notify({ subject: c.subject, lines: c.lines, replyTo: c.replyTo });
  captured.push({ ...c, result });
}
console.warn = originalWarn;

console.log("=== EMAIL AUDIT ===");
console.log(`${CASES.length} templates rendered offline. No mail is sent by this audit.\n`);

for (const c of captured) {
  record(
    `${c.name}: skips send when unconfigured`,
    c.result.sent === false && c.result.reason === "not configured",
    `sent=${c.result.sent} reason=${c.result.reason}`,
  );
}

/**
 * The real assembly, imported rather than mirrored.
 *
 * An earlier version of this file re-implemented the row filtering so it could
 * inspect the output. That made every assertion below a test of the copy:
 * deliberately breaking lib/email.ts left this audit green. buildNotification
 * is exported precisely so this reads the shipping code.
 */
const renderRows = (lines) => buildNotification(lines).rows;

for (const c of captured) {
  const rows = renderRows(c.lines);
  const text = rows.join("\n");

  // Falsy values must be dropped, not rendered.
  const hasNullish = /:\s*(?:null|undefined)\s*$/m.test(text);
  record(`${c.name}: drops empty fields`, !hasNullish, hasNullish ? "rendered null or undefined" : "");

  // A subject that is present, trimmed, and not absurdly long for an inbox.
  const subjectOk = Boolean(c.subject) && c.subject === c.subject.trim() && c.subject.length <= 120;
  record(
    `${c.name}: subject usable`,
    subjectOk,
    `${c.subject.length} chars`,
  );

  const noUndefinedInSubject = !/\bundefined\b|\bnull\b|\bNaN\b/.test(c.subject);
  record(`${c.name}: subject has no placeholder values`, noUndefinedInSubject);

  // Content rules.
  const body = `${c.subject}\n${text}`;
  record(`${c.name}: no em or en dashes`, !DASHES.test(body));
  record(`${c.name}: no emoji`, !EMOJI.test(body));
  record(`${c.name}: no dollar amounts`, !MONEY.test(body));

  // Playbook Part 4 item 3: the banned list is SHARED between site copy and
  // email templates so the two surfaces cannot disagree. Same module, same
  // patterns, no private copy here.
  const banned = [...body.matchAll(BANNED_PATTERN)].map((m) => m[0]).filter((m) => !voiceAllowed(m));
  record(`${c.name}: no banned phrases`, banned.length === 0, banned.join(", "));

  const claims = [];
  for (const rule of CLAIM_RULES) {
    for (const m of body.matchAll(rule.pattern)) claims.push(`${rule.id}: ${m[0]}`);
  }
  record(`${c.name}: no guarantee or claim language`, claims.length === 0, claims.join("; "));

  if (c.name === "every-field-empty") {
    // The degenerate case. Zero rows is acceptable; what is not acceptable is
    // the template throwing or producing the string "undefined".
    record(
      "every-field-empty: renders without throwing and without placeholder text",
      !/undefined|null/.test(text),
      `${rows.length} row(s)`,
    );
  } else {
    record(`${c.name}: renders at least one row`, rows.length > 0, `${rows.length} rows`);
  }
}

/**
 * The escaping check, which is the one that actually bites.
 *
 * Ridge & Sons <Roofing> contains both an ampersand and angle brackets. If the
 * html builder does not escape them, the ampersand renders as a broken entity
 * and the angle brackets are swallowed as a tag, so the operator sees a company
 * name with a word missing and no indication anything went wrong.
 */
{
  const { html } = buildNotification([["Company", "Ridge & Sons <Roofing>"]]);
  const escaped = html.includes("Ridge &amp; Sons &lt;Roofing&gt;");
  const noRawTag = !html.includes("<Roofing>");
  record("html escaping: ampersand and angle brackets escaped in real output", escaped && noRawTag);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n================ RESULT ================`);
console.log(`${results.length} checks across ${CASES.length} templates.`);
if (failed.length === 0) {
  console.log("ALL GREEN.");
  process.exitCode = 0;
} else {
  console.log(`\n${failed.length} FAILURE(S):`);
  for (const f of failed) console.log(`  - ${f.name}${f.note ? `: ${f.note}` : ""}`);
  process.exitCode = 1;
}
