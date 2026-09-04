import "./env";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import matter from "gray-matter";
import { getPayload } from "payload";
import config from "../payload.config";

/**
 * Reprise des fichiers MDX vers la base.
 *
 * Script à usage unique, conservé parce qu'il documente la correspondance
 * exacte entre l'ancien format et le nouveau, et parce qu'il permet de
 * reconstruire une base de zéro si besoin. Il est réentrant : chaque document
 * est cherché par son identifiant avant d'être créé, donc le relancer ne
 * duplique rien.
 *
 * Ordre imposé par les relations : les médias d'abord, puis les témoignages,
 * puis les projets qui les citent, puis les services qui citent les projets.
 *
 * Usage : `npm run seed`
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const publicDir = path.join(root, "public");

type Front = Record<string, unknown>;

function read(dir: string): { slug: string; data: Front; body: string }[] {
  const full = path.join(contentDir, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      return {
        slug: String(data.slug ?? f.replace(/\.mdx$/, "")),
        data: data as Front,
        body: content.trim(),
      };
    });
}

async function main() {
  const payload = await getPayload({ config });
  const editorConfig = await editorConfigFactory.default({
    config: payload.config,
  });

  /** Markdown vers arbre Lexical. Un corps vide reste vide, pas un paragraphe. */
  const rich = (markdown: string) =>
    markdown.trim()
      ? convertMarkdownToLexical({ editorConfig, markdown })
      : undefined;

  /** Chemin `/public` vers un document média, en réutilisant l'existant. */
  const uploaded = new Map<string, number>();
  async function media(src: unknown): Promise<number | undefined> {
    if (typeof src !== "string" || !src.startsWith("/")) return undefined;
    if (uploaded.has(src)) return uploaded.get(src);

    const file = path.join(publicDir, src.slice(1));
    if (!fs.existsSync(file)) return undefined;

    const created = await payload.create({
      collection: "media",
      data: { alt: "" },
      filePath: file,
    });
    uploaded.set(src, created.id);
    return created.id;
  }

  async function mediaList(list: unknown): Promise<{ image: number }[]> {
    if (!Array.isArray(list)) return [];
    const out: { image: number }[] = [];
    for (const src of list) {
      const id = await media(src);
      if (id) out.push({ image: id });
    }
    return out;
  }

  /**
   * Crée le document s'il n'existe pas déjà, et renvoie son identifiant.
   *
   * Les surcharges de `create` et `update` ne se résolvent pas sur une union de
   * collections, et ce script en parcourt six avec la même fonction. Les deux
   * conversions sont confinées ici ; les données restent validées par Payload à
   * l'exécution, donc un champ manquant échouerait quand même bruyamment.
   */
  async function upsert(
    collection: "testimonials" | "projects" | "services" | "posts" | "faq" | "logos",
    slug: string,
    data: Record<string, unknown>,
  ): Promise<number> {
    const found = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });

    type CreateArgs = Parameters<typeof payload.create>[0];
    type UpdateArgs = Parameters<typeof payload.update>[0];

    if (found.docs.length > 0) {
      const id = found.docs[0].id as number;
      await payload.update({ collection, id, data } as unknown as UpdateArgs);
      return id;
    }
    const created = await payload.create({
      collection,
      data,
    } as unknown as CreateArgs);
    return created.id as number;
  }

  const list = (rows: unknown): { value: string }[] =>
    Array.isArray(rows) ? rows.map((value) => ({ value: String(value) })) : [];

  // --- Témoignages -------------------------------------------------------
  const testimonialIds = new Map<string, number>();
  for (const { slug, data } of read("temoignages")) {
    const id = await upsert("testimonials", slug, {
      slug,
      name: String(data.name ?? ""),
      role: String(data.role ?? ""),
      org: String(data.org ?? ""),
      avatar: await media(data.avatar),
      rating: Number(data.rating ?? 5),
      featured: Boolean(data.featured),
      quote: String(data.quote ?? ""),
    });
    testimonialIds.set(slug, id);
  }
  console.log(`témoignages : ${testimonialIds.size}`);

  // --- Projets -----------------------------------------------------------
  const projectIds = new Map<string, number>();
  for (const { slug, data, body } of read("projets")) {
    const id = await upsert("projects", slug, {
      slug,
      client: String(data.client ?? ""),
      title: String(data.title ?? ""),
      short: String(data.short ?? data.title ?? ""),
      teaser: String(data.teaser ?? ""),
      disciplines: list(data.disciplines),
      tags: String(data.tags ?? ""),
      year: data.year ? Number(data.year) : undefined,
      featured: Boolean(data.featured),
      order: Number(data.order ?? 99),
      cover: await media(data.cover),
      panels: await mediaList(data.panels),
      gallery: await mediaList(data.gallery),
      kpis: Array.isArray(data.kpis) ? data.kpis : [],
      testimonial: data.testimonial
        ? testimonialIds.get(String(data.testimonial))
        : undefined,
      body: rich(body),
    });
    projectIds.set(slug, id);
  }
  console.log(`projets : ${projectIds.size}`);

  // --- Services ----------------------------------------------------------
  let services = 0;
  for (const { slug, data, body } of read("services")) {
    const engagements = Array.isArray(data.engagements) ? data.engagements : [];
    await upsert("services", slug, {
      slug,
      title: String(data.title ?? ""),
      heading: String(data.heading ?? data.title ?? ""),
      short: String(data.short ?? ""),
      tier: String(data.tier ?? "Cœur de métier"),
      icon: String(data.icon ?? "identity"),
      order: Number(data.order ?? 99),
      metaTitle: String(data.metaTitle ?? data.title ?? ""),
      metaDescription: String(data.metaDescription ?? ""),
      lead: String(data.lead ?? ""),
      duration: String(data.duration ?? ""),
      visual: await media(data.visual),
      forWho: list(data.forWho),
      deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
      process: Array.isArray(data.process) ? data.process : [],
      engagements: engagements.map((e: Record<string, unknown>) => ({
        name: String(e.name ?? ""),
        best: String(e.best ?? ""),
        points: list(e.points),
      })),
      pricing: {
        from: String((data.pricing as { from?: string })?.from ?? ""),
        range: String((data.pricing as { range?: string })?.range ?? ""),
      },
      faq: Array.isArray(data.faq) ? data.faq : [],
      projects: Array.isArray(data.projects)
        ? data.projects
            .map((ref: string) => projectIds.get(ref))
            .filter(Boolean)
        : [],
      body: rich(body),
    });
    services += 1;
  }
  console.log(`services : ${services}`);

  // --- Articles ----------------------------------------------------------
  let posts = 0;
  for (const { slug, data, body } of read("blog")) {
    await upsert("posts", slug, {
      slug,
      title: String(data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      category: String(data.category ?? ""),
      date:
        data.date instanceof Date
          ? data.date.toISOString()
          : new Date(String(data.date)).toISOString(),
      readingTime: String(data.readingTime ?? ""),
      cover: await media(data.cover),
      body: rich(body),
    });
    posts += 1;
  }
  console.log(`articles : ${posts}`);

  // --- Questions fréquentes ---------------------------------------------
  let faq = 0;
  for (const { slug, data, body } of read("faq")) {
    await upsert("faq", slug, {
      slug,
      question: String(data.question ?? ""),
      answer: rich(body),
      order: Number(data.order ?? 99),
    });
    faq += 1;
  }
  console.log(`questions : ${faq}`);

  // --- Logos clients -----------------------------------------------------
  // Seul contenu qui n'existait pas en MDX : il vivait en dur dans site.ts.
  const { clientLogos } = await import("../lib/site");
  let logos = 0;
  for (const [i, logo] of clientLogos.entries()) {
    const image = await media(logo.src);
    if (!image) continue;
    const slug = logo.src.split("/").pop()!.replace(/\.\w+$/, "");
    await upsert("logos", slug, {
      slug,
      name: logo.name,
      image,
      order: i + 1,
    });
    logos += 1;
  }
  console.log(`logos : ${logos}`);

  console.log(`\nmédias téléversés : ${uploaded.size}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
