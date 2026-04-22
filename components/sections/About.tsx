"use client";

import { motion } from "motion/react";
import { StackChip } from "@/components/site/StackChip";
import { aboutCopy, stack, values } from "@/lib/data/stack";
import { easeOutQuart, fadeUp, staggerChildren } from "@/lib/motion";

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutQuart },
  },
};

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10 lg:py-32"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left column — copy + values */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerChildren(0.1)}
          className="lg:col-span-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
          >
            {aboutCopy.eyebrow}
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-display mt-4 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-fg-primary block">
              {aboutCopy.headingLead}
            </span>
            <span className="from-fg-primary block bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
              {aboutCopy.headingAccent}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-fg-muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            {aboutCopy.paragraph}
          </motion.p>

          <motion.ul
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-2.5"
            aria-label="What I care about"
          >
            {values.map((v) => (
              <li
                key={v}
                className="border-border-subtle bg-bg-elevated/40 text-fg-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] backdrop-blur"
              >
                <span
                  aria-hidden
                  className="size-1 rounded-[1px] bg-[var(--accent-primary)] shadow-[0_0_6px_var(--accent-primary)]"
                />
                {v}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right column — flat chip cloud */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerChildren(0.035)}
          className="lg:col-span-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
          >
            {aboutCopy.stackEyebrow}
          </motion.p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {stack.map((item) => (
              <motion.div key={item.name} variants={chipVariants}>
                <StackChip item={item} />
              </motion.div>
            ))}
          </div>

          {/* Category legend — tiny, monochrome, bottom-aligned */}
          <motion.div
            variants={fadeUp}
            className="text-fg-dim mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.12em] uppercase"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--accent-primary)]" />
              languages
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--accent-secondary)]" />
              frontend
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--accent-warn)]" />
              mobile
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--accent-deep)]" />
              backend
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
