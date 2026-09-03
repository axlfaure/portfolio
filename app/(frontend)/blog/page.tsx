import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes de terrain sur la communication des structures techniques : supports de salon, identité visuelle, automatisation de production et vulgarisation scientifique.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <div className="container-site pb-[var(--section-y)] pt-[clamp(3rem,7vw,4.5rem)]">
        <SectionHeader
          eyebrow="Blog"
          title={
            <>
              Ce que j&apos;apprends{" "}
              <em className="accent hl hl--scroll">sur le terrain.</em>
            </>
          }
          lead="Des notes courtes sur la communication des structures techniques : ce qui fonctionne sur un salon, ce qui fait échouer un site, ce qu'il faut décider avant d'automatiser un support."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>

      <FinalCta />
    </>
  );
}
