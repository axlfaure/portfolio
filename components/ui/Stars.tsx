/** Notation en étoiles. Le nombre est restitué en texte aux lecteurs d'écran. */
export function Stars({ rating = 5, size = 14 }: { rating?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="sr-only">{rating} étoiles sur 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-ink-2"
        >
          <path d="M12 3.5 14.7 9l6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.9 9.3 9z" />
        </svg>
      ))}
    </span>
  );
}
