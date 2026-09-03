import { cn } from "@/lib/cn";
import { ServiceIcon } from "./ServiceIcon";

export type FeatureIconName =
  | "palette"
  | "book"
  | "kit"
  | "file"
  | "layers"
  | "doc"
  | "code"
  | "chart"
  | "box"
  | "camera"
  | "play"
  | "check"
  | "users"
  | "exchange"
  | "clock";

/** Jeu d'icônes des livrables. Même facture que ServiceIcon : trait 1,6px. */
export function FeatureIcon({
  name,
  size = 18,
  className,
}: {
  name: FeatureIconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: cn("shrink-0", className),
  };

  switch (name) {
    case "palette":
      return (
        <svg {...common}>
          <path d="M12 3.2a8.8 8.8 0 1 0 0 17.6c1.3 0 2-.8 2-1.8 0-1.5-1.4-1.7-1.4-2.9 0-.9.7-1.5 1.7-1.5h1.6a4.9 4.9 0 0 0 4.9-4.9c0-3.6-3.8-6.5-8.8-6.5z" />
          <circle cx="8.4" cy="10.4" r="1.1" />
          <circle cx="12" cy="7.8" r="1.1" />
          <circle cx="15.7" cy="10.2" r="1.1" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4.5 4.6h5.2A2.8 2.8 0 0 1 12 6.9v12a2.1 2.1 0 0 0-1.8-1.1H4.5z" />
          <path d="M19.5 4.6h-5.2A2.8 2.8 0 0 0 12 6.9v12a2.1 2.1 0 0 1 1.8-1.1h5.7z" />
        </svg>
      );
    case "kit":
      return (
        <svg {...common}>
          <rect x="3.2" y="3.2" width="7.4" height="7.4" rx="1.6" />
          <rect x="13.4" y="3.2" width="7.4" height="7.4" rx="3.7" />
          <rect x="3.2" y="13.4" width="7.4" height="7.4" rx="3.7" />
          <rect x="13.4" y="13.4" width="7.4" height="7.4" rx="1.6" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M13.4 3.2H6.8a1.8 1.8 0 0 0-1.8 1.8v14a1.8 1.8 0 0 0 1.8 1.8h10.4a1.8 1.8 0 0 0 1.8-1.8V8.6z" />
          <path d="M13.4 3.2v5.4h5.6" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M12 3 21 7.6 12 12.2 3 7.6z" />
          <path d="m3 12.4 9 4.6 9-4.6" />
          <path d="m3 16.9 9 4.6 9-4.6" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <rect x="4.2" y="3.4" width="15.6" height="17.2" rx="2" />
          <path d="M8 8.4h8M8 12h8M8 15.6h5" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="m8.4 8-4.2 4 4.2 4M15.6 8l4.2 4-4.2 4M13.4 5.2l-2.8 13.6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20V4M4 20h16" />
          <path d="M8.4 16.4v-4.2M12.4 16.4V7.8M16.4 16.4v-6.4" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3.4 7.6 12 3.2l8.6 4.4v8.8L12 20.8l-8.6-4.4z" />
          <path d="M3.4 7.6 12 12l8.6-4.4M12 12v8.8" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M3.2 8.2a2 2 0 0 1 2-2h2l1.4-2h6.8l1.4 2h2a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z" />
          <circle cx="12" cy="12.6" r="3.4" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <rect x="3.2" y="4.8" width="17.6" height="14.4" rx="2" />
          <path d="m10.2 9.6 4.6 2.8-4.6 2.8z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m4.8 12.6 4.6 4.4 9.8-10.4" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9.2" cy="8" r="3.2" />
          <path d="M3.4 19.4a5.8 5.8 0 0 1 11.6 0" />
          <path d="M16.4 5.2a3.2 3.2 0 0 1 0 5.6" />
          <path d="M17.8 14.2a5.8 5.8 0 0 1 2.8 5.2" />
        </svg>
      );
    case "exchange":
      return (
        <svg {...common}>
          <path d="M3.8 8.8h15.4l-3.6-3.6" />
          <path d="M20.2 15.2H4.8l3.6 3.6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.6" />
          <path d="M12 7v5.2l3.4 2" />
        </svg>
      );
  }
}

const SERVICE_NAMES = new Set([
  "identity",
  "print",
  "web",
  "automation",
  "motion",
  "photo",
]);

/**
 * Icône de livrable : les six pictos de service et le jeu générique
 * partagent le même champ dans le frontmatter, ce sélecteur les réconcilie.
 */
export function DeliverableIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  if (SERVICE_NAMES.has(name)) {
    return (
      <ServiceIcon name={name as Parameters<typeof ServiceIcon>[0]["name"]} />
    );
  }
  return <FeatureIcon name={name as FeatureIconName} className={className} />;
}
