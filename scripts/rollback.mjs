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
 * `public` suit le même chemin depuis que le déploiement l'emporte : revenir
 * au build précédent sans ses fichiers statiques rendrait un site dont le code
 * et les images ne datent pas du même jour. La bascule reste facultative, les
 * serveurs déployés avant ce changement n'ayant pas de `public.old`.
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
  "if [ -d public.old ]; then rm -rf public.swap; mv public public.swap; mv public.old public; mv public.swap public.old; fi",
  'echo "BUILD_ID rétabli : $(cat .next/BUILD_ID)"',
].join("\n");

server.run(swap);

console.log("");
console.log("Il reste à redémarrer l'application depuis le Manager Infomaniak.");
