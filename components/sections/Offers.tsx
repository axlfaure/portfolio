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
            "mt-16 grid gap-6 lg:gap-x-5 lg:gap-y-8",
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
              derniere={i === offers.length - 1}
            />
          ))}
        </div>

        {section.footnote && (
          <p
            data-reveal
            className="mx-auto mt-12 max-w-[44rem] text-balance text-center text-[0.9rem] leading-relaxed text-muted"
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
  derniere,
}: {
  offre: Offer;
  rang: number;
  seule: boolean;
  derniere: boolean;
}) {
  const sombre = offre.highlight;
  // Identifiant stable entre le serveur et le navigateur, tiré du nom de la
  // colonne : useId n'existe pas dans un composant serveur.
  const identifiant = `offre-${offre.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${rang * 80}ms` } as React.CSSProperties}
      className={cn(
        "relative grid gap-y-8 rounded-cta p-8 md:p-9",
        // Pas de gap-y-0 ici : une grille imbriquée qui déclare son propre
        // espacement remplace celui de la grille parente, et les quatre zones
        // se retrouvaient collées. Cela ne se voyait que sur la colonne à la
        // liste la plus longue, les autres ayant du mou : son dernier point
        // touchait le bouton. La valeur du parent vaut celle d'ici, les zones
        // sont donc espacées pareil qu'une carte soit empilée ou en colonne.
        !seule && "lg:row-span-4 lg:grid-rows-subgrid",
        // Le même gabarit pour les trois. Une version précédente donnait à la
        // carte sombre un peu plus de hauteur et une marge négative, pour
        // qu'elle déborde de la rangée : comme les trois cartes partagent les
        // lignes de la grille, ce supplément de remplissage mangeait la hauteur
        // allouée et son dernier point passait sous le bouton. Le contraste
        // suffit à la désigner, il n'a pas besoin d'un débordement.
        sombre ? "bg-ink text-white shadow-e2" : "border border-line bg-surface",
      )}
    >
      <header>
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-[14px]",
              sombre ? "bg-white/10 text-white" : "bg-accent-soft text-accent",
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
        {/* text-balance répartit les mots sur deux lignes égales plutôt que de
            laisser un dernier mot seul, ce qui arrivait à « l'année. » et à
            « case. ». */}
        <p
          className={cn(
            "mt-2 text-balance text-[0.9rem] leading-snug",
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

        <p className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "whitespace-nowrap text-[clamp(2.1rem,1.6rem+1.4vw,2.6rem)] font-bold leading-none tracking-[-0.04em]",
              sombre ? "text-white" : "text-ink",
            )}
          >
            {offre.price}
          </span>
          {offre.priceSuffix && (
            <span
              className={cn(
                "whitespace-nowrap text-[0.95rem] font-medium",
                sombre ? "text-white/55" : "text-label",
              )}
            >
              {typo(offre.priceSuffix)}
            </span>
          )}
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
            {offre.trendUp && <FlecheGain />}
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
          {offre.items.map((item, i) => (
            <li key={item.label} className="relative flex items-start gap-3">
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
                {typo(item.label)}
                {item.note && (
                  <Precision
                    texte={item.note}
                    id={`${identifiant}-${i}`}
                    sombre={sombre}
                    versLaGauche={derniere}
                  />
                )}
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

/**
 * Réserve attachée à une ligne.
 *
 * Elle se déclenche au survol ET à la prise de focus, ce qui n'est pas un
 * raffinement : une infobulle qui ne répond qu'à la souris est invisible au
 * doigt comme au clavier, or c'est précisément là qu'on lit une réserve
 * d'engagement.
 *
 * Le « i » ne mesure que dix-sept pixels, ce qui est trois fois moins que la
 * cible tactile minimale. Il est donc doublé d'une zone sensible invisible,
 * posée en absolu pour ne pas déranger la ligne de texte qui l'entoure. Et le
 * texte est rattaché au libellé, pour qu'un lecteur d'écran l'énonce à la
 * suite plutôt que de le laisser orphelin.
 *
 * L'infobulle est positionnée sur la ligne entière et non sur l'icône : dans
 * une colonne étroite, ancrée à un « i » posé en fin de ligne, elle sortirait
 * de la carte.
 */
function Precision({
  texte,
  id,
  sombre,
  versLaGauche,
}: {
  texte: string;
  id: string;
  sombre: boolean;
  /** La dernière colonne ouvre sa bulle vers l'intérieur de la section. */
  versLaGauche: boolean;
}) {
  return (
    <span className="group/note">
      <button
        type="button"
        aria-label="Précision"
        aria-describedby={id}
        className={cn(
          "relative ml-1.5 inline-grid h-[1.05rem] w-[1.05rem] align-middle",
          "place-items-center rounded-full text-[0.65rem] font-bold leading-none",
          "transition-colors duration-200",
          "before:absolute before:-inset-3.5 before:content-['']",
          sombre
            ? "bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
            : "bg-line text-label hover:bg-line-2 hover:text-ink",
        )}
      >
        i
      </button>

      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute z-10 rounded-[10px] px-3 py-2",
          "text-[0.8rem] font-normal leading-snug shadow-e2",
          "opacity-0 transition-opacity duration-200",
          "group-hover/note:opacity-100 group-focus-within/note:opacity-100",
          // Sous la ligne tant que les cartes sont empilées : à cette largeur,
          // une bulle posée à côté sortirait de l'écran.
          "inset-x-0 top-full mt-2",
          // En colonnes, elle s'ouvre sur le côté, hors de la carte. La
          // dernière colonne ouvre vers l'intérieur, sinon la bulle sortirait
          // de la page et y ajouterait une barre de défilement horizontale.
          "lg:inset-x-auto lg:top-1/2 lg:mt-0 lg:w-[13.5rem] lg:-translate-y-1/2",
          versLaGauche ? "lg:right-full lg:mr-3" : "lg:left-full lg:ml-3",
          sombre ? "bg-white text-ink" : "bg-ink text-white",
        )}
      >
        {typo(texte)}
      </span>
    </span>
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
