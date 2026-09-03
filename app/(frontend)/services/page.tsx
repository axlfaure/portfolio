import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Identité visuelle, supports de salon, sites web, automatisation, 3D et photo pour les structures de la recherche, de l'innovation et de l'industrie. Grenoble et Auvergne-Rhône-Alpes.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: service.title,
      url: `${site.url}/services/${service.slug}`,
    })),
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD généré côté serveur. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-site pb-[var(--section-y)] pt-[clamp(3rem,7vw,4.5rem)]">
        <SectionHeader
          eyebrow="Services"
          title={
            <>
              Six leviers.{" "}
              <em className="accent hl hl--scroll">Un seul interlocuteur.</em>
            </>
          }
          lead="Chaque service a sa page : ce qu'il couvre, comment il se déroule, ce que vous récupérez à la fin, et à partir de quel budget."
        />

        <div className="mt-[clamp(3rem,7vw,4.5rem)] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard
              key={service.slug}
              service={service}
              variant="carte"
              as="h2"
              index={i}
            />
          ))}
        </div>
      </div>

      <FinalCta />
    </>
  );
}
