"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { siteConfig } from "@/lib/data/nav";
import { fadeUp, staggerChildren } from "@/lib/motion";

const channels = [
  {
    label: "LinkedIn",
    href: siteConfig.socials.linkedin,
    handle: "/in/leorossetti",
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "GitHub",
    href: siteConfig.socials.github,
    handle: "@LeoRossetti",
    icon: GithubIcon,
    external: true,
  },
  {
    label: "Email",
    href: siteConfig.socials.gmail,
    handle: siteConfig.email,
    icon: Mail,
    external: false,
  },
] as const;

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Header holds full opacity while the section is in view, then dims
  // to 0.5 as it scrolls past the viewport.
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, 0.5],
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10 lg:py-32"
    >
      {/* Section header — matches the pattern used by Services, Projects,
          and Experience. */}
      <motion.div
        style={{ opacity: headlineOpacity }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren(0.1)}
        className="mb-12 flex flex-col items-start gap-4 sm:mb-14"
      >
        <motion.p
          variants={fadeUp}
          className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
        >
          {`// contact`}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="text-fg-primary">Say </span>
          <span className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
            hi.
          </span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-fg-muted max-w-xl text-base leading-relaxed sm:text-lg"
        >
          Questions, collaborations, or just want to chat about a stack? Any
          of these lands straight with me — I usually reply within a day.
        </motion.p>
      </motion.div>

      {/* Three contact cards, mirroring the bento chrome used by Services
          and Projects so the section feels at home in the grid. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren(0.08)}
        className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-6"
      >
        {channels.map(({ label, href, handle, icon: Icon, external }) => (
          <motion.a
            key={label}
            variants={fadeUp}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group bg-bg-elevated/60 border-border-subtle hover:border-border-strong relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-colors sm:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="border-border-subtle bg-bg-base/70 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border">
                <Icon className="text-accent-primary size-5" />
              </span>
              <span
                aria-hidden
                className="text-fg-dim group-hover:text-accent-primary inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
              >
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <p className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase">
                {label}
              </p>
              <p className="text-fg-primary mt-2 font-mono text-sm break-all sm:text-base">
                {handle}
              </p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
