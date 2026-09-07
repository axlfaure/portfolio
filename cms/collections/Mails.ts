import type { CollectionConfig } from "payload";
import { orderField, slugField } from "../fields/slug";
import { HOME, revalidate } from "../hooks/revalidate";

/**
 * Messages de la boîte de réception du constat.
 *
 * La section « Le contexte » fait défiler une matinée de chargé de
 * communication : les messages tombent un à un, de plus en plus vite, jusqu'à
 * celui d'Axel qui propose de tout reprendre. C'est l'argument central de la
 * page, il devait pouvoir se retoucher sans passer par le code.
 *
 * L'ordre va du plus ancien au plus récent, comme la matinée. L'affichage
 * inverse ensuite la pile, une boîte de réception montrant toujours le dernier
 * message en haut.
 */
export const Mails: CollectionConfig = {
  slug: "mails",
  labels: { singular: "Message reçu", plural: "Boîte de réception" },
  access: { read: () => true },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["order", "from", "subject", "time"],
    group: "Accueil",
    description:
      "Les messages qui défilent dans la section « Le contexte », du plus ancien au plus récent.",
  },
  hooks: revalidate(() => [HOME]),
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "from",
          type: "text",
          required: true,
          label: "Expéditeur",
          admin: {
            width: "60%",
            description: "Une personne ou une société.",
          },
        },
        {
          name: "initials",
          type: "text",
          required: true,
          maxLength: 2,
          label: "Initiales",
          admin: {
            width: "20%",
            description: "Deux lettres, affichées dans la pastille.",
          },
        },
        {
          name: "time",
          type: "text",
          required: true,
          label: "Heure",
          admin: { width: "20%", description: "Format 09:32." },
        },
      ],
    },
    {
      name: "subject",
      type: "text",
      required: true,
      label: "Objet",
    },
    {
      name: "preview",
      type: "text",
      required: true,
      label: "Aperçu",
      admin: {
        description:
          "La première ligne du message, coupée par des points de suspension. C'est elle qui donne le ton.",
      },
    },
    {
      name: "file",
      type: "text",
      label: "Pièce jointe",
      admin: {
        description:
          "Nom de fichier complet, extension comprise. L'icône et sa couleur en découlent : .pdf en rouge, .ppt et .pptx en orange, .png .jpg .jpeg .webp en vert, tout le reste en gris. Laisser vide s'il n'y a pas de pièce jointe.",
      },
    },
    {
      name: "me",
      type: "checkbox",
      label: "Message d'Axel",
      admin: {
        description:
          "Affiche le portrait réel et un fond teinté. Réservé au dernier message, celui qui répond à tous les autres.",
      },
    },
    orderField,
    slugField("Identifiant technique, sans effet sur les URLs."),
  ],
};
