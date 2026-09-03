import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getServices } from "@/lib/content";

export async function Services() {
  const services = await getServices();

  return (
    <section id="services" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow="Services"
          title={
            <>
              Six leviers.{" "}
              <em className="accent hl hl--scroll">Un seul interlocuteur.</em>
            </>
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
