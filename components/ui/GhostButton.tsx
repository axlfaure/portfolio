import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Bouton secondaire : même hauteur que le bouton principal en taille `lg`,
 * mais sans fond ni ombre — il ne doit jamais lui disputer l'attention.
 */
export function GhostButton({
  href,
  children,
  size = "sm",
  className,
}: {
  href: string;
  children: ReactNode;
  /** `lg` s'aligne sur la hauteur du bouton principal (3,5rem). */
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-line-2",
        "font-semibold text-ink-2 transition-colors duration-200",
        "hover:border-ink hover:text-ink",
        size === "lg"
          ? "h-14 px-7 text-[0.95rem]"
          : "px-5 py-2.5 text-[0.9rem]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 ease-site group-hover:translate-x-[3px]"
      >
        →
      </span>
    </Link>
  );
}
