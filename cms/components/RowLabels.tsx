"use client";

import { useFormFields, useRowLabel } from "@payloadcms/ui";

/**
 * Étiquettes des lignes de tableau.
 *
 * Par défaut Payload affiche « Panel 01, Panel 02 ». Sur une liste dont
 * l'ordre détermine la mise en page, c'est le pire cas possible : il faut
 * ouvrir chaque ligne pour savoir ce qu'elle contient, et rien n'indique ce
 * que la position change.
 *
 * Chaque étiquette dit donc la seule chose qu'on cherche en repliant une
 * ligne : ce qu'elle contient, et pour le bento, la forme de la case où elle
 * va tomber.
 */

/** Repli commun : une ligne vide reste identifiable par son rang. */
function fallback(rowNumber: number | undefined, noun: string) {
  return `${noun} ${String((rowNumber ?? 0) + 1).padStart(2, "0")}`;
}

function Label({ main, aside }: { main: string; aside?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: ".5rem" }}>
      <span>{main}</span>
      {aside ? (
        <span style={{ opacity: 0.55, fontSize: ".82em", fontWeight: 400 }}>
          {aside}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Formes des cases du bento selon le nombre de visuels, reprises de
 * `ProjectBento`. Si les deux divergent un jour, c'est ici que ça se voit.
 */
const BENTO_SHAPES: Record<number, string[]> = {
  1: ["pleine largeur"],
  2: ["étroite", "large"],
  3: ["large", "carrée", "bandeau pleine largeur"],
  4: ["carrée", "large", "large", "carrée"],
};

export function PanelRowLabel() {
  const { rowNumber, path } = useRowLabel<Record<string, unknown>>();

  // Le nombre de lignes vient de l'état du formulaire : c'est lui qui décide
  // de la disposition, donc de la forme annoncée.
  const arrayPath = (path ?? "").split(".").slice(0, -1).join(".") || "panels";
  const count = useFormFields(([fields]) => {
    const field = fields?.[arrayPath] as { rows?: unknown[] } | undefined;
    return field?.rows?.length ?? 0;
  });

  const index = rowNumber ?? 0;
  const shape = BENTO_SHAPES[count]?.[index];

  return (
    <Label
      main={`Visuel ${index + 1}`}
      aside={shape ? `case ${shape}` : "case selon le nombre de visuels"}
    />
  );
}

export function GalleryRowLabel() {
  const { rowNumber } = useRowLabel<Record<string, unknown>>();
  return <Label main={fallback(rowNumber, "Visuel")} />;
}

export function KpiRowLabel() {
  const { data, rowNumber } = useRowLabel<{ value?: string; label?: string }>();
  if (!data?.value) return <>{fallback(rowNumber, "Chiffre")}</>;
  return <Label main={data.value} aside={data.label} />;
}

export function StepRowLabel() {
  const { data, rowNumber } = useRowLabel<{ step?: string; duration?: string }>();
  if (!data?.step) return <>{fallback(rowNumber, "Étape")}</>;
  return (
    <Label main={`${(rowNumber ?? 0) + 1}. ${data.step}`} aside={data.duration} />
  );
}

export function DeliverableRowLabel() {
  const { data, rowNumber } = useRowLabel<{ name?: string; detail?: string }>();
  if (!data?.name) return <>{fallback(rowNumber, "Livrable")}</>;
  return <Label main={data.name} aside={data.detail} />;
}

export function EngagementRowLabel() {
  const { data, rowNumber } = useRowLabel<{ name?: string; best?: string }>();
  if (!data?.name) return <>{fallback(rowNumber, "Format")}</>;
  return <Label main={data.name} aside={data.best} />;
}

export function QaRowLabel() {
  const { data, rowNumber } = useRowLabel<{ q?: string }>();
  return <>{data?.q || fallback(rowNumber, "Question")}</>;
}

/** Pour les tableaux de simples chaînes, tous stockés sous `value`. */
export function ValueRowLabel() {
  const { data, rowNumber } = useRowLabel<{ value?: string }>();
  return <>{data?.value || fallback(rowNumber, "Ligne")}</>;
}
