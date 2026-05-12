"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ProjectCard } from "@/components/site/ProjectCard";
import { PlaceholderProjectCard } from "@/components/site/PlaceholderProjectCard";
import { projects, type Project } from "@/lib/data/projects";
import { fadeUp, popIn, staggerChildren } from "@/lib/motion";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import type { Dictionary } from "@/lib/i18n/types";

type ProjectCopy = Dictionary["projects"]["items"][keyof Dictionary["projects"]["items"]];
type StatusLabels = Dictionary["projects"]["statusLabels"];
type LinkLabels = Dictionary["projects"]["linkLabels"];

export function Projects() {
  const dict = useDictionary();
  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10 lg:py-32"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren(0.08)}
        className="mb-12 flex flex-col items-start gap-4 sm:mb-14"
      >
        <motion.p
          variants={fadeUp}
          className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
        >
          {dict.projects.eyebrow}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="text-fg-primary">{dict.projects.headingLead} </span>
          <span className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
            {dict.projects.headingAccent}
          </span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-fg-muted max-w-xl text-base leading-relaxed sm:text-lg"
        >
          {dict.projects.subheading}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        variants={staggerChildren(0.08)}
        className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
      >
        {projects.map((project) => (
          <ProjectCardItem
            key={project.id}
            project={project}
            copy={dict.projects.items[project.id as keyof typeof dict.projects.items]}
            statusLabels={dict.projects.statusLabels}
            linkLabels={dict.projects.linkLabels}
          />
        ))}
      </motion.div>
    </section>
  );
}

/**
 * Per-card wrapper. The ref sits on the OUTER plain div so its
 * bounding rect is stable — `useScroll` measures via
 * `getBoundingClientRect`, which returns the transformed rect. If the
 * ref was on the animated motion.div (popIn does scale 0.95→1), the
 * measurement would drift and scroll progress could mis-fire.
 */
function ProjectCardItem({
  project,
  copy,
  statusLabels,
  linkLabels,
}: {
  project: Project;
  copy: ProjectCopy;
  statusLabels: StatusLabels;
  linkLabels: LinkLabels;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={ref} className={project.colSpan}>
      <motion.div variants={popIn} className="h-full">
        {project.status === "live" ? (
          <ProjectCard
            project={project}
            copy={copy}
            linkLabels={linkLabels}
            mediaY={mediaY}
          />
        ) : (
          <PlaceholderProjectCard
            copy={copy}
            statusLabel={statusLabels[project.status]}
            mediaY={mediaY}
          />
        )}
      </motion.div>
    </div>
  );
}
