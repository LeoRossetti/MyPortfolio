import type { ReactNode } from "react";
import {
  SiExpo,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export type TechLogo = {
  node: ReactNode;
  title: string;
  href: string;
  ariaLabel?: string;
};

export const techLogos: TechLogo[] = [
  {
    node: <SiTypescript aria-hidden />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiReact aria-hidden />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs aria-hidden />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTailwindcss aria-hidden />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiExpo aria-hidden />,
    title: "Expo",
    href: "https://expo.dev",
  },
  {
    node: <SiNodedotjs aria-hidden />,
    title: "Node.js",
    href: "https://nodejs.org",
  },
  {
    node: <SiPython aria-hidden />,
    title: "Python",
    href: "https://www.python.org",
  },
  {
    node: <SiSharp aria-hidden />,
    title: "C#",
    href: "https://learn.microsoft.com/dotnet/csharp",
  },
];
