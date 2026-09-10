import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { SITUATIONS, SOCLE_COMMUN } from "@/lib/comparatif";
import type { Offer } from "@/lib/content";
import { typo } from "@/lib/typo";

/**
 * L'introduction de la page Offres.
 *
 * Sans elle, la page passait du titre à vingt et un critères, et quelqu'un
 * arrivé par la navigation découvrait trois noms de colonnes qui ne voulaient
 * rien dire pour lui. Le tableau paraissait lourd parce qu'il travaillait seul.
 *
 * Deux panneaux côte à côte, et leur disposition porte le propos.
 *
 * À gauche, les trois offres dans un seul cadre, en rangées séparées par un
 * filet. Un cadre par offre en aurait fait trois objets concurrents, à
 * hiérarchie égale, sans que la boîte n'apporte rien : ici le cadre groupe,
 * il ne découpe pas. Les rangées, elles, emploient le même vocabulaire de
 * filets que le tableau qui suit.
 *
 * À droite, le socle commun, en flanc. Posé sous les trois offres, il se
 * lisait comme une quatrième chose ; posé à côté et sur toute leur hauteur,
 * il les accolade. C'est la mise en page qui dit « ceci vaut pour les trois »
 * avant même qu'on ait lu l'intitulé.
 *
 * Les deux panneaux sont en blanc sur papier, donc un vrai écart, là où un
 * aplat `--sunk` n'aurait donné que neuf niveaux de gris.
 */
export function IntroOffres({ offres }: { offres: Offer[] }) {
  if (offres.length === 0) return null;

  return (
    <div className="mt-[clamp(2.5rem,6vw,3.75rem)] grid items-stretch gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
      {/* Une liste de définitions, et pas seulement par convenance : chaque
          rangée définit une offre par la situation qui y mène. Un lecteur
          d'écran annonce alors le terme, puis sa définition. */}
      <dl
        data-reveal
        data-reveal-stagger
        className="divide-y divide-line rounded-card border border-line bg-surface"
      >
        {offres.map((offre, i) => (
          <Rangee key={offre.name} offre={offre} rang={i} />
        ))}
      </dl>

      {SOCLE_COMMUN.length > 0 && <Socle />}
    </div>
  );
}

/**
 * Une situation.
 *
 * Grille volontairement inégale : la colonne d'identité est fixe et étroite,
 * celle du récit prend tout le reste. Deux colonnes égales auraient redonné
 * l'effet de trois cartes en travers, en pire, puisque le texte n'aurait plus
 * eu de largeur de lecture.
 *
 * Elle retombe en une seule colonne sous `lg`, où l'identité passe simplement
 * au-dessus de son propre texte.
 */
function Rangee({ offre, rang }: { offre: Offer; rang: number }) {
  const situation = SITUATIONS[rang];
  if (!situation) return null;

  return (
    <div className="grid gap-x-10 gap-y-5 px-7 py-[clamp(1.6rem,3vw,2.15rem)] lg:grid-cols-[minmax(0,13.5rem)_minmax(0,1fr)]">
      <dt data-reveal-item className="flex items-start gap-4">
        {/* Le même pictogramme pour les trois : la mise en avant est déjà
            portée par la pastille, et deux marqueurs pour une seule idée en
            font une insistance. */}
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
          <FeatureIcon name={offre.icon} size={17} />
        </span>

        <span className="min-w-0">
          {/* La pastille voyage avec le rang, pas avec le nom. Glissée entre
              le nom et sa ligne de reconnaissance, elle donnait quatre étages
              à Partner contre trois aux deux autres, et l'oeil lisait ce
              décalage avant de lire la mention. Sur la ligne du rang, elle
              s'ajoute sans rien décaler : les trois colonnes gardent le même
              rythme. Les interlignes sont annulées de part et d'autre pour que
              le centrage porte sur les hauteurs réelles et non sur des boîtes
              de ligne de tailles différentes. */}
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span aria-hidden="true" className="meta num leading-none text-faint">
              0{rang + 1}
            </span>
            {offre.badge && (
              <span className="rounded-full bg-accent-soft px-2 py-[0.3rem] text-[0.6rem] font-semibold uppercase leading-none tracking-[0.07em] text-accent-deep">
                {offre.badge}
              </span>
            )}
          </span>

          <span className="mt-2.5 block text-[1.2rem] font-bold leading-none tracking-[-0.03em] text-ink">
            {offre.name}
          </span>

          <span className="mt-2 block text-[0.85rem] leading-snug text-muted">
            {typo(offre.tagline)}
          </span>
        </span>
      </dt>

      <dd data-reveal-item className="lg:pt-1">
        <p className="text-balance text-[1.08rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
          {typo(situation.titre)}
        </p>
        <p className="mt-2.5 text-pretty text-[0.92rem] leading-relaxed text-muted">
          {typo(situation.texte)}
        </p>
      </dd>
    </div>
  );
}

/**
 * Le socle commun, en flanc droit.
 *
 * Sombre, et c'est le seul bloc de la page qui a le droit de l'être : il ne se
 * compare pas. Le contraste dit donc quelque chose de vrai, au lieu de
 * décorer, et il évite au panneau de n'être qu'une seconde carte blanche à
 * côté de la première.
 *
 * Colonne unique : les libellés y passent sur deux lignes plutôt qu'une, et
 * c'est le bon échange. Sur deux colonnes, ils tenaient en largeur mais le
 * bloc s'étalait sous les offres au lieu de les tenir ensemble.
 *
 * `h-full` le fait courir sur toute la hauteur du panneau de gauche, et c'est
 * cet alignement qui produit l'accolade. Comme la hauteur lui est donnée par
 * le voisin et non par son contenu, il lui restait deux cents pixels vides en
 * bas : la colonne est donc en `flex`, les engagements poussés par leur propre
 * interligne, et la ligne de bas de bloc calée par `mt-auto`. Le vide se
 * répartit au lieu de s'accumuler à la fin.
 */
function Socle() {
  return (
    <section
      data-reveal
      className="flex h-full flex-col rounded-card bg-ink p-8 text-white"
    >
      <h2 className="eyebrow text-white/55">Le socle commun</h2>

      <p className="mt-4 text-balance text-[1.1rem] font-semibold leading-snug tracking-[-0.025em] text-white">
        {SOCLE_COMMUN.length} engagements identiques partout.
      </p>

      {/* L'accent ne tient pas sur l'encre : #2F42D8 sur #16171A ne se
          distingue plus. C'est --stroke, le bleu clair du trait sous les
          titres, qui prend le relais sur fond sombre. */}
      <ul
        data-reveal
        data-reveal-stagger
        className="mt-7 flex flex-1 flex-col justify-between gap-y-[clamp(0.9rem,1.6vw,1.4rem)]"
      >
        {SOCLE_COMMUN.map((ligne) => (
          <li
            key={ligne.label}
            data-reveal-item
            className="flex items-start gap-2.5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="mt-[0.3rem] h-3 w-3 shrink-0 text-stroke"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8.5 6.2 12 13 4.5" />
            </svg>
            <span className="text-[0.85rem] leading-snug text-white/80">
              {typo(ligne.label)}
            </span>
          </li>
        ))}
      </ul>

      {/* La contrepartie du socle : ce qui, lui, varie. Elle annonce les quatre
          familles du comparatif sans avoir à les titrer, et remplace la
          transition rédigée qui traînait auparavant sous le bloc.

          Plus de filet au-dessus, et plus de `mt-auto` non plus : les deux
          allaient ensemble et se trompaient ensemble. Ce bloc reçoit sa
          hauteur de son voisin, pas de son contenu, donc il a du mou à placer.
          `mt-auto` le poussait en entier juste avant cette ligne, et le filet
          se retrouvait à une distance qui changeait avec la largeur de
          l'écran. Le mou est maintenant absorbé par la liste elle-même, dont
          les puces s'écartent pour occuper la hauteur. L'écart au-dessus de
          cette ligne devient fixe, il respire pareil partout, et un trait n'a
          plus rien à y séparer. */}
      <p className="pt-[clamp(1.75rem,3vw,2.5rem)] text-[0.82rem] leading-relaxed text-white/50">
        {typo(
          "Ce qui varie d'une offre à l'autre : la relation, le budget, la production et le périmètre.",
        )}
      </p>
    </section>
  );
}
