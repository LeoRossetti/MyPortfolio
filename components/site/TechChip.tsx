import { cn } from "@/lib/utils";
import { getTechIcon } from "@/lib/data/tech-icons";

type Props = {
  name: string;
  /**
   * Background tone. `"base"` sits on a bg-elevated card (Services,
   * Projects). `"elevated"` sits on a transparent section (Experience).
   */
  tone?: "base" | "elevated";
  className?: string;
};

/**
 * Shared tech-stack pill. Renders a monochrome icon + label, or falls
 * back to label-only when no icon is mapped. Always an `<li>` — use
 * inside a `<ul>` parent to keep semantics clean.
 */
export function TechChip({ name, tone = "base", className }: Props) {
  const icon = getTechIcon(name);
  return (
    <li
      className={cn(
        "border-border-subtle text-fg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide",
        tone === "elevated" ? "bg-bg-elevated/40" : "bg-bg-base/40",
        className,
      )}
    >
      {icon && (
        <span className="inline-flex shrink-0 text-sm leading-none">
          {icon}
        </span>
      )}
      {name}
    </li>
  );
}
