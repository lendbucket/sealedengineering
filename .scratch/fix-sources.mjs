import fs from "node:fs";

/**
 * Final source pass on the service pages.
 *
 * VERIFIED:
 *   "Guidelines for the Evaluation and Repair of Residential Foundations",
 *   Texas Section ASCE. Adopted Fall 2002 after a 1998 Texas Board policy
 *   advisory; Version 2 in 2008; Version 3 adopted March 2022. Published free
 *   by the section, and it defines levels of investigation.
 *   https://www.texasce.org/resources/publications/residential-foundations/
 *
 * RESTATED because it could not be traced to a primary source:
 *   The three to five pounds per square foot array dead load. It is a real
 *   working range and it is a rule of thumb, not a published figure, and the
 *   number an engineer actually uses comes off the module and racking cut
 *   sheets for the specific system. Saying that is both more accurate and more
 *   useful than repeating a range.
 */
const SUBS = [
  [
    "src/data/services.ts",
    "First, whether the existing roof framing can carry the array. A residential PV array adds roughly three to five pounds per square foot of dead load, distributed through the standoffs into the rafters or truss top chords. That is a modest number, which is exactly why the answer is usually yes, and exactly why the letter still has to be written by somebody who checked rather than assumed.",
    "First, whether the existing roof framing can carry the array. The added dead load is modest and it is taken from the module and racking cut sheets for the system actually being installed rather than from a rule of thumb, because that is the number the calculation has to stand on. It is distributed through the standoffs into the rafters or truss top chords. Being modest is exactly why the answer is usually yes, and exactly why the letter still has to be written by somebody who checked rather than assumed.",
  ],
  [
    "src/data/services.ts",
    "Much of populated Texas sits on highly expansive clay. Those soils swell when they take on water and shrink when they lose it, and a slab on grade foundation built on them moves seasonally by design. The Texas Section of the American Society of Civil Engineers publishes guidelines for evaluating residential foundations on exactly this problem, and the central idea in them is that deflection has to be judged against what the structure tolerates rather than against a flat plane.",
    "Much of populated Texas sits on highly expansive clay. Those soils swell when they take on water and shrink when they lose it, and a slab on grade foundation built on them moves seasonally by design. The Texas Section of the American Society of Civil Engineers publishes Guidelines for the Evaluation and Repair of Residential Foundations, adopted in 2002 and now in its third version adopted in March 2022, addressing exactly this problem. The guidelines define levels of investigation, and the central idea in them is that deflection has to be judged against what the structure tolerates rather than against a flat plane.",
  ],
  [
    "src/data/posts/roof-certification-letter-covers.ts",
    "Hail is a regional certainty across North, Central, and West Texas. On any roof more than a few years old in Dallas, Fort Worth, Abilene, or Amarillo, the question is not whether it has taken hail but whether the resulting damage is functional or cosmetic.",
    "Hail is a regional constant across North, Central, and West Texas. On an older roof in Dallas, Fort Worth, Abilene, or Amarillo the useful question is usually not whether it has taken hail but whether the resulting damage is functional or cosmetic.",
  ],
];

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

// Record the sources in the data file itself, where the next person editing the
// copy will see them.
{
  const file = "src/data/services.ts";
  const src = fs.readFileSync(file, "utf8");
  const anchor = " *   - No outcome guarantees.";
  if (src.includes(anchor)) {
    const block =
      " *\n" +
      " * PRIMARY SOURCES for the technical claims on these pages, verified 2026-08-17:\n" +
      " *   Windstorm, WPI-8 and WPI-8E, forms WPI-1, WPI-2-BC and WPI-2E:\n" +
      " *     https://www.tdi.texas.gov/wind/inspectionproc.html\n" +
      " *     https://www.tdi.texas.gov/wind/completed-construction-certificates.html\n" +
      " *     https://www.tdi.texas.gov/tips/need-windstorm-inspection.html\n" +
      " *   Manufactured home foundations, HUD-7584 / HUD-4930.3G, and the rule that\n" +
      " *   the certifier be licensed in the state where the home sits:\n" +
      " *     https://archives.hud.gov/offices/hsg/sfh/ref/sfhp1-9d.cfm\n" +
      " *     https://www.huduser.gov/portal/publications/destech/permfound.html\n" +
      " *   Residential foundation evaluation, Texas Section ASCE guidelines:\n" +
      " *     https://www.texasce.org/resources/publications/residential-foundations/\n" +
      " *\n" +
      " * A claim that cannot be traced to one of these is stated generally rather\n" +
      " * than repeated with a number attached. See BACKLOG.md.\n" +
      anchor;
    fs.writeFileSync(file, src.replace(anchor, block));
    applied++;
  } else {
    misses.push("services.ts: source comment anchor not found");
  }
}

console.log(`applied ${applied} substitution(s)`);
if (misses.length) {
  console.log("MISSED:");
  for (const m of misses) console.log("  " + m);
  process.exitCode = 1;
}
