import { ImageResponse } from "next/og";
import { CarteOg, POLICES_OG, TAILLE_OG, visuelEnBase64 } from "@/lib/og";
import { getService } from "@/lib/content";

/** Vignette de partage d'une page service. */
export const alt = "Service proposé par Axel Faure";
export const size = TAILLE_OG;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  return new ImageResponse(
    (
      <CarteOg
        eyebrow="Service"
        titre={service?.title ?? "Service"}
        pied={service?.short}
        visuel={await visuelEnBase64(service?.visual ?? service?.contextImage)}
      />
    ),
    { ...size, fonts: POLICES_OG },
  );
}
