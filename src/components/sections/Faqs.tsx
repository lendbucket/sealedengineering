import type { Faq } from "@/data/types";
import { Container } from "@/components/ui/Container";

/**
 * FAQ block, rendered as native details/summary.
 *
 * Native disclosure rather than a JavaScript accordion for three reasons: the
 * answers are in the DOM for a crawler whether or not they are open, it works
 * with zero client JavaScript, and the keyboard and screen reader behaviour is
 * the browser's rather than ours to get wrong.
 */
export function Faqs({ faqs, heading = "Questions people actually ask" }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-line bg-paper-sunk py-14 sm:py-16">
      <Container width="narrow">
        <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">{heading}</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              {/* The padding lives on the summary rather than on the details,
                  because the summary is the tap target and 24px of text is
                  under the 44px floor the mobile audit asserts. */}
              <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-4 text-left text-base font-semibold text-seal-800">
                <span>{f.q}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-wax-600 transition-transform duration-150 group-open:rotate-45"
                >
                  <svg viewBox="0 0 20 20" width="18" height="18" focusable="false">
                    <path
                      d="M10 4v12M4 10h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mb-4 pr-8 text-[0.9375rem] leading-relaxed text-ink">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
