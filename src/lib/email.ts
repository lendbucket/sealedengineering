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

/**
 * The result of a send attempt.
 *
 * `outcome` is the four way answer the log line reports. `sent` stays as the
 * boolean every caller already branches on, so adding the detail changed no
 * call site.
 *
 * Four states rather than two because "did not send" hides three completely
 * different situations: no key configured (expected in development), the
 * template rendered nothing (a bug), and Resend rejected it (an outage or a
 * bad address). A boolean makes all three look identical in the logs, which is
 * exactly when somebody concludes the mail is fine because the form worked.
 */
export type MailOutcome = "ok" | "skipped" | "error" | "no content";
export type MailResult = { sent: boolean; outcome: MailOutcome; reason?: string };

/**
 * One line per send attempt, always, on every path.
 *
 * The row in the database is the record of a submission; this is the record of
 * whether anybody was told about it. Without it a Resend outage is invisible:
 * forms keep returning success, rows keep landing, and the notifications
 * silently stop. Logged rather than thrown because a mail failure must never
 * fail a submission.
 *
 * The subject is included and the payload is not. These messages carry a
 * stranger's contact details and a log is not the place for them.
 */
function logOutcome(subject: string, result: MailResult): MailResult {
  const detail = result.reason ? ` reason=${JSON.stringify(result.reason)}` : "";
  const line = `[email] outcome=${result.outcome} sent=${result.sent}${detail} subject=${JSON.stringify(subject)}`;
  if (result.outcome === "error" || result.outcome === "no content") console.error(line);
  else console.log(line);
  return result;
}

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
    return logOutcome(subject, { sent: false, outcome: "skipped", reason: "not configured" });
  }

  const { text, html } = buildNotification(lines);

  // A rendered message with no body is a template bug, and sending it would put
  // an empty email in front of the one person who reads these. Caught here
  // rather than in the template, because this is the last point before it
  // leaves and the only one that sees the finished string.
  if (!text || text.trim() === "") {
    return logOutcome(subject, {
      sent: false,
      outcome: "no content",
      reason: "rendered body was empty",
    });
  }

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
      return logOutcome(subject, { sent: false, outcome: "error", reason: error.message });
    }
    return logOutcome(subject, { sent: true, outcome: "ok" });
  } catch (err) {
    return logOutcome(subject, { sent: false, outcome: "error", reason: (err as Error).message });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
