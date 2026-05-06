export type NavSectionId =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "experience"
  | "contact";

export type NavSection = { id: NavSectionId };

export const navSections: NavSection[] = [
  { id: "home" },
  { id: "about" },
  { id: "services" },
  { id: "projects" },
  { id: "experience" },
  { id: "contact" },
];

export const siteConfig = {
  name: "Leo Rossetti",
  email: "leo.francatto@gmail.com",
  socials: {
    github: "https://github.com/LeoRossetti",
    linkedin: "https://www.linkedin.com/in/leorossetti",
    gmail: "mailto:leo.francatto@gmail.com",
  },
} as const;
