"use client";

import { useId, useRef, useState } from "react";
import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";

/**
 * VERSION B — le parcours d'une idée.
 *
 * Même objectif que la version A, chemin inverse. Là où celle-ci démontre par
 * l'écart entre deux briefs, celle-ci montre le travail lui-même, étape par
 * étape, pour que la valeur se voie là où elle se trouve réellement : au
 * milieu, entre l'idée d'un ingénieur et le fichier livré.
 *
 * C'est le point de la section. Un exécutant est payé pour la dernière étape.
 * Ce qui distingue quelqu'un du domaine se joue à la deuxième et à la
 * troisième, celles qu'on ne facture pas à la ligne et qui décident pourtant
 * de tout le reste.
 *
 * La navigation est horizontale et non un déroulé vertical numéroté : les
 * pages service en ont déjà un, avec sa jauge au scroll. Deux fois le même
 * geste sur un seul site le banaliserait.
 */

type Etape = {
  cle: string;
  titre: string;
  corps: string;
  /** Ce que l'étape retire des mains du client. */
  epargne: string;
  /** Visuel à fournir. Le libellé décrit ce qu'on attend à cet endroit. */
  visuel: string | null;
  attente: string;
};

const ETAPES: Etape[] = [
  {
    cle: "idee",
    titre: "L'idée",
    corps:
      "Un ingénieur a un résultat à montrer : des courbes, un schéma de principe, et six semaines avant le salon. Il sait exactement ce qu'il a trouvé. Il ne sait pas encore ce qu'un visiteur doit en comprendre en cinq secondes.",
    epargne: "Vous n'avez pas à faire ce tri à sa place.",
    visuel: null,
    attente: "Photo d'un schéma griffonné, ou capture d'une figure de publication",
  },
  {
    cle: "appel",
    titre: "L'appel",
    corps:
      "Trente minutes avec lui, pas avec son service communication. Je pose les questions qui font sortir l'essentiel : à qui on parle, ce qui doit être compris immédiatement, ce qui peut attendre la question. Et surtout ce qu'on n'a pas le droit d'affirmer.",
    epargne: "Une seule explication, à la personne qui dessinera.",
    visuel: null,
    attente: "Capture d'un appel, ou photo de notes prises pendant l'échange",
  },
  {
    cle: "cadrage",
    titre: "Le cadrage",
    corps:
      "Je rends un cadrage écrit : le message en une phrase, ce qu'on montre, ce qu'on tait, le format qui sert l'objectif. C'est le document qu'on relit trois semaines plus tard, quand quelqu'un demande pourquoi telle décision a été prise.",
    epargne: "Les arbitrages sont posés avant la première image, pas après la troisième.",
    visuel: null,
    attente: "Extrait d'un document de cadrage, flouté si besoin",
  },
  {
    cle: "directions",
    titre: "Les directions",
    corps:
      "Deux ou trois pistes, pas quinze : un choix se fait entre des options tranchées. Chacune est appliquée sur le support réel, à sa taille réelle. Un kakémono se juge à quatre mètres, pas sur une planche d'ambiance.",
    epargne: "Vous choisissez sur pièce, et une seule fois.",
    visuel: null,
    attente: "Deux ou trois directions côte à côte, sur le support",
  },
  {
    cle: "visuel",
    titre: "Le visuel",
    corps:
      "Livré aux formats qui servent, avec les fichiers sources. Et construit pour durer : quand un résultat évolue ou qu'un partenaire s'ajoute, on reprend le fichier au lieu de tout recommencer.",
    epargne: "Le support suivant coûte une fraction du premier.",
    visuel: null,
    attente: "Le support fini, en situation : sur le stand, en main, à l'écran",
  },
];

export function Parcours() {
  const [actif, setActif] = useState(0);
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  /*
   * Flèches et raccourcis de début et de fin, comme l'attend un jeu d'onglets.
   * Sans eux, la tabulation entre dans le groupe et n'en ressort qu'après
   * cinq arrêts, ce qui est exactement ce que ce motif est censé éviter.
   */
  const auClavier = (event: React.KeyboardEvent) => {
    const pas =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    let cible: number | null = null;
    if (pas !== 0) cible = (actif + pas + ETAPES.length) % ETAPES.length;
    if (event.key === "Home") cible = 0;
    if (event.key === "End") cible = ETAPES.length - 1;
    if (cible === null) return;

    event.preventDefault();
    setActif(cible);
    onglets.current[cible]?.focus();
  };

  const etape = ETAPES[actif];

  return (
    <section className="section scroll-mt-24">
      <div className="container-site">
        <div data-reveal>
          <p className="eyebrow">Comment ça se passe</p>
          <h2 className="h2 mt-5 max-w-[22ch]">
            <span className="rise">
              <span>
                D&apos;une idée d&apos;ingénieur{" "}
                <em className="accent hl hl--scroll">à un visuel qui tient.</em>
              </span>
            </span>
          </h2>
          <p className="lead mt-5 max-w-[52ch]">
            {typo(
              "Un exécutant est payé pour la dernière étape. Tout ce qui décide du résultat se joue aux deuxième et troisième, celles qu'on ne facture pas à la ligne.",
            )}
          </p>
        </div>

        {/* Le rail. Il défile au doigt sur écran étroit plutôt que de se
            replier : cinq étapes numérotées se lisent mieux en ligne qu'en
            accordéon, où l'on perd la notion de progression. */}
        <div
          data-reveal
          className="mt-12 -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            role="tablist"
            aria-label="Les étapes d'un projet"
            onKeyDown={auClavier}
            className="flex min-w-max items-stretch gap-2 md:min-w-0 md:gap-3"
          >
            {ETAPES.map((e, i) => {
              const courant = i === actif;
              return (
                <button
                  key={e.cle}
                  ref={(node) => {
                    onglets.current[i] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-onglet-${i}`}
                  aria-selected={courant}
                  aria-controls={`${id}-panneau`}
                  tabIndex={courant ? 0 : -1}
                  onClick={() => setActif(i)}
                  className={cn(
                    "group flex-1 rounded-card border px-4 py-3.5 text-left transition-[background-color,border-color] duration-300 ease-site md:px-5",
                    courant
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-surface hover:border-line-2",
                  )}
                >
                  <span
                    className={cn(
                      "num block text-[0.7rem] font-medium tabular-nums transition-colors duration-300",
                      courant ? "text-white/55" : "text-label",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block whitespace-nowrap text-[0.95rem] font-bold tracking-[-0.02em] transition-colors duration-300",
                      courant ? "text-white" : "text-ink",
                    )}
                  >
                    {e.titre}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`${id}-panneau`}
          aria-labelledby={`${id}-onglet-${actif}`}
          data-reveal
          className="mt-6 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-12"
        >
          {/* La clé force le remontage à chaque étape : le texte réapparaît
              au lieu de se substituer sans qu'on l'ait vu changer. */}
          <div key={etape.cle} className="page-enter">
            <p className="text-[1.05rem] leading-relaxed text-ink-2">
              {typo(etape.corps)}
            </p>

            <p className="mt-7 flex items-start gap-3 border-t border-line pt-6">
              <span
                aria-hidden="true"
                className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span className="text-[0.95rem] font-semibold leading-relaxed text-ink">
                {typo(etape.epargne)}
              </span>
            </p>
          </div>

          <Media
            key={`${etape.cle}-visuel`}
            src={etape.visuel}
            alt={etape.titre}
            ratio="4 / 3"
            sizes="(min-width: 48rem) 34rem, 92vw"
            label={etape.attente}
            className="rounded-project"
          />
        </div>
      </div>
    </section>
  );
}
