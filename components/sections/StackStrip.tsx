"use client";

import { motion } from "motion/react";
import { LogoLoop } from "@/components/reactbits/LogoLoop";
import { techLogos } from "@/lib/data/logos";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Marquee strip of tech-stack logos that sits between Hero and About.
 * Above-the-fold stack signal without bloating the hero composition.
 * Logo-level hover brightens icons from muted grey to near-white.
 */
export function StackStrip() {
  const dict = useDictionary();
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease }}
      aria-label={dict.stackStrip.ariaLabel}
      className="border-border-subtle bg-bg-base relative overflow-hidden border-y py-10"
    >
      <LogoLoop
        logos={techLogos}
        speed={80}
        gap={64}
        logoHeight={36}
        fadeOut
        fadeOutColor="#171717"
        scaleOnHover
        pauseOnHover
        ariaLabel={dict.stackStrip.ariaLabel}
      />
    </motion.section>
  );
}
