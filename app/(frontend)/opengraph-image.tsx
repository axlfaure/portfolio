import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Vignette de partage du site.
 *
 * Sans elle, une adresse collée dans LinkedIn, WhatsApp ou un mail sort en
 * bloc de texte gris : pour un portfolio de graphiste, c'est la première
 * image qu'on donne de son travail, et elle est absente.
 *
 * L'image est dessinée en code plutôt que déposée en fichier pour qu'elle
 * suive la baseline et le nom du site sans qu'on ait à la réexporter. Elle se
 * remplace par un `opengraph-image.jpg` de 1200 × 630 posé dans ce dossier,
 * à condition de supprimer ce fichier : les deux se cumuleraient sinon.
 *
 * Pas de police de marque ici : `ImageResponse` ne lit que des fichiers de
 * police sur le disque, or les nôtres sont téléchargées au build par
 * `next/font`. La composition tient donc sur la mise en page seule.
 */
export const alt = `${site.name} — ${site.baseline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F3F3F4",
        color: "#16171A",
        padding: "76px 84px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#62656B",
        }}
      >
        {site.city} · Isère
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 86, fontWeight: 700, letterSpacing: -3 }}>
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 40,
            lineHeight: 1.3,
            color: "#2E3035",
            maxWidth: 820,
          }}
        >
          {site.baseline}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", width: 96, height: 4, background: "#2F42D8" }} />
        <div style={{ display: "flex", fontSize: 24, color: "#62656B" }}>
          Branding · Salon &amp; print · Web · 3D &amp; motion
        </div>
      </div>
    </div>,
    size,
  );
}
