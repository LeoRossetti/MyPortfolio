import type { LucideIcon } from "lucide-react";
import { Code, Smartphone, Server, Palette } from "lucide-react";

export type ServiceId =
  | "full-stack-web"
  | "mobile"
  | "backend"
  | "design-engineering";

export type Service = {
  id: ServiceId;
  icon: LucideIcon;
  tech: string[];
  colSpan: string;
};

export const services: Service[] = [
  {
    id: "full-stack-web",
    icon: Code,
    tech: ["React", "Next.js", "TypeScript", "Convex", "Clerk", "Tailwind"],
    colSpan: "lg:col-span-8",
  },
  { id: "mobile", icon: Smartphone, tech: ["React Native", "Expo"], colSpan: "lg:col-span-4" },
  { id: "backend", icon: Server, tech: ["Node.js", "Python", "C#"], colSpan: "lg:col-span-4" },
  {
    id: "design-engineering",
    icon: Palette,
    tech: ["Motion", "GSAP", "Shaders"],
    colSpan: "lg:col-span-8",
  },
];
