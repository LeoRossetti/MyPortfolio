import type { LucideIcon } from "lucide-react";
import { Code, Smartphone, Server, Palette } from "lucide-react";

export type Service = {
  id: string;
  title: string;
  pitch: string;
  icon: LucideIcon;
  tech: string[];
  /** Tailwind class strings for the card spans on the lg+ grid (12-col). */
  colSpan: string;
};

export const services: Service[] = [
  {
    id: "full-stack-web",
    title: "Full-Stack Web",
    pitch:
      "Next.js apps with real backends, auth, and deploy pipelines. Where most of my time goes.",
    icon: Code,
    tech: ["Next.js", "TypeScript", "Convex", "Clerk", "Tailwind"],
    colSpan: "lg:col-span-8",
  },
  {
    id: "mobile",
    title: "Mobile",
    pitch:
      "Cross-platform iOS/Android with the same JS/TS that powers the web side.",
    icon: Smartphone,
    tech: ["React Native", "Expo"],
    colSpan: "lg:col-span-4",
  },
  {
    id: "backend",
    title: "API & Backend",
    pitch:
      "Typed APIs, background jobs, and integrations. Meet the data where it lives — Node, Python, or .NET.",
    icon: Server,
    tech: ["Node.js", "Python", "C#"],
    colSpan: "lg:col-span-4",
  },
  {
    id: "design-engineering",
    title: "Design Engineering",
    pitch:
      "Motion-rich interfaces with Motion, GSAP, and Three.js. Interfaces that feel, not just look.",
    icon: Palette,
    tech: ["Motion", "GSAP", "Three.js", "Shaders"],
    colSpan: "lg:col-span-8",
  },
];

export const servicesCopy = {
  eyebrow: "// work",
  heading: "What I work on",
  subheading:
    "A few overlapping lanes — most of my projects blend web, mobile, and a little design engineering.",
};
