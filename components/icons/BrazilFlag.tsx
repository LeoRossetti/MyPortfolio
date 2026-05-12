type Props = React.SVGProps<SVGSVGElement>;

/**
 * Brazilian flag — accurate SVG sourced from flagcdn.com (public domain).
 * Source: https://flagcdn.com/br.svg
 *
 * Includes the official 20:14 (10:7) field proportions, the yellow rhombus
 * with correct inset, the blue celestial disc, all 27 white stars positioned
 * per the standardised sky-over-Rio composition, and the "ORDEM E PROGRESSO"
 * banner curved across the disc.
 */
export function BrazilFlag(props: Props) {
  return (
    <svg
      viewBox="-2100 -1470 4200 2940"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bandeira do Brasil"
      {...props}
    >
      <defs>
        <path
          id="br-j"
          fillRule="evenodd"
          d="M-31.5 0h33a30 30 0 0 0 30-30v-10a30 30 0 0 0-30-30h-33zm13-13h19a19 19 0 0 0 19-19v-6a19 19 0 0 0-19-19h-19z"
        />
        <path
          id="br-k"
          d="M0 0h63v-13H12v-18h40v-12H12v-14h48v-13H0z"
          transform="translate(-31.5)"
        />
        <path
          id="br-m"
          d="M-26.25 0h52.5v-12h-40.5v-16h33v-12h-33v-11H25v-12h-51.25z"
        />
        <path
          id="br-l"
          d="M-31.5 0h12v-48l14 48h11l14-48V0h12v-70H14L0-22l-14-48h-17.5z"
        />
        <path
          id="br-b"
          fillRule="evenodd"
          d="M0 0a31.5 35 0 0 0 0-70A31.5 35 0 0 0 0 0m0-13a18.5 22 0 0 0 0-44 18.5 22 0 0 0 0 44"
        />
        <path
          id="br-c"
          fillRule="evenodd"
          d="M-31.5 0h13v-26h28a22 22 0 0 0 0-44h-40zm13-39h27a9 9 0 0 0 0-18h-27z"
        />
        <path
          id="br-o"
          d="M-15.75-22C-15.75-15-9-11.5 1-11.5s14.74-3.25 14.75-7.75c0-14.25-46.75-5.25-46.5-30.25C-30.5-71-6-70 3-70s26 4 25.75 21.25H13.5c0-7.5-7-10.25-15-10.25-7.75 0-13.25 1.25-13.25 8.5-.25 11.75 46.25 4 46.25 28.75C31.5-3.5 13.5 0 0 0c-11.5 0-31.55-4.5-31.5-22z"
        />
        <use href="#br-f" id="br-p" transform="scale(31.5)" />
        <use href="#br-f" id="br-q" transform="scale(26.25)" />
        <use href="#br-f" id="br-u" transform="scale(21)" />
        <use href="#br-f" id="br-r" transform="scale(15)" />
        <use href="#br-f" id="br-v" transform="scale(10.5)" />
        <g id="br-n">
          <clipPath id="br-a">
            <path d="M-31.5 0v-70h63V0zM0-47v12h31.5v-12z" />
          </clipPath>
          <use href="#br-b" clipPath="url(#br-a)" />
          <path d="M5-35h26.5v10H5z" />
          <path d="M21.5-35h10V0h-10z" />
        </g>
        <g id="br-i">
          <use href="#br-c" />
          <path d="M28 0c0-10 0-32-15-32H-6c22 0 22 22 22 32" />
        </g>
        <g id="br-f" fill="#fff">
          <g id="br-e">
            <path
              id="br-d"
              d="M0-1v1h.5"
              transform="rotate(18 0 -1)"
            />
            <use href="#br-d" transform="scale(-1 1)" />
          </g>
          <use href="#br-e" transform="rotate(72)" />
          <use href="#br-e" transform="rotate(-72)" />
          <use href="#br-e" transform="rotate(144)" />
          <use href="#br-e" transform="rotate(216)" />
        </g>
      </defs>
      <clipPath id="br-h">
        <circle r="735" />
      </clipPath>
      <path fill="#009440" d="M-2100-1470h4200v2940h-4200z" />
      <path fill="#ffcb00" d="M-1743 0 0 1113 1743 0 0-1113Z" />
      <circle r="735" fill="#302681" />
      <path
        fill="#fff"
        d="M-2205 1470a1785 1785 0 0 1 3570 0h-105a1680 1680 0 1 0-3360 0z"
        clipPath="url(#br-h)"
      />
      <g fill="#009440" transform="translate(-420 1470)">
        <use href="#br-b" y="-1697.5" transform="rotate(-7)" />
        <use href="#br-i" y="-1697.5" transform="rotate(-4)" />
        <use href="#br-j" y="-1697.5" transform="rotate(-1)" />
        <use href="#br-k" y="-1697.5" transform="rotate(2)" />
        <use href="#br-l" y="-1697.5" transform="rotate(5)" />
        <use href="#br-m" y="-1697.5" transform="rotate(9.75)" />
        <use href="#br-c" y="-1697.5" transform="rotate(14.5)" />
        <use href="#br-i" y="-1697.5" transform="rotate(17.5)" />
        <use href="#br-b" y="-1697.5" transform="rotate(20.5)" />
        <use href="#br-n" y="-1697.5" transform="rotate(23.5)" />
        <use href="#br-i" y="-1697.5" transform="rotate(26.5)" />
        <use href="#br-k" y="-1697.5" transform="rotate(29.5)" />
        <use href="#br-o" y="-1697.5" transform="rotate(32.5)" />
        <use href="#br-o" y="-1697.5" transform="rotate(35.5)" />
        <use href="#br-b" y="-1697.5" transform="rotate(38.5)" />
      </g>
      <use href="#br-p" x="-600" y="-132" />
      <use href="#br-p" x="-535" y="177" />
      <use href="#br-q" x="-625" y="243" />
      <use href="#br-r" x="-463" y="132" />
      <use href="#br-q" x="-382" y="250" />
      <use href="#br-u" x="-404" y="323" />
      <use href="#br-p" x="228" y="-228" />
      <use href="#br-p" x="515" y="258" />
      <use href="#br-u" x="617" y="265" />
      <use href="#br-q" x="545" y="323" />
      <use href="#br-q" x="368" y="477" />
      <use href="#br-u" x="367" y="551" />
      <use href="#br-u" x="441" y="419" />
      <use href="#br-q" x="500" y="382" />
      <use href="#br-u" x="365" y="405" />
      <use href="#br-q" x="-280" y="30" />
      <use href="#br-u" x="200" y="-37" />
      <use href="#br-p" y="330" />
      <use href="#br-q" x="85" y="184" />
      <use href="#br-q" y="118" />
      <use href="#br-u" x="-74" y="184" />
      <use href="#br-r" x="-37" y="235" />
      <use href="#br-q" x="220" y="495" />
      <use href="#br-u" x="283" y="430" />
      <use href="#br-u" x="162" y="412" />
      <use href="#br-p" x="-295" y="390" />
      <use href="#br-v" y="575" />
    </svg>
  );
}
