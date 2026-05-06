export type ProjectStatus = "live" | "in-progress" | "coming-soon";

export type ProjectLink = {
  labelKey: "github" | "demo" | "external";
  href: string;
  kind: "github" | "demo" | "external";
};

export type Project = {
  id: string;
  tech: string[];
  status: ProjectStatus;
  links?: ProjectLink[];
  media?: string;
  colSpan: string;
};

export const projects: Project[] = [
  {
    id: "yt-timestamp-saver",
    tech: ["TypeScript", "React", "Chrome Extension API"],
    status: "live",
    links: [
      { labelKey: "github", href: "https://github.com/LeoRossetti", kind: "github" },
    ],
    colSpan: "lg:col-span-8",
  },
  { id: "next-1", tech: ["TBA"], status: "in-progress", colSpan: "lg:col-span-4" },
  { id: "next-2", tech: ["TBA"], status: "coming-soon", colSpan: "lg:col-span-6" },
  { id: "next-3", tech: ["TBA"], status: "coming-soon", colSpan: "lg:col-span-6" },
];
