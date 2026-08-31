import fs from "node:fs";
import path from "node:path";

/**
 * Racine du projet.
 *
 * Le serveur de dev peut être lancé depuis la racine du dépôt
 * (`next dev site-axel-faure`), auquel cas `process.cwd()` ne pointe pas
 * sur le projet. On repère la racine à la présence de `content/`.
 */
function resolveRoot(): string {
  const cwd = process.cwd();
  const candidates = [cwd, path.join(cwd, "site-axel-faure")];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "content"))) return candidate;
  }
  return cwd;
}

export const projectRoot = resolveRoot();
export const contentDir = path.join(projectRoot, "content");
export const publicDir = path.join(projectRoot, "public");
