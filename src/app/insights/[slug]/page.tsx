import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Cta";
import { Faqs } from "@/components/sections/Faqs";
import { PostBody } from "@/components/sections/PostBody";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { blogPostingSchema, breadcrumbSchema, faqSchema, graph, type Crumb } from "@/lib/schema";
import { POSTS, getPost } from "@/data/posts";
import { readingMinutes, wordCount } from "@/data/posts/types";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/insights/${post.slug}`,
  });
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.h1, path: `/insights/${post.slug}` },
  ];

  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        json={graph(
          blogPostingSchema({
            headline: post.h1,
            description: post.description,
            path: `/insights/${post.slug}`,
            datePublished: post.datePublished,
            dateModified: post.dateModified,
            wordCount: wordCount(post),
          }),
          ...(post.faqs && post.faqs.length > 0
            ? [faqSchema(`/insights/${post.slug}`, post.faqs)]
            : []),
          breadcrumbSchema(crumbs),
        )}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <article>
        <header className="pt-8">
          <Container width="narrow">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
              <time dateTime={post.datePublished}>
                {DATE_FORMAT.format(new Date(post.datePublished))}
              </time>
              <span aria-hidden="true"> . </span>
              {readingMinutes(post)} minute read
            </p>
            <h1 className="mt-4 text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
              {post.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
          </Container>
        </header>

        <div className="py-12">
          <Container width="narrow">
            <PostBody blocks={post.body} />
          </Container>
        </div>
      </article>

      {post.faqs && post.faqs.length > 0 && <Faqs faqs={post.faqs} heading="Related questions" />}

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800">Deliverables this relates to</h2>
          <div className="mt-7">
            <ServiceCards only={post.related} />
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-14">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800">More from Insights</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} className="flex">
                <Link
                  href={`/insights/${o.slug}`}
                  className="flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper-card p-6 hover:border-seal-600"
                >
                  <span className="font-[family-name:var(--font-display)] text-base font-bold leading-snug text-seal-800">
                    {o.h1}
                  </span>
                  <span className="mt-2 text-sm text-ink-soft">{readingMinutes(o)} minute read</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand heading="Need the document rather than the explanation?" />
    </>
  );
}
