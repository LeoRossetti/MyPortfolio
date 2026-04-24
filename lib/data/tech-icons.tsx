import type { ReactNode } from "react";
import {
  SiClerk,
  SiExpo,
  SiFramer,
  SiGooglechrome,
  SiGreensock,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";
import { ConvexIcon } from "@/components/icons/BrandIcons";

/**
 * Brand-coloured tech-stack icons for chips across Services / Projects /
 * Experience. Colours come from each brand's Simple Icons entry. Icons
 * whose brand mark is monochrome (Next.js, Expo, Three.js) are forced
 * to white so they don't look washed-out next to the coloured ones.
 * Unmapped names render as text-only chips (fine for things like
 * "Shaders" or "TBA").
 */
const techIcons: Record<string, ReactNode> = {
  TypeScript: <SiTypescript aria-hidden style={{ color: "#3178C6" }} />,
  React: <SiReact aria-hidden style={{ color: "#61DAFB" }} />,
  "React Native": <SiReact aria-hidden style={{ color: "#61DAFB" }} />,
  "Next.js": <SiNextdotjs aria-hidden style={{ color: "#ffffff" }} />,
  Tailwind: <SiTailwindcss aria-hidden style={{ color: "#06B6D4" }} />,
  Expo: <SiExpo aria-hidden style={{ color: "#ffffff" }} />,
  "Node.js": <SiNodedotjs aria-hidden style={{ color: "#5FA04E" }} />,
  Convex: <ConvexIcon style={{ color: "#EE342F" }} />,
  Clerk: <SiClerk aria-hidden style={{ color: "#6C47FF" }} />,
  Python: <SiPython aria-hidden style={{ color: "#3776AB" }} />,
  "C#": <SiSharp aria-hidden style={{ color: "#512BD4" }} />,
  Motion: <SiFramer aria-hidden style={{ color: "#0055FF" }} />,
  GSAP: <SiGreensock aria-hidden style={{ color: "#88CE02" }} />,
  "Three.js": <SiThreedotjs aria-hidden style={{ color: "#ffffff" }} />,
  "Chrome Extension API": (
    <SiGooglechrome aria-hidden style={{ color: "#4285F4" }} />
  ),
};

export function getTechIcon(name: string): ReactNode | null {
  return techIcons[name] ?? null;
}
