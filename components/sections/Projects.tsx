import { Rise } from "@/components/ui/Rise";
import Link from "next/link";
import { ArrowDiag } from "@/components/ui/ArrowDiag";
import { GhostButton } from "@/components/ui/GhostButton";
import { Avatar, Media } from "@/components/ui/Media";
import { ProjectBento } from "@/components/ui/ProjectBento";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stars } from "@/components/ui/Stars";
import { Ticker } from "@/components/ui/Ticker";
import {
  getFeaturedProjects,
  getProjects,
  getTestimonials,
} from "@/lib/content";

export async function Projects() {
  const featuredProjects = await getFeaturedProjects();
  const projectTiles = await getProjects();
  // Chargés une fois puis retrouvés en mémoire : les résoudre dans la boucle
  // demanderait un `await` dans un `map`, qui n est pas asynchrone.
  const testimonials = await getTestimonials();

  return (
    <section id="projets" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow="Projets"
          title={
            <>
              Vos innovations méritent d&apos;être{" "}
              <em className="accent hl hl--scroll">
                comprises à leur juste valeur.
              </em>
            </>
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
          {featuredProjects.map((project, i) => {
            const vouch = testimonials.find(
              (t) => t.slug === project.testimonial,
            );

            return (
              <div
                key={project.slug}
                data-reveal
                className="sticky"
                style={{
                  top: `${5.5 + i}rem`,
                  marginBottom: i < featuredProjects.length - 1 ? "1.75rem" : 0,
                }}
              >
                <Link
                  href={`/projets/${project.slug}`}
                  className="group block overflow-hidden rounded-project border border-line bg-surface shadow-e1 transition-shadow duration-200 ease-site hover:shadow-e2"
                >
                  <div className="flex flex-col gap-6 p-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-stretch md:gap-8 md:p-7">
                    {/* Pas de `h-full` sur le visuel : la colonne est étirée
                        par le texte, et entre 768 et 1100 px son cadre devient
                        portrait. Un visuel en 4/3 y perdait jusqu'à la moitié
                        de sa largeur au recadrage. Le ratio prime, quitte à
                        laisser un peu d'air sous l'image. */}
                    <div className="order-1 md:order-2">
                      {project.panels.length > 0 ? (
                        <ProjectBento
                          panels={project.panels}
                          alt={`${project.client}, ${project.title}`}
                          sizes="(min-width: 56rem) 18rem, 46vw"
                        />
                      ) : (
                        <Media
                          src={project.cover}
                          alt={`${project.client} — ${project.title}`}
                          ratio="4 / 3"
                          sizes="(min-width: 56rem) 36rem, 92vw"
                          className="rounded-[12px]"
                        />
                      )}
                    </div>

                    {/* Deux blocs, l'espace libre entre les deux : le bas de
                        colonne reste ancré même quand l'accroche est courte. */}
                    <div className="order-2 flex flex-col justify-between gap-9 md:order-1 md:py-2">
                      <div>
                        <p className="eyebrow">{project.client}</p>
                        <h3 className="h3 mt-4">{project.title}</h3>
                        {project.teaser ? (
                          <p className="prose-p mt-3 text-[0.95rem]">
                            {project.teaser}
                          </p>
                        ) : null}

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
                      </div>

                      {/* Bas de colonne : qui valide le projet, puis où aller. */}
                      <div className="border-t border-line pt-6">
                        {vouch ? (
                          <figure className="flex items-center gap-3">
                            <Avatar
                              src={vouch.avatar}
                              alt=""
                              size={42}
                              initials={vouch.name.slice(0, 1)}
                              className="shrink-0"
                            />
                            <figcaption className="min-w-0">
                              <div className="flex items-center gap-2.5">
                                <p className="truncate text-[0.85rem] font-bold text-ink">
                                  {vouch.name}
                                </p>
                                <span className="shrink-0">
                                  <Stars rating={vouch.rating} size={12} />
                                </span>
                              </div>
                              <p className="mt-0.5 text-[0.78rem] leading-snug text-label">
                                {vouch.role} · {vouch.org}
                              </p>
                            </figcaption>
                          </figure>
                        ) : null}

                        <span className="mt-6 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-ink">
                          Voir le projet
                          <ArrowDiag size={16} className="arrow-diag" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bande d'appel : les visuels portent l'ambiance, le texte porte l'action. */}
      <div className="relative isolate mt-[clamp(3.5rem,7vw,5rem)] overflow-hidden py-[clamp(7rem,15vw,10rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center"
        >
          <Ticker
            duration={70}
            gap={1.1}
            className="w-full opacity-[0.55] [filter:grayscale(1)]"
            items={projectTiles.map((tile) => (
              <div
                key={tile.slug}
                className="w-[clamp(9.5rem,16vw,13rem)] overflow-hidden rounded-project"
              >
                <Media
                  src={tile.cover}
                  alt=""
                  ratio="2 / 3"
                  sizes="13rem"
                  className="rounded-project"
                />
              </div>
            ))}
          />
        </div>

        {/* Voile : sans lui le titre passerait sur des visuels contrastés. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-veil-projets"
        />

        <div
          className="container-site relative flex flex-col items-center text-center"
          data-reveal
        >
          <h2 className="h2 max-w-[18ch]">
            <Rise>
              Le reste du travail est{" "}
              <em className="accent hl hl--scroll">juste là.</em>
            </Rise>
          </h2>
          <GhostButton href="/projets" size="lg" className="mt-9">
            Voir tous les projets
          </GhostButton>
        </div>
      </div>
    </section>
  );
}
