"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/lib/data/experience";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { TechChip } from "@/components/site/TechChip";
import { Scramble } from "@/components/animation/Scramble";

type Props = {
  entry: ExperienceEntry;
  /** Localised copy for this entry (role, location, summary, highlights). */
  entryCopy: {
    role: string;
    location: string;
    summary: string;
    highlights: readonly string[];
  };
  /** Localised label rendered when `isCurrent` is true. */
  presentLabel: string;
  isCurrent?: boolean;
  className?: string;
};

/**
 * Timeline entry block. The `<motion.article>` is a stagger
 * orchestrator; major blocks (heading row, location, summary, each
 * highlight, tech chips) cascade in at 0.1s intervals. Kept flat
 * (no nested variant staggers) — nested `staggerChildren` can fail
 * to cascade in certain motion v12 tree shapes.
 */
export function TimelineEntry({
  entry,
  entryCopy,
  presentLabel,
  isCurrent,
  className,
}: Props) {
  const { company, start, end, tech, url } = entry;
  const { role, location, summary, highlights } = entryCopy;

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerChildren(0.1)}
      className={cn("relative", className)}
    >
      {/* Heading row: role/company on the left, date range on the right. */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2"
      >
        <h3 className="font-display text-fg-primary text-xl font-semibold tracking-tight sm:text-2xl">
          <Scramble>{role}</Scramble> <span className="text-fg-muted">@ </span>
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
            {end === "Present" ? <Scramble>{presentLabel}</Scramble> : end}
          </span>
        </div>
      </motion.div>

      {location && (
        <motion.p
          variants={fadeUp}
          className="text-fg-dim mt-1 font-mono text-xs tracking-wide uppercase"
        >
          <Scramble>{location}</Scramble>
        </motion.p>
      )}

      <motion.p
        variants={fadeUp}
        className="text-fg-muted mt-4 max-w-2xl text-[15px] leading-relaxed"
      >
        <Scramble>{summary}</Scramble>
      </motion.p>

      <motion.ul variants={staggerChildren(0.08)} className="mt-5 space-y-2">
        {highlights.map((h, i) => (
          <motion.li
            key={i}
            variants={fadeUp}
            className="text-fg-primary/90 relative pl-5 text-sm leading-relaxed"
          >
            <span
              aria-hidden
              className="bg-accent-deep absolute top-[9px] left-0 size-1.5 rounded-full"
            />
            <Scramble>{h}</Scramble>
          </motion.li>
        ))}
      </motion.ul>

      {tech.length > 0 && (
        <motion.ul variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
          {tech.map((t) => (
            <TechChip key={t} name={t} tone="elevated" />
          ))}
        </motion.ul>
      )}
    </motion.article>
  );
}
