import type { Service } from "./content";

/**
 * Sous-ensemble sérialisable d'un service, transmis du serveur au menu
 * de navigation : `getServices` lit le disque et ne peut pas vivre dans
 * un composant client.
 */
export type NavService = Pick<Service, "slug" | "title" | "short" | "icon">;
