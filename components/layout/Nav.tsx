import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { Logo } from "@/components/ui/Logo";
import { getServices } from "@/lib/content";
import type { NavService } from "@/lib/nav";
import { site } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { StickyHeader } from "./StickyHeader";

export async function Nav() {
  const services: NavService[] = (await getServices()).map((service) => ({
    slug: service.slug,
    title: service.title,
    short: service.short,
    icon: service.icon,
  }));

  return (
    <StickyHeader>
      {/* Flex et non grille à trois colonnes : les liens disparaissent sous
          56rem, et une grille les remplace par une colonne vide. Le groupe de
          droite glissait alors dans la colonne du milieu, ce qui plaçait le
          burger juste après le logo au lieu du bord droit. */}
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name}, accueil`}>
          <Logo />
        </Link>

        <NavLinks services={services} />

        <div className="flex items-center gap-2">
          <div className="hidden nav:block">
            <CtaButton variant="compact" />
          </div>
          <MobileMenu />
        </div>
      </div>
    </StickyHeader>
  );
}
