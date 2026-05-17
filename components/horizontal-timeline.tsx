"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { TimelineNode } from "@/components/timeline-node";
import type { TimelineEra } from "@/lib/timeline-data";

type HorizontalTimelineProps = {
  eras: TimelineEra[];
  onSelectEra: (era: TimelineEra) => void;
};

export function HorizontalTimeline({ eras, onSelectEra }: HorizontalTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    el.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-neutral-50 via-neutral-50/90 to-transparent sm:w-12"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-neutral-50 via-neutral-50/90 to-transparent sm:w-12"
      />

      <div
        ref={scrollRef}
        role="region"
        aria-label="문학 연표"
        tabIndex={0}
        onWheel={handleWheel}
        className="timeline-scroll w-full overflow-x-auto overflow-y-hidden pb-3 pt-1 outline-none"
      >
        <div className="relative inline-block min-w-full py-2">
          <motion.div
            aria-hidden
            className="timeline-line-h pointer-events-none absolute bottom-[11px] left-[calc(1.5rem+5.25rem)] right-[calc(1.5rem+5.25rem)] z-0 h-[2px] sm:left-[calc(2rem+7rem)] sm:right-[calc(2rem+7rem)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
          />

          <ul className="relative z-10 flex w-max gap-5 px-6 sm:gap-8 sm:px-8">
            {eras.map((era) => (
              <TimelineNode
                key={era.id}
                era={era}
                onSelectEra={onSelectEra}
              />
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 px-6 text-center text-xs text-neutral-500">
        가로로 스크롤하여 시대를 탐색하세요
      </p>
    </div>
  );
}
