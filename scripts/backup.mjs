import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { connect } from "./remote.mjs";

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
 * Le serveur assemble l'archive et l'envoie par la sortie standard, en une
 * seule connexion. Infomaniak n'accepte pas encore l'authentification par
 * clé : chaque connexion réclame le mot de passe, autant n'en ouvrir qu'une.
 *
 * Le sens inverse n'existe pas volontairement : remonter une base locale
 * écraserait le vrai contenu par une copie périmée.
 *
 * Usage : `npm run backup`
 */

const server = connect();

const stamp = new Date()
  .toISOString()
  .slice(0, 16)
  .replace("T", "-")
  .replace(":", "h");

const dir = path.join("backups", stamp);
fs.mkdirSync(dir, { recursive: true });

/*
 * `media` peut ne pas exister encore sur une installation neuve. `tar` s'y
 * arrêterait et ne renverrait rien du tout, base comprise : on ne lui donne
 * donc que ce qui est réellement présent.
 */
const collect = [
  "set -e",
  `cd '${server.dir}'`,
  "test -f .data/site.db",
  "if [ -d media ]; then tar -czf - .data/site.db media; else tar -czf - .data/site.db; fi",
].join("\n");

console.log(`Destination : ${dir}`);
console.log("Le mot de passe SSH est demandé une fois.\n");

const archive = server.run(collect, {
  stdio: ["inherit", "pipe", "inherit"],
  maxBuffer: 512 * 1024 * 1024,
});

const tarball = path.join(dir, "contenu.tar.gz");
fs.writeFileSync(tarball, archive);
execFileSync("tar", ["-xzf", "contenu.tar.gz"], { cwd: dir });
fs.rmSync(tarball);

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
console.log(`  cp ${path.join(dir, ".data", "site.db")} .data/site.db`);
console.log(`  cp -r ${path.join(dir, "media")}/. media/`);
