"use client";

import { motion } from "motion/react";
import { LogoLoop } from "@/components/reactbits/LogoLoop";
import { techLogos } from "@/lib/data/logos";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Marquee strip of tech-stack logos that sits between Hero and About.
 * Above-the-fold stack signal for recruiters/clients without bloating the
 * hero composition. Logo-level hover brightens icons from muted grey to
 * near-white (see LogoLoop.css).
 */
export function StackStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease }}
      aria-label="Technology stack"
      className="border-border-subtle bg-bg-base relative overflow-hidden border-y py-10"
    >
      <LogoLoop
        logos={techLogos}
        speed={80}
        gap={64}
        logoHeight={36}
        fadeOut
        fadeOutColor="#0a0a0a"
        scaleOnHover
        pauseOnHover
        ariaLabel="Technology stack"
      />
    </motion.section>
  );
}
