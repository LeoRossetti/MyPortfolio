"use client";

import { motion, type Variants } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "article" | "li" | "span";
  once?: boolean;
  amount?: number;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
  once = true,
  amount = 0.25,
}: Props) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
