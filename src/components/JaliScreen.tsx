type Props = {
  className?: string;
  opacity?: number;
  strokeWidth?: number;
};

/** Repeating Jali lattice panel drawn as pure SVG. */
export function JaliScreen({ className, opacity = 0.5, strokeWidth = 0.8 }: Props) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="jali" width="60" height="104" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            opacity={opacity}
          >
            <path d="M30 2 L58 18 L58 50 L30 66 L2 50 L2 18 Z" />
            <path d="M30 14 L48 24 L48 44 L30 54 L12 44 L12 24 Z" />
            <path d="M30 66 L30 90 M2 50 L2 74 M58 50 L58 74" />
            <path d="M30 90 L58 74 M30 90 L2 74" />
            <circle cx="30" cy="34" r="5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jali)" />
    </svg>
  );
}

/** Mughal multifoil arch outline (Mehrab). */
export function MehrabArch({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 520"
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M8 520 V210 C8 110 70 22 150 22 C230 22 292 110 292 210 V520"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M22 520 V212 C22 120 78 40 150 40 C222 40 278 120 278 212 V520"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <path
        d="M150 22 C150 22 138 8 150 0 C162 8 150 22 150 22 Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
