"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Mail = {
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
 * resserrent — 35 min, 16, 11, 7, 5, 3, 2, 1 — jusqu'à ce que Julien revienne
 * avec un RE: de plus pour tout annuler.
 */
const MAILS: Mail[] = [
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

/** Messages déjà là quand on arrive : une boîte ne démarre jamais vide. */
const SETTLED = 3;
/** Compteur au repos. Les messages visibles ne sont que le haut de la pile. */
const UNREAD_START = 21;

/**
 * Attente avant chaque nouvelle arrivée. Les intervalles se resserrent comme
 * les horodatages, puis s'ouvrent une dernière fois : ce silence est ce qui
 * détache le message d'Axel de la bousculade qui le précède.
 */
const GAPS = [900, 1650, 1400, 1200, 1000, 850, 1900];

/** Le plus récent en haut, comme dans n'importe quelle boîte de réception. */
const NEWEST_FIRST = [...MAILS].reverse();

/** Hauteur d'une ligne, selon qu'elle porte ou non une pièce jointe. */
const ROW_H = "5rem";
const ROW_H_FILE = "6.75rem";

/**
 * Icône du type de fichier, déduite de l'extension.
 *
 * Des glyphes génériques, pas des logos : reproduire les marques des éditeurs
 * dans une pièce jointe fictive n'apporterait rien et emprunterait une identité
 * qui n'est pas la nôtre. En revanche les couleurs suivent la convention que
 * tout le monde a intégrée — rouge pour un document, orange pour une
 * présentation, vert pour une image — parce que c'est elle qui rend le type
 * lisible à cette taille. Aucune ne s'approche du bleu de l'accent, réservé à
 * ce qui résout.
 */
function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  // Image : cadre, soleil et ligne d'horizon.
  if (["png", "jpg", "jpeg", "webp", "gif", "tif", "tiff"].includes(ext)) {
    return (
      <svg {...common} className="shrink-0 text-[#2f9e70]">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.4" />
        <path d="m4 17 4.8-4.6 3.7 3.6L16 13l4 4" />
      </svg>
    );
  }

  // Présentation : écran sur pied, avec ses barres.
  if (["ppt", "pptx", "key", "odp"].includes(ext)) {
    return (
      <svg {...common} className="shrink-0 text-[#d9773d]">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M12 16v4M8.5 20h7" />
        <path d="M8 12.5v-2M12 12.5v-4.5M16 12.5v-3" />
      </svg>
    );
  }

  // Document : page à coin replié et lignes de texte.
  if (["pdf", "doc", "docx", "txt", "odt"].includes(ext)) {
    return (
      <svg {...common} className="shrink-0 text-[#cf4b46]">
        <path d="M14 3v5h5" />
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M9 13.5h6M9 17h4" />
      </svg>
    );
  }

  // Archive ou format inconnu : la page nue, sans couleur à revendiquer.
  return (
    <svg {...common} className="shrink-0 text-label">
      <path d="M14 3v5h5" />
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    </svg>
  );
}

/**
 * Boîte de réception qui se remplit seule, une fois, à l'entrée dans le champ.
 *
 * Le portrait arrive en `ReactNode` : `Avatar` lit le disque pour savoir si le
 * fichier existe, c'est donc un composant serveur, et il ne peut pas être
 * importé ici. Le rendu ne dépend d'aucun état React — la séquence retire un
 * attribut par message et laisse la feuille de style ouvrir la ligne.
 */
export function ContextInbox({ portrait }: { portrait: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = root.current;
    if (!card) return;

    const count = card.querySelector<HTMLElement>("[data-inbox-count]");
    const rows = [...card.querySelectorAll<HTMLElement>(".inbox-row")];

    /** Ouvre les `received - SETTLED` premières lignes, de la plus ancienne. */
    const show = (received: number) => {
      for (let i = rows.length - received; i < rows.length; i += 1) {
        rows[i]?.removeAttribute("data-pending");
      }
      if (count) count.textContent = String(UNREAD_START + received - SETTLED);
    };

    // Mouvement réduit : on montre le résultat, pas le trajet.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show(rows.length);
      return;
    }

    let timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        let at = 0;
        timers = GAPS.map((gap, i) => {
          at += gap;
          return window.setTimeout(() => show(SETTLED + i + 1), at);
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={root}
      className="overflow-hidden rounded-project border border-line bg-surface shadow-e2"
    >
      {/* Barre de fenêtre. Trois pastilles et le titre, rien d'autre : pas de
          chevrons ni de champ de recherche, qui ne mèneraient nulle part. */}
      <div className="relative flex h-9 items-center border-b border-line bg-sunk px-4">
        <div aria-hidden="true" className="flex gap-[0.4rem]">
          <span className="h-[0.65rem] w-[0.65rem] rounded-full bg-[#ed6a5e]" />
          <span className="h-[0.65rem] w-[0.65rem] rounded-full bg-[#f4bf50]" />
          <span className="h-[0.65rem] w-[0.65rem] rounded-full bg-line-2" />
        </div>
        <p className="pointer-events-none absolute inset-x-0 text-center text-[0.75rem] font-semibold text-ink-2">
          Boîte de réception
        </p>
      </div>

      {/* Onglets « Prioritaire / Autres » : le marqueur le plus reconnaissable
          d'Outlook. Volontairement pas des boutons — ils ne font rien, et un
          faux bouton est un piège au clavier comme au lecteur d'écran. */}
      <div className="flex items-center justify-between gap-4 px-4 pt-3">
        <div className="flex gap-5 text-[0.78rem]">
          <span className="border-b-2 border-accent pb-2 font-semibold text-ink">
            Prioritaire
          </span>
          <span className="border-b-2 border-transparent pb-2 text-label">
            Autres
          </span>
        </div>
        <p className="shrink-0 pb-2 font-mono text-[0.68rem] tracking-[0.08em] text-label">
          <span data-inbox-count>{UNREAD_START}</span> non lus
        </p>
      </div>

      {/* Le filet du bas compte : une fois la liste défilée, elle est coupée
          net sous cette bande. Sans séparation, la coupe passerait pour un
          défaut d'affichage plutôt que pour un bord de fenêtre. */}
      <div className="border-y border-line px-4 py-2">
        <p className="text-[0.72rem] font-semibold text-label">
          Aujourd&apos;hui
        </p>
      </div>

      {/* data-lenis-prevent : sans lui le smooth scroll global avale la molette
          et la liste ne défilerait jamais sous le pointeur. */}
      <div className="inbox-window" data-lenis-prevent>
        <ul>
          {NEWEST_FIRST.map((mail, i) => (
            <li
              key={`${mail.time}-${mail.initials}`}
              className="inbox-row"
              data-pending={i < NEWEST_FIRST.length - SETTLED ? "" : undefined}
              style={
                {
                  "--row-h": mail.file ? ROW_H_FILE : ROW_H,
                } as React.CSSProperties
              }
            >
              {/* Survol : la teinte suffit à donner la sensation d'une vraie
                  boîte. Pas de `cursor-pointer` — la ligne ne mène nulle part,
                  et une main promettrait un clic qui n'existe pas. */}
              <div
                className={cn(
                  "relative flex h-full items-start gap-3 border-b border-line px-4 py-3",
                  "transition-colors duration-150 ease-site",
                  mail.me
                    ? "bg-[color-mix(in_srgb,var(--color-accent)_7%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_11%,transparent)]"
                    : "hover:bg-[color-mix(in_srgb,var(--color-sunk)_45%,transparent)]",
                )}
              >
                {/* Barre verticale de non-lu, à la façon d'Outlook — mais dans
                    ton bleu, pas celui de Microsoft. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-accent"
                />

                {mail.me ? (
                  portrait
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-[2.15rem] w-[2.15rem] shrink-0 place-items-center rounded-full border border-line-2 bg-surface font-mono text-[0.62rem] tracking-wider text-label"
                  >
                    {mail.initials}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-3">
                    <span className="truncate text-[0.82rem] font-semibold leading-[1.4] text-ink">
                      {mail.from}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[0.68rem] leading-[1.4] text-label">
                      {mail.time}
                    </span>
                  </p>

                  <p
                    className={cn(
                      "truncate text-[0.82rem] leading-[1.4]",
                      mail.me ? "font-semibold text-ink" : "text-ink-2",
                    )}
                  >
                    {mail.subject}
                  </p>

                  <p className="truncate text-[0.78rem] leading-[1.4] text-label">
                    {mail.preview}
                  </p>

                  {mail.file ? (
                    <span className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded border border-line-2 bg-surface px-1.5 py-[0.15rem] font-mono text-[0.64rem] text-label">
                      <FileIcon name={mail.file} />
                      <span className="truncate">{mail.file}</span>
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
