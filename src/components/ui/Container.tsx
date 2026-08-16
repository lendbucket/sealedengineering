import type { ReactNode } from "react";

/**
 * The one horizontal rhythm on the site. Every section reaches for this rather
 * than repeating a max-width and a pair of paddings, because the fastest way to
 * get 4px of horizontal scroll on a 320px phone is fifty independent guesses at
 * the same measurement.
 */
export function Container({
  children,
  className = "",
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  /** "narrow" for long-form reading measure, "wide" for card grids. */
  width?: "narrow" | "default" | "wide";
}) {
  const max = width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-7xl" : "max-w-6xl";
  return <div className={`mx-auto w-full ${max} px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
