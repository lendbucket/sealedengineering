import fs from "node:fs";

/**
 * Apply the operator's 2026-08-18 ruling to the registry, in the 254 repo,
 * which is the source of truth.
 *
 * THE RULING
 * ----------
 * Reassign the unqualified national forms of both money terms to Sealed
 * Engineering as PRIMARY targets, replacing the Texas-qualified forms in that
 * role. The Texas-qualified forms stay registered as secondary variants on the
 * same pages rather than being deleted, because deleting them would erase the
 * record of the concession from 254.
 *
 * THE EVIDENCE
 * ------------
 * One authorised Ahrefs batch, 2026-08-18, documented in
 * sealedengineering/docs/keyword-batch-phase-1.md:
 *   manufactured home foundation certification        50/mo, KD 8
 *   manufactured home foundation certification texas   0/mo
 *   texas windstorm wpi-8 certificate search          80/mo, KD 9
 *   wpi-8 windstorm certificate search                30/mo, KD 2
 * The Texas qualifier subtracts measured demand rather than adding it.
 *
 * WHY THIS IS NOT A HONESTY PROBLEM
 * ---------------------------------
 * The operator's reasoning, recorded because a future session will question it:
 * Texans type the unqualified form and Google localises the result, so
 * targeting it is accurate rather than deceptive. Nothing about the pages
 * changes: they remain Texas-specific throughout, and the Texas-qualified terms
 * remain registered to the same brand and the same URLs.
 *
 * ALSO CARRIED: the careers note resolution, which has been pending as a
 * declared divergence in the sealed copy since 2026-08-17.
 */
const FILE = "C:/Users/salon/projects/254engineering/data/keyword-registry.ts";

const WPI8_OLD = `  {
    keyword: "wpi-8 windstorm certification texas",
    owner: "sealed",
    kind: "transactional",
    cluster: "service",
    status: "conceded",
    path: "/services/wpi-8-windstorm-certification",
    note: "254 previously targeted this as 'Windstorm WPI-8 Certifications in Texas'. Rewritten as a capability page. Note the county level windstorm geo stays with 254.",
  },`;

const WPI8_NEW = `  // PRIMARY TARGET as of 2026-08-18, by operator ruling on measured data.
  // The unqualified national form carries the volume; the Texas-qualified form
  // below measured zero. Texans type the unqualified form and Google localises,
  // so this is accurate targeting rather than a reach. The page is Texas
  // specific throughout and does not change.
  {
    keyword: "wpi-8 windstorm certification",
    owner: "sealed",
    kind: "transactional",
    cluster: "service",
    status: "live",
    path: "/services/wpi-8-windstorm-certification",
    note: "Primary target. Evidence: sealedengineering/docs/keyword-batch-phase-1.md. Related lookup-intent terms ('wpi-8 windstorm certificate search', 30/mo at KD 2, and 'texas windstorm wpi-8 certificate search', 80/mo at KD 9) are navigational toward the TDI lookup and are served by a dedicated page rather than by this one. County level windstorm geo remains 254's.",
  },
  {
    keyword: "wpi-8 windstorm certification texas",
    owner: "sealed",
    kind: "transactional",
    cluster: "service",
    status: "conceded",
    path: "/services/wpi-8-windstorm-certification",
    note: "SECONDARY variant of the entry above as of 2026-08-18; measured zero volume. Retained rather than deleted because it records the concession: 254 previously targeted this as 'Windstorm WPI-8 Certifications in Texas' and rewrote it as a capability page. County level windstorm geo stays with 254.",
  },`;

const MH_OLD = `  {
    keyword: "manufactured home foundation certification texas",
    owner: "sealed",
    kind: "transactional",
    cluster: "service",
    status: "conceded",
    path: "/services/manufactured-home-foundation-certification",
    note: "254 previously targeted this near-identically.",
  },`;

const MH_NEW = `  // PRIMARY TARGET as of 2026-08-18, by operator ruling on measured data.
  // Same reasoning as the WPI-8 pair above: 50/mo unqualified against zero for
  // the Texas-qualified form.
  {
    keyword: "manufactured home foundation certification",
    owner: "sealed",
    kind: "transactional",
    cluster: "service",
    status: "live",
    path: "/services/manufactured-home-foundation-certification",
    note: "Primary target. Evidence: sealedengineering/docs/keyword-batch-phase-1.md, 50/mo at KD 8. The 'hud manufactured home foundation certification' variant (20/mo) is served by the same page, which cites HUD-7584 and HUD-4930.3G directly.",
  },
  {
    keyword: "manufactured home foundation certification texas",
    owner: "sealed",
    kind: "transactional",
    cluster: "service",
    status: "conceded",
    path: "/services/manufactured-home-foundation-certification",
    note: "SECONDARY variant of the entry above as of 2026-08-18; measured zero volume. Retained because it records that 254 previously targeted this near-identically.",
  },`;

const CAREERS_OLD =
  `      "COLLISION, UNRESOLVED. sealedengineering.com/careers is titled 'Field Technician Jobs in Texas | Sealed Engineering' and targets this term. The operator's split assigns careers to 254. stampmyplans.com/careers already routes hiring to 254 and is correct. The Sealed careers page needs to become a routing stub pointing at 254engineering.com/careers, or the split needs revisiting. Logged in BACKLOG.md.",`;

const CAREERS_NEW =
  `      "COLLISION, RESOLVED 2026-08-17 on the sealed side. sealedengineering.com/careers was titled 'Field Technician Jobs in Texas' and targeted this term. It is now a routing stub titled 'Hiring Runs Through 254 Engineering Services', carrying no application form and no job term in its title, linking to 254engineering.com/careers. stampmyplans.com/careers already routed correctly. 254 owns this term outright.",`;

let src = fs.readFileSync(FILE, "utf8");
const hadCrlf = src.includes("\r\n");
src = src.replace(/\r\n/g, "\n");

const edits = [
  ["wpi-8 primary target", WPI8_OLD, WPI8_NEW],
  ["manufactured home primary target", MH_OLD, MH_NEW],
  ["careers collision resolved", CAREERS_OLD, CAREERS_NEW],
];

let applied = 0;
const misses = [];
for (const [name, from, to] of edits) {
  if (!src.includes(from)) {
    misses.push(name);
    continue;
  }
  src = src.replace(from, to);
  applied++;
}

if (misses.length) {
  console.log("REFUSING TO WRITE. Missed edits:");
  for (const m of misses) console.log("  " + m);
  process.exitCode = 1;
} else {
  fs.writeFileSync(FILE, hadCrlf ? src.replace(/\n/g, "\r\n") : src);
  console.log(`applied ${applied}/${edits.length} edits to the 254 registry`);
}
