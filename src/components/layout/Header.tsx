"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Site header with a mobile drawer.
 *
 * A client component because of the drawer and nothing else. The nav data is
 * passed in from the server layout rather than imported here, so the whole
 * services and cities datasets do not end up in the client bundle just to
 * render five links.
 */
export type NavLink = { label: string; href: string };

export function Header({
  primaryLinks,
  ctaLabel,
  ctaHref,
}: {
  primaryLinks: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation. Without this the drawer survives the route change and
  // the body scroll lock below survives with it, which reads as a frozen page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes it, because a drawer that traps a keyboard user is an a11y
  // failure and not a design decision.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* min-h-11 rather than letting the wordmark set the height: the mark
              is 35px tall and the link would inherit that, which is under the
              44px target size scripts/mobile-audit.ts asserts. */}
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center"
            aria-label="Sealed Engineering home"
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {primaryLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[0.9375rem] font-medium text-ink-soft hover:text-seal-800"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] border border-line-strong text-seal-800 lg:hidden"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-line bg-paper lg:hidden"
          style={{ maxHeight: "calc(100dvh - 4rem)", overflowY: "auto" }}
        >
          <Container className="py-4">
            <nav aria-label="Mobile" className="flex flex-col">
              {primaryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border-b border-line py-3.5 text-base font-medium text-seal-800"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Button href={ctaHref} className="mt-5 w-full">
              {ctaLabel}
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
