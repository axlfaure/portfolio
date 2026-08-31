import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { contentDir } from "./paths";

export type Kpi = { value: string; label: string };

export type Project = {
  slug: string;
  client: string;
  title: string;
  teaser: string;
  /** Titre court, utilisé par le ticker de la home. */
  short: string;
  disciplines: string[];
  /** Disciplines condensées pour le ticker. */
  tags: string;
  /** Null tant que l'année n'est pas confirmée : l'UI la masque. */
  year: number | null;
  featured: boolean;
  order: number;
  cover: string;
  gallery: string[];
  kpis: Kpi[];
  testimonial?: string;
  /** Corps MDX. Vide tant que le récit du projet n'est pas rédigé. */
  body: string;
};

export type Testimonial = {
  slug: string;
  name: string;
  role: string;
  org: string;
  avatar: string;
  rating: number;
  featured: boolean;
  quote: string;
};

export type FaqItem = {
  slug: string;
  question: string;
  order: number;
  body: string;
};

type Entry = { slug: string; data: Record<string, unknown>; body: string };

function readCollection(dir: string): Entry[] {
  const full = path.join(contentDir, dir);
  if (!fs.existsSync(full)) return [];

  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: String(data.slug ?? file.replace(/\.mdx$/, "")),
        data: data as Record<string, unknown>,
        body: content.trim(),
      };
    });
}

export const getProjects = cache((): Project[] =>
  readCollection("projets")
    .map(({ slug, data, body }) => ({
      slug,
      client: String(data.client ?? ""),
      title: String(data.title ?? ""),
      teaser: String(data.teaser ?? ""),
      short: String(data.short ?? data.title ?? ""),
      disciplines: (data.disciplines as string[]) ?? [],
      tags: String(data.tags ?? ""),
      year: data.year ? Number(data.year) : null,
      featured: Boolean(data.featured),
      order: Number(data.order ?? 99),
      cover: String(data.cover ?? ""),
      gallery: (data.gallery as string[]) ?? [],
      kpis: (data.kpis as Kpi[]) ?? [],
      testimonial: data.testimonial ? String(data.testimonial) : undefined,
      body,
    }))
    .sort((a, b) => a.order - b.order),
);

export const getFeaturedProjects = cache((): Project[] =>
  getProjects().filter((p) => p.featured),
);

export const getProject = cache(
  (slug: string): Project | undefined =>
    getProjects().find((p) => p.slug === slug),
);

/** Projet suivant dans l'ordre éditorial, en bouclant sur le premier. */
export function getNextProject(slug: string): Project | undefined {
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1 || all.length < 2) return undefined;
  return all[(i + 1) % all.length];
}

export const getTestimonials = cache((): Testimonial[] =>
  readCollection("temoignages").map(({ slug, data }) => ({
    slug,
    name: String(data.name ?? ""),
    role: String(data.role ?? ""),
    org: String(data.org ?? ""),
    avatar: String(data.avatar ?? ""),
    rating: Number(data.rating ?? 5),
    featured: Boolean(data.featured),
    quote: String(data.quote ?? ""),
  })),
);

export const getTestimonial = cache(
  (slug?: string): Testimonial | undefined =>
    slug ? getTestimonials().find((t) => t.slug === slug) : undefined,
);

export const getFeaturedTestimonial = cache((): Testimonial | undefined => {
  const all = getTestimonials();
  return all.find((t) => t.featured) ?? all[0];
});

export const getFaq = cache((): FaqItem[] =>
  readCollection("faq")
    .map(({ slug, data, body }) => ({
      slug,
      question: String(data.question ?? ""),
      order: Number(data.order ?? 99),
      body,
    }))
    .sort((a, b) => a.order - b.order),
);
