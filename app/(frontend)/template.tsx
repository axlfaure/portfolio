/**
 * Remonté à chaque navigation : sert de support à la transition de page.
 * Fondu seul, 250 ms — aucune translation, pour ne pas casser les
 * éléments en `position: sticky` de la page.
 */
export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="page-enter">{children}</div>;
}
