import Link from "next/link";
import { ErrorScreen } from "@/components/sections/ErrorScreen";
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
    <ErrorScreen
      code="404"
      eyebrow="Erreur 404"
      titleStart="Cette page n'a pas su"
      titleAccent="se faire comprendre."
      lead="Le lien est peut-être ancien, ou l'adresse mal recopiée. Voici les chemins les plus courts vers ce que vous cherchiez."
      actions={
        <>
          <GhostButton href="/">Retour à l&apos;accueil</GhostButton>
          <GhostButton href="/projets">Voir les réalisations</GhostButton>
          <GhostButton href="/services">Voir les services</GhostButton>
        </>
      }
      footnote={
        <>
          Vous cherchiez quelque chose de précis ?{" "}
          <Link
            href="/#contact"
            className="font-semibold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
          >
            Dites-le moi
          </Link>
          , je vous enverrai le bon lien.
        </>
      }
    />
  );
}
