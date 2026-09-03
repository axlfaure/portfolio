import Link from "next/link";
import { ArrowDiag } from "@/components/ui/ArrowDiag";
import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/cn";
import type { Post } from "@/lib/content";

/** Date au format long français, à partir de l'ISO du frontmatter. */
function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PostCard({
  post,
  index = 0,
  className,
}: {
  post: Post;
  index?: number;
  className?: string;
}) {
  return (
    <article
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties
      }
      className={cn("group flex flex-col", className)}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col rounded-project border border-line bg-surface p-3 shadow-e1 transition-[translate,box-shadow] duration-200 ease-site hover:-translate-y-0.5 hover:shadow-e2"
      >
        <div className="relative overflow-hidden rounded-[14px] bg-sunk">
          <Media
            src={post.cover}
            alt=""
            ratio="16 / 10"
            sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 92vw"
            className="transition-transform duration-[620ms] ease-expo group-hover:scale-[1.04]"
          />

          {/* Le badge se pose sur le visuel : le fond translucide le tient
              lisible quelle que soit l'image en dessous. */}
          <span className="absolute left-3 top-3 rounded-full border border-line bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink backdrop-blur-[6px]">
            {post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
          <p className="meta">
            {formatDate(post.date)}
            {post.readingTime ? ` · ${post.readingTime}` : ""}
          </p>

          <h3 className="mt-2.5 text-[1.08rem] font-bold leading-snug tracking-[-0.02em] text-ink">
            {post.title}
          </h3>

          {/* Trois lignes maximum : les accroches n'ont pas toutes la même
              longueur, la troncature garde les cartes alignées. */}
          <p className="mt-2.5 line-clamp-3 text-[0.9rem] leading-relaxed text-muted">
            {post.excerpt}
          </p>

          <span className="mt-auto flex items-center gap-2 pt-6 text-[0.88rem] font-semibold text-ink">
            En savoir plus
            <ArrowDiag size={15} className="arrow-diag" />
          </span>
        </div>
      </Link>
    </article>
  );
}
