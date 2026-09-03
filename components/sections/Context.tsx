import { ContextInbox } from "@/components/ui/ContextInbox";
import { FeatureIcon, type FeatureIconName } from "@/components/ui/FeatureIcon";
import { Avatar } from "@/components/ui/Media";
import { Rise } from "@/components/ui/Rise";
import { site } from "@/lib/site";

/**
 * Les trois régimes de la charge, dans l'ordre où on les subit.
 *
 * Chacun est la lecture d'une partie de la boîte de réception affichée à
 * droite : la multiplicité des expéditeurs, l'écart de langage entre les
 * chercheurs et les prestataires, puis la pression de l'échéance. Le texte et
 * le visuel doivent se répondre, sinon le visuel n'est qu'une illustration.
 *
 * Les pictogrammes restent gris : le bleu est réservé à ce qui résout, du
 * surlignage du titre jusqu'au message d'Axel dans la boîte.
 */
const strains: { icon: FeatureIconName; lead: string; line: string }[] = [
  {
    icon: "users",
    lead: "Tout converge vers vous.",
    line: "Un imprimeur, un studio, un organisateur et trois chercheurs qui écrivent le même matin, pour un seul salon.",
  },
  {
    icon: "exchange",
    lead: "Personne ne parle le même langage.",
    line: "Les experts veulent tout montrer, les prestataires ne comprennent pas la techno. Entre les deux, c'est vous qui traduisez.",
  },
  {
    icon: "clock",
    lead: "La date du salon ne bouge pas.",
    line: "Le budget se resserre, les fichiers arrivent mal nommés, et il faut livrer quand même.",
  },
];

export function Context() {
  return (
    <section className="section">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">Le contexte</p>

          <h2 className="h2 mt-5 max-w-[22ch]">
            <Rise>
              Vous êtes{" "}
              <em className="accent hl hl--scroll">seul, ou trop peu,</em> à
              porter la communication de votre structure.
            </Rise>
          </h2>

          <p className="mt-7 max-w-[38rem] text-muted">
            Vous couvrez l&apos;événementiel, le web, les réseaux, le print et
            parfois la presse. Personne en interne ne sait faire de création :
            tout finit par remonter à vous.
          </p>

          <ul className="mt-9 max-w-[38rem] space-y-6">
            {strains.map((strain) => (
              <li key={strain.lead} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sunk text-ink-2"
                >
                  <FeatureIcon name={strain.icon} size={19} />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">
                    {strain.lead}
                  </strong>{" "}
                  {strain.line}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
        >
          {/* `Avatar` lit le disque pour basculer sur la vraie photo : c'est un
              composant serveur, il est donc construit ici et passé en enfant à
              la boîte de réception, qui est cliente. */}
          <ContextInbox
            portrait={
              <Avatar
                src={site.portrait}
                alt="Portrait d'Axel Faure"
                size={34}
                initials="AF"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}
