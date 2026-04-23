import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data/projects";

type Props = {
  project: Project;
  className?: string;
};

export function PlaceholderProjectCard({ project, className }: Props) {
  const label =
    project.status === "in-progress" ? "In progress" : "Coming soon";

  return (
    <div
      aria-label={`${project.title} — ${label}`}
      className={cn(
        "bg-bg-elevated/40 border-border-subtle relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border p-6 sm:p-8",
        className,
      )}
    >
      {/* Media placeholder — animated shimmer */}
      <div className="border-border-subtle bg-bg-base/40 relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div
          aria-hidden
          className="absolute inset-y-0 -left-1/3 w-1/3 animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="text-fg-dim size-7" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-1.5 animate-pulse rounded-full bg-[var(--accent-warn)] shadow-[0_0_8px_var(--accent-warn)]"
          />
          <span className="text-fg-dim font-mono text-[10px] tracking-[0.2em] uppercase">
            {label}
          </span>
        </div>
        <h3 className="font-display text-fg-primary/80 mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {project.title}
        </h3>
        <p className="text-fg-muted mt-3 text-sm leading-relaxed sm:text-[15px]">
          {project.description}
        </p>

        <div className="mt-auto pt-5">
          {/* skeleton chips */}
          <ul className="flex flex-wrap gap-2">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="bg-bg-surface/60 h-[22px] w-[72px] animate-pulse rounded-full"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
