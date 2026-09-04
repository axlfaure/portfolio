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
 * Usage : `npm run package`
 */

const root = process.cwd();
const source = path.join(root, ".next");
const target = path.join(root, "deploy", ".next");
const SKIP = new Set(["cache", "standalone", "dev"]);

if (!fs.existsSync(source)) {
  console.error("Aucun build trouvé. Lancez `npm run build` d'abord.");
  process.exit(1);
}

fs.rmSync(path.join(root, "deploy"), { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

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

console.log(`Dossier prêt : deploy/.next`);
console.log(`${files} fichiers, ${(bytes / 1024 / 1024).toFixed(1)} Mo`);
console.log("");
console.log("À envoyer à la racine du site, en remplaçant le .next existant.");
