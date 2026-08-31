import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { site } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_srgb,var(--color-paper)_78%,transparent)] backdrop-blur-[14px]">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="text-[0.95rem] font-bold tracking-[-0.02em] text-ink"
        >
          {site.brand}
        </Link>

        <NavLinks />

        <div className="flex items-center gap-2">
          <div className="hidden nav:block">
            <CtaButton variant="compact" />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
