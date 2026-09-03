import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/Mdx";
import { FinalCta } from "@/components/sections/FinalCta";
import { ArrowDiag } from "@/components/ui/ArrowDiag";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Media } from "@/components/ui/Media";
import { PostCard } from "@/components/ui/PostCard";
import { getPost, getPosts, getService } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const service = post.related ? await getService(post.related) : undefined;
  const others = (await getPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    articleSection: post.category,
    url: `${site.url}/blog/${post.slug}`,
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.brand, url: site.url },
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD généré côté serveur. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container-site pt-[clamp(2rem,5vw,3rem)]">
        <Breadcrumb
          trail={[
            { href: "/", label: "Accueil" },
            { href: "/blog", label: "Blog" },
          ]}
          current={post.category}
        />

        <header className="mt-10 max-w-[46rem]" data-reveal>
          <p className="meta">
            {new Date(post.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {post.readingTime ? ` · ${post.readingTime} de lecture` : ""}
          </p>

          <h1 className="h1 mt-6">{post.title}</h1>
          <p className="lead mt-6">{post.excerpt}</p>
        </header>

        <div className="mt-12" data-reveal>
          <Media
            src={post.cover}
            alt=""
            ratio="16 / 9"
            sizes="(min-width: 70rem) 66rem, 92vw"
            className="rounded-project"
          />
        </div>

        <div className="mt-[clamp(2.5rem,6vw,4rem)] max-w-[44rem]" data-reveal>
          <Mdx source={post.body} />
        </div>

        {/* Un article ramène toujours vers la prestation qu'il éclaire. */}
        {service && (
          <div
            className="mt-[clamp(3rem,7vw,4.5rem)] max-w-[44rem]"
            data-reveal
          >
            <Link
              href={`/services/${service.slug}`}
              className="group flex items-center justify-between gap-6 rounded-card border border-line bg-surface p-6 transition-colors duration-200 hover:bg-paper"
            >
              <span>
                <span className="eyebrow">Le service associé</span>
                <span className="mt-3 block text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
                  {service.title}
                </span>
                <span className="mt-1.5 block text-[0.9rem] leading-snug text-muted">
                  {service.short}
                </span>
              </span>
              <ArrowDiag size={16} className="arrow-diag shrink-0 text-ink-2" />
            </Link>
          </div>
        )}

        {others.length > 0 && (
          <section className="mt-[clamp(3.5rem,8vw,5.5rem)] border-t border-line pt-[clamp(2.5rem,6vw,4rem)]">
            <p className="eyebrow" data-reveal>
              À lire aussi
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other, i) => (
                <PostCard key={other.slug} post={other} index={i} />
              ))}
            </div>
          </section>
        )}
      </article>

      <FinalCta />
    </>
  );
}
