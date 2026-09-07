import type { GlobalConfig } from "payload";
import { HOME, revalidateGlobal } from "../hooks/revalidate";

/**
 * Carte d'appel à l'action, en bas de chaque page.
 *
 * Elle ne clôt pas seulement la page d'accueil : les pages projet, service et
 * article la reprennent. Ce qui s'écrit ici se lit donc partout, et la
 * revalidation ne peut pas se contenter de la page d'accueil.
 */
export const FinalCta: GlobalConfig = {
  slug: "final-cta",
  label: "Appel final",
  access: { read: () => true },
  admin: {
    group: "Textes de l'accueil",
    description: "La carte de prise de contact, reprise en bas de toutes les pages.",
  },
  hooks: revalidateGlobal([HOME, "/projets", "/services", "/blog"]),
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "titleStart",
          type: "text",
          required: true,
          label: "Titre, début",
          admin: { width: "50%" },
        },
        {
          name: "titleAccent",
          type: "text",
          required: true,
          label: "Titre, fin accentuée",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "lead",
      type: "textarea",
      required: true,
      label: "Accroche",
      admin: {
        description:
          "Ce qui se passe concrètement après le clic. C'est la dernière chose lue avant la décision : dire la durée et le canal lève la principale hésitation.",
      },
    },
    {
      name: "footnote",
      type: "text",
      required: true,
      label: "Mention du bas",
      admin: { description: "La ligne en capitales sous le bouton." },
    },
  ],
};
