import { AccentTitle } from "@/components/ui/AccentTitle";
import { CtaButton } from "@/components/ui/CtaButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { getOffersSection, type Offer } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * Section « Trois façons de travailler ensemble ».
 *
 * Trois colonnes de tarif, dans l'ordre éprouvé : pictogramme et nom, une
 * ligne pour se reconnaître, le montant en grand, ce qui est compris, puis le
 * bouton en pied de carte.
 *
 * Le bouton est en bas et non sous le prix, contrairement à une version
 * précédente. Placé avant la liste, il demande de choisir avant d'avoir lu ce
 * qu'on achète ; en pied, il conclut la lecture au moment où la décision est
 * mûre. C'est aussi la seule position qui aligne les trois boutons.
 *
 * Les avantages ne sont pas répétés. Afficher les mêmes lignes dans les trois
 * colonnes, cochées ou barrées, faisait un mur où le lecteur relisait trois
 * fois la même chose pour trouver les deux qui changeaient. Les colonnes
 * suivantes ouvrent donc leur liste par « Tout One shot », et n'énumèrent que
 * ce qu'elles ajoutent.
 *
 * La colonne recommandée s'inverse en sombre. Sur une page entièrement claire,
 * c'est le seul contraste qui la désigne sans ajouter de couleur, et il
 * fonctionne à distance, avant qu'on ait lu le moindre mot.
 */
export async function Offers() {
  const section = await getOffersSection();
  if (!section) return null;

  const { offers } = section;

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

        {/* Quatre lignes partagées : identité, montant, liste, action. */}
        <div
          className={cn(
            "mt-16 grid gap-6 lg:gap-5",
            "lg:[grid-template-rows:auto_auto_1fr_auto]",
            offers.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {offers.map((offre, i) => (
            <Colonne
              key={offre.name}
              offre={offre}
              rang={i}
              seule={offers.length === 1}
            />
          ))}
        </div>

        {section.footnote && (
          <p
            data-reveal
            className="mx-auto mt-12 max-w-[44rem] text-center text-[0.9rem] leading-relaxed text-muted"
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
  seule,
}: {
  offre: Offer;
  rang: number;
  seule: boolean;
}) {
  const sombre = offre.highlight;

  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${rang * 80}ms` } as React.CSSProperties}
      className={cn(
        "relative grid gap-y-8 rounded-cta p-8 md:p-9",
        !seule && "lg:row-span-4 lg:grid-rows-subgrid lg:gap-y-0",
        sombre
          ? "bg-ink text-white shadow-e2 lg:-my-4 lg:py-13"
          : "border border-line bg-surface",
      )}
    >
      <header>
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-[14px]",
              sombre ? "bg-white/10 text-white" : "bg-paper text-ink-2",
            )}
          >
            <FeatureIcon name={offre.icon} />
          </span>

          {offre.badge && (
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold",
                sombre ? "bg-accent text-white" : "bg-paper text-muted",
              )}
            >
              {offre.badge}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "mt-5 text-[1.45rem] font-bold tracking-[-0.03em]",
            sombre ? "text-white" : "text-ink",
          )}
        >
          {offre.name}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-[0.9rem] leading-snug",
            sombre ? "text-white/65" : "text-muted",
          )}
        >
          {typo(offre.tagline)}
        </p>
      </header>

      {/* Le montant occupe sa propre ligne. Posé à côté de son unité, comme
          le font les grilles anglaises où le prix tient en trois caractères,
          « dès 300 € » se coupait avant l'euro et « Sur devis » avant
          « devis » : une colonne de trois cent trente pixels n'a pas la place
          des deux. */}
      <div>
        {offre.pricePrefix && (
          <p
            className={cn(
              "mb-2 text-[0.8rem]",
              sombre ? "text-white/55" : "text-label",
            )}
          >
            {typo(offre.pricePrefix)}
          </p>
        )}

        <p
          className={cn(
            "whitespace-nowrap text-[clamp(2.1rem,1.6rem+1.4vw,2.6rem)] font-bold leading-none tracking-[-0.04em]",
            sombre ? "text-white" : "text-ink",
          )}
        >
          {offre.price}
        </p>

        {offre.priceUnit && (
          <p
            className={cn(
              "mt-2.5 text-[0.875rem]",
              sombre ? "text-white/60" : "text-muted",
            )}
          >
            {typo(offre.priceUnit)}
          </p>
        )}

        {offre.trend && (
          <p
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold",
              sombre ? "bg-white/12 text-white" : "bg-accent/10 text-accent",
            )}
          >
            <FlecheGain />
            {typo(offre.trend)}
          </p>
        )}
      </div>

      {offre.items.length > 0 ? (
        <ul
          className={cn(
            "space-y-3.5 border-t pt-8",
            sombre ? "border-white/12" : "border-line",
          )}
        >
          {offre.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-[0.1em] grid h-[1.2rem] w-[1.2rem] shrink-0 place-items-center rounded-full",
                  sombre ? "bg-white/12 text-white" : "bg-accent/10 text-accent",
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
                  <path d="M3 8.5 6.2 12 13 4.5" />
                </svg>
              </span>
              <span
                className={cn(
                  "text-[0.92rem] leading-snug",
                  sombre ? "text-white/85" : "text-ink-2",
                )}
              >
                {typo(item)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div aria-hidden="true" />
      )}

      <div>
        {offre.ctaLabel && (
          <CtaButton
            variant={sombre ? "inverse" : "outline"}
            label={offre.ctaLabel}
            className="w-full justify-center"
          />
        )}
      </div>
    </article>
  );
}

/** Flèche de progression, comme sur une courbe de cotation. */
function FlecheGain() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 11.5 6 7.5l2.6 2.6L14 4.5" />
      <path d="M10.2 4.5H14V8.3" />
    </svg>
  );
}
