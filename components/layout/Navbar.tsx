"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navSections, siteConfig } from "@/lib/data/nav";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import StaggeredMenu, {
  type StaggeredMenuItem,
} from "@/components/reactbits/StaggeredMenu";

/**
 * Top-level navigation. Swaps between a standard text navbar on md+
 * and a fullscreen StaggeredMenu experience on mobile. Conditional
 * mount (vs CSS hide/show) keeps GSAP off the desktop bundle path.
 */
export function Navbar() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return isMobile ? <MobileStaggeredNav /> : <DesktopNavbar />;
}

function DesktopNavbar() {
  const [activeId, setActiveId] = useState<string>(navSections[0]?.id ?? "");
  const [scrolled, setScrolled] = useState(false);

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
        <a
          href="#home"
          onClick={handleNavClick("home")}
          className="text-fg-muted hover:text-fg-primary font-mono text-base tracking-wide transition-colors"
        >
          <span className="text-fg-dim">{"// "}</span>portfolio
        </a>

        <ul className="flex items-center gap-7 font-mono">
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
      </div>
    </motion.header>
  );
}

function MobileStaggeredNav() {
  const items: StaggeredMenuItem[] = navSections.map((s) => ({
    label: s.label,
    link: `#${s.id}`,
    ariaLabel: `Go to ${s.label}`,
  }));

  const socialItems = [
    { label: "LinkedIn", link: siteConfig.socials.linkedin },
    { label: "GitHub", link: siteConfig.socials.github },
    { label: "Email", link: siteConfig.socials.gmail },
  ];

  const handleItemClick = (item: StaggeredMenuItem) => {
    const id = item.link.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <StaggeredMenu
      isFixed
      position="right"
      items={items}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering={false}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      colors={["#2a2a2a", "#1c1c1c"]}
      logoNode={
        <span className="font-mono text-sm">
          <span className="text-fg-dim">{"// "}</span>
          <span className="text-fg-muted">portfolio</span>
        </span>
      }
      onItemClick={handleItemClick}
    />
  );
}
