"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/site";

/**
 * Liens de la nav, avec indication de la section courante.
 * L'observateur ne tourne que sur la home, seule page à sections ancrées.
 */
export function NavLinks() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const sections = navLinks
      .map((link) => document.querySelector(link.href.replace("/", "")))
      .filter((el): el is Element => Boolean(el));
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = sections.find((s) => visible.has(s.id));
        setActive(first ? `/#${first.id}` : null);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden items-center gap-7 nav:flex"
    >
      {navLinks.map((link) => {
        const current = active === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "true" : undefined}
            className={cn(
              "text-[0.9rem] font-medium transition-colors duration-200 hover:text-ink",
              current ? "text-ink" : "text-muted",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
