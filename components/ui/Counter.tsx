"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Sépare « 97,5 % » en préfixe, nombre et suffixe. */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(",")
    ? digits.split(",")[1].length
    : digits.includes(".")
      ? digits.split(".")[1].length
      : 0;

  return {
    prefix,
    suffix,
    decimals,
    target: Number.parseFloat(digits.replace(",", ".")),
  };
}

function format(n: number, decimals: number) {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const DURATION = 1200;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Compte de 0 à la valeur quand l'élément entre dans le viewport, une seule fois.
 *
 * Le rendu serveur affiche la valeur finale : sans JS, ou sous
 * `prefers-reduced-motion`, le chiffre est simplement là.
 */
export function Counter({ value }: { value: string }) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  // Avant la peinture : on repart de zéro, sans clignotement.
  useIsomorphicLayoutEffect(() => {
    if (!parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDisplay(`${parsed.prefix}${format(0, parsed.decimals)}${parsed.suffix}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!parsed || !node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        const n = easeOut(t) * parsed.target;
        setDisplay(
          `${parsed.prefix}${format(n, parsed.decimals)}${parsed.suffix}`,
        );
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="num">
      {display}
    </span>
  );
}
