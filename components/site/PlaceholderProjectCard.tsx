"use client";

import { Lock } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  /** Localised copy for this project (title + description). */
  copy: { title: string; description: string };
  /** Localised status label (e.g. "In progress", "Coming soon"). */
  statusLabel: string;
  className?: string;
  /** Optional scroll-linked y value applied to the media placeholder. */
  mediaY?: MotionValue<number>;
};

export function PlaceholderProjectCard({
  copy,
  statusLabel,
  className,
  mediaY,
}: Props) {
  return (
    <div
      aria-label={`${copy.title} — ${statusLabel}`}
      className={cn(
        "bg-bg-elevated/40 border-border-subtle relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-6 sm:min-h-[300px] sm:p-8",
        className,
      )}
    >
      {/* Media placeholder — animated shimmer. Inner motion layer is
          over-provisioned so the ±20px parallax drift doesn't reveal a
          gap. */}
      <div className="border-border-subtle bg-bg-base/40 relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
        <motion.div
          style={mediaY ? { y: mediaY } : undefined}
          className="absolute -top-8 -bottom-8 left-0 right-0"
        >
          <div className="bg-grid absolute inset-0 opacity-30" />
          <div
            aria-hidden
            className="absolute inset-y-0 -left-1/3 w-1/3 animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="text-fg-dim size-7" strokeWidth={1.5} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-1.5 animate-pulse rounded-full bg-[var(--accent-warn)] shadow-[0_0_8px_var(--accent-warn)]"
          />
          <span className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase">
            {statusLabel}
          </span>
        </div>
        <h3 className="font-display text-fg-primary/80 mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {copy.title}
        </h3>
        <p className="text-fg-muted mt-3 text-sm leading-relaxed sm:text-[15px]">
          {copy.description}
        </p>

        <div className="mt-auto pt-5">
          {/* skeleton chips */}
          <ul className="flex flex-wrap gap-2">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="bg-bg-surface/60 h-[26px] w-[84px] animate-pulse rounded-full"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
