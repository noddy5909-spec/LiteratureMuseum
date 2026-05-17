"use client";

import { motion } from "framer-motion";
import { HallEntranceCard } from "@/components/hall-entrance-card";
import { BackButton } from "@/components/back-button";
import { SpotlightShell } from "@/components/spotlight-shell";
import { MUSEUM_HALLS, type MuseumHall } from "@/lib/halls";
import { formatUserDisplay, type UserProfile } from "@/lib/user-profile";

type HallSelectionProps = {
  profile: UserProfile;
  onSelectHall: (hall: MuseumHall) => void;
  onBack: () => void;
};

export function HallSelection({
  profile,
  onSelectHall,
  onBack,
}: HallSelectionProps) {
  const userDisplay = formatUserDisplay(profile);

  return (
    <SpotlightShell>
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <BackButton onClick={onBack} label="정보 수정" />
            <span className="text-sm font-medium tracking-[0.15em] text-neutral-500">
              남녕 문학관
            </span>
          </div>
          <p className="w-full text-right text-sm text-neutral-500 sm:w-auto sm:max-w-none">
            <span className="font-medium text-stone-900">{userDisplay}</span> 님
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h1 className="title-glow font-serif text-2xl font-light sm:text-3xl">
            어느 관으로 들어가시겠어요?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
            1관부터 12관까지, 들어가실 공간을 선택해 주세요.
          </p>
        </motion.div>

        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {MUSEUM_HALLS.map((hall, index) => (
            <li key={hall.id}>
              <HallEntranceCard
                hall={hall}
                index={index}
                onSelect={onSelectHall}
              />
            </li>
          ))}
        </ul>
      </main>
    </SpotlightShell>
  );
}
