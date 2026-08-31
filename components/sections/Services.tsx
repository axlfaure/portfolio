import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Service } from "@/lib/data";
import { services } from "@/lib/data";

/** Icônes SVG inline, trait 1,6px, 18px. Aucune librairie d'icônes. */
function Icon({ name }: { name: Service["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "identity":
      return (
        <svg {...common}>
          <path d="M12 2.6 20 7v10l-8 4.4L4 17V7z" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      );
    case "print":
      return (
        <svg {...common}>
          <path d="M7 9V3h10v6" />
          <rect x="3.5" y="9" width="17" height="7.5" rx="1.6" />
          <path d="M7 14h10v7H7z" />
        </svg>
      );
    case "web":
      return (
        <svg {...common}>
          <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="2" />
          <path d="M2.8 9h18.4" />
          <path d="M6.2 6.6h.01M8.8 6.6h.01M11.4 6.6h.01" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <path d="M4 7h7M4 12h5M4 17h7" />
          <path d="M15.5 4.5 20 12l-4.5 7.5" />
          <circle cx="20" cy="12" r="1.4" />
        </svg>
      );
    case "motion":
      return (
        <svg {...common}>
          <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z" />
          <path d="M3.5 7 12 11.6 20.5 7M12 11.6v9.6" />
        </svg>
      );
    case "photo":
      return (
        <svg {...common}>
          <path d="M3.2 8.2A2 2 0 0 1 5.2 6.2h2l1.4-2h6.8l1.4 2h2a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z" />
          <circle cx="12" cy="12.6" r="3.4" />
        </svg>
      );
  }
}

export function Services() {
  const core = services.filter((s) => s.tier === "Cœur de métier").length;

  return (
    <section id="services" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          index="03"
          eyebrow="Services"
          meta={`${core} au cœur · ${services.length - core} en complément`}
          title="Six leviers. Un seul interlocuteur."
        />

        {/* Grille tramée : un seul bloc, filets de 1px, aucune carte flottante. */}
        <div
          data-reveal
          className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <article
              key={service.title}
              className="group flex flex-col bg-surface p-6 transition-colors duration-200 hover:bg-paper"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-[11px] border border-line bg-paper text-ink-2 transition-colors duration-200 group-hover:border-line-2 group-hover:bg-surface">
                  <Icon name={service.icon} />
                </span>
                <span className="eyebrow pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-[0.925rem] leading-relaxed text-muted">
                {service.description}
              </p>

              <p className="eyebrow mt-6 border-t border-line pt-4">
                {service.tier}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
