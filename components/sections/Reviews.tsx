import { Avatar } from "@/components/ui/Media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stars } from "@/components/ui/Stars";
import { TickerColumn } from "@/components/ui/TickerColumn";
import type { Testimonial } from "@/lib/content";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { cn } from "@/lib/cn";
import { getQuotedTestimonials, getReviewsSection } from "@/lib/content";

function Card({
  testimonial,
  className,
  compact = false,
}: {
  testimonial: Testimonial;
  className: string;
  /**
   * Version resserrée, pour le mur de colonnes.
   *
   * Une colonne de 333 px allonge les citations : la plus longue tenait sur
   * 588 px de haut, plus que la fenêtre du mur elle-même, et on ne voyait
   * jamais qu'une carte à la fois. Un cran de moins sur le corps de texte et
   * sur les marges suffit à en faire tenir deux, ce qui est le minimum pour
   * qu'un mur ressemble à un mur. La pile du téléphone, elle, garde la taille
   * pleine : rien ne l'oblige à tenir dans une hauteur donnée.
   */
  compact?: boolean;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col rounded-card border border-line bg-surface",
        compact ? "p-5" : "p-6",
        className,
      )}
    >
      <Stars rating={testimonial.rating} />
      <blockquote
        className={cn(
          "flex-1 text-ink-2",
          compact
            ? "mt-3.5 text-[0.875rem] leading-[1.55]"
            : "mt-4 text-[0.95rem] leading-relaxed",
        )}
      >
        « {testimonial.quote} »
      </blockquote>
      <figcaption
        className={cn(
          "flex items-center gap-3 border-t border-line",
          compact ? "mt-5 pt-4" : "mt-6 pt-5",
        )}
      >
        <Avatar src={testimonial.avatar} alt="" size={36} initials="··" />
        <span>
          <span className="block text-[0.875rem] font-bold text-ink">
            {testimonial.name}
          </span>
          <span className="block text-[0.8rem] text-muted">
            {testimonial.role} · {testimonial.org}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Répartit les avis entre les colonnes, une carte sur trois.
 *
 * Chaque colonne portait auparavant la liste entière, simplement décalée. Le
 * même avis se trouvait donc dans les trois colonnes à la fois, et finissait
 * par se croiser avec lui-même : deux exemplaires côte à côte, à quelques
 * centimètres près. Un mur de neuf avis n'en montrait jamais que quelques-uns,
 * répétés.
 *
 * En les distribuant, **un avis n'existe qu'à un seul endroit** : le cas ne
 * peut plus se produire, quel qu'en soit le nombre. La contrepartie est une
 * boucle plus courte par colonne — trois cartes pour neuf avis — mais une
 * répétition dans le temps se remarque bien moins qu'un doublon dans l'espace.
 *
 * La distribution est alternée plutôt que par tranches : les avis longs et
 * courts se répartissent ainsi entre les colonnes au lieu de s'accumuler dans
 * la même, ce qui est exactement ce qui fait la maçonnerie.
 */
function repartir<T>(liste: T[], colonne: number, total: number): T[] {
  return liste.filter((_, i) => i % total === colonne);
}

/**
 * Réglages de chaque colonne.
 *
 * Des durées volontairement premières entre elles : à durées proches, les
 * colonnes finissent par se synchroniser et le mur se met à respirer d'un
 * seul bloc. Le sens alterne, ce qui suffit à donner du mouvement sans que
 * l'œil sache où se poser.
 */
const REGLAGES = [
  { duration: 53, reverse: false },
  { duration: 67, reverse: true },
  { duration: 47, reverse: false },
];

/**
 * Le mur d'avis : des colonnes qui montent, plutôt que des bandes qui glissent
 * de côté.
 *
 * À l'horizontale, toutes les cartes d'une bande devaient partager la hauteur
 * de la citation la plus longue : les avis courts ouvraient trois cents pixels
 * de vide sous leur signature, et il fallait des cartes très larges pour
 * absorber les longs. À la verticale, chaque carte prend la hauteur de sa
 * citation. Sur six avis qui vont de 143 à 585 signes, c'est ce qui fait la
 * maçonnerie.
 *
 * Trois colonnes, et le choix n'est pas qu'esthétique : le nombre de colonnes
 * commande la hauteur des cartes, à rebours de l'intuition. Mesuré à 1200 px,
 * une même citation tient sur 242 à 415 px de haut sur deux colonnes, 267 à
 * 588 sur trois, 337 à 806 sur quatre. Plus les colonnes sont étroites, plus
 * la ligne est courte, et plus le mur est haut.
 *
 * À trois colonnes, la plus longue citation dépassait donc la fenêtre du mur
 * et on ne voyait jamais qu'une carte. D'où la variante resserrée de `Card` :
 * elle ramène le maximum à 475 px, et deux cartes tiennent enfin. C'est le
 * minimum pour qu'un mur ressemble à un mur.
 */
function Mur({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="container-site hidden gap-5 md:grid md:h-[38rem] md:grid-cols-2 lg:h-[46rem] lg:grid-cols-3">
      {REGLAGES.map((reglage, i) => {
        const part = repartir(testimonials, i, REGLAGES.length);
        // Une colonne vide laisserait un trou dans la grille. Le cas se
        // présente tant qu'il y a moins d'avis que de colonnes.
        if (part.length === 0) return null;

        return (
          <TickerColumn
            key={reglage.duration}
            duration={reglage.duration}
            reverse={reglage.reverse}
            gap={1.25}
            className={cn("h-full", i === 2 && "hidden lg:block")}
            items={part.map((t) => (
              <Card key={t.slug} testimonial={t} className="w-full" compact />
            ))}
          />
        );
      })}
    </div>
  );
}

export async function Reviews() {
  // Seuls les avis porteurs d'une citation : une note client sans texte n'a
  // rien à faire dans un mur qui met des mots entre guillemets.
  const testimonials = await getQuotedTestimonials();
  const tete = await getReviewsSection();

  return (
    <section id="avis" className="section scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          eyebrow={tete?.eyebrow ?? "Avis clients"}
          title={
            <AccentTitle
              start={tete?.titleStart ?? "Ce qu'en disent"}
              accent={tete?.titleAccent ?? "les équipes que j'accompagne."}
              end={tete?.titleEnd}
            />
          }
        />
      </div>

      {/*
       * Sous 48rem, la pile, et rien d'autre.
       *
       * Il y avait là un carrousel à aimantation, avance automatique et
       * hauteur asservie à la carte affichée. Chacune de ces trois choses
       * était défendable, les trois ensemble se battaient : les avis vont de
       * 143 à 606 signes, donc du simple au quadruple en hauteur, et
       * redimensionner le conteneur pendant que le doigt le fait défiler
       * perturbe l'aimantation du navigateur. La piste s'immobilisait entre
       * deux cartes, et le geste horizontal se transformait en un défilement
       * vertical erratique.
       *
       * Une pile n'a aucun de ces problèmes, et pas seulement parce qu'elle
       * est plus simple : chaque carte prend la hauteur de sa citation, ce qui
       * est exactement ce que le mur fait sur grand écran. Le téléphone lit
       * donc la même chose, dans une colonne au lieu de trois. Il n'y a plus
       * ni avance automatique, ni piste à faire glisser, ni hauteur à animer,
       * ni JavaScript.
       */}
      <div className="container-site mt-12 space-y-4 md:hidden">
        {testimonials.map((t) => (
          <Card key={t.slug} testimonial={t} className="w-full" />
        ))}
      </div>

      <div className="mt-16 lg:mt-24">
        <Mur testimonials={testimonials} />
      </div>
    </section>
  );
}
