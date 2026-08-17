import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { SITE } from "@/config/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy | Sealed Engineering",
  description:
    "What Sealed Engineering collects, why, who it is shared with, how long it is kept, and how to have it deleted. Written to be read rather than skipped.",
  path: "/privacy",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

export const EFFECTIVE = "August 16, 2026";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8 pb-16">
        <Container width="narrow">
          <h1 className="text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-ink-soft">Effective {EFFECTIVE}</p>

          <div className="prose mt-10">
            <p>
              This policy covers sealedengineering.com and the forms on it. Sealed Engineering is a
              brand of {SITE.legalEntity}, a Texas limited liability company, which is the entity
              responsible for the information described here.
            </p>

            <h2>What is collected, and when</h2>
            <p>
              Nothing is collected from you by simply reading a page. There is no advertising
              network on this site, no third party analytics script, no session recording, and no
              cross site tracking pixel. Pages are served as static files wherever possible, which
              is a performance decision that happens to also be a privacy one.
            </p>
            <p>Information is collected in exactly three situations.</p>

            <h3>1. When you submit a form</h3>
            <p>
              The waitlist, contact, careers, and order forms collect what they visibly ask for:
              your name, email address, phone number, company where given, the property city or
              area, the deliverable you need, your timeline, and whatever you write in the message
              field. The careers form additionally collects the role you are applying for, your
              availability, whether you have reliable transport, and your stated experience. The
              order form additionally collects the property address and any files you upload.
            </p>
            <p>
              Alongside that, each submission records the page you were on when you submitted, the
              referring site if your browser sent one, your browser user agent string, and any UTM
              campaign parameters present in the URL. That is attribution data, and its only use is
              understanding which pages and which campaigns produce enquiries.
            </p>

            <h3>2. When you upload a file</h3>
            <p>
              Files attached to an order are stored in a private storage bucket that is not
              publicly readable and is not indexed. Access requires a server side credential that
              is never present in your browser. Files are only ever opened for the purpose of
              producing the document you ordered.
            </p>

            <h3>3. Server logs</h3>
            <p>
              The hosting platform records standard request logs, including IP address, timestamp,
              and requested path, for security and operational purposes. These are retained by the
              platform under its own retention schedule and are not used to build a profile of you.
            </p>

            <h2>What it is used for</h2>
            <ul>
              <li>Responding to you, which is the point of every form on the site.</li>
              <li>
                Producing and delivering a document you ordered, including any professional record
                the engineer is required to retain.
              </li>
              <li>
                Contacting waitlist members in the order they joined when ordering opens, which is
                the specific promise the waitlist makes.
              </li>
              <li>
                Understanding which pages generate enquiries, so effort goes to the pages that
                help people.
              </li>
              <li>Meeting legal, regulatory, and professional record keeping obligations.</li>
            </ul>
            <p>
              Your information is not sold. It is not rented. It is not traded, shared for
              advertising, or provided to a data broker. Nothing here is used to train an external
              model.
            </p>

            <h2>Who it is shared with</h2>
            <p>
              Four categories, and no others. Each has access only to what its function requires.
            </p>
            <ul>
              <li>
                <strong>Hosting and infrastructure.</strong> The site is deployed on Vercel, which
                processes requests and holds server logs.
              </li>
              <li>
                <strong>Database and file storage.</strong> Submissions and uploaded files are
                stored in Supabase. Access is restricted to a server side service credential.
              </li>
              <li>
                <strong>Email delivery.</strong> Notification and reply emails are sent through
                Resend.
              </li>
              <li>
                <strong>{SITE.legalEntity} personnel and its licensed engineers</strong>, including
                any field technician assigned to observe a property, who receives the address and
                access details necessary to do so.
              </li>
            </ul>
            <p>
              Information may also be disclosed where required by law, by a court, or by the Texas
              Board of Professional Engineers and Land Surveyors in connection with the regulation
              of engineering practice.
            </p>

            <h2>Cookies</h2>
            <p>
              This site sets no advertising or analytics cookies. There is no consent banner
              because there is nothing to consent to. Any cookie present is a strictly necessary
              one set by the hosting platform for security or load balancing.
            </p>

            <h2>How long it is kept</h2>
            <ul>
              <li>
                <strong>Waitlist and contact submissions:</strong> retained while there is an
                active or reasonably anticipated relationship, and deleted on request.
              </li>
              <li>
                <strong>Job applications:</strong> retained for up to two years so that a
                candidate who was a good fit at the wrong time can be contacted at the right one.
                Deleted earlier on request.
              </li>
              <li>
                <strong>Order records and uploaded files:</strong> retained for the period an
                engineer is required to keep the professional record supporting a sealed document.
                This retention is a professional obligation and it survives a deletion request for
                the records it covers.
              </li>
            </ul>

            <h2>Your choices</h2>
            <p>
              Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> to ask what is held about
              you, to have it corrected, or to have it deleted. Texas residents have rights under
              the Texas Data Privacy and Security Act, including the right to know, to correct, to
              delete, and to obtain a portable copy. Those requests are honoured regardless of
              where you live, because operating two standards is harder than operating one.
            </p>
            <p>
              The one exception is above: professional records supporting a sealed engineering
              document cannot be deleted while the retention obligation applies. If that affects
              your request you will be told so specifically rather than refused generally.
            </p>

            <h2>Security</h2>
            <p>
              Traffic is served over HTTPS. Database tables enforce row level security with no
              public policies, meaning no browser held credential can read or write them; all
              access is server side. The file storage bucket is private. Credentials are held as
              environment variables on the server and are never included in anything sent to a
              browser.
            </p>
            <p>
              No system is perfectly secure and anybody who tells you otherwise is selling
              something. What is committed to here is that the architecture does not depend on a
              secret being kept in a place a visitor can reach.
            </p>

            <h2>Children</h2>
            <p>
              This site is not directed at children and information is not knowingly collected from
              anyone under 13. If you believe a child has submitted information, write to the
              address above and it will be deleted.
            </p>

            <h2>Changes</h2>
            <p>
              If this policy changes, the effective date at the top changes with it. Material
              changes affecting how existing information is used will be communicated to people
              whose information is affected.
            </p>

            <h2>Contact</h2>
            <p>
              {SITE.legalEntity}, operating as Sealed Engineering.{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
