"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/lib/data/experience";
import { easeOutQuart } from "@/lib/motion";

type Props = {
  entry: ExperienceEntry;
  isCurrent?: boolean;
  className?: string;
};

export function TimelineEntry({ entry, isCurrent, className }: Props) {
  const { company, role, start, end, location, summary, highlights, tech, url } =
    entry;

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: easeOutQuart }}
      className={cn("relative pl-10 sm:pl-14", className)}
    >
      {/* Node on the timeline */}
      <div
        aria-hidden
        className="absolute top-1 left-0 flex size-6 items-center justify-center sm:size-8"
      >
        <span
          className={cn(
            "bg-accent-primary absolute size-2.5 rounded-full",
            isCurrent && "shadow-[0_0_14px_var(--accent-primary)]",
          )}
        />
        {isCurrent && (
          <span
            aria-hidden
            className="border-accent-primary/40 absolute size-6 animate-ping rounded-full border sm:size-7"
          />
        )}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-fg-primary text-xl font-semibold tracking-tight sm:text-2xl">
          {role}{" "}
          <span className="text-fg-muted">@ </span>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary inline-flex items-center gap-1.5 transition-colors"
            >
              {company}
              <ExternalLink className="size-4 opacity-60" />
            </a>
          ) : (
            company
          )}
        </h3>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-fg-muted">{start}</span>
          <span className="text-fg-dim">→</span>
          <span
            className={cn(
              "text-fg-muted",
              end === "Present" && "text-accent-primary",
            )}
          >
            {end}
          </span>
        </div>
      </div>

      {location && (
        <p className="text-fg-dim mt-1 font-mono text-[11px] tracking-wide uppercase">
          {location}
        </p>
      )}

      <p className="text-fg-muted mt-4 max-w-2xl text-[15px] leading-relaxed">
        {summary}
      </p>

      <ul className="mt-5 space-y-2">
        {highlights.map((h, i) => (
          <li
            key={i}
            className="text-fg-primary/90 relative pl-5 text-sm leading-relaxed"
          >
            <span
              aria-hidden
              className="bg-accent-deep absolute top-[9px] left-0 size-1.5 rounded-full"
            />
            {h}
          </li>
        ))}
      </ul>

      {tech.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {tech.map((t) => (
            <li
              key={t}
              className="border-border-subtle text-fg-dim bg-bg-elevated/40 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wide"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}
