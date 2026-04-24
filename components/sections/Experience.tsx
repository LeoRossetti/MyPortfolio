"use client";

import { motion } from "motion/react";
import { TimelineEntry } from "@/components/site/TimelineEntry";
import { experience, experienceCopy } from "@/lib/data/experience";
import { fadeUp, staggerChildren } from "@/lib/motion";

export function Experience() {
  return (
    <section
      id="experience"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10 lg:py-32"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren(0.08)}
        className="mb-12 flex flex-col items-start gap-4 sm:mb-14"
      >
        <motion.p
          variants={fadeUp}
          className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
        >
          {experienceCopy.eyebrow}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="text-fg-primary">{experienceCopy.heading} </span>
          <span className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
            DealFuel
          </span>
        </motion.h2>
      </motion.div>

      <div className="max-w-3xl space-y-12">
        {experience.map((entry, i) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            isCurrent={entry.end === "Present" && i === 0}
          />
        ))}
      </div>
    </section>
  );
}
