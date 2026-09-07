import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { getServices, getServicesSection } from "@/lib/content";

export async function Services() {
  const services = await getServices();
  const tete = await getServicesSection();

  return (
    <section id="services" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow={tete?.eyebrow ?? "Services"}
          title={
            <AccentTitle
              start={tete?.titleStart ?? "Six leviers."}
              accent={tete?.titleAccent ?? "Un seul interlocuteur."}
              end={tete?.titleEnd}
            />
          }
        />

        {/* Grille tramée : un seul bloc, filets de 1px, aucune carte flottante. */}
        <div
          data-reveal
          className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
