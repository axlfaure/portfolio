import "./env";
import { getPayload } from "payload";
import config from "../payload.config";

/**
 * État de préparation du contenu avant mise en ligne.
 *
 * Lit la base et signale ce qui manque : visuels absents, textes vides,
 * marqueurs de remplacement laissés en place. Script de contrôle, sans
 * écriture — il peut tourner pendant que le serveur de développement tourne.
 */
async function main() {
  const payload = await getPayload({ config });
  const q = { limit: 200, depth: 1 } as const;

  const line = (label: string, items: string[]) => {
    if (items.length === 0) return;
    console.log(`\n  ${label} (${items.length})`);
    for (const i of items) console.log(`    · ${i}`);
  };

  console.log("=== PROJETS ===");
  const { docs: projects } = await payload.find({ collection: "projects", ...q });
  console.log(`  ${projects.length} projets, ${projects.filter((p) => p.featured).length} en page d'accueil`);
  line("sans visuel principal", projects.filter((p) => !p.cover).map((p) => p.slug));
  line("sans bento", projects.filter((p) => !p.panels?.length).map((p) => p.slug));
  line("sans galerie", projects.filter((p) => !p.gallery?.length).map((p) => p.slug));
  line("sans accroche", projects.filter((p) => !p.teaser?.trim()).map((p) => p.slug));
  line("sans récit", projects.filter((p) => !p.body).map((p) => p.slug));
  line("sans année", projects.filter((p) => !p.year).map((p) => p.slug));
  line("sans chiffres clés", projects.filter((p) => !p.kpis?.length).map((p) => p.slug));
  line("sans témoignage", projects.filter((p) => !p.testimonial).map((p) => p.slug));

  console.log("\n=== SERVICES ===");
  const { docs: services } = await payload.find({ collection: "services", ...q });
  console.log(`  ${services.length} services`);
  line("sans fourchette de prix", services.filter((s) => !s.pricing?.from?.trim()).map((s) => s.slug));
  line("sans visuel de contexte", services.filter((s) => !s.contextImage).map((s) => s.slug));
  line("sans visuel de livrables", services.filter((s) => !s.visual).map((s) => s.slug));
  line("sans durée", services.filter((s) => !s.duration?.trim()).map((s) => s.slug));
  line("sans projet associé", services.filter((s) => !s.projects?.length).map((s) => s.slug));
  line("sans mise en perspective", services.filter((s) => !s.body).map((s) => s.slug));

  console.log("\n=== TÉMOIGNAGES ===");
  const { docs: testimonials } = await payload.find({ collection: "testimonials", ...q });
  console.log(`  ${testimonials.length} témoignages`);
  const fake = testimonials.filter(
    (t) => /pr[ée]nom|nom|structure|lorem/i.test(`${t.name} ${t.org}`),
  );
  line("nom ou structure factice", fake.map((t) => `${t.slug} — « ${t.name} · ${t.org} »`));
  line("sans photo", testimonials.filter((t) => !t.avatar).map((t) => t.slug));

  console.log("\n=== ARTICLES ===");
  const { docs: posts } = await payload.find({ collection: "posts", ...q });
  console.log(`  ${posts.length} articles`);
  line("sans couverture", posts.filter((p) => !p.cover).map((p) => p.slug));
  line("sans service associé", posts.filter((p) => !p.related).map((p) => p.slug));

  console.log("\n=== AUTRES ===");
  const { totalDocs: faq } = await payload.find({ collection: "faq", limit: 0 });
  const { totalDocs: logos } = await payload.find({ collection: "logos", limit: 0 });
  const { totalDocs: media } = await payload.find({ collection: "media", limit: 0 });
  const { totalDocs: users } = await payload.find({ collection: "users", limit: 0 });
  console.log(`  ${faq} questions · ${logos} logos · ${media} médias · ${users} compte(s) admin`);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
