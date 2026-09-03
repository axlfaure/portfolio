import { Rise } from "@/components/ui/Rise";
import { Media } from "@/components/ui/Media";
import { site } from "@/lib/site";

/** Repères factuels, tous tirés de chiffres déjà affichés ailleurs sur le site. */
const facts = [
  { value: "Grenoble", label: "Isère, Auvergne-Rhône-Alpes" },
  { value: "5 ans", label: "dans la tech et l'industrie" },
  { value: "+30", label: "structures accompagnées" },
  { value: "24 h", label: "de délai de réponse" },
];

export function About() {
  return (
    <section id="a-propos" className="section scroll-mt-24">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:gap-16">
        <div data-reveal>
          <Media
            src={site.portrait}
            alt="Portrait d'Axel Faure"
            ratio="4 / 5"
            sizes="(min-width: 64rem) 28rem, 92vw"
            className="rounded-project"
          />
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
        >
          <p className="eyebrow">À propos</p>

          <h2 className="h2 mt-5 max-w-[18ch]">
            <Rise>
              Vous parlez directement à{" "}
              <em className="accent hl hl--scroll">la personne qui produit.</em>
            </Rise>
          </h2>

          <div className="mt-8 max-w-[42rem] space-y-5">
            <p className="text-muted">
              Je ne prétends pas être ingénieur. En revanche je sais poser les
              questions qui font sortir l&apos;essentiel, et arbitrer entre ce
              qui doit être montré et ce qui peut attendre. C&apos;est ce que je
              fais depuis cinq ans avec des chercheurs et des ingénieurs.
            </p>
            <p className="text-muted">
              Pas d&apos;équipe à briefer, pas d&apos;intermédiaire à qui
              réexpliquer votre métier. C&apos;est ce qui permet de tenir des
              délais courts sans que la cohérence en pâtisse — et de vous dire
              non quand un délai n&apos;est pas tenable, plutôt que de livrer en
              retard.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.value}>
                <dt className="font-mono text-[1.05rem] font-bold leading-none tracking-[-0.02em] text-ink">
                  {fact.value}
                </dt>
                <dd className="mt-2.5 text-[0.8rem] leading-snug text-muted">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="accent mt-9 text-[1.5rem] leading-none text-ink-2">
            {site.name}
          </p>
        </div>
      </div>
    </section>
  );
}
