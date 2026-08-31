import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

const components = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="h3 mt-14 border-t border-line pt-8 first:mt-0 first:border-0 first:pt-0"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-10 text-[1.05rem] font-bold tracking-[-0.02em] text-ink"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-5 max-w-[40rem] leading-relaxed text-muted" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mt-5 max-w-[40rem] list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-line-2"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mt-5 max-w-[40rem] list-decimal space-y-2 pl-5 leading-relaxed text-muted marker:text-label"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
      {...props}
    />
  ),
  hr: () => <hr className="mt-10 border-line" />,
};

/** Rend un corps MDX avec la typographie du site. */
export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
