import { AccentTitle } from "@/components/ui/AccentTitle";
import { CtaButton } from "@/components/ui/CtaButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getOffersSection, type Offer } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * Section « Deux façons de travailler ensemble ».
 *
 * Deux cartes, et la seconde porte le poids : fond blanc, ombre, filet
 * d'accent. Les présenter à égalité serait honnête et inefficace. Une offre
 * annuelle demande un engagement qu'on ne prend pas devant deux propositions
 * indifférenciées, et la carte mise en avant est justement celle qui a le plus
 * à démontrer.
 *
 * Les listes n'ont pas la même longueur, et ce n'est pas un défaut de
 * cadrage : l'écart se voit avant qu'on ait lu une ligne, et il dit ce que
 * l'une contient de plus que l'autre. Ne pas chercher à les équilibrer.
 *
 * Tout le contenu vient de Payload. Sans offre enregistrée, la section
 * disparaît plutôt que d'afficher un titre suivi de rien.
 */
export async function Offers() {
  const section = await getOffersSection();
  if (!section) return null;

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

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
          {section.offers.map((offre, i) => (
            <Carte key={offre.name} offre={offre} rang={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Carte({ offre, rang }: { offre: Offer; rang: number }) {
  const enAvant = offre.highlight;

  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${rang * 90}ms` } as React.CSSProperties}
      className={
        enAvant
          ? "relative flex flex-col overflow-hidden rounded-card border border-ink/12 bg-surface p-7 shadow-e1 md:p-9"
          : "relative flex flex-col rounded-card border border-line bg-paper p-7 md:p-9"
      }
    >
      {/* Le filet d'accent en tête de la carte mise en avant. Il fait le même
          travail qu'une pastille « recommandé », sans le mot. */}
      {enAvant && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-accent"
        />
      )}

      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{offre.kicker}</p>
          <h3 className="mt-2 text-[clamp(1.6rem,1.2rem+1.1vw,2rem)] font-bold tracking-[-0.03em] text-ink">
            {offre.name}
          </h3>
        </div>

        {offre.badge && (
          <span className="mt-1 shrink-0 rounded-full border border-line-2 px-3 py-1.5 text-[0.7rem] font-medium text-muted">
            {offre.badge}
          </span>
        )}
      </header>

      {offre.origin && (
        <p className="mt-3 text-[0.875rem] italic leading-relaxed text-muted">
          {typo(offre.origin)}
        </p>
      )}

      <p className="mt-6 text-[0.98rem] leading-relaxed text-ink-2">
        {typo(offre.pitch)}
      </p>

      {offre.punch && (
        <p className="mt-4 text-[0.98rem] font-semibold leading-relaxed text-ink">
          {typo(offre.punch)}
        </p>
      )}

      {offre.items.length > 0 && (
        <ul className="mt-7 space-y-3.5 border-t border-line pt-6">
          {offre.items.map((ligne) => (
            <li key={ligne.lead} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span className="text-[0.92rem] leading-relaxed text-muted">
                <strong className="font-semibold text-ink">
                  {typo(ligne.lead)}
                </strong>
                {ligne.text && <> {typo(ligne.text)}</>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* `mt-auto` colle les boutons en bas : les deux cartes n'ont pas la même
          hauteur de contenu, et sans lui les appels à l'action se retrouvent
          décalés de plusieurs centimètres l'un de l'autre. */}
      {offre.ctaLabel && (
        <div className="mt-auto pt-8">
          <CtaButton variant="compact" label={offre.ctaLabel} />
        </div>
      )}
    </article>
  );
}
