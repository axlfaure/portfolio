import type { Service } from "@/lib/content";

/** Icônes SVG inline, trait 1,6px, 18px. Aucune librairie d'icônes. */
export function ServiceIcon({ name }: { name: Service["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "identity":
      return (
        <svg {...common}>
          <path d="M12 2.6 20 7v10l-8 4.4L4 17V7z" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      );
    case "print":
      return (
        <svg {...common}>
          <path d="M7 9V3h10v6" />
          <rect x="3.5" y="9" width="17" height="7.5" rx="1.6" />
          <path d="M7 14h10v7H7z" />
        </svg>
      );
    case "web":
      return (
        <svg {...common}>
          <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="2" />
          <path d="M2.8 9h18.4" />
          <path d="M6.2 6.6h.01M8.8 6.6h.01M11.4 6.6h.01" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <path d="M4 7h7M4 12h5M4 17h7" />
          <path d="M15.5 4.5 20 12l-4.5 7.5" />
          <circle cx="20" cy="12" r="1.4" />
        </svg>
      );
    case "motion":
      return (
        <svg {...common}>
          <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z" />
          <path d="M3.5 7 12 11.6 20.5 7M12 11.6v9.6" />
        </svg>
      );
    case "photo":
      return (
        <svg {...common}>
          <path d="M3.2 8.2A2 2 0 0 1 5.2 6.2h2l1.4-2h6.8l1.4 2h2a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z" />
          <circle cx="12" cy="12.6" r="3.4" />
        </svg>
      );
  }
}
