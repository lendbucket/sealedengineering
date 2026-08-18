import { z } from "zod";
import { SERVICE_SLUGS } from "@/data/services";
import { CITY_SLUGS } from "@/data/cities";

/**
 * Form schemas.
 *
 * Deliberately NOT server-only: the field names, the option lists, and the
 * validation messages are shared with the client components that render the
 * forms, so keeping them in one module is what stops a select whose options no
 * longer match what the server will accept.
 *
 * The server still validates independently on every submission. This module
 * being importable from the client is a convenience for rendering, never a
 * substitute for the parse that happens in the action.
 */

const trimmed = (max: number) => z.string().trim().max(max);

/** Present but empty is a different thing from absent, and both mean "not given". */
const optional = (max: number) =>
  trimmed(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

export const TIMELINES = [
  "As soon as ordering opens",
  "Within 30 days",
  "Within 90 days",
  "Planning ahead, no specific date",
] as const;

export const VOLUMES = [
  "Not a business, one property",
  "1 to 5 per month",
  "6 to 20 per month",
  "21 to 50 per month",
  "More than 50 per month",
] as const;

export const CONTACT_TOPICS = [
  "A question about a specific deliverable",
  "Business or volume account enquiry",
  "Something else",
] as const;

/**
 * The honeypot.
 *
 * A field a human never sees and a naive bot always fills. Named `company_url`
 * rather than something obviously decorative, because the bots that matter read
 * the name. A filled value is treated as success by the visitor and a discard
 * by the server: telling a bot it failed is how it learns to try again.
 */
export const HONEYPOT = "company_url";

export const waitlistSchema = z.object({
  name: trimmed(120).min(2, "Enter your name."),
  email: trimmed(200).email("Enter an email address we can reply to."),
  phone: optional(40),
  company: optional(160),
  service: z.enum(SERVICE_SLUGS as [string, ...string[]], {
    message: "Choose the deliverable you need.",
  }),
  city: optional(120),
  timeline: z.enum(TIMELINES, { message: "Choose a rough timeline." }),
  volume: optional(80),
  message: optional(2000),
});

export const contactSchema = z.object({
  name: trimmed(120).min(2, "Enter your name."),
  email: trimmed(200).email("Enter an email address we can reply to."),
  phone: optional(40),
  company: optional(160),
  topic: z.enum(CONTACT_TOPICS, { message: "Choose what this is about." }),
  message: trimmed(4000).min(10, "Tell us a little about what you need."),
});

/**
 * The live-mode order form.
 *
 * Built now and gated behind LAUNCH_MODE so the shape is settled before it goes
 * live rather than during the week it does. City is validated against the Tier
 * 1 list where it matches and accepted as free text where it does not, because
 * refusing an order from a town that has no page yet would be absurd.
 */
export const orderSchema = z.object({
  service: z.enum(SERVICE_SLUGS as [string, ...string[]], {
    message: "Choose the deliverable you need.",
  }),
  contactName: trimmed(120).min(2, "Enter a contact name."),
  email: trimmed(200).email("Enter an email address we can send the document to."),
  phone: trimmed(40).min(7, "Enter a phone number."),
  company: optional(160),
  propertyAddress: trimmed(300).min(5, "Enter the property address."),
  city: trimmed(120).min(2, "Enter the city."),
  postalCode: optional(20),
  rush: z.enum(["yes", "no"]).optional(),
  notes: optional(4000),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type OrderInput = z.infer<typeof orderSchema>;

/** Slug lists exported for the selects, so a form cannot offer an unknown option. */
export const SERVICE_OPTIONS = SERVICE_SLUGS;
export const CITY_OPTIONS = CITY_SLUGS;

/**
 * The shape every form action returns.
 *
 * `fieldErrors` is keyed by input name so a client component can put the message
 * next to the input that caused it, which is the difference between a form that
 * can be fixed and one that has to be guessed at.
 */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const IDLE: FormState = { status: "idle" };

/** Flatten a Zod error into the fieldErrors shape above. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
