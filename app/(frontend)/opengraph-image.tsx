import { ImageResponse } from "next/og";
import { MONOGRAMME_OG, POLICES_OG, TAILLE_OG } from "@/lib/og";
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
 * Elle se remplace par un `opengraph-image.jpg` de 1200 × 630 posé dans ce
 * dossier, à condition de supprimer ce fichier : les deux se cumuleraient.
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
        padding: "70px 84px",
        fontFamily: "Jakarta",
        position: "relative",
      }}
    >
      {/* Le monogramme en grand, débordant du cadre. Il occupe la moitié
          droite que la version précédente laissait vide, sans jamais devenir
          une image : à 5 % il fait une texture. Il est décalé assez à droite
          pour ne pas passer sous la baseline, qui perdait en netteté. */}
      {MONOGRAMME_OG && (
        <img
          src={MONOGRAMME_OG}
          alt=""
          width={900}
          height={674}
          style={{ position: "absolute", right: -285, top: -25, opacity: 0.055 }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        {MONOGRAMME_OG && (
          <>
            <img src={MONOGRAMME_OG} alt="" width={78} height={58} />
            <div
              style={{ display: "flex", width: 1, height: 36, background: "#D5D6D9" }}
            />
          </>
        )}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: GRIS,
          }}
        >
          {site.city} · Isère
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 92, letterSpacing: -3.5 }}>
          {site.name}
        </div>
        {/* Même partition que les titres du site : le sans tient l'énoncé, la
            serif italique porte le mot qui compte. L'alignement se fait sur la
            ligne de pied et non sur le bas des boîtes, sinon les jambages de
            l'italique remontent tout le second membre.

            Les deux corps ne sont pas égaux parce que les deux polices n'ont
            pas la même hauteur d'œil : 0,544 em pour Jakarta, 0,510 pour
            Instrument Serif. À corps égal, la serif paraîtrait plus petite.
            45 sur 42, c'est le rapport 0,544 / 0,510 : les minuscules des deux
            membres montent alors exactement à la même hauteur. */}
        <div
          style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 14 }}
        >
          <div style={{ display: "flex", fontSize: 42, color: "#2E3035" }}>
            Studio créatif
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument",
              fontStyle: "italic",
              fontSize: 45,
              color: ACCENT,
              lineHeight: 1,
            }}
          >
            tech &amp; industrie
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", width: 88, height: 3, background: INK }} />
        <div style={{ display: "flex", fontSize: 23, color: GRIS }}>
          Branding · Salon &amp; print · Web · 3D &amp; motion
        </div>
      </div>
    </div>,
    { ...size, fonts: POLICES_OG },
  );
}
