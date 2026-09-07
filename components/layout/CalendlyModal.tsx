"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * Modale de prise de rendez-vous.
 *
 * Écoute `calendly:open`, émis par le bouton principal du site, et annule
 * l'évènement pour signaler qu'il a été traité : sans elle, `openCalendly`
 * retombe sur un défilement vers la carte de contact.
 *
 * Le calendrier n'est chargé qu'à l'ouverture. Le placer en permanence dans la
 * page ferait partir une requête vers Calendly à chaque visite, y compris pour
 * les visiteurs qui ne prendront jamais rendez-vous : un traceur tiers sur
 * toutes les pages en échange de rien.
 */
export function CalendlyModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [ready, setReady] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Élément qui avait le focus avant l'ouverture, pour le lui rendre. */
  const originRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setShown(false);
    setOpen(false);
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      // Signale au bouton que la demande est prise en charge.
      event.preventDefault();
      originRef.current = document.activeElement as HTMLElement | null;
      setReady(false);
      setOpen(true);
    };
    window.addEventListener("calendly:open", onOpen);
    return () => window.removeEventListener("calendly:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      originRef.current?.focus?.();
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    /*
     * L'apparition est jouée au cadre suivant : peinte d'abord dans son état
     * de départ, elle a quelque chose à parcourir. Sans ce délai, la
     * transition démarre déjà terminée.
     */
    const frame = requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
    };
  }, [open, close]);

  /*
   * `embed_domain` est exigé par Calendly pour autoriser l'intégration, et
   * vaut donc le domaine réel : `localhost` en développement, le site en
   * ligne ensuite. Les trois couleurs reprennent la charte ; Calendly les
   * ignore silencieusement sur les formules qui ne les proposent pas.
   */
  const src = useMemo(() => {
    if (!open) return "";
    const url = new URL(site.calendlyUrl);
    url.searchParams.set("embed_domain", window.location.hostname);
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("background_color", "ffffff");
    url.searchParams.set("text_color", "16171a");
    url.searchParams.set("primary_color", "2f42d8");
    return url.toString();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Prendre rendez-vous"
    >
      {/* Le fond ferme au clic. Le bouton dédié reste la sortie annoncée aux
          lecteurs d'écran, ce fond n'étant qu'un raccourci à la souris. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
        className={`absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px] transition-opacity duration-300 ease-site motion-reduce:transition-none ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        data-lenis-prevent
        className={`relative flex h-[min(46rem,88svh)] w-full max-w-[56rem] flex-col overflow-hidden rounded-card border border-line bg-surface shadow-e2 transition-[opacity,transform] duration-400 ease-expo motion-reduce:transition-none ${
          shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-[0.95rem] font-bold text-ink">
              Parlons de votre projet
            </p>
            <p className="mt-0.5 text-[0.8rem] text-muted">
              30 minutes, sans engagement.
            </p>
          </div>

          {/* 44px au doigt : c'est la seule sortie visible de la modale, et
              le raccourci par le fond n'est pas devinable au tactile. Le
              format habituel du site reprend la main à la souris. */}
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition-colors duration-200 ease-site hover:border-line-2 hover:bg-paper motion-reduce:transition-none sm:h-10 sm:w-10"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="relative flex-1 bg-surface">
          {/* Message d'attente : le calendrier met un instant à répondre, et un
              cadre vide laisserait croire à une panne. */}
          {!ready && (
            <p className="absolute inset-0 grid place-items-center text-[0.85rem] text-muted">
              Chargement du calendrier…
            </p>
          )}
          <iframe
            src={src}
            title="Choisir un créneau"
            onLoad={() => setReady(true)}
            className={`h-full w-full transition-opacity duration-300 ease-site motion-reduce:transition-none ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
