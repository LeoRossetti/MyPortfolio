"use client";

import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { navSections, siteConfig } from "@/lib/data/nav";

/**
 * Site footer — three groups side-by-side on md+, stacked on mobile.
 * Solid bg-bg-base so the SiteBackdrop particles don't bleed through.
 *  - Brand block with the display font name + copyright line
 *  - Inline section nav
 *  - Social icon row
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-base border-border-subtle border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <p className="font-display text-fg-primary text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </p>
            <p className="text-fg-dim mt-1 text-sm">
              © {year} · All rights reserved
            </p>
          </div>

          {/* Section nav */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-fg-muted hover:text-fg-primary text-sm transition-colors"
              >
                {section.label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <ul className="flex items-center gap-4">
            <li>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-fg-muted hover:text-fg-primary transition-colors"
              >
                <LinkedinIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-fg-muted hover:text-fg-primary transition-colors"
              >
                <GithubIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.socials.gmail}
                aria-label="Email"
                className="text-fg-muted hover:text-fg-primary transition-colors"
              >
                <Mail className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
