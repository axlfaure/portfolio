import { readFileSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { site } from "./site";

/**
 * Fabrique des vignettes de partage.
 *
 * Une vignette générique pour tout le site vaut mieux que rien, mais elle dit
 * la même chose de la page d'accueil et d'un projet précis. Chaque projet,
 * service et article a donc la sienne, avec son visuel : c'est la seule image
 * du travail que voit quelqu'un à qui on envoie un lien dans une conversation.
 *
 * Deux contraintes dictent la mise en œuvre.
 *
 * `ImageResponse` ne charge pas d'image par le réseau au moment du build : le
 * site n'est pas encore servi quand ses propres vignettes se calculent. Le
 * fichier est donc lu sur le disque et incorporé en URL de données.
 *
 * Et une vignette n'est jamais assez importante pour faire échouer un build.
 * Toute lecture qui échoue rend `null`, et la composition retombe alors sur sa
 * moitié typographique, qui se suffit à elle-même.
 */

/**
 * Taille des vignettes de partage.
 *
 * Mille deux cents par six cent trente est la dimension attendue, mais on rend
 * au double. Les réseaux ne servent jamais le fichier tel quel : ils le
 * réduisent à la taille de leur encart, puis le recompressent, et une image
 * calée pile sur la dimension nominale n'a alors plus aucune réserve de
 * détail. Le résultat était net au pixel dans le fichier d'origine et flou
 * dans l'aperçu LinkedIn, vérification faite des deux côtés.
 *
 * Au double, leur réduction part d'une matière suffisante et le texte tient.
 * Le poids passe d'une cinquantaine de kilooctets à environ deux cents, très
 * loin des cinq mégaoctets qu'ils acceptent.
 */
export const ECHELLE_OG = 2;

export const TAILLE_OG = {
  width: 1200 * ECHELLE_OG,
  height: 630 * ECHELLE_OG,
};

/** Convertit une mesure dessinée en 1200 × 630 vers la taille de rendu. */
export const px = (valeur: number) => valeur * ECHELLE_OG;

/** Lecture au chargement du module, donc au build, jamais à la requête. */
function lireOuNull(relatif: string) {
  try {
    return readFileSync(path.join(process.cwd(), relatif));
  } catch {
    return null;
  }
}

/**
 * Polices de marque des vignettes.
 *
 * `ImageResponse` ne sait lire que des fichiers de police posés sur le disque,
 * et il ignore le WOFF2. Les deux TTF de `assets/polices` sont là pour lui
 * seul : `next/font` télécharge les siens au build sans exposer de chemin.
 *
 * Si les fichiers manquent, on rend `undefined` et non un tableau vide :
 * Satori refuse de composer sans aucune police et la vignette partirait en
 * erreur, alors qu'`ImageResponse` sait très bien retomber sur la sienne. La
 * carte sera moins jolie, elle ne sera pas absente. L'avertissement est là
 * pour qu'une police disparue se voie au build, sans l'interrompre.
 */
const jakarta = lireOuNull("assets/polices/PlusJakartaSans-Bold.ttf");
const instrument = lireOuNull("assets/polices/InstrumentSerif-Italic.ttf");

const polices = [
  jakarta && {
    name: "Jakarta",
    data: jakarta,
    weight: 700 as const,
    style: "normal" as const,
  },
  instrument && {
    name: "Instrument",
    data: instrument,
    weight: 400 as const,
    style: "italic" as const,
  },
].filter((police) => police !== null);

if (polices.length < 2) {
  console.warn(
    "[og] polices de marque introuvables dans assets/polices, " +
      "les vignettes de partage sortiront dans la police par défaut.",
  );
}

export const POLICES_OG = polices.length > 0 ? polices : undefined;

/** Monogramme incorporé, ou `null` si le fichier a disparu. */
const logo = lireOuNull("public/logo.png");
export const MONOGRAMME_OG = logo
  ? `data:image/png;base64,${logo.toString("base64")}`
  : null;

/** Dossier des médias, tel que le configure la collection Media. */
const dossierMedias = process.env.MEDIA_DIR
  ? path.resolve(process.env.MEDIA_DIR)
  : path.resolve(process.cwd(), "media");

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/**
 * Lit un visuel du CMS et le rend en URL de données.
 *
 * Payload range à côté de chaque fichier ses versions redimensionnées, sous la
 * forme `nom-900x506.jpg`. On garde celle de 900 px, bien que la vignette lui
 * réserve mille pixels depuis le passage au rendu double. Une variante de mille
 * six cents existe, mais la carte pèse déjà plus d'un mégaoctet : la prendre la
 * doublerait pour rattraper un agrandissement de 1,11, que la réduction du
 * réseau destinataire effacera de toute façon. Incorporer l'original de quatre
 * mille pixels, lui, ferait plusieurs mégaoctets pour rien.
 */
export async function visuelEnBase64(src: string | null | undefined) {
  if (!src) return null;

  try {
    const fichier = decodeURIComponent(src.split("/").pop() ?? "");
    if (!fichier) return null;

    const ext = path.extname(fichier).toLowerCase();
    const type = TYPES[ext];
    if (!type) return null;

    const base = path.basename(fichier, ext);
    const entrees = await readdir(dossierMedias);
    const variante = entrees.find((nom) =>
      new RegExp(`^${echapper(base)}-900x\\d+${echapper(ext)}$`).test(nom),
    );

    const choisi = variante ?? (entrees.includes(fichier) ? fichier : null);
    if (!choisi) return null;

    const donnees = await readFile(path.join(dossierMedias, choisi));
    return `data:${type};base64,${donnees.toString("base64")}`;
  } catch {
    // Fichier absent, dossier mal configuré, droits manquants : la vignette
    // se passera de visuel plutôt que d'interrompre le build.
    return null;
  }
}

function echapper(texte: string) {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Composition commune des vignettes.
 *
 * Deux colonnes quand il y a un visuel, une seule sinon. Le monogramme tient
 * le haut de la colonne de texte, comme sur la vignette d'accueil : c'est ce
 * qui fait qu'un lien de projet et un lien de page d'accueil se reconnaissent
 * comme venant du même endroit dans un fil de discussion.
 */
export function CarteOg({
  eyebrow,
  titre,
  pied,
  visuel,
}: {
  eyebrow: string;
  titre: string;
  pied?: string;
  visuel?: string | null;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#F3F3F4",
        color: "#16171A",
        fontFamily: "Jakarta",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${px(68)}px ${px(64)}px`,
          width: visuel ? px(700) : px(1200),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: px(22) }}>
          {MONOGRAMME_OG && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element --
                  Satori compose côté serveur, next/image n'y a pas cours. */}
              <img src={MONOGRAMME_OG} alt="" width={px(62)} height={px(46)} />
              <div
                style={{
                  display: "flex",
                  width: px(1),
                  height: px(28),
                  background: "#D5D6D9",
                }}
              />
            </>
          )}
          <div
            style={{
              display: "flex",
              fontSize: px(24),
              letterSpacing: px(4),
              textTransform: "uppercase",
              color: "#62656B",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titre.length > 64 ? px(46) : px(58),
            fontWeight: 700,
            letterSpacing: px(-2),
            lineHeight: 1.12,
            maxWidth: visuel ? px(560) : px(900),
          }}
        >
          {titre}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: px(18) }}>
          <div
            style={{ display: "flex", width: px(74), height: px(4), background: "#2F42D8" }}
          />
          <div style={{ display: "flex", fontSize: px(27), color: "#62656B" }}>
            {pied ?? `${site.name} · ${site.city}`}
          </div>
        </div>
      </div>

      {visuel && (
        <div style={{ display: "flex", width: px(500), height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element --
              ImageResponse ne connaît que <img> : il compose l'image sur le
              serveur avec Satori, où next/image n'a pas cours. */}
          <img
            src={visuel}
            alt=""
            width={px(500)}
            height={px(630)}
            style={{ width: px(500), height: px(630), objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
