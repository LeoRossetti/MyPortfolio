import { cn } from "@/lib/utils";

type Props = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

/**
 * Brand logos split out because lucide-react 1.x dropped brand icons
 * (trademark reasons). These are from the simple-icons set, simplified.
 */

export function GithubIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.608-4.042-1.608-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3-.405 1.02.006 2.04.139 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.476 5.921.431.371.815 1.103.815 2.222 0 1.604-.015 2.896-.015 3.29 0 .32.216.694.825.576C20.565 22.092 24 17.598 24 12.297 24 5.67 18.627.297 12 .297z" />
    </svg>
  );
}

export function LinkedinIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.778 13.019H3.555V9h3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/**
 * Convex logo — not in react-icons/si. Source SVG is also stored at
 * `public/logos/convex.svg` as an asset. Inlined here with
 * `fill="currentColor"` and per-path opacity so the three-lobe shape
 * still reads in the LogoLoop's monochrome palette. Sized in em units
 * to match the `font-size`-driven sizing of react-icons/si icons.
 */
export function ConvexIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="31 31.5 122 125"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path
        opacity="0.85"
        d="M108.092 130.021C126.258 128.003 143.385 118.323 152.815 102.167C148.349 142.128 104.653 167.385 68.9858 151.878C65.6992 150.453 62.8702 148.082 60.9288 145.034C52.9134 132.448 50.2786 116.433 54.0644 101.899C64.881 120.567 86.8748 132.01 108.092 130.021Z"
      />
      <path
        opacity="0.6"
        d="M53.4012 90.1735C46.0375 107.191 45.7186 127.114 54.7463 143.51C22.9759 119.608 23.3226 68.4578 54.358 44.7949C57.2286 42.6078 60.64 41.3097 64.2178 41.1121C78.9312 40.336 93.8804 46.0225 104.364 56.6193C83.0637 56.831 62.318 70.4756 53.4012 90.1735Z"
      />
      <path d="M114.637 61.8552C103.89 46.8701 87.0686 36.6684 68.6387 36.358C104.264 20.1876 148.085 46.4045 152.856 85.1654C153.3 88.7635 152.717 92.4322 151.122 95.6775C144.466 109.195 132.124 119.679 117.702 123.559C128.269 103.96 126.965 80.0151 114.637 61.8552Z" />
    </svg>
  );
}
