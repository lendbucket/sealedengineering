import Link from "next/link";
import type { Crumb } from "@/lib/schema";

/**
 * Visible breadcrumbs. The matching BreadcrumbList JSON-LD is emitted by the
 * page from the same array, so the markup and the schema cannot disagree.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink-soft">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-seal-800 hover:underline">
                  {c.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden="true" className="text-line-strong">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
