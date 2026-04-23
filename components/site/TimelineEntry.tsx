"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/lib/data/experience";
import { easeOutQuart } from "@/lib/motion";
import { TechChip } from "@/components/site/TechChip";

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: easeOutQuart }}
      className={cn("relative", className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
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
              "text-fg-muted inline-flex items-center gap-1.5",
              end === "Present" && "text-accent-primary",
            )}
          >
            {isCurrent && (
              <span
                aria-hidden
                className="bg-accent-primary size-1.5 animate-pulse rounded-full shadow-[0_0_8px_var(--accent-primary)]"
              />
            )}
            {end}
          </span>
        </div>
      </div>

      {location && (
        <p className="text-fg-dim mt-1 font-mono text-xs tracking-wide uppercase">
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
            <TechChip key={t} name={t} tone="elevated" />
          ))}
        </ul>
      )}
    </motion.article>
  );
}
