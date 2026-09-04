import Link from "next/link";
import { getPayload } from "payload";
import config from "../../payload.config";

/**
 * Écran d'accueil de l'administration, en remplacement complet de celui de
 * Payload.
 *
 * Le tableau de bord d'origine affichait une carte par collection, c'est-à-dire
 * exactement la navigation de gauche, rejouée en grand. Deux systèmes de
 * navigation sur le même écran, dont l'un occupait toute la hauteur pour ne rien
 * dire de plus : on remplace par ce qu'on ne trouve nulle part ailleurs, l'état
 * réel du contenu, et une grille compacte qui porte au moins les volumes.
 *
 * Tout est recalculé à chaque affichage — la vue est rendue à la demande, pas
 * mise en cache. Ce qui s'affiche ici est donc l'état de la base à la seconde
 * où la page s'ouvre.
 */

type Gap = { label: string; count: number; href: string; tone: "stop" | "warn" };
type Shortcut = { label: string; slug: string; count: number; group: string };

const ADMIN = "/admin/collections";

async function load() {
  const payload = await getPayload({ config });
  const q = { limit: 200, depth: 0 } as const;

  const [projects, services, posts, testimonials, faq, logos, media] =
    await Promise.all([
      payload.find({ collection: "projects", ...q }),
      payload.find({ collection: "services", ...q }),
      payload.find({ collection: "posts", ...q }),
      payload.find({ collection: "testimonials", ...q }),
      payload.find({ collection: "faq", limit: 0 }),
      payload.find({ collection: "logos", limit: 0 }),
      payload.find({ collection: "media", limit: 0 }),
    ]);

  const fake = testimonials.docs.filter((t) =>
    /pr[ée]nom|structure/i.test(`${t.name} ${t.org}`),
  ).length;

  const gaps = (
    [
      {
        label: "témoignages encore fictifs",
        count: fake,
        href: `${ADMIN}/testimonials`,
        tone: "stop",
      },
      {
        label: "projets sans visuel principal",
        count: projects.docs.filter((p) => !p.cover).length,
        href: `${ADMIN}/projects`,
        tone: "warn",
      },
      {
        label: "projets sans accroche",
        count: projects.docs.filter((p) => !p.teaser?.trim()).length,
        href: `${ADMIN}/projects`,
        tone: "warn",
      },
      {
        label: "services sans fourchette de prix",
        count: services.docs.filter((s) => !s.pricing?.from?.trim()).length,
        href: `${ADMIN}/services`,
        tone: "warn",
      },
      {
        label: "services sans visuels",
        count: services.docs.filter((s) => !s.visual || !s.contextImage).length,
        href: `${ADMIN}/services`,
        tone: "warn",
      },
      {
        label: "articles sans couverture",
        count: posts.docs.filter((p) => !p.cover).length,
        href: `${ADMIN}/posts`,
        tone: "warn",
      },
    ] satisfies Gap[]
  ).filter((g) => g.count > 0);

  const shortcuts: Shortcut[] = [
    { label: "Projets", slug: "projects", count: projects.totalDocs, group: "Contenu" },
    { label: "Services", slug: "services", count: services.totalDocs, group: "Contenu" },
    { label: "Témoignages", slug: "testimonials", count: testimonials.totalDocs, group: "Contenu" },
    { label: "Questions fréquentes", slug: "faq", count: faq.totalDocs, group: "Contenu" },
    { label: "Articles", slug: "posts", count: posts.totalDocs, group: "Contenu" },
    { label: "Logos clients", slug: "logos", count: logos.totalDocs, group: "Accueil" },
    { label: "Médias", slug: "media", count: media.totalDocs, group: "Bibliothèque" },
  ];

  return { gaps, shortcuts };
}

export async function Dashboard() {
  let gaps: Gap[] = [];
  let shortcuts: Shortcut[] = [];

  try {
    ({ gaps, shortcuts } = await load());
  } catch {
    // Une base injoignable ne doit pas empêcher d'ouvrir l'administration :
    // sans ce filet, l'écran d'accueil emporterait toute l'interface.
    return null;
  }

  const done = gaps.length === 0;

  return (
    <div className="af-home">
      <section className="af-start">
        <p className="af-start__eyebrow">Où en est le site</p>
        <h1 className="af-start__title">
          {done
            ? "Tout est rempli. Le site est prêt à publier."
            : `${gaps.length} point${gaps.length > 1 ? "s" : ""} à compléter avant publication`}
        </h1>
        <p className="af-start__lead">
          {done
            ? "Aucun champ obligatoire laissé vide."
            : "Relevé fait sur la base à l'ouverture de cette page. Chaque ligne mène à la collection concernée."}
        </p>

        {done ? null : (
          <ul className="af-start__list">
            {gaps.map((gap) => (
              <li key={gap.label} data-tone={gap.tone}>
                <Link href={gap.href}>
                  <span className="af-start__count">{gap.count}</span>
                  <span className="af-start__label">{gap.label}</span>
                  <span className="af-start__go" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="af-quick">
        <h2 className="af-quick__title">Tout le contenu</h2>
        <ul className="af-quick__grid">
          {shortcuts.map((item) => (
            <li key={item.slug}>
              <Link href={`${ADMIN}/${item.slug}`} className="af-quick__card">
                <span className="af-quick__count">{item.count}</span>
                <span className="af-quick__name">{item.label}</span>
                <span className="af-quick__group">{item.group}</span>
              </Link>
              <Link
                href={`${ADMIN}/${item.slug}/create`}
                className="af-quick__add"
                aria-label={`Créer : ${item.label}`}
              >
                +
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
