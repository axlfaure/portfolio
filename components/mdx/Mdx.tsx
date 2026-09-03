import {
  defaultJSXConverters,
  type JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import type { RichTextBody } from "@/lib/content";

/**
 * Rendu des corps de texte du CMS, avec la typographie du site.
 *
 * Le nom et la signature du composant n'ont pas changé lors de la bascule
 * depuis MDX : seul le format d'entrée est passé d'une chaîne Markdown à
 * l'arbre Lexical produit par l'éditeur. Les quatre pages qui l'utilisent
 * n'ont donc rien eu à modifier.
 *
 * Les classes sont reprises telles quelles de l'ancien rendu MDX : c'est ce qui
 * garantit qu'un article publié avant la bascule s'affiche exactement pareil
 * après.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });

    if (node.tag === "h2") {
      return (
        <h2 className="h3 mt-14 border-t border-line pt-8 first:mt-0 first:border-0 first:pt-0">
          {children}
        </h2>
      );
    }
    if (node.tag === "h3") {
      return (
        <h3 className="mt-10 text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
          {children}
        </h3>
      );
    }
    return (
      <p className="mt-8 text-[0.95rem] font-bold tracking-[-0.01em] text-ink">
        {children}
      </p>
    );
  },

  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    // Lexical produit un paragraphe vide pour chaque ligne blanche : le rendre
    // ajouterait une marge fantôme entre deux blocs.
    if (children.length === 0) return <></>;
    return (
      <p className="mt-5 max-w-[40rem] leading-relaxed text-muted">{children}</p>
    );
  },

  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const common = "mt-5 max-w-[40rem] space-y-2 pl-5 leading-relaxed text-muted";
    return node.tag === "ol" ? (
      <ol className={`${common} list-decimal marker:text-label`}>{children}</ol>
    ) : (
      <ul className={`${common} list-disc marker:text-line-2`}>{children}</ul>
    );
  },

  horizontalrule: () => <hr className="mt-10 border-line" />,
});

export function Mdx({ source }: { source: RichTextBody }) {
  if (!source) return null;
  return <RichText converters={converters} data={source} />;
}

export { defaultJSXConverters };
