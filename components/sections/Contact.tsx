"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { siteConfig } from "@/lib/data/nav";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { Scramble } from "@/components/animation/Scramble";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import type { Dictionary } from "@/lib/i18n/types";

type Channel = {
  label: string;
  href: string;
  handle: string;
  icon: React.ComponentType<{ className?: string }>;
  external: boolean;
  copyable?: string;
};

type CopyDict = Dictionary["contact"]["copy"];

export function Contact() {
  const dict = useDictionary();
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

  const channels: Channel[] = [
    {
      label: dict.contact.channels.linkedin,
      href: siteConfig.socials.linkedin,
      handle: "/in/leorossetti",
      icon: LinkedinIcon,
      external: true,
    },
    {
      label: dict.contact.channels.github,
      href: siteConfig.socials.github,
      handle: "@LeoRossetti",
      icon: GithubIcon,
      external: true,
    },
    {
      label: dict.contact.channels.email,
      href: siteConfig.socials.gmail,
      handle: siteConfig.email,
      icon: Mail,
      external: false,
      copyable: siteConfig.email,
    },
  ];

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
          <Scramble>{dict.contact.eyebrow}</Scramble>
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <Scramble as="span" className="text-fg-primary">
            {dict.contact.headingLead}
          </Scramble>{" "}
          <Scramble
            as="span"
            className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent"
          >
            {dict.contact.headingAccent}
          </Scramble>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-fg-muted max-w-xl text-base leading-relaxed sm:text-lg"
        >
          <Scramble>{dict.contact.paragraph}</Scramble>
        </motion.p>
      </motion.div>

      {/* Three contact cards, mirroring the bento chrome used by Services
          and Projects so the section feels at home in the grid. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren(0.08)}
        className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6"
      >
        {channels.map(({ label, href, handle, icon: Icon, external, copyable }) => (
          <motion.a
            key={label}
            variants={fadeUp}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group bg-bg-elevated/60 hover:bg-bg-elevated/80 border-border-subtle hover:border-border-strong relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="border-border-subtle bg-bg-base/70 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border">
                <Icon className="text-accent-primary size-5" />
              </span>
              {copyable ? (
                <CopyButton value={copyable} copy={dict.contact.copy} />
              ) : (
                <span
                  aria-hidden
                  className="text-fg-dim group-hover:text-accent-primary inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              )}
            </div>
            <div>
              <p className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase">
                <Scramble>{label}</Scramble>
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

/**
 * Small icon-only button that copies `value` to the clipboard. Sits inside
 * the Email channel card (which is itself a `mailto:` link), so the click
 * must stop both default navigation and event bubbling — otherwise the
 * card's anchor would also fire and open the mail client.
 */
function CopyButton({ value, copy }: { value: string; copy: CopyDict }) {
  const [copied, setCopied] = useState(false);

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(copy.toastSuccess);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(copy.toastError);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? copy.copied : copy.action}
      className="text-fg-dim hover:text-accent-primary focus-visible:text-accent-primary focus-visible:ring-accent-primary/40 relative z-10 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}
