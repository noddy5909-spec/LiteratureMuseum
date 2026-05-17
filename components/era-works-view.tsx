"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackButton } from "@/components/back-button";
import type { LiteraryWork, TimelineEra } from "@/lib/timeline-data";

type EraWorksViewProps = {
  era: TimelineEra;
  works: LiteraryWork[];
  onSelectWork: (work: LiteraryWork) => void;
  onBack: () => void;
};

export function EraWorksView({
  era,
  works,
  onSelectWork,
  onBack,
}: EraWorksViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mb-8 flex items-center gap-4">
        <BackButton onClick={onBack} label="연표" />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            시대
          </p>
          <h2 className="title-glow mt-1 font-serif text-2xl sm:text-3xl">{era.label}</h2>
        </div>
      </div>

      {works.length === 0 ? (
        <p className="py-16 text-center text-sm font-light text-neutral-500">
          이 시대에 등록된 작품이 아직 없습니다.
        </p>
      ) : (
      <ul className="grid gap-4 sm:grid-cols-2">
        {works.map((work, index) => (
          <motion.li
            key={work.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={() => onSelectWork(work)}
              className="group w-full rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
            >
              <h3 className="font-serif text-xl font-medium text-stone-900">
                {work.title}
              </h3>
              <p className="mt-2 text-base text-neutral-500">{work.poet}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-light text-neutral-500 transition group-hover:text-neutral-700">
                작품 읽기
                <ArrowRight
                  className="size-3.5 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
      )}
    </motion.div>
  );
}
