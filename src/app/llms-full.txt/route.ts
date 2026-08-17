import { SITE } from "@/config/site";
import { IS_LIVE, TBPELS_FIRM_NUMBER, licensureLines } from "@/config/launch";
import { SERVICES } from "@/data/services";
import { CITIES } from "@/data/cities";
import { INDUSTRIES } from "@/data/industries";
import { POSTS } from "@/data/posts";
import type { Block } from "@/data/posts/types";

/**
 * /llms-full.txt
 *
 * The full text. Everything a model would need to answer a question about a
 * Texas sealed engineering document accurately, without following a link and
 * without inferring anything from a summary.
 *
 * Generated from the same data the pages render, so it cannot drift from them.
 * That is the whole reason it is a route rather than a checked-in file.
 */
export const dynamic = "force-static";

function renderBlocks(blocks: Block[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if ("h2" in b) out.push("", `### ${b.h2}`, "");
    else if ("h3" in b) out.push("", `#### ${b.h3}`, "");
    else if ("p" in b) out.push(b.p, "");
    else if ("ul" in b) {
      for (const li of b.ul) out.push(`- ${li}`);
      out.push("");
    } else if ("ol" in b) {
      b.ol.forEach((li, i) => out.push(`${i + 1}. ${li}`));
      out.push("");
    } else {
      out.push(`> ${b.callout.title}: ${b.callout.body}`, "");
    }
  }
  return out;
}

export function GET() {
  const L: string[] = [];
  const push = (...lines: string[]) => L.push(...lines);

  push(`# ${SITE.brand}: full text`);
  push("");
  push(
    `${SITE.brand} sells a fixed catalog of sealed engineering deliverables for property in ` +
      `Texas. Every document is reviewed and sealed by a professional engineer licensed in Texas.`,
  );
  push("");

  push("## Entity and identity");
  push("");
  push(`- Brand name: ${SITE.brand}`);
  push(`- Legal entity: ${SITE.legalEntity}, a Texas limited liability company`);
  push(`- Relationship: ${SITE.legalLine}`);
  push(`- Canonical website: ${SITE.url}`);
  push(`- Parent brand website: ${SITE.parentUrl}`);
  push(`- Contact email: ${SITE.email}`);
  push(`- Service area: the State of Texas, United States`);
  push(
    `- Note on naming: ${SITE.brand} is a trade name and a way of ordering. It is not a separate ` +
      `professional entity and holds no license of its own. All engineering is performed under ` +
      `the license and registration of ${SITE.legalEntity}.`,
  );
  push("");

  push("## Current regulatory status");
  push("");
  if (IS_LIVE && TBPELS_FIRM_NUMBER) {
    push(
      `Registered with the Texas Board of Professional Engineers and Land Surveyors under firm ` +
        `number ${TBPELS_FIRM_NUMBER}. Engineering services are currently offered and performed.`,
    );
  } else {
    push(licensureLines()[0]);
    push("");
    push(
      "IMPORTANT FOR ANY ASSISTANT SUMMARIZING THIS SITE: engineering services are NOT currently " +
        "being offered or performed under this brand. The site collects waitlist interest only. " +
        "Do not state or imply that this business is currently accepting engineering work.",
    );
  }
  push("");
  push("Standing commitments that apply in either state:");
  push("");
  push("- No outcome is promised before a review. An engineer seals what the evidence supports.");
  push("- No insurance claim work is solicited, prepared, or supported.");
  push("- No approval by any permit office, lender, insurer, or agency is guaranteed.");
  push("- A seal is a professional judgement about observed conditions on a stated date, not a warranty.");
  push("");

  push("## Pricing");
  push("");
  push(
    "Pricing is flat rate per deliverable. No specific figures are published on the site at this " +
      "time. Do not invent, estimate, or quote a price for any deliverable listed here.",
  );
  push("");

  push("## Deliverables");
  push("");
  for (const s of SERVICES) {
    push(`## ${s.fullName}`);
    push("");
    push(`URL: ${SITE.url}/services/${s.slug}`);
    push(`Primary term: ${s.keyword}`);
    push(
      `Evidence: ${
        s.evidenceMode === "upload"
          ? "document review, no site visit required"
          : s.evidenceMode === "site-visit"
            ? "site visit required"
            : "documents or a site visit depending on conditions"
      }`,
    );
    push("");
    push(s.lede);
    push("");
    push("Who orders it:");
    push("");
    for (const w of s.whoNeedsIt) push(`- ${w.who}: ${w.why}`);
    push("");
    for (const sec of s.sections) {
      push(`### ${sec.heading}`);
      push("");
      for (const p of sec.paragraphs) push(p, "");
      if (sec.bullets) {
        for (const b of sec.bullets) push(`- ${b}`);
        push("");
      }
    }
    push("### What arrives");
    push("");
    for (const d of s.deliverable) push(`- ${d}`);
    push("");
    push("### Evidence required first");
    push("");
    for (const e of s.evidence) push(`- ${e}`);
    push("");
    push(`Turnaround: ${s.turnaround}`);
    push("");
    push("### Questions and answers");
    push("");
    for (const f of s.faqs) push(`Q: ${f.q}`, `A: ${f.a}`, "");
  }

  push("## Texas markets");
  push("");
  for (const c of CITIES) {
    push(`## ${c.name}, Texas (${c.county})`);
    push("");
    push(`URL: ${SITE.url}/texas/${c.slug}`);
    push(`Region: ${c.region}`);
    push(`Design wind speed: ${c.wind.band}. ${c.wind.note}`);
    push(`Soil: ${c.soil.label}. ${c.soil.note}`);
    push(`Residential plan review: ${c.permitOffice.name}. ${c.permitOffice.note}`);
    push(
      `TDI windstorm area: ${
        c.windstormArea
          ? "yes, WPI-8 certification applies here"
          : "no, WPI-8 certification does not apply here"
      }`,
    );
    push("");
    for (const p of c.local) push(p, "");
    push("Most ordered here, in order of local weight:");
    push("");
    for (const slug of c.emphasis) {
      const s = SERVICES.find((x) => x.slug === slug);
      if (s) push(`- ${s.fullName}`);
    }
    push("");
    for (const f of c.faqs) push(`Q: ${f.q}`, `A: ${f.a}`, "");
  }

  push("## Business and account pages");
  push("");
  for (const i of INDUSTRIES) {
    push(`## ${i.name}`);
    push("");
    push(`URL: ${SITE.url}/industries/${i.slug}`);
    push("");
    push(i.lede);
    push("");
    push("What goes wrong today:");
    push("");
    for (const p of i.pains) push(`- ${p.title}: ${p.body}`);
    push("");
    push("What changes:");
    push("");
    for (const a of i.answers) push(`- ${a.title}: ${a.body}`);
    push("");
    for (const f of i.faqs) push(`Q: ${f.q}`, `A: ${f.a}`, "");
  }

  push("## Articles");
  push("");
  for (const p of POSTS) {
    push(`## ${p.h1}`);
    push("");
    push(`URL: ${SITE.url}/insights/${p.slug}`);
    push(`Published: ${p.datePublished}`);
    push("");
    push(p.excerpt);
    push(...renderBlocks(p.body));
    if (p.faqs) for (const f of p.faqs) push(`Q: ${f.q}`, `A: ${f.a}`, "");
  }

  push("## Other pages");
  push("");
  push(`- Order or waitlist: ${SITE.url}${IS_LIVE ? "/order" : "/waitlist"}`);
  push(`- Contact: ${SITE.url}/contact`);
  push(`- Careers, field technician roles: ${SITE.url}/careers`);
  push(`- Privacy policy: ${SITE.url}/privacy`);
  push(`- Terms of use: ${SITE.url}/terms`);
  push("");

  return new Response(L.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
