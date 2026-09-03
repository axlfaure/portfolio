import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/Mdx";
import { FinalCta } from "@/components/sections/FinalCta";
import { ArrowDiag } from "@/components/ui/ArrowDiag";
import { CtaButton } from "@/components/ui/CtaButton";
import { DeliverableIcon, FeatureIcon } from "@/components/ui/FeatureIcon";
import { Avatar, Media } from "@/components/ui/Media";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Rise } from "@/components/ui/Rise";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { Service } from "@/lib/content";
import { getService, getServiceProjects, getServices } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.metaTitle} · ${site.name}`,
      description: service.metaDescription,
      type: "website",
      url: `/services/${service.slug}`,
    },
  };
}

/**
 * Données structurées : `Service` pour la prestation, `FAQPage` pour les
 * questions. Les deux sont éligibles aux résultats enrichis de Google, à
 * condition que le contenu soit réellement visible sur la page — c'est le cas.
 */
function structuredData(service: Service) {
  const url = `${site.url}/services/${service.slug}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.heading,
      description: service.metaDescription,
      serviceType: service.title,
      url,
      provider: {
        "@type": "ProfessionalService",
        name: site.brand,
        url: site.url,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: "Auvergne-Rhône-Alpes",
          addressCountry: "FR",
        },
      },
      areaServed: [
        { "@type": "City", name: "Grenoble" },
        { "@type": "AdministrativeArea", name: "Isère" },
        { "@type": "AdministrativeArea", name: "Auvergne-Rhône-Alpes" },
      ],
      ...(service.pricing.from
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: service.pricing.from.replace(/[^\d]/g, ""),
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: service.pricing.from.replace(/[^\d]/g, ""),
                priceCurrency: "EUR",
              },
            },
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${site.url}/services`,
        },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ],
    },
  ];

  if (service.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: service.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Espacement et filet communs à toutes les sections de la page. */
const SECTION =
  "mt-[clamp(3.5rem,8vw,5.5rem)] border-t border-line pt-[clamp(2.5rem,6vw,4rem)]";

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const projects = getServiceProjects(service.slug);
  const others = getServices().filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD généré côté serveur. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(service)),
        }}
      />

      <article className="container-site pt-[clamp(2rem,5vw,3rem)]">
        <Breadcrumb
          trail={[
            { href: "/", label: "Accueil" },
            { href: "/services", label: "Services" },
          ]}
          current={service.title}
        />

        {/* 2 — En-tête : la promesse à gauche, l'action et les repères à droite */}
        <header
          className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:items-end lg:gap-16"
          data-reveal
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[12px] border border-line bg-surface text-ink-2">
                <ServiceIcon name={service.icon} />
              </span>
              <p className="eyebrow">{service.tier}</p>
            </div>

            <h1 className="h1 mt-7 max-w-[19ch]">{service.heading}</h1>
            <p className="lead mt-6">{service.lead}</p>
          </div>

          <div className="lg:pb-2">
            <CtaButton
              avatar={
                <Avatar
                  src={site.portrait}
                  alt="Portrait d'Axel Faure"
                  size={48}
                  initials="AF"
                />
              }
            />

            <dl className="mt-8 space-y-4 border-t border-line pt-6">
              <Fact label="Budget">
                {service.pricing.from
                  ? `à partir de ${service.pricing.from}`
                  : "sur devis"}
              </Fact>
              <Fact label="Réponse">sous 24 h</Fact>
              <Fact label="Délais">{service.duration || "à définir"}</Fact>
            </dl>

            <p className="mt-5 text-[0.8rem] leading-snug text-label">
              {service.pricing.range ||
                "Les projets démarrent à partir de 3 000 €. Le périmètre exact se fixe pendant l'échange."}
            </p>
          </div>
        </header>

        {/* 3 — Mise en perspective, adossée à un visuel */}
        {service.body && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">Le contexte</p>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-16">
              <Media
                src={`/services/${service.slug}/contexte.jpg`}
                alt=""
                ratio="4 / 5"
                sizes="(min-width: 64rem) 24rem, 92vw"
                className="rounded-project lg:sticky lg:top-28"
              />

              <div>
                <Mdx source={service.body} />
              </div>
            </div>
          </section>
        )}

        {/* 4 — Qualification : le lecteur se reconnaît ou passe son chemin */}
        {service.forWho.length > 0 && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">Pour qui</p>
            <h2 className="h2 mt-5 max-w-[20ch]">
              <Rise>
                Vous êtes au bon endroit{" "}
                <em className="accent hl hl--scroll">
                  si l&apos;un de ces points vous parle.
                </em>
              </Rise>
            </h2>

            <ul className="mt-10 grid max-w-[62rem] gap-x-12 gap-y-5 sm:grid-cols-2">
              {service.forWho.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-[1.35rem] w-[1.35rem] shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-stroke)_18%,transparent)] text-stroke"
                  >
                    <FeatureIcon name="check" size={12} />
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink-2">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 5 — Le process, cœur de la page */}
        {service.process.length > 0 && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">Le déroulé</p>
            <h2 className="h2 mt-5 max-w-[20ch]">
              <Rise>
                Comment ça se passe,{" "}
                <em className="accent hl hl--scroll">étape par étape.</em>
              </Rise>
            </h2>

            <ProcessTimeline steps={service.process} />
          </section>
        )}

        {/* 6 — Livrables, en bento autour d'un visuel */}
        {service.deliverables.length > 0 && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">Livrables</p>
            <h2 className="h2 mt-5 max-w-[20ch]">
              <Rise>
                Ce que vous avez{" "}
                <em className="accent hl hl--scroll">entre les mains.</em>
              </Rise>
            </h2>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="overflow-hidden rounded-card border border-line bg-surface p-3 sm:col-span-2 lg:row-span-2">
                <Media
                  src={service.visual}
                  alt=""
                  ratio="4 / 3"
                  sizes="(min-width: 64rem) 42rem, 92vw"
                  className="h-full rounded-[10px]"
                  label="Visuel du service"
                />
              </div>

              {service.deliverables.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col rounded-card border border-line bg-surface p-5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-paper text-ink-2">
                    <DeliverableIcon name={item.icon} />
                  </span>
                  <h3 className="mt-4 text-[0.95rem] font-bold leading-snug text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7 — Formats d'engagement, avec ce que chacun apporte */}
        {service.engagements.length > 0 && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">Formats d&apos;engagement</p>
            <h2 className="h2 mt-5 max-w-[20ch]">
              <Rise>
                Une mission,{" "}
                <em className="accent hl hl--scroll">ou une présence.</em>
              </Rise>
            </h2>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {service.engagements.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col rounded-card border border-line bg-surface p-6 sm:p-7"
                >
                  <h3 className="text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                    <span className="font-semibold text-ink-2">
                      Le bon choix si :
                    </span>{" "}
                    {item.best}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-line pt-5">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span aria-hidden="true" className="mt-0.5 text-stroke">
                          <FeatureIcon name="check" size={14} />
                        </span>
                        <span className="text-[0.9rem] leading-relaxed text-ink-2">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8 — Preuve : les projets du portfolio qui relèvent de ce service */}
        {projects.length > 0 && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">En pratique</p>
            <h2 className="h2 mt-5 max-w-[20ch]">
              <Rise>
                Des projets{" "}
                <em className="accent hl hl--scroll">déjà livrés.</em>
              </Rise>
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 9 — Questions fréquentes, adossées au JSON-LD FAQPage */}
        {service.faq.length > 0 && (
          <section className={SECTION} data-reveal>
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="h2 mt-5 max-w-[20ch]">
              <Rise>
                Ce qu&apos;on me demande{" "}
                <em className="accent hl hl--scroll">le plus souvent.</em>
              </Rise>
            </h2>

            <div className="mt-10 max-w-[52rem] divide-y divide-line border-t border-line">
              {service.faq.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1rem] font-semibold text-ink">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-label transition-transform duration-200 ease-site group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[44rem] text-[0.95rem] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* 10 — Maillage interne vers les autres services */}
        <section className={SECTION} data-reveal>
          <p className="eyebrow">Les autres services</p>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/services/${other.slug}`}
                  className="group flex h-full items-center justify-between gap-4 bg-surface p-5 transition-colors duration-200 hover:bg-paper"
                >
                  <span>
                    <span className="block text-[0.95rem] font-bold text-ink">
                      {other.title}
                    </span>
                    <span className="mt-1 block text-[0.85rem] leading-snug text-label">
                      {other.short}
                    </span>
                  </span>
                  <ArrowDiag
                    size={15}
                    className="arrow-diag mt-0.5 self-start text-ink-2"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <FinalCta />
    </>
  );
}

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-right text-[0.9rem] font-semibold text-ink">
        {children}
      </dd>
    </div>
  );
}
