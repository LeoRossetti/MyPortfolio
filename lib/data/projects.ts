export type ProjectStatus = "live" | "in-progress" | "coming-soon";

export type ProjectLink = {
  label: string;
  href: string;
  kind: "github" | "demo" | "external";
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: ProjectStatus;
  links?: ProjectLink[];
  /** Optional screenshot / video path under /public */
  media?: string;
  /** Tailwind class for lg+ grid span (12-col) */
  colSpan: string;
};

export const projects: Project[] = [
  {
    id: "yt-timestamp-saver",
    title: "YouTube Timestamp Saver",
    description:
      "A browser extension that lets you save and organise timestamps inside YouTube videos. Cross-device sync, keyboard shortcuts, and quick-jump navigation.",
    tech: ["TypeScript", "React", "Chrome Extension API"],
    status: "live",
    links: [
      // TODO Leo: replace these with real URLs when ready
      { label: "GitHub", href: "https://github.com/LeoRossetti", kind: "github" },
    ],
    colSpan: "lg:col-span-8",
  },
  {
    id: "next-1",
    title: "In the works",
    description: "Next project — details soon.",
    tech: ["TBA"],
    status: "in-progress",
    colSpan: "lg:col-span-4",
  },
  {
    id: "next-2",
    title: "In the works",
    description: "Next project — details soon.",
    tech: ["TBA"],
    status: "coming-soon",
    colSpan: "lg:col-span-6",
  },
  {
    id: "next-3",
    title: "In the works",
    description: "Next project — details soon.",
    tech: ["TBA"],
    status: "coming-soon",
    colSpan: "lg:col-span-6",
  },
];

export const projectsCopy = {
  eyebrow: "// projects",
  heading: "Shipped & shipping",
  subheading:
    "A small slice for now — more to come. Each tile links to source or a live demo when there is one.",
};
