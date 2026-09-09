import { AccentTitle } from "@/components/ui/AccentTitle";
import { CtaButton } from "@/components/ui/CtaButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { getOffersSection, type Offer } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * Section « Deux façons de travailler ensemble ».
 *
 * Deux cartes lues côte à côte, ce qui impose une contrainte que la première
 * version ignorait : quand deux cartes se comparent, le regard va de gauche à
 * droite par bandes horizontales, pas de haut en bas colonne après colonne. Si
 * la promesse de gauche fait trois lignes et celle de droite sept, tout ce qui
 * suit est décalé et la comparaison devient impossible à faire de tête.
 *
 * D'où la grille imbriquée. Chaque carte occupe cinq lignes de la grille
 * parente et redéclare ces mêmes lignes pour son propre contenu : identité,
 * promesse, « pour qui », liste, action. Les cinq zones s'alignent donc entre
 * les deux cartes quelle que soit la longueur des textes, et les deux boutons
 * finissent à la même hauteur sans qu'on ait à borner quoi que ce soit.
 *
 * Sous `lg`, les cartes s'empilent et la grille imbriquée n'a plus d'objet :
 * il n'y a plus rien à comparer sur une même ligne.
 *
 * L'argument central, lui, est monté dans l'accroche de la section. Il vaut
 * pour les deux offres, et le répéter dans chaque carte les allongeait sans
 * rien apprendre.
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

        <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8 lg:[grid-template-rows:auto_auto_auto_1fr_auto]">
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
      className={cn(
        "relative grid gap-y-8 overflow-hidden rounded-card p-7 md:p-9",
        "lg:row-span-5 lg:grid-rows-subgrid",
        enAvant
          ? "border border-ink/12 bg-surface shadow-e1"
          : "border border-line bg-paper",
      )}
    >
      {/* Le filet d'accent fait le travail d'une pastille « recommandé », sans
          le mot, qui sonnerait comme une réclame sur une page qui n'en fait
          nulle part ailleurs. */}
      {enAvant && (
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
      )}

      <header>
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">{offre.kicker}</p>
          {offre.badge && (
            <span className="shrink-0 rounded-full border border-line-2 px-3 py-1 text-[0.7rem] font-medium text-muted">
              {offre.badge}
            </span>
          )}
        </div>
        <h3 className="mt-3.5 text-[clamp(1.75rem,1.3rem+1.2vw,2.15rem)] font-bold tracking-[-0.03em] text-ink">
          {offre.name}
        </h3>
      </header>

      <div>
        <p className="text-[1rem] leading-relaxed text-ink-2">{typo(offre.pitch)}</p>

        {offre.terms && (
          <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-line-2 px-4 py-2 text-[0.8rem] font-semibold text-ink">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {typo(offre.terms)}
          </p>
        )}
      </div>

      {/* L'encadré s'inverse d'une carte à l'autre : sur fond papier il lui
          faut le blanc, sur fond blanc le papier. Sans quoi il disparaît sur
          l'une des deux. */}
      {offre.forWho ? (
        <div
          className={cn(
            "rounded-[14px] border border-line px-5 py-4",
            enAvant ? "bg-paper" : "bg-surface",
          )}
        >
          <p className="eyebrow">Pour qui</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
            {typo(offre.forWho)}
          </p>
        </div>
      ) : (
        <div aria-hidden="true" />
      )}

      {offre.items.length > 0 ? (
        <ul className="space-y-3.5">
          {offre.items.map((ligne) => (
            <li key={ligne.lead} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span className="text-[0.92rem] leading-relaxed text-muted">
                <strong className="font-semibold text-ink">{typo(ligne.lead)}</strong>
                {ligne.text && <> {typo(ligne.text)}</>}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div aria-hidden="true" />
      )}

      {/* Une seule action principale par section : la carte mise en avant
          garde la pilule, l'autre passe en lien. Deux boutons identiques
          côte à côte se neutralisent, et le lecteur repart sans avoir choisi. */}
      <div>
        {offre.ctaLabel && (
          <CtaButton variant={enAvant ? "compact" : "link"} label={offre.ctaLabel} />
        )}
      </div>
    </article>
  );
}
