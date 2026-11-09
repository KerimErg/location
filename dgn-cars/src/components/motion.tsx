"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Apparition douce au défilement (une seule fois). */
export function Reveal({ delay = 0, y = 28, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
      {...props}
    />
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item: Variants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

/** Conteneur dont les enfants <StaggerItem> apparaissent l'un après l'autre. */
export function Stagger({ className, children, as = "div" }: { className?: string; children: React.ReactNode; as?: "div" | "ul" }) {
  const Comp = as === "ul" ? motion.ul : motion.div;
  return (
    <Comp className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ className, children, as = "div" }: { className?: string; children: React.ReactNode; as?: "div" | "li" }) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}
