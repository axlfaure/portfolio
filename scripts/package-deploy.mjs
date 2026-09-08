import fs from "node:fs";
import path from "node:path";

/**
 * Prépare un dossier prêt à envoyer sur le serveur.
 *
 * Nécessaire parce que l'hébergement mutualisé ne dispose que d'un gigaoctet
 * de mémoire : compiler Next avec l'administration Payload n'y entre pas. On
 * construit donc ici, où la mémoire n'est pas la contrainte, et le serveur ne
 * fait plus que servir — ce qui, lui, tient largement dans l'enveloppe.
 *
 * Trois dossiers sont écartés du résultat :
 * - `cache`, un demi-gigaoctet d'artefacts de compilation, inutiles à
 *   l'exécution et qui feraient exploser le temps de transfert ;
 * - `standalone`, une seconde copie du serveur qui ne sert qu'aux conteneurs ;
 * - `dev`, propre au serveur de développement.
 *
 * Ce qui reste est exactement ce que `next start` attend.
 *
 * `public` voyage avec le build, et pas seulement par le dépôt.
 *
 * `next start` sert ce dossier depuis le disque du serveur au moment de la
 * requête : il ne fait pas partie de `.next` et n'arrivait donc que par
 * `git pull`. Une vidéo ajoutée au hero est partie en ligne sans ses
 * fichiers, et le site est retombé sur son fond de secours sans rien
 * signaler. Un déploiement doit emporter tout ce que le site sert, sans
 * dépendre d'une commande qu'on peut oublier.
 *
 * Usage : `npm run package`
 */

const root = process.cwd();
const source = path.join(root, ".next");
const target = path.join(root, "deploy", ".next");
const publicSource = path.join(root, "public");
const publicTarget = path.join(root, "deploy", "public");
const SKIP = new Set(["cache", "standalone", "dev"]);

if (!fs.existsSync(source)) {
  console.error("Aucun build trouvé. Lancez `npm run build` d'abord.");
  process.exit(1);
}

if (!fs.existsSync(publicSource)) {
  console.error("Dossier public introuvable : le site serait livré sans ses images.");
  process.exit(1);
}

fs.rmSync(path.join(root, "deploy"), { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(publicSource, publicTarget, { recursive: true });

let files = 0;
let bytes = 0;

for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
  if (SKIP.has(entry.name)) continue;
  const from = path.join(source, entry.name);
  const to = path.join(target, entry.name);
  fs.cpSync(from, to, { recursive: true });
}

/** Parcourt le résultat pour annoncer ce qu'il y a réellement à transférer. */
function measure(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) measure(full);
    else {
      files += 1;
      bytes += fs.statSync(full).size;
    }
  }
}

measure(target);
measure(publicTarget);

/*
 * Une archive plutôt que 516 fichiers : un seul transfert, aucun risque
 * d'oubli en cours de route, et bien plus rapide qu'un dépôt fichier par
 * fichier sur une liaison SFTP.
 */
const { execFileSync } = await import("node:child_process");
execFileSync("tar", ["-czf", "next-build.tar.gz", ".next", "public"], {
  cwd: path.join(root, "deploy"),
});
const archive = fs.statSync(path.join(root, "deploy", "next-build.tar.gz")).size;

console.log(`Dossier prêt : deploy/.next et deploy/public`);
console.log(`${files} fichiers, ${(bytes / 1024 / 1024).toFixed(1)} Mo`);
console.log("");
console.log(
  `Archive : deploy/next-build.tar.gz — ${(archive / 1024 / 1024).toFixed(1)} Mo`,
);
console.log("À envoyer à la racine du site, puis à extraire sur place.");
