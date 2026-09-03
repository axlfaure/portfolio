import Image from "next/image";
import { hasAsset } from "@/components/ui/Media";
import { site } from "@/lib/site";

/**
 * Marque de la nav. Bascule automatiquement sur le monogramme dès que
 * `/public/logo.svg` est déposé ; en attendant, le logotype texte.
 */
export function Logo() {
  if (hasAsset(site.logo)) {
    return (
      <Image
        src={site.logo}
        alt={site.name}
        width={483}
        height={362}
        priority
        className="h-8 w-auto"
      />
    );
  }

  return (
    <span className="text-[0.95rem] font-bold tracking-[-0.02em] text-ink">
      {site.brand}
    </span>
  );
}
