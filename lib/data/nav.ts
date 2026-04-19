export type NavSection = {
  id: string;
  label: string;
};

export const navSections: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const siteConfig = {
  name: "Leo Rossetti",
  tagline: "Full-stack dev. Ships products, not prototypes.",
  email: "leo@dealfuel.ai",
  socials: {
    github: "https://github.com/LeoRossetti",
    linkedin: "https://www.linkedin.com/in/leonardo-rossetti-francatto/",
    gmail: "mailto:leo@dealfuel.ai",
    protonmail: "mailto:leo@dealfuel.ai",
  },
} as const;
