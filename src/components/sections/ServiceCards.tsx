import Link from "next/link";
import { SERVICES } from "@/data/services";
import type { EvidenceMode } from "@/data/types";

const EVIDENCE_LABEL: Record<EvidenceMode, string> = {
  upload: "Document review",
  "site-visit": "Site visit required",
  either: "Documents or site visit",
};

/**
 * The service grid.
 *
 * `only` narrows it to a specific set of slugs in the order given, which is how
 * city pages surface the services that market actually buys rather than the
 * full ten in alphabetical indifference.
 */
export function ServiceCards({ only, columns = 3 }: { only?: string[]; columns?: 2 | 3 }) {
  const items = only
    ? only.map((slug) => SERVICES.find((s) => s.slug === slug)).filter((s) => s !== undefined)
    : SERVICES;

  const grid = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <ul className={`grid gap-4 ${grid}`}>
      {items.map((s) => (
        <li key={s.slug} className="flex">
          <Link
            href={`/services/${s.slug}`}
            className="group flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper-card p-6 transition-colors hover:border-seal-600"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
              {EVIDENCE_LABEL[s.evidenceMode]}
            </span>
            <span className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-seal-800">
              {s.name}
            </span>
            <span className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
              {s.lede}
            </span>
            <span className="mt-4 text-sm font-semibold text-seal-700 group-hover:text-wax-700">
              What it contains
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
