export type TerminalLineKind = "command" | "output" | "blank";
export type TerminalLineKey =
  | "whoami"
  | "whoamiOutput"
  | "blank1"
  | "stackList"
  | "stackOutput"
  | "blank2"
  | "current"
  | "currentOutput";

export type TerminalLine =
  | { kind: "command"; prompt: string; key: TerminalLineKey }
  | { kind: "output"; key: TerminalLineKey; tone?: "default" | "muted" | "accent" }
  | { kind: "blank"; key: TerminalLineKey };

/** Structure only — actual text comes from `dict.hero.terminal` keyed by `key`. */
export const heroTerminalLines: TerminalLine[] = [
  { kind: "command", prompt: "~", key: "whoami" },
  { kind: "output", key: "whoamiOutput" },
  { kind: "blank", key: "blank1" },
  { kind: "command", prompt: "~", key: "stackList" },
  { kind: "output", tone: "accent", key: "stackOutput" },
  { kind: "blank", key: "blank2" },
  { kind: "command", prompt: "~", key: "current" },
  { kind: "output", tone: "accent", key: "currentOutput" },
];

export const heroCtaTargets = {
  primary: "#projects",
  secondary: "#contact",
} as const;
