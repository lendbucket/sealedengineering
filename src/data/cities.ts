import type { Faq } from "@/data/types";

/**
 * Tier 1 city pages: 25 markets.
 *
 * The rule that governs this file is that a city page has to be worth reading
 * by somebody who lives there. Wind speed, soil, the actual office that reviews
 * the permit, and the reason this particular market orders what it orders.
 * Anything that could be swapped for another city's name without changing
 * meaning does not belong in here.
 *
 * ACCURACY NOTE
 * -------------
 * Wind speeds are the ASCE 7 basic wind speed band for a Risk Category II
 * building in that area, given as a range because the mapped value moves across
 * a county and the exposure category moves it again. They are written as
 * planning context, and every sealed document uses the value looked up for the
 * specific site address rather than the band shown here.
 *
 * Permit office names are recorded as the department that performs residential
 * plan review in each city. Municipalities reorganize, so BACKLOG.md carries a
 * standing item to re-verify these against each city's current site.
 */

export type City = {
  slug: string;
  name: string;
  county: string;
  /** Region label used in copy and in the service-area grouping. */
  region:
    | "Gulf Coast"
    | "South Texas"
    | "Rio Grande Valley"
    | "Central Texas"
    | "North Texas"
    | "West Texas"
    | "Panhandle and South Plains"
    | "East Texas";
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** True for the fourteen TDI seaward counties and the covered part of Harris. */
  windstormArea: boolean;
  wind: { band: string; note: string };
  soil: { label: string; note: string };
  /**
   * The department that performs residential plan review, verified against the
   * city's own site on the date recorded. `submittal` is one genuinely local
   * fact worth publishing; `source` is what it was checked against, so the
   * annual re-verification is a diff rather than a research project.
   */
  permitOffice: {
    name: string;
    note: string;
    submittal: string;
    source: string;
    verified: string;
  };
  /** Two to four paragraphs that are true of this market and nowhere else. */
  local: string[];
  /** Service slugs this market actually buys, in order of local weight. */
  emphasis: string[];
  /** Nearby Tier 1 city slugs, for internal linking. */
  nearby: string[];
  faqs: Faq[];
};

export const CITIES: City[] = [
  {
    slug: "houston",
    name: "Houston",
    county: "Harris County",
    region: "Gulf Coast",
    title: "Sealed Engineering Letters Houston TX | Texas PE",
    description:
      "Sealed engineering letters for Houston and Harris County. Solar structural letters, foundation reports, and WPI-8 windstorm by a Texas PE.",
    h1: "Sealed Engineering Letters in Houston, Texas",
    lede: "Harris County puts three separate engineering problems on the same address: expansive Beaumont clay under the slab, high coastal wind overhead, and a windstorm boundary that runs through the county itself.",
    windstormArea: true,
    wind: {
      band: "roughly 130 to 140 mph basic wind speed",
      note: "Houston sits far enough inland to escape the highest coastal values and far enough south to stay well above the interior. Exposure is usually B in the developed core and moves to C on the outskirts.",
    },
    soil: {
      label: "Beaumont clay and Lake Charles clay, highly expansive",
      note: "Plasticity index across much of the county is high enough that seasonal shrink and swell is the default explanation for residential foundation distress, not the exception.",
    },
    permitOffice: {
      name: "Building Code Enforcement at the Houston Permitting Center",
      note: "The Planning and Development Department performs the site plan review step separately. Unincorporated Harris County is reviewed by the Harris County Engineering Department, and the two do not ask for the same things.",
      submittal:
        "All plans are submitted electronically through the iPermits portal.",
      source: "https://www.houstonpermittingcenter.org/building-code-enforcement/residential-plan-review",
      verified: "2026-08-17",
    },
    local: [
      "The single most important thing to know about engineering work in Harris County is that the Texas Department of Insurance windstorm boundary runs through it. TDI describes the designated catastrophe area as covering parts of Harris County east of Highway 146, and names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres among the areas covered, while the rest of the county sits outside it. A reroof inside that area needs a certificate of compliance and the identical reroof outside it does not.",
      "Foundations here are a moisture problem before they are a structural one. Beaumont clay swells and shrinks by a large fraction of its volume across a wet spring and a dry August, and Houston gets both in the same year. A relative elevation survey on a Houston slab taken in May and taken in September will differ on a foundation that is behaving exactly as designed, which is why an inspection report that reads the season is worth more than one that only reads the number.",
      "Rooftop solar volume in the Houston metro is heavily driven by installers working across dozens of jurisdictions at once. The city, the county, and every incorporated suburb from Pearland to Cypress to Katy have their own plan review, and the structural letter that satisfies one is not automatically formatted for the next. The address, the framing, and the array layout are what change the analysis; the code edition adopted locally is what changes the letter.",
      "Flat terrain and a high water table shape the rest of it. Drainage is a structural item here in a way it is not in the Hill Country, and a foundation report that does not look hard at grade, gutter discharge, and where irrigation is placed has skipped the most likely cause of what it just measured.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "solar-structural-letters",
      "wpi-8-windstorm-certification",
      "foundation-repair-plans",
      "roof-certification-letters",
    ],
    nearby: ["beaumont", "college-station", "victoria", "corpus-christi"],
    faqs: [
      {
        q: "Is my Houston address inside the windstorm area?",
        a: "It depends where in the county it sits. TDI describes the catastrophe area as covering parts of Harris County east of Highway 146, and names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres among the covered areas. Most of the rest of the county is outside it. Because the department defines this by area rather than by one clean line on a map, confirm a specific address with TDI rather than assuming: the consequence of guessing wrong is a windstorm coverage gap.",
      },
      {
        q: "Why does my Houston slab crack every summer?",
        a: "Almost certainly the clay. Beaumont clay loses volume as it dries and the perimeter of a slab dries faster than the center, which lifts or drops corners seasonally and shows up as diagonal cracking at door and window corners. That pattern is extremely common here and frequently within what the structure tolerates, which is what an elevation survey is for.",
      },
      {
        q: "Do I file with the City of Houston or with Harris County?",
        a: "It follows the address, not the mailing city. An address inside Houston city limits is reviewed at the Houston Permitting Center. An address with a Houston mailing address in unincorporated Harris County is reviewed by the Harris County Engineering Department. A great many properties in the metro are the second case despite the mail saying Houston.",
      },
    ],
  },

  {
    slug: "san-antonio",
    name: "San Antonio",
    county: "Bexar County",
    region: "Central Texas",
    title: "Sealed Engineering Letters San Antonio TX | PE",
    description:
      "Sealed engineering letters for San Antonio and Bexar County. Foundation reports, solar structural letters, and permit letters by a Texas PE.",
    h1: "Sealed Engineering Letters in San Antonio, Texas",
    lede: "Bexar County is split down the middle by geology. The north side sits on Edwards limestone and the south and east sit on Blackland clay, and a foundation opinion that does not know which one it is standing on is worth nothing.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate by Texas standards. Exposure is typically B across the developed metro and C on the ranch land at the edges of the county.",
    },
    soil: {
      label: "split between Edwards limestone north of the Balcones Escarpment and Blackland clay south and east",
      note: "The escarpment runs through the middle of the metro. Homes on the north side frequently sit on rock with shallow soil; homes on the south and east sit on some of the most expansive clay in the state.",
    },
    permitOffice: {
      name: "the City of San Antonio Development Services Department",
      note: "Unincorporated Bexar County is reviewed by Bexar County Public Works, which has a different and generally lighter residential review.",
      submittal:
        "Applications go through the BuildSA portal, and a Completeness review comes first. Plan review fees are only assessed once the submittal passes it, so an incomplete package stalls before it ever reaches a reviewer.",
      source: "https://www.sa.gov/Directory/Departments/DSD/Constructing/Residential/Plan-Review",
      verified: "2026-08-17",
    },
    local: [
      "The Balcones Escarpment is the fact that organizes engineering work here. North of it, in Stone Oak, Hollywood Park, and out toward Boerne, foundations bear on limestone at shallow depth and the failure mode is not shrink and swell but differential bearing between rock and the fill that was placed over it. South and east, in the areas along the San Antonio River and toward Elmendorf, foundations sit on Blackland clay with high plasticity and behave the way Dallas and Waco foundations behave.",
      "That split means a repair plan drawn for one side of the county is frequently wrong on the other. Drilled and belled piers that reach competent strata at eight feet on the south side may hit rock at three feet on the north side, and pressed pilings that work well in deep clay have nowhere to go when there is limestone under the footing.",
      "San Antonio also has a very large stock of manufactured and mobile homes across southern Bexar County and the surrounding rural counties, which makes FHA and VA foundation certifications a steady part of the work here rather than an occasional one. Loan officers in this market see the requirement often enough to know it is coming, which is more than can be said for some Texas metros.",
      "Residential solar has grown quickly on the CPS Energy service territory, and the plan review at Development Services is specific about what it wants on a rooftop array. The structural letter matters more here on the older housing stock inside Loop 410, where framing was cut and modified over decades and cannot be assumed from the construction year.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "manufactured-home-foundation-certification",
      "solar-structural-letters",
      "carport-and-patio-cover-plans",
      "foundation-repair-plans",
    ],
    nearby: ["austin", "round-rock", "victoria", "laredo"],
    faqs: [
      {
        q: "Why do foundations behave so differently across San Antonio?",
        a: "Because the Balcones Escarpment runs through the metro. North of it, homes bear on Edwards limestone with shallow soil cover. South and east of it, homes sit on deep expansive Blackland clay. Those are two different structural problems with two different remedies, and the address determines which one applies.",
      },
      {
        q: "Does my project go through the city or through Bexar County?",
        a: "It follows the address. Inside city limits, residential plan review runs through the City of San Antonio Development Services Department. In unincorporated Bexar County, it goes to Bexar County Public Works. The county review is generally lighter, which sometimes surprises people who expected the reverse.",
      },
      {
        q: "Are manufactured home foundation certifications common here?",
        a: "Very. Southern Bexar County and the rural counties around it carry a large manufactured housing stock, and federally backed lending on those homes turns on the foundation meeting HUD's Permanent Foundations Guide for Manufactured Housing, and lenders routinely condition closing on an engineer's certification against it. The requirement follows the loan file rather than local permitting, so it can apply where no permit ever did.",
      },
    ],
  },

  {
    slug: "dallas",
    name: "Dallas",
    county: "Dallas County",
    region: "North Texas",
    title: "Sealed Engineering Letters Dallas TX | Texas PE",
    description:
      "Sealed engineering letters for Dallas County. Foundation inspection reports, roof certifications, and permit letters sealed by a Texas PE.",
    h1: "Sealed Engineering Letters in Dallas, Texas",
    lede: "Dallas sits on Houston Black clay, one of the most expansive soil series in the state, under a hail belt that shortens roofs across the county. Those two facts drive most of the engineering work here.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 110 mph basic wind speed",
      note: "Low by Texas standards. What governs roofs here is hail and straight line wind from severe thunderstorms rather than the mapped design wind speed.",
    },
    soil: {
      label: "Houston Black clay, Blackland Prairie, very high plasticity",
      note: "This is the reference soil that Texas foundation engineering practice was largely developed around. Seasonal vertical movement of several inches at the perimeter is not unusual.",
    },
    permitOffice: {
      name: "the City of Dallas Development Services Department, Building Inspection Division",
      note: "Plan Review and Field Service Inspections sit at the Oak Cliff Municipal Center. The metro is a patchwork: Highland Park, University Park, Irving, Garland, and Mesquite each run their own review with their own amendments.",
      submittal:
        "Submittals run through the Electronic Plan Review System. The city grants or denies a building permit application no later than the 45th day after submission, extendable by 14 days if the applicant agrees.",
      source: "https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/Pages/BI_EPRS.aspx",
      verified: "2026-08-17",
    },
    local: [
      "Houston Black clay is why foundation work is the largest category of residential engineering in this market. It is a deep, dark, extremely expansive clay with a plasticity index that puts it at the top of the range used in residential design, and the seasonal moisture active zone reaches well below the shallow footings that most Dallas houses were built on. A slab here is not sitting on ground that stays still.",
      "The second Dallas fact is hail. North Texas takes damaging hail most years, and the practical consequence is that roof age and roof condition are on the table in nearly every real estate transaction. A roof certification letter here is asked for more often than in most of the state, and the distinction that matters in the letter is between functional damage and cosmetic damage, because those two words decide whether an underwriter is satisfied.",
      "The third is the sheer number of jurisdictions. A contractor working the Dallas metro will hit Dallas, Plano, Richardson, Garland, Mesquite, Irving, and a dozen more inside a single week, each with its own adopted code edition and its own amendments. The letter that answers a plan review comment in Dallas has to name the edition Dallas adopted, not the current one.",
      "Older housing stock inside Loop 12 and along the eastern side of the county carries the usual consequences of sixty years of remodeling: cut joists, modified trusses, walls removed without permits, and additions framed onto pier and beam structures that were never checked for it. That is the volume behind the beam sizing and repair specification work here.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "roof-certification-letters",
      "foundation-repair-plans",
      "beam-and-header-sizing-letters",
      "structural-letters-for-permits",
    ],
    nearby: ["fort-worth", "tyler", "waco", "abilene"],
    faqs: [
      {
        q: "Is a foundation report worth it if every house in my Dallas neighborhood has cracks?",
        a: "That is exactly when it is worth it. Widespread cracking on Houston Black clay is normal seasonal behavior in a great many cases, and a report that measures actual deflection is what separates a house that is performing within tolerance from one that is moving progressively. Without the measurement, everyone is arguing about photographs of cracks.",
      },
      {
        q: "Will an engineer's roof letter satisfy my lender if a roofer's did not?",
        a: "Frequently, yes. Lenders sometimes decline a roofing contractor's certification specifically because the contractor stands to be paid for the repair, and a professional engineer with no interest in the work removes that objection. Read the underwriter's condition language before ordering, because it usually names which one it wants.",
      },
      {
        q: "Which permit office reviews my project?",
        a: "It depends on which city the address is actually in, and in the Dallas metro that is often not the one on the mail. Dallas, Highland Park, University Park, Irving, Garland, and Mesquite all run separate reviews with separate amendments. Send the plan review comment at intake and the letter is addressed to the office that issued it.",
      },
    ],
  },

  {
    slug: "fort-worth",
    name: "Fort Worth",
    county: "Tarrant County",
    region: "North Texas",
    title: "Sealed Engineering Letters Fort Worth TX | PE",
    description:
      "Sealed engineering letters for Fort Worth and Tarrant County. Foundation reports, roof letters, and permit letters sealed by a Texas PE.",
    h1: "Sealed Engineering Letters in Fort Worth, Texas",
    lede: "Tarrant County sits where the Blackland Prairie meets the Eagle Ford shale and the Cross Timbers, which means foundation behavior changes across the county rather than across the state.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 110 mph basic wind speed",
      note: "As in Dallas, severe thunderstorm wind and hail do more damage to roofs here than the mapped design wind speed suggests.",
    },
    soil: {
      label: "Eagle Ford shale and Blackland clay east, Cross Timbers sand west",
      note: "Eagle Ford is a highly expansive clay shale that weathers into some of the most troublesome residential foundation soil in North Texas. West of the county the soils turn sandier and better behaved.",
    },
    permitOffice: {
      name: "the City of Fort Worth Development Services Department",
      note: "Arlington, Grapevine, Keller, and Mansfield each run their own review, and the unincorporated county is handled separately. Some city forms still carry the older Planning and Development masthead.",
      submittal:
        "Submittals go through Accela Citizen Access. Every department reviews simultaneously and comments are compiled at the end of each review cycle, so one unanswered comment holds the whole cycle.",
      source: "https://www.fortworthtexas.gov/departments/development-services/permits/residential-information",
      verified: "2026-08-17",
    },
    local: [
      "Fort Worth's soil story is different from Dallas's in a way that matters to a repair design. The eastern half of Tarrant County sits on Eagle Ford shale, a clay shale that weathers into a highly plastic soil and holds moisture unevenly. Drilled piers in Eagle Ford frequently have to go deeper than an equivalent house in the Blackland to find material that will not move, and a pier design copied across the metro without checking will end up bearing in the active zone.",
      "West of the county the Cross Timbers soils are sandier and considerably better behaved, which is why foundation complaints thin out noticeably toward Weatherford and Aledo while roof and wind questions do not.",
      "Hail is the second driver here as it is in Dallas, and Tarrant County has taken several of the more expensive hail events in state history. Roof certifications for lenders are routine, and the useful part of the letter for a Fort Worth file is usually the separation of functional damage from cosmetic damage on a roof that has clearly been hit at some point.",
      "The stockyards-era and mid-century housing stock in the older parts of the city carries the same structural history as older Dallas: modified framing, removed walls, and additions built onto pier and beam foundations. That is where the beam sizing and repair specification volume comes from.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "foundation-repair-plans",
      "roof-certification-letters",
      "beam-and-header-sizing-letters",
      "structural-letters-for-permits",
    ],
    nearby: ["dallas", "abilene", "waco", "amarillo"],
    faqs: [
      {
        q: "Why do foundations in east Tarrant County move more than in west Tarrant?",
        a: "The geology changes across the county. The eastern half sits on Eagle Ford shale and Blackland clay, both highly expansive. The western half moves into Cross Timbers sandy soils, which hold their volume far better through a dry summer. Two houses of the same age twenty miles apart genuinely have different foundation risk.",
      },
      {
        q: "Does the City of Fort Worth require an engineer letter for a wall removal?",
        a: "Residential structural modifications commonly draw a plan review comment asking for sealed engineering, and removing a load bearing wall is the most common trigger. The safest move is to send the comment itself at intake so the letter answers what the reviewer actually asked rather than a general version of it.",
      },
      {
        q: "My roof has hail dents but no leaks. Will that fail a certification?",
        a: "Not automatically. A roof certification separates damage that affects the covering's ability to shed water and its remaining service life from damage that is cosmetic. Dents in metal or bruising that has not fractured the mat are documented and characterized rather than treated as failure, and the remaining life estimate reflects the actual condition.",
      },
    ],
  },

  {
    slug: "austin",
    name: "Austin",
    county: "Travis County",
    region: "Central Texas",
    title: "Sealed Engineering Letters Austin TX | Texas PE",
    description:
      "Sealed engineering letters for Austin and Travis County. Permit letters, beam sizing, and foundation reports requiring a licensed Texas PE seal.",
    h1: "Sealed Engineering Letters in Austin, Texas",
    lede: "Austin sits on two geologies split by the Balcones Escarpment, limestone and karst west of it and expansive clay east, often inside the same subdivision, and it reviews residential submittals against its own adopted amendments.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 110 mph basic wind speed",
      note: "Low mapped wind speed. Exposure moves to C quickly outside the urban core, particularly on the ridgelines west of the city.",
    },
    soil: {
      label: "Edwards limestone and karst west of the Balcones Escarpment, Blackland clay east",
      note: "West Austin sits on rock with thin, variable soil cover and occasional voids. East Austin sits on deep expansive clay. The transition is abrupt.",
    },
    permitOffice: {
      name: "the City of Austin Development Services Department",
      note: "Travis County reviews unincorporated areas, and Austin's extraterritorial jurisdiction adds a layer that catches people out.",
      submittal:
        "Applications and status run through the Austin Build and Connect portal. A separate Residential Expedited Plan Review program exists alongside the standard queue.",
      source: "https://www.austintexas.gov/development-services/residential-plan-review",
      verified: "2026-08-17",
    },
    local: [
      "Austin runs a separate expedited plan review program alongside its standard residential queue, which tells you something about the demand on the standard one. The practical consequence for a contractor is that a rejected letter costs more than the letter did, so a comment answered precisely, in the reviewer's own terms and against the code edition the city has actually adopted, is worth more here than a fast turnaround.",
      "The geology splits at the Balcones Escarpment, which runs through the city. West of it, in Westlake, Lakeway, and up through the hills, foundations bear on limestone with shallow and highly variable soil cover, and the classic problem is differential bearing between rock and engineered fill rather than shrink and swell. East of I-35 the soil is Blackland clay and the problems look like Waco's.",
      "The renovation market drives an unusual share of the structural letter work here. Central Austin housing stock from the 1930s through the 1960s is being opened up, added onto, and converted at high volume, and wall removals and framing modifications on pier and beam bungalows are the most common single request in this market.",
      "Austin's extraterritorial jurisdiction catches a surprising number of projects. An address outside city limits can still fall under city review for some items while the county reviews others, and establishing which office owns the comment is the first thing the intake does rather than the last.",
    ],
    emphasis: [
      "beam-and-header-sizing-letters",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
      "solar-structural-letters",
      "carport-and-patio-cover-plans",
    ],
    nearby: ["round-rock", "san-antonio", "college-station", "waco"],
    faqs: [
      {
        q: "Why does Austin plan review reject letters other cities accept?",
        a: "Austin reviews residential structural submittals more closely than most Texas jurisdictions and holds them to the code edition the city has adopted with its own amendments. The letters that get rejected here usually cite the wrong edition, answer a general version of the comment instead of the specific one, or state a conclusion without the values the reviewer needs to check it.",
      },
      {
        q: "Is a house in West Austin on rock safe from foundation problems?",
        a: "It has different problems rather than no problems. Building on limestone often means part of the foundation bears on rock and part bears on fill placed to level the site, and differential bearing between those two is a real source of distress. Karst features and shallow voids are also a West Austin issue that simply does not exist east of the escarpment.",
      },
      {
        q: "I am opening up a 1940s bungalow. What does the city want?",
        a: "Typically a sealed letter covering the beam replacing the removed wall, its bearing, and the load path down through a pier and beam foundation that was not designed for a point load. Attic photographs showing the framing above the wall are the single most useful thing to send at intake, because they establish what the wall is actually carrying.",
      },
    ],
  },

  {
    slug: "el-paso",
    name: "El Paso",
    county: "El Paso County",
    region: "West Texas",
    title: "Sealed Engineering Letters El Paso TX | Texas PE",
    description:
      "Sealed engineering letters for El Paso County. Solar structural letters, permit letters, and carport plans requiring a licensed Texas PE seal.",
    h1: "Sealed Engineering Letters in El Paso, Texas",
    lede: "El Paso is the one Texas market where seismic design actually enters the conversation, and the one where the soil problem is collapse under wetting rather than swell.",
    windstormArea: false,
    wind: {
      band: "roughly 100 to 110 mph basic wind speed",
      note: "Moderate mapped wind, but exposure is frequently C or D on the desert flats and mesa edges, which raises the design pressures well above what the band alone suggests.",
    },
    soil: {
      label: "arid alluvium, caliche, and collapsible silts",
      note: "Unlike most of Texas, the residential soil failure here is hydrocompaction: low density soils that lose volume suddenly when they get wet, usually from irrigation or a plumbing leak.",
    },
    permitOffice: {
      name: "the City of El Paso Planning and Inspections Department",
      note: "El Paso County reviews unincorporated areas including the colonias east and south of the city.",
      submittal:
        "The One Stop Shop on Texas Avenue is the primary intake and payment point, and plans can also be submitted electronically through the Citizen Access Portal.",
      source: "https://www.elpasotexas.gov/planning-and-inspections/",
      verified: "2026-08-17",
    },
    local: [
      "El Paso sits in the highest seismic zone in Texas. The design category is still modest by California standards, but it is not the flat zero that applies across most of the state, and it appears in the design criteria on any plan set sealed for this market. Engineers who work the rest of Texas and drop a set into El Paso get this wrong regularly.",
      "The soil behaves in the opposite direction to the rest of the state. Central and East Texas foundations move because clay swells when it takes on water. El Paso foundations move because low density desert silts collapse when they take on water, which means the trigger is the same, irrigation and plumbing leaks, and the direction of movement is reversed. A repair designed for expansive clay is the wrong repair here.",
      "Solar is a strong market on this side of the state and the wind case is the reason the letters matter. Open desert exposure and mesa edge sites put arrays into higher effective wind pressure than the mapped speed implies, and the attachment spacing usually tightens as a result.",
      "Shade structures are ordinary construction here rather than an amenity, and carport and patio cover plans are a steady category. Uplift governs those structures completely, and a stock plan drawn for a lower wind speed or a different exposure is the most common reason one gets rejected at the counter.",
    ],
    emphasis: [
      "solar-structural-letters",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "beam-and-header-sizing-letters",
      "repair-specification-letters",
    ],
    nearby: ["midland", "odessa", "lubbock", "san-angelo"],
    faqs: [
      {
        q: "Does seismic design really apply in El Paso?",
        a: "Yes, and it is the only Texas metro where it routinely does. El Paso sits in the highest seismic design category in the state. It is modest compared with the West Coast, but it is not zero, and it belongs in the design criteria on a sealed plan set for this market.",
      },
      {
        q: "My foundation dropped after a plumbing leak. Is that the same as Texas clay movement?",
        a: "No, and the difference matters for the repair. Central Texas clay swells and shrinks with moisture. El Paso soils are frequently low density and collapse when saturated, so a leak causes a sudden downward settlement rather than a seasonal cycle. The remedy is different and a repair designed for expansive clay does not address it.",
      },
      {
        q: "Why did my carport plans get rejected?",
        a: "In this market, usually because the plans were drawn for a lower wind speed or a lower exposure category than the site actually has. Open desert and mesa edge sites often qualify as exposure C or D, which raises uplift substantially. A plan set sealed against the values at the actual address is the fix.",
      },
    ],
  },

  {
    slug: "corpus-christi",
    name: "Corpus Christi",
    county: "Nueces County",
    region: "Gulf Coast",
    title: "WPI-8 and Sealed Letters Corpus Christi TX | PE",
    description:
      "Sealed engineering letters for Corpus Christi and Nueces County, including WPI-8 windstorm certification through the licensed engineer path.",
    h1: "Sealed Engineering Letters and WPI-8 in Corpus Christi",
    lede: "Nueces County is a designated seaward county, which means windstorm certification is not optional here. Nearly every roof, window, and addition triggers it.",
    windstormArea: true,
    wind: {
      band: "roughly 140 to 150 mph basic wind speed",
      note: "Among the highest design wind speeds in the continental United States. Exposure D applies to shoreline and bay front sites, which raises pressures again.",
    },
    soil: {
      label: "coastal clay and clay loam over deltaic deposits",
      note: "Expansive, though the local structural conversation is dominated by wind rather than by soil.",
    },
    permitOffice: {
      name: "the City of Corpus Christi Development Services Department",
      note: "Windstorm compliance runs through the Texas Department of Insurance, which is separate from and additional to city permitting.",
      submittal:
        "Residential plans go to the department's residential plan review mailbox, with applications tracked in the Dynamic Portal. The city states residential approvals can take up to seven business days.",
      source: "https://www.cctexas.com/ds",
      verified: "2026-08-17",
    },
    local: [
      "The defining fact here is that Nueces County is one of the fourteen TDI seaward counties. Construction has to comply with the windstorm building code and that compliance has to be documented with a WPI-8 certificate of compliance before the Texas Windstorm Insurance Association will write or continue coverage. The requirement is not limited to new houses. Reroofs, window and door replacements, additions, and detached structures all trigger it.",
      "The most common file that reaches an engineer in this market is work that was completed years ago with no WPI-1 filed and no certificate obtained. The owner discovers it at renewal or at closing, and the only remaining route is the licensed engineer path: an engineer inspects what can be inspected, evaluates it, and submits the certification to TDI. What determines whether that is possible is the evidence, which is why construction photographs are worth so much on the coast.",
      "Design wind speed here is among the highest in the country, and the load path is where compliance is actually won or lost. Roof covering attachment, deck attachment, roof to wall connection, wall to foundation anchorage, and opening protection all have to carry the load through, and the roof to wall connection is the one that most often fails an evaluation on older Corpus Christi housing.",
      "Rooftop solar on the coast is a genuinely different engineering problem than solar anywhere else in Texas. The uplift on an array at 145 miles per hour with exposure D is several times what the same array sees in Dallas, and both a structural letter and windstorm compliance are usually in play on the same project.",
    ],
    emphasis: [
      "wpi-8-windstorm-certification",
      "roof-certification-letters",
      "solar-structural-letters",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
    ],
    nearby: ["victoria", "alice", "harlingen", "brownsville"],
    faqs: [
      {
        q: "I reroofed years ago and never got a WPI-8. What now?",
        a: "The licensed engineer path exists for exactly this. An engineer inspects what can be inspected now, evaluates the work against the windstorm building code, and submits the certification to the Texas Department of Insurance. Whether certification is possible depends on what can be observed or exposed and on what documentation exists from the original work, so any photographs taken during the reroof are important.",
      },
      {
        q: "Does every project in Corpus Christi need windstorm certification?",
        a: "Any construction subject to the windstorm building code in a seaward county does, and that covers far more than new houses. Reroofs, window and door replacements, additions, and many detached structures all trigger it. If the work involves the building envelope, assume it does until somebody establishes otherwise.",
      },
      {
        q: "Is windstorm certification the same as my city permit?",
        a: "No. They are separate processes with separate authorities. The city permit is issued by Corpus Christi Development Services. The WPI-8 certificate of compliance is issued by the Texas Department of Insurance. Having one does not produce the other, and a completed city inspection does not satisfy the windstorm requirement.",
      },
    ],
  },

  {
    slug: "laredo",
    name: "Laredo",
    county: "Webb County",
    region: "South Texas",
    title: "Sealed Engineering Letters Laredo TX | Texas PE",
    description:
      "Sealed engineering letters for Laredo and Webb County. Permit letters, carport plans, and foundation reports requiring a licensed Texas PE seal.",
    h1: "Sealed Engineering Letters in Laredo, Texas",
    lede: "Laredo builds fast on caliche and clay in one of the hottest sustained climates in the country, and shade structures here are infrastructure rather than an upgrade.",
    windstormArea: false,
    wind: {
      band: "roughly 100 to 110 mph basic wind speed",
      note: "Modest mapped speed, with exposure C common on the open brush country at the city's edges.",
    },
    soil: {
      label: "caliche over expansive clay, with highly variable depth to rock",
      note: "Caliche layers of unpredictable thickness sit over clay, so footing depth and bearing vary considerably across short distances.",
    },
    permitOffice: {
      name: "the City of Laredo Building Development Services",
      note: "Webb County reviews unincorporated areas, including the colonias outside the city limits.",
      submittal:
        "Completed applications are emailed to the building permits mailbox. Building Development Services is split across six divisions, so a submittal can be complete for one and not another.",
      source: "https://www.cityoflaredo.com/departments/building-development-services",
      verified: "2026-08-17",
    },
    local: [
      "Laredo's soil profile is genuinely awkward to design around. Caliche, a cemented calcium carbonate layer, sits at variable depth over expansive clay, and its thickness can change by several feet across a single lot. A footing that finds caliche on one side of a house and clay on the other is a differential bearing problem that looks like ordinary clay movement and is not, and it is a common finding in this market.",
      "Sustained heat here is extreme enough to be a structural input rather than a comfort issue. Soils dry deeply and stay dry, and the perimeter of a slab in Laredo loses moisture in a way that houses in East Texas never experience. That is why perimeter moisture management shows up in repair plans here as a primary item rather than a footnote.",
      "Covered parking and patio shade are ordinary residential construction in this market, which makes carport and patio cover plans a steady category. Uplift governs those structures, and the correct footing size is almost always larger than the intuition suggests.",
      "Cross border logistics has driven a great deal of light industrial and warehouse construction around the city, and the residential growth that follows it puts a steady volume of new construction permits through the city's review.",
    ],
    emphasis: [
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
      "manufactured-home-foundation-certification",
      "solar-structural-letters",
    ],
    nearby: ["san-antonio", "mcallen", "alice", "corpus-christi"],
    faqs: [
      {
        q: "What makes Laredo foundations different from the rest of South Texas?",
        a: "The caliche. A cemented layer of variable thickness sits over expansive clay, and its depth changes across a single lot. That produces differential bearing, where part of a foundation rests on something rigid and part rests on soil that moves, and the resulting distress pattern is often misread as ordinary clay movement.",
      },
      {
        q: "Do I need a permit for a carport in Laredo?",
        a: "In city limits, a structure of that size and permanence normally requires a permit and sealed plans. Confirm with City of Laredo Building Development Services for the specific structure, because size thresholds and setback requirements decide it, and building first is expensive to unwind.",
      },
      {
        q: "How much does the heat actually affect a slab here?",
        a: "Meaningfully. Sustained extreme heat dries soil deeply and keeps it dry, so the perimeter of a slab loses far more moisture than the center and holds that difference for months. That is why repair plans in this market treat perimeter moisture management as a primary element of the design rather than an optional recommendation.",
      },
    ],
  },

  {
    slug: "lubbock",
    name: "Lubbock",
    county: "Lubbock County",
    region: "Panhandle and South Plains",
    title: "Sealed Engineering Letters Lubbock TX | Texas PE",
    description:
      "Sealed engineering letters for Lubbock County. Solar structural letters, permit letters, and foundation reports sealed by a Texas PE.",
    h1: "Sealed Engineering Letters in Lubbock, Texas",
    lede: "Flat, open, and windy. Lubbock sites are frequently exposure C, which raises design wind pressures well above what the mapped speed alone suggests, and it changes every attachment on a roof.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "The number understates the problem. Open plains terrain puts a great many sites in exposure C, and the resulting design pressures exceed those of some higher speed sites in sheltered suburban exposure.",
    },
    soil: {
      label: "Amarillo and Olton soils over caliche, with playa lake basins",
      note: "Moderately expansive clay loam over a caliche layer. Homes near playa basins have a distinct moisture regime and behave differently from those on the flats.",
    },
    permitOffice: {
      name: "the City of Lubbock Department of Building Safety",
      note: "Lubbock County reviews unincorporated areas, and the smaller South Plains municipalities each run their own.",
      submittal:
        "The contractor has to be registered with the Department of Building Safety before a residential permit will issue, which is a separate step from the permit itself and a common cause of delay.",
      source: "https://ci.lubbock.tx.us/departments/building-safety/permitting/residential-permitting",
      verified: "2026-08-17",
    },
    local: [
      "Exposure category is the single most useful thing to understand about engineering in Lubbock. ASCE 7 exposure C applies to open terrain with scattered obstructions, which describes most of the South Plains accurately, and it produces meaningfully higher design pressures than the exposure B assumed for typical suburban sites. A solar structural letter written on a default exposure B assumption will specify attachment spacing that is too loose for a Lubbock roof.",
      "The playa lakes that dot the region create a local moisture pattern that has real foundation consequences. Homes built near or on the margins of a playa basin experience wetting cycles that homes half a mile away on the flats do not, and a foundation report here is worth reading against the site's position relative to the nearest basin.",
      "Caliche sits under most of the city at shallow depth, which is generally good news for bearing and complicated news for pier design. A drilled pier that hits caliche has found competent material, and a pier design that assumed it would drill to twelve feet of clay has to be revised in the field rather than on paper.",
      "Solar has grown quickly on the South Plains, helped by high irradiance and open sites. The wind case is what governs the engineering, and it is the reason a letter written for this market has to establish exposure at the address rather than inherit it from a template.",
    ],
    emphasis: [
      "solar-structural-letters",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
      "roof-certification-letters",
    ],
    nearby: ["amarillo", "midland", "odessa", "abilene"],
    faqs: [
      {
        q: "Why does exposure category matter so much in Lubbock?",
        a: "Because wind pressure is a function of both speed and terrain, and most South Plains sites sit in open terrain that qualifies as exposure C rather than the suburban exposure B assumed by default. That difference raises design pressures substantially, and it is why an attachment spacing that is fine in a Dallas subdivision is not adequate on an equivalent Lubbock roof.",
      },
      {
        q: "Is caliche good or bad for my foundation?",
        a: "Generally good for bearing and awkward for design. Caliche is a cemented layer that supports load well, but its depth is not uniform, so part of a foundation can bear on it while part bears on the clay above. That differential is what produces distress, and it is why a pier design here has to be based on what was actually found rather than on a typical section.",
      },
      {
        q: "Does hail affect roof certifications on the South Plains?",
        a: "Yes. Lubbock sits in a region that takes damaging hail regularly, and roof condition is a live question in most transactions. The certification separates functional damage that shortens remaining life from cosmetic damage that does not, which is the distinction underwriters are actually asking about.",
      },
    ],
  },

  {
    slug: "mcallen",
    name: "McAllen",
    county: "Hidalgo County",
    region: "Rio Grande Valley",
    title: "Sealed Engineering Letters McAllen TX | Texas PE",
    description:
      "Sealed engineering letters for McAllen and Hidalgo County. Solar structural letters, foundation certifications, and permit letters.",
    h1: "Sealed Engineering Letters in McAllen, Texas",
    lede: "Hidalgo County sits one county inland from the windstorm boundary with wind speeds that behave like the coast, which is a combination that catches out engineers who work from a map without reading it.",
    windstormArea: false,
    wind: {
      band: "roughly 120 to 135 mph basic wind speed",
      note: "High for an inland county. Hidalgo is not a TDI seaward county, so there is no WPI-8 requirement, but the structural wind loads are much closer to Corpus Christi than to San Antonio.",
    },
    soil: {
      label: "Rio Grande delta clay and clay loam, moderately to highly expansive",
      note: "Deltaic soils with variable stratification. Irrigation history across the Valley has left a moisture regime that differs noticeably from natural conditions.",
    },
    permitOffice: {
      name: "the City of McAllen Building Permits and Inspections Department",
      note: "Edinburg, Mission, Pharr, and Weslaco each run their own review, and Hidalgo County handles the unincorporated areas and colonias.",
      submittal:
        "A recorded plat is required before a building permit application can even be submitted. Plan review is charged at 18 percent of the permit fee, and submittals must be legible and correctly oriented.",
      source: "https://www.mcallen.net/departments/permits/home",
      verified: "2026-08-17",
    },
    local: [
      "The most common mistake made about the Rio Grande Valley is assuming that being off the coast means being out of the wind. Hidalgo County is not one of the fourteen TDI seaward counties, so there is no WPI-8 requirement here, but the ASCE 7 design wind speed is far higher than anywhere at a comparable distance inland on the rest of the Texas coast. A solar array or a patio cover in McAllen is engineered much closer to Corpus Christi than to San Antonio.",
      "High irradiance and a long cooling season make rooftop solar an obvious proposition in the Valley, and structural letters follow the arrays. The wind number is what makes the letter matter here rather than a formality.",
      "Manufactured housing is a very large share of the Valley's housing stock, and FHA, VA, and USDA lending on those homes carries the HUD foundation certification requirement. Loan volume here means the certification is a routine item for local loan officers rather than an occasional surprise.",
      "Deltaic soils with a long irrigation history behave differently from the natural profile. Sections of the Valley have been irrigated for a century, and the resulting moisture regime is neither the natural one nor a stable one, which is worth reading into a foundation report rather than around.",
    ],
    emphasis: [
      "solar-structural-letters",
      "manufactured-home-foundation-certification",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
    ],
    nearby: ["harlingen", "brownsville", "laredo", "alice"],
    faqs: [
      {
        q: "Does McAllen need a WPI-8 windstorm certificate?",
        a: "No. Hidalgo County is not one of the fourteen Texas Department of Insurance seaward counties, so the WPI-8 requirement does not apply here. Cameron County, which includes Brownsville and Harlingen, is a seaward county, so a project one county east is a different answer.",
      },
      {
        q: "Why is the design wind speed so high if we are not on the coast?",
        a: "Because the ASCE 7 wind map follows hurricane exposure rather than a simple distance from the shoreline, and the lower Rio Grande Valley sits in a band of elevated speeds well inland. The practical result is that arrays, covers, and roofs in McAllen are engineered to loads much closer to Corpus Christi than to San Antonio.",
      },
      {
        q: "Are manufactured home foundation certifications common in the Valley?",
        a: "Very. Manufactured housing is a large share of the housing stock across Hidalgo County, and federally backed lending on those homes turns on the foundation meeting HUD's Permanent Foundations Guide for Manufactured Housing, and lenders routinely condition closing on an engineer's certification against it. The requirement follows the loan file rather than local permitting, so it can apply where no permit ever did.",
      },
    ],
  },

  {
    slug: "brownsville",
    name: "Brownsville",
    county: "Cameron County",
    region: "Rio Grande Valley",
    title: "WPI-8 and Sealed Letters Brownsville TX | PE",
    description:
      "Sealed engineering letters for Brownsville and Cameron County, including WPI-8 windstorm certification through the licensed Texas engineer path.",
    h1: "Sealed Engineering Letters and WPI-8 in Brownsville",
    lede: "Cameron County carries the highest design wind speeds in Texas and the full windstorm certification requirement. Both facts govern nearly every project in this market.",
    windstormArea: true,
    wind: {
      band: "roughly 145 to 155 mph basic wind speed",
      note: "The highest mapped values in the state. Exposure D applies at coastal and Laguna Madre sites, which raises pressures further still.",
    },
    soil: {
      label: "Rio Grande delta clay, expansive, with a shallow water table near the coast",
      note: "Soil movement is a real issue and it competes for attention with a wind problem that is larger.",
    },
    permitOffice: {
      name: "the City of Brownsville Building Permits and Inspections Division",
      note: "A separate Planning and Redevelopment Department handles land use, and windstorm compliance is a separate Texas Department of Insurance process. Cameron County reviews the unincorporated areas.",
      submittal:
        "Plan review is stated as three to five business days when the submittal is complete, and permits may only be pulled by a general contractor registered with the city.",
      source: "https://www.brownsvilletx.gov/1914/Building-Permits-and-Inspections-Divisio",
      verified: "2026-08-17",
    },
    local: [
      "Cameron County is a TDI seaward county, so the WPI-8 requirement applies in full. Construction has to comply with the windstorm building code and be documented with a certificate of compliance before TWIA will write or continue coverage. Reroofs, window and door replacements, additions, and detached structures all trigger it, not just new houses.",
      "Design wind speeds here are the highest in Texas, and the difference between designing for 150 miles per hour and designing for the 110 that applies across most of the interior is not incremental. Uplift scales with the square of the speed, so a coastal Brownsville roof sees close to twice the pressure of an equivalent roof in Austin. Every fastener schedule, every connection, and every attachment spacing reflects that.",
      "The most common file here is completed work with no windstorm documentation. A roof replaced after a storm, windows replaced during a remodel, or an addition built without a WPI-1 all leave the owner with a coverage gap that surfaces at renewal or at closing. The engineer path is the remedy, and what it can achieve depends on what can still be inspected or exposed.",
      "Opening protection is a bigger part of the evaluation here than it is further up the coast. Impact and pressure rated windows, doors, and garage doors are central to compliance, and the product approval documentation for what was actually installed is frequently the item that is missing when a file stalls.",
    ],
    emphasis: [
      "wpi-8-windstorm-certification",
      "roof-certification-letters",
      "structural-letters-for-permits",
      "solar-structural-letters",
      "manufactured-home-foundation-certification",
    ],
    nearby: ["harlingen", "mcallen", "corpus-christi", "alice"],
    faqs: [
      {
        q: "Is Brownsville inside the windstorm area?",
        a: "Yes. Cameron County is one of the fourteen Texas Department of Insurance seaward counties, so the WPI-8 requirement applies across the county, including Brownsville, Harlingen, and South Padre Island.",
      },
      {
        q: "My windows were replaced without a windstorm inspection. Is that a problem?",
        a: "It is, and it is a common one. Opening protection is central to windstorm compliance, and replacement windows installed without a WPI-1 leave the work undocumented. The engineer path can address it, and the two things that decide whether it succeeds are what can be inspected now and whether product approval documentation exists for what was installed.",
      },
      {
        q: "Why is Brownsville wind design so much heavier than the rest of Texas?",
        a: "Because wind pressure scales with the square of the wind speed. A design speed of about 150 miles per hour against about 110 across most of the interior means roughly double the pressure on the same building. That is why fastener schedules, connections, and attachment spacings here look nothing like those on a comparable house inland.",
      },
    ],
  },

  {
    slug: "amarillo",
    name: "Amarillo",
    county: "Potter and Randall Counties",
    region: "Panhandle and South Plains",
    title: "Sealed Engineering Letters Amarillo TX | Texas PE",
    description:
      "Sealed engineering letters for Amarillo, Potter and Randall counties. Roof letters, solar letters, and permit letters by a licensed Texas PE.",
    h1: "Sealed Engineering Letters in Amarillo, Texas",
    lede: "The Panhandle combines open exposure, sustained wind, and one of the most active hail corridors in the country. Roofs and attachments carry the engineering weight here.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 120 mph basic wind speed",
      note: "Exposure C is the norm rather than the exception across the Panhandle, which pushes effective design pressures above what the band implies.",
    },
    soil: {
      label: "Pullman and Sherm clay loam over caliche",
      note: "Moderately expansive with a caliche layer beneath. Foundation distress is real here but less dominant than in the Blackland Prairie.",
    },
    permitOffice: {
      name: "the City of Amarillo Building Safety Department",
      note: "Amarillo spans Potter and Randall counties, and each county reviews its own unincorporated areas.",
      submittal:
        "Permits and contractor licensing run through MGO Connect. Plans marked Not for Construction or Preliminary Plans Only are refused, which matters directly for a sealed submittal: send the final sealed set, not a draft.",
      source: "https://www.amarillo.gov/building-safety/",
      verified: "2026-08-17",
    },
    local: [
      "Amarillo sits in one of the most persistently windy populated areas in the United States, and the practical engineering consequence is that anything attached to the outside of a building has a shorter service life and a higher design demand than the mapped wind speed alone would suggest. Exposure C applies to most sites, and it is not a technicality: it materially raises the pressures on a roof covering, an array, and a patio cover.",
      "Hail is the other Panhandle constant. The corridor running through the region takes damaging hail most seasons, and roof condition is a live question in most real estate transactions here. The distinction that matters in a roof certification is between damage that has shortened the covering's serviceable life and damage that is cosmetic, and on a Panhandle roof both are usually present at once.",
      "Caliche under the Pullman clay loam gives foundations a competent bearing layer at reachable depth, which makes pier design here more straightforward than in the deep clay markets. What it does not do is remove seasonal movement in the soil above it, and shallow footings still sit in the active zone.",
      "Blowing dust and grit is a genuine input to roof and attachment condition here. Fastener heads, sealants, and coatings age faster under sustained abrasion, and a roof observation in this market reads edge and fastener condition more closely than it might elsewhere.",
    ],
    emphasis: [
      "roof-certification-letters",
      "solar-structural-letters",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
    ],
    nearby: ["lubbock", "abilene", "midland", "fort-worth"],
    faqs: [
      {
        q: "How much does Panhandle wind actually change a solar design?",
        a: "Substantially, and mostly through exposure rather than through the mapped speed. Most Amarillo sites are open terrain qualifying as exposure C, which raises design pressures well above the suburban exposure B default. The usual result is tighter attachment spacing than the same array would need on a sheltered site at a similar wind speed.",
      },
      {
        q: "Does hail damage automatically fail a roof certification?",
        a: "No. The certification distinguishes damage that has shortened the covering's remaining service life from damage that is cosmetic. Panhandle roofs frequently show both, and a competent letter says which is which rather than treating any hail evidence as failure.",
      },
      {
        q: "Are foundation problems as bad here as in Dallas?",
        a: "Generally less severe. Panhandle soils are moderately expansive rather than the very high plasticity clays of the Blackland Prairie, and caliche provides a competent bearing layer at reachable depth. Seasonal movement still occurs and shallow footings still sit in the active zone, so distress happens, but it is not the dominant category it is in North Texas.",
      },
    ],
  },

  {
    slug: "killeen",
    name: "Killeen",
    county: "Bell County",
    region: "Central Texas",
    title: "Sealed Engineering Letters Killeen TX | Texas PE",
    description:
      "Sealed engineering letters for Killeen and Bell County, including VA manufactured home foundation certifications for the Fort Cavazos housing market.",
    h1: "Sealed Engineering Letters in Killeen, Texas",
    lede: "Killeen is a VA lending market before it is anything else, and that makes foundation certification timing the thing that most often decides whether a closing holds.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate. Exposure B in the developed areas, C on the open ground west and north toward the Lampasas Cut Plain.",
    },
    soil: {
      label: "Blackland clay east, limestone and thin caliche soils west",
      note: "Bell County straddles the transition, so foundation behavior changes across the metro rather than being uniform.",
    },
    permitOffice: {
      name: "the City of Killeen Development Services Department, Building Inspections division",
      note: "Harker Heights, Copperas Cove, and Nolanville run their own reviews, and Bell County handles the unincorporated areas.",
      submittal:
        "All permits are submitted through the MGO Connect portal. One and two family projects are reviewed by a building inspector within three to five days.",
      source: "https://www.killeentexas.gov/204/Building-Inspections",
      verified: "2026-08-17",
    },
    local: [
      "Fort Cavazos shapes this market completely. The housing turnover around a large installation runs on PCS cycles, which means closings are scheduled tightly around orders and a condition that adds two weeks is a genuine problem rather than an inconvenience. VA loans are a very large share of the volume, and VA manufactured home foundation certifications are correspondingly common.",
      "The VA certification requirement points at the same HUD Permanent Foundations Guide that FHA uses, so the technical scope is the same. What differs is how the lender wants it addressed and what else the file needs beside it, which is why the loan type is asked for at intake rather than assumed.",
      "Bell County straddles a geological transition. The eastern side toward Temple and Belton sits on Blackland clay and behaves like Waco. The western side toward Copperas Cove and the Lampasas Cut Plain sits on thinner soils over limestone. A foundation opinion here has to know which side of the county it is on.",
      "Rental conversion volume around the installation puts an unusual amount of remodeling and repair work through this market, which drives a steady stream of permit letters and repair specifications on properties being turned between tenants.",
    ],
    emphasis: [
      "manufactured-home-foundation-certification",
      "foundation-inspection-reports",
      "repair-specification-letters",
      "roof-certification-letters",
      "structural-letters-for-permits",
    ],
    nearby: ["waco", "austin", "round-rock", "college-station"],
    faqs: [
      {
        q: "How fast can a VA foundation certification move for a PCS closing?",
        a: "The timeline is set by the site observation rather than by the writing, so the honest answer is that scheduling access is the constraint. What helps most is getting the crawl space accessible and the loan details, borrower name, lender name, and serial numbers, submitted at intake rather than after the visit.",
      },
      {
        q: "Is the VA certification different from the FHA one?",
        a: "Technically they point at the same standard, the HUD Permanent Foundations Guide for Manufactured Housing. What differs is how the lender wants the certification addressed and what else the file requires alongside it. Tell us the loan type at intake and it is written for that program.",
      },
      {
        q: "Does foundation behavior change across Bell County?",
        a: "Yes, and noticeably. The eastern side of the county toward Temple and Belton sits on Blackland clay with high shrink and swell potential. The western side toward Copperas Cove sits on thinner soils over limestone. Two homes twenty miles apart genuinely have different foundation risk profiles.",
      },
    ],
  },

  {
    slug: "waco",
    name: "Waco",
    county: "McLennan County",
    region: "Central Texas",
    title: "Sealed Engineering Letters Waco TX | Texas PE",
    description:
      "Sealed engineering letters for Waco and McLennan County. Foundation reports, repair plans, and permit letters requiring a licensed Texas PE seal.",
    h1: "Sealed Engineering Letters in Waco, Texas",
    lede: "Waco sits in the heart of the Blackland Prairie on some of the most expansive soil in Texas, and the renovation boom of the last decade has put an unusual amount of old framing under new loads.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate. The wind case rarely governs residential work here relative to the soil case.",
    },
    soil: {
      label: "Houston Black clay, Blackland Prairie, very high plasticity",
      note: "The same soil series that dominates Dallas, and the reason foundation work is the largest engineering category in this market.",
    },
    permitOffice: {
      name: "the City of Waco Development Services Department, Inspection Services division",
      note: "McLennan County reviews the unincorporated areas, and Woodway, Hewitt, and Bellmead each run their own.",
      submittal:
        "The city publishes a submission checklist per permit type defining the minimum plan submittal. Reading the one for your permit type before submitting removes most first cycle comments.",
      source: "https://www.waco-texas.com/Departments/Development-Services/Inspection-Services",
      verified: "2026-08-17",
    },
    local: [
      "Waco sits on Houston Black clay, which is the reference expansive soil of Texas residential engineering. Seasonal vertical movement at a slab perimeter measured in inches is normal here rather than alarming, and the entire purpose of an elevation survey in this market is to distinguish that ordinary seasonal behavior from progressive movement that will not reverse.",
      "The renovation wave that has run through central Waco over the last decade has a specific engineering signature. Houses built between 1920 and 1960 on pier and beam or shallow slab foundations have had walls removed, kitchens opened, and additions attached at a rate the original framing was never evaluated for. Beam sizing letters and repair specifications on cut or overloaded framing are a steady category here for exactly that reason.",
      "The Brazos River corridor and the older neighborhoods near it add a second layer: variable fill, historic grade changes, and drainage that was established long before anybody was thinking about slab performance. A foundation report in those areas reads site history as much as it reads the elevation contour.",
      "Baylor and the surrounding rental stock keep a constant flow of repair, conversion, and code enforcement work moving through the city's review, which is where a good share of the permit letter volume comes from.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "foundation-repair-plans",
      "beam-and-header-sizing-letters",
      "repair-specification-letters",
      "structural-letters-for-permits",
    ],
    nearby: ["killeen", "dallas", "college-station", "austin"],
    faqs: [
      {
        q: "How much seasonal movement is normal on Waco clay?",
        a: "More than most homeowners expect. Houston Black clay can move a slab perimeter vertically by a substantial fraction of an inch to over an inch across a wet spring and a dry late summer, and the structure is generally built to tolerate it. That is exactly why a single elevation survey is a snapshot and a repeated one a year apart is evidence.",
      },
      {
        q: "I am renovating an old house near downtown. What will the city ask for?",
        a: "Wall removals, framing modifications, and additions typically draw a plan review comment asking for sealed engineering. On a pier and beam house the important part is not the beam itself but where its point loads land and whether anything under them was designed to carry them, which is what the letter has to address.",
      },
      {
        q: "Should I get a report before or after a repair company evaluates?",
        a: "Before, if you can. A repair company's evaluation is performed by somebody who is paid when the answer is yes, and once a proposal is on the table the conversation is anchored to it. An independent engineering report establishes what the foundation is actually doing first, and then any proposal can be read against it.",
      },
    ],
  },

  {
    slug: "tyler",
    name: "Tyler",
    county: "Smith County",
    region: "East Texas",
    title: "Sealed Engineering Letters Tyler TX | Texas PE",
    description:
      "Sealed engineering letters for Tyler and Smith County. Foundation certifications, roof letters, and repair specifications by a Texas PE.",
    h1: "Sealed Engineering Letters in Tyler, Texas",
    lede: "East Texas is the wet side of the state. Sandy soils over clay, heavy tree cover, and a manufactured housing stock that keeps foundation certifications moving through every lender in the region.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate mapped speed, with exposure B typical because of the tree cover. Falling timber does more structural damage here than wind pressure does.",
    },
    soil: {
      label: "sandy loam over clay subsoil, moderately expansive",
      note: "East Texas soils hold moisture far better than Central Texas clay, so the shrink and swell cycle is gentler and the drainage and rot problems are worse.",
    },
    permitOffice: {
      name: "the City of Tyler Development Services Department",
      note: "Smith County has a lighter review for unincorporated areas, and a large share of the region's housing sits outside city limits.",
      submittal:
        "All permits and plans must be submitted electronically through the city's inspections portal, which runs on eTRAKiT and ProjectDox. Residential new construction approval is stated as usually no more than five working days.",
      source: "https://www.cityoftyler.org/government/departments/development-services-3527",
      verified: "2026-08-17",
    },
    local: [
      "The East Texas moisture regime changes what goes wrong with buildings. Rainfall here is roughly double what West Texas sees, and soils stay damp, which means the seasonal clay cycle is gentler than in the Blackland Prairie. What replaces it is decay: sill plate rot, beam end rot in crawl spaces, termite damage, and floor framing failures at bathrooms and exterior walls. Repair specification letters are a larger share of the work here than they are anywhere west of I-45.",
      "Heavy pine and hardwood cover produces a specific kind of structural damage. A pine coming down through a roof is a routine East Texas event, and the resulting repair scope, damaged rafters, broken trusses, and compromised sheathing, is exactly what a sealed repair specification exists to define before a contractor starts cutting.",
      "Manufactured and modular housing is a very large share of the Smith County and surrounding regional housing stock, and much of it sits outside city limits where county review is light. FHA, VA, and USDA lending on those homes carries the HUD foundation certification requirement, and the requirement follows the loan product rather than local permitting.",
      "Crawl space construction is more common here than in the slab dominated metros, which changes what a foundation inspection looks like. Piers, beams, joists, shims, and ventilation are inspected directly rather than inferred from an elevation survey alone, and the survey becomes one input rather than the whole report.",
    ],
    emphasis: [
      "manufactured-home-foundation-certification",
      "repair-specification-letters",
      "foundation-inspection-reports",
      "roof-certification-letters",
      "structural-letters-for-permits",
    ],
    nearby: ["dallas", "waco", "beaumont", "houston"],
    faqs: [
      {
        q: "Why is rot such a common finding in East Texas crawl spaces?",
        a: "Because the moisture never leaves. Rainfall here is roughly double the West Texas figure and soils stay damp, so a crawl space with poor ventilation or standing water keeps wood at a moisture content where decay organisms are active. Sill plates, beam ends, and joists near exterior walls are where it shows first.",
      },
      {
        q: "A tree fell on my roof. What do I need before repairs start?",
        a: "A sealed repair specification defines exactly which members are compromised, what has to be replaced against what can be repaired, and how the repair is fastened. That matters most when trusses are involved, because a broken truss cannot be repaired on judgment and the manufacturer will not approve a field modification.",
      },
      {
        q: "My manufactured home is outside city limits. Does that change the certification?",
        a: "Not the certification itself. The HUD Permanent Foundations Guide is a federal standard and the engineer's certification is written against it regardless of local permitting. What changes outside city limits is that there may be no permit record or inspection history to reference, so the observation carries more of the weight.",
      },
    ],
  },

  {
    slug: "college-station",
    name: "College Station",
    county: "Brazos County",
    region: "Central Texas",
    title: "Sealed Engineering Letters College Station TX | PE",
    description:
      "Sealed engineering letters for College Station and Brazos County. Foundation reports, permit letters, and beam sizing by a Texas PE.",
    h1: "Sealed Engineering Letters in College Station, Texas",
    lede: "Brazos County is expansive clay with a very large rental stock, which puts an unusual amount of repair, conversion, and code enforcement work through a fast growing plan review.",
    windstormArea: false,
    wind: {
      band: "roughly 110 to 120 mph basic wind speed",
      note: "Slightly higher than Austin because of the position relative to Gulf hurricane exposure. Exposure B in the developed areas.",
    },
    soil: {
      label: "expansive clay of the Brazos and Navasota bottoms with sandier uplands",
      note: "Variable. Lower lying areas near the river bottoms behave quite differently from the sandier uplands, sometimes within the same subdivision.",
    },
    permitOffice: {
      name: "the City of College Station Planning and Development Services, Building Division",
      note: "Bryan runs a separate review, and Brazos County handles the unincorporated areas.",
      submittal:
        "The Building Division reviews the application, the site plan, and all construction documents before a residential permit issues, and checks zoning compatibility for the proposed use as part of the same pass.",
      source: "https://www.cstx.gov/business-development/planning-and-development-services/",
      verified: "2026-08-17",
    },
    local: [
      "The rental stock is what makes this market unusual. A very large fraction of the housing in College Station and Bryan is investor owned and tenant occupied, which produces a steady flow of repair specifications, conversion permits, and code enforcement responses that a comparable city of this size would not generate. Turnover is annual and concentrated, and work gets scheduled into narrow windows.",
      "Soil in Brazos County is more variable than the Blackland Prairie markets. Areas near the Brazos and Navasota bottoms carry expansive clay that behaves like Waco. The sandier uplands behave considerably better. Because the county has grown outward quickly, adjacent subdivisions can sit on different profiles, so a foundation opinion here has to be based on the site rather than on the market.",
      "Rapid residential growth has pushed a large volume of new construction and addition permitting through the city's review, and the plan review comments that most often land on an engineer's desk are the ordinary ones: wall removals, additions bearing on existing framing, and garage conversions where framing designed for storage is being asked to carry occupancy.",
      "The university's presence keeps a constant demand for accessory structures, covered parking, and converted spaces around the older neighborhoods near campus, which is where the carport, patio cover, and conversion letter volume comes from.",
    ],
    emphasis: [
      "structural-letters-for-permits",
      "foundation-inspection-reports",
      "beam-and-header-sizing-letters",
      "repair-specification-letters",
      "carport-and-patio-cover-plans",
    ],
    nearby: ["houston", "waco", "austin", "killeen"],
    faqs: [
      {
        q: "Do garage conversions need engineering in College Station?",
        a: "Frequently, yes. A garage slab and its framing were built for a different use than living space, and converting it changes both the load and the code requirements that apply. The plan review comment usually asks for the framing to be shown adequate and for the slab and any new openings to be addressed, which is a letter rather than a full set in most cases.",
      },
      {
        q: "Why does foundation behavior vary so much across Brazos County?",
        a: "Because the soil does. Areas near the Brazos and Navasota river bottoms carry expansive clay that behaves like the Blackland Prairie. The sandier uplands are considerably more stable. The county has grown outward fast enough that neighboring subdivisions can sit on genuinely different profiles.",
      },
      {
        q: "I own rentals near campus. What is the fastest way to handle repeat work?",
        a: "Standardize the intake. Most repeat requests in this market are the same handful of items, and having photographs, framing information, and the jurisdiction ready at submission is what removes the back and forth. For portfolios, a single relationship covering multiple properties is more useful than a per property engagement.",
      },
    ],
  },

  {
    slug: "beaumont",
    name: "Beaumont",
    county: "Jefferson County",
    region: "Gulf Coast",
    title: "WPI-8 and Sealed Letters Beaumont TX | Texas PE",
    description:
      "Sealed engineering letters for Beaumont and Jefferson County, including WPI-8 windstorm certification through the licensed Texas engineer path.",
    h1: "Sealed Engineering Letters and WPI-8 in Beaumont",
    lede: "Jefferson County is a seaward county with the wettest climate in Texas and some of its softest ground. Wind certification and water are the two things every project here has to answer for.",
    windstormArea: true,
    wind: {
      band: "roughly 135 to 145 mph basic wind speed",
      note: "High coastal values. Jefferson County is a designated TDI seaward county, so the windstorm building code applies in full.",
    },
    soil: {
      label: "Beaumont clay, highly expansive, with a very high water table",
      note: "Flat terrain and shallow groundwater mean drainage is a structural design item rather than a landscaping preference.",
    },
    permitOffice: {
      name: "the City of Beaumont Building Codes Division",
      note: "Port Arthur, Nederland, and Groves run their own reviews, and windstorm compliance runs separately through TDI.",
      submittal:
        "The city holds free pre-development meetings every Thursday morning, first come first served, with department plan reviewers present. Inspections are scheduled only through the online portal and never by phone.",
      source: "https://www.beaumonttexas.gov/707/Building-Codes",
      verified: "2026-08-17",
    },
    local: [
      "Jefferson County is one of the fourteen TDI seaward counties, so windstorm certification applies to construction here in full. Reroofs, window and door replacements, additions, and detached structures all trigger the requirement, and undocumented past work is the most common reason a Beaumont file reaches an engineer.",
      "This is the wettest part of Texas by a considerable margin, and the ground reflects it. Beaumont clay is highly expansive and the water table is shallow, which combines into a foundation environment where drainage is a primary structural item. A foundation report here that does not examine grade, discharge, and standing water has skipped the most likely cause of whatever it just measured.",
      "The region has been through repeated major flood and storm events over the past decade, and a great deal of housing stock has been repaired, elevated, or partially rebuilt. That history matters to an engineering opinion: framing that was submerged, dried, and closed up is a different structure than one that was not, and the questions asked during a repair specification reflect it.",
      "Heavy industry across the Golden Triangle keeps a steady flow of contractor and commercial adjacent residential work moving, and the local familiarity with windstorm requirements is higher here than in most of the state, which usually makes intake faster.",
    ],
    emphasis: [
      "wpi-8-windstorm-certification",
      "foundation-inspection-reports",
      "repair-specification-letters",
      "roof-certification-letters",
      "foundation-repair-plans",
    ],
    nearby: ["houston", "tyler", "victoria", "corpus-christi"],
    faqs: [
      {
        q: "Does Beaumont require WPI-8 windstorm certification?",
        a: "Yes. Jefferson County is one of the fourteen Texas Department of Insurance seaward counties, so construction subject to the windstorm building code has to be documented with a certificate of compliance. That covers reroofs, window and door replacements, and additions, not just new construction.",
      },
      {
        q: "My house flooded and was repaired. Does that affect a foundation report?",
        a: "It affects what the report has to look at. Framing that was submerged and closed back up can carry decay, corroded connectors, and compromised subfloor that are not visible from the finished surface. The history is asked for at intake specifically so the observation goes to the right places.",
      },
      {
        q: "Why is drainage such a big deal in Beaumont?",
        a: "Because the terrain is flat, the water table is shallow, and the clay is highly expansive. Water that does not move away from a foundation stays against it, and that saturation drives the swell side of the cycle hard. In this market, drainage correction is frequently the largest single item in a repair plan.",
      },
    ],
  },

  {
    slug: "midland",
    name: "Midland",
    county: "Midland County",
    region: "West Texas",
    title: "Sealed Engineering Letters Midland TX | Texas PE",
    description:
      "Sealed engineering letters for Midland County. Permit letters, carport plans, and foundation certifications sealed by a Texas PE.",
    h1: "Sealed Engineering Letters in Midland, Texas",
    lede: "The Permian Basin builds in bursts. When the rig count moves, the permit queue moves with it, and the engineering that unblocks a project is worth more than the engineering itself.",
    windstormArea: false,
    wind: {
      band: "roughly 100 to 110 mph basic wind speed",
      note: "Modest mapped speed, but exposure C is the norm on open Permian Basin terrain, which raises the effective design pressures.",
    },
    soil: {
      label: "caliche and calcareous loam, low to moderate expansion",
      note: "Far better behaved than Central and East Texas clay. Foundation distress here is more often a drainage or fill quality issue than a shrink and swell one.",
    },
    permitOffice: {
      name: "the City of Midland Development Services Department",
      note: "Plan review is orchestrated by the Code Administration Division and typically pulls in Engineering, Transportation, Utilities, the Fire Marshal, and Health. Midland County reviews the unincorporated areas.",
      submittal:
        "Applications run through the PermitMidland portal. The property has to be platted and zoned residential, construction must start within 180 days of issue, and it cannot pause for more than 180 consecutive days.",
      source: "https://www.midlandtexas.gov/1259/Permitting-and-Inspections",
      verified: "2026-08-17",
    },
    local: [
      "Midland's soil is a relief compared with the rest of the state. Caliche and calcareous loam with low to moderate expansion potential means the classic Texas shrink and swell foundation failure is uncommon here. What replaces it is fill quality and drainage: rapid growth cycles produce subdivisions built quickly on placed fill, and a foundation that is moving in Midland is more often sitting on poorly compacted material or taking water it should not than reacting to clay.",
      "The boom and bust cycle of the Permian Basin shapes the construction market in a way that matters to schedules. When activity is high, contractors, inspectors, and plan reviewers are all oversubscribed at once, and a plan review comment that takes three weeks to answer is three weeks of a crew that is fully booked elsewhere. Speed on the engineering is worth disproportionately more here than the document costs.",
      "Covered parking is standard construction in this climate, and carport and patio cover plans are a steady category. Exposure C on open Permian terrain governs those structures through uplift, and the footing sizes that result surprise people who have seen the same structure built in a sheltered suburban setting.",
      "Manufactured and workforce housing is a large part of the regional stock, particularly outside city limits, and the lending on it carries the same HUD foundation certification requirement it does anywhere else in the state.",
    ],
    emphasis: [
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "manufactured-home-foundation-certification",
      "solar-structural-letters",
      "foundation-inspection-reports",
    ],
    nearby: ["odessa", "lubbock", "san-angelo", "el-paso"],
    faqs: [
      {
        q: "Are foundation problems less common in Midland than in Dallas?",
        a: "Yes, meaningfully. Permian Basin soils are caliche and calcareous loam with low to moderate expansion potential, so the seasonal shrink and swell that dominates Blackland Prairie foundations is not the driver here. When a Midland foundation is moving, poorly compacted fill and water intrusion are the more likely explanations.",
      },
      {
        q: "How fast can engineering move during a busy cycle?",
        a: "The document work is not the constraint. What sets the schedule is whether the deliverable needs a site visit and how quickly access can be arranged. Anything that can be produced from documents, including most permit letters and all carport plans, is not affected by how busy the field is.",
      },
      {
        q: "Why are carport footings here bigger than I expected?",
        a: "Because uplift governs, and open Permian terrain usually qualifies as exposure C rather than the sheltered exposure B most stock plans assume. A patio cover weighs almost nothing and has nothing on top of it, so the footing has to resist the wind trying to lift it rather than support a gravity load. Larger than intuition suggests is the normal correct answer.",
      },
    ],
  },

  {
    slug: "odessa",
    name: "Odessa",
    county: "Ector County",
    region: "West Texas",
    title: "Sealed Engineering Letters Odessa TX | Texas PE",
    description:
      "Sealed engineering letters for Odessa and Ector County. Permit letters, carport plans, and foundation certifications by a Texas PE.",
    h1: "Sealed Engineering Letters in Odessa, Texas",
    lede: "Ector County shares the Permian Basin's soil advantages and its scheduling pressure, with a heavier concentration of workforce and manufactured housing than its neighbor.",
    windstormArea: false,
    wind: {
      band: "roughly 100 to 110 mph basic wind speed",
      note: "As in Midland, exposure C on open terrain is what actually drives the design pressures rather than the mapped speed.",
    },
    soil: {
      label: "caliche and calcareous loam, low to moderate expansion",
      note: "Stable relative to Central and East Texas. Fill quality and drainage are the more common sources of residential foundation distress.",
    },
    permitOffice: {
      name: "the City of Odessa Building Inspection Division",
      note: "Ector County reviews the unincorporated areas, which carry a substantial share of the region's housing.",
      submittal:
        "Odessa names its adopted codes explicitly, including the 2018 International Residential Code. A letter written against the current published edition rather than the adopted one is the most common avoidable rejection here.",
      source: "https://www.odessa-tx.gov/1222/Building-Inspection-Permits",
      verified: "2026-08-17",
    },
    local: [
      "Odessa carries a heavier concentration of workforce and manufactured housing than Midland does, particularly outside the city limits. That makes FHA, VA, and USDA foundation certifications a larger share of the work here, and it makes crawl space access the practical constraint on timing far more often than the engineering does.",
      "The soil advantage is the same as Midland's. Caliche and calcareous loam with low to moderate expansion mean the seasonal clay cycle that dominates foundation engineering across most of Texas is not the local story. When an Odessa foundation is distressed, poorly compacted fill under a rapidly built subdivision and water reaching where it should not are the usual explanations.",
      "Boom cycle scheduling pressure applies here exactly as it does in Midland. When activity is high, everything is oversubscribed at once.",
      "Shade structures and covered parking are ordinary construction here rather than upgrades, and open terrain exposure governs them entirely through uplift rather than through the weight of anything sitting on top. A stock carport plan carried in from a lower exposure market is the most common reason one gets rejected at the counter, and the correction is almost always a larger footing than the person submitting it expected.",
    ],
    emphasis: [
      "manufactured-home-foundation-certification",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "foundation-inspection-reports",
      "solar-structural-letters",
    ],
    nearby: ["midland", "lubbock", "san-angelo", "el-paso"],
    faqs: [
      {
        q: "What usually slows down a foundation certification in Ector County?",
        a: "Crawl space access, almost every time. The footings, piers, and anchorage are the certification, and none of them can be observed without getting under the home. Skirting that has to be removed, stored belongings, and standing water are the recurring obstacles, and clearing them in advance is the single biggest thing an owner can do for the schedule.",
      },
      {
        q: "Do Odessa foundations move seasonally the way Central Texas ones do?",
        a: "Much less. Permian Basin soils have low to moderate expansion potential compared with the Blackland Prairie clays, so the seasonal cycle is far gentler. Distress here is more often traceable to fill quality under newer construction or to water reaching the foundation from a leak or from poor drainage.",
      },
      {
        q: "Can a carport plan from another state be used here?",
        a: "Only if a Texas engineer sealed it and it carries the design criteria for this address. Stock plans drawn for a lower wind speed or a sheltered exposure are the most common rejection in this category, and open Permian terrain frequently qualifies as exposure C, which raises uplift substantially.",
      },
    ],
  },

  {
    slug: "round-rock",
    name: "Round Rock",
    county: "Williamson County",
    region: "Central Texas",
    title: "Sealed Engineering Letters Round Rock TX | PE",
    description:
      "Sealed engineering letters for Round Rock and Williamson County. Permit letters, beam sizing, and foundation reports by a Texas PE.",
    h1: "Sealed Engineering Letters in Round Rock, Texas",
    lede: "Williamson County has grown faster than almost anywhere in the country, which means most of its housing stock is young, on placed fill, and still settling into its site.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate. Exposure B across the developed corridor, moving to C on the open ground east and north of the county.",
    },
    soil: {
      label: "Blackland clay east of I-35, limestone and thin soils west",
      note: "The escarpment transition runs through the county the same way it does through Austin and San Antonio.",
    },
    permitOffice: {
      name: "the City of Round Rock Planning and Development Services Department, Building Inspection Division",
      note: "Georgetown, Cedar Park, Leander, and Hutto each run their own review, and Williamson County handles the unincorporated areas.",
      submittal:
        "Round Rock runs a strict one permit system: every relevant contractor has to be listed on the application before the permit can be issued, so a missing subcontractor holds the whole thing.",
      source: "https://www.roundrocktexas.gov/city-departments/planning-and-development-services/building-inspection/",
      verified: "2026-08-17",
    },
    local: [
      "Round Rock's housing stock is unusually young, and that changes what an engineer is looking at. In an older market the question is what sixty years of movement and modification have done. Here the question is more often what happened during construction: fill placed and compacted under schedule pressure, drainage established before the landscaping went in, and post tensioned slabs on lots that were cut and filled to make a subdivision work.",
      "Post tensioned slabs dominate residential construction across Williamson County, and they are read differently from conventionally reinforced slabs. A post tensioned slab is designed to act as a stiffened plate, so its tolerance for deflection and the way distress shows up in it are not the same. An inspection report here that applies conventional slab criteria to a post tensioned foundation is answering the wrong question.",
      "The county straddles the same geological split as Austin. East of I-35 the soil is Blackland clay with high shrink and swell potential. West toward Cedar Park and Leander it turns to thin soils over limestone. Both conditions exist inside a fifteen minute drive.",
      "Rapid growth has also produced a large volume of new additions, covered patios, and accessory structures on homes that are barely a decade old, which is where a lot of the permit letter and cover plan volume comes from.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "structural-letters-for-permits",
      "carport-and-patio-cover-plans",
      "beam-and-header-sizing-letters",
      "solar-structural-letters",
    ],
    nearby: ["austin", "san-antonio", "killeen", "waco"],
    faqs: [
      {
        q: "My house is only eight years old and the doors are sticking. Is that normal?",
        a: "It is common enough to be worth measuring rather than worrying about. Young homes in fast growing areas sit on placed fill and go through their first full wet and dry cycles in the first several years, and some movement in that period is expected. An elevation survey establishes whether what is happening is within what the structure tolerates.",
      },
      {
        q: "Does a post tensioned slab get inspected differently?",
        a: "The measurement is the same and the interpretation is not. A post tensioned slab is designed to behave as a stiffened plate, so the deflection it tolerates and the way distress presents in it differ from a conventionally reinforced slab. Applying conventional criteria to one produces a conclusion that does not match the foundation.",
      },
      {
        q: "Which city reviews my project in Williamson County?",
        a: "It follows the address, and the county has a lot of adjacent municipalities. Round Rock, Georgetown, Cedar Park, Leander, and Hutto each run their own plan review with their own amendments, and unincorporated areas go to Williamson County. Send the plan review comment at intake and the letter is addressed to whoever issued it.",
      },
    ],
  },

  {
    slug: "victoria",
    name: "Victoria",
    county: "Victoria County",
    region: "Gulf Coast",
    title: "Sealed Engineering Letters Victoria TX | Texas PE",
    description:
      "Sealed engineering letters and certifications for Victoria County. Foundation reports, repair specifications, and permit letters by a licensed Texas PE.",
    h1: "Sealed Engineering Letters in Victoria, Texas",
    lede: "Victoria sits just inland of the windstorm boundary with wind loads that behave like the coast, in a region that took a direct hurricane landfall within recent memory.",
    windstormArea: false,
    wind: {
      band: "roughly 130 to 140 mph basic wind speed",
      note: "High coastal values despite being outside the TDI seaward county list. Victoria County does not carry the WPI-8 requirement; neighboring Calhoun and Refugio counties do.",
    },
    soil: {
      label: "coastal prairie clay, expansive",
      note: "Expansive clays over deltaic deposits, with the seasonal cycle moderated by higher coastal humidity relative to inland Texas.",
    },
    permitOffice: {
      name: "the City of Victoria Development Services Department",
      note: "The Development and Permitting Center coordinates building plan review, permits, inspections, and floodplain management. Victoria County reviews unincorporated areas, and projects a short drive toward Port Lavaca or Refugio cross into seaward county territory.",
      submittal:
        "Plan review for one and two family construction and remodeling is optional in Victoria, which is unusual in Texas. Where it is requested, review generally runs up to ten working days and a fee applies after the third review.",
      source: "https://www.victoriatx.gov/229/Development-Services",
      verified: "2026-08-17",
    },
    local: [
      "The most important thing to establish about a Victoria area project is which county it is actually in. Victoria County is not one of the fourteen TDI seaward counties, so there is no WPI-8 requirement here. Calhoun County to the southeast and Refugio County to the south both are. That boundary is a short drive, and a great many properties in this trade area sit on the wrong side of the assumption somebody made.",
      "Hurricane Harvey made landfall in this region in 2017, and the repair, rebuild, and elevation work that followed left a mark on the local housing stock. Structures that were repaired under pressure, sometimes without permits and sometimes without documentation, are the ones that later need an engineer to establish what is actually there before anything else can happen.",
      "Design wind speed here runs well above the interior of the state even without the windstorm requirement, so structural letters for anything on a roof, whether an array, a cover, or a mounted unit, carry real uplift numbers rather than nominal ones.",
      "Coastal prairie clay produces the usual expansive soil behavior, moderated somewhat by higher humidity than inland Texas sees. Foundation inspection and repair work is steady rather than dominant, and drainage is a larger part of the answer here than pier count.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "repair-specification-letters",
      "structural-letters-for-permits",
      "roof-certification-letters",
      "solar-structural-letters",
    ],
    nearby: ["corpus-christi", "houston", "beaumont", "san-antonio"],
    faqs: [
      {
        q: "Does Victoria need a WPI-8 windstorm certificate?",
        a: "No. Victoria County is not one of the fourteen Texas Department of Insurance seaward counties. Calhoun County to the southeast and Refugio County to the south are, so a project a short drive away can carry the requirement when one in Victoria does not. Confirm the county before assuming.",
      },
      {
        q: "The house was repaired after Harvey without permits. What now?",
        a: "That is an existing condition assessment, and it is a common request in this region. What can be established depends on what can be observed or exposed, and what can be documented from the repair. It is worth doing before a sale or a refinance rather than during one, because the timeline is not compatible with a closing calendar.",
      },
      {
        q: "Why are wind loads here so high if we are not in the windstorm area?",
        a: "Because the two things are decided differently. The ASCE 7 design wind speed follows hurricane exposure and stays high well inland along this stretch of coast. The TDI windstorm requirement follows a specific list of seaward counties. Victoria sits in high design wind and outside the certification requirement at the same time.",
      },
    ],
  },

  {
    slug: "harlingen",
    name: "Harlingen",
    county: "Cameron County",
    region: "Rio Grande Valley",
    title: "WPI-8 and Sealed Letters Harlingen TX | Texas PE",
    description:
      "Sealed engineering letters for Harlingen and Cameron County, including WPI-8 windstorm certification through the licensed Texas engineer path.",
    h1: "Sealed Engineering Letters and WPI-8 in Harlingen",
    lede: "Harlingen is inside Cameron County, which puts it inside the windstorm requirement even though it sits well back from the shoreline. That surprises people every year.",
    windstormArea: true,
    wind: {
      band: "roughly 140 to 150 mph basic wind speed",
      note: "Among the highest in Texas. Exposure is generally B or C inland from the Laguna Madre, which is the one factor working in a Harlingen project's favor.",
    },
    soil: {
      label: "Rio Grande delta clay and clay loam, expansive",
      note: "Long agricultural irrigation history across the surrounding land has shaped the local moisture regime.",
    },
    permitOffice: {
      name: "the City of Harlingen Building Permits and Inspections Division",
      note: "A separate Planning and Development Department guides land use across the city and its extraterritorial jurisdiction. Windstorm compliance runs separately through TDI, and Cameron County handles unincorporated areas.",
      submittal:
        "Harlingen has adopted the 2024 International Building Code and the 2024 International Residential Code. Review is stated as two to fourteen days depending on complexity.",
      source: "https://harlingentx.gov/departments/building_inspections/index.php",
      verified: "2026-08-17",
    },
    local: [
      "The windstorm requirement is decided by county, not by distance from the water, and Cameron County is a designated TDI seaward county in full. Harlingen sits roughly twenty five miles inland and is inside the requirement exactly as South Padre Island is. Owners and contractors are caught out by this every year, usually after a reroof.",
      "The upside of being inland is exposure. A Harlingen site generally qualifies as exposure B or C rather than the exposure D that applies at the shoreline, and that reduces design pressures relative to a coastal Cameron County property at the same mapped speed. It does not change whether certification is required.",
      "Manufactured housing is a substantial share of the Valley stock, and lending on it carries the HUD foundation certification requirement. In Cameron County that frequently means a file needs both a foundation certification and windstorm documentation, which are two different engagements with two different constraints, and starting them at the same time rather than in sequence is what keeps a closing on schedule.",
      "The surrounding agricultural land has been irrigated for generations, and the moisture regime in the delta clay reflects that history rather than natural conditions. Foundation reports here read irrigation and drainage patterns as a primary input.",
    ],
    emphasis: [
      "wpi-8-windstorm-certification",
      "manufactured-home-foundation-certification",
      "roof-certification-letters",
      "solar-structural-letters",
      "foundation-inspection-reports",
    ],
    nearby: ["brownsville", "mcallen", "corpus-christi", "alice"],
    faqs: [
      {
        q: "Harlingen is not on the water. Why does it need a WPI-8?",
        a: "Because the Texas Department of Insurance requirement is defined by county rather than by distance from the shoreline, and Cameron County is a seaward county in full. Harlingen sits about twenty five miles inland and is covered exactly as South Padre Island is.",
      },
      {
        q: "Does being inland reduce the wind design at all?",
        a: "It reduces the exposure category, which does lower design pressures relative to a shoreline site at the same mapped speed. It does not change the mapped speed itself, which is among the highest in Texas, and it does not change whether certification is required.",
      },
      {
        q: "My file needs both a foundation certification and windstorm documentation. What order?",
        a: "Start both at once rather than in sequence. They are separate engagements with separate constraints: the foundation certification waits on crawl space access, and the windstorm certification waits on inspection and on TDI processing. Running them in series is what turns a manageable timeline into a missed closing.",
      },
    ],
  },

  {
    slug: "san-angelo",
    name: "San Angelo",
    county: "Tom Green County",
    region: "West Texas",
    title: "Sealed Engineering Letters San Angelo TX | Texas PE",
    description:
      "Sealed engineering letters for San Angelo and Tom Green County. Permit letters, foundation reports, and carport plans by a Texas PE.",
    h1: "Sealed Engineering Letters in San Angelo, Texas",
    lede: "San Angelo sits on the transition between the Edwards Plateau and the Rolling Plains, which means shallow rock in some neighborhoods and moving clay in others.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate mapped speed, with exposure C common on the open country surrounding the city.",
    },
    soil: {
      label: "shallow calcareous soils over limestone, with expansive clay in the lower areas",
      note: "Depth to rock varies sharply, which produces differential bearing between parts of the same foundation.",
    },
    permitOffice: {
      name: "the City of San Angelo Planning and Development Services",
      note: "Building Permits and Inspections sits in the Community Development Building on West College Avenue. Tom Green County reviews the unincorporated areas, which carry a large share of the surrounding housing.",
      submittal:
        "The application and drawings are emailed to the permits department first. A project number comes back by email, and the documents are then uploaded for electronic review and approval.",
      source: "https://www.cosatx.us/departments-services/building-permits-inspections",
      verified: "2026-08-17",
    },
    local: [
      "The Edwards Plateau meets the Rolling Plains around San Angelo, and depth to rock changes sharply across short distances as a result. A foundation with part of its perimeter bearing on limestone at two feet and part bearing on clay at eight feet is a differential bearing problem, and it produces distress that looks like ordinary clay movement and does not respond to the same repair.",
      "Older housing stock across the central parts of the city sits on shallow foundations that predate current practice, and a large fraction of the local foundation work is on those homes rather than on newer subdivisions. Pier design here has to be based on what was actually found on site, because assuming a uniform profile is how a pier ends up bearing in the wrong material.",
      "Agricultural and ranch construction surrounds the city, and much of it sits in unincorporated Tom Green County where review is light. Manufactured and modular housing is common in that stock, and the HUD foundation certification requirement applies to lending on it regardless of what the local permitting looks like.",
      "Covered parking and shade structures are ordinary construction in this climate, and open country exposure governs them through uplift the same way it does across West Texas.",
    ],
    emphasis: [
      "foundation-inspection-reports",
      "manufactured-home-foundation-certification",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "foundation-repair-plans",
    ],
    nearby: ["abilene", "midland", "odessa", "lubbock"],
    faqs: [
      {
        q: "Why does one side of my house move and the other does not?",
        a: "In San Angelo that is frequently differential bearing. Depth to limestone changes sharply here, so part of a foundation can rest on rock while the rest rests on clay that moves seasonally. The two halves behave differently by design of the geology, and the repair has to address that rather than treating the whole foundation as one condition.",
      },
      {
        q: "Does a ranch property outside city limits need permits?",
        a: "Tom Green County's review of unincorporated areas is lighter than the city's, and requirements vary by structure type. What does not change is federal lending: an FHA, VA, or USDA loan on a manufactured home requires an engineer's foundation certification regardless of whether any local permit was ever pulled.",
      },
      {
        q: "How deep do piers need to go here?",
        a: "It depends entirely on where competent bearing is at that site, and in this area that varies over short distances. A pier design based on a typical section rather than on what was found on site is how a pier ends up bearing in the active zone, which is the one outcome the design exists to avoid.",
      },
    ],
  },

  {
    slug: "abilene",
    name: "Abilene",
    county: "Taylor County",
    region: "West Texas",
    title: "Sealed Engineering Letters Abilene TX | Texas PE",
    description:
      "Sealed engineering letters for Abilene and Taylor County. Roof certifications, foundation reports, and permit letters by a Texas PE.",
    h1: "Sealed Engineering Letters in Abilene, Texas",
    lede: "Abilene sits in the hail corridor on Rolling Plains clay, with an older housing stock that has taken sixty years of both.",
    windstormArea: false,
    wind: {
      band: "roughly 105 to 115 mph basic wind speed",
      note: "Moderate mapped speed. Severe thunderstorm wind and hail do more damage to roofs here than the design wind speed suggests.",
    },
    soil: {
      label: "Rolling Plains clay and clay loam, moderately to highly expansive",
      note: "Less severe than the Blackland Prairie but sufficient to produce ordinary seasonal foundation movement.",
    },
    permitOffice: {
      name: "the City of Abilene Planning and Development Services, Building Inspections Division",
      note: "Taylor County reviews the unincorporated areas, and the surrounding smaller municipalities run their own.",
      submittal:
        "Permits are applied for and tracked through MyGov. Abilene publishes a dedicated carport application separate from the general building permit application, so a carport here is its own submittal rather than a variation on one.",
      source: "https://abilenetx.gov/428/Building-Inspections",
      verified: "2026-08-17",
    },
    local: [
      "Abilene sits squarely in the West Texas hail corridor, and roof condition is a live question in most transactions here. What an underwriter wants from a roof certification in this market is a clear separation between damage that has shortened the covering's remaining service life and damage that is cosmetic, because both are almost always present on a roof that has been in place ten years.",
      "The city's housing stock skews older than the fast growing metros, which means the framing has a history. Walls removed, joists cut for mechanical runs, additions built onto original structures, and garage conversions done before anybody was pulling permits are all common, and they are what drives the beam sizing and repair specification work here.",
      "Rolling Plains clay produces ordinary seasonal foundation movement, less severe than the Blackland Prairie and more than the Permian Basin. Foundation inspection work is steady, and the reports here more often conclude that movement is within tolerance than they do in Dallas or Waco.",
      "Dyess Air Force Base and the surrounding rental and transitional housing keep a steady flow of transaction driven work moving, which puts roof and foundation letters on more files here than the city's size alone would suggest.",
    ],
    emphasis: [
      "roof-certification-letters",
      "foundation-inspection-reports",
      "beam-and-header-sizing-letters",
      "repair-specification-letters",
      "manufactured-home-foundation-certification",
    ],
    nearby: ["fort-worth", "san-angelo", "lubbock", "amarillo"],
    faqs: [
      {
        q: "Every roof in Abilene has hail marks. Does that fail a certification?",
        a: "No, and a letter that treated it that way would be useless in this market. The certification separates functional damage, which affects the covering's ability to shed water and its remaining life, from cosmetic damage, which does not. On a ten year old Abilene roof both are usually present, and saying which is which is the whole value of the letter.",
      },
      {
        q: "My 1950s house has a wall I want to remove. What does the city need?",
        a: "Typically a sealed letter covering the replacement beam, the bearing at each end, and where the resulting point loads go. On a house of that age the framing above the wall frequently is not what the plans would suggest, so attic photographs are the first thing the intake asks for.",
      },
      {
        q: "Is foundation movement here as bad as in North Texas?",
        a: "Less severe. Rolling Plains clays are moderately to highly expansive but do not reach the plasticity of the Houston Black clay that dominates Dallas and Waco. Reports here conclude that observed movement is within tolerance more often than they do in those markets, which is a real finding rather than a softer standard.",
      },
    ],
  },

  {
    slug: "alice",
    name: "Alice",
    county: "Jim Wells County",
    region: "South Texas",
    title: "Sealed Engineering Letters Alice TX | Texas PE",
    description:
      "Sealed engineering letters for Alice and Jim Wells County. Manufactured home foundation certifications and permit letters by a Texas PE.",
    h1: "Sealed Engineering Letters in Alice, Texas",
    lede: "Jim Wells County sits one county inland from the windstorm line with coastal wind loads and a housing stock that is heavily manufactured. Both facts drive what gets ordered here.",
    windstormArea: false,
    wind: {
      band: "roughly 125 to 140 mph basic wind speed",
      note: "High for an inland county. Jim Wells is not a TDI seaward county, so WPI-8 does not apply, but the structural wind loads are close to Corpus Christi's.",
    },
    soil: {
      label: "South Texas sandy clay loam over expansive clay",
      note: "Variable profile with a sandy surface over clay subsoil. Moisture reaches the clay unevenly, which is what produces the movement.",
    },
    permitOffice: {
      name: "Building Inspection, a division of the City of Alice Community Development Department",
      note: "Permits are handled through Code Enforcement, and Fire Prevention permits run separately under the Fire Marshal. Jim Wells County reviews the unincorporated areas, where a large share of the county's housing sits.",
      submittal:
        "Building Inspection administers contractor and subcontractor registration alongside permits, so a contractor who is not registered cannot pull one regardless of how complete the plans are.",
      source: "https://www.cityofalice.org/government/departments/community_development/building_inspection/index.php",
      verified: "2026-08-17",
    },
    local: [
      "Manufactured housing is a very large share of the Jim Wells County stock, both inside Alice and across the surrounding unincorporated county. That makes FHA, VA, and USDA foundation certifications the single most requested deliverable in this market, and it makes crawl space access the practical constraint on how fast a file moves.",
      "The county sits one county inland from Nueces and Kleberg, both of which are TDI seaward counties. Jim Wells is not, so there is no WPI-8 requirement here, and that boundary catches out contractors who work across the region. Design wind speed, however, does not respect the county line: an array or a cover in Alice is engineered to loads much closer to Corpus Christi than to San Antonio.",
      "Oil field activity across the Eagle Ford region drives a housing and workforce cycle that shows up in permitting volume rather than in the engineering itself. When activity is high, workforce housing goes in quickly, and manufactured home installations get certified after the fact more often than anybody would like.",
      "A sandy surface over clay subsoil means moisture reaches the expansive layer unevenly, which is the local variant of the Texas foundation problem. Drainage correction is a larger share of the right answer here than pier count usually is.",
    ],
    emphasis: [
      "manufactured-home-foundation-certification",
      "foundation-inspection-reports",
      "carport-and-patio-cover-plans",
      "structural-letters-for-permits",
      "solar-structural-letters",
    ],
    nearby: ["corpus-christi", "laredo", "mcallen", "victoria"],
    faqs: [
      {
        q: "Does Alice need WPI-8 windstorm certification?",
        a: "No. Jim Wells County is not one of the fourteen Texas Department of Insurance seaward counties. Nueces and Kleberg counties immediately to the east both are, so a project a short drive away can carry the requirement when one in Alice does not.",
      },
      {
        q: "Why is the wind design so heavy for an inland county?",
        a: "Because the ASCE 7 design wind speed follows hurricane exposure rather than a simple distance from the coast, and it stays high well inland across South Texas. Arrays, patio covers, and roofs in Alice are engineered to loads much closer to Corpus Christi than to San Antonio, even though the windstorm certification requirement does not apply.",
      },
      {
        q: "What holds up a manufactured home foundation certification here?",
        a: "Access, nearly always. The footings, piers, and anchorage are what the certification is about, and none of them can be observed without getting under the home. Skirting that has to be removed, stored items, and standing water are the recurring obstacles, and clearing them before the visit is the fastest thing an owner can do.",
      },
    ],
  },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function requireCity(slug: string): City {
  const c = getCity(slug);
  if (!c) throw new Error(`[cities] unknown slug ${JSON.stringify(slug)}`);
  return c;
}

/** Cities grouped by region, for the service area index page. */
export function citiesByRegion(): { region: City["region"]; cities: City[] }[] {
  const order: City["region"][] = [
    "Gulf Coast",
    "South Texas",
    "Rio Grande Valley",
    "Central Texas",
    "North Texas",
    "East Texas",
    "West Texas",
    "Panhandle and South Plains",
  ];
  return order
    .map((region) => ({ region, cities: CITIES.filter((c) => c.region === region) }))
    .filter((g) => g.cities.length > 0);
}
