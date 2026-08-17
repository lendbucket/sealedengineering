import type { Post } from "@/data/posts/types";

export const post: Post = {
  slug: "when-a-permit-office-requires-an-engineer-letter",
  title: "When a Texas Permit Office Requires an Engineer",
  description:
    "Why plan review asks for sealed engineering, the projects that trigger it most, how to read a correction notice, and the five reasons letters get rejected.",
  h1: "When a Texas Permit Office Requires an Engineer Letter",
  excerpt:
    "Plan review sent back a comment with the word engineer in it and the job stopped. Here is why reviewers ask, which projects trigger it, how to read the comment, and what makes a letter get accepted the first time.",
  datePublished: "2026-08-16",
  related: [
    "structural-letters-for-permits",
    "beam-and-header-sizing-letters",
    "repair-specification-letters",
  ],
  body: [
    {
      p: "A plan review correction notice arrives with a line requiring sealed engineering, and a project that was moving stops. The crew is scheduled, the materials are ordered, and the comment is two sentences long with no explanation of what would satisfy it.",
    },
    {
      p: "This is what the reviewer is asking for and why, which projects produce the comment most reliably, and what separates a letter that clears it from one that generates the same comment again.",
    },

    { h2: "Why Texas is inconsistent about this" },
    {
      p: "There is no single statewide residential building code enforcement regime in Texas. Municipalities and counties adopt their own editions of the International Residential Code and International Building Code, amend them locally, and enforce them through their own plan review process.",
    },
    {
      p: "The practical result is that the same project draws different treatment in Houston, in Austin, and in an unincorporated county twenty minutes from either. A contractor working a metro area can hit six jurisdictions in a week, each with its own adopted edition and its own amendments, and a letter written for one is not automatically formatted for the next.",
    },
    {
      p: "Unincorporated areas add a further wrinkle. Some counties have no residential building permit requirement at all, some have one lighter than the neighbouring city, and a few are stricter. Establishing which office actually owns the review is the first step, not the last, because a letter addressed to an office that does not review residential permits is wasted paper.",
    },

    { h2: "What the reviewer is actually asking" },
    {
      p: "Reviewers are not asking for a document with a seal on it because a seal looks official. They are asking because the submitted drawings do not establish that something structural works, and the code does not prescribe an answer for the specific case in front of them.",
    },
    {
      p: "A reviewer can check a beam against a span table when the beam and the loading are both inside the table. They cannot check a beam that carries an unusual tributary area, or a wall being removed with no stated replacement load path, or a truss that somebody cut. At that point the code allows the design to be justified by engineering analysis, and the person who performs that analysis has to be licensed to do it.",
    },
    {
      p: "Understanding that changes what the letter should say. The reviewer has a specific gap in the submittal. Filling that gap precisely clears the comment. A general letter concluding that the project appears adequate does not fill any gap, and it will draw the comment again.",
    },

    { h2: "The projects that trigger it most" },
    {
      ol: [
        "Removing a load bearing wall. The most common structural permit item in Texas residential work, and the one reviewers question most, because open concept renovations are everywhere and the load path below the new beam is frequently ignored.",
        "New load on existing framing. An addition above, a second story, mechanical equipment, a heavy fixture, or a rooftop solar array.",
        "Truss modification. Cut, drilled, or damaged webs and chords. Manufacturers will not approve field modifications, so this reaches an engineer by default.",
        "Attic or garage conversion. Framing designed for storage or for a vehicle is being asked to carry occupancy, and the code load changes with the use.",
        "Additions bearing on an existing foundation, where nobody has established that the existing footing can take the new load.",
        "Repair of structural damage. Rot, termite, fire, impact, or water damage where a member has lost section.",
        "Retaining walls and small site structures above a jurisdiction's height or surcharge threshold.",
        "Carports and patio covers, which are uplift governed and are the category where stock plans from other states fail most often.",
      ],
    },

    { h2: "How to read the correction notice" },
    {
      p: "Correction notices are terse, and the useful information in them is easy to miss. Four things are worth extracting before anybody is called.",
    },
    {
      ul: [
        "The code edition cited. This is the edition that jurisdiction adopted, which is frequently not the current published one, and it is the value the letter must be written against.",
        "The specific element named. A comment about a header is a different letter from a comment about the whole framing plan.",
        "Whether a letter or drawings are being asked for. Reviewers usually say. Ordering a letter when drawings were wanted costs a full cycle.",
        "The permit or plan review number, which belongs on the letter so the reviewer can match it to the file without hunting.",
      ],
    },
    {
      callout: {
        title: "Send the comment, do not summarize it",
        body: "The single most useful thing a contractor can do is forward the correction notice verbatim. A letter written to answer the exact wording of a comment is accepted at a far higher rate than one written to answer somebody's description of it, and the difference costs nothing.",
      },
    },

    { h2: "Letter or plan set" },
    {
      p: "The rough rule is that a single element is a letter and a system is a set.",
    },
    {
      p: "One beam, one existing condition, one damaged member, or one question about adequacy is a letter, usually with a detail or a sketch where a detail is what the reviewer needs. Framing changes across a whole floor, a new structure, or anything altering the structural system generally wants a small plan set, because the reviewer needs to see geometry and dimensions rather than read a conclusion.",
    },
    {
      p: "Being told which one applies at intake, before any work starts, is worth more than the difference in price. A letter that gets sent back because drawings were wanted has cost the price of the letter plus a review cycle.",
    },

    { h2: "The five reasons letters get rejected" },
    {
      p: "Almost none of these are engineering errors. They are communication errors, which is why they are so avoidable.",
    },
    {
      ol: [
        "The wrong code edition. The letter cites the current published edition instead of the one the jurisdiction adopted. This is the most common rejection in Texas.",
        "The comment was not answered. The letter describes the project and concludes it is adequate without addressing the specific gap the reviewer identified.",
        "A conclusion with no values. Reviewers want the member, the span, the load, and the connection. A conclusion presented without them cannot be checked, and a reviewer who cannot check it asks again.",
        "The load path stops at the ceiling. A beam is specified with no statement of bearing, no jack and king stud count, and nothing about where the point loads go. On a pier and beam house this is not a formality; it is where the failure would actually occur.",
        "Existing conditions asserted rather than established. A letter that assumes typical framing, when nobody looked, describes a house that may not exist.",
      ],
    },

    { h2: "Can it be done without a site visit" },
    {
      p: "Frequently, yes. If the existing framing can be established from photographs, measurements, and drawings, a permit letter is a document review, which means it does not wait on scheduling.",
    },
    {
      p: "Attic photographs are what usually decide it. The question on a wall removal is what is above the wall, and a set of attic photographs with a tape measure in frame answers it in seconds. Where the conditions cannot be established from a submission, the honest answer is a site visit rather than a sealed opinion about a structure nobody looked at, and that should be said at intake rather than discovered later.",
    },

    { h2: "Work that is already built" },
    {
      p: "Sometimes the wall came out before anybody pulled a permit, and now a code enforcement notice or a sale has surfaced it. That is an existing condition assessment rather than a design, and it can still be sealed.",
    },
    {
      p: "What is possible depends on what can be observed: the support currently in place, the framing above, whether anything has deflected or moved, and whether concealed connections can be exposed at representative locations. Concealed work is the usual limit. Say at intake that the work is already built, because it changes the scope, and an honest scope is considerably cheaper than a rejected letter.",
    },

    { h2: "What to send at intake" },
    {
      ul: [
        "The plan review comment or correction notice, verbatim.",
        "The jurisdiction and the permit or project number.",
        "Plans, drawings, or a dimensioned sketch of the work as proposed.",
        "Existing framing information: member sizes, spans, spacing, and species where known.",
        "Photographs of the existing conditions, including the area being modified and the attic above it.",
        "The property address, so wind and seismic parameters are the real ones for the site. El Paso is the one Texas metro where seismic genuinely enters the design criteria, and it catches out engineers who work the rest of the state.",
      ],
    },
    {
      p: "With those six things, most permit letters are a document review. Without the first one, every letter is a guess at what somebody meant.",
    },
  ],
  faqs: [
    {
      q: "My city rejected a letter from another engineer. Can that be fixed?",
      a: "Usually, and the first step is reading the rejection. Most rejected letters fail for the same handful of reasons: the wrong code edition, an answer to a general version of the comment rather than the specific one, or a conclusion stated without the supporting values the reviewer needed. Send the rejection and the original letter together.",
    },
    {
      q: "Do unincorporated county areas need engineer letters?",
      a: "It varies enormously across Texas, from no building permit at all to a county requirement stricter than the neighbouring city. Establishing which office reviews the address is the first step, because a letter addressed to an office that does not review residential permits achieves nothing.",
    },
    {
      q: "How do I know if a wall is load bearing?",
      a: "By what is above it rather than by how it looks. A wall running perpendicular to the joists or rafters above and supporting their ends is bearing. A wall running parallel between them usually is not. Trusses complicate it, because a truss can be designed to bear at an interior point. Attic photographs answer it.",
    },
    {
      q: "Does the letter guarantee the permit will be issued?",
      a: "No. The letter answers the engineering question the reviewer raised. Issuing the permit is the jurisdiction's decision and can involve zoning, setbacks, fees, and other reviews that have nothing to do with structure.",
    },
  ],
};
