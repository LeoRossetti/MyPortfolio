"use client";

import { motion } from "motion/react";
import { ServiceCard } from "@/components/site/ServiceCard";
import { services, servicesCopy } from "@/lib/data/services";
import { fadeUp, staggerChildren } from "@/lib/motion";

export function Services() {
  return (
    <section
      id="services"
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
          {servicesCopy.eyebrow}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="text-fg-primary">What I </span>
          <span className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
            work on
          </span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-fg-muted max-w-xl text-base leading-relaxed sm:text-lg"
        >
          {servicesCopy.subheading}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerChildren(0.08)}
        className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={fadeUp}
            className={service.colSpan}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
