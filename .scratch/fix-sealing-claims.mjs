import fs from "node:fs";

/**
 * Remove the present-tense passive sealing claim from every surface.
 *
 * Found by the shared regulatory library copied from 254 on 2026-08-18. The
 * claim "reviewed and sealed by a licensed Texas Professional Engineer" is
 * present tense and asserts that a PE is doing the work now. No PE is hired.
 *
 * The chrome surfaces switch to the gate-aware SEALING_PHRASE constant so the
 * hire is a one line change. The data-file descriptions are reworded to be
 * gate NEUTRAL, because they are static strings consumed by pageMeta and
 * threading a runtime constant through them would buy nothing: "requiring a
 * Texas PE seal" describes the document category and stays true in both states.
 */
const SUBS = [
  // ---- chrome, switched to the gate-aware constant ---------------------
  [
    "src/app/layout.tsx",
    `    "Sealed engineering letters, certifications, and small plan sets for Texas property, reviewed and sealed by a licensed Texas Professional Engineer.",`,
    `    \`Sealed engineering letters, certifications, and small plan sets for Texas property, \${SEALING_PHRASE}.\`,`,
  ],
  [
    "src/app/layout.tsx",
    `import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/config/launch";`,
    `import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL, SEALING_PHRASE } from "@/config/launch";`,
  ],
  [
    "src/lib/schema.ts",
    `    description:
      "Sealed engineering letters, certifications, and small plan sets for Texas property, " +
      "reviewed and sealed by a licensed Texas Professional Engineer.",`,
    `    description:
      "Sealed engineering letters, certifications, and small plan sets for Texas property, " +
      \`\${SEALING_PHRASE}.\`,`,
  ],
  [
    "src/lib/schema.ts",
    `import { IS_LIVE, TBPELS_FIRM_NUMBER } from "@/config/launch";`,
    `import { IS_LIVE, SEALING_PHRASE, TBPELS_FIRM_NUMBER } from "@/config/launch";`,
  ],
  [
    "src/components/layout/Footer.tsx",
    `              Sealed engineering letters, certifications, and small plan sets for property anywhere
              in Texas, reviewed and sealed by a licensed Texas Professional Engineer.`,
    `              Sealed engineering letters, certifications, and small plan sets for property anywhere
              in Texas, {SEALING_PHRASE}.`,
  ],
  [
    "src/components/layout/Footer.tsx",
    `import { licensureLines } from "@/config/launch";`,
    `import { SEALING_PHRASE, licensureLines } from "@/config/launch";`,
  ],
  [
    "src/app/opengraph-image.tsx",
    `            Reviewed and sealed by a licensed Texas Professional Engineer`,
    `            {SEALING_PHRASE_CARD}`,
  ],
  [
    "src/app/opengraph-image.tsx",
    `import { IS_PRELAUNCH } from "@/config/launch";`,
    `import { IS_PRELAUNCH, SEALING_PHRASE } from "@/config/launch";

// Sentence case for the card, which reads as a line rather than a clause.
const SEALING_PHRASE_CARD = SEALING_PHRASE.charAt(0).toUpperCase() + SEALING_PHRASE.slice(1);`,
  ],

  // ---- the hero, reworded rather than templated -------------------------
  // The surrounding clause is doing real work and a dropped-in constant would
  // read as a seam. The future tense here is the honest form.
  [
    "src/app/page.tsx",
    `              The exact document your permit office, your underwriter, or your insurer is asking
              for. Flat rate, defined scope, and reviewed and sealed by a licensed Texas
              Professional Engineer who seals only what the evidence supports.`,
    `              The exact document your permit office, your underwriter, or your insurer is asking
              for. Flat rate, defined scope, and built for the seal of a licensed Texas
              Professional Engineer, who will seal only what the evidence supports.`,
  ],

  // ---- machine readable surfaces ---------------------------------------
  [
    "src/app/llms.txt/route.ts",
    `      \`reviewed and sealed by a licensed Texas Professional Engineer.\`,`,
    `      \`\${SEALING_PHRASE}.\`,`,
  ],
  [
    "src/app/llms.txt/route.ts",
    `import { IS_LIVE, TBPELS_FIRM_NUMBER, licensureLines } from "@/config/launch";`,
    `import { IS_LIVE, SEALING_PHRASE, TBPELS_FIRM_NUMBER, licensureLines } from "@/config/launch";`,
  ],
  [
    "src/app/llms-full.txt/route.ts",
    `      \`Texas. Every document is reviewed and sealed by a professional engineer licensed in Texas.\`,`,
    `      \`Texas. Every document is \${SEALING_PHRASE}.\`,`,
  ],
  [
    "src/app/llms-full.txt/route.ts",
    `import { IS_LIVE, TBPELS_FIRM_NUMBER, licensureLines } from "@/config/launch";`,
    `import { IS_LIVE, SEALING_PHRASE, TBPELS_FIRM_NUMBER, licensureLines } from "@/config/launch";`,
  ],

  // ---- data file descriptions, reworded gate neutral --------------------
  [
    "src/data/cities.ts",
    `"Sealed engineering letters for Austin and Travis County. Permit letters, beam sizing, and foundation reports sealed by a licensed Texas PE.",`,
    `"Sealed engineering letters for Austin and Travis County. Permit letters, beam sizing, and foundation reports requiring a licensed Texas PE seal.",`,
  ],
  [
    "src/data/cities.ts",
    `"Sealed engineering letters for El Paso County. Solar structural letters, permit letters, and carport plans sealed by a licensed Texas PE.",`,
    `"Sealed engineering letters for El Paso County. Solar structural letters, permit letters, and carport plans requiring a licensed Texas PE seal.",`,
  ],
  [
    "src/data/cities.ts",
    `"Sealed engineering letters for Laredo and Webb County. Permit letters, carport plans, and foundation reports sealed by a licensed Texas PE.",`,
    `"Sealed engineering letters for Laredo and Webb County. Permit letters, carport plans, and foundation reports requiring a licensed Texas PE seal.",`,
  ],
  [
    "src/data/cities.ts",
    `"Sealed engineering letters for Waco and McLennan County. Foundation reports, repair plans, and permit letters sealed by a licensed Texas PE.",`,
    `"Sealed engineering letters for Waco and McLennan County. Foundation reports, repair plans, and permit letters requiring a licensed Texas PE seal.",`,
  ],
  [
    "src/data/industries.ts",
    `"Manufactured home foundation certifications built around closing timelines. FHA, VA, and USDA, sealed by a licensed Texas PE.",`,
    `"Manufactured home foundation certifications built around closing timelines. FHA, VA, and USDA, requiring a licensed Texas PE seal.",`,
  ],
  [
    "src/data/services.ts",
    `the foundation observed against the HUD Permanent Foundations Guide and sealed by a licensed Texas PE.`,
    `the foundation observed against the HUD Permanent Foundations Guide, requiring a licensed Texas PE seal.`,
  ],

  // ---- the Odessa FAQ ---------------------------------------------------
  // Not a claim about this firm at all: it answers whether a stock carport plan
  // the customer already owns is usable here. Reworded to past tense and active
  // voice so it cannot be read as our assertion, which is cheaper and clearer
  // than an allowlist entry.
  [
    "src/data/cities.ts",
    `a: "Only if it is sealed by a Texas engineer and carries the design criteria for this address.`,
    `a: "Only if a Texas engineer sealed it and it carries the design criteria for this address.`,
  ],
];

let applied = 0;
const misses = [];
for (const [file, from, to] of SUBS) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes(from)) {
    misses.push(`${file}: ${from.slice(0, 70).replace(/\n/g, " ")}...`);
    continue;
  }
  fs.writeFileSync(file, src.replace(from, to));
  applied++;
}
console.log(`applied ${applied}/${SUBS.length}`);
if (misses.length) {
  console.log("MISSED:");
  for (const m of misses) console.log("  " + m);
  process.exitCode = 1;
}
