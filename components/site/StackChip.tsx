import { cn } from "@/lib/utils";
import type { StackCategory, StackItem } from "@/lib/data/stack";

const categoryDotClass: Record<StackCategory, string> = {
  languages: "bg-[var(--accent-primary)]",
  frontend: "bg-[var(--accent-secondary)]",
  mobile: "bg-[var(--accent-warn)]",
  backend: "bg-[var(--accent-deep)]",
  tooling: "bg-[var(--fg-dim)]",
};

type Props = {
  item: StackItem;
  className?: string;
};

export function StackChip({ item, className }: Props) {
  return (
    <span
      className={cn(
        "border-border-subtle bg-bg-elevated/50 text-fg-primary hover:border-border-strong hover:bg-bg-elevated inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur transition-colors",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full shadow-[0_0_6px_currentColor]",
          categoryDotClass[item.category],
        )}
      />
      {item.name}
    </span>
  );
}
