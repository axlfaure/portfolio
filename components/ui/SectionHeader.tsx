import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /**
   * Niveau de titre. Une page n'a qu'un `h1`, et c'est celui qui la nomme :
   * sur une page de liste, c'est l'en-tête de la liste, pas un `h2` posé sous
   * un `h1` absent.
   */
  as?: "h1" | "h2";
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
  as: Titre = "h2",
  tone = "light",
  className,
}: Props) {
  const dark = tone === "dark";

  return (
    <div className={className} data-reveal>
      <p className={cn("eyebrow", dark && "text-white/65")}>{eyebrow}</p>

      <Titre className={cn("h2 mt-5 max-w-[22ch]", dark && "text-white")}>
        <span className="rise">
          <span>{title}</span>
        </span>
      </Titre>

      {lead && (
        <p className={cn("lead mt-5", dark && "text-white/65")}>{lead}</p>
      )}
    </div>
  );
}
