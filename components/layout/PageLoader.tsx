"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { READY_EVENT } from "@/lib/ready";

/** Durée minimale d'affichage : en dessous, le voile passerait pour un défaut. */
const MIN_MS = 420;
/** Plafond absolu : la page ne reste jamais masquée, même si les polices traînent. */
const MAX_MS = 1300;

/**
 * Voile de chargement court.
 *
 * Il couvre le remplacement des polices — c'est lui qui faisait sauter la mise
 * en page pendant la séquence d'entrée — puis pose `data-ready` sur <html>,
 * ce qui libère les animations restées en pause.
 *
 * Sans JavaScript il n'existe pas, et la règle `<noscript>` du layout affiche
 * déjà tout le contenu : la page ne peut pas rester masquée.
 */
export function PageLoader({ children }: { children?: ReactNode }) {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let done = false;

    const release = () => {
      if (done) return;
      done = true;
      document.documentElement.setAttribute("data-ready", "1");
      window.dispatchEvent(new Event(READY_EVENT));
      setFading(true);
      window.setTimeout(() => setRemoved(true), 900);
    };

    /** Lève le voile en respectant la durée minimale d'affichage. */
    const releaseSoon = () => {
      const waited = performance.now() - start;
      window.setTimeout(release, Math.max(0, MIN_MS - waited));
    };

    const cap = window.setTimeout(release, MAX_MS);

    const fonts =
      "fonts" in document ? document.fonts.ready : Promise.resolve(null);

    fonts.then(releaseSoon);

    /**
     * Filets de sécurité. Un voile bloqué ne dégrade pas la page : il la
     * remplace par du vide. Les minuteurs d'un onglet en arrière-plan sont
     * bridés par le navigateur et `document.fonts.ready` peut ne jamais se
     * résoudre — on lève donc aussi le voile au retour au premier plan, au
     * `load` de la fenêtre, et sur un retour d'historique.
     */
    const onVisible = () => {
      if (document.visibilityState === "visible") releaseSoon();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("load", releaseSoon);
    window.addEventListener("pageshow", releaseSoon);

    return () => {
      window.clearTimeout(cap);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("load", releaseSoon);
      window.removeEventListener("pageshow", releaseSoon);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-paper",
        "transition-transform duration-[820ms] ease-expo will-change-transform",
        fading && "pointer-events-none -translate-y-full",
      )}
    >
      <span
        className={cn(
          "transition-[opacity,translate] duration-300 ease-expo",
          fading
            ? "-translate-y-3 opacity-0"
            : "opacity-100 [animation:loader-breathe_1.6s_ease-in-out_infinite]",
        )}
      >
        {children}
      </span>
    </div>
  );
}
