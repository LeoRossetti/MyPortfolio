"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TypingTerminal } from "@/components/animation/TypingTerminal";
import { heroCopy, heroTerminalLines } from "@/lib/data/hero";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden pt-20 pb-16 lg:pt-24"
    >
      {/* Static backdrop — grid texture + soft red pooling at top/bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="bg-radial-glow absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_70%,var(--bg-base)_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="border-border-subtle bg-bg-elevated/60 text-fg-muted inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide backdrop-blur"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
          {heroCopy.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-display mt-6 bg-gradient-to-b from-[var(--accent-secondary)] via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-transparent"
        >
          <span className="block">Leo</span>
          <span className="block">Rossetti</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="text-fg-muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
        >
          <span className="text-fg-primary">Full-stack developer.</span>{" "}
          {heroCopy.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36, ease }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={heroCopy.ctas.primary.href}
            onClick={handleNavClick(heroCopy.ctas.primary.href)}
            className="group bg-fg-primary text-bg-base inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--accent-primary)] hover:text-white"
          >
            {heroCopy.ctas.primary.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={heroCopy.ctas.secondary.href}
            onClick={handleNavClick(heroCopy.ctas.secondary.href)}
            className="group border-border-subtle hover:border-border-strong text-fg-primary inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--bg-elevated)]"
          >
            {heroCopy.ctas.secondary.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-14 w-full max-w-lg"
        >
          <TypingTerminal lines={heroTerminalLines} />
        </motion.div>
      </div>

      {/* Scroll affordance — subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9, ease }}
        className="text-fg-dim pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase"
      >
        scroll ↓
      </motion.div>
    </section>
  );
}
