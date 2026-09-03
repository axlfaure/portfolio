import { cn } from "@/lib/cn";

/**
 * Flèche diagonale descendante, tracée au trait.
 * Purement décorative : le libellé qui l'accompagne porte le sens.
 */
export function ArrowDiag({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={cn("shrink-0", className)}
    >
      <path d="M4.4 4.4 13.6 13.6" />
      <path d="M13.6 6.1v7.5H6.1" />
    </svg>
  );
}
