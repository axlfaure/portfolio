import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

/**
 * Récupération du contenu du serveur.
 *
 * La base et les fichiers téléversés vivent sur le disque du serveur, et sont
 * exclus du dépôt : ils ne voyagent jamais par git. Le contenu saisi dans
 * l'administration n'existe donc qu'à un seul endroit, sans copie.
 *
 * Ce script en ramène une, horodatée, dans `backups/`. Il rend deux services à
 * la fois : la sauvegarde, et un poste de développement qui reflète le site
 * réel quand il faut retoucher un contenu précis.
 *
 * Le sens inverse n'existe pas volontairement : remonter une base locale
 * écraserait le vrai contenu par une copie périmée.
 *
 * Usage : `npm run backup`
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

const stamp = new Date()
  .toISOString()
  .slice(0, 16)
  .replace("T", "-")
  .replace(":", "h");

const dir = path.join("backups", stamp);
fs.mkdirSync(dir, { recursive: true });

console.log(`Destination : ${dir}`);

console.log("\n1/2  Base de données");
execFileSync("scp", [`${target}:${remoteDir}/.data/site.db`, path.join(dir, "site.db")], {
  stdio: "inherit",
});

console.log("\n2/2  Fichiers téléversés");
execFileSync("scp", ["-r", `${target}:${remoteDir}/media`, dir], { stdio: "inherit" });

/** Poids réel de la copie, seule preuve qu'elle n'est pas vide. */
let bytes = 0;
let files = 0;
(function measure(current) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) measure(full);
    else {
      files += 1;
      bytes += fs.statSync(full).size;
    }
  }
})(dir);

console.log("");
console.log(`Sauvegarde terminée : ${files} fichiers, ${(bytes / 1024 / 1024).toFixed(1)} Mo`);
console.log("");
console.log("Pour travailler en local sur ce contenu :");
console.log(`  cp ${path.join(dir, "site.db")} .data/site.db`);
console.log(`  cp -r ${path.join(dir, "media")}/. media/`);
