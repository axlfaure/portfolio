import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Media } from "@/cms/payload-types";

/**
 * Instance Payload partagée.
 *
 * On passe par l'API locale plutôt que par HTTP : le site et le CMS tournent
 * dans le même processus, donc une requête REST vers soi-même ne ferait
 * qu'ajouter une sérialisation et un aller-retour réseau pour rien.
 */
export const db = async () => getPayload({ config: configPromise });

/**
 * Un champ `upload` arrive soit peuplé, soit réduit à son identifiant, soit
 * nul. Cette fonction ramène les trois cas à une URL ou à `null`, ce qui suffit
 * au site : c'est l'absence d'URL qui déclenche l'emplacement en pointillés.
 */
export function url(value: number | Media | null | undefined): string | null {
  if (!value || typeof value === "number") return null;
  return value.url ?? null;
}

/** Même chose pour une liste de visuels, en écartant les entrées vides. */
export function urls(
  rows: { image: number | Media | null }[] | null | undefined,
): string[] {
  if (!rows) return [];
  return rows.map((row) => url(row.image)).filter((src): src is string => Boolean(src));
}

/** Aplatit les tableaux `{ value }` que Payload impose aux listes de chaînes. */
export function values(
  rows: { value: string }[] | null | undefined,
): string[] {
  return rows?.map((row) => row.value) ?? [];
}

/** Retire les identifiants ajoutés par Payload dans les lignes de tableau. */
export function rows<T extends object>(
  list: (T & { id?: string | null })[] | null | undefined,
): T[] {
  if (!list) return [];
  return list.map((row) => {
    const copy = { ...row };
    delete copy.id;
    return copy as unknown as T;
  });
}
