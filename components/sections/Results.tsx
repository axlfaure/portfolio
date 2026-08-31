import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { results } from "@/lib/data";

/**
 * Seule bande sombre du site. C'est la section preuve : elle doit trancher
 * avec le reste et donner un point d'appui visuel au milieu de la page.
 */
export function Results() {
  return (
    <section
      id="resultats"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "76px 76px",
        }}
      />

      <div className="container-site py-[var(--section-y)]">
        <SectionHeader
          index="04"
          eyebrow="Résultats"
          meta="3 missions"
          tone="dark"
          title="Des chiffres, pas des promesses."
          lead={
            <>
              Trois missions, trois problèmes concrets, et ce qu&apos;elles ont
              changé pour les équipes qui les ont portées.
            </>
          }
        />

        <div className="mt-14 grid md:grid-cols-3">
          {results.map((result, i) => (
            <article
              key={result.client}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className={cn(
                "flex flex-col md:px-7",
                i > 0 &&
                  "mt-10 border-t border-white/15 pt-10 md:mt-0 md:border-l md:border-t-0 md:pt-0",
                i === 0 && "md:pl-0",
                i === results.length - 1 && "md:pr-0",
              )}
            >
              <p className="meta text-white/60">{result.client}</p>
              <h3 className="mt-3 text-[1.05rem] font-bold tracking-[-0.02em] text-white">
                {result.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.925rem] leading-relaxed text-white/60">
                {result.body}
              </p>

              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="num text-[clamp(2.2rem,5vw,3rem)] font-bold leading-none text-white">
                  {result.kpi}
                </p>
                <p className="mt-3 text-[0.85rem] leading-snug text-white/55">
                  {result.kpiLabel}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
