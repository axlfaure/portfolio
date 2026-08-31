import { cn } from "@/lib/cn";

/** Pastille verte de disponibilité, halo pulsé toutes les 2,4 s. */
export function Dot({
  size = 6,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 rounded-full bg-success", className)}
      style={{
        width: size,
        height: size,
        animation: "dot-pulse 2.4s var(--ease-site) infinite",
      }}
    />
  );
}
