export type NavSection = {
  id: string;
  label: string;
};

export const navSections: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const siteConfig = {
  name: "Leo Rossetti",
  tagline: "Full-stack dev. Ships products, not prototypes.",
  email: "leo.francatto@gmail.com",
  socials: {
    github: "https://github.com/LeoRossetti",
    linkedin: "https://www.linkedin.com/in/leorossetti",
    gmail: "mailto:leo.francatto@gmail.com",
  },
} as const;
