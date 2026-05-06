export type StackCategory =
  | "languages"
  | "frontend"
  | "mobile"
  | "backend"
  | "tooling";

export type StackItem = {
  name: string;
  category: StackCategory;
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

/** Tech terms — NOT translated. Stay as proper-noun strings. */
export const values = ["clean code", "ships fast", "design-minded"] as const;
