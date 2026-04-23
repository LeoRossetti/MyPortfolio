"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data/projects";

type Props = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: Props) {
  const { title, description, tech, links } = project;
  const primaryLink = links?.[0];

  return (
    <a
      href={primaryLink?.href ?? "#"}
      target={primaryLink ? "_blank" : undefined}
      rel={primaryLink ? "noopener noreferrer" : undefined}
      className={cn(
        "group bg-bg-elevated/60 border-border-subtle hover:border-border-strong relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-colors sm:p-8",
        className,
      )}
    >
      {/* Media placeholder — monochrome wash if no real screenshot yet */}
      <div className="border-border-subtle bg-bg-base/50 relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(255,255,255,0.12),transparent_70%),radial-gradient(ellipse_60%_40%_at_0%_0%,rgba(255,255,255,0.06),transparent_70%)]"
        />
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-fg-dim/60 text-4xl font-bold tracking-tighter sm:text-6xl">
            {title.split(" ")[0]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-fg-primary text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h3>
          <span className="text-fg-dim group-hover:text-accent-primary inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        <p className="text-fg-muted mt-3 text-sm leading-relaxed sm:text-[15px]">
          {description}
        </p>

        <div className="mt-auto pt-5">
          <ul className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <li
                key={t}
                className="border-border-subtle text-fg-dim bg-bg-base/40 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wide"
              >
                {t}
              </li>
            ))}
          </ul>

          {links && links.length > 0 && (
            <div className="border-border-subtle mt-5 flex items-center gap-3 border-t pt-4">
              {links.map((link) => (
                <span
                  key={link.href}
                  className="text-fg-muted group-hover:text-fg-primary inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
                >
                  {link.kind === "github" ? (
                    <GithubIcon className="size-3.5" />
                  ) : (
                    <ExternalLink className="size-3.5" />
                  )}
                  {link.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
