import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { Logo } from "@/components/ui/Logo";
import { getServices } from "@/lib/content";
import type { NavService } from "@/lib/nav";
import { site } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { StickyHeader } from "./StickyHeader";

export function Nav() {
  const services: NavService[] = getServices().map((service) => ({
    slug: service.slug,
    title: service.title,
    short: service.short,
    icon: service.icon,
  }));

  return (
    <StickyHeader>
      <div className="container-site grid h-20 grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link href="/" aria-label={`${site.name} — accueil`}>
          <Logo />
        </Link>

        <NavLinks services={services} />

        <div className="flex items-center gap-2">
          <div className="hidden nav:block">
            <CtaButton variant="compact" />
          </div>
          <MobileMenu services={services} />
        </div>
      </div>
    </StickyHeader>
  );
}
