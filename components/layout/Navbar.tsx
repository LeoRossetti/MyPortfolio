"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navSections } from "@/lib/data/nav";

export function Navbar() {
  const [activeId, setActiveId] = useState<string>(navSections[0]?.id ?? "");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Glass-on-scroll: transparent while the hero is in view, glassy past it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navSections.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-border-subtle bg-bg-base/70 border-b backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Left: mono label. No more logo mark, no more name — hero owns that. */}
        <a
          href="#home"
          onClick={handleNavClick("home")}
          className="text-fg-muted hover:text-fg-primary font-mono text-base tracking-wide transition-colors"
        >
          <span className="text-fg-dim">{"// "}</span>portfolio
        </a>

        {/* Desktop nav — lowercase mono links, no pill container, just text. */}
        <ul className="hidden items-center gap-7 font-mono md:flex">
          {navSections.slice(1).map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={handleNavClick(section.id)}
                className={cn(
                  "text-base transition-colors",
                  activeId === section.id
                    ? "text-fg-primary"
                    : "text-fg-muted hover:text-fg-primary",
                )}
              >
                {section.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="border-border-subtle flex size-9 items-center justify-center rounded-md border md:hidden"
        >
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "bg-fg-primary h-px w-4 transition",
                mobileOpen && "translate-y-[3px] rotate-45",
              )}
            />
            <span
              className={cn(
                "bg-fg-primary h-px w-4 transition",
                mobileOpen && "-translate-y-[2px] -rotate-45",
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-border-subtle bg-bg-base/90 flex flex-col gap-1 border-b px-6 pb-6 font-mono backdrop-blur-xl md:hidden"
        >
          {navSections.slice(1).map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={handleNavClick(section.id)}
                className={cn(
                  "block rounded-md px-2 py-2 text-base",
                  activeId === section.id
                    ? "text-fg-primary"
                    : "text-fg-muted",
                )}
              >
                {section.label.toLowerCase()}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
