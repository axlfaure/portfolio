import fs from "node:fs";
import { execFileSync } from "node:child_process";

/**
 * Envoi du site compilé sur le serveur.
 *
 * Le build ne peut pas se faire sur l'hébergement mutualisé : il n'y dispose
 * que d'un gigaoctet de mémoire, où Next et l'administration Payload ne
 * tiennent pas. On compile donc ici, et le serveur ne fait plus que servir.
 *
 * Le transfert passe par `scp` et non par le dépôt. Une archive compilée est
 * un binaire : git en conserve chaque version pour toujours, sans qu'on puisse
 * la relire ni la comparer. Quatre méga-octets par modification, définitifs.
 *
 * L'ancien build est conservé sur place sous `.next.old`, ce qui permet de
 * revenir en arrière sans rien retélécharger.
 *
 * Usage : `npm run deploy`
 * Configuration : `.env.deploy`, à créer d'après `.env.deploy.example`.
 */

try {
  process.loadEnvFile(".env.deploy");
} catch {
  // Absent : les variables peuvent aussi venir du shell.
}

const target = process.env.DEPLOY_SSH;
const remoteDir = process.env.DEPLOY_PATH;

if (!target || !remoteDir) {
  console.error("Configuration absente.");
  console.error("");
  console.error("Copiez .env.deploy.example en .env.deploy et renseignez :");
  console.error("  DEPLOY_SSH   identifiant de connexion, sous la forme utilisateur@serveur");
  console.error("  DEPLOY_PATH  chemin absolu du site sur le serveur");
  process.exit(1);
}

/*
 * Le chemin distant est inséré dans une commande shell, et cette commande
 * efface un dossier. Une apostrophe le romprait, et un chemin vide ou réduit
 * à la racine ferait porter l'effacement ailleurs que sur le site.
 */
if (remoteDir.includes("'") || !remoteDir.startsWith("/") || remoteDir.length < 4) {
  console.error(`DEPLOY_PATH invalide : ${remoteDir}`);
  console.error("Attendu : un chemin absolu, sans apostrophe.");
  process.exit(1);
}

if (!fs.existsSync(".next")) {
  console.error("Aucun build trouvé. Lancez `npm run build` d'abord.");
  process.exit(1);
}

/** Étape visible, pour situer un échec sans avoir à relire le script. */
function step(label, command, args) {
  console.log(`\n${label}`);
  execFileSync(command, args, { stdio: "inherit" });
}

step("1/3  Préparation de l'archive", "node", ["scripts/package-deploy.mjs"]);

step("2/3  Transfert", "scp", [
  "deploy/next-build.tar.gz",
  `${target}:${remoteDir}/`,
]);

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
  `cd '${remoteDir}'`,
  "test -f package.json",
  "rm -rf .deploy-tmp",
  "mkdir -p .deploy-tmp",
  "tar -xzf next-build.tar.gz -C .deploy-tmp",
  "test -d .deploy-tmp/.next",
  "if [ -d .next ]; then rm -rf .next.old; mv .next .next.old; fi",
  "mv .deploy-tmp/.next .next",
  "rm -rf .deploy-tmp next-build.tar.gz",
  "echo \"BUILD_ID installé : $(cat .next/BUILD_ID)\"",
].join("\n");

step("3/3  Installation sur le serveur", "ssh", [target, install]);

console.log("");
console.log("Transfert terminé.");
console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
console.log("Node charge son code au démarrage : sans redémarrage, le site");
console.log("continue de servir l'ancienne version.");
