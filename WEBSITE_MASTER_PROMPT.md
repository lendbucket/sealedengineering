# MASTER PROMPT: SEALEDENGINEERING.COM

Paste this entire document as the first message in a Claude Code session at C:\Users\salon\projects\sealedengineering. Before anything else: save this document to WEBSITE_MASTER_PROMPT.md in the repo, commit with message "docs: add website master prompt", then follow it as binding instructions.

Mode: BUILD new site.

## 1. WHO THIS BRAND IS

Sealed Engineering is its own consumer and contractor facing brand: productized, flat rate, fast turnaround sealed engineering deliverables ordered online and delivered anywhere in Texas. Solar structural letters, foundation certifications, roof certification letters, windstorm certificates, permit letters, repair specifications, and small plan sets, each reviewed and sealed by a licensed Texas Professional Engineer. It operates under the license and legal entity of 254 Engineering Services LLC, but this site stands alone as a complete brand with its own identity, voice, and customers. It is the commercial search capture engine: when a solar installer in Lubbock or a loan officer in McAllen searches for what they need, this site is the answer.

- Brand: Sealed Engineering
- Legal footer line on every page: "Sealed Engineering is a brand of 254 Engineering LLC" plus the TBPELS line per the compliance gate.
- Domain: sealedengineering.com. engineersealed.com 301 redirects to it if owned.
- Audience: solar installers, mortgage loan officers and lenders, realtors and title companies, general contractors, homeowners.
- Voice: confident but professional, direct, plain English, measured Hormozi. Clarity over cleverness. Flat rate framing everywhere pricing is implied, but NO specific dollar amounts anywhere until Robert supplies the price sheet; use quote and waitlist flows and flag pricing as a pending owner item.

## 2. INFRASTRUCTURE

- GitHub: lendbucket/sealedengineering, private. Robert is creating it now. Initialize git immediately, commit as you build, push to origin main once the remote exists. Feature branches for significant work after the initial build. No history rewrites, no force pushes.
- Vercel: team salon-envy, auto deploy from main. DNS Cloudflare, grey cloud.
- Database: shared Supabase project wattsmith (ref fsaryeciduszuahgjbly, org Salon Envy). Tables prefixed eng_ with a site column; this site writes site value sealed. Do not create a new Supabase project. RLS enabled, zero policies, service role only, closed door pattern. All database access server side. import "server-only" in every data module. No NEXT_PUBLIC Supabase keys.
- File uploads: Supabase storage bucket eng-uploads (create if absent), server side signed upload flow only.
- Email: Resend, notifications to ceo@36west.org.
- Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, LAUNCH_MODE=prelaunch, TBPELS_FIRM_NUMBER (empty for now).

## 3. STACK AND ENGINEERING STANDARDS

- Next.js App Router latest stable, TypeScript strict, Tailwind v4, static generation wherever possible.
- Reference repo for engineering patterns: C:\Users\salon\projects\wattsmith. Port the dev-server harness, build race guard, and audit suite: seo-audit, contrast-audit, mobile-audit, forms-audit, placeholder-audit. Verify each audit fires by injecting a violation, then revert. Run all audits at end of session.
- Screenshots at 390 and 1280 before reporting. WCAG AA floor.
- BACKLOG.md at repo root. End with a build report: shipped, flagged, pending.

## 4. CONTENT RULES (ABSOLUTE)

- NO em dashes, NO en dashes anywhere. NO emojis anywhere.
- All copy reads as expert human writing.
- SEO metadata and page titles are the single highest priority. Unique keyword leading titles under 60 characters, unique descriptions under 155, hero H1 with the primary keyword on every page.
- No earnings claims, no fabricated testimonials, no review or rating schema until real reviews exist.

## 5. COMPLIANCE GATE (CRITICAL)

TBPELS firm registration is not yet active. The site must not state that services are currently offered or performed.

- LAUNCH_MODE=prelaunch: all order CTAs become waitlist forms with a professional "Opening soon, founding customers join the waitlist" treatment. Footer carries "Firm registration pending with the Texas Board of Professional Engineers and Land Surveyors."
- LAUNCH_MODE=live: order flows activate, footer renders the brand line plus "TBPELS Firm No." with TBPELS_FIRM_NUMBER.
- Build and test both modes. Ship prelaunch.
- Never guarantee approvals, never promise conclusions in advance, never solicit insurance claims or use claim maximization language. Every description of PE review is honest: documents and site data are reviewed by a licensed Texas PE who seals only what the evidence supports.

## 6. BRAND DESIGN

Own identity, distinct from the 254 flagship. No logo yet; typographic wordmark placeholder now, favicon set generated from it (sharp and png-to-ico pattern), regenerate when the real logo arrives.

- Palette direction: deep seal green primary, warm paper neutral background, one copper or wax red accent nodding to a wax seal. Propose exact values on a homepage concept with screenshots before applying sitewide.
- Typography: modern grotesque for headings to keep the productized feel, Inter body acceptable. Show before applying.
- The design should feel like a modern productized service: clean cards, visible process steps, obvious CTAs, fast.

## 7. PAGES

1. Home. Hero H1 in the "sealed engineering letters Texas" family. The offer stated cleanly: the sealed document you need, ordered online, reviewed by a licensed Texas PE, delivered fast, anywhere in Texas. Service cards. How it works in three steps: order, we collect the evidence (site visit by a certified field technician or your document upload), your sealed deliverable arrives. Who we serve strip: solar installers, lenders, realtors, contractors, homeowners. Waitlist CTA in prelaunch.
2. Service pages, each a full conversion page with keyword H1, plain explanation, who needs it, what the sealed deliverable contains, evidence required, FAQ with FAQPage schema, CTA respecting launch mode:
   - Solar Structural Letters (document upload flow, no site visit required)
   - Manufactured Home Foundation Certifications (FHA and VA)
   - Roof Certification Letters
   - Foundation Inspection Reports
   - WPI-8 Windstorm Certifications
   - Structural Letters for Permits
   - Beam and Header Sizing Letters
   - Repair Specification Letters
   - Carport and Patio Cover Plans
   - Foundation Repair Plans
3. City pages, Tier 1 only: 25 cities. Houston, San Antonio, Dallas, Fort Worth, Austin, El Paso, Corpus Christi, Laredo, Lubbock, McAllen, Brownsville, Amarillo, Killeen, Waco, Tyler, College Station, Beaumont, Midland, Odessa, Round Rock, Victoria, Harlingen, San Angelo, Abilene, Alice. Each page must be genuinely local: wind zone, soil character, the actual permit office name, regional notes, services emphasized for that market, internal links to the matching service pages. No thin templated pages: if a city page cannot be made genuinely local this session, cut it from the tier rather than shipping thin. Later tiers expand in waves only after Tier 1 indexes and ranks.
4. Industries. Three B2B repeat buyer pages: For Solar Installers (batch ordering, dedicated turnaround, one relationship for every jurisdiction), For Lenders and Loan Officers (manufactured home certification workflow built around closing timelines), For Realtors and Title Companies (transaction letters without the wait). These pages exist to win accounts, not one time orders.
5. Insights. Blog scaffold plus six launch posts, 1200 words minimum each, BlogPosting schema, genuinely useful: what a sealed engineering letter is and when you need one; solar structural letter requirements in Texas explained; FHA and VA manufactured home foundation certifications explained; what a roof certification letter covers and what it does not; WPI-8 windstorm certificates explained for coastal Texas homeowners; when a permit office requires an engineer letter.
6. Order and waitlist flow. Prelaunch: waitlist form (name, email, phone, service, city, timeline, monthly volume if business) stored in eng_leads with site sealed, Resend notification. Live mode shell built now behind the flag: service selection, property address, file upload to eng-uploads, contact details, stored in eng_orders with site sealed.
7. Careers. Short page pitching field technician work in the brand voice, application form posting to the shared eng_applications table with site sealed, plus a link to the 254 Engineering careers hub for PE roles.
8. Contact, privacy policy, terms. Real documents.

## 8. SEO AND SCHEMA

- This site owns ALL commercial intent service and geo terms for the brand family. Priority keyword families: solar structural letter, manufactured home foundation certification engineer, roof certification letter, foundation inspection report, windstorm certificate WPI-8, engineer letter for permit, each crossed with Texas and the Tier 1 city names. The institutional and government terms belong to 254engineering.com; branded direct response stamp terms belong to stampmyplans.com. Stay in lane.
- Schema: Organization named Sealed Engineering, legalName 254 Engineering LLC, parentOrganization Craftline Brands (ruled 2026-10-19), with Sealed Engineering as brand. WebSite schema named "Sealed Engineering" for correct SERP site name. Service schema per service page. FAQPage where FAQs exist. BreadcrumbList sitewide. og:site_name "Sealed Engineering" everywhere.
- robots.ts allowing GPTBot, ClaudeBot, PerplexityBot, Google-Extended and standard crawlers. /llms.txt and /llms-full.txt with brand, parent entity, and NAP data. Clean canonical sitemap.xml.
- If the Ahrefs MCP is available in session and keyword validation is needed, make at most one small batched matching terms call for the primary service terms, minimal columns and row limits, and state the expected unit cost before calling. No broad exploratory pulls; the plan is Lite.

## 9. OWNER VERIFICATION ITEMS EVERY BUILD REPORT CARRIES

Logo files, price sheet, phone number and public contact decision, DBA filing status for Sealed Engineering, TBPELS registration listing this assumed name, launch mode flip authorization.
