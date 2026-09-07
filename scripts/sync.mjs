import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

/**
 * Aligne le contenu local sur celui du serveur.
 *
 * Nécessaire avant toute compilation destinée à la mise en ligne. Les pages
 * sont pré-rendues en HTML au moment du build, à partir de la base présente
 * sur la machine qui compile. Construire depuis une base locale périmée, puis
 * déployer, repousserait cet ancien contenu par-dessus celui rédigé dans
 * l'administration : la base du serveur resterait intacte, mais les pages
 * servies montreraient l'état d'avant, jusqu'à la prochaine revalidation.
 *
 * Le sens reste unique : le serveur fait autorité sur le contenu, la machine
 * de développement fait autorité sur le code.
 *
 * Usage : `npm run sync`
 */

console.log("1/2  Récupération du contenu en ligne\n");
execFileSync("node", ["scripts/backup.mjs"], { stdio: "inherit" });

const latest = fs.readdirSync("backups").sort().pop();
const source = path.join("backups", latest);

console.log(`\n2/2  Installation depuis ${source}`);

/*
 * L'état local part dans une copie datée avant d'être remplacé. Il ne vaut
 * pas grand-chose, mais l'écraser sans filet pour un simple confort serait un
 * mauvais réflexe à installer dans un script.
 */
const previous = path.join("backups", `${latest}-remplacé`);
fs.mkdirSync(previous, { recursive: true });
for (const item of [".data", "media"]) {
  if (fs.existsSync(item)) {
    fs.cpSync(item, path.join(previous, item), { recursive: true });
  }
}

for (const item of [".data", "media"]) {
  const from = path.join(source, item);
  if (!fs.existsSync(from)) continue;
  fs.rmSync(item, { recursive: true, force: true });
  fs.cpSync(from, item, { recursive: true });
}

console.log("");
console.log("Contenu local aligné sur le serveur.");
console.log(`L'état précédent est conservé dans ${previous}`);
console.log("");
console.log("La compilation peut maintenant partir : npm run build");
