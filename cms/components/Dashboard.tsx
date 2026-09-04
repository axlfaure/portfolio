import Link from "next/link";
import { getPayload } from "payload";
import config from "../../payload.config";

/**
 * Écran d'accueil de l'administration.
 *
 * Le tableau de bord de Payload est une liste de collections : il dit ce
 * qu'on peut ouvrir, jamais ce qu'il reste à faire. Ce panneau interroge la
 * base au chargement et affiche les manques réels, chacun cliquable vers la
 * liste concernée. On arrive en sachant par où commencer.
 *
 * Les seuils sont volontairement bêtes : un champ vide compte, un champ
 * rempli ne compte pas. Rien à maintenir, rien à régler.
 */

type Gap = { label: string; count: number; href: string; tone: "stop" | "warn" };

async function collectGaps(): Promise<{ gaps: Gap[]; total: number }> {
  const payload = await getPayload({ config });
  const q = { limit: 200, depth: 0 } as const;

  const [projects, services, posts, testimonials] = await Promise.all([
    payload.find({ collection: "projects", ...q }),
    payload.find({ collection: "services", ...q }),
    payload.find({ collection: "posts", ...q }),
    payload.find({ collection: "testimonials", ...q }),
  ]);

  const fake = testimonials.docs.filter((t) =>
    /pr[ée]nom|structure/i.test(`${t.name} ${t.org}`),
  ).length;

  const gaps: Gap[] = (
    [
      {
        label: "témoignages encore fictifs",
        count: fake,
        href: "/admin/collections/testimonials",
        tone: "stop",
      },
      {
        label: "projets sans visuel principal",
        count: projects.docs.filter((p) => !p.cover).length,
        href: "/admin/collections/projects",
        tone: "warn",
      },
      {
        label: "projets sans accroche",
        count: projects.docs.filter((p) => !p.teaser?.trim()).length,
        href: "/admin/collections/projects",
        tone: "warn",
      },
      {
        label: "services sans fourchette de prix",
        count: services.docs.filter((s) => !s.pricing?.from?.trim()).length,
        href: "/admin/collections/services",
        tone: "warn",
      },
      {
        label: "services sans visuels",
        count: services.docs.filter((s) => !s.visual || !s.contextImage).length,
        href: "/admin/collections/services",
        tone: "warn",
      },
      {
        label: "articles sans couverture",
        count: posts.docs.filter((p) => !p.cover).length,
        href: "/admin/collections/posts",
        tone: "warn",
      },
    ] satisfies Gap[]
  ).filter((g) => g.count > 0);

  return { gaps, total: projects.totalDocs };
}

export async function Dashboard() {
  let gaps: Gap[] = [];
  let total = 0;

  try {
    ({ gaps, total } = await collectGaps());
  } catch {
    // Une base injoignable ne doit pas empêcher d'ouvrir l'administration :
    // sans ce filet, l'écran d'accueil emporterait toute l'interface.
    return null;
  }

  const done = gaps.length === 0;

  return (
    <div className="af-start">
      <div className="af-start__head">
        <p className="af-start__eyebrow">Où en est le site</p>
        <h2 className="af-start__title">
          {done ? (
            <>Tout est rempli. Le site est prêt à publier.</>
          ) : (
            <>
              {gaps.length} point{gaps.length > 1 ? "s" : ""} à compléter avant
              publication
            </>
          )}
        </h2>
        <p className="af-start__lead">
          {done
            ? `${total} projets en ligne, aucun champ obligatoire laissé vide.`
            : "Relevé fait sur la base à l'instant. Chaque ligne mène à la collection concernée."}
        </p>
      </div>

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
    </div>
  );
}
