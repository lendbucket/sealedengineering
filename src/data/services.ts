import type { Service } from "@/data/types";

/**
 * The ten productized deliverables.
 *
 * Every page built from this file has to survive two readers who never see each
 * other: a plan reviewer who knows exactly what a sealed letter is worth, and a
 * homeowner who has been told to get one and has no idea what that means. The
 * copy is written for the second and checked against the first, which is why
 * the code references are specific and the promises are absent.
 *
 * Two rules the content obeys and the audits enforce:
 *   - No dollar figures. Pricing is a pending owner item, and a number in here
 *     would be quoted back to us for years after it changed.
 *
 * PRIMARY SOURCES for the technical claims on these pages, verified 2026-08-17:
 *   Windstorm, WPI-8 and WPI-8E, forms WPI-1, WPI-2-BC and WPI-2E:
 *     https://www.tdi.texas.gov/wind/inspectionproc.html
 *     https://www.tdi.texas.gov/wind/completed-construction-certificates.html
 *     https://www.tdi.texas.gov/tips/need-windstorm-inspection.html
 *   Manufactured home foundations, HUD-7584 / HUD-4930.3G, and the rule that
 *   the certifier be licensed in the state where the home sits:
 *     https://archives.hud.gov/offices/hsg/sfh/ref/sfhp1-9d.cfm
 *     https://www.huduser.gov/portal/publications/destech/permfound.html
 *   Residential foundation evaluation, Texas Section ASCE guidelines:
 *     https://www.texasce.org/resources/publications/residential-foundations/
 *
 * A claim that cannot be traced to one of these is stated generally rather
 * than repeated with a number attached. See BACKLOG.md.
 *   - No outcome guarantees. An engineer seals what the evidence supports. A
 *     page that promises an approval is writing a check the evidence has not
 *     agreed to cover.
 */
export const SERVICES: Service[] = [
  // ---------------------------------------------------------------- 01
  {
    slug: "solar-structural-letters",
    name: "Solar Structural Letters",
    fullName: "Solar Structural Letter",
    keyword: "solar structural letter",
    title: "Solar Structural Letter Texas | Sealed by a PE",
    description:
      "Sealed solar structural letters for Texas rooftop PV. Roof framing capacity, wind uplift, and attachment review from your plan set. No site visit.",
    h1: "Solar Structural Letters in Texas, Sealed by a Licensed PE",
    lede: "The stamped letter your plan reviewer asks for before a rooftop array goes on: existing framing capacity, wind uplift at the actual site, and attachment spacing that resists it.",
    evidenceMode: "upload",
    whoNeedsIt: [
      {
        who: "Residential solar installers",
        why: "Most Texas jurisdictions will not release a PV permit for a roof mount without a sealed letter confirming the existing framing takes the added load and the attachments resist uplift.",
      },
      {
        who: "EPC firms working multiple jurisdictions",
        why: "Every AHJ words the requirement differently. One engineer who already knows how Houston, Lubbock, and McAllen each phrase it is faster than restarting the conversation in each city.",
      },
      {
        who: "Homeowners doing an owner-builder install",
        why: "The permit office asks for an engineer letter and the racking manufacturer's data sheet is not one.",
      },
    ],
    sections: [
      {
        heading: "What a solar structural letter actually says",
        paragraphs: [
          "A solar structural letter is a short engineering opinion, sealed and signed, addressed to the authority having jurisdiction. It answers three questions and stops there.",
          "First, whether the existing roof framing can carry the array. The added dead load is modest and it is taken from the module and racking cut sheets for the system actually being installed rather than from a rule of thumb, because that is the number the calculation has to stand on. It is distributed through the standoffs into the rafters or truss top chords. Being modest is exactly why the answer is usually yes, and exactly why the letter still has to be written by somebody who checked rather than assumed. A 2x4 truss at 24 inches on center spanning 24 feet with an existing tile roof is a different conversation than a 2x6 rafter at 16 inches under composition shingle.",
          "Second, whether the attachments resist wind uplift at that specific address. Uplift is where roof mounted PV is actually governed, and it is not a national number. ASCE 7 assigns a basic wind speed by location, and Texas spans a very wide range of them. An array in Amarillo and the same array in Corpus Christi are two different uplift problems with two different attachment spacings.",
          "Third, whether the specific attachment being used develops the capacity the calculation demands. Lag screw diameter, embedment depth into the framing member, the species and grade of that member, and the spacing along and across the array all appear in the check. This is the part that most often changes a design: the framing passes and the attachment spacing has to tighten.",
        ],
      },
      {
        heading: "Why Texas is not one wind zone",
        paragraphs: [
          "Texas is the reason a national template letter is a liability. The basic wind speed under ASCE 7 for a Risk Category II residence runs from the low hundreds across most of the interior up past 140 miles per hour on the coast, and the exposure category shifts it again depending on whether the house sits inside a suburban tract or alone on open ranch land.",
          "The fourteen seaward counties and part of Harris County carry a second layer on top of that, the Texas Department of Insurance windstorm requirements, which is a separate certification path and not something a structural letter satisfies on its own. If the array is going on a roof in that region, the windstorm question needs answering alongside the structural one.",
        ],
        bullets: [
          "Panhandle and West Texas: high basic wind speed, frequently open exposure, and the attachment spacing tightens for it.",
          "Central and North Texas: moderate wind, but older housing stock with cut or modified framing that has to be looked at rather than assumed.",
          "Coastal counties: highest wind speeds in the state plus a separate TDI windstorm certification path.",
        ],
      },
      {
        heading: "When the answer is not a clean yes",
        paragraphs: [
          "Sometimes the framing does not carry the array as designed. That is a real outcome and it is not a failed order. What comes back in that case is the reason and the remedy: sister the rafters over a defined span, reduce the array footprint on the affected plane, move to a different attachment with greater withdrawal capacity, or tighten spacing.",
          "An engineer seals what the evidence supports. That is the entire value of the seal, and it is why nobody here will tell you in advance what the letter will conclude.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed letter on engineering letterhead, dated, addressed to the permit office.",
      "The governing code edition and the ASCE 7 basic wind speed used for the site address.",
      "The framing members reviewed, with span, spacing, species, and grade as provided.",
      "Attachment type, fastener size, embedment, and the maximum spacing the calculation supports.",
      "Any conditions or reinforcement the conclusion depends on, stated plainly.",
      "Digital PDF with the seal applied, suitable for direct upload to the permit portal.",
    ],
    evidence: [
      "Site address, so the wind speed and exposure are the real ones.",
      "Roof framing information: member size, spacing, span, and species or grade if known.",
      "Photos of the attic or framing, including any cut, notched, or modified members.",
      "Array layout drawing showing module positions on each roof plane.",
      "Module and racking cut sheets, including the attachment or standoff being used.",
      "Roof covering type and approximate age.",
    ],
    turnaround: "Built as a document review, so nothing waits on a site visit or a homeowner's schedule.",
    faqs: [
      {
        q: "Does every solar permit in Texas need a structural letter?",
        a: "No. It depends entirely on the authority having jurisdiction. Some Texas cities accept a manufacturer's certification for standard framing, some require a sealed letter on every rooftop array, and some only ask when the framing is trusses of unknown origin or the roof covering is tile. Check the plan review checklist for the specific city or county before ordering.",
      },
      {
        q: "Do you need to visit the roof?",
        a: "No. A solar structural letter is written from documents: the framing information, attic photos, the array layout, and the equipment cut sheets. That is why it is the fastest deliverable in the catalog. If the framing cannot be established from what is submitted, the letter cannot be sealed on assumption, and the missing item is named rather than guessed.",
      },
      {
        q: "What if the array is on a tile or metal roof?",
        a: "Both are handled, and both change the analysis. Tile adds significant existing dead load, which is the case where framing capacity is genuinely in question rather than a formality. Metal roofs usually move the question from lag screws into clamp or seam attachment, where the capacity comes from the manufacturer's tested values rather than from wood withdrawal.",
      },
      {
        q: "Can one letter cover a whole batch of installs?",
        a: "Not as a single document. Each address has its own wind speed, exposure, framing, and array layout, and a letter that covered several would be sealing an opinion about houses nobody examined. Volume is handled by making each letter fast and the intake repeatable, not by generalizing the seal.",
      },
      {
        q: "Is a structural letter the same as a windstorm certificate?",
        a: "No. A structural letter addresses whether the roof framing and attachments handle the array. A WPI-8 windstorm certificate is a Texas Department of Insurance compliance document for construction in the fourteen seaward counties and part of Harris County, and it is required for windstorm insurance eligibility rather than for structural permitting. A coastal solar project often needs both.",
      },
    ],
    related: ["structural-letters-for-permits", "wpi-8-windstorm-certification", "beam-and-header-sizing-letters"],
    emphasisCities: ["houston", "san-antonio", "dallas", "lubbock", "el-paso", "mcallen"],
  },

  // ---------------------------------------------------------------- 02
  {
    slug: "manufactured-home-foundation-certification",
    name: "Manufactured Home Foundation Certifications",
    fullName: "Manufactured Home Foundation Certification",
    keyword: "manufactured home foundation certification",
    title: "Manufactured Home Foundation Certification Texas",
    description:
      "Sealed FHA and VA manufactured home foundation certifications in Texas, written to the HUD Permanent Foundations Guide and addressed to your lender.",
    h1: "Manufactured Home Foundation Certifications in Texas, FHA and VA",
    lede: "The engineer's certification an FHA, VA, or USDA file needs before a manufactured home closes: the foundation observed against the HUD Permanent Foundations Guide, requiring a licensed Texas PE seal.",
    evidenceMode: "site-visit",
    whoNeedsIt: [
      {
        who: "Mortgage loan officers and processors",
        why: "The underwriter's condition reads foundation certification by a licensed engineer, and the file does not clear to close without it.",
      },
      {
        who: "Realtors with a manufactured home under contract",
        why: "It is the condition most likely to surface late, and the one most likely to move a closing date when it does.",
      },
      {
        who: "Title companies and closing coordinators",
        why: "A certification that names the wrong borrower, the wrong serial number, or the wrong standard has to be reissued, and that is a week nobody has.",
      },
      {
        who: "Homeowners refinancing",
        why: "The requirement applies on refinances too, including streamline products where borrowers do not expect it.",
      },
    ],
    sections: [
      {
        heading: "What the certification is measured against",
        paragraphs: [
          "The technical standard is HUD's: the Permanent Foundations Guide for Manufactured Housing, dated September 1996, which HUD publishes as HUD-7584 and cites in its own reference material as HUD-4930.3G. HUD requires the certification to be completed by a licensed professional engineer or registered architect who is licensed or registered in the state where the manufactured home is located, attesting that the foundation complies with that guide.",
          "VA and USDA files routinely carry the same condition, and in practice the same document satisfies it, but the requirement in any given file comes from the lender's written condition rather than from a single rule that reads the same across every program. That is why the loan type and the condition language are both asked for at intake instead of assumed.",
        ],
      },
      {
        heading: "What gets looked at on site",
        paragraphs: [
          "The observation is of the foundation system as built, which means somebody has to be under the home with a light. The items below are the recurring ones in Texas, and the last three are the ones that most often come back as deficiencies.",
        ],
        bullets: [
          "Footings: type, size, and bearing, and whether they extend below the local frost or design depth.",
          "Piers: spacing, height, construction, and whether piers over a certain height are reinforced.",
          "Anchorage and tie-downs: presence, type, condition, and connection to both the frame and the footing.",
          "Perimeter enclosure: a continuous, permanent enclosure of the crawl space, properly vented and accessible.",
          "The HUD data plate and certification labels, and the home's serial and HUD label numbers, which have to match the loan file.",
          "Site drainage away from the foundation, which is a real structural item in Texas clay and not a cosmetic note.",
          "Evidence that the towing hitch, axles, and wheels have been removed, which is part of what makes the home real property.",
        ],
      },
      {
        heading: "Why a Texas engineer, specifically",
        paragraphs: [
          "The certification must be sealed by an engineer licensed in the state where the property sits. A certification from an out of state engineer is not a document a Texas underwriter can accept, and discovering that late is expensive.",
          "Texas also has its own soil problem. Large parts of the state sit on highly expansive clay, and a pier and anchor system that would be unremarkable in a stable soil region behaves differently through a Texas summer. That shows up in the observation as differential movement, and it is worth an engineer who reads it as a soil signal rather than as a construction defect.",
        ],
      },
      {
        heading: "When the foundation does not comply",
        paragraphs: [
          "A deficient foundation is a common outcome, particularly on older homes and on homes that were sited before the current guide existed. What comes back in that case is a list of the specific items that do not comply and what would bring each into compliance. Once the corrections are made, the home is re-observed and the certification is issued against what is actually there.",
          "Nobody will tell a loan officer in advance that a certification will be issued. The seal means the engineer observed the foundation and found that it complies. That statement is worth something precisely because it is not available on request.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed certification letter addressed to the lender, referencing HUD-7584.",
      "The property address, borrower name, and the home's serial and HUD label numbers as observed.",
      "The foundation system described as built: footings, piers, anchorage, and enclosure.",
      "A photo record of the observed conditions.",
      "Any non-complying items itemized, with what compliance would require.",
      "Digital PDF suitable for direct upload into the loan file.",
    ],
    evidence: [
      "Property address and access arrangements, including crawl space access.",
      "Borrower name and lender name exactly as they should appear on the certification.",
      "Loan type: FHA, VA, USDA, or conventional.",
      "The home's serial number and HUD label numbers if already known.",
      "Any prior foundation certification, engineering report, or permit records.",
      "The underwriter's written condition, if one has been issued.",
    ],
    turnaround: "Scheduled around a site observation, which is the item that sets the timeline rather than the writing.",
    faqs: [
      {
        q: "What is the difference between the FHA and the VA version?",
        a: "Technically very little. Both point at the HUD Permanent Foundations Guide for Manufactured Housing, HUD-7584, and both require a licensed engineer's certification. The differences are in how the lender wants it addressed and what else the file needs alongside it. Tell us the loan type at intake and the certification is written for that program.",
      },
      {
        q: "Do you have to go under the home?",
        a: "Yes. The footings, piers, and anchorage are the certification, and none of them are visible from the outside. A certification issued without crawl space access would be an opinion about a foundation nobody saw. If access is blocked, that is reported rather than worked around.",
      },
      {
        q: "How long is a foundation certification good for?",
        a: "It is a statement about conditions observed on a specific date, not a warranty with a term. Most lenders will accept a recent certification and many will accept a prior one if nothing about the foundation has changed, but that call belongs to the underwriter. Ask them before paying for a second one.",
      },
      {
        q: "The home already has a certification from a previous sale. Can we reuse it?",
        a: "Often, yes, and it is worth asking the underwriter first. What usually blocks reuse is a borrower name on the old letter, an addressee that is a different lender, or a gap long enough that the underwriter wants current conditions. If it is rejected, the reason is normally one of those three rather than anything about the foundation.",
      },
      {
        q: "Does the certification cover the condition of the home itself?",
        a: "No. It addresses the foundation system against the HUD guide. Roof, plumbing, electrical, appliances, and the general condition of the home are a home inspection, which is a different scope and a different professional. If a roof letter is also needed for the same file, that is a separate deliverable.",
      },
    ],
    related: ["foundation-inspection-reports", "roof-certification-letters", "foundation-repair-plans"],
    emphasisCities: ["san-antonio", "houston", "tyler", "waco", "killeen", "victoria", "alice", "laredo"],
  },

  // ---------------------------------------------------------------- 03
  {
    slug: "roof-certification-letters",
    name: "Roof Certification Letters",
    fullName: "Roof Certification Letter",
    keyword: "roof certification letter",
    title: "Roof Certification Letter Texas | Sealed by a PE",
    description:
      "Sealed roof certification letters for Texas lenders and closings. Condition observed, deficiencies named, remaining useful life estimated.",
    h1: "Roof Certification Letters in Texas, Sealed by a Licensed PE",
    lede: "The letter an underwriter asks for when the appraiser flags the roof: condition observed, deficiencies named, and an estimate of remaining useful life, sealed by an engineer.",
    evidenceMode: "site-visit",
    whoNeedsIt: [
      {
        who: "Lenders and loan officers",
        why: "An appraisal that notes roof wear usually turns into a condition requiring a certification of remaining useful life before closing.",
      },
      {
        who: "Realtors and transaction coordinators",
        why: "It appears late, it holds a closing, and a roofing contractor's letter is sometimes rejected where an engineer's is not.",
      },
      {
        who: "Homeowners and sellers",
        why: "A sealed letter is a defensible answer to a buyer or an underwriter asking how much life the roof has left.",
      },
    ],
    sections: [
      {
        heading: "What a roof certification letter covers",
        paragraphs: [
          "A roof certification is an observation of the roof covering and the visible components that keep water out, followed by an engineer's estimate of how much serviceable life remains. Lenders typically want to see a stated number of years, most often two, three, or five, because that is what their guidelines are written around.",
          "The observation covers the covering material and its condition, flashing at penetrations and transitions, valleys, ridge and hip treatment, visible fastener condition, drainage and gutters, and evidence of active or prior leakage where it can be seen from the interior. Where the attic is accessible, decking condition and staining are looked at from underneath, which is where an old leak that has been patched over on the outside actually shows.",
        ],
      },
      {
        heading: "What it deliberately does not cover",
        paragraphs: [
          "This is the section most worth reading, because the gap between what a roof certification says and what people assume it says is where disputes come from.",
        ],
        bullets: [
          "It is not a warranty or a guarantee. Nobody is promising the roof will not leak.",
          "It is not a structural evaluation of the roof framing. That is a separate scope and a separate letter.",
          "It does not report on what is underneath the covering where the covering was not removed.",
          "It is not an insurance claim document, and nothing in it is written to support a claim.",
          "It does not certify installation quality or code compliance of work performed by others.",
        ],
      },
      {
        heading: "The Texas conditions that shorten roof life",
        paragraphs: [
          "Texas is hard on roofs in three specific ways, and an engineer looking at a Texas roof is looking for all three. Ultraviolet exposure and sustained summer heat age asphalt shingle faster here than the manufacturer's rated life suggests, particularly on south and west facing planes. Hail is a regional certainty across the northern and central parts of the state, and the question on an older roof is usually not whether it has taken hail but whether the resulting damage is functional or cosmetic.",
          "Wind is the third, and it varies enormously by region. A roof on the coast has been through a different service life than one in the Hill Country, and the observation reads the fastener and edge condition accordingly.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed letter addressed to the lender or the requesting party.",
      "Roof covering type, approximate age where it can be established, and observed condition.",
      "Deficiencies itemized, separated into items affecting serviceability and items that are cosmetic.",
      "An estimate of remaining useful life stated in years.",
      "A photo record of the observed conditions.",
      "Digital PDF suitable for direct upload into a loan file.",
    ],
    evidence: [
      "Property address and access arrangements.",
      "The addressee exactly as the lender wants it written.",
      "The underwriter's condition language, if one has been issued.",
      "Roof age, prior repairs, or any roofing invoices the owner has.",
      "Attic access location, if there is one.",
    ],
    turnaround: "Scheduled around a site observation. Weather moves it, and nothing else does.",
    faqs: [
      {
        q: "Will a roofing contractor's letter work instead?",
        a: "Sometimes. Some lenders accept a licensed roofing contractor's certification and some specifically require a professional engineer, usually when the contractor also stands to be paid for the repair. Read the condition language before choosing, because ordering the wrong one costs a week.",
      },
      {
        q: "Can you tell me the roof will pass before you look at it?",
        a: "No, and any engineer who would should worry you. The letter is worth something to an underwriter because the conclusion follows the observation rather than the request. What can be said in advance is exactly what will be looked at and exactly what the letter will contain.",
      },
      {
        q: "Does it cover hail damage for an insurance claim?",
        a: "No. A roof certification is written for a lender or a transaction and is not a claim document. Hail damage is observed and reported as a condition finding where present, but nothing in the letter is framed to support a claim, and Sealed Engineering does not solicit or prepare insurance claim work.",
      },
      {
        q: "What if the roof needs work?",
        a: "The deficiencies are itemized and the remaining life is estimated as observed. If repairs are made afterward, the roof can be re-observed and a letter issued against the corrected condition. That sequence is normal and it is faster than it sounds.",
      },
      {
        q: "Do you get on the roof?",
        a: "Where it is safe and the pitch and covering allow it, yes, because walking a roof shows things a ground level observation does not. Where it is not safe, the observation is made from a ladder at the eave and from the ground with optics, and the letter says which method was used.",
      },
    ],
    related: ["foundation-inspection-reports", "manufactured-home-foundation-certification", "repair-specification-letters"],
    emphasisCities: ["dallas", "fort-worth", "houston", "san-antonio", "amarillo", "abilene"],
  },

  // ---------------------------------------------------------------- 04
  {
    slug: "foundation-inspection-reports",
    name: "Foundation Inspection Reports",
    fullName: "Foundation Inspection Report",
    keyword: "foundation inspection report",
    title: "Foundation Inspection Report Texas | PE Sealed",
    description:
      "Sealed foundation inspection reports for Texas slabs and pier and beam homes. Elevation survey, distress documented, and an engineer's opinion on movement.",
    h1: "Foundation Inspection Reports in Texas, Sealed by a Licensed PE",
    lede: "An independent engineering opinion on what a foundation is actually doing: a relative elevation survey, documented distress, and a conclusion that is not written by anyone selling piers.",
    evidenceMode: "site-visit",
    whoNeedsIt: [
      {
        who: "Buyers under contract",
        why: "A general inspector flagged foundation movement and the option period is running.",
      },
      {
        who: "Homeowners with a repair estimate in hand",
        why: "A foundation repair company's free evaluation is a sales call. An engineer's report is the second opinion that costs money and answers the question.",
      },
      {
        who: "Lenders and underwriters",
        why: "A condition citing structural concerns needs a licensed engineer's assessment, not a contractor's proposal.",
      },
      {
        who: "Realtors",
        why: "A sealed report ends a negotiation argument faster than three competing repair bids.",
      },
    ],
    sections: [
      {
        heading: "What the inspection actually measures",
        paragraphs: [
          "The centerpiece is a relative elevation survey. A digital level is walked through the interior on a grid, and the resulting elevations are reduced to a contour of how the floor sits relative to itself. That is what converts a homeowner's impression that the house feels off into a number, and it is what makes a second inspection years later meaningful, because there is something to compare against.",
          "Around that, the report documents distress: cracking in brick veneer and interior finishes with direction and width, doors and windows out of square, separation at trim and ceilings, and slab or beam condition where it is visible. In a pier and beam home the crawl space is entered and the beams, piers, shims, and joists are looked at directly.",
          "Then the site itself, because in Texas the site is usually the cause. Drainage and grade against the foundation, gutter discharge, irrigation placement, plumbing leak evidence, and large trees close enough for their root systems to be drawing moisture out from under a corner of the slab.",
        ],
      },
      {
        heading: "Texas clay, and why movement is not automatically damage",
        paragraphs: [
          "Much of populated Texas sits on highly expansive clay. Those soils swell when they take on water and shrink when they lose it, and a slab on grade foundation built on them moves seasonally by design. The Texas Section of the American Society of Civil Engineers publishes Guidelines for the Evaluation and Repair of Residential Foundations, adopted in 2002 and now in its third version adopted in March 2022, addressing exactly this problem. The guidelines define levels of investigation, and the central idea in them is that deflection has to be judged against what the structure tolerates rather than against a flat plane.",
          "This is why an honest report frequently concludes that a foundation is performing within tolerance despite visible cracking, and why a report that concludes every foundation needs piers is telling you more about who wrote it than about the house.",
        ],
      },
      {
        heading: "What the report concludes, and what it does not",
        paragraphs: [
          "The conclusion states what was measured, whether the observed deflection and distress are consistent with normal seasonal movement or with something progressive, and what the recommended course is. That recommendation is often maintenance rather than construction: correct the grade, move the downspouts, establish consistent perimeter moisture, and re-survey after a full seasonal cycle.",
          "Where repair is warranted, the report says so and describes the type of repair the conditions call for. It does not name a contractor and it does not quote a price. If a sealed repair plan is needed afterward for permitting or for bidding, that is a separate deliverable, and it is written against this report.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed report on engineering letterhead.",
      "A relative elevation survey with the measured grid and the resulting contour.",
      "Documented distress: locations, descriptions, and photographs.",
      "Site and drainage observations, including trees and moisture sources.",
      "An engineering opinion on whether observed movement is within tolerance.",
      "Recommendations, which may be maintenance, monitoring, or repair.",
    ],
    evidence: [
      "Property address and access, including crawl space access on pier and beam homes.",
      "Foundation type if known: slab on grade, post tensioned slab, or pier and beam.",
      "Any prior engineering report, repair invoice, or repair company evaluation.",
      "The specific concern that prompted the inspection.",
      "Approximate age of the home and any known plumbing leak history.",
    ],
    turnaround: "Scheduled around a site visit, with the elevation survey performed on site.",
    faqs: [
      {
        q: "Is this the same as the free evaluation a foundation repair company offers?",
        a: "No. A repair company's evaluation is performed by somebody whose employer is paid when the answer is yes. An engineering report is performed by a licensed engineer with no financial interest in the repair, and it carries a seal that puts the engineer's license behind the conclusion. The two documents are not interchangeable and lenders know the difference.",
      },
      {
        q: "My house has cracks. Does that mean the foundation failed?",
        a: "Usually not. Cracking in brick veneer and drywall is extremely common on expansive clay and much of it reflects seasonal movement the structure tolerates. What the report does is separate cosmetic distress from evidence of progressive movement, which is a distinction you cannot make from a photograph of a crack.",
      },
      {
        q: "Will the report tell me what repairs cost?",
        a: "No. Cost is a contractor's number and it varies by market and by season. The report establishes what the foundation is doing and what class of remedy the conditions call for, which is what you need before asking anyone for a price.",
      },
      {
        q: "Can you inspect a post tensioned slab?",
        a: "Yes. Post tensioned slabs are extremely common in Texas residential construction and they are surveyed the same way. What changes is the interpretation: a post tensioned slab is designed to behave as a stiffened plate and its tolerance for deflection is read differently than a conventionally reinforced slab.",
      },
      {
        q: "How soon can it be re-inspected to see if movement is continuing?",
        a: "A meaningful comparison needs a full seasonal cycle, so roughly a year, because a survey taken at the end of a wet spring and one taken at the end of a dry August will differ on a foundation that is behaving perfectly normally. Shorter intervals are useful only when something acute is suspected.",
      },
    ],
    related: ["foundation-repair-plans", "manufactured-home-foundation-certification", "repair-specification-letters"],
    // san-angelo added 2026-08-18. It was the one Tier 1 city no service page
    // named, so no money page pointed at it. This is the right list for it
    // rather than a convenient one: the San Angelo page is built on differential
    // bearing, where depth to limestone changes across a single lot and part of
    // a foundation rests on rock while the rest rests on clay. That is a
    // foundation inspection problem before it is anything else.
    emphasisCities: ["houston", "dallas", "fort-worth", "san-antonio", "austin", "waco", "college-station", "round-rock", "san-angelo"],
  },

  // ---------------------------------------------------------------- 05
  {
    slug: "wpi-8-windstorm-certification",
    name: "WPI-8 Windstorm Certifications",
    fullName: "WPI-8 Windstorm Certification",
    keyword: "WPI-8 windstorm certification",
    title: "WPI-8 Windstorm Certification Texas | Engineer",
    description:
      "WPI-8 windstorm certification in the Texas seaward counties through the engineer path. Inspections, documentation, and TDI submission by a licensed PE.",
    h1: "WPI-8 Windstorm Certifications for the Texas Coast",
    lede: "The Texas Department of Insurance certificate of compliance that windstorm coverage depends on, obtained through the licensed engineer path rather than the TDI inspector queue.",
    evidenceMode: "site-visit",
    whoNeedsIt: [
      {
        who: "Coastal homeowners",
        why: "TWIA windstorm coverage requires a certificate of compliance for construction, and without coverage the mortgage does not stay in place.",
      },
      {
        who: "Builders and remodelers in the seaward counties",
        why: "Any addition, reroof, window replacement, or new structure in the designated catastrophe area triggers the requirement.",
      },
      {
        who: "Roofing contractors on the coast",
        why: "A reroof without a certificate leaves the owner with a coverage gap they discover at renewal.",
      },
      {
        who: "Realtors and lenders closing coastal property",
        why: "Missing WPI-8 documentation on prior work is one of the most common late surprises in a coastal file.",
      },
    ],
    sections: [
      {
        heading: "Where the requirement applies",
        paragraphs: [
          "The Texas Department of Insurance designates a catastrophe area along the coast. It covers fourteen seaward counties in full, Aransas, Brazoria, Calhoun, Cameron, Chambers, Galveston, Jefferson, Kenedy, Kleberg, Matagorda, Nueces, Refugio, San Patricio, and Willacy, plus, in the department's own wording, parts of Harris County east of Highway 146. TDI names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres among the Harris County areas covered.",
          "Inside that area, construction has to comply with the windstorm building code, and compliance has to be documented before the Texas Windstorm Insurance Association will write or continue wind and hail coverage on it. The document that records it is a certificate of compliance, and which certificate depends on whether the work is ongoing or already finished.",
        ],
      },
      {
        heading: "Ongoing construction and completed construction are two different processes",
        paragraphs: [
          "This is the distinction that decides everything else, and it is the one most often got wrong. TDI treats work that has not started yet and work that is already finished as separate processes with separate forms and separate certificates.",
          "For ongoing construction, Form WPI-1, the Application for Certificate of Compliance, is filed with TDI before construction begins. Inspections are then performed while the work is underway, by either a TDI windstorm inspector or an appointed Texas licensed professional engineer. TDI is explicit that inspections must happen during the work rather than before or after it, which is precisely why covering something up ends this route. On completion the inspector or engineer submits the WPI-1 and the applicable WPI-2-BC forms, and TDI issues the WPI-8 Certificate of Compliance. TDI charges no fee for its own inspectors, and that path moves at the speed of the inspector queue.",
          "For completed construction, where no WPI-1 was ever filed, the route is different in a way that matters. TDI states that any professional engineer licensed by the Texas Board of Professional Engineers and Land Surveyors may perform inspections on completed construction, so appointment is not required here as it is for ongoing work. The engineer submits Form WPI-2E, the Completed Construction Inspection Form, together with a sealed post-construction inspection report and supporting documentation, or a sealed design. TDI then issues a WPI-8E certificate rather than a WPI-8.",
          "One piece of history worth knowing if you are reading old paperwork: certificates numbered WPI-8C were issued by the Texas Windstorm Insurance Association for completed construction between January 1, 2017 and May 31, 2020. A WPI-8C in a file is not a WPI-8E and was issued by a different body.",
          "Work finished years ago with nothing filed is the most common reason a coastal file reaches an engineer, and the completed construction route is the remedy for it.",
        ],
      },
      {
        heading: "What gets evaluated",
        paragraphs: [
          "The evaluation is against the wind load requirements that apply at the specific site, which on the Texas coast are among the highest in the country. The load path is the whole question: wind pressure on the envelope has to travel through the sheathing into the framing, through the framing into the walls, and through the walls into the foundation, with a connection at every one of those transitions that is capable of carrying it.",
        ],
        bullets: [
          "Roof covering and its attachment, including fastener pattern and edge treatment.",
          "Roof deck attachment to the framing.",
          "Roof to wall connections, which is where the load path most often fails on older coastal homes.",
          "Wall to foundation anchorage.",
          "Opening protection: windows, doors, and garage doors, and their impact and pressure ratings.",
          "Product approvals and evaluation reports for the specific assemblies installed.",
        ],
      },
      {
        heading: "Evidence for completed work",
        paragraphs: [
          "Work that is already covered up is the hard case. Connections cannot be evaluated by looking at a finished ceiling, so the evaluation depends on what can be exposed, what can be reached from the attic, and what documentation exists from when the work was done. Photographs taken during construction are worth a great deal here, and contractors on the coast should be taking them for every job whether or not anybody has asked.",
          "Where the evidence does not support certification, the certification is not issued. That is an uncomfortable outcome and it is the correct one, because a WPI-8 that does not reflect the building is a coverage problem that surfaces at the worst possible moment.",
        ],
      },
    ],
    deliverable: [
      "Site inspection of the work by a professional engineer licensed by the Texas Board of Professional Engineers and Land Surveyors.",
      "Evaluation against the applicable windstorm building code requirements for the site.",
      "For completed construction: Form WPI-2E with a sealed post-construction inspection report and supporting documentation, prepared for submission to TDI.",
      "A photo and documentation record supporting the certification.",
      "Any items that must be corrected before certification, itemized.",
      "Coordination through to the certificate TDI issues, a WPI-8E for completed construction.",
    ],
    evidence: [
      "Property address and county, so the applicable requirements are the right ones.",
      "Scope of the work: new construction, addition, reroof, window or door replacement, or other.",
      "Approximate date the work was completed, if it is already done.",
      "Any WPI-1 application, prior WPI-8, or permit records.",
      "Construction photographs, especially of connections and fastening before cover.",
      "Product approvals, evaluation reports, or manufacturer documentation for installed assemblies.",
    ],
    turnaround: "Set by the site inspection and by TDI processing, which is outside anyone's control but is tracked through to issuance.",
    faqs: [
      {
        q: "Do I need a WPI-8 if I am not on the coast?",
        a: "No. The requirement applies only inside the TDI designated catastrophe area: the fourteen seaward counties and the part of Harris County east of Highway 146. If the property is outside that area, there is no WPI-8 and no windstorm certificate to obtain.",
      },
      {
        q: "The roof was replaced two years ago and nobody filed anything. Is it too late?",
        a: "Not necessarily. That is completed construction, and TDI has a route for it: any engineer licensed by the Texas Board of Professional Engineers and Land Surveyors may inspect completed work and submit Form WPI-2E with a sealed post-construction report, after which TDI can issue a WPI-8E. What determines whether it succeeds is the evidence: what can be inspected now, what can be exposed, and what documentation exists from the original work. Photographs taken during the reroof make an enormous difference.",
      },
      {
        q: "Does a WPI-8 mean my house is hurricane proof?",
        a: "No. It records that the specific work certified complies with the windstorm building code requirements that applied to it. It says nothing about the rest of the structure, it is not a prediction about any particular storm, and it is not a warranty.",
      },
      {
        q: "Is a WPI-8 the same thing as a windstorm insurance policy?",
        a: "No. The certificate is a compliance document issued by the Texas Department of Insurance. The policy is written by TWIA or by a private carrier. The certificate is what makes the property eligible for the coverage, and getting one does not by itself put a policy in force.",
      },
      {
        q: "Can the certification be issued without the engineer coming out?",
        a: "No. The engineer's certification is a statement about work that was inspected, and TDI's completed construction route is built around a sealed post-construction inspection report. That inspection is the certification, and there is no document route around it.",
      },
    ],
    related: ["roof-certification-letters", "structural-letters-for-permits", "solar-structural-letters"],
    emphasisCities: ["corpus-christi", "brownsville", "harlingen", "beaumont", "victoria", "houston"],
  },

  // ---------------------------------------------------------------- 06
  {
    slug: "structural-letters-for-permits",
    name: "Structural Letters for Permits",
    fullName: "Structural Letter for Permit",
    keyword: "engineer letter for permit",
    title: "Engineer Letter for Permit Texas | PE Sealed",
    description:
      "Sealed structural letters for Texas permit offices. When plan review asks for engineer sign-off on a wall, beam, addition, or retrofit.",
    h1: "Engineer Letters for Texas Permit Offices",
    lede: "Plan review asked for a sealed letter and the project stopped. This is the deliverable that restarts it: a specific structural question answered, sealed, and addressed to the reviewer who asked.",
    evidenceMode: "either",
    whoNeedsIt: [
      {
        who: "General contractors",
        why: "A plan review comment naming an engineer requirement stops the job until it is answered, and every day of that is a crew standing down.",
      },
      {
        who: "Remodelers",
        why: "Wall removals, structural modifications, and additions routinely draw an engineer condition, particularly in older housing stock.",
      },
      {
        who: "Homeowners pulling their own permit",
        why: "Owner-builder permits get the same plan review comments and there is no contractor to hand them to.",
      },
      {
        who: "Designers and drafters",
        why: "A set that is otherwise complete needs one sealed element, and carrying a full engineering relationship for it is not proportionate.",
      },
    ],
    sections: [
      {
        heading: "What plan review is usually asking for",
        paragraphs: [
          "Texas has no single statewide residential building code enforcement regime. Municipalities and counties adopt their own editions of the International Residential Code and International Building Code, amend them, and enforce them through their own plan review process. The result is that the same project draws different comments in Houston, in Austin, and in an unincorporated county.",
          "What is consistent is the shape of the comment. A reviewer asks for a sealed letter when the submitted documents do not establish that something structural works: a beam that is being sized by rule of thumb, a wall being removed without a stated replacement load path, a modification to trusses, an existing condition being reused, or a detail the code does not prescribe.",
          "The letter answers exactly that question, references the code edition the jurisdiction has adopted, and is addressed to the reviewer. A general letter that says the project appears adequate is not an answer and will draw the comment again.",
        ],
      },
      {
        heading: "The letters that come up most often",
        paragraphs: [
          "The list below is not exhaustive, and if a project sits outside it the intake will say so rather than promising a document that does not fit.",
        ],
        bullets: [
          "Load bearing wall removal, with the replacement beam, its bearing, and the load path down to foundation.",
          "Existing framing adequacy for a new load: an addition above, a heavy fixture, mechanical equipment, or an array.",
          "Truss modification, including cut or damaged webs and field alterations.",
          "Attic or garage conversion, where existing framing designed for storage is being asked to carry occupancy.",
          "Retaining walls and small site structures under a jurisdiction's engineer threshold.",
          "Existing condition assessments for a change of use or an occupancy change.",
        ],
      },
      {
        heading: "What makes a letter get accepted the first time",
        paragraphs: [
          "Three things, and none of them are the engineering. The letter has to cite the code edition that jurisdiction actually adopted rather than the current one. It has to answer the reviewer's comment in the reviewer's terms rather than restating the project. And it has to be specific enough that the reviewer does not have to interpret it, which means naming members, spans, loads, and connections rather than concluding that the design is adequate.",
          "Sending the plan review comment itself at intake is the single most useful thing a contractor can do. It is the difference between a letter written to answer a question and a letter written to guess at one.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed letter addressed to the permit office and referencing the permit or plan review number.",
      "The adopted code edition the analysis is performed under.",
      "The specific question answered, in the terms the reviewer asked it.",
      "Members, spans, loads, connections, and bearing as applicable, stated numerically.",
      "Sketches or details where a detail is what the reviewer needs.",
      "Digital PDF with the seal applied, ready for the plan review portal.",
    ],
    evidence: [
      "The plan review comment or correction notice, verbatim.",
      "The jurisdiction and the permit or project number.",
      "Plans, drawings, or sketches of the work as proposed.",
      "Existing framing information: member sizes, spans, spacing, and species where known.",
      "Photographs of the existing conditions, including the area being modified.",
      "Property address, so wind and seismic parameters are the real ones for the site.",
    ],
    turnaround: "Usually a document review. A site visit is added only when the existing conditions cannot be established from what is submitted.",
    faqs: [
      {
        q: "Can you write the letter without seeing the house?",
        a: "Often, yes. If the existing framing can be established from photographs, measurements, and drawings, the letter is a document review. If it cannot, the honest answer is a site visit rather than a sealed opinion about a structure nobody looked at, and the intake will say which one applies before any work starts.",
      },
      {
        q: "My city rejected a letter from another engineer. Can this fix it?",
        a: "Usually, and the first step is reading the rejection. Most rejected letters fail for the same reasons: the wrong code edition, an answer that did not address the actual comment, or a conclusion stated without the supporting values the reviewer needed to see. Send the rejection and the original letter at intake.",
      },
      {
        q: "Is a letter enough, or does the project need drawings?",
        a: "It depends on what the reviewer asked for. A single beam or a single existing condition is usually a letter. A set of framing changes across a whole floor is usually a small plan set, and being told that at intake is better than paying for a letter that gets sent back.",
      },
      {
        q: "Do you work in unincorporated county areas?",
        a: "Yes. Unincorporated areas across Texas vary from no building permit at all to a county requirement that is stricter than the neighboring city. The intake establishes which applies before anything is written, because a letter addressed to an office that does not review residential permits is wasted paper.",
      },
      {
        q: "Can the letter be issued after the work is already built?",
        a: "Sometimes, and that changes the scope. An evaluation of completed work is an existing condition assessment, and what can be certified depends entirely on what can be observed or exposed. Concealed connections are the usual limit.",
      },
    ],
    related: ["beam-and-header-sizing-letters", "repair-specification-letters", "carport-and-patio-cover-plans"],
    emphasisCities: ["austin", "houston", "dallas", "fort-worth", "el-paso", "round-rock", "college-station"],
  },

  // ---------------------------------------------------------------- 07
  {
    slug: "beam-and-header-sizing-letters",
    name: "Beam and Header Sizing Letters",
    fullName: "Beam and Header Sizing Letter",
    keyword: "beam sizing letter engineer",
    title: "Beam and Header Sizing Letter Texas | PE Sealed",
    description:
      "Sealed beam and header sizing letters for Texas wall removals and openings. Member sized, bearing checked, and the load path carried to the foundation.",
    h1: "Beam and Header Sizing Letters, Sealed by a Texas PE",
    lede: "Taking a wall out, or opening one up. The beam gets sized against the real loads, the bearing gets checked, and the load path gets followed all the way down instead of stopping at the ceiling.",
    evidenceMode: "either",
    whoNeedsIt: [
      {
        who: "Remodeling contractors",
        why: "Open concept renovations are the most common structural permit item in Texas residential work, and the one plan review asks about most.",
      },
      {
        who: "Homeowners removing a wall",
        why: "The lumberyard span table does not know what is above the wall, and the permit office knows it does not.",
      },
      {
        who: "Builders adding openings",
        why: "Wide sliders, garage door widenings, and new window openings all shift load into a header that has to be sized for it.",
      },
    ],
    sections: [
      {
        heading: "What sizing a beam actually involves",
        paragraphs: [
          "The beam itself is the easy part. What the wall carries is the hard part, and it is where most rule of thumb sizing goes wrong.",
          "The analysis starts with tributary width: how much of the roof and floor above actually lands on this wall. That depends on whether the framing above spans across the wall or bears on it, whether there is a second floor, whether the roof is stick framed or trussed, and whether the trusses are simple span or bear at an interior point. A wall that looks load bearing and is not, and a wall that looks like a partition and is carrying half a roof, are both common in Texas housing stock.",
          "Then the loads: dead load of the construction above, live load per the adopted code for the occupancy, and roof live or snow load as the jurisdiction requires. Deflection usually governs on longer residential spans rather than bending, which is why a beam that is strong enough can still be the wrong beam.",
          "Then the material: dimensional lumber built up, engineered lumber such as LVL or PSL, or steel. Each has different depth for a given span, and depth is often what decides the answer because the ceiling height that can be given up is fixed.",
        ],
      },
      {
        heading: "The part that gets skipped: the load path down",
        paragraphs: [
          "A beam concentrates what used to be a distributed load into two points. Those points now have to be carried by something. That means jack and king studs sized for the reaction, a bearing condition at each end that does not crush the plate, and a path from that bearing through the floor framing below into the foundation.",
          "On a slab on grade this is usually straightforward and still has to be stated. On a pier and beam home, or on a second floor opening, the point load frequently lands somewhere that was never designed for it, and the correct answer includes a post, a footing, or a beam below. A sizing letter that stops at the header is a letter that will either be rejected in plan review or, worse, accepted and built.",
        ],
      },
      {
        heading: "What comes back",
        paragraphs: [
          "The letter names the member, the span, the material and grade, the bearing required at each end, the studs or posts carrying the reaction, and what happens below them. Where a temporary shoring condition matters, it is stated. Where the existing conditions could not be verified and the design depends on an assumption, the assumption is written down rather than buried.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed letter with the beam or header specified by size, material, and grade.",
      "The design loads, tributary width, and code edition used.",
      "Required bearing length at each end, and the jack and king stud count.",
      "The load path below the bearing points, stated to the foundation.",
      "A framing sketch where the condition needs one to be unambiguous.",
      "Digital PDF with the seal applied, ready for the permit portal.",
    ],
    evidence: [
      "Photographs of the wall, both sides, plus what is directly above it.",
      "The clear opening width wanted, and the ceiling height available for beam depth.",
      "Attic photographs showing the framing above the wall: rafters, trusses, or floor joists, with direction.",
      "Floor plan or a dimensioned sketch showing where the wall sits.",
      "Number of stories, roof type, and roof covering.",
      "Foundation type: slab on grade or pier and beam.",
      "Property address and jurisdiction.",
    ],
    turnaround: "A document review when the attic photographs establish the framing. A site visit only when they cannot.",
    faqs: [
      {
        q: "How do I know if the wall is load bearing?",
        a: "The reliable test is what is above it, not what it looks like. A wall running perpendicular to the joists or rafters above and supporting their ends is bearing. A wall running parallel between them usually is not. Trusses complicate it, because a truss can be designed to bear at an interior point. Attic photographs answer it, which is why they are the first thing the intake asks for.",
      },
      {
        q: "Can I just use a span table from the lumberyard?",
        a: "A span table tells you what a member can carry. It does not tell you what this wall is carrying, whether the bearing at each end is adequate, or what happens to the point loads below. That gap is why plan review asks for a sealed letter on wall removals, and it is where the failures actually occur.",
      },
      {
        q: "Will I need a steel beam?",
        a: "Sometimes, usually when the span is long and the available depth is short. Engineered lumber covers most residential openings and is far easier to install without a crane. What decides it is span, load, and the ceiling height you are willing to lose, and the letter will say which one the conditions support rather than defaulting to the expensive answer.",
      },
      {
        q: "What if the wall has already been removed?",
        a: "That is an existing condition assessment rather than a design, and it can still be sealed. What is possible depends on what can be observed: the temporary or permanent support in place, the framing above, and whether anything has moved. Say so at intake, because it changes the scope and the honest scope is cheaper than a rejected letter.",
      },
      {
        q: "Does this cover the foundation under the new point loads?",
        a: "The letter follows the load path down and states what is required at the foundation. Where an existing footing is inadequate and a new one is required, that is specified. Where the existing foundation cannot be evaluated from what was submitted, that limitation is written into the letter rather than assumed away.",
      },
    ],
    related: ["structural-letters-for-permits", "repair-specification-letters", "foundation-repair-plans"],
    emphasisCities: ["austin", "dallas", "houston", "fort-worth", "san-antonio", "round-rock"],
  },

  // ---------------------------------------------------------------- 08
  {
    slug: "repair-specification-letters",
    name: "Repair Specification Letters",
    fullName: "Repair Specification Letter",
    keyword: "engineer repair specification letter",
    title: "Repair Specification Letter Texas | Sealed by PE",
    description:
      "Sealed repair specification letters for Texas structural damage. The repair method, members, and connections specified in buildable detail.",
    h1: "Repair Specification Letters, Sealed by a Texas PE",
    lede: "Something structural is damaged and somebody has to say exactly how it gets fixed. This is that document: the repair specified in buildable detail, sealed, and written so plan review and the contractor read the same thing.",
    evidenceMode: "either",
    whoNeedsIt: [
      {
        who: "General contractors",
        why: "A damaged member cannot be repaired on judgment when the permit office is watching, and a specification protects the contractor as much as the building.",
      },
      {
        who: "Property owners with structural damage",
        why: "A sealed specification turns a vague repair conversation into a defined scope that three contractors can bid on the same terms.",
      },
      {
        who: "Framers and truss installers",
        why: "A cut or damaged truss cannot be repaired without an engineer's specification, and the truss manufacturer will say the same thing.",
      },
      {
        who: "Property managers",
        why: "Documented, sealed repair scope is what closes a habitability or code enforcement item cleanly.",
      },
    ],
    sections: [
      {
        heading: "What a repair specification contains",
        paragraphs: [
          "A repair specification is a design for a repair. It identifies the damaged element, states what the element is required to carry, and specifies the repair in enough detail that a competent framer can build it without calling anyone: members, sizes, grades, fastener type and pattern, plate or plywood dimensions where a scab or gusset is used, and the sequence where sequence matters.",
          "Where the repair depends on shoring, the shoring is part of the specification. Where the repair cannot be executed as described without exposing something, that is stated too, along with what happens if what gets exposed is worse than expected.",
        ],
      },
      {
        heading: "The damage this usually addresses",
        paragraphs: [
          "The situations below account for most of the volume, and the truss cases are the most urgent of them because a modified truss is frequently carrying more than the person who cut it realized.",
        ],
        bullets: [
          "Cut, drilled, or notched joists and rafters, usually where a plumber or an HVAC installer needed a path.",
          "Cut or damaged truss webs and chords, including field modifications made without approval.",
          "Rot and termite damage at sill plates, band joists, beam ends, and posts.",
          "Fire damaged framing, where charred members have to be evaluated for residual section.",
          "Impact damage from vehicles, falling trees, or equipment.",
          "Water damaged floor framing and subfloor, particularly at bathrooms and exterior walls.",
        ],
      },
      {
        heading: "What this document is not",
        paragraphs: [
          "It is not an insurance claim document. Sealed Engineering does not prepare claim support, does not solicit claim work, and does not write anything framed to argue causation for a carrier. A repair specification says what the repair is, not who should pay for it.",
          "It is also not a cause and origin investigation. If the question being asked is why the damage happened rather than how it gets fixed, that is a different engagement and the intake will say so rather than delivering a document that does not answer the question that was asked.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed letter identifying the damaged element and its required capacity.",
      "The repair specified: members, sizes, grades, and fastener type, size, and pattern.",
      "Details or sketches for scabs, gussets, sisters, posts, and connections.",
      "Shoring and sequencing requirements where the repair depends on them.",
      "Any conditions requiring re-evaluation once concealed areas are opened.",
      "Digital PDF with the seal applied, suitable for permit submission and for the contractor.",
    ],
    evidence: [
      "Photographs of the damage from several angles, with something in frame for scale.",
      "The member size, span, spacing, and what it supports.",
      "The extent of the damage: length, depth, and how much section is lost.",
      "What caused it, if known, and when.",
      "Whether the area is accessible or has to be opened.",
      "Property address, jurisdiction, and any code enforcement or plan review notice.",
    ],
    turnaround: "Frequently a document review from photographs and measurements. A site visit when the extent of damage cannot be established remotely.",
    faqs: [
      {
        q: "A plumber cut through a floor joist. Is that repairable?",
        a: "Usually yes, and the repair depends on where the cut is along the span and how much of the section is gone. A notch near a bearing point and a hole through the middle third are very different problems. Photographs with a tape measure in frame answer it faster than any description.",
      },
      {
        q: "Somebody cut a truss web. How serious is that?",
        a: "Serious enough to treat as urgent. Trusses are engineered systems where every member is carrying load, and cutting one redistributes forces the rest were not designed for. Do not load the area, and get the specification before anything else happens in that space. Truss manufacturers will not approve field modifications, which is why this reaches an engineer.",
      },
      {
        q: "Can fire damaged framing be repaired rather than replaced?",
        a: "Sometimes. Charring is self limiting and a member can retain useful section beneath it, but that has to be measured rather than assumed, and heat affected steel connectors are a separate question from the wood. What the specification does is separate what can stay from what has to go, which usually reduces the scope compared with replacing everything in the room.",
      },
      {
        q: "Will my city accept a letter, or does it need drawings?",
        a: "For a single damaged member a sealed letter with a detail is normally what the reviewer wants. Multiple members across an area, or anything altering the structural system, tends toward a small plan set. The intake establishes which before work starts.",
      },
      {
        q: "Can you write this for my insurance claim?",
        a: "No. Sealed Engineering does not prepare insurance claim documentation and does not write anything intended to support a claim. If a repair specification is needed for permitting or for contracting, that is what this deliverable is, and what a carrier does with it afterward is between the owner and the carrier.",
      },
    ],
    related: ["structural-letters-for-permits", "beam-and-header-sizing-letters", "foundation-repair-plans"],
    emphasisCities: ["houston", "dallas", "san-antonio", "beaumont", "tyler", "waco"],
  },

  // ---------------------------------------------------------------- 09
  {
    slug: "carport-and-patio-cover-plans",
    name: "Carport and Patio Cover Plans",
    fullName: "Carport and Patio Cover Plan Set",
    keyword: "carport plans engineer sealed",
    title: "Carport and Patio Cover Plans Texas | PE Sealed",
    description:
      "Sealed carport and patio cover plans for Texas permits. Footings, posts, beams, and uplift connections designed for the wind speed at the actual address.",
    h1: "Sealed Carport and Patio Cover Plans for Texas Permits",
    lede: "A small plan set that passes plan review: footing schedule, post and beam sizes, and the uplift connections that matter more than anything else on a structure this light.",
    evidenceMode: "upload",
    whoNeedsIt: [
      {
        who: "Patio cover and carport contractors",
        why: "Nearly every Texas jurisdiction requires a sealed plan for an attached or freestanding cover, and a generic detail sheet gets rejected.",
      },
      {
        who: "Homeowners adding a cover",
        why: "The permit application asks for engineered plans and the supplier's brochure is not one.",
      },
      {
        who: "Metal building and awning dealers",
        why: "A stock plan drawn for another state does not carry the Texas wind speed at the buyer's address.",
      },
    ],
    sections: [
      {
        heading: "Why a light structure needs more engineering, not less",
        paragraphs: [
          "A patio cover is the most uplift sensitive residential structure there is. It is a large flat surface, it weighs almost nothing, and there is nothing on top of it to hold it down. The governing load case is almost never gravity. It is wind trying to lift the roof off and take the posts with it.",
          "That is why the connections carry the design. The roof panel to purlin connection, the purlin to beam connection, the beam to post connection, and the post to footing anchorage all have to develop net uplift, and the footing has to have enough mass and embedment to resist it. Undersized footings on patio covers are the single most common thing a plan reviewer catches, because the intuition that a light structure needs a light footing is exactly backwards.",
        ],
      },
      {
        heading: "Attached versus freestanding",
        paragraphs: [
          "Attached covers are simpler to build and harder to detail. The ledger connection into the existing house has to transfer both gravity and uplift into framing that was not designed for it, and on a Texas home that frequently means fastening through brick veneer or into a band joist whose condition nobody has looked at. The plan has to specify what the ledger fastens to and what fastener develops the load, not just that a ledger exists.",
          "Freestanding covers avoid the house entirely, which is often the better answer where the connection is questionable. The trade is a fourth line of posts and footings, and a lateral system that has to stand on its own rather than leaning on the building.",
        ],
      },
      {
        heading: "What the plan set includes",
        paragraphs: [
          "This is a small plan set rather than a letter, because a reviewer needs to see the geometry. It stays deliberately compact: enough sheets to build from and no more.",
        ],
        bullets: [
          "Cover sheet with the design criteria: code edition, wind speed, exposure category, and risk category.",
          "Foundation plan with a footing schedule: size, depth, reinforcement, and anchorage.",
          "Framing plan with post locations, beam sizes, purlin sizing, and spans.",
          "Connection details at every transition, sized for uplift.",
          "Sections showing heights, slope, and clearances.",
          "Notes covering material grades, fasteners, and inspection points.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed plan set sized for a residential permit submittal.",
      "Design criteria stated for the actual site: wind speed, exposure, and adopted code edition.",
      "Footing schedule with embedment and reinforcement.",
      "Post, beam, and purlin sizing with spans.",
      "Uplift connection details at ledger, beam, post, and footing.",
      "Digital PDF ready for the permit portal.",
    ],
    evidence: [
      "Property address and jurisdiction.",
      "Dimensions wanted: length, width, and height at the low point.",
      "Attached or freestanding, and where it sits relative to the house.",
      "Material: wood, steel, or aluminum, and the panel or roof product intended.",
      "Photographs of the area, including the wall the cover would attach to.",
      "Existing slab information if the posts land on one, including thickness if known.",
      "Any HOA or setback constraint that fixes the footprint.",
    ],
    turnaround: "Built from documents. No site visit unless an existing slab or attachment condition has to be verified.",
    faqs: [
      {
        q: "Can the posts sit on my existing patio slab?",
        a: "Sometimes, and it has to be checked rather than assumed. A typical residential patio slab is four inches with no thickened edge, which is not a footing and will not resist the uplift a cover generates. The usual answer is to core the slab and pour a pier beneath each post, which the plan will detail if that is what the conditions require.",
      },
      {
        q: "Do I really need a permit for a patio cover?",
        a: "In most Texas jurisdictions, yes, for anything attached and for most freestanding structures over a modest area. Some cities exempt very small covers. The permit office is the authority on it, and building without one on a structure that gets seen from the street is a hard thing to unwind later.",
      },
      {
        q: "The supplier gave me plans already. Are those enough?",
        a: "Only if they are sealed by a Texas engineer and carry the design criteria for your address. Stock plans drawn for a different state or a lower wind speed are the most common rejection in this category. Send what you have at intake and the answer is usually clear immediately.",
      },
      {
        q: "Can it be designed to have a fan, lights, or a TV mounted?",
        a: "Yes, and it should be said at intake rather than added later. A ceiling fan introduces a dynamic load and a mounting requirement, and a heavy mounted item changes the framing local to it. Both are easy to design for at the start and awkward to retrofit.",
      },
      {
        q: "Will this work for a carport that is also a garage later?",
        a: "That has to be designed for at the start. Enclosing a carport changes the wind load case completely, because an enclosed structure sees different internal pressures than an open one, and the lateral system has to change with it. Say so at intake and the plan can be developed for the eventual condition.",
      },
    ],
    related: ["structural-letters-for-permits", "beam-and-header-sizing-letters", "solar-structural-letters"],
    emphasisCities: ["san-antonio", "houston", "el-paso", "lubbock", "midland", "odessa", "laredo"],
  },

  // ---------------------------------------------------------------- 10
  {
    slug: "foundation-repair-plans",
    name: "Foundation Repair Plans",
    fullName: "Foundation Repair Plan",
    keyword: "foundation repair plan engineer",
    title: "Foundation Repair Plans Texas | Sealed by a PE",
    description:
      "Sealed foundation repair plans for Texas homes. Pier type, spacing, depth, and design load specified by an engineer with no stake in who does the work.",
    h1: "Foundation Repair Plans, Sealed by an Independent Texas PE",
    lede: "The repair designed before it is bid: pier type, locations, depth, and design load specified by an engineer who is not selling the piers.",
    evidenceMode: "site-visit",
    whoNeedsIt: [
      {
        who: "Homeowners with a repair proposal in hand",
        why: "A plan lets three companies bid the same scope instead of three different scopes at three prices that cannot be compared.",
      },
      {
        who: "Permit offices",
        why: "Many Texas jurisdictions require a sealed plan before a foundation repair permit is issued.",
      },
      {
        who: "Foundation repair contractors",
        why: "A sealed plan defines the scope, which protects the contractor from an argument about what was supposed to happen.",
      },
      {
        who: "Buyers and sellers negotiating a repair",
        why: "A defined scope is what turns a repair allowance into a number both sides can agree is right.",
      },
    ],
    sections: [
      {
        heading: "Why the plan comes before the bids",
        paragraphs: [
          "The normal sequence in Texas residential foundation repair is backwards. A company evaluates for free, proposes a pier count, and the homeowner collects two more proposals with different pier counts in different locations. Nothing about those three numbers is comparable, and the homeowner ends up choosing on price between three different repairs.",
          "A sealed repair plan inverts it. The engineer establishes what the foundation is doing, designs the remedy, and specifies where the piers go, how deep, and what each one has to carry. Then the same scope goes to three contractors and the bids are actually about price and workmanship.",
        ],
      },
      {
        heading: "What the design decides",
        paragraphs: [
          "Pier type is the first decision and it follows the soil and the structure. Drilled and belled concrete piers bear on stable strata below the active clay zone and are the traditional Texas answer. Pressed concrete cylinder piles are driven with the weight of the structure and are faster and less disruptive. Steel pipe piles reach deeper where competent bearing is far down. Each has a place, and each has conditions where it is the wrong choice.",
          "Depth follows the depth of the active zone at the site and the location of bearing material. In much of Texas the seasonal moisture active zone extends well below the shallow footings the house was built on, which is the entire reason the house moved.",
          "Spacing and location follow the load. Piers are placed where the structure can carry the concentrated reaction into them, along grade beams and at load points, and spaced so the beam between them spans without distress. A plan that places piers on uniform centers around a perimeter without regard to where load actually is has not designed anything.",
        ],
      },
      {
        heading: "The part of the plan that is not piers",
        paragraphs: [
          "Most Texas foundation movement is a moisture problem, and a repair that installs piers without addressing moisture is a repair that will be revisited. The plan specifies the drainage and moisture management the site needs: positive grade away from the foundation, downspout discharge carried away rather than dropped at the corner, irrigation relocated off the perimeter, and where appropriate a consistent perimeter moisture regime maintained through the dry season.",
          "It also states what elevation the repair is targeting. Lifting a foundation back to level is frequently the wrong goal, because a structure that has been distorted for fifteen years has finishes, plumbing, and masonry that have adapted to the current shape. The plan states a target and the reason for it.",
        ],
      },
    ],
    deliverable: [
      "A sealed and signed repair plan on engineering letterhead.",
      "A foundation plan showing pier locations, with the elevation survey they were designed from.",
      "Pier type, minimum depth, design load, and installation requirements.",
      "The target elevation condition and the tolerance the repair works to.",
      "Drainage and moisture management requirements for the site.",
      "Inspection points, and what the engineer needs to observe during installation.",
    ],
    evidence: [
      "Property address and access, including crawl space access where applicable.",
      "A prior foundation inspection report or elevation survey, if one exists.",
      "Any repair proposals already received, which are useful context rather than a design.",
      "Foundation type: slab on grade, post tensioned, or pier and beam.",
      "Plumbing test results if a leak has been suspected or confirmed.",
      "Known repair history, including prior piers and where they were placed.",
    ],
    turnaround: "Requires a site visit and an elevation survey. Where a recent sealed inspection report already exists, that work is not repeated.",
    faqs: [
      {
        q: "Do I need an inspection report first, or does the plan include it?",
        a: "The plan needs an elevation survey and an assessment to design from. If a recent sealed foundation inspection report exists, it is used and the work is not duplicated. If not, that assessment happens as part of producing the plan, which is why a site visit is required either way.",
      },
      {
        q: "Can you design the repair the contractor already proposed?",
        a: "The proposal is read and it is genuinely useful context. What will not happen is a seal applied to somebody else's pier count without independently establishing that it is the right one. If the independent design agrees with the proposal, it will say so, and that is a real outcome that happens regularly.",
      },
      {
        q: "How many piers will my house need?",
        a: "That cannot be answered before the elevation survey and site assessment, and a number offered over the phone is a sales figure rather than an engineering one. What can be said is what the design will be based on: measured deflection, load locations, soil conditions, and the structural system.",
      },
      {
        q: "Should the house be lifted all the way back to level?",
        a: "Usually not, and this surprises people. A house that has been out of level for years has masonry, plumbing, and finishes that have taken the current shape, and forcing it back can crack things that are currently intact. The plan states a target elevation and the reasoning, which is usually about restoring performance rather than restoring geometry.",
      },
      {
        q: "Does the plan cover the permit?",
        a: "The plan is what the permit office needs from an engineer. Filing the permit and paying its fee is the owner's or the contractor's step, and jurisdictions differ on which of them they will accept it from.",
      },
    ],
    related: ["foundation-inspection-reports", "manufactured-home-foundation-certification", "repair-specification-letters"],
    emphasisCities: ["houston", "dallas", "fort-worth", "san-antonio", "austin", "waco", "college-station", "victoria"],
  },
];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** Throws rather than returning undefined, for the places a missing slug is a bug. */
export function requireService(slug: string): Service {
  const s = getService(slug);
  if (!s) throw new Error(`[services] unknown slug ${JSON.stringify(slug)}`);
  return s;
}
