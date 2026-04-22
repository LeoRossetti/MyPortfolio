"use client";

import { motion } from "motion/react";
import { ProjectCard } from "@/components/site/ProjectCard";
import { PlaceholderProjectCard } from "@/components/site/PlaceholderProjectCard";
import { projects, projectsCopy } from "@/lib/data/projects";
import { fadeUp, staggerChildren } from "@/lib/motion";

export function Projects() {
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
          {projectsCopy.eyebrow}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="text-fg-primary">Shipped </span>
          <span className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
            &amp; shipping
          </span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-fg-muted max-w-xl text-base leading-relaxed sm:text-lg"
        >
          {projectsCopy.subheading}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        variants={staggerChildren(0.08)}
        className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={fadeUp}
            className={project.colSpan}
          >
            {project.status === "live" ? (
              <ProjectCard project={project} />
            ) : (
              <PlaceholderProjectCard project={project} />
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
