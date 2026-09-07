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

/**
 * Forme des dossiers produits par la sauvegarde : `2026-09-07-21h45`.
 *
 * Le filtre n'est pas une précaution de trop. Une version précédente prenait
 * simplement le dernier dossier par ordre alphabétique, et les dossiers de
 * service rangés à côté, dont le nom commence par une lettre, passaient après
 * les dates. Le script visait alors le mauvais contenu.
 */
const HORODATAGE = /^\d{4}-\d{2}-\d{2}-\d{2}h\d{2}$/;

const A_INSTALLER = [".data", "media"];

console.log("1/2  Récupération du contenu en ligne\n");
execFileSync("node", ["scripts/backup.mjs"], { stdio: "inherit" });

const dates = fs
  .readdirSync("backups")
  .filter((nom) => HORODATAGE.test(nom))
  .sort();

if (dates.length === 0) {
  console.error("\nAucune sauvegarde horodatée trouvée dans backups/.");
  process.exit(1);
}

const source = path.join("backups", dates[dates.length - 1]);
console.log(`\n2/2  Installation depuis ${source}`);

/*
 * L'état local part dans une copie datée avant d'être remplacé. Son nom ne
 * dérive pas de celui de la sauvegarde : c'est ce qui empilait les suffixes
 * « remplacé » les uns sur les autres à chaque passage.
 */
const horodatage = new Date()
  .toISOString()
  .slice(0, 16)
  .replace("T", "-")
  .replace(":", "h");

const precedent = path.join("backups", `avant-sync-${horodatage}`);
fs.mkdirSync(precedent, { recursive: true });
for (const item of A_INSTALLER) {
  if (fs.existsSync(item)) {
    fs.cpSync(item, path.join(precedent, item), { recursive: true });
  }
}

/*
 * Le fichier de base est verrouillé tant qu'un serveur le tient ouvert, et
 * Windows refuse alors de le remplacer. Le message doit dire quoi faire :
 * une trace d'erreur brute laisse croire à une corruption alors qu'il n'y a
 * rien de cassé.
 */
try {
  for (const item of A_INSTALLER) {
    const depuis = path.join(source, item);
    if (!fs.existsSync(depuis)) continue;
    fs.rmSync(item, { recursive: true, force: true });
    fs.cpSync(depuis, item, { recursive: true });
  }
} catch (error) {
  const verrou = error.code === "EPERM" || error.code === "EBUSY";
  console.error("");
  console.error(
    verrou
      ? "Impossible de remplacer le contenu local : un programme tient les fichiers ouverts."
      : `Échec de l'installation : ${error.message}`,
  );
  if (verrou) {
    console.error("");
    console.error("C'est presque toujours le serveur de développement.");
    console.error("Arrêtez-le, puis relancez `npm run sync`.");
    console.error("");
    console.error(`Rien n'est perdu : le contenu du serveur attend dans ${source},`);
    console.error(`et l'état local a été copié dans ${precedent}.`);
  }
  process.exit(1);
}

console.log("");
console.log(`Contenu local aligné sur le serveur (état précédent : ${precedent}).`);

/*
 * La base qui vient d'arriver porte le schéma du serveur, donc celui d'avant
 * le déploiement en cours. Compiler dessus échoue dès que le code a gagné un
 * champ : le build réclame une colonne que cette base n'a pas encore.
 *
 * La mise à niveau est donc enchaînée ici, et non laissée à la mémoire de
 * celui qui déploie. C'est exactement la même commande que sur le serveur.
 */
console.log("");
console.log("3/3  Mise à niveau du schéma local\n");
execFileSync("node", ["scripts/db-sync.mjs"], { stdio: "inherit" });

console.log("");
console.log("La compilation peut maintenant partir : npm run build");
