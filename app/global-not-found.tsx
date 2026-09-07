import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/**
 * Page 404 des adresses qui ne correspondent à aucune route.
 *
 * Elle double `(frontend)/not-found.tsx`, qui ne répond qu'aux `notFound()`
 * des pages projet, service et article. Une adresse mal recopiée, elle,
 * n'appartient à aucun groupe de routes : le site en ayant deux, l'un public
 * et l'un pour l'administration, Next n'a pas de mise en page racine où poser
 * un 404 commun. C'est le cas que `globalNotFound` est fait pour couvrir.
 *
 * Le fichier rend le document entier, mise en page comprise, et ne partage
 * donc rien avec le reste du site : ni en-tête, ni pied de page, ni le reste
 * des polices. On s'en tient à l'essentiel, et surtout à une sortie.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page introuvable · Axel Faure",
  description: "Cette adresse ne correspond à aucune page du site.",
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body>
        <div className="container-site section">
          <p className="eyebrow">Erreur 404</p>

          <h1 className="h2 mt-5 max-w-[18ch]">
            Cette adresse ne mène nulle part.
          </h1>

          <p className="lead mt-5 max-w-[46ch]">
            Le lien est peut-être ancien, ou l&apos;adresse mal recopiée.
          </p>

          <p className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-[0.9rem] font-semibold text-ink-2 transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              Retour à l&apos;accueil <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
