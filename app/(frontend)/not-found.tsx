import Link from "next/link";
import { GhostButton } from "@/components/ui/GhostButton";

/**
 * Page 404 du site public.
 *
 * Elle répond aux `notFound()` des pages projet, service et article : un lien
 * partagé qui pointe vers une réalisation retirée du portfolio ne doit pas
 * renvoyer l'écran noir anglophone de Next, sans en-tête ni retour possible.
 *
 * Le visiteur arrive rarement ici par hasard : il suit un lien ancien ou une
 * adresse mal recopiée. On lui rend donc les trois entrées qui l'intéressent
 * plutôt qu'un simple « retour à l'accueil ».
 */
export default function NotFound() {
  return (
    <div className="container-site section">
      <p className="eyebrow">Erreur 404</p>

      <h1 className="h2 mt-5 max-w-[18ch]">
        Cette page n&apos;existe plus, ou n&apos;a jamais existé.
      </h1>

      <p className="lead mt-5 max-w-[46ch]">
        Le lien est peut-être ancien, ou l&apos;adresse mal recopiée. Voici les
        chemins les plus courts vers ce que vous cherchiez.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <GhostButton href="/">Retour à l&apos;accueil</GhostButton>
        <GhostButton href="/projets">Voir les réalisations</GhostButton>
        <GhostButton href="/services">Voir les services</GhostButton>
      </div>

      <p className="mt-10 text-[0.9rem] text-muted">
        Vous cherchiez quelque chose de précis ?{" "}
        <Link
          href="/#contact"
          className="font-semibold text-ink underline underline-offset-4"
        >
          Dites-le moi
        </Link>
        , je vous enverrai le bon lien.
      </p>
    </div>
  );
}
