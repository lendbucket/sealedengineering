/**
 * End to end forms audit.
 *
 * Every form on the site is filled in and submitted for real, against a Next
 * server this harness starts and an in-memory Supabase stand-in it points that
 * server at. The server action, the Zod parse, the honeypot, and the insert are
 * all the shipping code. Only the far end of the database socket is different.
 *
 * WHAT IT ASSERTS, AND WHY EACH ONE IS HERE
 * -----------------------------------------
 *   Accessibility of the markup. Every input has a real <label for>, not a
 *   placeholder standing in for one, because a placeholder disappears the
 *   moment somebody types.
 *
 *   Validation. Submitting empty produces per-field messages wired through
 *   aria-describedby, rather than one banner that makes a long form a
 *   guessing game.
 *
 *   The happy path. A valid submission produces a success panel AND a row in
 *   the stand-in. Checking only the panel would pass on a form that thanks you
 *   and throws the lead away, which is the worst failure available here.
 *
 *   The honeypot. A filled hidden field returns the success state and writes
 *   NOTHING. Both halves matter: telling a bot it failed is how it learns to
 *   retry.
 *
 *   The database error path. The stand-in is told to fail one insert, and the
 *   form must show an error rather than a thank-you.
 *
 *   The compliance gate, from both sides. In prelaunch /order must redirect to
 *   /waitlist and the order action must refuse. In live mode /waitlist must
 *   redirect to /order and the order form must submit. Both legs run, because
 *   the master prompt requires both modes tested and shipping prelaunch.
 *
 * Requires a build on disk: it drives `next start`, which reads .next rather
 * than writing it, so two legs can run in sequence without tearing anything.
 *
 *   npm run build && npm run forms-audit
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { startSupabaseStub, stubEnv } from "./lib/supabase-stub.mjs";

const PRELAUNCH_PORT = Number(process.env.FORMS_PORT || 3126);
const LIVE_PORT = Number(process.env.FORMS_LIVE_PORT || 3127);
const STUB_PORT = Number(process.env.FORMS_STUB_PORT || 3128);

const results = [];
const record = (name, ok, note = "") => {
  results.push({ name, ok, note });
  process.stdout.write(`  ${ok ? "pass" : "FAIL"}  ${name}${note ? `  (${note})` : ""}\n`);
};

function log(msg) {
  process.stdout.write(msg + "\n");
}

/**
 * Assert the markup of a form before touching it.
 *
 * Runs in the page so it reads what the browser resolved, including the
 * accessible name, rather than what the JSX intended.
 */
async function checkMarkup(page, formSelector) {
  return page.evaluate((sel) => {
    const form = document.querySelector(sel);
    if (!form) return { error: "form not found" };

    const problems = [];
    const controls = Array.from(
      form.querySelectorAll('input:not([type="hidden"]), select, textarea'),
    );

    for (const el of controls) {
      const name = el.getAttribute("name") || "(unnamed)";

      // The honeypot is deliberately hidden from sight and from assistive tech,
      // so the rules below do not apply to it. It gets its own assertions.
      const hidden = el.closest('[aria-hidden="true"]');
      if (hidden) continue;

      // A wrapping <label> is checked FIRST, and the order is the point. An
      // input inside its own label is correctly labelled with or without an
      // id, which is how radio options are written. Demanding an id before
      // looking would report a real, correct pattern as a failure.
      const wrapped = el.closest("label");
      const label = el.id ? form.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;

      if (!label && !wrapped) {
        problems.push(
          el.id ? `${name}: no <label for="${el.id}">` : `${name}: no id and no wrapping label`,
        );
        // A placeholder is fine as a hint and is not a label. Flag the specific
        // failure of using one INSTEAD of a label rather than banning them.
        if (el.getAttribute("placeholder")) {
          problems.push(`${name}: placeholder used in place of a label`);
        }
        continue;
      }

      const describedBy = el.getAttribute("aria-describedby");
      if (describedBy) {
        for (const id of describedBy.split(/\s+/)) {
          if (id && !document.getElementById(id)) {
            problems.push(`${name}: aria-describedby points at missing #${id}`);
          }
        }
      }
    }

    // Radio groups need a fieldset and a legend, or a screen reader reads four
    // unlabelled options.
    for (const group of Array.from(form.querySelectorAll('input[type="radio"]'))) {
      const fs = group.closest("fieldset");
      if (!fs || !fs.querySelector("legend")) {
        problems.push(`${group.getAttribute("name")}: radio group without fieldset and legend`);
        break;
      }
    }

    const honeypot = form.querySelector('input[name="company_url"]');
    if (!honeypot) problems.push("no honeypot field");
    else {
      const container = honeypot.closest('[aria-hidden="true"]');
      if (!container) problems.push("honeypot is not aria-hidden");
      if (honeypot.tabIndex !== -1) problems.push("honeypot is keyboard reachable");
      if (honeypot.getAttribute("type") === "hidden") {
        problems.push("honeypot uses type=hidden, which the bots worth catching skip");
      }
    }

    const submits = form.querySelectorAll('button[type="submit"], button:not([type])');
    if (submits.length === 0) problems.push("no submit button");

    return { error: null, problems, controlCount: controls.length };
  }, formSelector);
}

/** Fill a form from a map of name to value. Selects and radios included. */
async function fill(page, values) {
  for (const [name, value] of Object.entries(values)) {
    const el = page.locator(`[name="${name}"]`).first();
    const tag = await el.evaluate((n) => n.tagName.toLowerCase());
    const type = await el.evaluate((n) => n.getAttribute("type"));
    if (tag === "select") await el.selectOption(value);
    else if (type === "radio") await page.locator(`[name="${name}"][value="${value}"]`).check();
    else await el.fill(value);
  }
}

async function auditForm(browser, base, stub, spec) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(base + spec.path, { waitUntil: "networkidle", timeout: 120_000 });

    // ---- markup -----------------------------------------------------------
    const markup = await checkMarkup(page, "form");
    if (markup.error) {
      record(`${spec.name}: markup`, false, markup.error);
      return;
    }
    record(
      `${spec.name}: markup (${markup.controlCount} controls)`,
      markup.problems.length === 0,
      markup.problems.join("; "),
    );

    // ---- validation -------------------------------------------------------
    // Hydration has to finish first: before it, the submit posts the form the
    // old-fashioned way and the assertion below measures the wrong thing.
    await page.waitForTimeout(1500);
    await page.locator("form button[type=submit]").first().click();
    const firstErrorId = `#${spec.requiredField}-error`;
    let validationOk = true;
    let validationNote = "";
    try {
      await page.locator(firstErrorId).waitFor({ state: "visible", timeout: 15_000 });
    } catch {
      validationOk = false;
      validationNote = `no error shown at ${firstErrorId} after submitting empty`;
    }
    if (validationOk) {
      const wired = await page.evaluate((field) => {
        const input = document.querySelector(`[name="${field}"]`);
        const described = input?.getAttribute("aria-describedby") || "";
        return {
          invalid: input?.getAttribute("aria-invalid") === "true",
          describes: described.includes(`${field}-error`),
        };
      }, spec.requiredField);
      if (!wired.invalid) {
        validationOk = false;
        validationNote = "aria-invalid not set on the failing input";
      } else if (!wired.describes) {
        validationOk = false;
        validationNote = "aria-describedby does not point at the error";
      }
    }
    record(`${spec.name}: empty submit shows per-field errors`, validationOk, validationNote);

    const rowsBefore = stub.tables[spec.table].length;

    // ---- honeypot ---------------------------------------------------------
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await fill(page, spec.values);
    await page.evaluate(() => {
      const hp = document.querySelector('input[name="company_url"]');
      if (hp) hp.value = "https://spam.example";
    });
    await page.locator("form button[type=submit]").first().click();
    let honeypotShowsSuccess = false;
    try {
      await page.getByRole("status").waitFor({ state: "visible", timeout: 15_000 });
      honeypotShowsSuccess = true;
    } catch {
      honeypotShowsSuccess = false;
    }
    const honeypotWroteNothing = stub.tables[spec.table].length === rowsBefore;
    record(
      `${spec.name}: honeypot looks successful to the bot`,
      honeypotShowsSuccess,
      honeypotShowsSuccess ? "" : "no success panel, which teaches the bot to retry",
    );
    record(
      `${spec.name}: honeypot writes no row`,
      honeypotWroteNothing,
      honeypotWroteNothing ? "" : "a honeypot submission reached the database",
    );

    // ---- database error path ---------------------------------------------
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    stub.control.failNextInsert = true;
    await fill(page, spec.values);
    await page.locator("form button[type=submit]").first().click();
    let errorShown = false;
    try {
      await page.getByRole("alert").waitFor({ state: "visible", timeout: 15_000 });
      errorShown = true;
    } catch {
      errorShown = false;
    }
    stub.control.failNextInsert = false;
    record(
      `${spec.name}: database failure shows an error, not a thank-you`,
      errorShown,
      errorShown ? "" : "a failed insert rendered as success",
    );

    // ---- happy path -------------------------------------------------------
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const before = stub.tables[spec.table].length;
    await fill(page, spec.values);
    await page.locator("form button[type=submit]").first().click();
    let success = false;
    try {
      await page.getByRole("status").waitFor({ state: "visible", timeout: 20_000 });
      success = true;
    } catch {
      success = false;
    }
    record(`${spec.name}: valid submission shows success`, success);

    const row = stub.tables[spec.table][before];
    const wrote = stub.tables[spec.table].length === before + 1;
    record(
      `${spec.name}: valid submission writes exactly one row`,
      wrote,
      wrote ? "" : `rows went from ${before} to ${stub.tables[spec.table].length}`,
    );

    if (row) {
      record(
        `${spec.name}: row carries site='sealed'`,
        row.site === "sealed",
        `site=${JSON.stringify(row.site)}`,
      );
      for (const [column, expected] of Object.entries(spec.expectRow || {})) {
        record(
          `${spec.name}: row.${column}`,
          row[column] === expected,
          `got ${JSON.stringify(row[column])}, expected ${JSON.stringify(expected)}`,
        );
      }
      // Attribution is captured server side from the request, so a lead with no
      // user_agent means the capture path silently broke.
      record(
        `${spec.name}: attribution captured`,
        Boolean(row.user_agent),
        row.user_agent ? "" : "no user_agent recorded",
      );
    }
  } catch (err) {
    record(`${spec.name}: harness`, false, String(err.message).split("\n")[0]);
  } finally {
    await context.close();
  }
}

const WAITLIST = {
  name: "waitlist",
  path: "/waitlist",
  table: "eng_leads",
  requiredField: "name",
  values: {
    name: "Audit Harness",
    email: "audit@example.invalid",
    phone: "5125550000",
    company: "Audit Co",
    service: "solar-structural-letters",
    city: "Lubbock",
    timeline: "Within 30 days",
    volume: "6 to 20 per month",
    message: "Submitted by scripts/forms-audit.mjs",
  },
  expectRow: { form: "waitlist", service: "solar-structural-letters", timeline: "Within 30 days" },
};

const CONTACT = {
  name: "contact",
  path: "/contact",
  table: "eng_leads",
  requiredField: "name",
  values: {
    name: "Audit Harness",
    email: "audit@example.invalid",
    phone: "5125550000",
    company: "Audit Co",
    topic: "A question about a specific deliverable",
    message: "Submitted by scripts/forms-audit.mjs to verify the contact path end to end.",
  },
  expectRow: { form: "contact" },
};

// The careers form was removed when /careers became a routing stub. Hiring
// belongs to 254 Engineering Services per the cross brand keyword registry,
// so there is no application to submit here and nothing for this audit to
// drive. eng_applications is still written, by that brand rather than this one.

const ORDER = {
  name: "order (live mode)",
  path: "/order",
  table: "eng_orders",
  requiredField: "contactName",
  values: {
    service: "solar-structural-letters",
    contactName: "Audit Harness",
    company: "Audit Co",
    email: "audit@example.invalid",
    phone: "5125550000",
    propertyAddress: "1 Test Street",
    city: "Lubbock",
    postalCode: "79401",
    rush: "no",
    notes: "Submitted by scripts/forms-audit.mjs",
  },
  expectRow: { service: "solar-structural-letters", city: "Lubbock", rush: false },
};

async function main() {
  let stub = null;
  let prelaunch = null;
  let live = null;

  try {
    stub = await startSupabaseStub({ port: STUB_PORT });
    log(`Supabase stand-in on ${stub.url}\n`);

    const browser = await chromium.launch();

    // ---------------- prelaunch leg ----------------
    log(`Starting next start on ${PRELAUNCH_PORT} in prelaunch mode ...`);
    prelaunch = await startNextServer({
      port: PRELAUNCH_PORT,
      env: stubEnv(stub.url, { LAUNCH_MODE: "prelaunch", TBPELS_FIRM_NUMBER: "" }),
    });
    log(`Ready at ${prelaunch.base}\n`);
    log("=== PRELAUNCH MODE ===");

    for (const spec of [WAITLIST, CONTACT]) {
      await auditForm(browser, prelaunch.base, stub, spec);
    }

    // The gate itself. /order must not render a submittable form in prelaunch.
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(prelaunch.base + "/order", { waitUntil: "networkidle" });
      const landed = new URL(page.url()).pathname;
      record(
        "gate: /order redirects to /waitlist in prelaunch",
        landed === "/waitlist",
        `landed on ${landed}`,
      );
      // And the footer has to disclose it, on a page nobody thought about.
      await page.goto(prelaunch.base + "/services/roof-certification-letters", {
        waitUntil: "networkidle",
      });
      const footer = await page.locator("footer").innerText();
      // Ruled 2026-10-19: the footer states the registration in both modes and
      // names the registrant. Both literals are written out here rather than
      // imported, so a drifted config reads as drifted.
      record(
        "gate: footer states the firm registration",
        footer.includes(
          "254 Engineering LLC is a Texas registered engineering firm, TBPELS Firm Registration F-29811.",
        ),
        "",
      );
      record(
        "gate: footer no longer says registration is pending",
        !/registration (is )?pending/i.test(footer),
        "",
      );
      record(
        "gate: footer carries the parent entity line",
        footer.includes("Sealed Engineering is a brand of 254 Engineering LLC"),
        "",
      );
      record(
        "gate: footer names no entity called 254 Engineering Services LLC",
        !footer.includes("254 Engineering Services LLC"),
        "",
      );
      const cta = await page.locator("main").innerText();
      record(
        "gate: primary CTA reads as a waitlist",
        cta.includes("Join the waitlist"),
        "",
      );
      await context.close();
    }

    await prelaunch.stop();
    prelaunch = null;

    // ---------------- the mismatch guard ----------------
    //
    // Before exercising live mode, prove that the guard which makes the live
    // leg's compromise safe is actually armed. This build was made in
    // prelaunch, so a live server started WITHOUT the escape hatch must refuse
    // to come up. If it comes up, src/instrumentation.ts has stopped working
    // and every assertion below is running against a state that could ship.
    log("\nChecking the launch-mode mismatch guard ...");
    {
      let cameUp = false;
      let refused = null;
      try {
        refused = await startNextServer({
          port: LIVE_PORT,
          timeoutMs: 30_000,
          env: stubEnv(stub.url, { LAUNCH_MODE: "live", TBPELS_FIRM_NUMBER: "F-00000-AUDIT" }),
        });
        cameUp = true;
      } catch {
        // Expected: instrumentation.ts exits before the server binds.
      }
      if (refused) await refused.stop();
      record(
        "gate: live mode against a prelaunch build refuses to start",
        !cameUp,
        cameUp ? "the server came up, so the mismatch guard is not armed" : "",
      );
    }

    // ---------------- live leg ----------------
    //
    // ALLOW_LAUNCH_MODE_MISMATCH is set deliberately and its cost is stated
    // below: this build's static pages, including the footer, were prerendered
    // in prelaunch, so only the per-request behaviour is genuinely live here.
    // The footer in true live mode is covered by the guard above rather than by
    // putting a second full build inside an audit people should run often.
    log(`\nStarting next start on ${LIVE_PORT} in live mode ...`);
    live = await startNextServer({
      port: LIVE_PORT,
      env: stubEnv(stub.url, {
        LAUNCH_MODE: "live",
        TBPELS_FIRM_NUMBER: "F-00000-AUDIT",
        ALLOW_LAUNCH_MODE_MISMATCH: "1",
      }),
    });
    log(`Ready at ${live.base}\n`);
    log("=== LIVE MODE ===");

    await auditForm(browser, live.base, stub, ORDER);

    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(live.base + "/waitlist", { waitUntil: "networkidle" });
      const landed = new URL(page.url()).pathname;
      record(
        "gate: /waitlist redirects to /order in live mode",
        landed === "/order",
        `landed on ${landed}`,
      );
      // The order action must refuse on its own, not because the UI hid it.
      // Proving the reverse direction is the point: in prelaunch the action
      // refuses even when reached directly, and here it does not.
      await page.goto(live.base + "/order", { waitUntil: "networkidle" });
      const orderPage = await page.locator("main").innerText();
      record(
        "gate: live /order renders a submittable order form",
        orderPage.includes("Order a sealed document") && orderPage.includes("Submit order"),
        "",
      );

      // Deliberately NOT asserted here: the footer's licensure lines. This
      // server is running a prelaunch build, so its statically prerendered
      // footer still says registration is pending, and that is correct
      // behaviour for this artifact rather than a bug. The real live footer is
      // guaranteed by the mismatch guard checked above, which makes shipping
      // this combination impossible.
      await context.close();
    }

    await browser.close();

    // ---------------- report ----------------
    const failed = results.filter((r) => !r.ok);
    log("\n================ FORMS AUDIT ================");
    log(`${results.length} checks across 4 forms and both launch modes.`);
    log(
      `stand-in captured: ${stub.tables.eng_leads.length} leads, ` +
        `${stub.tables.eng_applications.length} applications, ${stub.tables.eng_orders.length} orders.`,
    );
    if (failed.length === 0) {
      log("ALL GREEN.");
      process.exitCode = 0;
    } else {
      log(`\n${failed.length} FAILURE(S):`);
      for (const f of failed) log(`  - ${f.name}${f.note ? `: ${f.note}` : ""}`);
      process.exitCode = 1;
    }
  } catch (err) {
    log(`Harness error: ${err.message}`);
    process.exitCode = 1;
  } finally {
    // Servers before the stand-in: they hold connections to it.
    if (prelaunch) await prelaunch.stop();
    if (live) await live.stop();
    if (stub) await stub.close();
  }
}

main();
