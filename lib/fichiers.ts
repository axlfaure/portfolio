/**
 * Nature d'un fichier, déduite de son extension.
 *
 * Ces deux fonctions vivaient dans `lib/payload.ts`, et c'était une faute de
 * rangement aux conséquences très concrètes : ce module ouvre la connexion à
 * Payload. Le moindre composant client qui l'atteignait, fût-ce pour une
 * comparaison de chaîne, emportait toute la configuration du CMS dans le
 * paquet du navigateur — et la compilation s'arrêtait sur `revalidatePath`,
 * qui n'a rien à y faire.
 *
 * Elles sont donc ici, sans aucun import. Un module que le serveur et le
 * navigateur peuvent charger l'un comme l'autre.
 *
 * L'extension suffit à trancher : la collection Media accepte les images
 * comme les vidéos, rien n'empêche de déposer un `.webm` dans un champ qui
 * attend une photo, et Payload conserve le nom du fichier d'origine.
 */

const IMAGES = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const VIDEOS = /\.(mp4|webm|mov|m4v)$/i;

/** Le fichier est-il une image affichable ? */
export function estImage(src: string | null | undefined): src is string {
  return typeof src === "string" && IMAGES.test(src.split("?")[0]);
}

/** Le fichier est-il une vidéo lisible ? */
export function estVideo(src: string | null | undefined): src is string {
  return typeof src === "string" && VIDEOS.test(src.split("?")[0]);
}
