import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";

/**
 * Met la base au niveau du code, puis amorce les blocs de contenu manquants.
 *
 * C'est la seule commande à passer sur le serveur après un déploiement qui
 * touche aux collections. Elle enveloppe `cms/seed-sections.ts`, qui fait le
 * vrai travail, et rattrape le seul mode d'échec connu de la mise à jour de
 * schéma de Payload.
 *
 * Ce mode d'échec : quand une collection change, la mise à jour reconstruit
 * les tables liées mais tente de recréer leurs index sans les avoir supprimés,
 * et s'arrête sur « index déjà existant ». Rien n'est perdu, mais le schéma
 * reste à moitié appliqué, et l'administration tombe sur les tables absentes.
 *
 * La réparation est sûre : un index n'est qu'un chemin d'accès, le supprimer
 * ne touche à aucune donnée, et la tentative suivante le recrée aussitôt. On
 * ne supprime que l'index nommé dans l'erreur, jamais plus large.
 *
 * Usage : `npm run db:sync`
 */

const TENTATIVES_MAX = 12;

try {
  process.loadEnvFile(".env");
} catch {
  // Pas de fichier : les variables viennent déjà de l'environnement.
}

/** Même résolution que `payload.config.ts`, pour agir sur la bonne base. */
function fichierDeBase() {
  const url =
    process.env.DATABASE_URI ||
    `file:${path.join(path.resolve(process.cwd(), ".data"), "site.db").replace(/\\/g, "/")}`;
  return url.startsWith("file:") ? url.slice("file:".length) : null;
}

const base = fichierDeBase();

/** Retire un index, pour que la tentative suivante puisse le recréer. */
function supprimerIndex(nom) {
  if (!base || !fs.existsSync(base)) return false;
  const db = new DatabaseSync(base);
  try {
    db.exec(`DROP INDEX IF EXISTS ${nom}`);
    return true;
  } finally {
    db.close();
  }
}

for (let tentative = 1; tentative <= TENTATIVES_MAX; tentative += 1) {
  const run = spawnSync("npx", ["tsx", "cms/seed-sections.ts"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  const sortie = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  process.stdout.write(run.stdout ?? "");

  if (run.status === 0) {
    if (tentative > 1) {
      console.log(`\nBase à jour après ${tentative} tentatives.`);
    }
    process.exit(0);
  }

  const conflit = sortie.match(/index (\w+) already exists/);
  if (!conflit) {
    process.stderr.write(run.stderr ?? "");
    console.error("\nÉchec, et ce n'est pas un conflit d'index connu.");
    process.exit(run.status ?? 1);
  }

  const nom = conflit[1];
  console.log(`Index « ${nom} » en conflit, suppression puis nouvelle tentative.`);

  if (!supprimerIndex(nom)) {
    console.error(`Base introuvable : ${base ?? "chemin non résolu"}`);
    process.exit(1);
  }
}

console.error(
  `\nAbandon après ${TENTATIVES_MAX} tentatives : les conflits d'index se succèdent sans fin.`,
);
process.exit(1);
