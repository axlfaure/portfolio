"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * En-tête collant, transparent au-dessus du hero puis translucide dès que
 * la page défile — pour que la nav reste lisible sur le contenu.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-[color-mix(in_srgb,var(--color-paper)_78%,transparent)] backdrop-blur-[14px]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
