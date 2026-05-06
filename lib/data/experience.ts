export type ExperienceId = "dealfuel";

export type ExperienceEntry = {
  id: ExperienceId;
  company: string;
  start: string;
  end: string | "Present";
  tech: string[];
  url?: string;
};

export const experience: ExperienceEntry[] = [
  {
    id: "dealfuel",
    company: "DealFuel",
    start: "2024",
    end: "Present",
    tech: ["TypeScript", "React", "Next.js", "React Native", "Convex", "Clerk", "Node.js"],
    url: "https://roles.dealfuel.ai",
  },
];
