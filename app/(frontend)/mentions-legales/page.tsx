import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="container-site section">
      <h1 className="h1">Mentions légales</h1>
      <p className="lead mt-6">Page rédigée à l&apos;étape 5.</p>
    </div>
  );
}
