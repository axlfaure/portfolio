import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
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
  /** Panneaux du bento des cartes projet. Vide : on retombe sur `cover`. */
  panels: string[];
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

/** Une étape du process, telle qu'elle s'affiche sur une page de service. */
export type ProcessStep = { step: string; duration: string; body: string };

export type ServiceQa = { q: string; a: string };

export type Deliverable = {
  name: string;
  icon:
    | FeatureIconName
    | "identity"
    | "print"
    | "web"
    | "automation"
    | "motion"
    | "photo";
  detail: string;
};

export type Engagement = { name: string; best: string; points: string[] };

export type Service = {
  slug: string;
  /** Nom court, utilisé par les cartes de la home et la navigation. */
  title: string;
  /** Titre de page (H1), porteur de la requête cible. */
  heading: string;
  /** Description d'une ligne sur la carte de la home. */
  short: string;
  tier: "Cœur de métier" | "Complément";
  icon: "identity" | "print" | "web" | "automation" | "motion" | "photo";
  order: number;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  /** Durée totale indicative, affichée dans l'encart de tête. */
  duration: string;
  /** Visuel de la grille des livrables. */
  visual: string;
  forWho: string[];
  deliverables: Deliverable[];
  process: ProcessStep[];
  engagements: Engagement[];
  /** Vide tant qu'Axel n'a pas confirmé la fourchette : l'UI bascule alors sur le repère global. */
  pricing: { from: string; range: string };
  faq: ServiceQa[];
  /** Slugs des projets illustrant le service. */
  projects: string[];
  /** Corps MDX : la mise en perspective éditoriale. */
  body: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Date ISO, utilisée pour le tri et l'affichage. */
  date: string;
  readingTime: string;
  cover: string;
  /** Slug du service auquel l'article renvoie, s'il y en a un. */
  related?: string;
  body: string;
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
      panels: (data.panels as string[]) ?? [],
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

export const getProject = cache((slug: string): Project | undefined =>
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

export const getTestimonial = cache((slug?: string): Testimonial | undefined =>
  slug ? getTestimonials().find((t) => t.slug === slug) : undefined,
);

export const getFeaturedTestimonial = cache((): Testimonial | undefined => {
  const all = getTestimonials();
  return all.find((t) => t.featured) ?? all[0];
});

export const getServices = cache((): Service[] =>
  readCollection("services")
    .map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? ""),
      heading: String(data.heading ?? data.title ?? ""),
      short: String(data.short ?? ""),
      tier: (data.tier as Service["tier"]) ?? "Cœur de métier",
      icon: (data.icon as Service["icon"]) ?? "identity",
      order: Number(data.order ?? 99),
      metaTitle: String(data.metaTitle ?? data.title ?? ""),
      metaDescription: String(data.metaDescription ?? ""),
      lead: String(data.lead ?? ""),
      duration: String(data.duration ?? ""),
      visual: String(data.visual ?? ""),
      forWho: (data.forWho as string[]) ?? [],
      deliverables: (data.deliverables as Deliverable[]) ?? [],
      process: (data.process as ProcessStep[]) ?? [],
      engagements: (data.engagements as Engagement[]) ?? [],
      pricing: {
        from: String((data.pricing as { from?: string })?.from ?? ""),
        range: String((data.pricing as { range?: string })?.range ?? ""),
      },
      faq: (data.faq as ServiceQa[]) ?? [],
      projects: (data.projects as string[]) ?? [],
      body,
    }))
    .sort((a, b) => a.order - b.order),
);

export const getService = cache((slug: string): Service | undefined =>
  getServices().find((s) => s.slug === slug),
);

/** Les projets cités par un service, dans l'ordre du frontmatter. */
export const getServiceProjects = cache((slug: string): Project[] => {
  const service = getService(slug);
  if (!service) return [];
  const all = getProjects();
  return service.projects
    .map((ref) => all.find((p) => p.slug === ref))
    .filter((p): p is Project => Boolean(p));
});

export const getPosts = cache((): Post[] =>
  readCollection("blog")
    .map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      category: String(data.category ?? ""),
      date:
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? ""),
      readingTime: String(data.readingTime ?? ""),
      cover: String(data.cover ?? ""),
      related: data.related ? String(data.related) : undefined,
      body,
    }))
    // Du plus récent au plus ancien : un blog se lit par le haut.
    .sort((a, b) => b.date.localeCompare(a.date)),
);

export const getPost = cache((slug: string): Post | undefined =>
  getPosts().find((p) => p.slug === slug),
);

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
