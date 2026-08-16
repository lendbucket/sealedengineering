import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "on-seal" | "outline-on-seal";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 py-3 text-[0.9375rem] font-semibold " +
  "transition-colors duration-150 min-h-11";

/**
 * Variants are named for the ground they sit on rather than for how they look,
 * because that is the decision the caller is actually making. "on-seal" is the
 * paper-colored button for the dark green hero and footer, where a primary
 * green button would disappear.
 */
const variants: Record<Variant, string> = {
  primary: "bg-seal-800 text-on-seal hover:bg-seal-700",
  secondary: "bg-paper-card text-seal-800 border border-line-strong hover:bg-paper-sunk",
  ghost: "text-seal-800 underline underline-offset-4 hover:text-wax-700 px-0 py-0 min-h-0",
  "on-seal": "bg-on-seal text-seal-900 hover:bg-white",
  // The quiet option on a dark ground. Two near-white buttons side by side read
  // as one decision presented twice, which is the opposite of what a secondary
  // action is for.
  "outline-on-seal": "border border-on-seal-soft text-on-seal hover:bg-seal-700",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
} & Record<string, unknown>) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} className={cls} rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type || "button"} className={cls} {...rest}>
      {children}
    </button>
  );
}
