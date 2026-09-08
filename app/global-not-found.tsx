import type { Metadata } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import Link from "next/link";
import { ErrorScreen } from "@/components/sections/ErrorScreen";
import { GhostButton } from "@/components/ui/GhostButton";
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
 * Le fichier rend le document entier et ne partage donc rien avec le reste du
 * site : ni en-tête, ni pied de page, ni polices. Les trois familles sont
 * rechargées ici parce que la composition en dépend — la chasse fixe porte le
 * grand nombre, l'italique porte l'accent. Une page d'erreur nue sur un site
 * de graphiste est un contresens, et celle-ci ne se voit presque jamais : le
 * poids se justifie.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page introuvable · Axel Faure",
  description: "Cette adresse ne correspond à aucune page du site.",
};

export default function GlobalNotFound() {
  return (
    /* `data-js` conditionne les animations du site. Il n'y a pas une ligne de
       JavaScript ici, mais le trait tracé sous l'accent est une animation CSS
       pure : l'attribut suffit à la déclencher. */
    <html
      lang="fr"
      data-js="1"
      className={`${jakarta.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      <body>
        <ErrorScreen
          code="404"
          animerAccent={false}
          plein
          eyebrow="Erreur 404"
          titleStart="Cette adresse ne mène"
          titleAccent="nulle part."
          lead="Le lien est peut-être ancien, ou l'adresse mal recopiée. Rien de perdu : tout le site tient en trois pages."
          actions={
            <>
              <GhostButton href="/">Retour à l&apos;accueil</GhostButton>
              <GhostButton href="/projets">Voir les réalisations</GhostButton>
              <GhostButton href="/services">Voir les services</GhostButton>
            </>
          }
          footnote={
            <>
              Vous cherchiez quelque chose de précis ?{" "}
              <Link
                href="/#contact"
                className="font-semibold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
              >
                Dites-le moi
              </Link>
              , je vous enverrai le bon lien.
            </>
          }
        />
      </body>
    </html>
  );
}
