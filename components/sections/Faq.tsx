import { Mdx } from "@/components/mdx/Mdx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFaq } from "@/lib/content";

export function Faq() {
  const faq = getFaq();

  return (
    <section id="faq" className="section scroll-mt-24">
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-16">
        <SectionHeader
          index="06"
          eyebrow="FAQ"
          meta={`${faq.length} questions`}
          title="Ce que vous vous demandez déjà."
          className="lg:sticky lg:top-24 lg:self-start"
        />

        <div
          data-reveal
          className="overflow-hidden rounded-card border border-line bg-surface"
        >
          {faq.map((item, i) => (
            <details
              key={item.slug}
              name="faq"
              className="group border-line [&:not(:first-child)]:border-t"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-paper">
                <span className="eyebrow mt-1 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[0.975rem] font-semibold leading-snug text-ink">
                  {item.question}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-label transition-transform duration-200 ease-site group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>

              <div className="pb-6 pl-[3.9rem] pr-14 text-[0.925rem] [&>p:first-child]:mt-0">
                <Mdx source={item.body} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
