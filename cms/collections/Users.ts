import type { CollectionConfig } from "payload";

/**
 * Comptes d'accès à l'admin.
 *
 * Une seule personne administre ce site : la collection reste volontairement
 * nue. `auth: true` suffit à obtenir l'e-mail, le mot de passe haché, la
 * réinitialisation et les sessions.
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  auth: true,
  admin: { useAsTitle: "email", group: "Réglages" },
  fields: [{ name: "name", type: "text", label: "Nom" }],
};
