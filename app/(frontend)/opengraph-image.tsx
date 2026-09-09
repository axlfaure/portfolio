import { ImageResponse } from "next/og";
import { MONOGRAMME_OG, POLICES_OG, TAILLE_OG, px } from "@/lib/og";
import { site } from "@/lib/site";

/**
 * Vignette de partage de la page d'accueil.
 *
 * C'est la première image qu'un prospect voit du travail, avant même d'avoir
 * ouvert la page : une adresse collée dans LinkedIn, WhatsApp ou un mail sort
 * sinon en bloc de texte gris.
 *
 * Elle ne passe pas par `CarteOg` : les pages intérieures annoncent un projet
 * ou un article, celle-ci annonce quelqu'un. Elle porte donc le nom et la
 * baseline, là où les autres portent un titre et un visuel.
 *
 * Toutes les mesures sont écrites dans le repère de mille deux cents par six
 * cent trente et passées par `px`, qui les porte à la résolution de rendu.
 * C'est ce qui permet de dessiner en pensant à la dimension attendue tout en
 * livrant deux fois plus de détail aux réseaux, qui réduisent et recompressent
 * avant d'afficher.
 *
 * Elle se remplace par un `opengraph-image.jpg` posé dans ce dossier, à
 * condition de supprimer ce fichier : les deux se cumuleraient.
 */
export const alt = `${site.name}, ${site.baseline}`;
export const size = TAILLE_OG;
export const contentType = "image/png";

const INK = "#16171A";
const PAPIER = "#F3F3F4";
const ACCENT = "#2F42D8";
const GRIS = "#62656B";

/* eslint-disable @next/next/no-img-element --
   ImageResponse compose côté serveur avec Satori, où next/image n'a pas cours. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPIER,
        color: INK,
        padding: `${px(70)}px ${px(84)}px`,
        fontFamily: "Jakarta",
        position: "relative",
      }}
    >
      {/* Le monogramme en grand, débordant du cadre. Il occupe la moitié
          droite que la version précédente laissait vide, sans jamais devenir
          une image : à 5 % il fait une texture. */}
      {MONOGRAMME_OG && (
        <img
          src={MONOGRAMME_OG}
          alt=""
          width={px(900)}
          height={px(674)}
          style={{ position: "absolute", right: px(-285), top: px(-25), opacity: 0.055 }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: px(26) }}>
        {MONOGRAMME_OG && (
          <>
            <img src={MONOGRAMME_OG} alt="" width={px(78)} height={px(58)} />
            <div
              style={{
                display: "flex",
                width: px(1),
                height: px(36),
                background: "#D5D6D9",
              }}
            />
          </>
        )}
        {/* Vingt-quatre et non vingt : réduite à la largeur d'un encart
            LinkedIn, cette ligne tombait sous douze pixels, taille à laquelle
            une capitale espacée ne survit pas à une recompression. */}
        <div
          style={{
            display: "flex",
            fontSize: px(24),
            letterSpacing: px(4),
            textTransform: "uppercase",
            color: GRIS,
          }}
        >
          {site.city} · Isère
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{ display: "flex", fontSize: px(92), letterSpacing: px(-3.5) }}
        >
          {site.name}
        </div>
        {/* Même partition que les titres du site : le sans tient l'énoncé, la
            serif italique porte le mot qui compte. L'alignement se fait sur la
            ligne de pied et non sur le bas des boîtes, sinon les jambages de
            l'italique remontent tout le second membre.

            Les deux corps ne sont pas égaux parce que les deux polices n'ont
            pas la même hauteur d'œil : 0,544 em pour Jakarta, 0,510 pour
            Instrument Serif. À corps égal, la serif paraîtrait plus petite.
            45 sur 42, c'est le rapport 0,544 / 0,510. */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: px(16),
            marginTop: px(14),
          }}
        >
          <div style={{ display: "flex", fontSize: px(42), color: "#2E3035" }}>
            Studio créatif
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument",
              fontStyle: "italic",
              fontSize: px(45),
              color: ACCENT,
              lineHeight: 1,
            }}
          >
            tech &amp; industrie
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: px(22) }}>
        <div
          style={{ display: "flex", width: px(88), height: px(3), background: INK }}
        />
        {/* Vingt-sept et non vingt-trois, pour la même raison que le surtitre :
            c'est la ligne qui partait la première en bouillie. */}
        <div style={{ display: "flex", fontSize: px(27), color: GRIS }}>
          Branding · Salon &amp; print · Web · 3D &amp; motion
        </div>
      </div>
    </div>,
    { ...size, fonts: POLICES_OG },
  );
}
