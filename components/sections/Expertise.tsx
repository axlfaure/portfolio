import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { typo } from "@/lib/typo";

/**
 * VERSION A — la démonstration par le brief.
 *
 * La section doit faire passer d'exécutant à spécialiste. Le piège serait de
 * l'affirmer : « je suis spécialisé », personne ne le croit sur parole, et
 * c'est exactement le registre que le reste du site évite.
 *
 * On le démontre donc, par une chose que le visiteur peut vérifier lui-même :
 * la longueur du brief qu'il aura à écrire. Le document de gauche est celui
 * qu'il connaît, celui qu'il a déjà rédigé pour un prestataire à qui il fallait
 * tout apprendre. Celui de droite tient en trois lignes. L'écart entre les deux
 * est l'argument, et il se lit sans lire une phrase.
 *
 * Rien n'est dit d'un concurrent nommé : le contraste porte sur la situation,
 * « quand personne ne connaît le domaine », pas sur des gens.
 */

/** Le brief tel qu'il faut l'écrire quand l'interlocuteur découvre le sujet. */
const BRIEF_LONG = [
  "Contexte : nous sommes un laboratoire de micro-électronique.",
  "Un MEMS est un micro-système électromécanique. Concrètement…",
  "Notre démonstrateur est au TRL 5, ce qui signifie que…",
  "Le projet est financé par un consortium européen, donc il faut…",
  "Non, l'échelle n'est pas celle-là, un micron c'est…",
  "Le schéma est inversé : l'étape de dépôt vient avant la gravure.",
  "Cette couleur laisse entendre un résultat qu'on n'a pas encore.",
  "Je vous renvoie la publication, page 4, figure 2.",
  "Il faudrait reprendre la légende, ce terme n'existe pas.",
  "Le logo du consortium doit être au même niveau que le nôtre.",
  "On repart du schéma d'origine, celui-ci ne dit pas la bonne chose.",
];

/** Celui qui suffit ici. */
const BRIEF_COURT = [
  "Un stand de 4 m pour le salon de juin.",
  "Sujet : notre procédé de dépôt basse température.",
  "Voici la dernière publication et deux photos de labo.",
];

/**
 * Ce que la connaissance du domaine change, une fois le brief écrit.
 *
 * Quatre points, et pas six : chacun doit pouvoir être vérifié par le
 * visiteur contre sa propre expérience. Un cinquième argument moins solide
 * affaiblirait les quatre autres.
 */
const APPORTS = [
  {
    icon: "exchange" as const,
    titre: "Le vocabulaire",
    corps:
      "MEMS, TRL, démonstrateur, work package, livrable, consortium. Ce sont des mots de travail, pas du jargon à traduire en réunion.",
  },
  {
    icon: "check" as const,
    titre: "L'erreur qui compte",
    corps:
      "Sur un visuel scientifique, la faute n'est pas esthétique, elle est factuelle : une échelle fausse, deux étapes inversées, une couleur qui affirme ce que vos résultats ne disent pas encore. C'est celle-là que je cherche.",
  },
  {
    icon: "layers" as const,
    titre: "Les codes du secteur",
    corps:
      "Un stand qui tient debout à côté de celui d'un grand groupe. Les mentions de financement, la hiérarchie des logos d'un consortium, ce qu'un jury attend de voir en premier.",
  },
  {
    icon: "users" as const,
    titre: "La ligne directe",
    corps:
      "Votre ingénieur explique une fois, à la personne qui dessinera. Pas à un chef de projet qui relaiera, ni à un studio qui redemandera la semaine suivante.",
  },
];

function Document({
  intitule,
  lignes,
  attenue = false,
}: {
  intitule: string;
  lignes: string[];
  attenue?: boolean;
}) {
  return (
    <div
      className={
        attenue
          ? "rounded-card border border-line bg-paper p-6 md:p-7"
          : "rounded-card border border-ink/12 bg-surface p-6 shadow-e1 md:p-7"
      }
    >
      <p className="eyebrow">{intitule}</p>

      <ul className="mt-5 space-y-2.5">
        {lignes.map((ligne) => (
          <li
            key={ligne}
            className={
              attenue
                ? "flex gap-3 text-[0.85rem] leading-relaxed text-label"
                : "flex gap-3 text-[0.95rem] leading-relaxed text-ink-2"
            }
          >
            <span
              aria-hidden="true"
              className={
                attenue
                  ? "mt-[0.55em] h-px w-3 shrink-0 bg-line-2"
                  : "mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              }
            />
            <span>{typo(ligne)}</span>
          </li>
        ))}
      </ul>

      {attenue && (
        <p className="mt-6 border-t border-line pt-4 text-[0.8rem] leading-relaxed text-faint">
          … et les quatre réunions qui vont avec.
        </p>
      )}
    </div>
  );
}

export function Expertise() {
  return (
    <section className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow="Pourquoi un spécialiste"
          title={
            <AccentTitle
              start="Ce que vous n'aurez pas"
              accent="à m'expliquer."
            />
          }
          lead="Un prestataire facture des heures de production. Ce qu'il ne facture pas, mais que vous payez quand même, ce sont les réunions où vous lui apprenez votre métier, les allers-retours sur un schéma faux, et la relecture que personne d'autre que vous ne peut faire."
        />

        {/* Les deux briefs, côte à côte. L'écart de longueur est l'argument :
            il se voit avant qu'on ait lu une ligne. Sur écran étroit ils
            s'empilent, et l'ordre compte — le long d'abord, sinon la chute
            n'en est plus une. */}
        <div
          data-reveal
          className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8"
        >
          <Document
            intitule="Le brief quand personne ne connaît le domaine"
            lignes={BRIEF_LONG}
            attenue
          />
          <div className="lg:sticky lg:top-28">
            <Document intitule="Le brief qu'il me faut" lignes={BRIEF_COURT} />
            <p className="mt-5 pl-1 text-[0.9rem] leading-relaxed text-muted">
              {typo(
                "Le reste, je le trouve dans votre publication et je vous le fais valider. C'est mon travail, pas le vôtre.",
              )}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {APPORTS.map((apport, i) => (
            <div
              key={apport.titre}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              className="border-t border-line pt-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-line bg-surface text-ink-2">
                <FeatureIcon name={apport.icon} />
              </span>
              <h3 className="mt-5 text-[1rem] font-bold tracking-[-0.02em] text-ink">
                {apport.titre}
              </h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                {typo(apport.corps)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
