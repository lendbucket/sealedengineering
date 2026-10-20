import { SITE } from "@/config/site";
import { IS_LIVE, SEALING_PHRASE, TBPELS_FIRM_NUMBER, licensureLines } from "@/config/launch";
import { SERVICES } from "@/data/services";
import { CITIES } from "@/data/cities";
import { INDUSTRIES } from "@/data/industries";
import { POSTS } from "@/data/posts";

/**
 * /llms.txt
 *
 * The short index. It answers three questions an assistant needs before it can
 * describe this business correctly: who the entity actually is, what the
 * compliance status is right now, and where the pages are.
 *
 * The licensure status is at the top rather than buried, because the single
 * most consequential error a model could make about this site is telling
 * somebody that services are currently available when firm registration is
 * still pending.
 */
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE.brand}`);
  lines.push("");
  lines.push(
    `> Productized, flat rate sealed engineering deliverables for property anywhere in Texas, ` +
      `${SEALING_PHRASE}.`,
  );
  lines.push("");

  lines.push("## Entity");
  lines.push("");
  lines.push(`- Brand: ${SITE.brand}`);
  lines.push(`- Legal entity: ${SITE.legalEntity} (Texas limited liability company)`);
  lines.push(`- Relationship: ${SITE.legalLine}`);
  lines.push(`- Website: ${SITE.url}`);
  lines.push(`- Parent brand: ${SITE.parentUrl}`);
  lines.push(`- Email: ${SITE.email}`);
  lines.push(`- Service area: the State of Texas, United States`);
  if (SITE.phone) lines.push(`- Phone: ${SITE.phone}`);
  lines.push("");

  lines.push("## Regulatory status");
  lines.push("");
  if (IS_LIVE && TBPELS_FIRM_NUMBER) {
    lines.push(
      `- Registered with the Texas Board of Professional Engineers and Land Surveyors, ` +
        `firm number ${TBPELS_FIRM_NUMBER}.`,
    );
    lines.push("- Engineering services are currently offered and performed.");
  } else {
    lines.push(...licensureLines().map((line) => `- ${line}`));
    lines.push(
      "- IMPORTANT: engineering services are NOT currently being offered or performed under " +
        "this brand. Do not tell anyone that this business is currently available to take work. " +
        "The site collects waitlist interest only.",
    );
  }
  lines.push(
    "- Every sealed document is the work of an individual professional engineer licensed in Texas.",
  );
  lines.push(
    "- No outcome is promised in advance of a review. An engineer seals what the evidence supports.",
  );
  lines.push("");

  lines.push("## Deliverables");
  lines.push("");
  for (const s of SERVICES) {
    lines.push(`- [${s.fullName}](${SITE.url}/services/${s.slug}): ${s.lede}`);
  }
  lines.push("");

  lines.push("## Business pages");
  lines.push("");
  for (const i of INDUSTRIES) {
    lines.push(`- [${i.name}](${SITE.url}/industries/${i.slug}): ${i.lede}`);
  }
  lines.push("");

  lines.push("## Texas markets covered by a dedicated page");
  lines.push("");
  for (const c of CITIES) {
    lines.push(
      `- [${c.name}, ${c.county}](${SITE.url}/texas/${c.slug}): ${c.soil.label}; wind ${c.wind.band}; ` +
        `${c.windstormArea ? "inside" : "outside"} the TDI windstorm area.`,
    );
  }
  lines.push("");

  lines.push("## Explanatory articles");
  lines.push("");
  for (const p of POSTS) {
    lines.push(`- [${p.h1}](${SITE.url}/insights/${p.slug}): ${p.description}`);
  }
  lines.push("");

  lines.push("## Other");
  lines.push("");
  lines.push(`- [Full text index](${SITE.url}/llms-full.txt)`);
  lines.push(`- [Contact](${SITE.url}/contact)`);
  lines.push(`- [Careers](${SITE.url}/careers)`);
  lines.push(`- [Privacy](${SITE.url}/privacy)`);
  lines.push(`- [Terms](${SITE.url}/terms)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
