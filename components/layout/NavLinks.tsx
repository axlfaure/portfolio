"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/cn";
import type { NavService } from "@/lib/nav";
import { navLinks } from "@/lib/site";

/**
 * Liens de la nav, avec indication de la section courante et panneau
 * déroulant sur « Services ».
 *
 * L'observateur ne tourne que sur la home, seule page à sections ancrées :
 * les liens sans `#` en sont exclus, ils désignent des pages entières.
 */
export function NavLinks({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);

  // La section observée ne vaut que sur la home ; ailleurs on n'écrit rien
  // dans l'état, on le neutralise au rendu.
  const active = pathname === "/" ? section : null;

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navLinks
      .filter((link) => link.href.includes("#"))
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
        setSection(first ? `/#${first.id}` : null);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden items-center justify-center gap-8 nav:flex"
    >
      {navLinks.map((link) => {
        const current =
          active === link.href ||
          (link.href === "/"
            ? pathname === "/"
            : !link.href.includes("#") && pathname.startsWith(link.href));

        if ("menu" in link && link.menu === "services") {
          return (
            <ServicesMenu
              key={link.href}
              href={link.href}
              label={link.label}
              current={current}
              services={services}
            />
          );
        }

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

/** Délai de fermeture : traverser les 12px entre le lien et le panneau ne doit pas le refermer. */
const CLOSE_DELAY = 140;

function ServicesMenu({
  href,
  label,
  current,
  services,
}: {
  href: string;
  label: string;
  current: boolean;
  services: NavService[];
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };

  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Échap referme, et le focus qui sort du groupe aussi : le panneau
  // s'ouvre au clavier comme à la souris.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      wrapRef.current?.querySelector<HTMLElement>("a")?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <Link
        href={href}
        aria-expanded={open}
        aria-current={current ? "true" : undefined}
        className={cn(
          "flex items-center gap-1.5 text-[0.9rem] font-medium transition-colors duration-200 hover:text-ink",
          current || open ? "text-ink" : "text-muted",
        )}
      >
        {label}
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "mt-px transition-transform duration-300 ease-expo",
            open && "rotate-180",
          )}
        >
          <path d="m2 3.75 3 3 3-3" />
        </svg>
      </Link>

      {/* Le padding porte la zone de survol : sans lui, le curseur traverse
          un vide entre le lien et le panneau et le menu se referme. */}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 pt-4",
          "transition-[opacity,translate] duration-300 ease-expo",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1.5 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-card border border-line bg-surface shadow-e2">
          <ul className="grid grid-cols-2 gap-px bg-line">
            {services.map((service, i) => (
              <li key={service.slug} className="bg-surface">
                <Link
                  href={`/services/${service.slug}`}
                  tabIndex={open ? undefined : -1}
                  onClick={() => setOpen(false)}
                  style={{
                    transitionDelay: open ? `${60 + i * 35}ms` : "0ms",
                  }}
                  className={cn(
                    "group/item flex h-full items-start gap-3.5 p-4 transition-[background-color,opacity,translate] duration-300 ease-expo hover:bg-paper",
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0",
                  )}
                >
                  <span className="mt-px grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-paper text-ink-2 transition-colors duration-200 group-hover/item:border-line-2 group-hover/item:bg-surface">
                    <ServiceIcon name={service.icon} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-bold leading-snug text-ink">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-[0.8rem] leading-snug text-label">
                      {service.short}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
