"use server";

import { supabase } from "@/lib/supabase";
import { attributionFrom } from "@/lib/attribution";
import { notify } from "@/lib/email";
import { SITE } from "@/config/site";
import { IS_LIVE } from "@/config/launch";
import { getService } from "@/data/services";
import {
  HONEYPOT,
  contactSchema,
  fieldErrorsOf,
  orderSchema,
  waitlistSchema,
  type FormState,
} from "@/lib/forms";

/**
 * Server actions for every form on the site.
 *
 * All four follow the same five steps, in the same order, for the same reasons:
 *
 *   1. Honeypot. A filled hidden field returns the success state without
 *      writing anything. Telling a bot it failed is how it learns to retry.
 *   2. Parse with Zod. The client validates for the human's benefit; this parse
 *      is the one that decides what reaches the database.
 *   3. Insert. The row is the record of the submission.
 *   4. Notify. Best effort. A mail failure never fails the submission, because
 *      a visitor told their message failed does not send it twice.
 *   5. Return a state the form can render.
 *
 * A database failure DOES fail the submission and says so, because the
 * alternative is a thank-you page for a lead nobody has.
 */

const GENERIC_DB_ERROR =
  "Something went wrong on our end and your details were not saved. Please try again, " +
  `or email ${SITE.email} directly.`;

function tripped(form: FormData): boolean {
  const v = form.get(HONEYPOT);
  return typeof v === "string" && v.trim().length > 0;
}

function objectFrom(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

// ------------------------------------------------------------------ waitlist

export async function submitWaitlist(_prev: FormState, form: FormData): Promise<FormState> {
  if (tripped(form)) return { status: "success" };

  const parsed = waitlistSchema.safeParse(objectFrom(form));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }
  const d = parsed.data;
  const attribution = await attributionFrom(form);
  const service = getService(d.service);

  try {
    const { error } = await supabase()
      .from("eng_leads")
      .insert({
        site: SITE.siteKey,
        form: "waitlist",
        name: d.name,
        email: d.email,
        phone: d.phone ?? null,
        company: d.company ?? null,
        city: d.city ?? null,
        service: d.service,
        timeline: d.timeline,
        plans_per_month: d.volume ?? null,
        message: d.message ?? null,
        ...attribution,
      });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error(`[waitlist] insert failed: ${(err as Error).message}`);
    return { status: "error", message: GENERIC_DB_ERROR };
  }

  await notify({
    subject: `Sealed waitlist: ${d.name}${d.company ? ` (${d.company})` : ""}`,
    replyTo: d.email,
    lines: [
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Company", d.company],
      ["Deliverable", service ? service.name : d.service],
      ["City", d.city],
      ["Timeline", d.timeline],
      ["Monthly volume", d.volume],
      ["Message", d.message],
      ["Source", attribution.utm_source],
      ["Campaign", attribution.utm_campaign],
      ["Landing page", attribution.landing_path],
    ],
  });

  return {
    status: "success",
    message:
      "You are on the waitlist. We will contact you at the email above when ordering opens, " +
      "in the order people joined.",
  };
}

// ------------------------------------------------------------------- contact

export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  if (tripped(form)) return { status: "success" };

  const parsed = contactSchema.safeParse(objectFrom(form));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }
  const d = parsed.data;
  const attribution = await attributionFrom(form);

  try {
    const { error } = await supabase()
      .from("eng_leads")
      .insert({
        site: SITE.siteKey,
        form: "contact",
        name: d.name,
        email: d.email,
        phone: d.phone ?? null,
        company: d.company ?? null,
        timeline: d.topic,
        message: d.message,
        ...attribution,
      });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error(`[contact] insert failed: ${(err as Error).message}`);
    return { status: "error", message: GENERIC_DB_ERROR };
  }

  await notify({
    subject: `Sealed contact: ${d.name}`,
    replyTo: d.email,
    lines: [
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Company", d.company],
      ["Topic", d.topic],
      ["Message", d.message],
      ["Landing page", attribution.landing_path],
    ],
  });

  return {
    status: "success",
    message: "Message received. We reply to everything, usually within one business day.",
  };
}

// APPLICATION ACTION REMOVED, 2026-08-17.
//
// The cross brand keyword registry assigns every careers term to 254
// Engineering Services, and /careers here is now a routing stub with no form.
// The eng_applications table stays in the shared schema because 254 writes it;
// this brand simply no longer does. Leaving a dead action and an unrendered
// form component behind would be the kind of rot that reads as intentional to
// the next session. If Sealed ever hires directly, the registry entry is
// renegotiated first and this comes back with it.

// --------------------------------------------------------------------- order

/**
 * The live-mode order action.
 *
 * Refuses outright in prelaunch rather than trusting the UI to have hidden the
 * form. The gate is a legal one, and a gate enforced only in the component that
 * renders the button is not a gate.
 */
export async function submitOrder(_prev: FormState, form: FormData): Promise<FormState> {
  if (!IS_LIVE) {
    return {
      status: "error",
      message:
        "Ordering is not open yet. Firm registration is pending with the Texas Board of " +
        "Professional Engineers and Land Surveyors. Join the waitlist and we will contact you " +
        "when it opens.",
    };
  }
  if (tripped(form)) return { status: "success" };

  const parsed = orderSchema.safeParse(objectFrom(form));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }
  const d = parsed.data;
  const attribution = await attributionFrom(form);
  const service = getService(d.service);

  // File keys are produced by the signed upload route and posted back as a
  // repeated hidden field. The client never gets a bucket credential; it gets
  // one short-lived signed URL per file from /api/upload.
  const filePaths = form
    .getAll("file_paths")
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .slice(0, 25);

  let reference = "";
  try {
    const { data, error } = await supabase()
      .from("eng_orders")
      .insert({
        site: SITE.siteKey,
        service: d.service,
        contact_name: d.contactName,
        email: d.email,
        phone: d.phone,
        company: d.company ?? null,
        property_address: d.propertyAddress,
        city: d.city,
        state: "TX",
        postal_code: d.postalCode ?? null,
        rush: d.rush === "yes",
        notes: d.notes ?? null,
        file_paths: filePaths,
        ...attribution,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    reference = String(data?.id || "").slice(0, 8).toUpperCase();
  } catch (err) {
    console.error(`[order] insert failed: ${(err as Error).message}`);
    return { status: "error", message: GENERIC_DB_ERROR };
  }

  await notify({
    subject: `Sealed order: ${service ? service.name : d.service} (${d.city})`,
    replyTo: d.email,
    lines: [
      ["Reference", reference],
      ["Deliverable", service ? service.name : d.service],
      ["Contact", d.contactName],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Company", d.company],
      ["Property", `${d.propertyAddress}, ${d.city}, TX ${d.postalCode || ""}`.trim()],
      ["Rush", d.rush === "yes" ? "Yes" : "No"],
      ["Files", filePaths.length ? filePaths.join(", ") : "none"],
      ["Notes", d.notes],
    ],
  });

  return {
    status: "success",
    message: `Order received. Your reference is ${reference}. Confirmation is on its way to ${d.email}.`,
  };
}
