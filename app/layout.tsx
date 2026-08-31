import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Axel Faure · Designer freelance tech et industrie à Grenoble",
    template: "%s · Axel Faure",
  },
  description:
    "Studio créatif tech & industrie à Grenoble. Branding, supports salon et print, sites web et interfaces pour les structures de la recherche, de l'innovation et de l'industrie.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F3F3F4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      data-js="1"
      className={`${jakarta.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Sans JavaScript, les animations ne doivent jamais masquer le
            contenu. Rendu côté serveur, donc aucun script et aucun écart
            d'hydratation sur <html>. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal],[data-hero-step]{opacity:1!important;transform:none!important;animation:none!important}",
            }}
          />
        </noscript>
      </head>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Aller au contenu
        </a>
        <SmoothScroll />
        <RevealObserver />
        <Nav />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
