import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { connect } from "./remote.mjs";

/**
 * Envoi du site compilé sur le serveur.
 *
 * Le build ne peut pas se faire sur l'hébergement mutualisé : il n'y dispose
 * que d'un gigaoctet de mémoire, où Next et l'administration Payload ne
 * tiennent pas. On compile donc ici, et le serveur ne fait plus que servir.
 *
 * Le transfert passe par ssh et non par le dépôt. Une archive compilée est un
 * binaire : git en conserve chaque version pour toujours, sans qu'on puisse la
 * relire ni la comparer. Quatre méga-octets par modification, définitifs.
 *
 * Deux connexions, donc deux saisies du mot de passe : une pour déposer
 * l'archive, une pour l'installer. Les réunir en poussant l'archive dans
 * l'entrée standard de la seconde a été essayé et abandonné, ssh ne sachant
 * plus lire le mot de passe sous Windows quand cette entrée est redirigée.
 *
 * L'archive emporte `.next` et `public`. Ce second dossier n'est pas dans le
 * build : `next start` le sert depuis le disque, et il n'arrivait donc sur le
 * serveur que par `git pull`. Une vidéo ajoutée au hero est partie sans ses
 * fichiers, et le site est retombé sur son fond de secours en silence.
 *
 * Les anciens sont conservés sur place sous `.next.old` et `public.old`, ce
 * qui permet de revenir en arrière sans rien retélécharger.
 *
 * Usage : `npm run deploy`, après `npm run sync` et `npm run build`.
 */

const server = connect();

if (!fs.existsSync(".next")) {
  console.error("Aucun build trouvé. Lancez `npm run build` d'abord.");
  process.exit(1);
}

console.log("1/3  Préparation de l'archive");
execFileSync("node", ["scripts/package-deploy.mjs"], { stdio: "inherit" });

const archive = "deploy/next-build.tar.gz";
const size = fs.statSync(archive).size;

console.log(`\n2/3  Transfert (${(size / 1024 / 1024).toFixed(1)} Mo)`);
server.upload(archive, "next-build.tar.gz");

/*
 * Le nouveau build est d'abord déplié à côté, et l'ancien n'est écarté qu'une
 * fois l'extraction réussie : une archive tronquée en cours de transfert ne
 * peut pas laisser le site sans rien à servir.
 *
 * `test -f package.json` garde le tout : si le chemin ne désigne pas le site,
 * la commande s'arrête avant le premier effacement.
 */
const install = [
  "set -e",
  `cd '${server.dir}'`,
  "test -f package.json",
  "rm -rf .deploy-tmp",
  "mkdir -p .deploy-tmp",
  "tar -xzf next-build.tar.gz -C .deploy-tmp",
  "test -d .deploy-tmp/.next",
  "test -d .deploy-tmp/public",
  "if [ -d .next ]; then rm -rf .next.old; mv .next .next.old; fi",
  "mv .deploy-tmp/.next .next",
  "if [ -d public ]; then rm -rf public.old; mv public public.old; fi",
  "mv .deploy-tmp/public public",
  "rm -rf .deploy-tmp next-build.tar.gz",
  'echo "BUILD_ID installé : $(cat .next/BUILD_ID)"',
  'echo "Fichiers statiques : $(find public -type f | wc -l) fichiers"',
].join("\n");

console.log("\n3/3  Installation sur le serveur");
server.run(install);

console.log("");
console.log("Transfert terminé.");
console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
console.log("Node charge son code au démarrage : sans redémarrage, le site");
console.log("continue de servir l'ancienne version.");
