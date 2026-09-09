/**
 * Fabrique le jeu d'icônes du site à partir du monogramme.
 *
 *   node scripts/icones.mjs [sombre|clair]
 *
 * Produit le favicon, l'icône iOS, l'icône du navigateur et les trois tailles
 * du manifeste, puis les installe à leur place. À relancer si `public/logo.png`
 * change, ou pour basculer d'une variante à l'autre.
 *
 * Le favicon doit vivre à la racine de `app`, pas dans le groupe de routes :
 * un groupe n'est pas un segment, et Next n'y cherche pas les fichiers
 * d'icône. Il en manquait donc dans le HTML, et le site est resté sans favicon
 * pendant tout ce temps.
 *
 * ffmpeg fait le rendu, faute de sharp dans ce projet. L'assemblage du .ico
 * est écrit ici : le format accepte des PNG entiers comme images membres
 * depuis Vista, ce qui évite d'avoir à produire les bitmaps DIB à la main.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const INK = { hex: "0x16171A", r: 22, g: 23, b: 26 };
const PAPIER = { hex: "0xF3F3F4", r: 243, g: 243, b: 244 };

const VARIANTES = {
  sombre: { fond: INK, trait: PAPIER },
  clair: { fond: PAPIER, trait: INK },
};

const choix = process.argv[2] ?? "sombre";
const variante = VARIANTES[choix];
if (!variante) {
  console.error(`Variante inconnue : ${choix}. Attendu : sombre ou clair.`);
  process.exit(1);
}

const racine = process.cwd();
const LOGO = path.join(racine, "public/logo.png");
if (!fs.existsSync(LOGO)) {
  console.error("public/logo.png est introuvable.");
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "icones-"));

/**
 * Rend le monogramme centré sur un aplat opaque.
 *
 * L'ordre des filtres n'est pas indifférent : la couleur est appliquée AVANT
 * la réduction. Redimensionner d'abord mêlerait le noir d'origine aux pixels
 * semi-transparents des bords, et le trait sortirait cerné d'un liseré sombre
 * sur fond clair. En imposant une couleur uniforme à tout le calque, il ne
 * reste que l'alpha à interpoler, et le bord reste net.
 *
 * Sous 48 px, un trait fin ne couvre plus un pixel entier : la réduction le
 * rend à 40 % d'opacité et le monogramme sort gris au lieu de net. Une gamma
 * sur le seul canal alpha lui rend sa densité, sans toucher au dessin.
 *
 * Elle s'écrit `sqrt` et non `pow(x, 0.5)` pour une raison bête mais réelle :
 * la virgule sépare les filtres dans un filtergraph, et l'échapper à travers
 * les deux niveaux de lecture de ffmpeg demande un compte de barres obliques
 * que personne ne relira. `sqrt` n'en a pas besoin.
 */
function rendre({ taille, part, renfort = false, fichier }) {
  const largeur = Math.round(taille * part);
  const densite = renfort ? ",lut=a=sqrt(val/255)*255" : "";

  execFileSync("ffmpeg", [
    "-v", "error", "-y",
    "-f", "lavfi", "-i", `color=c=${variante.fond.hex}:s=${taille}x${taille}`,
    "-i", LOGO,
    "-filter_complex",
    `[1:v]format=rgba,` +
      `lutrgb=r=${variante.trait.r}:g=${variante.trait.g}:b=${variante.trait.b},` +
      `scale=${largeur}:-1:flags=lanczos${densite}[m];` +
      `[0:v][m]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgba`,
    "-frames:v", "1",
    fichier,
  ]);
  return fichier;
}

/** Assemble un .ico à partir de PNG déjà rendus. */
function ico(images, fichier) {
  const blobs = images.map((image) => fs.readFileSync(image.fichier));

  const entete = Buffer.alloc(6);
  entete.writeUInt16LE(1, 2);
  entete.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entrees = images.map((image, i) => {
    const entree = Buffer.alloc(16);
    // Une hauteur de 256 s'écrit 0 : l'octet ne va pas plus loin.
    entree.writeUInt8(image.taille >= 256 ? 0 : image.taille, 0);
    entree.writeUInt8(image.taille >= 256 ? 0 : image.taille, 1);
    entree.writeUInt16LE(1, 4);
    entree.writeUInt16LE(32, 6);
    entree.writeUInt32LE(blobs[i].length, 8);
    entree.writeUInt32LE(offset, 12);
    offset += blobs[i].length;
    return entree;
  });

  fs.writeFileSync(fichier, Buffer.concat([entete, ...entrees, ...blobs]));
}

const dans = (...bouts) => path.join(racine, ...bouts);

// Sans masque : le monogramme peut occuper largement le cadre.
rendre({ taille: 512, part: 0.72, fichier: dans("app/icon.png") });
rendre({ taille: 512, part: 0.72, fichier: dans("public/icone-512.png") });
rendre({ taille: 192, part: 0.72, fichier: dans("public/icone-192.png") });

// iOS rogne en superellipse : on rentre le dessin.
rendre({ taille: 180, part: 0.62, fichier: dans("app/apple-icon.png") });

// Android « maskable » peut rogner jusqu'au cercle inscrit à 80 %.
rendre({ taille: 512, part: 0.56, fichier: dans("public/icone-maskable-512.png") });

// Aux petites tailles, le trait s'efface : on lui laisse tout le cadre.
const membres = [256, 48, 32, 16].map((taille) => ({
  taille,
  fichier: rendre({
    taille,
    part: taille <= 48 ? 0.86 : 0.72,
    renfort: taille <= 48,
    fichier: path.join(tmp, `${taille}.png`),
  }),
}));
ico(membres, dans("app/favicon.ico"));

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Icônes installées, variante « ${choix} ».`);
