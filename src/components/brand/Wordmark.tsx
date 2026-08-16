/**
 * Typographic wordmark placeholder.
 *
 * There is no logo yet. Rather than ship an empty box or a stock icon, the mark
 * is the name set in the display face next to a drawn wax seal: a filled disc
 * with a debossed monogram, which is the one visual idea the brand is named
 * after. It is a component and not an image file so the real logo replaces it
 * in one place, and so it stays crisp at every size without a raster set.
 *
 * The favicon set is generated from this same geometry by scripts/brand-rasters.mjs.
 */
export function Wordmark({
  tone = "seal",
  className = "",
}: {
  /** "seal" on paper grounds, "paper" on the dark footer and hero. */
  tone?: "seal" | "paper";
  className?: string;
}) {
  const markFill = tone === "seal" ? "var(--seal-800)" : "var(--on-seal)";
  const markCut = tone === "seal" ? "var(--paper)" : "var(--seal-800)";
  const textColor = tone === "seal" ? "text-seal-800" : "text-on-seal";
  const subColor = tone === "seal" ? "text-wax-600" : "text-on-seal-soft";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        aria-hidden="true"
        className="shrink-0"
        focusable="false"
      >
        {/* The seal: a disc with a scalloped edge, cut by an S and an E. */}
        <path
          fill={markFill}
          d="M16 1.6c1.2 0 2.2 1.5 3.3 1.8 1.1.3 2.7-.5 3.7.1 1 .6 1 2.4 1.8 3.2.8.8 2.6.9 3.2 1.9.6 1-.2 2.6.1 3.7.3 1.1 1.8 2.1 1.8 3.3 0 1.2-1.5 2.2-1.8 3.3-.3 1.1.5 2.7-.1 3.7-.6 1-2.4 1.1-3.2 1.9-.8.8-.8 2.6-1.8 3.2-1 .6-2.6-.2-3.7.1-1.1.3-2.1 1.8-3.3 1.8-1.2 0-2.2-1.5-3.3-1.8-1.1-.3-2.7.5-3.7-.1-1-.6-1-2.4-1.8-3.2-.8-.8-2.6-.9-3.2-1.9-.6-1 .2-2.6-.1-3.7C3.1 18.2 1.6 17.2 1.6 16c0-1.2 1.5-2.2 1.8-3.3.3-1.1-.5-2.7.1-3.7.6-1 2.4-1.1 3.2-1.9.8-.8.8-2.6 1.8-3.2 1-.6 2.6.2 3.7-.1C13.3 3.5 14.3 1.6 16 1.6Z"
        />
        <text
          x="16"
          y="21.2"
          textAnchor="middle"
          fill={markCut}
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-display)"
          letterSpacing="-0.5"
        >
          SE
        </text>
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-[family-name:var(--font-display)] text-[1.0625rem] font-bold tracking-tight ${textColor}`}
        >
          Sealed Engineering
        </span>
        <span className={`mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] ${subColor}`}>
          Texas PE Sealed
        </span>
      </span>
    </span>
  );
}
