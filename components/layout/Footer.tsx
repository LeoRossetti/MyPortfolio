"use client";

import { ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/data/nav";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-border-subtle relative mt-24 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-10">
        <div className="flex flex-col gap-1">
          <p className="text-fg-muted font-mono text-xs">
            © {year} {siteConfig.name}. Built with Next.js, Motion &amp;
            Three.js.
          </p>
          <p className="text-fg-dim font-mono text-[10px] tracking-[0.15em] uppercase">
            — always shipping
          </p>
        </div>

        <button
          type="button"
          onClick={scrollTop}
          className="group border-border-subtle hover:border-border-strong text-fg-muted hover:text-fg-primary flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
