"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ATTRIBUTION_FIELDS } from "@/lib/attribution.client";
import { HONEYPOT } from "@/lib/forms";

/**
 * Form field primitives.
 *
 * Every input here is wired the same way and it is not decoration:
 *   - A real <label> with htmlFor, never a placeholder standing in for one. A
 *     placeholder disappears the moment somebody types, which is exactly when a
 *     person filling a form on a phone needs to check what the field was.
 *   - aria-invalid and aria-describedby pointing at the error, so a screen
 *     reader hears the message rather than a generic invalid state.
 *   - Errors rendered under the input rather than summarized at the top, so a
 *     long form does not require scrolling to find out which field is wrong.
 */

type Base = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  defaultValue?: string;
};

const control =
  "mt-1.5 block w-full rounded-[var(--radius-control)] border bg-paper-card px-3.5 py-2.5 " +
  "text-base text-ink placeholder:text-ink-soft/60 min-h-11";

function shell(error?: string) {
  return `${control} ${error ? "border-danger" : "border-line-strong"}`;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-seal-800">
      {children}
      {required && (
        <span className="ml-1 text-wax-600" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function Error({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-danger">
      {message}
    </p>
  );
}

function Hint({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-ink-soft">
      {text}
    </p>
  );
}

export function TextField({
  type = "text",
  ...p
}: Base & { type?: "text" | "email" | "tel" }) {
  const errId = `${p.name}-error`;
  const hintId = `${p.name}-hint`;
  return (
    <div>
      <Label htmlFor={p.name} required={p.required}>
        {p.label}
      </Label>
      <input
        id={p.name}
        name={p.name}
        type={type}
        required={p.required}
        autoComplete={p.autoComplete}
        defaultValue={p.defaultValue}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={p.error ? errId : p.hint ? hintId : undefined}
        className={shell(p.error)}
      />
      <Hint id={hintId} text={p.error ? undefined : p.hint} />
      <Error id={errId} message={p.error} />
    </div>
  );
}

export function TextArea({ rows = 5, ...p }: Base & { rows?: number }) {
  const errId = `${p.name}-error`;
  const hintId = `${p.name}-hint`;
  return (
    <div>
      <Label htmlFor={p.name} required={p.required}>
        {p.label}
      </Label>
      <textarea
        id={p.name}
        name={p.name}
        rows={rows}
        required={p.required}
        defaultValue={p.defaultValue}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={p.error ? errId : p.hint ? hintId : undefined}
        className={shell(p.error)}
      />
      <Hint id={hintId} text={p.error ? undefined : p.hint} />
      <Error id={errId} message={p.error} />
    </div>
  );
}

export function SelectField({
  options,
  placeholder = "Choose one",
  ...p
}: Base & { options: { value: string; label: string }[]; placeholder?: string }) {
  const errId = `${p.name}-error`;
  const hintId = `${p.name}-hint`;
  return (
    <div>
      <Label htmlFor={p.name} required={p.required}>
        {p.label}
      </Label>
      <select
        id={p.name}
        name={p.name}
        required={p.required}
        defaultValue={p.defaultValue ?? ""}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={p.error ? errId : p.hint ? hintId : undefined}
        className={shell(p.error)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Hint id={hintId} text={p.error ? undefined : p.hint} />
      <Error id={errId} message={p.error} />
    </div>
  );
}

export function RadioGroup({
  name,
  legend,
  options,
  error,
  required,
  defaultValue,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const errId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="text-sm font-semibold text-seal-800">
        {legend}
        {required && (
          <span className="ml-1 text-wax-600" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex min-h-11 items-center gap-2.5 text-base text-ink">
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              defaultChecked={defaultValue === o.value}
              className="h-4 w-4 accent-[var(--seal-800)]"
            />
            {o.label}
          </label>
        ))}
      </div>
      <Error id={errId} message={error} />
    </fieldset>
  );
}

/**
 * The honeypot field.
 *
 * Hidden from sight and from assistive technology, but present in the DOM and
 * submitted with the form. Not `type="hidden"`, because the bots worth catching
 * skip hidden inputs; a visually hidden text input with an inviting name is
 * what they fill in. tabIndex -1 and aria-hidden keep it away from anybody
 * navigating with a keyboard or a screen reader.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden">
      <label htmlFor={HONEYPOT}>Company website</label>
      <input id={HONEYPOT} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/**
 * Hidden attribution fields, filled from the URL after mount.
 *
 * Rendered empty on the server so the markup is identical for every visitor and
 * the page stays statically cacheable. The values are read from
 * window.location and document.referrer once, on the client, which is the only
 * place they exist.
 */
export function AttributionFields({ path }: { path: string }) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next: Record<string, string> = { landing_path: path, referrer: document.referrer || "" };
    for (const f of ATTRIBUTION_FIELDS) {
      if (f === "landing_path" || f === "referrer") continue;
      const v = params.get(f);
      if (v) next[f] = v;
    }
    setValues(next);
  }, [path]);

  return (
    <>
      {ATTRIBUTION_FIELDS.map((f) => (
        <input key={f} type="hidden" name={f} value={values[f] ?? ""} readOnly />
      ))}
    </>
  );
}

/** Banner shown above a form after a submit that failed for a non-field reason. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-[var(--radius-control)] border border-danger bg-danger-bg p-4">
      <p className="text-sm font-medium text-danger">{message}</p>
    </div>
  );
}

/** The panel that replaces a form once it has been submitted successfully. */
export function FormSuccess({ heading, message }: { heading: string; message?: string }) {
  return (
    <div
      role="status"
      className="rounded-[var(--radius-card)] border border-seal-600 bg-seal-100 p-7"
    >
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-seal-800">
        {heading}
      </h2>
      {message && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">{message}</p>}
    </div>
  );
}
