type Props = React.SVGProps<SVGSVGElement>;

/**
 * Union Jack — accurate SVG sourced from flagcdn.com (public domain).
 * Source: https://flagcdn.com/gb.svg
 *
 * Uses a clip-path to produce the correct counterchanged offset diagonals
 * (St. Patrick's saltire is offset against St. Andrew's), rather than the
 * naïve centered approximation.
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
      <clipPath id="uk-a">
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id="uk-b">
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath="url(#uk-a)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path
          d="m0 0 60 30m0-30L0 30"
          stroke="#fff"
          strokeWidth="6"
        />
        <path
          d="m0 0 60 30m0-30L0 30"
          clipPath="url(#uk-b)"
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path
          d="M30 0v30M0 15h60"
          stroke="#fff"
          strokeWidth="10"
        />
        <path
          d="M30 0v30M0 15h60"
          stroke="#C8102E"
          strokeWidth="6"
        />
      </g>
    </svg>
  );
}
