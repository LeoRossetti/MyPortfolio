import type { ReactNode } from "react";
import {
  SiClerk,
  SiExpo,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { ConvexIcon } from "@/components/icons/BrandIcons";

export type TechLogo = {
  node: ReactNode;
  title: string;
  href: string;
  ariaLabel?: string;
};

export const techLogos: TechLogo[] = [
  {
    node: <SiTypescript aria-hidden style={{ color: "#3178C6" }} />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiReact aria-hidden style={{ color: "#61DAFB" }} />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs aria-hidden style={{ color: "#ffffff" }} />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTailwindcss aria-hidden style={{ color: "#06B6D4" }} />,
    title: "Tailwind",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiExpo aria-hidden style={{ color: "#ffffff" }} />,
    title: "Expo",
    href: "https://expo.dev",
  },
  {
    node: <SiNodedotjs aria-hidden style={{ color: "#5FA04E" }} />,
    title: "Node.js",
    href: "https://nodejs.org",
  },
  {
    node: <ConvexIcon style={{ color: "#EE342F" }} />,
    title: "Convex",
    href: "https://convex.dev",
  },
  {
    node: <SiClerk aria-hidden style={{ color: "#6C47FF" }} />,
    title: "Clerk",
    href: "https://clerk.com",
  },
  {
    node: <SiPython aria-hidden style={{ color: "#3776AB" }} />,
    title: "Python",
    href: "https://www.python.org",
  },
  {
    node: <SiSharp aria-hidden style={{ color: "#512BD4" }} />,
    title: "C#",
    href: "https://learn.microsoft.com/dotnet/csharp",
  },
];
