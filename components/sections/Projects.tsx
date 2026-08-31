import Link from "next/link";
import { GhostButton } from "@/components/ui/GhostButton";
import { Media } from "@/components/ui/Media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Ticker } from "@/components/ui/Ticker";
import { getFeaturedProjects, getProjects } from "@/lib/content";

export function Projects() {
  const featuredProjects = getFeaturedProjects();
  const projectTiles = getProjects();

  return (
    <section id="projets" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          index="02"
          eyebrow="Projets"
          meta={`${featuredProjects.length} projets phares`}
          title={
            <>Vos innovations méritent d&apos;être comprises à leur juste valeur.</>
          }
          lead={
            <>
              Trop souvent, les meilleures innovations perdent face à ceux qui
              savent mieux se présenter. Je transforme la complexité de votre
              R&amp;D en une image limpide, qui inspire confiance dès le premier
              regard.
            </>
          }
        />

        {/* Stacking cards : sticky pur, tops incrémentaux. */}
        <div className="mt-14">
          {featuredProjects.map((project, i) => (
            <div
              key={project.slug}
              className="sticky"
              style={{
                top: `${5.5 + i}rem`,
                marginBottom: i < featuredProjects.length - 1 ? "1.75rem" : 0,
              }}
            >
              <Link
                href={`/projets/${project.slug}`}
                data-reveal
                className="group block overflow-hidden rounded-project border border-line bg-surface shadow-e1 transition-shadow duration-200 ease-site hover:shadow-e2"
              >
                <div className="flex flex-col gap-6 p-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-stretch md:gap-8 md:p-7">
                  <div className="order-1 md:order-2">
                    <Media
                      src={project.cover}
                      alt={`${project.client} — ${project.title}`}
                      ratio="4 / 3"
                      sizes="(min-width: 56rem) 36rem, 92vw"
                      className="h-full rounded-[12px]"
                    />
                  </div>

                  <div className="order-2 flex flex-col md:order-1 md:py-2">
                    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                      <p className="meta">{project.client}</p>
                      <p className="eyebrow">
                        {String(project.order).padStart(2, "0")}
                      </p>
                    </div>

                    <h3 className="h3 mt-5">{project.title}</h3>
                    <p className="prose-p mt-3 text-[0.95rem]">
                      {project.teaser}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.disciplines.map((d) => (
                        <li
                          key={d}
                          className="rounded-full border border-line bg-paper px-3 py-1 text-[0.75rem] font-medium text-muted"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5 md:mt-8">
                      <span className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-ink">
                        Voir le projet
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 ease-site group-hover:translate-x-[3px]"
                        >
                          →
                        </span>
                      </span>
                      <span className="meta">{project.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker des douze tuiles projet, débordant des gouttières. */}
      <div className="mt-[clamp(3.5rem,7vw,5rem)]">
        <div className="container-site mb-5 flex items-baseline justify-between gap-6" data-reveal>
          <p className="eyebrow">Toutes les réalisations</p>
          <p className="eyebrow">{projectTiles.length} projets</p>
        </div>

        <Ticker
          duration={60}
          gap={1.25}
          items={projectTiles.map((tile) => (
            <Link
              key={tile.slug}
              href={`/projets/${tile.slug}`}
              className="group block w-[15.5rem] overflow-hidden rounded-card border border-line bg-surface p-2.5 shadow-e1 transition-[transform,box-shadow] duration-200 ease-site hover:-translate-y-0.5 hover:shadow-e2"
            >
              <Media
                src={tile.cover}
                alt={`${tile.client} — ${tile.short}`}
                ratio="4 / 3"
                sizes="15.5rem"
                className="rounded-[9px]"
              />
              <div className="px-1 pb-1 pt-3">
                <p className="meta truncate">{tile.client}</p>
                <p className="mt-1.5 truncate text-[0.9rem] font-semibold text-ink">
                  {tile.short}
                </p>
                <p className="mt-1 truncate text-[0.8rem] text-label">
                  {tile.tags}
                </p>
              </div>
            </Link>
          ))}
        />

        <div className="container-site mt-10 flex justify-center" data-reveal>
          <GhostButton href="/projets">Voir tous les projets</GhostButton>
        </div>
      </div>
    </section>
  );
}
