"use client";

import { motion } from "framer-motion";
import type { TimelineEra } from "@/lib/timeline-data";

type TimelineNodeProps = {
  era: TimelineEra;
  onSelectEra: (era: TimelineEra) => void;
};

export function TimelineNode({ era, onSelectEra }: TimelineNodeProps) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative flex w-[10.5rem] shrink-0 snap-center flex-col sm:w-44"
    >
      <article className="flex flex-1 flex-col">
        <button
          type="button"
          onClick={() => onSelectEra(era)}
          className="flex h-full min-h-[7.5rem] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
        >
          <p className="font-serif text-base font-medium leading-snug text-stone-900 sm:text-lg">
            {era.label}
          </p>
        </button>
      </article>

      <span
        className="relative z-10 mx-auto mt-5 size-3 shrink-0 rounded-full border-2 border-neutral-300 bg-white shadow-sm"
        aria-hidden
      />
    </motion.li>
  );
}
