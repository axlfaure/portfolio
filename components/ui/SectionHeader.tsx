import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Index éditorial, ex. "02". */
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Métadonnée alignée à droite du filet, en mono. */
  meta?: string;
  /** Variante sur fond sombre. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * En-tête de section unifié : filet, index mono, eyebrow, métadonnée à droite,
 * puis titre et chapô. Donne le même point de départ à toutes les sections.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  meta,
  tone = "light",
  className,
}: Props) {
  const dark = tone === "dark";

  return (
    <div className={className} data-reveal>
      <div className={cn("h-px w-full", dark ? "bg-white/15" : "bg-line")} />

      <div className="flex items-baseline justify-between gap-6 pt-4">
        <p
          className={cn(
            "eyebrow flex items-baseline gap-3",
            dark && "text-white/65",
          )}
        >
          <span className={dark ? "text-white/75" : "text-ink-2"}>{index}</span>
          <span>{eyebrow}</span>
        </p>
        {meta && (
          <p className={cn("eyebrow hidden shrink-0 sm:block", dark && "text-white/60")}>
            {meta}
          </p>
        )}
      </div>

      <h2 className={cn("h2 mt-6 max-w-[22ch]", dark && "text-white")}>
        {title}
      </h2>

      {lead && (
        <p className={cn("lead mt-5", dark && "text-white/65")}>{lead}</p>
      )}
    </div>
  );
}

/** Repères d'angle : quatre croix fines, comme des traits de coupe. */
export function CornerTicks({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none", className)}>
      {[
        "left-0 top-0",
        "right-0 top-0",
        "left-0 bottom-0",
        "right-0 bottom-0",
      ].map((pos) => (
        <span
          key={pos}
          className={cn("absolute block h-[9px] w-[9px]", pos)}
          style={{
            backgroundImage:
              "linear-gradient(var(--color-line-2), var(--color-line-2)), linear-gradient(var(--color-line-2), var(--color-line-2))",
            backgroundSize: "100% 1px, 1px 100%",
            backgroundPosition: "center, center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
    </span>
  );
}
