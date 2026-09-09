import { CtaButton } from "@/components/ui/CtaButton";
import { cn } from "@/lib/cn";
import { COMPARATIF, type Valeur } from "@/lib/comparatif";
import type { Offer } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * Le comparatif détaillé, en vrai tableau.
 *
 * Un vrai `<table>`, et pas trois colonnes de `<div>`. Ce n'est pas un
 * scrupule d'école : un lecteur d'écran annonce ici « colonne Partner, ligne
 * Délai de livraison courant, sous 5 jours », ce qu'aucune grille de blocs ne
 * sait faire. C'est la seule structure qui rende une comparaison lisible sans
 * la voir.
 *
 * Sous `md`, le tableau ne se replie pas : il défile latéralement, la colonne
 * des libellés restant collée au bord. Replier un comparatif en trois listes
 * successives revient à supprimer la comparaison, qui est tout l'objet de la
 * page ; le défilement, lui, conserve la lecture en travers.
 *
 * L'en-tête colle en haut au défilement. Sur un tableau de vingt lignes, sans
 * cela on arrive au milieu sans plus savoir quelle colonne on lit.
 */
export function ComparatifOffres({ offres }: { offres: Offer[] }) {
  if (offres.length === 0) return null;

  return (
    <div className="mt-14" data-reveal>
      {/* Le conteneur du défilement. `-mx-[var(--gutter)]` puis le même
          remplissage rendent au tableau les marges de la page une fois
          défilé, sinon la première colonne colle au bord de l'écran. */}
      <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-2">
        {/* border-separate et non border-collapse : sous Chrome, une cellule
            collée perd ses bordures dès que les bords sont fusionnés, et la
            colonne des libellés se retrouvait sans filets une fois le tableau
            défilé. Chaque cellule porte donc son propre filet haut. */}
        <table className="w-full min-w-[44rem] border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Comparatif détaillé des trois offres, ligne par ligne.
          </caption>

          <thead className="sticky top-0 z-20 bg-paper">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-30 w-[34%] bg-paper pb-6 pr-6 align-bottom"
              >
                <span className="sr-only">Critère</span>
              </th>

              {offres.map((offre) => (
                <th
                  key={offre.name}
                  scope="col"
                  className="w-[22%] px-4 pb-6 align-bottom"
                >
                  <span
                    className={cn(
                      "block text-[1.15rem] font-bold tracking-[-0.02em]",
                      offre.highlight ? "text-accent" : "text-ink",
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
              <Groupe key={groupe.titre} groupe={groupe} offres={offres} />
            ))}

            <tr>
              <td className="sticky left-0 bg-paper pt-9" />
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
      </div>

      <p className="mt-4 text-[0.8rem] text-label md:hidden">
        Le tableau défile vers la droite.
      </p>
    </div>
  );
}

function Groupe({
  groupe,
  offres,
}: {
  groupe: (typeof COMPARATIF)[number];
  offres: Offer[];
}) {
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={offres.length + 1}
          className="sticky left-0 border-t border-line bg-paper pb-4 pt-9"
        >
          <span className="eyebrow">{groupe.titre}</span>
        </th>
      </tr>

      {groupe.lignes.map((ligne) => (
        <tr key={ligne.label} className="group/ligne">
          <th
            scope="row"
            className="sticky left-0 z-10 border-t border-line bg-paper py-4 pr-6 align-top text-[0.92rem] font-normal leading-snug text-ink-2 transition-colors duration-200 group-hover/ligne:text-ink"
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

/**
 * Une case du tableau.
 *
 * Le texte pour lecteur d'écran n'est pas décoratif : un pictogramme seul
 * laisserait la case muette, et une ligne muette dans un comparatif se lit
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

/** Même réserve au survol que dans la section d'accueil, au clavier comprise. */
function Reserve({ texte }: { texte: string }) {
  return (
    <span className="group/note relative inline-block">
      <button
        type="button"
        aria-label="Précision"
        className={cn(
          "relative ml-1.5 inline-grid h-[1.05rem] w-[1.05rem] align-middle",
          "place-items-center rounded-full bg-line text-[0.65rem] font-bold leading-none text-label",
          "transition-colors duration-200 hover:bg-line-2 hover:text-ink",
          "before:absolute before:-inset-3.5 before:content-['']",
        )}
      >
        i
      </button>

      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-[17rem] rounded-[10px]",
          "bg-ink px-3 py-2 text-[0.8rem] font-normal leading-snug text-white shadow-e2",
          "opacity-0 transition-opacity duration-200",
          "group-hover/note:opacity-100 group-focus-within/note:opacity-100",
        )}
      >
        {typo(texte)}
      </span>
    </span>
  );
}
