"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { Scramble } from "@/components/animation/Scramble";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

/**
 * Bio-only About section. Matches the container width of every other
 * content section (`max-w-6xl`) so the left edge aligns; prose inside
 * is capped to `max-w-2xl` for readability (~65ch line length).
 *
 * Single-column, left-aligned — deliberately different in layout from
 * the grid-based sections that follow. Each block staggers in on its
 * own beat; the eyebrow drifts at half speed as the section scrolls.
 */
export function About() {
  const dict = useDictionary();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const eyebrowY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10 lg:py-32"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren(0.12)}
        className="max-w-2xl"
      >
        <motion.p
          variants={fadeUp}
          style={{ y: eyebrowY }}
          className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
        >
          <Scramble>{dict.about.eyebrow}</Scramble>
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="text-fg-primary font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <Scramble>{dict.about.heading}</Scramble>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-fg-muted mt-8 text-base leading-relaxed sm:text-lg"
        >
          <Scramble>{dict.about.paragraphLeadFrom}</Scramble>{" "}
          <Scramble as="span" className="text-fg-primary">
            {dict.about.paragraphCountry}
          </Scramble>
          <Scramble>{dict.about.paragraphTail}</Scramble>
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-fg-dim mt-5 font-mono text-sm tracking-wide"
        >
          <Scramble>{dict.about.status}</Scramble>
        </motion.p>
      </motion.div>
    </section>
  );
}
