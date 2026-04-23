"use client";

import { motion } from "motion/react";
import { fadeUp, staggerChildren } from "@/lib/motion";

/**
 * Bio-only About section. The stack display lives entirely in the
 * LogoLoop above; this section is purely "who I am / where I'm from /
 * what I do". Single-column, left-aligned prose — deliberately different
 * in layout from the grid-based sections that follow.
 */
export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-3xl px-6 py-24 lg:px-10 lg:py-36"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren(0.12)}
      >
        <motion.p
          variants={fadeUp}
          className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
        >
          {`// about`}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="text-fg-primary font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Hi, I&apos;m Leo.
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="text-fg-muted mt-8 space-y-5 text-base leading-relaxed sm:text-lg"
        >
          <p>
            A full-stack developer from{" "}
            <span className="text-fg-primary">Brazil</span>, three years into
            the craft. I like shipping whole products end-to-end — the data
            model, the backend, the UI, the polish — not just prototypes.
          </p>
          <p className="text-fg-dim font-mono text-sm tracking-wide">
            Remote · always shipping
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
