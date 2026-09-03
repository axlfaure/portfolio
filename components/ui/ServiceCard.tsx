import Link from "next/link";
import { ArrowDiag } from "@/components/ui/ArrowDiag";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/cn";
import type { Service } from "@/lib/content";

type Props = {
  service: Service;
  /** `trame` : cellule d'une grille à filets. `carte` : carte détachée. */
  variant?: "trame" | "carte";
  /** Niveau du titre : h2 sur la page services, h3 sur la home. */
  as?: "h2" | "h3";
  index?: number;
};

/**
 * Carte service, partagée par la section de la home et la page /services.
 * Seul l'habillage change entre les deux ; le contenu est identique.
 */
export function ServiceCard({
  service,
  variant = "trame",
  as: Heading = "h3",
  index = 0,
}: Props) {
  const detached = variant === "carte";

  const card = (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex h-full flex-col bg-surface p-6",
        detached
          ? "rounded-card border border-line shadow-e1 transition-[translate,box-shadow] duration-200 ease-site hover:-translate-y-0.5 hover:shadow-e2"
          : "transition-colors duration-200 hover:bg-paper",
      )}
    >
      <span className="grid h-10 w-10 place-items-center rounded-[11px] border border-line bg-paper text-ink-2 transition-colors duration-200 group-hover:border-line-2 group-hover:bg-surface">
        <ServiceIcon name={service.icon} />
      </span>

      <Heading className="mt-5 text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
        {service.title}
      </Heading>

      <p className="mt-2 flex-1 text-[0.925rem] leading-relaxed text-muted">
        {service.short}
      </p>

      <span className="mt-7 flex items-center justify-between gap-4">
        <span className="text-[0.87rem] font-semibold text-ink">
          {service.pricing.from
            ? `à partir de ${service.pricing.from}`
            : "Voir le détail"}
        </span>
        <ArrowDiag size={15} className="arrow-diag text-ink-2" />
      </span>
    </Link>
  );

  if (!detached) return card;

  return (
    <div
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties
      }
    >
      {card}
    </div>
  );
}
