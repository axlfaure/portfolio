import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-site flex flex-col gap-4 py-8 nav:flex-row nav:items-center nav:justify-between">
        <p className="eyebrow">
          {site.name} · {site.baseline} · {site.city}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="eyebrow">Branding · Print · Web</p>
          <Link
            href="/mentions-legales"
            className="eyebrow transition-colors duration-200 hover:text-muted"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
