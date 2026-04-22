export type StackCategory =
  | "languages"
  | "frontend"
  | "mobile"
  | "backend"
  | "tooling";

export type StackItem = {
  name: string;
  category: StackCategory;
  note?: string;
};

export const stack: StackItem[] = [
  { name: "TypeScript", category: "languages" },
  { name: "Python", category: "languages" },
  { name: "C#", category: "languages" },
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind", category: "frontend" },
  { name: "React Native", category: "mobile" },
  { name: "Expo", category: "mobile" },
  { name: "Node.js", category: "backend" },
  { name: "Convex", category: "backend" },
  { name: "Clerk", category: "backend" },
];

/** Kept for future use — the v1 About renders a flat cloud without labels. */
export const stackCategoryLabel: Record<StackCategory, string> = {
  languages: "Languages",
  frontend: "Frontend",
  mobile: "Mobile",
  backend: "Backend",
  tooling: "Tooling",
};

export const values = ["clean code", "ships fast", "design-minded"] as const;

export const aboutCopy = {
  eyebrow: "// about",
  headingLead: "Shipping products",
  headingAccent: "end-to-end",
  paragraph:
    "I build polished web and mobile apps end-to-end — from data model to pixel. Currently full-stack at DealFuel, shipping TypeScript across Next.js, React Native, and the backend that ties them together.",
  stackEyebrow: "// stack",
};
