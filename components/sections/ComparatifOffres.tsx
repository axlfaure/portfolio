import { CtaButton } from "@/components/ui/CtaButton";
import { cn } from "@/lib/cn";
import { COMPARATIF, type GroupeComparatif, type Valeur } from "@/lib/comparatif";
import type { Offer } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * Le comparatif détaillé.
 *
 * Deux rendus, et non un seul qui s'adapte. Au-dessus de `lg`, un vrai
 * `<table>` : un lecteur d'écran y annonce « colonne Partner, ligne Délai de
 * livraison courant, sous 5 jours », ce qu'aucune grille de blocs ne sait
 * faire. En dessous, un bloc par critère portant ses trois valeurs nommées.
 *
 * Le défilement latéral a été essayé et abandonné. Il tenait techniquement,
 * mais il demandait au lecteur de pousser le tableau de côté pour atteindre la
 * troisième colonne, donc de garder les deux premières en mémoire : c'est
 * exactement ce qu'un comparatif est censé lui éviter. Le format en blocs
 * garde les trois valeurs sous les yeux, critère par critère. Il retire au
 * passage un défaut d'affichage que le défilement traînait avec lui : déclarer
 * overflow-x rend aussi overflow-y découpant, et l'ombre des boutons de la
 * dernière rangée s'y trouvait tranchée.
 *
 * Les deux versions sont dans le document, l'une masquée par `display: none`,
 * ce qui la retire aussi de l'arbre d'accessibilité : à aucun moment un
 * lecteur d'écran ne rencontre le contenu en double.
 *
 * Le tableau n'apparaît qu'à partir de `lg` et non de `md` : à 768 px, ses
 * quatre colonnes tombaient sous la largeur lisible.
 */
export function ComparatifOffres({ offres }: { offres: Offer[] }) {
  if (offres.length === 0) return null;

  return (
    <>
      <div className="mt-14 hidden lg:block" data-reveal>
        <Tableau offres={offres} />
      </div>

      <div className="mt-12 lg:hidden" data-reveal>
        <Blocs offres={offres} />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------
   Grand écran : le tableau
   ------------------------------------------------------------------------- */

function Tableau({ offres }: { offres: Offer[] }) {
  return (
    <table className="w-full border-separate border-spacing-0 text-left">
      <caption className="sr-only">
        Comparatif détaillé des offres, ligne par ligne.
      </caption>

      {/* L'en-tête colle en haut : sur vingt-deux lignes, sans cela on arrive
          au milieu sans plus savoir quelle colonne on lit. */}
      <thead className="sticky top-0 z-20 bg-paper">
        <tr>
          <th scope="col" className="w-[34%] pb-6 pr-6 align-bottom">
            <span className="sr-only">Critère</span>
          </th>

          {offres.map((offre) => (
            <th key={offre.name} scope="col" className="w-[22%] px-4 pb-6 align-bottom">
              <span
                className={cn(
                  "block text-[1.15rem] font-bold tracking-[-0.02em]",
                  offre.highlight ? "text-accent-deep" : "text-ink",
                )}
              >
                {offre.name}
              </span>
              <span className="mt-1.5 block whitespace-nowrap text-[0.85rem] text-muted">
                {offre.price}
                {offre.priceSuffix ? ` ${typo(offre.priceSuffix)}` : ""}
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {COMPARATIF.map((groupe) => (
          <GroupeTableau key={groupe.titre} groupe={groupe} offres={offres} />
        ))}

        <tr>
          <td className="pt-9" />
          {offres.map((offre) => (
            <td key={offre.name} className="px-4 pt-9 align-top">
              {offre.ctaLabel && (
                <CtaButton
                  variant={offre.highlight ? "solid" : "outline"}
                  label={offre.ctaLabel}
                  className="w-full justify-center"
                />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function GroupeTableau({
  groupe,
  offres,
}: {
  groupe: GroupeComparatif;
  offres: Offer[];
}) {
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={offres.length + 1}
          className="border-t border-line pb-4 pt-9"
        >
          <span className="eyebrow">{groupe.titre}</span>
        </th>
      </tr>

      {groupe.lignes.map((ligne) => (
        <tr key={ligne.label} className="group/ligne">
          <th
            scope="row"
            className="relative border-t border-line py-4 pr-6 align-top text-[0.92rem] font-normal leading-snug text-ink-2 transition-colors duration-200 group-hover/ligne:text-ink"
          >
            {typo(ligne.label)}
            {ligne.note && <Reserve texte={ligne.note} />}
          </th>

          {ligne.valeurs.slice(0, offres.length).map((valeur, i) => (
            <td
              key={offres[i].name}
              className={cn(
                "border-t border-line px-4 py-4 align-top",
                offres[i].highlight && "bg-accent-soft/45",
              )}
            >
              <Case valeur={valeur} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------
   Écran étroit : un bloc par critère
   ------------------------------------------------------------------------- */

function Blocs({ offres }: { offres: Offer[] }) {
  return (
    <div className="space-y-12">
      {COMPARATIF.map((groupe) => (
        <section key={groupe.titre}>
          <h2 className="eyebrow">{groupe.titre}</h2>

          <div data-reveal data-reveal-stagger className="mt-5 space-y-4">
            {groupe.lignes.map((ligne) => (
              <article
                key={ligne.label}
                data-reveal-item
                className="relative rounded-card border border-line bg-surface p-5"
              >
                <h3 className="text-[0.95rem] font-semibold leading-snug text-ink">
                  {typo(ligne.label)}
                  {ligne.note && <Reserve texte={ligne.note} />}
                </h3>

                {/* Les trois valeurs, nommées. C'est ce qui remplace la lecture
                    en travers du tableau : on ne compare plus des colonnes, on
                    compare trois lignes qui tiennent dans un même regard. */}
                <dl className="mt-4">
                  {ligne.valeurs.slice(0, offres.length).map((valeur, i) => (
                    <div
                      key={offres[i].name}
                      className={cn(
                        "flex items-start justify-between gap-4 border-t border-line py-2.5",
                        offres[i].highlight && "-mx-2 bg-accent-soft/50 px-2",
                      )}
                    >
                      <dt
                        className={cn(
                          "text-[0.85rem]",
                          offres[i].highlight
                            ? "font-semibold text-accent-deep"
                            : "text-muted",
                        )}
                      >
                        {offres[i].name}
                      </dt>
                      <dd className="flex justify-end text-right">
                        <Case valeur={valeur} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      ))}

      <div className="space-y-3">
        {offres.map((offre) =>
          offre.ctaLabel ? (
            <CtaButton
              key={offre.name}
              variant={offre.highlight ? "solid" : "outline"}
              label={offre.ctaLabel}
              className="w-full justify-center"
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */

/**
 * Une case du comparatif.
 *
 * Le texte pour lecteur d'écran n'est pas décoratif : un pictogramme seul
 * laisserait la case muette, et une case muette dans un comparatif se lit
 * comme une valeur absente.
 */
function Case({ valeur }: { valeur: Valeur }) {
  if (typeof valeur === "string") {
    return (
      <span className="block text-[0.9rem] font-medium leading-snug text-ink">
        {typo(valeur)}
      </span>
    );
  }

  return (
    <>
      <span className="sr-only">{valeur ? "Compris" : "Non compris"}</span>
      <span
        aria-hidden="true"
        className={cn(
          "grid h-[1.35rem] w-[1.35rem] place-items-center rounded-full",
          valeur ? "bg-accent/10 text-accent" : "bg-line text-faint",
        )}
      >
        <svg
          viewBox="0 0 16 16"
          className="h-2.5 w-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {valeur ? <path d="M3 8.5 6.2 12 13 4.5" /> : <path d="M4 4l8 8M12 4l-8 8" />}
        </svg>
      </span>
    </>
  );
}

/** La réserve d'un engagement, au survol comme au clavier. */
function Reserve({ texte }: { texte: string }) {
  return (
    <span className="group/note inline-block">
      <button
        type="button"
        aria-label="Précision"
        className={cn(
          "relative ml-1.5 inline-grid h-[1.05rem] w-[1.05rem] align-middle",
          "place-items-center rounded-full bg-line text-[0.65rem] font-bold leading-none text-label",
          "transition-colors duration-200 hover:bg-line-2 hover:text-ink",
          // Le « i » ne fait que dix-sept pixels : une zone sensible invisible
          // le porte à quarante-cinq, sans déranger la ligne de texte.
          "before:absolute before:-inset-3.5 before:content-['']",
        )}
      >
        i
      </button>

      <span
        role="tooltip"
        /* La bulle se cale sur la cellule ou la carte, pas sur le « i ».
           Ancrée sur l'icône, qui tombe en fin de libellé, elle démarrait à
           deux cent quatre-vingts pixels du bord et sortait de l'écran : même
           invisible, une boîte en absolu élargit la zone défilable du
           document, et la page gagnait cent soixante-six pixels de
           débordement horizontal. */
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full z-30 mt-2",
          "rounded-[10px] bg-ink px-3 py-2 text-[0.8rem] font-normal leading-snug text-white shadow-e2",
          "opacity-0 transition-opacity duration-200",
          "group-hover/note:opacity-100 group-focus-within/note:opacity-100",
        )}
      >
        {typo(texte)}
      </span>
    </span>
  );
}
