"use client";

/**
 * Point d'entrée unique de la prise de rendez-vous.
 * Étape 5 : un provider écoute `calendly:open` et ouvre la modale.
 * Tant qu'aucun listener ne l'intercepte, on renvoie vers la carte CTA finale.
 */
export function openCalendly() {
  if (typeof window === "undefined") return;
  const handled = !window.dispatchEvent(
    new CustomEvent("calendly:open", { cancelable: true }),
  );
  if (handled) return;
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}
