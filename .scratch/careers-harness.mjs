import fs from "node:fs";

/**
 * Update the harness for /careers becoming a routing stub with no form.
 *
 * Every one of these is a deletion of coverage for something that no longer
 * exists, which is the only safe kind. The page itself stays in targets.mjs so
 * contrast, mobile, meta, voice, cta, and placeholder still measure it.
 */
const EDITS = [
  // contrast-audit: there is no careers form left to put into an error state.
  [
    "scripts/contrast-audit.mjs",
    `  {
    name: "careers errors",
    path: "/careers",
    async prepare(page) {
      await page.waitForTimeout(1200);
      await page.getByRole("button", { name: /send application/i }).click({ timeout: 10_000 });
      await page.locator("#name-error").waitFor({ state: "visible", timeout: 10_000 });
    },
  },
`,
    "",
  ],
  // cta-audit: the exemption reason changed with the page.
  [
    "scripts/cta-audit.mjs",
    `  "/careers": "The application form is the conversion path, and it is a different audience.",`,
    `  "/careers":
    "A routing stub for hiring, which the keyword registry assigns to 254 Engineering Services. Its only action is an outbound link to that firm, and a waitlist prompt on a hiring page would be a non sequitur.",`,
  ],
  // forms-audit: the careers spec and its run.
  [
    "scripts/forms-audit.mjs",
    "    for (const spec of [WAITLIST, CONTACT, CAREERS]) {",
    "    for (const spec of [WAITLIST, CONTACT]) {",
  ],
];

let applied = 0;
const misses = [];
for (const [file, from, to] of EDITS) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes(from)) {
    misses.push(`${file}: ${from.slice(0, 60).replace(/\n/g, " ")}...`);
    continue;
  }
  fs.writeFileSync(file, src.replace(from, to));
  applied++;
}

// The CAREERS spec object itself, removed by locating its bounds.
{
  const file = "scripts/forms-audit.mjs";
  let src = fs.readFileSync(file, "utf8");
  const start = src.indexOf("const CAREERS = {");
  if (start === -1) misses.push(`${file}: CAREERS spec not found`);
  else {
    const end = src.indexOf("\n};\n", start);
    if (end === -1) misses.push(`${file}: CAREERS spec terminator not found`);
    else {
      src =
        src.slice(0, start) +
        "// The careers form was removed when /careers became a routing stub. Hiring\n" +
        "// belongs to 254 Engineering Services per the cross brand keyword registry,\n" +
        "// so there is no application to submit here and nothing for this audit to\n" +
        "// drive. eng_applications is still written, by that brand rather than this one.\n" +
        src.slice(end + 4);
      fs.writeFileSync(file, src);
      applied++;
    }
  }
}

console.log(`applied ${applied}`);
if (misses.length) {
  console.log("MISSED:");
  for (const m of misses) console.log("  " + m);
  process.exitCode = 1;
}
