export type TerminalLine =
  | { kind: "command"; prompt?: string; text: string }
  | { kind: "output"; text: string; tone?: "default" | "muted" | "accent" }
  | { kind: "blank" };

export const heroTerminalLines: TerminalLine[] = [
  { kind: "command", prompt: "~", text: "whoami" },
  {
    kind: "output",
    text: "leo.rossetti --role=fullstack --location=remote",
  },
  { kind: "blank" },
  { kind: "command", prompt: "~", text: "stack --list" },
  {
    kind: "output",
    tone: "accent",
    text: "[typescript, react, next.js, react-native, node, python, c#]",
  },
  { kind: "blank" },
  { kind: "command", prompt: "~", text: "current" },
  {
    kind: "output",
    tone: "accent",
    text: "shipping next.js + react native",
  },
];

export const heroCopy = {
  eyebrow: "Full-stack developer",
  tagline: "Ships products, not prototypes.",
  ctas: {
    primary: { label: "View work", href: "#projects" },
    secondary: { label: "Get in touch", href: "#contact" },
  },
};
