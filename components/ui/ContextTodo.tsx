"use client";

import { useEffect, useRef } from "react";

/**
 * La charge réelle d'un chargé de communication seul, à l'approche d'un salon.
 *
 * Chaque ligne vient des entretiens de marché, pas d'une supposition :
 * les relances pour récupérer les visuels et le « c'est rapide, un Canva »
 * sont deux des trois pertes de temps citées par Romane Saye (CEA Startups) ;
 * la ré-explication de la techno est le premier critère de sélection cité par
 * Raphael Ledoux (CustomIA) ; le tri de ce que les experts veulent montrer est
 * décrit par Estelle Fege (CEA-Leti FAMES) comme son combat quotidien.
 */
const TASKS = [
  "Relancer les chercheurs pour leurs visuels",
  "Réexpliquer la techno au prestataire",
  "Faire tenir quatre pages sur un kakémono",
  "Coordonner l'imprimeur, le web et le motion",
  "Vérifier que la charte a survécu",
  "Expliquer que non, ce n'est pas « juste un Canva »",
];

/** Laisse le temps de lire la liste avant que le premier item se coche. */
const START_MS = 620;
/** Un item toutes les 780 ms : assez lent pour se suivre à l'œil. */
const STEP_MS = 780;

/**
 * EN RÉSERVE — remplacée dans la section « Le contexte » par ContextInbox,
 * qui met en scène les mêmes constats sous forme de boîte de réception. Gardée
 * telle quelle : elle fonctionne, et elle conviendrait à une page service.
 * Ses styles vivent dans globals.css, bloc `.todo-*`.
 *
 * Liste de tâches qui se coche seule, une fois, à l'entrée dans le champ.
 *
 * Le rendu ne dépend d'aucun état React : la séquence écrit `data-on` sur les
 * items et laisse le CSS faire le reste. Six items cochés, c'est six rendus
 * évités — et surtout, l'animation reste entièrement décrite dans la feuille
 * de style, donc désactivable d'un bloc en mouvement réduit.
 */
export function ContextTodo() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const items = [
      ...node.querySelectorAll<HTMLElement>("[data-todo-item]"),
    ];
    const count = node.querySelector<HTMLElement>("[data-todo-count]");
    const bar = node.querySelector<HTMLElement>("[data-todo-bar]");
    const foot = node.querySelector<HTMLElement>("[data-todo-foot]");

    const mark = (n: number) => {
      for (let i = 0; i < n; i += 1) items[i].dataset.on = "";
      if (count) count.textContent = String(n);
      if (bar) bar.style.scale = `${n / items.length} 1`;
      if (foot && n === items.length) foot.dataset.on = "";
    };

    // Mouvement réduit : on montre le résultat, pas le trajet.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mark(items.length);
      return;
    }

    let timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        timers = items.map((_, i) =>
          window.setTimeout(() => mark(i + 1), START_MS + i * STEP_MS),
        );
      },
      { threshold: 0.3 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={root}
      className="rounded-project border border-line bg-surface p-5 shadow-e1 sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Avant le salon</p>
        <p className="font-mono text-[0.68rem] tracking-[0.12em] text-label">
          <span data-todo-count>0</span> / {TASKS.length}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-full overflow-hidden bg-line"
      >
        <div data-todo-bar className="todo-bar h-full w-full bg-accent" />
      </div>

      <ul className="mt-4">
        {TASKS.map((task) => (
          <li
            key={task}
            data-todo-item
            className="todo-item flex items-start gap-3 py-2.5"
          >
            <span
              aria-hidden="true"
              className="todo-check mt-[0.15rem] grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full border border-line-2 text-surface"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="todo-tick" d="m5 12.5 4.7 4.6L19 7" />
              </svg>
            </span>
            {/* Le libellé doit rester inline : enfant direct du flex il serait
                blockifié, et le trait de rature — peint via le fond — ne serait
                tracé qu'une fois pour tout le bloc au lieu d'une fois par ligne. */}
            <span className="min-w-0 flex-1 text-[0.9rem] leading-relaxed text-ink-2">
              <span className="todo-label">{task}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Ligne de chute : la liste ne se vide pas toute seule, elle change de
          main. C'est la promesse de la section, dite par le visuel. */}
      <p
        data-todo-foot
        className="todo-foot mt-4 flex items-center gap-3 rounded-card bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] px-4 py-3.5 text-[0.9rem] font-semibold text-ink"
      >
        <span
          aria-hidden="true"
          className="grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full bg-accent text-surface"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12.5 4.7 4.6L19 7" />
          </svg>
        </span>
        Cette liste devient la mienne.
      </p>
    </div>
  );
}
