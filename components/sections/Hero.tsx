"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { heroCopy } from "@/lib/data/hero";

// Heavy (three + custom shader + image texture). Keep it out of the initial
// bundle and off the SSR path — needs the browser's WebGL + DOM.
const GridDistortion = dynamic(
  () => import("@/components/reactbits/GridDistortion"),
  { ssr: false, loading: () => null },
);

// Seeded greyscale Picsum — stable across loads so the backdrop isn't
// random each refresh. Swap to a local /public image path once Leo has
// one he wants to use.
const HERO_IMAGE = "https://picsum.photos/seed/leo-portfolio/1920/1080?grayscale";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden pt-16 pb-28 lg:pt-20 lg:pb-36"
    >
      {/* Grid-distorted greyscale image as the backdrop (React Bits). The
          image distorts around the cursor and relaxes back on its own.
          Layering from back to front:
           1. Static grid + radial glow (fallback while three.js chunk loads)
           2. GridDistortion canvas (animated, mouse-responsive)
           3. Dark tint so body content above stays legible
           4. Edge fade into bg-base so the backdrop doesn't seam */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="bg-radial-glow pointer-events-none absolute inset-0" />

        <div className="absolute inset-0 opacity-60">
          <GridDistortion
            imageSrc={HERO_IMAGE}
            grid={14}
            mouse={0.12}
            strength={0.18}
            relaxation={0.92}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[color:var(--bg-base)]/50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_50%,var(--bg-base)_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center lg:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="text-fg-primary font-display text-[clamp(3.75rem,12vw,9.5rem)] leading-[0.88] font-bold tracking-[-0.055em]"
        >
          <span className="block">Leo</span>
          <span className="block">Rossetti</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="text-fg-muted mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
        >
          <span className="text-fg-primary">Full-stack developer.</span>{" "}
          {heroCopy.tagline}
        </motion.p>
      </div>

      {/* Scroll affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease }}
        className="text-fg-dim pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase"
      >
        scroll ↓
      </motion.div>
    </section>
  );
}
