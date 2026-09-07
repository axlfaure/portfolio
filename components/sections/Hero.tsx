import Image from "next/image";
import Link from "next/link";
import { Counter } from "@/components/ui/Counter";
import { cn } from "@/lib/cn";
import { CtaButton } from "@/components/ui/CtaButton";
import { Avatar } from "@/components/ui/Media";
import { Stars } from "@/components/ui/Stars";
import { Ticker } from "@/components/ui/Ticker";
import { heroStats } from "@/lib/data";
import { getHero, getLogos } from "@/lib/content";
import type { HeroSection } from "@/lib/content";
import { clientFaces, site } from "@/lib/site";
import { HeroBackground } from "./HeroBackground";

/** Titre d'origine, servi tant que le global « Hero » n'est pas enregistré. */
const LIGNES_PAR_DEFAUT = [
  { before: "Votre", accent: "expertise", after: "est complexe." },
  { before: "Votre communication", accent: "ne devrait pas l'être.", after: "" },
];

export async function Hero() {
  const logos = await getLogos();
  const hero = await getHero();

  return (
    <section className="relative isolate -mt-20 overflow-hidden">
      <HeroBackground />

      <div className="mx-auto flex w-full max-w-[84rem] flex-col items-center px-[var(--gutter)] pb-[clamp(3.5rem,8vw,5.5rem)] pt-[calc(5rem+clamp(2.5rem,6vw,4.5rem))] text-center">
        <SocialProof preuve={hero?.socialProof} visages={hero?.faces} />

        {/* Chaque ligne entre séparément, et son accent se souligne d'un
            trait tracé. Les retards s'échelonnent depuis le code : ce sont des
            réglages d'animation, pas du contenu, ils n'ont rien à faire dans un
            formulaire de rédaction. */}
        <h1 className="h1-hero mt-9 w-full text-balance">
          {(hero?.lines ?? LIGNES_PAR_DEFAUT).map((ligne, i) => (
            <span
              key={ligne.accent}
              className="reveal-line"
              style={
                { "--line-delay": `${200 + i * 110}ms` } as React.CSSProperties
              }
            >
              {/* L'équilibrage porte sur la ligne, pas sur le titre entier :
                  chaque ligne est un bloc, et `text-balance` posé sur le `h1`
                  ne traverse pas ses enfants. Sans lui, « complexe. » se
                  retrouvait seul sur une ligne au format téléphone. */}
              <span className="text-balance">
                {ligne.before ? `${ligne.before} ` : null}
                <em
                  className="accent hl hl--draw"
                  style={
                    {
                      "--hl-delay": `${900 + i * 340}ms`,
                    } as React.CSSProperties
                  }
                >
                  {ligne.accent}
                </em>
                {ligne.after ? ` ${ligne.after}` : null}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="lead mx-auto mt-8 max-w-[68ch] text-balance"
          data-hero-step="3"
        >
          {hero?.lead ||
            "Studio créatif spécialisé tech & industrie, basé à Grenoble. Je développe la communication des structures innovantes en créant des visuels cohérents et adaptés à leur écosystème."}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          data-hero-step="4"
        >
          <CtaButton
            avatar={
              <Avatar
                src={site.portrait}
                alt="Portrait d'Axel Faure"
                size={48}
                initials="AF"
              />
            }
          />
          <Link
            href={hero?.linkHref || "/projets"}
            className="group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-ink underline decoration-line-2 underline-offset-4 transition-colors duration-200 hover:decoration-ink"
          >
            {hero?.linkLabel || "Voir les réalisations"}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-site group-hover:translate-x-[3px]"
            >
              →
            </span>
          </Link>
        </div>

        <Stats chiffres={hero?.stats} />
      </div>

      <div
        className="mx-auto w-full max-w-[84rem] px-[var(--gutter)] pb-[clamp(3rem,7vw,4.5rem)]"
        data-hero-step="6"
      >
        <Ticker
          duration={45}
          gap={2}
          soft
          items={logos.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.name}
              width={900}
              height={600}
              sizes="96px"
              className="h-16 w-24 object-contain opacity-60 transition-opacity duration-200 hover:opacity-100"
            />
          ))}
        />
      </div>
    </section>
  );
}

/** Visages clients, notation et volume accompagné, au-dessus du titre. */
function SocialProof({
  preuve,
  visages,
}: {
  preuve?: HeroSection["socialProof"];
  visages?: string[];
}) {
  const faces = visages?.length ? visages : [...clientFaces];
  return (
    <Link
      href="#avis"
      className="group flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
    >
      <span className="flex items-center">
        {faces.map((src, i) => (
          <span
            key={src}
            data-hero-step="1"
            style={
              {
                "--enter-delay": `${60 + i * 45}ms`,
                "--enter-y": "-12px",
                "--enter-dur": "520ms",
              } as React.CSSProperties
            }
            className={cn(
              "face-in relative -ml-2.5 first:ml-0",
              i >= 4 && "hidden sm:inline-block",
            )}
          >
            <span className="face">
              <Avatar
                src={src}
                alt=""
                size={40}
                initials="·"
                className="face-cut"
                style={
                  {
                    "--face-cut-x": "50px",
                    "--face-cut-r": "23px",
                  } as React.CSSProperties
                }
              />
            </span>
          </span>
        ))}

        <span
          data-hero-step="1"
          style={
            {
              "--enter-delay": `${60 + faces.length * 45}ms`,
              "--enter-y": "-12px",
              "--enter-dur": "520ms",
            } as React.CSSProperties
          }
          className="face-in relative z-10 -ml-2.5"
        >
          <span className="face">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-[0.72rem] font-bold text-ink">
              {preuve?.badge || "+30"}
            </span>
          </span>
        </span>
      </span>

      <span
        data-hero-step="1"
        style={
          {
            "--enter-delay": "400ms",
            "--enter-y": "-10px",
          } as React.CSSProperties
        }
      >
        <Stars rating={5} size={15} />
      </span>

      <span
        data-hero-step="1"
        className="label"
        style={
          {
            "--enter-delay": "450ms",
            "--enter-y": "-10px",
          } as React.CSSProperties
        }
      >
        <strong className="font-bold text-ink">
          {preuve?.strong || site.socialProof.strong}
        </strong>{" "}
        {preuve?.rest || site.socialProof.rest}
      </span>
    </Link>
  );
}

/** Quatre chiffres posés directement sur le fond, sans carte ni filet. */
function Stats({ chiffres }: { chiffres?: HeroSection["stats"] }) {
  return (
    <dl className="mt-[clamp(3rem,7vw,5rem)] grid w-full max-w-[62rem] grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {(chiffres?.length ? chiffres : heroStats).map((stat, i) => (
        <div
          key={stat.label}
          data-hero-step="5"
          style={
            { "--enter-delay": `${800 + i * 70}ms` } as React.CSSProperties
          }
          className="flex flex-col items-center"
        >
          <dt className="font-mono text-[clamp(1.75rem,3.4vw,2.3rem)] font-medium leading-none tracking-[-0.03em] text-ink/85">
            <Counter value={stat.value} />
          </dt>
          <dd className="mt-3 text-[0.875rem] leading-snug text-muted">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
