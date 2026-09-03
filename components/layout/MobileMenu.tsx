"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { NavService } from "@/lib/nav";
import { navLinks } from "@/lib/site";

/** Menu plein écran sous 56rem. */
export function MobileMenu({ services }: { services: NavService[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="nav:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface shadow-e1"
      >
        <span className="relative block h-3 w-4">
          <span
            className="absolute left-0 block h-px w-4 bg-ink transition-transform duration-200 ease-site"
            style={{
              top: open ? 6 : 2,
              transform: open ? "rotate(45deg)" : "none",
            }}
          />
          <span
            className="absolute left-0 block h-px w-4 bg-ink transition-transform duration-200 ease-site"
            style={{
              top: open ? 6 : 10,
              transform: open ? "rotate(-45deg)" : "none",
            }}
          />
        </span>
      </button>

      {open && (
        <div
          id="menu-mobile"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col justify-between gap-8 overflow-y-auto bg-paper px-[var(--gutter)] pb-12 pt-10"
        >
          <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-2xl font-bold tracking-[-0.03em] text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Les services en accès direct : la nav de bureau les déroule,
              le menu mobile les liste. */}
          <div>
            <p className="eyebrow">Services</p>
            <ul className="mt-4 grid gap-px overflow-hidden rounded-card border border-line bg-line">
              {services.map((service) => (
                <li key={service.slug} className="bg-surface">
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-paper text-ink-2">
                      <ServiceIcon name={service.icon} />
                    </span>
                    <span className="text-[0.92rem] font-semibold text-ink">
                      {service.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <CtaButton variant="compact" className="self-start" />
        </div>
      )}
    </div>
  );
}
