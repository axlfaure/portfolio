import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath } from "next/cache";

/**
 * Purge du cache après publication.
 *
 * Sans ce crochet, le CMS serait décoratif : les pages du site sont générées
 * statiquement, donc une modification enregistrée dans l'admin ne serait
 * visible qu'au prochain déploiement. C'est le piège classique d'une bascule
 * vers un CMS sur un site statique.
 *
 * On invalide large plutôt que fin : le site tient en une trentaine de pages,
 * et un chemin oublié coûte bien plus cher qu'une regénération de trop.
 */
export function revalidate(paths: (doc: Record<string, unknown>) => string[]) {
  const purge = (doc: Record<string, unknown>) => {
    // `revalidatePath` exige le contexte d'une requête Next. Les mêmes crochets
    // se déclenchent aussi hors de ce contexte — script de reprise, migration,
    // commande en ligne — où il n'y a aucun cache à purger puisque le serveur
    // ne tourne pas. On ignore alors l'échec plutôt que de faire tomber
    // l'écriture : c'est la publication qui compte, pas la purge.
    try {
      for (const path of paths(doc)) {
        revalidatePath(path);
      }
    } catch {
      return;
    }
  };

  const afterChange: CollectionAfterChangeHook = ({ doc }) => {
    purge(doc as Record<string, unknown>);
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    purge(doc as Record<string, unknown>);
    return doc;
  };

  return { afterChange: [afterChange], afterDelete: [afterDelete] };
}

/** Pages qui agrègent du contenu : elles bougent dès qu'un document change. */
export const HOME = "/";
