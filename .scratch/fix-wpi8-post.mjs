import fs from "node:fs";

/**
 * Correct the WPI-8 post against TDI's own process pages.
 *
 * Three errors in the shipped version:
 *   1. WPI-1 was called an "application for windstorm inspection". TDI calls it
 *      "Form WPI-1 Application for Certificate of Compliance".
 *   2. The engineer route was described as an alternative to filing a WPI-1.
 *      For ONGOING work it is not: a WPI-1 is filed either way, and the choice
 *      is between a TDI inspector and an APPOINTED engineer. The route that
 *      skips WPI-1 is the separate completed construction process.
 *   3. The certificate for completed construction is a WPI-8E, submitted on
 *      Form WPI-2E, and TDI states that any TBPELS licensed engineer may
 *      perform those inspections without appointment.
 *
 * Sources:
 *   https://www.tdi.texas.gov/wind/inspectionproc.html
 *   https://www.tdi.texas.gov/wind/completed-construction-certificates.html
 */
const FILE = "src/data/posts/wpi-8-windstorm-explained.ts";

const SUBS = [
  [
    `    { h2: "The two routes" },
    { h3: "Route one: WPI-1 and a TDI appointed inspector" },
    {
      p: "The intended path. Before work begins, an application for windstorm inspection, form WPI-1, is filed. A TDI appointed inspector then inspects at the required stages, including stages that are covered up later, and the certificate is issued on that basis.",
    },
    {
      p: "This route costs nothing in fees and moves at the speed of the inspector queue, which after an active storm season is not fast. Its real constraint is that it has to be started before the work, which is exactly the thing that did not happen in most of the files that reach an engineer.",
    },
    { h3: "Route two: the licensed engineer" },
    {
      p: "A Texas licensed professional engineer inspects the work, evaluates it against the applicable windstorm building code, and submits a certification to TDI, which then issues the certificate.",
    },
    {
      p: "This route exists for three situations: work already completed without a WPI-1, schedules that cannot wait on the inspector queue, and construction unusual enough that it needs an engineer's evaluation rather than a checklist. It is the only available remedy when the work is already done, which is why most people arrive at it.",
    },`,
    `    { h2: "Ongoing work and finished work are two different processes" },
    {
      p: "This is the distinction that decides everything else, and almost every confused conversation about windstorm certificates comes from collapsing it. TDI handles construction that has not started yet and construction that is already finished through separate processes, with separate forms and separate certificates.",
    },
    { h3: "Ongoing construction" },
    {
      p: "Before work begins, Form WPI-1, the Application for Certificate of Compliance, is filed with TDI. Inspections then happen while the work is underway, performed by either a TDI windstorm inspector or an appointed Texas licensed professional engineer. TDI is explicit that inspections must occur during the construction or repair rather than before or after it, which is exactly why covering something up closes this route off.",
    },
    {
      p: "On completion, the WPI-1 and the applicable WPI-2-BC forms go to TDI, and TDI issues the WPI-8 Certificate of Compliance. TDI does not charge a fee for its own inspectors. What that route costs instead is time, because it moves at the speed of the inspector queue, and after an active storm season that is not fast.",
    },
    { h3: "Completed construction" },
    {
      p: "Where no WPI-1 was ever filed and the work is finished, there is a separate route, and one detail in it is worth reading twice. TDI states that any professional engineer licensed by the Texas Board of Professional Engineers and Land Surveyors may perform inspections on completed construction. Appointment is required for ongoing work and is not required here.",
    },
    {
      p: "The engineer submits Form WPI-2E, the Completed Construction Inspection Form, together with a sealed post-construction inspection report and supporting documentation, or a sealed design. TDI then issues a WPI-8E rather than a WPI-8. This is the route most people arrive at, because most people find out about any of this when a renewal or a closing asks for paperwork nobody obtained.",
    },
    {
      p: "One piece of history, if you are reading old paperwork: certificates numbered WPI-8C were issued by the Texas Windstorm Insurance Association for completed construction between January 1, 2017 and May 31, 2020. A WPI-8C is not a WPI-8E and came from a different body.",
    },`,
  ],
  [
    `      p: "Inside the designated area, construction has to comply with the TDI windstorm building code, which is based on the International Residential and Building Codes with wind loads determined under ASCE 7 for some of the highest design wind speeds in the country. Compliance has to be documented, and the document that records it is the certificate of compliance, form WPI-8, issued by the Texas Department of Insurance.",`,
    `      p: "Inside the designated area, construction has to comply with the windstorm building code, which is based on the International Residential and Building Codes with wind loads determined under ASCE 7 for some of the highest design wind speeds in the country. Compliance has to be documented, and the document that records it is a certificate of compliance issued by the Texas Department of Insurance: a WPI-8 for ongoing construction, or a WPI-8E for construction that is already finished.",`,
  ],
  [
    `      p: "The Texas Department of Insurance designates a catastrophe area along the Gulf Coast. It covers fourteen seaward counties in full, plus the part of Harris County east of Highway 146.",`,
    `      p: "The Texas Department of Insurance designates a catastrophe area along the Gulf Coast. It covers fourteen seaward counties in full, plus, in the department's wording, parts of Harris County east of Highway 146.",`,
  ],
  [
    `      q: "I reroofed years ago with no WPI-1. Is it too late?",
      a: "Not necessarily, and the engineer path exists for exactly this. What determines whether certification is possible is what can be inspected now, what can be exposed, and what documentation exists from the original work. Construction photographs make a very large difference.",`,
    `      q: "I reroofed years ago with no WPI-1. Is it too late?",
      a: "Not necessarily. That is completed construction, and TDI has a separate route for it: any engineer licensed by the Texas Board of Professional Engineers and Land Surveyors may inspect finished work and submit Form WPI-2E with a sealed post-construction report, after which TDI can issue a WPI-8E. What determines whether it succeeds is what can be inspected now, what can be exposed, and what documentation exists from the original work. Construction photographs make a very large difference.",`,
  ],
  [
    `      a: "No. The certificate is a compliance document issued by the Texas Department of Insurance. The policy is written by TWIA or a private carrier. The certificate makes the property eligible for coverage; it does not put a policy in force.",`,
    `      a: "No. The certificate is a compliance document issued by the Texas Department of Insurance, and TDI states it is required for the building to be eligible for wind and hail coverage through TWIA. The policy itself is written by TWIA or a private carrier. The certificate makes the property eligible; it does not put a policy in force.",`,
  ],
];

let src = fs.readFileSync(FILE, "utf8");
let applied = 0;
for (const [from, to] of SUBS) {
  if (!src.includes(from)) {
    console.log("MISS:\n" + from.slice(0, 90) + "...");
    continue;
  }
  src = src.split(from).join(to);
  applied++;
}
fs.writeFileSync(FILE, src);
console.log(`applied ${applied}/${SUBS.length}`);
