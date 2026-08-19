import type { Faq } from "@/data/types";

/**
 * The three B2B pages.
 *
 * These exist to win an account rather than an order. The difference shows up
 * in the copy: a service page explains what a deliverable is to somebody who
 * has never bought one, and these pages talk to somebody who buys them every
 * week and is tired of the way it currently works.
 */

export type Industry = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** The specific operational pain, named the way the buyer would name it. */
  pains: { title: string; body: string }[];
  /** What working with one engineering relationship changes. */
  answers: { title: string; body: string }[];
  /** Service slugs this buyer actually orders. */
  services: string[];
  /** Extra fields the waitlist form should ask this buyer for. */
  intakeNote: string;
  faqs: Faq[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "solar-installers",
    name: "For Solar Installers",
    title: "Solar Structural Letters for Installers | Texas PE",
    description:
      "One engineering relationship for every Texas jurisdiction. Sealed solar structural letters built for batch volume, with repeatable intake.",
    h1: "Structural Letters for Solar Installers Working Texas",
    lede: "You are not buying a letter. You are buying the day it takes off your permit calendar, in every jurisdiction you work, without managing a different engineer in each one.",
    pains: [
      {
        title: "Every jurisdiction words the requirement differently",
        body: "Houston asks for one thing, Austin asks for it in different terms, and a county office in between asks whether it is required at all. An installer working across a metro is not solving a structural problem, they are solving twenty administrative ones, and the engineer who has already read all twenty checklists is worth more than the engineer who is faster at the calculation.",
      },
      {
        title: "The letter is never the bottleneck until it is",
        body: "It is a two page document on a project that took months to sell, and it becomes the critical path on the morning a crew is already scheduled. Consistency beats speed here: a schedule absorbs a known interval and cannot absorb an unknown one.",
      },
      {
        title: "Restarting intake on every single job",
        body: "The same installer sends the same racking, the same modules, the same attachment, and the same crew standards to a new engineer who asks for all of it again. Everything except the address, the framing, and the array layout is constant across a company's whole pipeline, and treating it as new information on every order is pure waste.",
      },
      {
        title: "A rejected letter costs more than the letter did",
        body: "A rejection costs a resubmittal, a review cycle, and a moved crew. Almost none of them are engineering errors.",
      },
    ],
    answers: [
      {
        title: "Your standards are established once",
        body: "Racking, module, attachment, fastener, and installation standards are recorded once at the account level. Per project intake then narrows to what actually varies.",
      },
      {
        title: "Exposure and wind speed established at the address, every time",
        body: "The most common defect in a template solar letter is an exposure B assumption carried into a site that is exposure C. Wind pressure scales with terrain as well as speed, so that single unexamined assumption is the difference between an attachment spacing that holds and one that does not, and across West Texas and the Panhandle exposure C is the norm rather than the edge case. It is the reason two identical arrays four hours apart get two different fastener schedules.",
      },
      {
        title: "One relationship across every jurisdiction you work",
        body: "One engineer covers the metro, the counties around it, and the coastal counties where a windstorm certificate runs alongside the structural letter. Nothing is handed to a second firm halfway through a market, which is what usually happens when an installer expands into the seaward counties and discovers their existing engineer does not do windstorm work.",
      },
      {
        title: "Batch intake for pipeline volume",
        body: "Projects go in together and come back as they finish, rather than waiting on the slowest one. Each address still gets its own sealed letter.",
      },
    ],
    services: ["solar-structural-letters", "wpi-8-windstorm-certification", "structural-letters-for-permits", "carport-and-patio-cover-plans"],
    intakeNote:
      "Tell us your monthly volume, the jurisdictions you work, and the racking and attachment you standardize on. That is what sets up an account rather than an order.",
    faqs: [
      {
        q: "Can we get one letter that covers a batch of installs?",
        a: "Not as a single document, and any engineer offering that is offering something they should not. Each address has its own wind speed, exposure, framing, and array layout, and one letter covering several would be sealing an opinion about roofs nobody examined. What batching changes is the intake and the tracking, not the seal.",
      },
      {
        q: "What is the fastest way to submit a project?",
        a: "Address, attic photographs showing framing with member size and spacing visible, the array layout by roof plane, and the attachment being used. When the account already carries your standard equipment, that is the entire per project submission.",
      },
      {
        q: "Do you cover the coastal counties?",
        a: "Yes, and a coastal project usually has two things running at once. The structural letter addresses framing and attachment. WPI-8 windstorm certification is a separate Texas Department of Insurance compliance path that applies in the fourteen seaward counties and part of Harris County. Starting both together rather than in sequence is what keeps a coastal install on schedule.",
      },
      {
        q: "What if the framing does not support the array?",
        a: "You get the reason and the remedy: reinforcement over a defined span, a reduced footprint on the affected plane, a different attachment, or tighter spacing. That is a real outcome and it happens. An engineer who tells you in advance what the letter will conclude is not doing engineering.",
      },
      {
        q: "Do you do the interconnection or electrical review too?",
        a: "No. This is structural work: framing capacity, uplift, and attachment. Electrical design, interconnection, and utility submittals are a different discipline and we will say so rather than take work we should not.",
      },
    ],
  },

  {
    slug: "lenders-and-loan-officers",
    name: "For Lenders and Loan Officers",
    title: "Foundation Certifications for Lenders | Texas PE",
    description:
      "Manufactured home foundation certifications built around closing timelines. FHA, VA, and USDA, requiring a licensed Texas PE seal.",
    h1: "Foundation Certifications Built Around Your Closing Date",
    lede: "The condition shows up late, the borrower has movers booked, and the certification is now the only thing between the file and the table. That is the problem this is designed around.",
    pains: [
      {
        title: "It surfaces at the worst point in the file",
        body: "Foundation certification conditions are rarely identified at application. They appear in underwriting, sometimes after the appraisal, and by then the closing date is contractual and the borrower has made arrangements around it. Every day of turnaround after that point is a day of real consequence rather than an administrative one.",
      },
      {
        title: "The wrong addressee means a reissue",
        body: "A certification made out to the wrong lender, carrying a borrower name that does not match the file, or citing a serial number that does not match the title work has to be corrected. That is a second cycle on a document that was technically correct, and it is entirely avoidable with three fields captured at intake.",
      },
      {
        title: "Out of state engineers",
        body: "A certification has to be sealed by an engineer licensed in the state where the property sits. National vendors sometimes deliver a seal from the wrong state, and the discovery happens in underwriting rather than at delivery.",
      },
      {
        title: "Nobody tells you what is actually going to happen",
        body: "A loan officer needs to know two things: when the engineer will be on site, and what the possible outcomes are. What they usually get is a promise of speed and then silence, which turns a manageable condition into a daily phone call.",
      },
    ],
    answers: [
      {
        title: "Written to the HUD standard the underwriter is citing",
        body: "HUD's Permanent Foundations Guide for Manufactured Housing, published as HUD-7584 and cited by HUD as HUD-4930.3G, is the standard the foundation is measured against, and HUD requires the certification to come from a professional engineer or registered architect licensed in the state where the home sits. The certification names that standard, describes the foundation as observed against it, and states compliance or itemizes what does not. That is what the condition asks for, in the terms it asks for it.",
      },
      {
        title: "Addressee, borrower, and serial numbers captured before the visit",
        body: "Lender name, borrower name as it appears in the file, loan type, and the home's serial and HUD label numbers are collected at intake rather than after the report is written. Reissues for clerical mismatch stop happening.",
      },
      {
        title: "Sealed by a Texas licensed PE, on Texas property",
        body: "One licensure question with one answer. Nothing gets subcontracted to a seal from another jurisdiction.",
      },
      {
        title: "Deficiencies come back as a list you can act on",
        body: "When a foundation does not comply, the itemized list of what does not and what compliance would require is what lets a borrower or a seller get it corrected and the home re-observed. That path is faster than it sounds and it is far faster than starting over with a second engineer.",
      },
    ],
    services: ["manufactured-home-foundation-certification", "roof-certification-letters", "foundation-inspection-reports", "repair-specification-letters"],
    intakeNote:
      "Send the underwriter's condition language verbatim along with the address. It is the single fastest way to make sure the delivered document closes the condition rather than restarting it.",
    faqs: [
      {
        q: "What do you need from us to start?",
        a: "Property address and access arrangements, borrower name exactly as it appears in the file, lender name as the certification should be addressed, loan type, and the underwriter's condition language if one has been issued. The home's serial and HUD label numbers help if you have them and are confirmed on site if you do not.",
      },
      {
        q: "Can you guarantee the foundation will pass?",
        a: "No, and a certification from anyone who would is worth nothing to your underwriter. The value of the seal is that the conclusion follows the observation. What can be committed to is what will be looked at, what the certification will contain, and that deficiencies come back itemized rather than as a rejection.",
      },
      {
        q: "The borrower has a certification from the previous purchase. Can we reuse it?",
        a: "Often, and it is worth asking your underwriter before ordering a second one. What usually blocks reuse is a borrower name from the prior transaction, an addressee that is a different lender, or a gap long enough that current conditions are wanted. If it is declined, the reason is normally one of those rather than anything about the foundation.",
      },
      {
        q: "Does the certification cover the condition of the home?",
        a: "No. It addresses the foundation system against the HUD guide. If the file also needs a roof certification or a structural opinion on the home itself, those are separate deliverables and can run alongside rather than after.",
      },
      {
        q: "Do you work with VA and USDA files as well as FHA?",
        a: "Yes. HUD's guide is the standard the foundation is measured against in each case, and in practice the same document satisfies all three. What differs is where the instruction comes from: it arrives in a specific lender's written condition rather than as one rule worded identically across programs. That is why the loan type and the condition language are both captured at intake rather than assumed.",
      },
    ],
  },

  {
    slug: "realtors-and-title-companies",
    name: "For Realtors and Title Companies",
    title: "Transaction Letters for Realtors | Texas PE Sealed",
    description:
      "Sealed engineering letters for Texas transactions. Foundation reports, roof certifications, and repair specifications produced on a closing calendar.",
    h1: "Sealed Transaction Letters Without the Wait",
    lede: "An option period is short and a closing date is a contract. This is engineering work organized around both, delivered as a document your buyer, seller, and underwriter can all read.",
    pains: [
      {
        title: "The option period is the whole constraint",
        body: "A general inspector flags a foundation and the clock is already running. An engineer who cannot tell you when they will be on site is not usable, whatever the report would have said.",
      },
      {
        title: "Three repair bids that cannot be compared",
        body: "Three proposals from three repair companies are three different scopes at three prices, and none of them are comparable. One quotes eighteen piers along the north side, one quotes twelve and a drainage correction, one quotes twenty six and a full perimeter. The buyer is not choosing between prices. They are choosing between three descriptions of a house nobody measured, written by three parties who are each paid more if the answer is yes. A sealed engineering opinion is the only document in that conversation without that problem.",
      },
      {
        title: "Cracks that mean nothing and cracks that mean something",
        body: "Every Texas house on clay cracks. A photograph cannot tell a buyer which kind they are looking at, and it cannot tell a seller either. An elevation survey replaces the argument with a number.",
      },
      {
        title: "Late conditions on the lender side",
        body: "Roof and foundation conditions land in underwriting after everything else is finished, when what is needed is a document that closes the condition on the first submission rather than one that generates a follow up question. The difference is usually whether the engineer was told what the condition actually said.",
      },
    ],
    answers: [
      {
        title: "Independent, and it says so",
        body: "No repair work is sold, no contractor recommended, no price quoted. That is what makes the report usable by both sides.",
      },
      {
        title: "Measurement rather than opinion",
        body: "A relative elevation survey produces a number and a contour, and a survey taken a year later can be compared against it. Texas clay moves seasonally, so a single reading is a snapshot and two readings a year apart are evidence. That is the difference between an engineering report and a strongly worded assessment, and it is the reason a report written this way survives a second opinion.",
      },
      {
        title: "Written for the reader who has to act on it",
        body: "Underwriters want the standard named. Buyers want to know whether to walk. Sellers want to know what is actually required. Three readers, one document, and each of them able to find their answer without interpreting anybody else's.",
      },
      {
        title: "One relationship for the whole file",
        body: "Foundation, roof, repair specification, and permit letters all come from one place. That matters on the transactions that need two of them.",
      },
    ],
    services: ["foundation-inspection-reports", "roof-certification-letters", "repair-specification-letters", "manufactured-home-foundation-certification"],
    intakeNote:
      "Tell us the option period end date or the closing date at intake. It is the constraint that determines everything else, and it is better known at the start than discovered halfway through.",
    faqs: [
      {
        q: "Can an engineering report be done inside an option period?",
        a: "That is what the intake is organized around, and the honest constraint is site access rather than the writing. Give us the option period end date at the start, along with access arrangements, and scheduling is worked against that date rather than against a queue.",
      },
      {
        q: "Will the report tell my client what repairs will cost?",
        a: "No. Cost is a contractor's number and it varies by market and season. The report establishes what the foundation is doing and what class of remedy the conditions call for, which is what both sides need before anyone asks for a price.",
      },
      {
        q: "My buyer wants to know if the house is safe. Will the report say that?",
        a: "It will say what was measured, whether the observed movement and distress are consistent with normal seasonal behavior or with something progressive, and what is recommended. That is a more useful answer than a yes or no, and it is one that holds up when somebody disputes it later.",
      },
      {
        q: "Does an engineer's roof letter carry more weight than a roofer's?",
        a: "With some lenders, yes, and specifically because the engineer is not the party who would be paid for the repair. Read the underwriter's condition language before ordering, because it usually names which one it will accept.",
      },
      {
        q: "Can you look at a property before it goes on the market?",
        a: "Yes, and a seller who does that has more options than one who finds out during an option period. A pre listing report gives time to correct drainage, address a real issue, or simply price with the information in hand rather than negotiating against a surprise.",
      },
    ],
  },
];

export const INDUSTRY_SLUGS = INDUSTRIES.map((i) => i.slug);

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
