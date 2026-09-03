import type { Field } from "payload";

/**
 * Identifiant d'URL.
 *
 * Saisi à la main plutôt que dérivé du titre : les slugs sont déjà en place
 * dans les URLs du site et dans le plan du site, et un slug qui suivrait
 * silencieusement un changement de titre casserait des liens publics et le
 * référencement acquis. Le renommer doit rester un geste délibéré.
 */
export const slugField = (description: string): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  label: "Identifiant d'URL",
  admin: { position: "sidebar", description },
});

/** Rang d'affichage. Petit nombre en premier, partout sur le site. */
export const orderField: Field = {
  name: "order",
  type: "number",
  required: true,
  defaultValue: 99,
  label: "Ordre d'affichage",
  admin: {
    position: "sidebar",
    description: "Du plus petit au plus grand. Les ex æquo passent par ordre alphabétique.",
  },
};
