"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import TextType from "@/components/reactbits/TextType";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Heavy (three + custom shader + image texture). Keep it out of the initial
// bundle and off the SSR path — needs the browser's WebGL + DOM.
const GridDistortion = dynamic(
  () => import("@/components/reactbits/GridDistortion"),
  { ssr: false, loading: () => null },
);

// Seeded greyscale Picsum — stable across loads so the backdrop isn't
// random each refresh. Swap to a local /public image path once Leo has
// one he wants to use.
const HERO_IMAGE =
  "https://picsum.photos/seed/leo-portfolio/1920/1080?grayscale";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const dict = useDictionary();
  const heroRef = useRef<HTMLElement>(null);
  // Mobile gets a static cover-fit image instead of the GridDistortion
  // shader. Touch devices don't fire mousemove (so the effect is just a
  // static stretched image anyway), and skipping the WebGL context
  // saves them the allocation.
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Scroll-coupled transform: name + tagline gently shrink, drift up, and
  // fade as the user scrolls past the hero. "start start" → "end start"
  // = 0 while the hero is fully visible, 1 when its top meets the top of
  // the viewport (i.e. fully scrolled out).
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 0.55, 0.1],
  );
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden pt-16 pb-28 lg:pt-20 lg:pb-36"
    >
      {/* Grid-distorted greyscale image as the backdrop (React Bits). The
          image distorts around the cursor and relaxes back on its own.
          Layering from back to front:
           1. Static grid + radial glow (fallback while three.js chunk loads)
           2. GridDistortion canvas (animated, mouse-responsive) — or a
              static cover-fit image on mobile where touch devices can't
              drive the distortion
           3. Dark tint so body content above stays legible
           4. Edge fade into bg-base so the backdrop doesn't seam */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Opaque base: masks the site-wide ambient particles in the Hero
            area so they don't bleed through the semi-transparent
            decorative layers below. */}
        <div className="absolute inset-0 bg-[color:var(--bg-base)]" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="bg-radial-glow pointer-events-none absolute inset-0" />

        {isMobile ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
        ) : (
          <div className="absolute inset-0 opacity-60">
            <GridDistortion
              imageSrc={HERO_IMAGE}
              grid={14}
              mouse={0.12}
              strength={0.18}
              relaxation={0.92}
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[color:var(--bg-base)]/50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_50%,var(--bg-base)_100%)]" />
      </div>

      {/* Scroll-linked wrapper: scales/fades/lifts the content as user
          scrolls out. The inner h1 and tagline keep their own mount-in
          animations on top. */}
      <motion.div
        style={{
          scale: contentScale,
          opacity: contentOpacity,
          y: contentY,
        }}
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center lg:px-10"
      >
        {/* Typed name — TextType from React Bits. initialDelay waits out the
            TerminalBoot overlay (~1.5s) so the typing plays AFTER the wipe
            instead of behind it. */}
        <TextType
          as="h1"
          text={dict.hero.name}
          typingSpeed={75}
          initialDelay={1800}
          loop={false}
          showCursor
          hideCursorOnDone
          cursorBlinkDuration={0.55}
          className="text-fg-primary font-display text-[clamp(2.75rem,10vw,9rem)] leading-[0.9] font-bold whitespace-nowrap tracking-[-0.055em]"
          cursorClassName="text-fg-muted"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="text-fg-muted mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
        >
          <span className="text-fg-primary">{dict.hero.taglineLead}</span>{" "}
          {dict.hero.tagline}
        </motion.p>
      </motion.div>

      {/* Scroll affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease }}
        className="text-fg-dim pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.3em] uppercase"
      >
        {dict.hero.scrollHint}
      </motion.div>
    </section>
  );
}
