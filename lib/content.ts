import { cache } from "react";
import type {
  Faq as FaqDoc,
  Post as PostDoc,
  Project as ProjectDoc,
  Service as ServiceDoc,
  Testimonial as TestimonialDoc,
} from "@/cms/payload-types";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import { db, rows, url, urls, values } from "./payload";

/**
 * Accès au contenu.
 *
 * Ce fichier est la seule frontière entre le CMS et le site. Les types exportés
 * ici sont ceux qu'utilisent la quarantaine de composants en aval : ils ont été
 * conservés à l'identique lors de la bascule depuis les fichiers MDX, ce qui a
 * permis de changer de source sans toucher à une seule vue.
 *
 * Conséquence à garder en tête : c'est ici, et nulle part ailleurs, qu'on
 * traduit la forme de la base vers la forme du site. Un champ Payload qui
 * remonterait brut jusqu'à un composant annulerait ce cloisonnement.
 *
 * Toutes les images sont des chaînes ou `null`. Une image absente n'est pas une
 * erreur : le composant `Media` affiche alors un emplacement en pointillés, ce
 * qui permet de publier un projet avant d'avoir ses visuels.
 */

/** Arbre Lexical d'un corps de texte, tel que l'éditeur le sérialise. */
export type RichTextBody = ProjectDoc["body"] | null;

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
  cover: string | null;
  /** Panneaux du bento des cartes de la page d'accueil. */
  panels: string[];
  gallery: string[];
  kpis: Kpi[];
  testimonial?: string;
  body: RichTextBody;
};

export type Testimonial = {
  slug: string;
  name: string;
  role: string;
  org: string;
  avatar: string | null;
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
  title: string;
  heading: string;
  short: string;
  tier: "Cœur de métier" | "Complément";
  icon: "identity" | "print" | "web" | "automation" | "motion" | "photo";
  order: number;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  duration: string;
  /** Visuel de la grille des livrables. */
  visual: string | null;
  /** Visuel de la section « Le contexte ». */
  contextImage: string | null;
  forWho: string[];
  deliverables: Deliverable[];
  process: ProcessStep[];
  engagements: Engagement[];
  /** Vide tant qu'aucune fourchette n'est saisie : l'UI bascule sur « sur devis ». */
  pricing: { from: string; range: string };
  faq: ServiceQa[];
  /** Slugs des projets illustrant le service. */
  projects: string[];
  body: RichTextBody;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Date ISO, utilisée pour le tri et l'affichage. */
  date: string;
  readingTime: string;
  cover: string | null;
  /** Slug du service auquel l'article renvoie, s'il y en a un. */
  related?: string;
  body: RichTextBody;
};

export type FaqItem = {
  slug: string;
  question: string;
  order: number;
  body: RichTextBody;
};

/** Slug d'une relation, qu'elle soit peuplée ou réduite à son identifiant. */
function relSlug(value: unknown): string | undefined {
  if (value && typeof value === "object" && "slug" in value) {
    return String((value as { slug: string }).slug);
  }
  return undefined;
}

/**
 * `depth: 2` peuple les visuels imbriqués dans les tableaux (un panneau de
 * bento est une relation dans une ligne de tableau, donc à deux niveaux).
 * Au-delà, on ferait remonter des documents entiers pour rien.
 */
const QUERY = { limit: 200, depth: 2, overrideAccess: false } as const;

function toProject(doc: ProjectDoc): Project {
  return {
    slug: doc.slug,
    client: doc.client,
    title: doc.title,
    teaser: doc.teaser ?? "",
    short: doc.short,
    disciplines: values(doc.disciplines),
    tags: doc.tags ?? "",
    year: doc.year ?? null,
    featured: Boolean(doc.featured),
    order: doc.order,
    cover: url(doc.cover),
    panels: urls(doc.panels),
    gallery: urls(doc.gallery),
    kpis: rows<Kpi>(doc.kpis),
    testimonial: relSlug(doc.testimonial),
    body: doc.body ?? null,
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const payload = await db();
  const { docs } = await payload.find({
    collection: "projects",
    sort: "order",
    ...QUERY,
  });
  return docs.map(toProject);
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> =>
  (await getProjects()).filter((p) => p.featured),
);

export const getProject = cache(
  async (slug: string): Promise<Project | undefined> =>
    (await getProjects()).find((p) => p.slug === slug),
);

/** Projet suivant dans l'ordre éditorial, en bouclant sur le premier. */
export async function getNextProject(
  slug: string,
): Promise<Project | undefined> {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1 || all.length < 2) return undefined;
  return all[(i + 1) % all.length];
}

function toTestimonial(doc: TestimonialDoc): Testimonial {
  return {
    slug: doc.slug,
    name: doc.name,
    role: doc.role,
    org: doc.org,
    avatar: url(doc.avatar),
    rating: doc.rating,
    featured: Boolean(doc.featured),
    quote: doc.quote,
  };
}

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await db();
  const { docs } = await payload.find({ collection: "testimonials", ...QUERY });
  return docs.map(toTestimonial);
});

export const getTestimonial = cache(
  async (slug?: string): Promise<Testimonial | undefined> =>
    slug ? (await getTestimonials()).find((t) => t.slug === slug) : undefined,
);

export const getFeaturedTestimonial = cache(
  async (): Promise<Testimonial | undefined> => {
    const all = await getTestimonials();
    return all.find((t) => t.featured) ?? all[0];
  },
);

function toService(doc: ServiceDoc): Service {
  return {
    slug: doc.slug,
    title: doc.title,
    heading: doc.heading,
    short: doc.short,
    tier: doc.tier,
    icon: doc.icon,
    order: doc.order,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    lead: doc.lead,
    duration: doc.duration ?? "",
    visual: url(doc.visual),
    contextImage: url(doc.contextImage),
    forWho: values(doc.forWho),
    deliverables: rows<Deliverable>(doc.deliverables),
    process: rows<ProcessStep>(doc.process),
    engagements: (doc.engagements ?? []).map((row) => ({
      name: row.name,
      best: row.best,
      points: values(row.points),
    })),
    pricing: {
      from: doc.pricing?.from ?? "",
      range: doc.pricing?.range ?? "",
    },
    faq: rows<ServiceQa>(doc.faq),
    projects: (doc.projects ?? [])
      .map(relSlug)
      .filter((s): s is string => Boolean(s)),
    body: doc.body ?? null,
  };
}

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await db();
  const { docs } = await payload.find({
    collection: "services",
    sort: "order",
    ...QUERY,
  });
  return docs.map(toService);
});

export const getService = cache(
  async (slug: string): Promise<Service | undefined> =>
    (await getServices()).find((s) => s.slug === slug),
);

/** Les projets cités par un service, dans l'ordre du champ. */
export const getServiceProjects = cache(
  async (slug: string): Promise<Project[]> => {
    const service = await getService(slug);
    if (!service) return [];
    const all = await getProjects();
    return service.projects
      .map((ref) => all.find((p) => p.slug === ref))
      .filter((p): p is Project => Boolean(p));
  },
);

function toPost(doc: PostDoc): Post {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    date: String(doc.date).slice(0, 10),
    readingTime: doc.readingTime ?? "",
    cover: url(doc.cover),
    related: relSlug(doc.related),
    body: doc.body ?? null,
  };
}

export const getPosts = cache(async (): Promise<Post[]> => {
  const payload = await db();
  // Du plus récent au plus ancien : un blog se lit par le haut.
  const { docs } = await payload.find({
    collection: "posts",
    sort: "-date",
    ...QUERY,
  });
  return docs.map(toPost);
});

export const getPost = cache(
  async (slug: string): Promise<Post | undefined> =>
    (await getPosts()).find((p) => p.slug === slug),
);

export const getFaq = cache(async (): Promise<FaqItem[]> => {
  const payload = await db();
  const { docs } = await payload.find({
    collection: "faq",
    sort: "order",
    ...QUERY,
  });
  return docs.map((doc: FaqDoc) => ({
    slug: doc.slug,
    question: doc.question,
    order: doc.order,
    body: doc.answer ?? null,
  }));
});

export type ClientLogo = { name: string; src: string };

/**
 * Logos du bandeau du hero. Ils vivaient en dur dans `lib/site.ts` : c'est le
 * seul contenu que la bascule a fait naître plutôt que déplacer.
 */
export const getLogos = cache(async (): Promise<ClientLogo[]> => {
  const payload = await db();
  const { docs } = await payload.find({
    collection: "logos",
    sort: "order",
    ...QUERY,
  });
  return docs
    .map((doc) => ({ name: doc.name, src: url(doc.image) }))
    .filter((logo): logo is ClientLogo => Boolean(logo.src));
});
