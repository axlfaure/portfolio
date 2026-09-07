export type Mail = {
  /** Nom affiché, tel qu'il apparaîtrait dans une boîte : personne ou société. */
  from: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  /** Nom de fichier joint. Volontairement mal nommé. */
  file?: string;
  /** Le dernier message, celui d'Axel : portrait réel et fond teinté. */
  me?: boolean;
};

/**
 * Une matinée de chargé de communication, du plus ancien au plus récent.
 *
 * Chaque objet vient des entretiens de marché, pas d'une supposition : la coupe
 * budgétaire et la relance presse viennent d'Estelle Fege (CEA-Leti FAMES), le
 * « vite fait sur Canva » et le visuel généré par IA de Romane Saye (CEA
 * Startups), le prestataire qui n'a pas compris la techno de Raphael Ledoux
 * (CustomIA). Personnes et sociétés sont inventées.
 *
 * Les horodatages font le travail que le texte ne fait pas : les écarts se
 * resserrent, 35 min puis 16, 11, 7, 5, 3, 2, 1, jusqu'à ce que Julien revienne
 * avec un RE: de plus pour tout annuler.
 *
 * Cette liste a deux emplois. Elle amorce la collection « Boîte de réception »
 * de l'administration, d'où le contenu est ensuite modifiable. Et elle sert de
 * repli si cette collection se retrouve vide : la section perdrait tout son
 * propos en affichant un cadre sans messages.
 */
export const MAILS_PAR_DEFAUT: Mail[] = [
  {
    from: "Sabine Dubois",
    initials: "SD",
    subject: "Le budget com passe à −30 %, à arbitrer",
    preview: "Il va falloir revoir les priorités sur le second semestre…",
    time: "08:12",
  },
  {
    from: "Imprimerie Berthier",
    initials: "IB",
    subject: "Fichiers HD attendus avant 17 h",
    preview: "Sans les fichiers ce soir je ne garantis plus la livraison…",
    time: "08:47",
    file: "BAT_recto_v4_CORRIGÉ_ok.pdf",
  },
  {
    from: "Julien Bernard",
    initials: "JB",
    subject: "RE: RE: RE: c'est bien mais ça ne montre pas ce que ça fait",
    preview:
      "Je te remets le schéma en pièce jointe, regarde surtout la partie…",
    time: "09:03",
    file: "schema V12 modif JB (relu) FINAL.pptx",
  },
  {
    from: "Studio Vertigo",
    initials: "SV",
    subject: "Petite question : c'est un capteur ou un logiciel ?",
    preview:
      "On veut être sûrs d'avoir compris avant de partir sur les maquettes…",
    time: "09:14",
  },
  {
    from: "Salon InnovaTech",
    initials: "SI",
    subject: "Plan de stand à confirmer, clôture vendredi",
    preview: "Passé cette date nous ne pourrons plus modifier l'implantation…",
    time: "09:21",
  },
  {
    from: "Nadia Fournier",
    initials: "NF",
    subject: "Relance : visuel manquant pour le communiqué",
    preview: "Je relance, le communiqué part lundi et il nous manque toujours…",
    time: "09:26",
  },
  {
    from: "Paul Chevalier",
    initials: "PC",
    subject: "On a généré le visuel avec une IA, ça ira ?",
    preview: "On n'avait pas le budget pour un shooting, dis-moi si ça passe…",
    time: "09:29",
    file: "visuel_final_V3_vrai_FINAL (2).png",
  },
  {
    from: "Julien Bernard",
    initials: "JB",
    subject: "RE: RE: RE: RE: finalement on repart de zéro",
    preview: "Après discussion avec l'équipe on préfère reprendre l'angle…",
    time: "09:31",
  },
  {
    from: "Léa Moreau",
    initials: "LM",
    subject: "Tu peux me faire un visuel vite fait sur Canva ?",
    preview: "C'est pour demain, ça devrait te prendre dix minutes…",
    time: "09:32",
  },
  {
    from: "Axel Faure",
    initials: "AF",
    subject: "Je vous décharge de tout ça ?",
    preview: "Un seul interlocuteur pour le print, le web et l'événementiel.",
    time: "09:33",
    me: true,
  },
];
