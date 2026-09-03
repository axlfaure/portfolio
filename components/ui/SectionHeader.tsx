import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Variante sur fond sombre. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * En-tête de section unifié : eyebrow, titre et chapô.
 *
 * Le titre est masqué par `.rise` et monte quand la section entre dans le
 * champ — le même geste que le titre du hero, déclenché au scroll au lieu
 * d'un délai fixe.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  tone = "light",
  className,
}: Props) {
  const dark = tone === "dark";

  return (
    <div className={className} data-reveal>
      <p className={cn("eyebrow", dark && "text-white/65")}>{eyebrow}</p>

      <h2 className={cn("h2 mt-5 max-w-[22ch]", dark && "text-white")}>
        <span className="rise">
          <span>{title}</span>
        </span>
      </h2>

      {lead && (
        <p className={cn("lead mt-5", dark && "text-white/65")}>{lead}</p>
      )}
    </div>
  );
}
