"use client";

import { useEffect, useRef } from "react";
import type { ProcessStep } from "@/lib/content";

/**
 * Déroulé en points d'étape, avec une jauge qui se remplit au scroll.
 *
 * Rien ne passe par l'état React : la progression est écrite directement
 * dans le DOM. Sur une liste de cinq étapes, un `setState` par image aurait
 * provoqué un rendu complet à chaque pixel de défilement.
 *
 * La jauge est mise à l'échelle plutôt qu'agrandie en hauteur — `scale` est
 * composité, `height` déclenche un recalcul de mise en page à chaque image.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const fill = list.querySelector<HTMLElement>("[data-gauge]");
    const dots = Array.from(list.querySelectorAll<HTMLElement>("[data-dot]"));

    const apply = (progress: number, passed: number) => {
      if (fill) fill.style.scale = `1 ${progress}`;
      dots.forEach((dot, i) => {
        dot.dataset.dot = i < passed ? "on" : "off";
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1, dots.length);
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const box = list.getBoundingClientRect();
      // Repère de lecture : un peu au-dessus du centre de l'écran, là où
      // l'œil se trouve réellement quand on parcourt une liste.
      const line = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (line - box.top) / box.height));

      let passed = 0;
      for (const dot of dots) {
        if (dot.getBoundingClientRect().top <= line) passed += 1;
      }
      apply(progress, passed);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol ref={listRef} className="relative mt-12 pl-9 sm:pl-12">
      {/* Rail : le trait gris porte la jauge bleue, en position absolue pour
          qu'aucune hauteur d'étape ne le décale. */}
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-[7px] top-4 w-px bg-line sm:left-[11px]"
      >
        <span
          data-gauge
          style={{ scale: "1 0" }}
          className="absolute inset-0 origin-top bg-stroke"
        />
      </span>

      {steps.map((step, i) => (
        <li key={step.step} className="relative pb-11 last:pb-0">
          <span
            data-dot="off"
            aria-hidden="true"
            className="absolute left-[-2.25rem] top-[0.35rem] grid h-4 w-4 place-items-center rounded-full border border-line-2 bg-paper transition-colors duration-300 data-[dot=on]:border-stroke sm:left-[-3rem] sm:h-6 sm:w-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-line-2 transition-colors duration-300 sm:h-2 sm:w-2 [[data-dot=on]_&]:bg-stroke" />
          </span>

          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
              <span className="meta mr-3 text-label">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step.step}
            </h3>
            <p className="meta shrink-0">{step.duration}</p>
          </div>

          <p className="mt-3 max-w-[46rem] text-[0.95rem] leading-relaxed text-muted">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
