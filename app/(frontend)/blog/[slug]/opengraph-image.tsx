import { ImageResponse } from "next/og";
import { CarteOg, POLICES_OG, TAILLE_OG, visuelEnBase64 } from "@/lib/og";
import { getPost } from "@/lib/content";

/** Vignette de partage d'un article. */
export const alt = "Article d'Axel Faure";
export const size = TAILLE_OG;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    (
      <CarteOg
        eyebrow="Journal"
        titre={post?.title ?? "Article"}
        visuel={await visuelEnBase64(post?.cover)}
      />
    ),
    { ...size, fonts: POLICES_OG },
  );
}
