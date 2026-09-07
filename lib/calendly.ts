"use client";

/**
 * Point d'entrée unique de la prise de rendez-vous.
 *
 * `CalendlyModal`, montée dans la mise en page, intercepte l'évènement et
 * l'annule. Le repli vers la carte de contact ne sert donc qu'aux cas où elle
 * n'a pas pu se monter : le bouton renvoie alors vers un moyen d'écrire,
 * plutôt que de ne rien faire du tout.
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
