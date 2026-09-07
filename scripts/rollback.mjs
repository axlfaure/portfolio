import { execFileSync } from "node:child_process";

/**
 * Retour au build précédent.
 *
 * `npm run deploy` conserve l'ancien build sous `.next.old` avant d'installer
 * le nouveau. Si un déploiement casse le site, on revient ici en une commande,
 * sans rien recompiler ni retransférer.
 *
 * L'échange est réciproque : le build fautif prend la place de `.next.old`, ce
 * qui permet de repartir en avant si le problème venait d'ailleurs.
 *
 * Usage : `npm run rollback`
 */

try {
  process.loadEnvFile(".env.deploy");
} catch {
  // Absent : les variables peuvent aussi venir du shell.
}

const target = process.env.DEPLOY_SSH;
const remoteDir = process.env.DEPLOY_PATH;

if (!target || !remoteDir) {
  console.error("Configuration absente. Voir .env.deploy.example.");
  process.exit(1);
}

if (remoteDir.includes("'") || !remoteDir.startsWith("/") || remoteDir.length < 4) {
  console.error(`DEPLOY_PATH invalide : ${remoteDir}`);
  process.exit(1);
}

const swap = [
  "set -e",
  `cd '${remoteDir}'`,
  "test -f package.json",
  "test -d .next.old",
  "rm -rf .next.swap",
  "mv .next .next.swap",
  "mv .next.old .next",
  "mv .next.swap .next.old",
  "echo \"BUILD_ID rétabli : $(cat .next/BUILD_ID)\"",
].join("\n");

execFileSync("ssh", [target, swap], { stdio: "inherit" });

console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
