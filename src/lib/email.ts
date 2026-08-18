import "server-only";
import { Resend } from "resend";
import { SITE } from "@/config/site";

/**
 * Notification email.
 *
 * WHY A FAILURE HERE MUST NOT FAIL THE SUBMISSION
 * -----------------------------------------------
 * The row in the database is the record. The email is a convenience that tells
 * somebody the row exists. If Resend is down, rate limited, or unconfigured,
 * the correct behaviour is a lead that was saved and an operator who finds it
 * in the table, not a visitor who is told their submission failed and does not
 * come back.
 *
 * So every function here returns a result rather than throwing, and the caller
 * records whether the notification went out. Errors are logged with enough
 * detail to diagnose and never with the payload, because these payloads contain
 * a stranger's contact details.
 */

export type MailResult = { sent: boolean; reason?: string };

const FROM = `Sealed Engineering <notifications@${SITE.domain}>`;

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export type Line = [string, string | null | undefined];

/**
 * Assemble the body of a notification.
 *
 * Exported and separated from notify() so scripts/email-audit.mjs can exercise
 * the real assembly rather than a copy of it. The first version of that audit
 * re-implemented this logic to inspect it, which meant it was checking its own
 * mirror: breaking the filter below left the audit green. An audit that cannot
 * fail when the thing it audits is broken is not an audit.
 *
 * Nothing here touches the network or reads configuration, so it is safe to
 * call from anywhere.
 */
export function buildNotification(lines: Line[]): { rows: string[]; text: string; html: string } {
  const rows = lines
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`);

  const text = rows.join("\n");
  const html =
    `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6;color:#24211d">` +
    rows
      .map((r) => {
        const i = r.indexOf(":");
        const label = escapeHtml(r.slice(0, i));
        const value = escapeHtml(r.slice(i + 1).trim());
        return `<p style="margin:0 0 8px"><strong style="color:#0f3b2e">${label}</strong><br>${value}</p>`;
      })
      .join("") +
    `</div>`;

  return { rows, text, html };
}

export async function notify({
  subject,
  lines,
  replyTo,
}: {
  subject: string;
  /** Label and value pairs, rendered in order. Nulls are dropped. */
  lines: Line[];
  replyTo?: string | null;
}): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Not an error in development, where nobody has a key. Logged so a missing
    // key in production is visible in the function logs rather than silent.
    console.warn(`[email] RESEND_API_KEY not set, skipping notification: ${subject}`);
    return { sent: false, reason: "not configured" };
  }

  const { text, html } = buildNotification(lines);

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: SITE.notifyEmail,
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error(`[email] send failed for ${JSON.stringify(subject)}: ${error.message}`);
      return { sent: false, reason: error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error(`[email] threw for ${JSON.stringify(subject)}: ${(err as Error).message}`);
    return { sent: false, reason: (err as Error).message };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
