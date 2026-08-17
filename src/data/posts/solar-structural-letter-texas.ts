import type { Post } from "@/data/posts/types";

export const post: Post = {
  slug: "solar-structural-letter-requirements-texas",
  title: "Solar Structural Letter Requirements in Texas",
  description:
    "What a Texas solar structural letter has to establish, why exposure category matters more than wind speed, and the five things that get letters rejected.",
  h1: "Solar Structural Letter Requirements in Texas, Explained",
  excerpt:
    "Rooftop PV in Texas is governed by uplift, not by weight. Here is what the letter has to establish, why the exposure category matters more than most people expect, and the five reasons letters come back.",
  datePublished: "2026-08-16",
  related: [
    "solar-structural-letters",
    "wpi-8-windstorm-certification",
    "structural-letters-for-permits",
  ],
  body: [
    {
      p: "Most people approaching a rooftop solar permit for the first time assume the structural question is about weight. It is a reasonable assumption and it is wrong. A residential array adds roughly three to five pounds per square foot of dead load, which is a modest number against what a roof already carries, and framing capacity is rarely where a design fails.",
    },
    {
      p: "What governs rooftop PV is wind trying to lift it off. That is where the analysis lives, that is where designs change, and that is why a letter written from a national template is a liability in a state whose design wind speeds range from around 100 miles per hour in the interior to above 150 on the lower coast.",
    },

    { h2: "The three questions the letter answers" },
    {
      p: "A solar structural letter is short because it is narrow. It establishes three things and deliberately stops.",
    },
    {
      h3: "1. Can the existing framing carry the added load",
    },
    {
      p: "This means the actual framing, not the framing implied by the construction year. Member size, spacing, span, species, and grade all matter, and so does what is already on the roof. A 2x4 truss at 24 inches on center under existing concrete tile is a materially different question from a 2x6 rafter at 16 inches under a single layer of composition shingle. Cut, notched, or modified members are common in older housing stock and cannot be assumed away.",
    },
    {
      h3: "2. Do the attachments resist uplift at this specific site",
    },
    {
      p: "This is the governing check in almost every case. ASCE 7 assigns a basic wind speed by location and the resulting pressure on roof zones scales with the square of that speed. It also depends on the roof zone: corners and edges see substantially higher pressures than the interior field of a roof plane, which is why array layout matters and why an array pushed to a roof edge is a different calculation from one held back.",
    },
    {
      h3: "3. Does the specific attachment develop the required capacity",
    },
    {
      p: "Lag screw diameter, thread embedment into the framing member, the species and specific gravity of that member, and the spacing along and across the array all appear here. This is the part of the analysis that most often changes a design: the framing passes and the attachment spacing has to tighten.",
    },

    { h2: "Exposure category: the thing most template letters get wrong" },
    {
      p: "ASCE 7 assigns an exposure category describing the terrain around a building, and it changes design pressures substantially at the same wind speed. Exposure B is urban and suburban terrain with closely spaced obstructions. Exposure C is open terrain with scattered obstructions. Exposure D is flat unobstructed areas and water surfaces.",
    },
    {
      p: "Template letters assume exposure B, because most of the housing stock in most of the country sits in it. Large parts of Texas do not. The South Plains around Lubbock, the Panhandle around Amarillo, the Permian Basin, and a great deal of ranch land in between are open terrain that qualifies as exposure C. Coastal and bay front sites reach exposure D.",
    },
    {
      p: "The practical consequence is that an attachment spacing which is entirely adequate on a Dallas roof in exposure B can be insufficient on an equivalent roof outside Lubbock at a similar mapped wind speed. Nothing about the array changed. The terrain did.",
    },
    {
      callout: {
        title: "The one question worth asking your engineer",
        body: "Ask what exposure category was used and why. If the answer is a default rather than a determination made from the actual site, the attachment spacing in the letter has not been established for the roof it is describing.",
      },
    },

    { h2: "The Texas wind map, in plain terms" },
    {
      p: "For a Risk Category II residence, the ASCE 7 basic wind speed across Texas breaks roughly into four bands. These are planning context; the value used in any sealed letter is the one looked up for the specific address.",
    },
    {
      ul: [
        "Interior and North Texas, including Dallas, Fort Worth, Austin, and Waco: the lowest band in the state, generally around 105 to 115 miles per hour.",
        "West Texas and the Panhandle: similar mapped speeds, but frequently exposure C, which raises the effective design pressure well above what the number alone implies.",
        "The band running inland from the coast, including Houston, Victoria, and much of South Texas: substantially higher, commonly 130 to 140.",
        "The lower coast and the Rio Grande Valley, including Corpus Christi, Brownsville, and Harlingen: the highest in the state, reaching 145 to 155, with exposure D at shoreline sites.",
      ],
    },
    {
      p: "The Rio Grande Valley surprises people most. McAllen sits well inland and carries design wind speeds far closer to Corpus Christi than to San Antonio, because the wind map follows hurricane exposure rather than a simple distance from the shoreline.",
    },

    { h2: "Windstorm certification is a separate thing" },
    {
      p: "This trips up installers working coastal Texas for the first time. A structural letter and a WPI-8 windstorm certificate are different documents serving different masters, and having one does not produce the other.",
    },
    {
      p: "The structural letter addresses whether the roof framing and the attachments handle the array, and it goes to the permit office. The WPI-8 is a Texas Department of Insurance certificate of compliance required in the fourteen seaward counties and the part of Harris County east of Highway 146, and it exists so that windstorm insurance can be written or continued on the property. A coastal solar project frequently needs both, and starting them in sequence rather than together is what turns a manageable schedule into a missed one.",
    },

    { h2: "The five reasons letters get rejected" },
    {
      ol: [
        "The wrong code edition. The jurisdiction adopted an edition and amended it, and the letter cites the current published version instead. This is the most common rejection in Texas and it has nothing to do with the engineering.",
        "An exposure category assumed rather than determined. Covered above. It is the most consequential technical error of the five.",
        "Framing asserted rather than established. A letter concluding that typical framing is adequate, when nobody established what the framing actually is, describes a house that may not exist.",
        "Attachment capacity taken from a manufacturer sheet without checking the substrate. Published withdrawal values depend on the species and specific gravity of what the fastener goes into. A value valid in Douglas Fir is not valid in Southern Yellow Pine or in Spruce Pine Fir.",
        "A conclusion without the values behind it. Reviewers want to see the spacing, the load, and the member. A letter stating that the design is adequate, without them, gets the same comment again.",
      ],
    },

    { h2: "What to submit to get it back quickly" },
    {
      p: "A solar structural letter is a document review, which means it does not wait on scheduling, a homeowner being home, or a technician driving four hours. What it does wait on is a complete submission.",
    },
    {
      ul: [
        "The site address, so wind speed and exposure are the real ones rather than a default.",
        "Roof framing information: member size, spacing, span, and species or grade where it is known.",
        "Attic photographs, including anything cut, notched, sistered, or otherwise modified. A tape measure in frame is worth more than a description.",
        "The array layout on each roof plane, showing where modules sit relative to edges and ridges.",
        "Module and racking cut sheets, and specifically the attachment or standoff being used.",
        "Roof covering type and approximate age, because existing dead load matters and because a tile roof is a different question from shingle.",
      ],
    },

    { h2: "When the answer is not a clean yes" },
    {
      p: "Sometimes the framing does not carry the array as designed, or the attachment spacing required is tighter than the racking allows. That is a real outcome and it is not a failed order.",
    },
    {
      p: "What comes back is the reason and the remedy: sister the rafters over a defined span, reduce the array footprint on the affected plane, move to an attachment with greater withdrawal capacity, or tighten spacing. Every one of those is a design change rather than a dead project, and knowing about it before a crew is scheduled is considerably cheaper than discovering it afterward.",
    },
    {
      p: "An engineer seals what the evidence supports. That is the whole reason the permit office accepts the letter without redoing the analysis, and it is why nobody will tell you in advance what it will conclude.",
    },
  ],
  faqs: [
    {
      q: "Does every Texas city require a structural letter for solar?",
      a: "No. It depends entirely on the authority having jurisdiction. Some accept a manufacturer's certification for standard framing, some require a sealed letter on every rooftop array, and some only ask when the framing is trusses of unknown origin or the covering is tile. Read the plan review checklist for the specific jurisdiction before ordering.",
    },
    {
      q: "Can one letter cover several installs?",
      a: "Not as one document. Each address has its own wind speed, exposure, framing, and layout, so a single letter covering several would be sealing an opinion about roofs nobody examined. Volume is handled by making the intake repeatable, not by generalizing the seal.",
    },
    {
      q: "What changes on a tile or metal roof?",
      a: "Tile adds significant existing dead load, which is the case where framing capacity genuinely comes into question rather than being a formality. Metal usually moves the attachment from lag screws into clamps or seam attachments, where capacity comes from tested manufacturer values rather than from wood withdrawal.",
    },
    {
      q: "Do you need to visit the roof?",
      a: "No. This is a document review built from framing information, attic photographs, the array layout, and equipment cut sheets. If the framing cannot be established from what is submitted, the missing item is named rather than assumed, because an engineer cannot seal an assumption about a structure nobody looked at.",
    },
  ],
};
