export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  start: string; // display string, e.g. "2024"
  end: string | "Present";
  location?: string;
  /** Short summary sentence — shown below the role */
  summary: string;
  /** Bullet achievements — kept deliberately few */
  highlights: string[];
  /** Tech hit during this role, shown as chips */
  tech: string[];
  /** Optional URL for the company logo/brand */
  url?: string;
};

export const experience: ExperienceEntry[] = [
  {
    id: "dealfuel",
    company: "DealFuel",
    role: "Full-Stack Developer",
    start: "2024",
    end: "Present",
    location: "Remote",
    summary:
      "Building and shipping production web + mobile features across the DealFuel product stack.",
    highlights: [
      // TODO Leo: replace these with real achievements when ready
      "Owning features end-to-end across Next.js and React Native.",
      "Shipping TypeScript — frontend, backend, and the integrations that glue them together.",
      "Partnering with design to keep the UI consistent across platforms.",
    ],
    tech: ["TypeScript", "React", "Next.js", "React Native", "Convex", "Clerk", "Node.js"],
    url: "https://roles.dealfuel.ai",
  },
];

export const experienceCopy = {
  eyebrow: "// experience",
  heading: "Currently at",
};
