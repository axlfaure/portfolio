import { ImageResponse } from "next/og";
import { CarteOg, TAILLE_OG, visuelEnBase64 } from "@/lib/og";
import { getProject } from "@/lib/content";

/**
 * Vignette de partage d'un projet, avec son visuel de couverture.
 *
 * C'est la seule image du travail que voit quelqu'un à qui on envoie le lien
 * dans une conversation, et elle vaut mieux qu'une carte générique répétée
 * quatorze fois.
 */
export const alt = "Projet réalisé par Axel Faure";
export const size = TAILLE_OG;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  return new ImageResponse(
    (
      <CarteOg
        eyebrow={project?.client ?? "Projet"}
        titre={project?.title ?? "Projet"}
        visuel={await visuelEnBase64(project?.cover)}
      />
    ),
    size,
  );
}
