import fs from "node:fs";

/**
 * Break the uniform paragraph rhythm the voice audit caught.
 *
 * The industries pages render `pains` and `answers` as eight paragraphs, and
 * every one was written to roughly the same length because they were written as
 * a set. That is the structural tell the playbook names, and it was a fair hit
 * on this site's own writing rather than a false positive: the realtors page
 * measured a length variation of 0.15, which is flatter than any human wrote on
 * purpose.
 *
 * The fix is editorial, not mechanical. Some of these points need one sentence
 * and were padded to three; one needed a concrete detail it never got.
 */
const SUBS = [
  // ---- realtors and title companies, cv 0.15 --------------------------
  [
    "src/data/industries.ts",
    "A general inspector flagged a foundation, and the clock that matters is already running. Getting an engineer on site, getting a defensible measurement, and getting a written opinion inside that window is the entire job, and an engineer who cannot say when they will be there is not usable.",
    "A general inspector flags a foundation and the clock is already running. An engineer who cannot tell you when they will be on site is not usable, whatever the report would have said.",
  ],
  [
    "src/data/industries.ts",
    "When the only documents in a negotiation are proposals from companies that sell the repair, both sides are arguing about scopes that were never the same. A sealed engineering opinion is the only document in that conversation written by somebody who is not paid more if the answer is yes.",
    "Three proposals from three repair companies are three different scopes at three prices, and none of them are comparable. One quotes eighteen piers along the north side, one quotes twelve and a drainage correction, one quotes twenty six and a full perimeter. The buyer is not choosing between prices. They are choosing between three descriptions of a house nobody measured, written by three parties who are each paid more if the answer is yes. A sealed engineering opinion is the only document in that conversation without that problem.",
  ],
  [
    "src/data/industries.ts",
    "Every Texas house on clay has cracking, and a buyer looking at a photograph cannot tell which kind they are looking at. Neither can a seller. A relative elevation survey turns an argument about appearances into a measurement, which is what ends the argument.",
    "Every Texas house on clay cracks. A photograph cannot tell a buyer which kind they are looking at, and it cannot tell a seller either. An elevation survey replaces the argument with a number.",
  ],
  [
    "src/data/industries.ts",
    "Roof certifications and foundation conditions land in underwriting after everything else is done. At that point the transaction coordinator needs a document that closes the condition on the first submission, not one that generates a follow up question.",
    "Roof and foundation conditions land in underwriting after everything else is finished, when what is needed is a document that closes the condition on the first submission rather than one that generates a follow up question. The difference is usually whether the engineer was told what the condition actually said.",
  ],
  [
    "src/data/industries.ts",
    "No repair work is sold, no contractor is recommended, and no price is quoted. The report states what was measured and what the conditions call for. That independence is exactly what makes it useful to both sides of a negotiation.",
    "No repair work is sold, no contractor recommended, no price quoted. That is what makes the report usable by both sides.",
  ],
  [
    "src/data/industries.ts",
    "A relative elevation survey produces a number and a contour. A second survey after a full seasonal cycle can be compared against it. That is the difference between an engineering report and a strongly worded assessment.",
    "A relative elevation survey produces a number and a contour, and a survey taken a year later can be compared against it. Texas clay moves seasonally, so a single reading is a snapshot and two readings a year apart are evidence. That is the difference between an engineering report and a strongly worded assessment, and it is the reason a report written this way survives a second opinion.",
  ],
  [
    "src/data/industries.ts",
    "Underwriters want the standard named and the conclusion stated. Buyers want to know whether to walk. Sellers want to know what is actually required. The deliverable is structured so all three can find their answer without interpreting it.",
    "Underwriters want the standard named. Buyers want to know whether to walk. Sellers want to know what is actually required. Three readers, one document, and each of them able to find their answer without interpreting anybody else's.",
  ],
  [
    "src/data/industries.ts",
    "Foundation, roof, repair specification, and permit letters come from the same place, which matters when a single transaction needs two of them and the calendar has no room for two intake processes.",
    "Foundation, roof, repair specification, and permit letters all come from one place. That matters on the transactions that need two of them.",
  ],

  // ---- solar installers, cv 0.26 --------------------------------------
  [
    "src/data/industries.ts",
    "It is a two page document on a project that took months to sell. It becomes the critical path exactly when a crew is scheduled, and the cost of that day is not the cost of the letter. Turnaround consistency matters more than turnaround speed, because a schedule can absorb a known interval and cannot absorb an unknown one.",
    "It is a two page document on a project that took months to sell, and it becomes the critical path on the morning a crew is already scheduled. Consistency beats speed here: a schedule absorbs a known interval and cannot absorb an unknown one.",
  ],
  [
    "src/data/industries.ts",
    "Racking system, module, attachment, fastener, and installation standards get recorded at the account level rather than on each order. Per project intake then narrows to what actually varies: address, roof framing, attic photographs, and the array layout on each plane.",
    "Racking, module, attachment, fastener, and installation standards are recorded once at the account level. Per project intake then narrows to what actually varies.",
  ],
  [
    "src/data/industries.ts",
    "The same engineer covers the metro, the surrounding counties, and the coastal counties where a windstorm certificate is in play alongside the structural letter. Nothing gets handed to a second firm halfway through a market.",
    "One engineer covers the metro, the counties around it, and the coastal counties where a windstorm certificate runs alongside the structural letter. Nothing is handed to a second firm halfway through a market, which is what usually happens when an installer expands into the seaward counties and discovers their existing engineer does not do windstorm work.",
  ],

  // ---- odessa, cv 0.28 exactly at the floor ---------------------------
  [
    "src/data/cities.ts",
    "Boom cycle scheduling pressure applies here identically. When activity is high everything is oversubscribed at once, and the deliverables that can be produced from documents rather than from a site visit are the ones that stay fast regardless of what the field looks like.",
    "Boom cycle scheduling pressure applies here exactly as it does in Midland. When activity is high, everything is oversubscribed at once.",
  ],
  [
    "src/data/cities.ts",
    "Shade structures and covered parking are ordinary construction rather than upgrades, and open terrain exposure governs them through uplift. A stock carport plan carried in from a lower exposure market is the most common reason one gets rejected at the counter.",
    "Shade structures and covered parking are ordinary construction here rather than upgrades, and open terrain exposure governs them entirely through uplift rather than through the weight of anything sitting on top. A stock carport plan carried in from a lower exposure market is the most common reason one gets rejected at the counter, and the correction is almost always a larger footing than the person submitting it expected.",
  ],
];

let applied = 0;
const misses = [];
for (const [file, from, to] of SUBS) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes(from)) {
    misses.push(`${file}: ${from.slice(0, 60)}...`);
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
