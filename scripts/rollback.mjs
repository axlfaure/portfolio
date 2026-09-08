import { connect } from "./remote.mjs";

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
 * Seul `.next` est concerné : les fichiers statiques et les sources viennent
 * du dépôt, et un retour en arrière côté build ne les touche pas. Si la
 * version fautive tenait à une source, c'est un `git checkout` qu'il faut,
 * pas cette commande.
 *
 * Usage : `npm run rollback`
 */

const server = connect();

const swap = [
  "set -e",
  `cd '${server.dir}'`,
  "test -f package.json",
  "test -d .next.old",
  "rm -rf .next.swap",
  "mv .next .next.swap",
  "mv .next.old .next",
  "mv .next.swap .next.old",
  'echo "BUILD_ID rétabli : $(cat .next/BUILD_ID)"',
].join("\n");

server.run(swap);

console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
