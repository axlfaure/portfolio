"use client";

/**
 * `page:ready` est émis par <PageLoader /> une fois les polices chargées et le
 * voile retiré. Tout ce qui ne doit pas jouer derrière le voile — compteurs,
 * séquence d'entrée — s'y accroche.
 */
export const READY_EVENT = "page:ready";

export function isReady(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.hasAttribute("data-ready")
  );
}

/** Exécute `run` maintenant si la page est prête, sinon à l'événement. */
export function onReady(run: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (isReady()) {
    run();
    return () => {};
  }
  window.addEventListener(READY_EVENT, run, { once: true });
  return () => window.removeEventListener(READY_EVENT, run);
}
