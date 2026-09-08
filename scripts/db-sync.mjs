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
 * Le sous-processus tourne en `NODE_ENV=development`, et c'est indispensable.
 * L'adaptateur SQLite de Payload garde ce test en dur, dans son fichier de
 * connexion :
 *
 *     if (process.env.NODE_ENV !== 'production' && … ) await pushDevSchema(…)
 *
 * Sur le serveur, où la variable vaut `production`, la mise à jour était donc
 * purement et simplement sautée. La commande rendait la main sans rien dire,
 * et l'administration tombait ensuite sur une colonne inexistante. Déclarer
 * `push: true` dans la configuration n'y change rien : le test sur
 * l'environnement passe avant.
 *
 * La bascule ne concerne que ce sous-processus, le temps de la mise à jour.
 * Le serveur qui sert le site n'est pas touché.
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

if (process.env.NODE_ENV === "production") {
  console.log(
    "NODE_ENV vaut « production » : la mise à jour du schéma est forcée en",
  );
  console.log("mode développement pour ce sous-processus, sans quoi Payload la");
  console.log("sauterait en silence.\n");
}

/** Exécute une réparation sur la base, puis referme. */
function reparer(sql) {
  if (!base || !fs.existsSync(base)) return false;
  const db = new DatabaseSync(base);
  try {
    db.exec(sql);
    return true;
  } finally {
    db.close();
  }
}

/**
 * Reconnaît les deux façons dont la mise à jour de schéma de Payload
 * s'interrompt, et renvoie la réparation correspondante.
 *
 * Aucune des deux ne touche aux données. La première supprime un index, qui
 * n'est qu'un chemin d'accès et sera recréé dans la foulée. La seconde ajoute
 * une colonne vide à une table que la mise à jour s'apprête de toute façon à
 * reconstruire.
 */
function diagnostiquer(sortie) {
  const index = sortie.match(/index (\w+) already exists/);
  if (index) {
    return {
      motif: `index « ${index[1]} » en conflit`,
      sql: `DROP INDEX IF EXISTS ${index[1]}`,
    };
  }

  /*
   * Reconstruction de table : Payload crée `__new_table`, y recopie l'ancienne,
   * et la copie réclame une colonne que l'ancienne n'a pas encore. On l'ajoute,
   * vide, pour que la recopie aboutisse.
   */
  const colonne = sortie.match(/no such column: (\w+)/);
  const table = sortie.match(/FROM `(\w+)`/);
  if (colonne && table) {
    const type = colonne[1].endsWith("_id") ? "integer" : "text";
    return {
      motif: `colonne « ${colonne[1]} » absente de ${table[1]}`,
      sql: `ALTER TABLE ${table[1]} ADD COLUMN ${colonne[1]} ${type}`,
    };
  }

  return null;
}

for (let tentative = 1; tentative <= TENTATIVES_MAX; tentative += 1) {
  const run = spawnSync("npx", ["tsx", "cms/seed-sections.ts"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env: { ...process.env, NODE_ENV: "development" },
  });

  const sortie = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  process.stdout.write(run.stdout ?? "");

  if (run.status === 0) {
    if (tentative > 1) {
      console.log(`\nBase à jour après ${tentative} tentatives.`);
    }
    process.exit(0);
  }

  const remede = diagnostiquer(sortie);
  if (!remede) {
    process.stderr.write(run.stderr ?? "");
    console.error("\nÉchec, et ce n'est aucun des blocages connus.");
    process.exit(run.status ?? 1);
  }

  console.log(`${remede.motif}, réparation puis nouvelle tentative.`);

  if (!reparer(remede.sql)) {
    console.error(`Base introuvable : ${base ?? "chemin non résolu"}`);
    process.exit(1);
  }
}

console.error(
  `\nAbandon après ${TENTATIVES_MAX} tentatives : les conflits d'index se succèdent sans fin.`,
);
process.exit(1);
