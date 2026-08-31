import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Dot } from "./Dot";

/** Pilule claire : pastille optionnelle + libellé court. */
export function Pill({
  children,
  dot = false,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5",
        "text-[0.8rem] font-medium text-ink-2 shadow-e1",
        className,
      )}
    >
      {dot && <Dot />}
      {children}
    </span>
  );
}
