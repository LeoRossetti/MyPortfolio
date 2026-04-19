import type { Transition, Variants } from "motion/react";

export const easeOutQuart: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];
export const easeInOutQuart: [number, number, number, number] = [
  0.77, 0, 0.175, 1,
];

export const springBase: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOutQuart } },
};

export const staggerChildren = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});
