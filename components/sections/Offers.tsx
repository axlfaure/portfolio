import { AccentTitle } from "@/components/ui/AccentTitle";
import { CtaButton } from "@/components/ui/CtaButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { getOffersSection, type Offer, type OfferFeature } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * Section « Trois façons de travailler ensemble ».
 *
 * C'est un comparatif, et la forme découle entièrement de là. Devant plusieurs
 * offres, personne ne lit trois argumentaires : on balaie en travers, ligne
 * par ligne, pour voir ce qui change d'une colonne à l'autre. Une version
 * précédente donnait à chaque offre sa propre prose, ce qui rendait la lecture
 * en travers impossible et la section deux fois trop longue.
 *
 * Trois décisions en découlent.
 *
 * Les critères sont les mêmes partout, et seule la marque change. Un critère
 * absent se raye plutôt que de disparaître : ce qu'une offre ne comprend pas
 * en dit autant que ce qu'elle comprend, et une ligne manquante décalerait
 * tout le reste de la colonne.
 *
 * Le repère chiffré remplace le prix. Une colonne de comparatif a besoin d'un
 * point d'ancrage en grands caractères, sinon le regard n'a nulle part où se
 * poser ; « 12 mois » dit le rythme de la relation, ce qui est plus utile
 * qu'un montant et n'engage pas un tarif sur une page statique.
 *
 * Les lignes de toutes les colonnes s'alignent par grille imbriquée. Sans
 * cela, un titre qui passe sur deux lignes dans une colonne décale ses
 * critères d'un cran, et la comparaison en travers est perdue.
 */
export async function Offers() {
  const section = await getOffersSection();
  if (!section) return null;

  const { offers, features } = section;

  return (
    <section id="offres" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={
            <AccentTitle
              start={section.titleStart}
              accent={section.titleAccent}
              end={section.titleEnd}
            />
          }
          lead={section.lead || undefined}
        />

        {/* Cinq lignes partagées : identité, repère, adresse, action, critères.
            Chaque colonne les redéclare pour son propre contenu. */}
        {/* Pas d'étape à deux colonnes quand il y en a trois : la troisième
            se retrouverait seule sur une deuxième ligne, à moitié large, et
            le comparatif se lirait en deux fois. On passe donc directement de
            l'empilement aux trois colonnes. */}
        <div
          className={cn(
            "mt-14 grid gap-4 lg:gap-x-5 lg:gap-y-7",
            "lg:[grid-template-rows:auto_auto_auto_auto_1fr]",
            offers.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {offers.map((offre, i) => (
            <Colonne
              key={offre.name}
              offre={offre}
              rang={i}
              features={features}
              seule={offers.length === 1}
            />
          ))}
        </div>

        {section.footnote && (
          <p
            data-reveal
            className="mx-auto mt-10 max-w-[46rem] text-center text-[0.95rem] leading-relaxed text-muted"
          >
            {typo(section.footnote)}
          </p>
        )}
      </div>
    </section>
  );
}

function Colonne({
  offre,
  rang,
  features,
  seule,
}: {
  offre: Offer;
  rang: number;
  features: OfferFeature[];
  seule: boolean;
}) {
  const enAvant = offre.highlight;

  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${rang * 80}ms` } as React.CSSProperties}
      className={cn(
        "relative grid gap-y-7 overflow-hidden rounded-card p-6 md:p-7",
        !seule && "lg:row-span-5 lg:grid-rows-subgrid lg:gap-y-0",
        enAvant
          ? "border border-ink/12 bg-surface shadow-e2"
          : "border border-line bg-paper",
      )}
    >
      {enAvant && (
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
      )}

      {/* 1. Identité */}
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-[1.35rem] font-bold tracking-[-0.03em] text-ink">
          {offre.name}
        </h3>
        {offre.badge && (
          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-semibold text-white">
            {offre.badge}
          </span>
        )}
      </header>

      {/* 2. Le repère, en grands caractères. C'est lui qui donne à la colonne
             son point d'ancrage, à la place du prix. */}
      <div>
        <p className="text-[clamp(2.1rem,1.6rem+1.4vw,2.75rem)] font-bold leading-none tracking-[-0.04em] text-ink">
          {offre.anchor}
        </p>
        {offre.anchorNote && (
          <p className="mt-2.5 text-[0.85rem] text-muted">{typo(offre.anchorNote)}</p>
        )}
      </div>

      {/* 3. À qui elle s'adresse */}
      <p className="text-[0.92rem] leading-relaxed text-ink-2">{typo(offre.pitch)}</p>

      {/* 4. L'action. Les trois colonnes ont un bouton, parce que les trois
             offres sont des choix valables : la hiérarchie se joue entre plein
             et contour, pas entre un bouton et un lien qui ferait passer deux
             options légitimes pour des lots de consolation. */}
      <div>
        {offre.ctaLabel && (
          <CtaButton
            variant={enAvant ? "solid" : "outline"}
            label={offre.ctaLabel}
            className="w-full justify-center"
          />
        )}
      </div>

      {/* 5. Les critères */}
      {features.length > 0 ? (
        <ul className="space-y-3 border-t border-line pt-6">
          {features.map((critere) => {
            const compris = critere.included[rang] ?? false;
            return (
              <li key={critere.label} className="flex items-start gap-2.5">
                <Marque compris={compris} />
                {/* Pas de rature sur les lignes absentes : sur une colonne qui
                    en compte cinq, elle transforme la moitié du tableau en
                    barbelés. Le signe et la teinte disent déjà l'exclusion, et
                    la forme de la croix la dit sans dépendre de la couleur. */}
                <span
                  className={cn(
                    "text-[0.875rem] leading-snug",
                    compris ? "text-ink-2" : "text-faint",
                  )}
                >
                  {typo(critere.label)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div aria-hidden="true" />
      )}
    </article>
  );
}

/**
 * Marque de présence.
 *
 * Deux formes distinctes et pas seulement deux couleurs : sur un écran mal
 * réglé comme pour un daltonien, la teinte ne suffit pas à dire l'inclusion.
 * Le texte porte d'ailleurs la même information par sa rature.
 */
function Marque({ compris }: { compris: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-[0.15em] grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full",
        compris ? "bg-accent/10 text-accent" : "bg-line text-faint",
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
        {compris ? <path d="M3 8.5 6.2 12 13 4.5" /> : <path d="M4 4l8 8M12 4l-8 8" />}
      </svg>
    </span>
  );
}
