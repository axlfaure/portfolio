import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Y a-t-il un visuel à afficher ?
 *
 * Avant la bascule vers le CMS, cette fonction testait l'existence du fichier
 * sur le disque, ce qui rendait tout composant l'utilisant dépendant de Node.
 * Un champ vide en base répond à la même question sans toucher au système de
 * fichiers : `Media` et `Avatar` sont redevenus de simples composants, et
 * l'emplacement en pointillés continue de s'afficher tant qu'aucune image
 * n'est téléversée.
 */
export function hasAsset(src?: string | null): boolean {
  return typeof src === "string" && src.length > 0;
}

type MediaProps = {
  src?: string | null;
  alt: string;
  /** Ratio CSS, ex. "16 / 10". */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Texte du placeholder tant que le fichier n'est pas fourni. */
  label?: string;
  /** Attributs data-* transmis au conteneur (révélation au scroll). */
  [key: `data-${string}`]: unknown;
};

/**
 * Emplacement d'image qui bascule tout seul sur le vrai fichier
 * dès qu'il est déposé dans /public. Aucun code à modifier.
 */
export function Media({
  src,
  alt,
  ratio = "16 / 10",
  sizes = "100vw",
  priority = false,
  className,
  label = "Visuel à ajouter",
  ...rest
}: MediaProps) {
  const ready = hasAsset(src);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-sunk",
        !ready && "border border-dashed border-line-2",
        className,
      )}
      style={{ aspectRatio: ratio }}
      {...rest}
    >
      {ready ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center px-4 text-center">
          <span className="eyebrow">{label}</span>
        </span>
      )}
    </div>
  );
}

type AvatarProps = {
  src?: string | null;
  alt: string;
  /** Diamètre en pixels. */
  size?: number;
  /** Initiales affichées tant que la photo n'est pas fournie. */
  initials?: string;
  className?: string;
  /** Variables CSS du masque de pile, notamment. */
  style?: React.CSSProperties;
};

/** Portrait circulaire, même logique de bascule automatique. */
export function Avatar({
  src,
  alt,
  size = 40,
  initials = "",
  className,
  style,
}: AvatarProps) {
  const ready = hasAsset(src);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sunk",
        !ready && "border border-line-2",
        className,
      )}
      style={{ width: size, height: size, ...style }}
    >
      {ready ? (
        <Image
          src={src as string}
          alt={alt}
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="font-mono font-medium tracking-wider text-faint"
          style={{ fontSize: Math.max(9, Math.round(size * 0.3)) }}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
