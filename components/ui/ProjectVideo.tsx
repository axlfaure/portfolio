"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/**
 * Le réglage système « réduire les animations », lu comme une source externe.
 *
 * `useSyncExternalStore` plutôt qu'un effet : la valeur ne vient pas de React,
 * elle vient du système, et un `setState` posé dans un effet déclencherait un
 * rendu en cascade que le compilateur refuse à juste titre. L'instantané servi
 * au rendu serveur suppose l'animation autorisée, et se corrige à l'hydratation
 * si le visiteur a demandé le contraire.
 */
const REQUETE = "(prefers-reduced-motion: reduce)";

function useReglageCalme(): boolean {
  return useSyncExternalStore(
    (surChangement) => {
      const media = window.matchMedia(REQUETE);
      media.addEventListener("change", surChangement);
      return () => media.removeEventListener("change", surChangement);
    },
    () => window.matchMedia(REQUETE).matches,
    () => false,
  );
}

/**
 * Vidéo d'une carte projet : en boucle, sans son, sans commandes.
 *
 * Trois précautions, dans l'ordre de ce qu'elles coûtent au visiteur.
 *
 * Le réglage système « réduire les animations » est respecté : dans ce cas la
 * vidéo n'est pas chargée du tout, seule l'image d'attente s'affiche. Ce
 * réglage n'est pas une préférence esthétique, il est souvent posé pour des
 * troubles vestibulaires.
 *
 * La lecture s'arrête dès que la carte quitte l'écran. Sur la page d'accueil
 * plusieurs cartes se suivent : sans cela elles tourneraient toutes en même
 * temps, en arrière-plan, pour personne.
 *
 * Le chargement se limite d'abord aux métadonnées : le fichier ne part que
 * lorsque la carte approche de l'écran, pas au premier octet de la page.
 */
export function ProjectVideo({
  src,
  poster,
  alt,
  className,
}: {
  src: string;
  poster?: string | null;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const calme = useReglageCalme();
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || calme) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Une lecture refusée par le navigateur n'est pas une erreur à
          // remonter : l'image d'attente reste, et c'est un repli acceptable.
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [calme]);

  if (calme) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-sunk",
          className,
        )}
      >
        {poster && (
          <Image
            src={poster}
            alt={alt}
            fill
            quality={90}
            sizes="(min-width: 56rem) 32rem, 80vw"
            className="object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-sunk",
        className,
      )}
    >
      {/* L'image d'attente reste posée jusqu'à la première image décodée :
          l'attribut `poster` disparaît dès la mise en pause sur certains
          navigateurs, ce qui laisserait un cadre vide. */}
      {poster && !pret && (
        <Image
          src={poster}
          alt=""
          fill
          quality={90}
          sizes="(min-width: 56rem) 32rem, 80vw"
          className="object-cover"
        />
      )}

      <video
        ref={ref}
        src={src}
        poster={poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        onLoadedData={() => setPret(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
