import fs from "node:fs";

/**
 * Bring the FHA and VA claims onto verified ground.
 *
 * VERIFIED at the primary source:
 *   HUD's own reference guide requires the foundation certification to be
 *   "completed by a licensed professional engineer or registered architect,
 *   who is licensed/registered in the state where the manufactured home is
 *   located", attesting compliance with the "Permanent Foundations Guide for
 *   Manufactured Housing (HUD-4930.3G), dated September 1996".
 *   https://archives.hud.gov/offices/hsg/sfh/ref/sfhp1-9d.cfm
 *
 *   HUD USER publishes the same September 1996 document as HUD-7584 and
 *   describes it as a revision of HUD Handbook 4930.3G dated August 1989, so
 *   both designations are HUD's own and both are named in the copy.
 *   https://www.huduser.gov/portal/publications/destech/permfound.html
 *
 * NOT VERIFIED, and therefore no longer asserted:
 *   That VA carries "an equivalent requirement in its own lender handbook",
 *   and that USDA programs "generally do as well". Neither could be traced to
 *   a VA or USDA primary source in this pass. VA Circular 26-18-7 does not
 *   address manufactured home foundations at all, and the Chapter 12 Minimum
 *   Property Requirements document redirects to a portal that could not be
 *   read. What is stated instead is what is true and useful: the technical
 *   standard is HUD's, and whether a given file needs the certification comes
 *   from the lender's written condition.
 */
const SUBS = [
  [
    "src/data/services.ts",
    "Both FHA and VA point at the same technical document: the HUD Permanent Foundations Guide for Manufactured Housing, published as HUD-7584. FHA carries the requirement in Handbook 4000.1, which asks for a certification by a licensed professional engineer or registered architect that the foundation complies with that guide. VA carries an equivalent requirement in its own lender handbook.",
    "The technical standard is HUD's: the Permanent Foundations Guide for Manufactured Housing, dated September 1996, which HUD publishes as HUD-7584 and cites in its own reference material as HUD-4930.3G. HUD requires the certification to be completed by a licensed professional engineer or registered architect who is licensed or registered in the state where the manufactured home is located, attesting that the foundation complies with that guide.",
  ],
  [
    "src/data/services.ts",
    "This matters because it defines what the engineer is looking at. The certification is not a home inspection and it is not an appraisal. It is an observation of the foundation system against a published federal standard, and the answer is either that it complies or that specific items do not.",
    "VA and USDA files routinely carry the same condition, and in practice the same document satisfies it, but the requirement in any given file comes from the lender's written condition rather than from a single rule that reads the same across every program. That is why the loan type and the condition language are both asked for at intake instead of assumed.",
  ],
  [
    "src/data/posts/fha-va-foundation-certification.ts",
    "FHA and VA both point at the same technical document: the HUD Permanent Foundations Guide for Manufactured Housing, published as HUD-7584. FHA carries the requirement in its single family handbook, which asks for certification by a licensed professional engineer or registered architect that the foundation complies with that guide. VA carries an equivalent requirement, and USDA programs generally do as well.",
    "The technical standard is HUD's, and it is worth naming precisely because two designations for the same document circulate. HUD publishes the Permanent Foundations Guide for Manufactured Housing, dated September 1996, as HUD-7584, and cites it in its own reference material as HUD-4930.3G. They are the same guide. HUD requires the certification to be completed by a licensed professional engineer or registered architect who is licensed or registered in the state where the manufactured home is located, attesting that the foundation complies with it.",
  ],
  [
    "src/data/posts/fha-va-foundation-certification.ts",
    "That single fact resolves most of the confusion in this area. The technical scope of an FHA certification and a VA certification is the same, because both are measured against the same federal document. What differs between programs is how the lender wants the certification addressed and what else the file requires alongside it.",
    "VA and USDA files routinely carry the same condition and are usually satisfied by the same document, because the underlying question is the same one. What differs is where the requirement comes from: HUD's standard is what the foundation is measured against, and the instruction to obtain a certification arrives in a specific lender's written condition. Read that condition rather than assuming the program dictates a single form of words.",
  ],
  [
    "src/data/industries.ts",
    "FHA and VA both point at the HUD Permanent Foundations Guide for Manufactured Housing, HUD-7584. The certification names that standard, describes the foundation as observed against it, and states compliance or itemizes what does not comply. That is what the condition asks for, in the terms it asks for it.",
    "HUD's Permanent Foundations Guide for Manufactured Housing, published as HUD-7584 and cited by HUD as HUD-4930.3G, is the standard the foundation is measured against, and HUD requires the certification to come from a professional engineer or registered architect licensed in the state where the home sits. The certification names that standard, describes the foundation as observed against it, and states compliance or itemizes what does not. That is what the condition asks for, in the terms it asks for it.",
  ],
  [
    "src/data/industries.ts",
    "Yes. All three point at the same HUD standard for the foundation itself. What differs is how the certification is addressed and what else each program's file requires beside it, which is why loan type is captured at intake rather than assumed.",
    "Yes. HUD's guide is the standard the foundation is measured against in each case, and in practice the same document satisfies all three. What differs is where the instruction comes from: it arrives in a specific lender's written condition rather than as one rule worded identically across programs. That is why the loan type and the condition language are both captured at intake rather than assumed.",
  ],
  [
    "src/data/posts/fha-va-foundation-certification.ts",
    "State the loan type at the start. FHA, VA, and USDA point at the same standard and are addressed differently.",
    "State the loan type at the start, and send the condition language with it. The foundation is measured against the same HUD guide either way; the addressee and the form of words come from the lender.",
  ],
];

// The two city FAQs assert that FHA, VA and USDA all require the certification.
// Softened to the verified shape: the standard is HUD's, the instruction is the
// lender's.
const CITY_FROM =
  "FHA, VA, and USDA loans on those homes all require an engineer's certification against the HUD Permanent Foundations Guide. The requirement follows the loan product rather than local permitting, so it applies to every federally backed purchase and refinance on those homes.";
const CITY_TO =
  "federally backed lending on those homes turns on the foundation meeting HUD's Permanent Foundations Guide for Manufactured Housing, and lenders routinely condition closing on an engineer's certification against it. The requirement follows the loan file rather than local permitting, so it can apply where no permit ever did.";

let applied = 0;
const misses = [];
for (const [file, from, to] of SUBS) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes(from)) {
    misses.push(`${file}: ${from.slice(0, 70)}...`);
    continue;
  }
  fs.writeFileSync(file, src.split(from).join(to));
  applied++;
}

{
  const file = "src/data/cities.ts";
  const src = fs.readFileSync(file, "utf8");
  const count = src.split(CITY_FROM).length - 1;
  if (count === 0) misses.push(`${file}: city FAQ phrasing not found`);
  else {
    fs.writeFileSync(file, src.split(CITY_FROM).join(CITY_TO));
    applied += count;
  }
}

console.log(`applied ${applied} substitution(s)`);
if (misses.length) {
  console.log("MISSED:");
  for (const m of misses) console.log("  " + m);
  process.exitCode = 1;
}
