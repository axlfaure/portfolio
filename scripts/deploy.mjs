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
 * Le déploiement met aussi le dépôt du serveur à jour, avant d'installer le
 * build.
 *
 * Tout ce que le site sert n'est pas dans `.next` : `public` est lu sur le
 * disque à chaque requête, et les scripts d'administration s'exécutent depuis
 * les sources. Ces fichiers-là appartiennent au dépôt. Les faire voyager dans
 * l'archive a été essayé et abandonné : déposés par-dessus la copie de
 * travail, ils devenaient des fichiers que git ne suivait pas, et le
 * `git pull` suivant refusait de les écraser.
 *
 * Le `git pull` passe donc en premier, et il passe ici plutôt que dans une
 * consigne : une commande qu'on peut oublier finit toujours par être oubliée.
 * S'il échoue, rien n'est installé et le site continue de servir la version
 * en place.
 *
 * L'ancien build est conservé sur place sous `.next.old`, ce qui permet de
 * revenir en arrière sans rien retélécharger.
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
  // Les sources d'abord : le build qui suit a été compilé à partir d'elles.
  'echo "--- Mise à jour des sources ---"',
  "git pull --ff-only",
  "rm -rf .deploy-tmp",
  "mkdir -p .deploy-tmp",
  "tar -xzf next-build.tar.gz -C .deploy-tmp",
  "test -d .deploy-tmp/.next",
  "if [ -d .next ]; then rm -rf .next.old; mv .next .next.old; fi",
  "mv .deploy-tmp/.next .next",
  "rm -rf .deploy-tmp next-build.tar.gz",
  'echo ""',
  'echo "BUILD_ID installé : $(cat .next/BUILD_ID)"',
  // Un changement dans cms/ veut presque toujours dire une colonne ou une
  // table nouvelle. Mieux vaut le dire ici que de le découvrir dans
  // l'administration.
  `if ! git diff --quiet HEAD@{1} HEAD -- cms 2>/dev/null; then echo ""; echo "ATTENTION : le dossier cms a changé, lancez 'npm run db:sync' avant de redémarrer."; fi`,
  // Les fichiers téléversés ne sont ni dans le dépôt ni dans le build : ils
  // n'existent que sur ce disque. Un dossier vide passe inaperçu jusqu'à ce
  // qu'on regarde une page projet, alors autant le dire ici.
  `if [ "$(find media -type f 2>/dev/null | wc -l)" -eq 0 ]; then echo ""; echo "ALERTE : le dossier media est vide. Les visuels du CMS ont disparu du serveur."; echo "Restauration : npm run media:restore"; fi`,
].join("\n");

console.log("\n3/3  Installation sur le serveur");
server.run(install);

console.log("");
console.log("Transfert terminé.");
console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
console.log("Node charge son code au démarrage : sans redémarrage, le site");
console.log("continue de servir l'ancienne version.");
