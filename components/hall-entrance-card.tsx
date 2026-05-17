"use client";

import { motion } from "framer-motion";
import type { MuseumHall } from "@/lib/halls";

type HallEntranceCardProps = {
  hall: MuseumHall;
  index: number;
  onSelect: (hall: MuseumHall) => void;
};

export function HallEntranceCard({
  hall,
  index,
  onSelect,
}: HallEntranceCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.035, ease: "easeOut" }}
      onClick={() => onSelect(hall)}
      className="group flex w-full flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white px-6 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-md sm:px-8 sm:py-9"
      aria-label={`${hall.label} 입장`}
    >
      <span className="font-serif text-2xl font-light tracking-wide text-neutral-800 sm:text-[1.65rem]">
        {hall.label}
      </span>
      <span className="mt-2 text-[10px] font-normal tracking-[0.25em] text-neutral-300 transition-colors duration-300 group-hover:text-neutral-500">
        입장
      </span>
    </motion.button>
  );
}
