type Props = React.SVGProps<SVGSVGElement>;

/**
 * Simplified Brazilian flag. Accurate enough at a glance and at any size
 * (used both at full-viewport during the wipe and at ~20px in the toggle).
 * Stars are stylised rather than positioned per official spec.
 */
export function BrazilFlag(props: Props) {
  return (
    <svg
      viewBox="0 0 720 504"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bandeira do Brasil"
      {...props}
    >
      <rect width="720" height="504" fill="#009C3B" />
      <polygon points="360,48 672,252 360,456 48,252" fill="#FFDF00" />
      <circle cx="360" cy="252" r="100" fill="#002776" />
      <path
        d="M 268 234 Q 360 198 452 234"
        stroke="#FFFFFF"
        strokeWidth="22"
        fill="none"
      />
      {/* Stylised star hints inside the celestial disc */}
      <g fill="#FFFFFF">
        <circle cx="318" cy="218" r="3" />
        <circle cx="382" cy="223" r="2.5" />
        <circle cx="350" cy="278" r="3" />
        <circle cx="402" cy="290" r="2" />
        <circle cx="310" cy="270" r="2" />
        <circle cx="372" cy="248" r="2.2" />
      </g>
    </svg>
  );
}
