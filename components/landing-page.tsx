"use client";

import { motion } from "framer-motion";
import { FormEvent } from "react";
import { SpotlightShell } from "@/components/spotlight-shell";
import {
  isUserProfileComplete,
  type UserProfile,
} from "@/lib/user-profile";

type LandingPageProps = {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onEnter: () => void;
  isEntering?: boolean;
};

const inputClassName =
  "w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2.5 text-center font-light text-stone-900 outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-800 focus:ring-0 sm:text-lg";

const labelClassName = "mb-2 block text-xs text-neutral-400";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function LandingPage({
  profile,
  onProfileChange,
  onEnter,
  isEntering = false,
}: LandingPageProps) {
  const canEnter = isUserProfileComplete(profile);

  function updateField<K extends keyof UserProfile>(key: K, value: string) {
    onProfileChange({ ...profile, [key]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canEnter) return;
    onEnter();
  }

  return (
    <SpotlightShell className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 sm:py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-20 w-full max-w-lg text-center"
      >
        <motion.h1
          variants={staggerItem}
          className="title-glow font-serif text-5xl font-light tracking-widest text-stone-900 sm:text-6xl md:text-7xl"
        >
          {"\uB0A8\uB155 \uBB38\uD559\uAD00"}
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mt-6 text-sm tracking-wide text-neutral-400 sm:text-base"
        >
          {
            "\uB0A8\uB155 \uBB38\uD559\uAD00\uC5D0 \uC624\uC2E0 \uAC83\uC744 \uD658\uC601\uD569\uB2C8\uB2E4."
          }
        </motion.p>

        <motion.form
          id="guestbook-form"
          variants={staggerItem}
          onSubmit={handleSubmit}
          className="mx-auto mt-14 w-full max-w-md text-left"
        >
          <div className="grid grid-cols-3 gap-x-8 gap-y-10">
            <div>
              <label htmlFor="grade" className={labelClassName}>
                {"\uD559\uB144"}
              </label>
              <input
                id="grade"
                type="text"
                inputMode="numeric"
                value={profile.grade}
                onChange={(event) => updateField("grade", event.target.value)}
                placeholder="3"
                autoComplete="off"
                autoFocus
                maxLength={2}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="classNum" className={labelClassName}>
                {"\uBC18"}
              </label>
              <input
                id="classNum"
                type="text"
                inputMode="numeric"
                value={profile.classNum}
                onChange={(event) => updateField("classNum", event.target.value)}
                placeholder="2"
                autoComplete="off"
                maxLength={2}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="number" className={labelClassName}>
                {"\uBC88\uD638"}
              </label>
              <input
                id="number"
                type="text"
                inputMode="numeric"
                value={profile.number}
                onChange={(event) => updateField("number", event.target.value)}
                placeholder="15"
                autoComplete="off"
                maxLength={3}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-10">
            <label htmlFor="name" className={labelClassName}>
              {"\uC774\uB984"}
            </label>
            <input
              id="name"
              type="text"
              value={profile.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder={"\uD64D\uAE38\uB3D9"}
              autoComplete="name"
              maxLength={12}
              className={inputClassName}
            />
          </div>

          <motion.div variants={staggerItem} className="mt-12">
            <button
              type="submit"
              disabled={!canEnter || isEntering}
              className="relative z-20 w-full rounded-sm bg-neutral-900 py-4 text-sm font-light tracking-[0.2em] text-white transition-all duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isEntering
                ? "저장 중…"
                : "\uBB38\uD559\uAD00 \uC785\uC7A5\uD558\uAE30"}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </SpotlightShell>
  );
}
