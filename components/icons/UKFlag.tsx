type Props = React.SVGProps<SVGSVGElement>;

/**
 * Simplified Union Jack. The centered diagonals are an approximation
 * (the official flag has counterchanged offsets) — close enough for both
 * the full-viewport wipe and the small toggle.
 */
export function UKFlag(props: Props) {
  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Union Jack flag"
      {...props}
    >
      <clipPath id="uk-clip">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="30" fill="#012169" />
        {/* White diagonal saltires */}
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        {/* Red diagonal stripes (St. Patrick) — centered approximation */}
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
        {/* White cross frame (St. George) */}
        <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
        {/* Red cross (St. George) */}
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
