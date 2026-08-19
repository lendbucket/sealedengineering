import type { Post } from "@/data/posts/types";

export const post: Post = {
  slug: "how-to-look-up-a-texas-windstorm-certificate",
  title: "How to Look Up a Texas Windstorm WPI-8 Certificate",
  description:
    "How to run the TDI windstorm certificate search, what the result means, and the five reasons it comes back empty, which is exactly when you need an engineer.",
  h1: "How to Look Up a Texas Windstorm Certificate, and What an Empty Result Means",
  excerpt:
    "Somebody has asked whether a property has a windstorm certificate and you need to find out. The search is free, public, and takes about a minute. The harder question is what an empty result means, because the Texas Department of Insurance does not tell you.",
  datePublished: "2026-08-18",
  related: [
    "wpi-8-windstorm-certification",
    "roof-certification-letters",
    "structural-letters-for-permits",
  ],
  body: [
    {
      p: "You are probably here because an insurer, a lender, a buyer, or an agent asked whether a property on the Texas coast has a windstorm certificate, and nobody involved is sure how to check. The check itself is free, public, and takes about a minute. This explains how to run it, how to read what comes back, and what to do about the answer that causes all the trouble, which is nothing at all.",
    },
    {
      p: "One thing to say at the top, because it changes how you should read the rest: looking up a certificate and obtaining one are completely different problems. Most people arrive needing the first and leave discovering they have the second.",
    },

    { h2: "Where the search lives" },
    {
      p: "The Texas Department of Insurance publishes windstorm certificates itself. Its Windstorm system carries the records, and the public entry point is the option labelled Find a Certificate. TDI states that it publishes all WPI-8s on its website and sends electronic information nightly to the Texas Windstorm Insurance Association about inspections and WPI-8s.",
    },
    {
      p: "That feed matters: TWIA and TDI read the same records. If a certificate is in TDI's system, TWIA knows.",
    },

    { h2: "How to search" },
    {
      p: "There are two ways in, and the second is the one most people need.",
    },
    {
      ol: [
        "By application or certificate number, if you have the paperwork. This is exact and it is the fastest route when a prior owner, a contractor, or a closing file produced a number.",
        "By street address, combined with the city, the zip code, or the county. This is what you use when all you have is a property.",
      ],
    },
    {
      p: "The address search is more forgiving than people expect. TDI states that partial address searches are permitted and that no wildcards are needed: entering just the first few letters or numbers will return results. That matters more than it sounds, because addresses are recorded by whoever filed the application, and a property recorded as 100 N Bay Ave will not match a search for 100 North Bay Avenue typed in full.",
    },
    {
      callout: {
        title: "Search short, not precise",
        body: "The single most common reason a certificate appears not to exist is that it does exist under a slightly different address string. Search the street number and the first few letters of the street name, then read the list. Precision is what makes this search fail.",
      },
    },

    { h2: "What comes back, and how to read it" },
    {
      p: "A successful search returns a WPI-8 or a WPI-8E, which can be viewed and printed. Both are certificates of compliance and they are not interchangeable, because they record different things about how the work was approved.",
    },
    {
      p: "A WPI-8 is issued where the process ran as intended: an application on Form WPI-1 was filed with TDI before construction began, and the work was then inspected while it was underway, by either a TDI windstorm inspector or an appointed Texas licensed professional engineer.",
    },
    {
      p: "A WPI-8E is issued for completed construction. It exists for work that was finished without a WPI-1 ever being filed, where a professional engineer licensed by the Texas Board of Professional Engineers and Land Surveyors later inspected what was built and submitted Form WPI-2E with a sealed post-construction report. Seeing a WPI-8E in a search result is not a defect. It is the system working for a property that missed the front door.",
    },
    {
      p: "Read the certificate for what it covers: the specific work certified, not the building. A property can hold a WPI-8 for a reroof and nothing at all for windows replaced four years later. Owners routinely read one certificate as clearing the whole structure. Insurers do not, and the gap surfaces at renewal or at closing, which is the worst time to find it.",
    },

    { h2: "The five reasons a search comes back empty" },
    {
      p: "This is the part TDI does not answer, and the part that matters. The department publishes the records and describes how to search them; it does not tell you what an absence means. An empty result is not one situation. It is five, and they have completely different consequences.",
    },
    {
      h3: "1. The address is recorded differently",
    },
    {
      p: "Do this one first. It costs nothing and it resolves a meaningful share of empty searches. Re-run with less input: the street number, two or three letters of the street name, filtered by county rather than city. Certificates hide under abbreviations, misspellings, and pre-annexation city names, and a short search finds all three where a precise one finds none of them. It is worth trying two or three spellings before concluding anything, because the cost of being wrong here is paying an engineer to certify work that was already certified.",
    },
    {
      h3: "2. The property is outside the designated catastrophe area",
    },
    {
      p: "No certificate exists because none was ever required. The requirement applies only inside the TDI designated catastrophe area: fourteen seaward counties in full, plus, in the department's wording, parts of Harris County east of Highway 146, where TDI names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres.",
    },
    {
      p: "The fourteen counties are Aransas, Brazoria, Calhoun, Cameron, Chambers, Galveston, Jefferson, Kenedy, Kleberg, Matagorda, Nueces, Refugio, San Patricio, and Willacy. If the property is not in one of those and not in a covered part of Harris County, the empty result is the correct and final answer, and the question the insurer asked was misdirected.",
    },
    {
      h3: "3. The structure predates the requirement",
    },
    {
      p: "The windstorm inspection program requirement began on January 1, 1988. TDI states that structures built prior to that date are eligible for insurance through TWIA under certain conditions. A house built in 1974 that has never been altered is not missing a certificate; it was never inside the process. What changes that is work done since: a reroof or a window replacement on that same 1974 house is new construction for these purposes and does need certifying.",
    },
    {
      h3: "4. A certificate was issued by TWIA rather than TDI",
    },
    {
      p: "There is a specific historical window worth checking before concluding nothing exists. Certificates numbered WPI-8C were issued by the Texas Windstorm Insurance Association, not TDI, for completed construction between January 1, 2017 and May 31, 2020. If work was finished in that window, the paperwork may exist under a different issuer. Ask the seller or the prior owner for documents rather than relying on the search alone.",
    },
    {
      h3: "5. The work was done and never certified",
    },
    {
      p: "This is the common one, and it is the reason most people end up needing an engineer. A roof was replaced, windows were changed, or a room was added, in a covered county, after 1988, and nobody filed a WPI-1 or obtained anything afterwards. The work is real, it is subject to the windstorm building code, and there is no record of it.",
    },

    { h2: "What to do when it is reason five" },
    {
      p: "Undocumented completed work is not a dead end, and it is not too late. TDI has a route for exactly this, and one detail in it is worth reading twice: for completed construction, any professional engineer licensed by the Texas Board of Professional Engineers and Land Surveyors may perform the inspections. Appointment by TDI is required for inspecting ongoing work and is not required here.",
    },
    {
      p: "The engineer inspects what can be inspected now, evaluates it against the applicable windstorm building code, and submits Form WPI-2E with a sealed post-construction inspection report and supporting documentation, or a sealed design. TDI then issues a WPI-8E.",
    },
    {
      p: "Whether that succeeds depends on evidence, and nobody can promise the outcome in advance. Three things decide it: what can be inspected today, what can be exposed without rebuilding the house, and what documentation survives. Construction photographs are worth more than any other single item.",
    },
    {
      p: "Where the evidence does not support certification, an honest engineer does not issue one. That is uncomfortable and it is correct, because a certificate that does not reflect the building is a coverage problem that surfaces after a storm, which is the worst possible moment to discover it.",
    },

    { h2: "The limit of what the search proves" },
    {
      p: "One caution, stated plainly because it is a genuine gap rather than a technicality. TDI publishes its WPI-8s and describes how to search them. It does not publish a statement about the completeness of its historical records, and it does not say anywhere that an absent result proves no certificate was ever issued.",
    },
    {
      p: "So treat an empty search as strong evidence and not as proof. Before spending money on the assumption that nothing exists, ask the seller, the prior owner, the contractor who did the work, and the closing file. Documents that never made it into a searchable system still count when somebody produces them.",
    },

    { h2: "The short version" },
    {
      ul: [
        "Search TDI's Windstorm system under Find a Certificate, by certificate number or by partial address plus county.",
        "Search short rather than precise. Over-specified addresses are the most common false negative.",
        "A WPI-8 means the work went through the process from the start; a WPI-8E means an engineer certified it after completion. Both are valid.",
        "A certificate covers the specific work certified, not the whole building.",
        "An empty result means one of five things, and only one of them requires an engineer.",
        "For undocumented completed work, any Texas licensed engineer may inspect and submit Form WPI-2E, and TDI issues a WPI-8E.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is the windstorm certificate search free?",
      a: "Yes. TDI publishes its WPI-8s on its own website and the search is public. You do not need an account, an agent, or an engineer to run it, and nobody should charge you to look.",
    },
    {
      q: "My search found nothing. Does that prove there is no certificate?",
      a: "No, and this is worth being careful about. It is strong evidence rather than proof. TDI does not publish a statement about the completeness of its historical records, and certificates numbered WPI-8C were issued by TWIA rather than TDI for completed construction between January 1, 2017 and May 31, 2020. Check with the seller, the prior owner, and the closing file before assuming nothing exists.",
    },
    {
      q: "The house is from the 1970s. Why is there no certificate?",
      a: "Because the requirement did not exist yet. The windstorm inspection program requirement began on January 1, 1988, and TDI states that structures built before that date are eligible for TWIA coverage under certain conditions. What matters is work done since: a reroof or window replacement on an older house in a covered county is new work and does need certifying.",
    },
    {
      q: "What is the difference between a WPI-8 and a WPI-8E?",
      a: "A WPI-8 is issued where a WPI-1 application was filed before construction and the work was inspected while underway by a TDI inspector or an appointed engineer. A WPI-8E is issued for completed construction, where an engineer inspected finished work and submitted Form WPI-2E with a sealed report. Both are certificates of compliance and a WPI-8E is not a lesser document.",
    },
    {
      q: "Does one certificate cover the whole house?",
      a: "No. A certificate records the specific work that was certified. A property can hold a certificate for a reroof and have nothing covering windows replaced later. This is one of the most common misreadings in a coastal transaction, and insurers do not share it.",
    },
  ],
};
