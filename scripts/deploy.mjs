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
 * L'archive est poussée dans l'entrée standard de la commande distante plutôt
 * que déposée par `scp` puis dépliée par une seconde connexion. Infomaniak
 * n'accepte pas encore l'authentification par clé : chaque connexion réclame
 * le mot de passe, et il n'y a aucune raison de le demander deux fois.
 *
 * L'ancien build est conservé sur place sous `.next.old`, ce qui permet de
 * revenir en arrière sans rien retélécharger.
 *
 * Usage : `npm run deploy`
 * Configuration : `.env.deploy`, à créer d'après `.env.deploy.example`.
 */

const server = connect();

if (!fs.existsSync(".next")) {
  console.error("Aucun build trouvé. Lancez `npm run build` d'abord.");
  process.exit(1);
}

console.log("1/2  Préparation de l'archive");
execFileSync("node", ["scripts/package-deploy.mjs"], { stdio: "inherit" });

const archive = "deploy/next-build.tar.gz";
const size = fs.statSync(archive).size;

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
  "tar -xzf - -C .deploy-tmp",
  "test -d .deploy-tmp/.next",
  "if [ -d .next ]; then rm -rf .next.old; mv .next .next.old; fi",
  "mv .deploy-tmp/.next .next",
  "rm -rf .deploy-tmp",
  'echo "BUILD_ID installé : $(cat .next/BUILD_ID)"',
].join("\n");

console.log(`\n2/2  Transfert et installation (${(size / 1024 / 1024).toFixed(1)} Mo)`);
console.log("     Le mot de passe SSH est demandé une fois.\n");

/*
 * L'archive est lue directement depuis le fichier, sans passer par la mémoire
 * de Node : un tampon de cette taille en ressort tronqué.
 */
const input = fs.openSync(archive, "r");
try {
  server.run(install, { stdio: [input, "inherit", "inherit"] });
} finally {
  fs.closeSync(input);
}

console.log("");
console.log("Transfert terminé.");
console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
console.log("Node charge son code au démarrage : sans redémarrage, le site");
console.log("continue de servir l'ancienne version.");
