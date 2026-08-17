import type { Block } from "@/data/posts/types";

/**
 * Renders a post body from blocks.
 *
 * One component for every post, so a heading in post six cannot quietly look
 * different from a heading in post one. The typography comes from the .prose
 * rules in globals.css rather than from utility classes here, because the same
 * rules serve the legal pages and the service page explanations.
 */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
        if ("h3" in b) return <h3 key={i}>{b.h3}</h3>;
        if ("p" in b) return <p key={i}>{b.p}</p>;
        if ("ul" in b)
          return (
            <ul key={i}>
              {b.ul.map((li, j) => (
                <li key={j}>{li}</li>
              ))}
            </ul>
          );
        if ("ol" in b)
          return (
            <ol key={i}>
              {b.ol.map((li, j) => (
                <li key={j}>{li}</li>
              ))}
            </ol>
          );
        return (
          <aside
            key={i}
            className="my-8 rounded-[var(--radius-card)] border-l-4 border-wax-600 bg-wax-100 p-6"
          >
            <p className="font-[family-name:var(--font-display)] text-base font-bold text-wax-700">
              {b.callout.title}
            </p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{b.callout.body}</p>
          </aside>
        );
      })}
    </div>
  );
}
