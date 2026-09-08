"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/sections/ErrorScreen";
import { GhostButton } from "@/components/ui/GhostButton";
import { site } from "@/lib/site";

/**
 * Panne serveur du site public.
 *
 * Next impose un composant client ici : la limite d'erreur doit vivre dans le
 * navigateur pour intercepter ce qui casse au rendu comme à l'hydratation, et
 * `reset` est un rappel qu'on ne peut pas passer depuis le serveur.
 *
 * Trois choses comptent sur cette page, et une seule est visuelle :
 *
 * 1. Réessayer sans recharger. Une panne sur deux est passagère, et `reset()`
 *    relance le rendu de la branche fautive au lieu de repartir de zéro.
 * 2. Une sortie, toujours.
 * 3. Le `digest`. C'est l'empreinte que Next écrit aussi dans les journaux du
 *    serveur ; sans elle, un visiteur qui signale une panne ne peut désigner
 *    que « la page ne marche pas ». Affichée en petit, elle rend le rapport
 *    exploitable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // La console du navigateur garde la trace complète, que le digest seul ne
    // donne pas. Utile quand la panne se reproduit chez un visiteur précis.
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="500"
      eyebrow="Erreur serveur"
      titleStart="Quelque chose a cassé"
      titleAccent="de mon côté."
      lead="La page n'a pas pu se construire. Ce n'est pas vous : le problème est chez moi, et il est souvent passager."
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors duration-200 hover:bg-ink-2"
          >
            Réessayer
            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-site group-hover:rotate-90"
            >
              ↻
            </span>
          </button>
          <GhostButton href="/">Retour à l&apos;accueil</GhostButton>
        </>
      }
      footnote={
        <>
          Si cela se reproduit, écrivez-moi à{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-semibold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
          >
            {site.email}
          </a>
          .
          {error.digest && (
            <>
              {" "}
              En joignant cette référence, je retrouve la panne dans les
              journaux :{" "}
              <code className="font-mono text-[0.85em] text-ink-2">
                {error.digest}
              </code>
            </>
          )}
        </>
      }
    />
  );
}
