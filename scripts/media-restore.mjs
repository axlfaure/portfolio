import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { connect } from "./remote.mjs";

/**
 * Renvoie les fichiers téléversés vers le serveur.
 *
 * Le seul script qui écrive du contenu vers le haut, et il ne le fait que pour
 * réparer. Le sens habituel est l'inverse — le serveur fait autorité sur le
 * contenu — mais si son dossier `media` disparaît, la sauvegarde locale est la
 * seule copie qui reste.
 *
 * L'installation est **additive** : l'archive se déplie par-dessus l'existant,
 * rien n'est effacé au passage. Un fichier présent des deux côtés est
 * simplement réécrit à l'identique. C'est ce qui permet de la relancer sans y
 * réfléchir, et ce qui interdit à ce script d'aggraver une situation déjà
 * mauvaise.
 *
 * Ce qu'il ne peut pas faire : rendre un fichier téléversé après la dernière
 * sauvegarde. Celui-là n'a jamais existé ailleurs que sur le serveur, et il
 * faut le redéposer depuis son original.
 *
 * Usage : `npm run media:restore` — ou avec un dossier précis :
 *         `node scripts/media-restore.mjs backups/2026-09-08-07h19`
 */

const HORODATAGE = /^\d{4}-\d{2}-\d{2}-\d{2}h\d{2}$/;

/** Sauvegarde la plus récente, à défaut d'un dossier donné en argument. */
function choisirSource() {
  const donne = process.argv[2];
  if (donne) return donne;

  if (!fs.existsSync("backups")) return null;
  const dates = fs
    .readdirSync("backups")
    .filter((nom) => HORODATAGE.test(nom))
    .sort();
  return dates.length > 0 ? path.join("backups", dates[dates.length - 1]) : null;
}

const source = choisirSource();
const dossier = source ? path.join(source, "media") : null;

if (!dossier || !fs.existsSync(dossier)) {
  console.error("Aucun dossier media à renvoyer.");
  console.error("");
  console.error("Attendu : backups/<horodatage>/media, produit par `npm run backup`.");
  console.error("Un dossier précis peut aussi être passé en argument.");
  process.exit(1);
}

const fichiers = fs.readdirSync(dossier).length;
if (fichiers === 0) {
  console.error(`${dossier} est vide : rien à renvoyer.`);
  process.exit(1);
}

const server = connect();

console.log(`Source : ${dossier} (${fichiers} fichiers)`);
console.log("Les fichiers déjà présents sur le serveur seront réécrits,");
console.log("aucun ne sera supprimé.\n");

console.log("1/3  Préparation de l'archive");
const archive = path.resolve("backups", "media-restore.tar.gz");
fs.rmSync(archive, { force: true });
execFileSync("tar", ["-czf", archive, "media"], { cwd: source, stdio: "inherit" });
const poids = fs.statSync(archive).size;

console.log(`\n2/3  Transfert (${(poids / 1024 / 1024).toFixed(1)} Mo)`);
server.upload(archive, "media-restore.tar.gz");

/*
 * `tar` sans option d'effacement : il écrit par-dessus et laisse en place ce
 * qu'il ne connaît pas. Le compte avant et après est affiché — c'est la seule
 * preuve que le transfert a servi à quelque chose.
 */
const install = [
  "set -e",
  `cd '${server.dir}'`,
  "test -f package.json",
  "mkdir -p media",
  'echo "Avant  : $(find media -type f | wc -l) fichiers"',
  "tar -xzf media-restore.tar.gz",
  "rm -f media-restore.tar.gz",
  'echo "Après  : $(find media -type f | wc -l) fichiers"',
].join("\n");

console.log("\n3/3  Installation sur le serveur");
server.run(install);

fs.rmSync(archive, { force: true });

console.log("");
console.log("Les fichiers téléversés après cette sauvegarde ne sont pas");
console.log("revenus : ils n'existaient que sur le serveur. Il faut les");
console.log("redéposer depuis leurs originaux dans l'administration.");
