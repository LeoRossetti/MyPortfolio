"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navSections, siteConfig } from "@/lib/data/nav";

export function Navbar() {
  const [activeId, setActiveId] = useState<string>(navSections[0]?.id ?? "");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding,background] duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all",
            scrolled
              ? "border-border-subtle bg-bg-base/70 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
              : "border-transparent bg-transparent",
          )}
        >
          <a
            href="#home"
            onClick={handleNavClick("home")}
            className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="relative grid size-6 place-items-center overflow-hidden rounded-md bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[11px] font-bold text-black">
              L
            </span>
            <span className="hidden sm:inline">{siteConfig.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navSections.slice(1).map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={handleNavClick(section.id)}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-colors",
                    activeId === section.id
                      ? "text-fg-primary"
                      : "text-fg-muted hover:text-fg-primary",
                  )}
                >
                  {activeId === section.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--bg-surface)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {section.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={handleNavClick("contact")}
              className="hidden rounded-full bg-[var(--accent-primary)] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 md:inline-flex"
            >
              Hire me
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="border-border-subtle flex size-9 items-center justify-center rounded-full border md:hidden"
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
        </nav>

        {mobileOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-border-subtle bg-bg-elevated mt-2 flex flex-col gap-1 rounded-2xl border p-3 md:hidden"
          >
            {navSections.slice(1).map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={handleNavClick(section.id)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm",
                    activeId === section.id
                      ? "text-fg-primary bg-[var(--bg-surface)]"
                      : "text-fg-muted",
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.header>
  );
}
