import fs from "node:fs";

const FILE = "src/data/cities.ts";
const VERIFIED = "2026-08-17";

/**
 * Verified against each city's official site on the date above. `name` is
 * written to read inside the sentence "reviewed by ...". `submittal` is one
 * genuinely local fact a contractor would want before submitting.
 *
 * No phone numbers anywhere: none is published on this site, and the
 * placeholder audit fails the build on any ten digit run in rendered output.
 */
const OFFICES = {
  houston: {
    name: "Building Code Enforcement at the Houston Permitting Center",
    note: "The Planning and Development Department performs the site plan review step separately. Unincorporated Harris County is reviewed by the Harris County Engineering Department, and the two do not ask for the same things.",
    submittal: "All plans are submitted electronically through the iPermits portal.",
    source: "https://www.houstonpermittingcenter.org/building-code-enforcement/residential-plan-review",
  },
  "san-antonio": {
    name: "the City of San Antonio Development Services Department",
    note: "Unincorporated Bexar County is reviewed by Bexar County Public Works, which has a different and generally lighter residential review.",
    submittal:
      "Applications go through the BuildSA portal, and a Completeness review comes first. Plan review fees are only assessed once the submittal passes it, so an incomplete package stalls before it ever reaches a reviewer.",
    source: "https://www.sa.gov/Directory/Departments/DSD/Constructing/Residential/Plan-Review",
  },
  dallas: {
    name: "the City of Dallas Development Services Department, Building Inspection Division",
    note: "Plan Review and Field Service Inspections sit at the Oak Cliff Municipal Center. The metro is a patchwork: Highland Park, University Park, Irving, Garland, and Mesquite each run their own review with their own amendments.",
    submittal:
      "Submittals run through the Electronic Plan Review System. The city grants or denies a building permit application no later than the 45th day after submission, extendable by 14 days if the applicant agrees.",
    source: "https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/Pages/BI_EPRS.aspx",
  },
  "fort-worth": {
    name: "the City of Fort Worth Development Services Department",
    note: "Arlington, Grapevine, Keller, and Mansfield each run their own review, and the unincorporated county is handled separately. Some city forms still carry the older Planning and Development masthead.",
    submittal:
      "Submittals go through Accela Citizen Access. Every department reviews simultaneously and comments are compiled at the end of each review cycle, so one unanswered comment holds the whole cycle.",
    source: "https://www.fortworthtexas.gov/departments/development-services/permits/residential-information",
  },
  austin: {
    name: "the City of Austin Development Services Department",
    note: "Travis County reviews unincorporated areas, and Austin's extraterritorial jurisdiction adds a layer that catches people out.",
    submittal:
      "Applications and status run through the Austin Build and Connect portal. A separate Residential Expedited Plan Review program exists alongside the standard queue.",
    source: "https://www.austintexas.gov/development-services/residential-plan-review",
  },
  "el-paso": {
    name: "the City of El Paso Planning and Inspections Department",
    note: "El Paso County reviews unincorporated areas including the colonias east and south of the city.",
    submittal:
      "The One Stop Shop on Texas Avenue is the primary intake and payment point, and plans can also be submitted electronically through the Citizen Access Portal.",
    source: "https://www.elpasotexas.gov/planning-and-inspections/",
  },
  "corpus-christi": {
    name: "the City of Corpus Christi Development Services Department",
    note: "Windstorm compliance runs through the Texas Department of Insurance, which is separate from and additional to city permitting.",
    submittal:
      "Residential plans go to the department's residential plan review mailbox, with applications tracked in the Dynamic Portal. The city states residential approvals can take up to seven business days.",
    source: "https://www.cctexas.com/ds",
  },
  laredo: {
    name: "the City of Laredo Building Development Services",
    note: "Webb County reviews unincorporated areas, including the colonias outside the city limits.",
    submittal:
      "Completed applications are emailed to the building permits mailbox. Building Development Services is split across six divisions, so a submittal can be complete for one and not another.",
    source: "https://www.cityoflaredo.com/departments/building-development-services",
  },
  lubbock: {
    name: "the City of Lubbock Department of Building Safety",
    note: "Lubbock County reviews unincorporated areas, and the smaller South Plains municipalities each run their own.",
    submittal:
      "The contractor has to be registered with the Department of Building Safety before a residential permit will issue, which is a separate step from the permit itself and a common cause of delay.",
    source: "https://ci.lubbock.tx.us/departments/building-safety/permitting/residential-permitting",
  },
  mcallen: {
    name: "the City of McAllen Building Permits and Inspections Department",
    note: "Edinburg, Mission, Pharr, and Weslaco each run their own review, and Hidalgo County handles the unincorporated areas and colonias.",
    submittal:
      "A recorded plat is required before a building permit application can even be submitted. Plan review is charged at 18 percent of the permit fee, and submittals must be legible and correctly oriented.",
    source: "https://www.mcallen.net/departments/permits/home",
  },
  brownsville: {
    name: "the City of Brownsville Building Permits and Inspections Division",
    note: "A separate Planning and Redevelopment Department handles land use, and windstorm compliance is a separate Texas Department of Insurance process. Cameron County reviews the unincorporated areas.",
    submittal:
      "Plan review is stated as three to five business days when the submittal is complete, and permits may only be pulled by a general contractor registered with the city.",
    source: "https://www.brownsvilletx.gov/1914/Building-Permits-and-Inspections-Divisio",
  },
  amarillo: {
    name: "the City of Amarillo Building Safety Department",
    note: "Amarillo spans Potter and Randall counties, and each county reviews its own unincorporated areas.",
    submittal:
      "Permits and contractor licensing run through MGO Connect. Plans marked Not for Construction or Preliminary Plans Only are refused, which matters directly for a sealed submittal: send the final sealed set, not a draft.",
    source: "https://www.amarillo.gov/building-safety/",
  },
  killeen: {
    name: "the City of Killeen Development Services Department, Building Inspections division",
    note: "Harker Heights, Copperas Cove, and Nolanville run their own reviews, and Bell County handles the unincorporated areas.",
    submittal:
      "All permits are submitted through the MGO Connect portal. One and two family projects are reviewed by a building inspector within three to five days.",
    source: "https://www.killeentexas.gov/204/Building-Inspections",
  },
  waco: {
    name: "the City of Waco Development Services Department, Inspection Services division",
    note: "McLennan County reviews the unincorporated areas, and Woodway, Hewitt, and Bellmead each run their own.",
    submittal:
      "The city publishes a submission checklist per permit type defining the minimum plan submittal. Reading the one for your permit type before submitting removes most first cycle comments.",
    source: "https://www.waco-texas.com/Departments/Development-Services/Inspection-Services",
  },
  tyler: {
    name: "the City of Tyler Development Services Department",
    note: "Smith County has a lighter review for unincorporated areas, and a large share of the region's housing sits outside city limits.",
    submittal:
      "All permits and plans must be submitted electronically through the city's inspections portal, which runs on eTRAKiT and ProjectDox. Residential new construction approval is stated as usually no more than five working days.",
    source: "https://www.cityoftyler.org/government/departments/development-services-3527",
  },
  "college-station": {
    name: "the City of College Station Planning and Development Services, Building Division",
    note: "Bryan runs a separate review, and Brazos County handles the unincorporated areas.",
    submittal:
      "The Building Division reviews the application, the site plan, and all construction documents before a residential permit issues, and checks zoning compatibility for the proposed use as part of the same pass.",
    source: "https://www.cstx.gov/business-development/planning-and-development-services/",
  },
  beaumont: {
    name: "the City of Beaumont Building Codes Division",
    note: "Port Arthur, Nederland, and Groves run their own reviews, and windstorm compliance runs separately through TDI.",
    submittal:
      "The city holds free pre-development meetings every Thursday morning, first come first served, with department plan reviewers present. Inspections are scheduled only through the online portal and never by phone.",
    source: "https://www.beaumonttexas.gov/707/Building-Codes",
  },
  midland: {
    name: "the City of Midland Development Services Department",
    note: "Plan review is orchestrated by the Code Administration Division and typically pulls in Engineering, Transportation, Utilities, the Fire Marshal, and Health. Midland County reviews the unincorporated areas.",
    submittal:
      "Applications run through the PermitMidland portal. The property has to be platted and zoned residential, construction must start within 180 days of issue, and it cannot pause for more than 180 consecutive days.",
    source: "https://www.midlandtexas.gov/1259/Permitting-and-Inspections",
  },
  odessa: {
    name: "the City of Odessa Building Inspection Division",
    note: "Ector County reviews the unincorporated areas, which carry a substantial share of the region's housing.",
    submittal:
      "Odessa names its adopted codes explicitly, including the 2018 International Residential Code. A letter written against the current published edition rather than the adopted one is the most common avoidable rejection here.",
    source: "https://www.odessa-tx.gov/1222/Building-Inspection-Permits",
  },
  "round-rock": {
    name: "the City of Round Rock Planning and Development Services Department, Building Inspection Division",
    note: "Georgetown, Cedar Park, Leander, and Hutto each run their own review, and Williamson County handles the unincorporated areas.",
    submittal:
      "Round Rock runs a strict one permit system: every relevant contractor has to be listed on the application before the permit can be issued, so a missing subcontractor holds the whole thing.",
    source: "https://www.roundrocktexas.gov/city-departments/planning-and-development-services/building-inspection/",
  },
  victoria: {
    name: "the City of Victoria Development Services Department",
    note: "The Development and Permitting Center coordinates building plan review, permits, inspections, and floodplain management. Victoria County reviews unincorporated areas, and projects a short drive toward Port Lavaca or Refugio cross into seaward county territory.",
    submittal:
      "Plan review for one and two family construction and remodeling is optional in Victoria, which is unusual in Texas. Where it is requested, review generally runs up to ten working days and a fee applies after the third review.",
    source: "https://www.victoriatx.gov/229/Development-Services",
  },
  harlingen: {
    name: "the City of Harlingen Building Permits and Inspections Division",
    note: "A separate Planning and Development Department guides land use across the city and its extraterritorial jurisdiction. Windstorm compliance runs separately through TDI, and Cameron County handles unincorporated areas.",
    submittal:
      "Harlingen has adopted the 2024 International Building Code and the 2024 International Residential Code. Review is stated as two to fourteen days depending on complexity.",
    source: "https://harlingentx.gov/departments/building_inspections/index.php",
  },
  "san-angelo": {
    name: "the City of San Angelo Planning and Development Services",
    note: "Building Permits and Inspections sits in the Community Development Building on West College Avenue. Tom Green County reviews the unincorporated areas, which carry a large share of the surrounding housing.",
    submittal:
      "The application and drawings are emailed to the permits department first. A project number comes back by email, and the documents are then uploaded for electronic review and approval.",
    source: "https://www.cosatx.us/departments-services/building-permits-inspections",
  },
  abilene: {
    name: "the City of Abilene Planning and Development Services, Building Inspections Division",
    note: "Taylor County reviews the unincorporated areas, and the surrounding smaller municipalities run their own.",
    submittal:
      "Permits are applied for and tracked through MyGov. Abilene publishes a dedicated carport application separate from the general building permit application, so a carport here is its own submittal rather than a variation on one.",
    source: "https://abilenetx.gov/428/Building-Inspections",
  },
  alice: {
    name: "Building Inspection, a division of the City of Alice Community Development Department",
    note: "Permits are handled through Code Enforcement, and Fire Prevention permits run separately under the Fire Marshal. Jim Wells County reviews the unincorporated areas, where a large share of the county's housing sits.",
    submittal:
      "Building Inspection administers contractor and subcontractor registration alongside permits, so a contractor who is not registered cannot pull one regardless of how complete the plans are.",
    source: "https://www.cityofalice.org/government/departments/community_development/building_inspection/index.php",
  },
};

let src = fs.readFileSync(FILE, "utf8");

// The working copy is CRLF because git core.autocrlf is on. Normalise before
// matching, or every "\n    }," anchor below silently misses and the script
// reports 0 of 25 rather than corrupting anything. Written back as LF; git
// restores CRLF on checkout.
src = src.replace(/\r\n/g, "\n");

// Widen the type first.
src = src.replace(
  "  permitOffice: { name: string; note: string };",
  [
    "  /**",
    "   * The department that performs residential plan review, verified against the",
    "   * city's own site on the date recorded. `submittal` is one genuinely local",
    "   * fact worth publishing; `source` is what it was checked against, so the",
    "   * annual re-verification is a diff rather than a research project.",
    "   */",
    "  permitOffice: {",
    "    name: string;",
    "    note: string;",
    "    submittal: string;",
    "    source: string;",
    "    verified: string;",
    "  };",
  ].join("\n"),
);

let replaced = 0;
const missed = [];
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

for (const [slug, o] of Object.entries(OFFICES)) {
  // Anchor on the slug so the right entry is edited, then take the first
  // permitOffice block after it.
  const slugIdx = src.indexOf(`slug: "${slug}",`);
  if (slugIdx === -1) {
    missed.push(`${slug}: slug not found`);
    continue;
  }
  const startIdx = src.indexOf("    permitOffice: {", slugIdx);
  if (startIdx === -1) {
    missed.push(`${slug}: permitOffice not found`);
    continue;
  }
  const endIdx = src.indexOf("\n    },\n", startIdx);
  if (endIdx === -1) {
    missed.push(`${slug}: permitOffice terminator not found`);
    continue;
  }

  const block =
    `    permitOffice: {\n` +
    `      name: "${esc(o.name)}",\n` +
    `      note: "${esc(o.note)}",\n` +
    `      submittal:\n        "${esc(o.submittal)}",\n` +
    `      source: "${o.source}",\n` +
    `      verified: "${VERIFIED}",`;

  src = src.slice(0, startIdx) + block + src.slice(endIdx);
  replaced++;
}

fs.writeFileSync(FILE, src);
console.log(`rewrote ${replaced}/${Object.keys(OFFICES).length} permitOffice blocks`);
if (missed.length) {
  console.log("MISSED:");
  for (const m of missed) console.log("  " + m);
  process.exitCode = 1;
}
