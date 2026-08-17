import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The one Supabase client, and it never reaches a browser.
 *
 * THE CLOSED DOOR PATTERN
 * -----------------------
 * Every eng_ table has RLS enabled with zero policies. That means the anon and
 * publishable keys can read and write exactly nothing, by construction rather
 * than by a policy somebody has to keep correct. The service role bypasses RLS,
 * so it is the only key that can reach the data, and it lives on the server.
 *
 * `import "server-only"` at the top is what makes a mistake here a build error
 * rather than a leak. If any client component ever imports this module, even
 * transitively, the build fails and names the file. That is worth more than a
 * comment asking people to be careful, because the failure mode being prevented
 * is a service role key shipped inside a JavaScript bundle.
 *
 * There is deliberately no NEXT_PUBLIC_SUPABASE_ANYTHING in this project. An
 * anon key would be harmless given the zero-policy tables, and it would also be
 * an invitation to write a client-side query that quietly does nothing.
 */

let cached: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Thrown rather than returning a stub. A stub would make every write
    // silently succeed and every form report a thank-you page for a lead
    // nobody received, which is the single worst outcome available here.
    throw new Error(
      "[supabase] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. " +
        "Set them in .env.local for development and in the Vercel project for deploys.",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "sealedengineering" } },
  });
  return cached;
}

/** True when the database is reachable in principle. Used to fail forms loudly in dev. */
export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** The storage bucket every uploaded file lands in. Private, server-signed access only. */
export const UPLOAD_BUCKET = "eng-uploads";
