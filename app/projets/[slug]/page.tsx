import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/Mdx";
import { FinalCta } from "@/components/sections/FinalCta";
import { Avatar, Media } from "@/components/ui/Media";
import { Stars } from "@/components/ui/Stars";
import {
  getNextProject,
  getProject,
  getProjects,
  getTestimonial,
} from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} · ${project.client}`,
    description: project.teaser || `${project.client} — ${project.title}.`,
    openGraph: {
      title: `${project.title} · ${project.client}`,
      description: project.teaser || `${project.client} — ${project.title}.`,
      type: "article",
    },
  };
}

export default async function ProjetPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const testimonial = getTestimonial(project.testimonial);
  const next = getNextProject(project.slug);

  return (
    <>
      <article className="container-site pt-[clamp(2rem,5vw,3rem)]">
        {/* 1 — Fil d'ariane */}
        <nav aria-label="Fil d'ariane" className="eyebrow flex items-center gap-2">
          <Link href="/" className="transition-colors hover:text-ink">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projets" className="transition-colors hover:text-ink">
            Projets
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink-2">{project.client}</span>
        </nav>

        {/* 2 — Titre */}
        <header className="mt-10 border-t border-line pt-8" data-reveal>
          <div className="flex items-baseline justify-between gap-6">
            <p className="meta">{project.client}</p>
            {project.year && <p className="meta shrink-0">{project.year}</p>}
          </div>

          <h1 className="h1 mt-5 max-w-[20ch]">{project.title}</h1>

          {project.teaser && (
            <p className="lead mt-5">{project.teaser}</p>
          )}

          <ul className="mt-7 flex flex-wrap gap-2">
            {project.disciplines.map((d) => (
              <li
                key={d}
                className="rounded-full border border-line bg-surface px-3 py-1 text-[0.75rem] font-medium text-muted"
              >
                {d}
              </li>
            ))}
          </ul>
        </header>

        {/* 3 — Visuel principal */}
        <Media
          data-reveal
          src={project.cover}
          alt={`${project.client} — ${project.title}`}
          ratio="16 / 10"
          sizes="(min-width: 70rem) 66rem, 92vw"
          priority
          className="mt-10 rounded-project"
        />

        {/* 4 et 5 — Le contexte / Ce que j'ai fait */}
        <div className="mt-[clamp(3rem,6vw,4.5rem)]" data-reveal>
          {project.body ? (
            <Mdx source={project.body} />
          ) : (
            <div className="rounded-card border border-dashed border-line-2 bg-sunk px-6 py-10 text-center">
              <p className="eyebrow">Récit du projet à rédiger</p>
              <p className="prose-p mx-auto mt-3 text-[0.9rem]">
                Le contexte, les partis pris et les livrables s&apos;affichent
                ici dès que le corps du fichier{" "}
                <code className="font-mono text-[0.85em] text-ink-2">
                  content/projets/{project.slug}.mdx
                </code>{" "}
                est rempli.
              </p>
            </div>
          )}
        </div>

        {/* 6 — KPI */}
        {project.kpis.length > 0 && (
          <dl data-reveal className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {project.kpis.map((kpi) => (
              <div key={kpi.value} className="bg-surface px-6 py-7">
                <dt className="num text-[clamp(1.75rem,4vw,2.35rem)] font-bold leading-none text-ink">
                  {kpi.value}
                </dt>
                <dd className="mt-3 text-[0.85rem] leading-snug text-muted">
                  {kpi.label}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* 7 — Visuels de détail */}
        {project.gallery.length > 0 && (
          <div className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <Media
                key={src}
                src={src}
                alt={`${project.title} — visuel ${i + 1}`}
                ratio="4 / 3"
                sizes="(min-width: 40rem) 33rem, 92vw"
                className={`rounded-card ${
                  project.gallery.length % 2 === 1 && i === 0
                    ? "sm:col-span-2"
                    : ""
                }`}
              />
            ))}
          </div>
        )}

        {/* 8 — Témoignage */}
        {testimonial && (
          <figure data-reveal className="mt-[clamp(3rem,6vw,4.5rem)] rounded-card border border-line bg-surface p-8">
            <Stars rating={testimonial.rating} />
            <blockquote className="mt-5 max-w-[42rem] text-[1.1rem] font-semibold leading-snug text-ink">
              « {testimonial.quote} »
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <Avatar
                src={testimonial.avatar}
                alt=""
                size={40}
                initials="··"
              />
              <span>
                <span className="block text-[0.875rem] font-bold text-ink">
                  {testimonial.name}
                </span>
                <span className="block text-[0.8rem] text-muted">
                  {testimonial.role} · {testimonial.org}
                </span>
              </span>
            </figcaption>
          </figure>
        )}

        {/* 9 — Projet suivant */}
        {next && (
          <Link
            href={`/projets/${next.slug}`}
            className="group mt-[clamp(3rem,6vw,4.5rem)] flex items-center justify-between gap-6 border-t border-line pt-8"
          >
            <span>
              <span className="eyebrow">Projet suivant</span>
              <span className="mt-3 block text-[1.15rem] font-bold tracking-[-0.025em] text-ink">
                {next.title}
              </span>
              <span className="meta mt-2 block">{next.client}</span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-2xl text-ink transition-transform duration-200 ease-site group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </article>

      {/* 10 — Carte CTA */}
      <FinalCta />
    </>
  );
}
