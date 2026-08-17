import type { Post } from "@/data/posts/types";

export const post: Post = {
  slug: "what-is-a-sealed-engineering-letter",
  title: "What Is a Sealed Engineering Letter? Texas Guide",
  description:
    "What a PE seal actually means in Texas, when a letter is required, what one contains, and why no engineer will tell you the conclusion in advance.",
  h1: "What a Sealed Engineering Letter Is, and When You Actually Need One",
  excerpt:
    "Somebody has told you to go and get an engineer letter, and nobody has explained what that is. Here is what the seal means, what the document contains, when it is genuinely required, and what it will never do for you.",
  datePublished: "2026-08-16",
  related: [
    "structural-letters-for-permits",
    "beam-and-header-sizing-letters",
    "foundation-inspection-reports",
  ],
  body: [
    {
      p: "Almost nobody arrives at this subject voluntarily. A plan reviewer added a comment, an underwriter attached a condition, or an inspector wrote a sentence with the word engineer in it, and now a project that was moving has stopped. The word used is usually letter, sometimes certification, occasionally just stamp, and the person saying it rarely explains what any of those mean.",
    },
    {
      p: "This is the explanation. It is written for the person who has been told to get one rather than for the person who issues them.",
    },

    { h2: "A seal is a licensed person taking responsibility" },
    {
      p: "In Texas, the practice of engineering is regulated under the Texas Engineering Practice Act, administered by the Texas Board of Professional Engineers and Land Surveyors. A professional engineer is an individual who has met education and experience requirements, passed examinations, and holds a current license issued by that Board. The seal is that individual's registered mark.",
    },
    {
      p: "When an engineer applies a seal, signs, and dates a document, they are making a specific statement: that they personally reviewed the evidence available, performed or directly supervised the analysis, and reached the conclusion written on the page. Their license is attached to that statement. If the conclusion turns out to have been reached carelessly, the consequence lands on them.",
    },
    {
      p: "That is the entire reason a permit office or an underwriter asks for one. They are not asking for a nicer looking document. They are asking for a document where somebody with something to lose has taken a position.",
    },
    {
      callout: {
        title: "The practical test",
        body: "A letter from an engineering company with no seal, no signature, and no date is correspondence. A letter with all three is a professional record. The difference is not formatting, and the offices that ask for one know exactly which they have received.",
      },
    },

    { h2: "Letter, report, certification, plan set: what the words mean" },
    {
      p: "The vocabulary is inconsistent across the industry and across jurisdictions, which is a genuine source of confusion. In practice the distinctions come down to length and to what is being asserted.",
    },
    {
      ul: [
        "A letter is short, usually one to three pages, and answers a specific question. Can this roof carry an array. Is this beam adequate for this opening. Is this framing sufficient for the proposed load. Letters are the most common deliverable in residential work by a wide margin.",
        "A report is longer and documents observations before reaching a conclusion. A foundation inspection report includes an elevation survey, photographs, and site observations, then states an opinion. The observations are as much the product as the conclusion is.",
        "A certification asserts compliance with a named external standard. A manufactured home foundation certification asserts compliance with the HUD Permanent Foundations Guide. A windstorm certification asserts compliance with the Texas Department of Insurance windstorm building code. The standard is named because the recipient is checking against it.",
        "A plan set is drawings. It is what a contractor builds from and what a plan reviewer checks dimensionally. Small residential plan sets, a carport, a patio cover, a foundation repair layout, are a handful of sheets rather than a book.",
      ],
    },
    {
      p: "Which one you need is determined by who asked and what they asked for, not by preference. Ordering a letter when the reviewer wanted drawings costs a rejection cycle, and that cycle is usually more expensive than the difference in price between the two.",
    },

    { h2: "When a sealed document is genuinely required" },
    {
      p: "Texas has no single statewide residential building code enforcement regime. Municipalities and counties adopt their own editions of the International Residential Code and International Building Code, amend them, and enforce them through their own plan review. The result is that the same project can require sealed engineering in one city and sail through in the next one over.",
    },
    { p: "That said, the situations below produce the requirement with real consistency." },
    {
      ol: [
        "Structural modification to an existing building. Removing a load bearing wall, widening an opening, or cutting into framing changes how load travels and the code does not prescribe an answer for the specific case.",
        "New load on existing framing. A rooftop solar array, a second story addition, heavy equipment, or a conversion of storage space to occupied space.",
        "Anything involving trusses. Trusses are engineered systems, manufacturers will not approve field modifications, and a cut web is an engineering problem the moment it happens.",
        "Federal lending on a manufactured home. FHA, VA, and USDA all require an engineer's foundation certification against the HUD guide, and no local permitting decision changes that.",
        "Construction in the Texas Department of Insurance windstorm catastrophe area, where compliance must be documented before coverage will be written or continued.",
        "A condition written by an underwriter, an insurer, or a plan reviewer that names an engineer specifically. When somebody has already written it down, the requirement is not a question of interpretation.",
      ],
    },

    { h2: "What is inside a properly written letter" },
    {
      p: "A letter that gets accepted the first time is not a letter with better prose. It contains six things, and the ones most often missing are the second and the fifth.",
    },
    {
      ul: [
        "The property address and the specific scope being addressed, stated narrowly enough that nobody can read it as covering more.",
        "The code edition the analysis was performed under, which must be the edition that jurisdiction has adopted rather than the current published one. This is the single most common cause of a rejected letter.",
        "The design parameters used: wind speed and exposure category for the site, live and dead loads, risk category, and any assumed material properties.",
        "The members, spans, connections, and bearing conditions examined, stated numerically rather than described.",
        "The conclusion, together with any condition it depends on. A conclusion that is only valid if something is verified in the field has to say so on the page rather than in a phone call.",
        "The seal, the signature, and the date.",
      ],
    },
    {
      p: "Sketches appear where a detail is what the reviewer actually needs. A letter that says a connection is adequate without showing it is a letter that generates a follow up comment.",
    },

    { h2: "Why nobody will tell you the conclusion in advance" },
    {
      p: "This is the part that frustrates people, and it is the part most worth understanding, because it is the source of the document's value.",
    },
    {
      p: "If an engineer could tell you before reviewing the evidence that the letter would say yes, the letter would be worth nothing to the permit office receiving it. The reason a plan reviewer accepts a sealed conclusion without independently redoing the analysis is that the conclusion followed the evidence. An engineer who promises the answer up front has stated plainly that their conclusions do not follow evidence, which is the one thing that would make the whole document worthless.",
    },
    {
      p: "What can be stated in advance, and should be, is exactly what will be examined, exactly what the document will contain, and what happens if the evidence does not support the conclusion you wanted. Usually what happens is a remedy: reinforce this span, tighten that spacing, correct these items and be re-observed. A no is rarely a dead end. It is a specification for what would make it a yes.",
    },

    { h2: "What a sealed document will never do" },
    {
      ul: [
        "It is not a guarantee or a warranty. An engineer states a professional judgement about observed conditions on a stated date. Nobody is insuring the outcome.",
        "It does not bind the recipient. A permit office can still ask a follow up question and an underwriter can still decline. The letter answers the question; it does not make the decision.",
        "It says nothing about what was concealed. If a connection is behind finished drywall and nobody opened the wall, the letter says that rather than assuming.",
        "It does not cover scope it does not name. A roof certification is not a structural evaluation of the roof framing, and a foundation certification is not a home inspection.",
      ],
    },

    { h2: "How to make it fast" },
    {
      p: "Almost all of the delay in getting a sealed document comes from the intake rather than the engineering. Three things move it more than anything else.",
    },
    {
      p: "First, send the thing that sent you here. The plan review comment, the underwriter condition, or the inspection note, verbatim and unsummarized. A letter written to answer the exact wording of a comment is accepted far more often than one written to answer a description of it.",
    },
    {
      p: "Second, photograph the framing. On a huge proportion of residential letters the question is what is above this wall or what is holding up this roof, and a set of attic photographs with a tape measure in frame answers it in seconds. This is frequently the difference between a document review and a site visit, which is to say between a day and a week.",
    },
    {
      p: "Third, give the real address. Wind speed and exposure category are looked up from it, and in a state that runs from roughly 100 miles per hour in the interior to over 150 on the lower coast, the address is not an administrative detail. It is an input to the calculation.",
    },

    { h2: "The short version" },
    {
      p: "A sealed engineering letter is a licensed individual putting their name behind a specific conclusion about a specific property, after looking at the evidence. It is required when a code, a lender, or a regulator wants somebody accountable rather than somebody confident. It contains the address, the scope, the code edition, the parameters, the analysis, and the conclusion. And its value depends entirely on the fact that the conclusion was not decided before the review started.",
    },
    {
      p: "If somebody has handed you a requirement and you are not sure which document it names, the fastest route to an answer is to show the requirement to an engineer rather than describe the situation. It frequently turns out to be something smaller than feared.",
    },
  ],
  faqs: [
    {
      q: "Is a stamp the same as a seal?",
      a: "In everyday use, yes. People say stamp, engineers say seal, and both refer to the licensed individual's registered mark applied alongside their signature and the date. A seal without a signature and date is incomplete and some jurisdictions will reject it on that basis alone.",
    },
    {
      q: "Can an engineer licensed in another state seal a Texas document?",
      a: "No. Engineering documents for a Texas property must be sealed by an engineer licensed in Texas. This is a frequent and expensive surprise on files handled by national vendors, and it is discovered in underwriting or plan review rather than at delivery.",
    },
    {
      q: "How long is a sealed letter valid?",
      a: "It is a statement about specific conditions on a specific date rather than a document with an expiry. In practice, recipients decide. A permit office generally accepts a letter for the permit it was written for. An underwriter may want current conditions if enough time has passed. Ask the recipient before paying for a second one.",
    },
  ],
};
