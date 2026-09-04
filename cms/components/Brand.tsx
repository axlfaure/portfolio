/* eslint-disable @next/next/no-img-element */

/**
 * Marque de l'administration.
 *
 * On sert le vrai fichier `/logo.png`, celui de la navigation du site, plutôt
 * qu'un tracé redessiné : deux monogrammes qui divergent, c'est deux marques.
 * `next/image` n'est pas utilisé ici — l'admin n'est pas indexée, ne subit pas
 * de contrainte de performance, et une balise simple évite d'embarquer le
 * pipeline d'optimisation dans le paquet de l'interface.
 */
export function Icon() {
  return (
    <img
      src="/logo.png"
      alt=""
      width={32}
      height={24}
      className="af-mark af-mark--nav"
    />
  );
}

/** Bloc d'identité de l'écran de connexion. */
export function Logo() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: ".9rem" }}>
      <img
        src="/logo.png"
        alt=""
        width={56}
        height={42}
        className="af-mark af-mark--login"
      />
      <span style={{ display: "grid", gap: ".2rem", textAlign: "left" }}>
        <strong
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "-.02em",
            lineHeight: 1.1,
          }}
        >
          Axel Faure
        </strong>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".62rem",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          Administration
        </span>
      </span>
    </span>
  );
}
