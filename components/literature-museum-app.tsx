"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiCoachDrawer } from "@/components/ai-coach-drawer";
import { HallSelection } from "@/components/hall-selection";
import { LandingPage } from "@/components/landing-page";
import { TimelineGallery } from "@/components/timeline-gallery";
import type { MuseumHall } from "@/lib/halls";
import {
  emptyUserProfile,
  normalizeUserProfile,
  type UserProfile,
} from "@/lib/user-profile";

type AppPhase = "landing" | "halls" | "gallery";

export function LiteratureMuseumApp() {
  const [profile, setProfile] = useState<UserProfile>(() => emptyUserProfile());
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [selectedHall, setSelectedHall] = useState<MuseumHall | null>(null);

  useEffect(() => {
    sessionStorage.removeItem("literature-museum-entered");
    sessionStorage.removeItem("literature-museum-username");
    sessionStorage.removeItem("literature-museum-profile");
  }, []);

  function handleEnter() {
    if (
      !profile.grade.trim() ||
      !profile.classNum.trim() ||
      !profile.number.trim() ||
      !profile.name.trim()
    ) {
      return;
    }
    setProfile(normalizeUserProfile(profile));
    setPhase("halls");
  }

  function handleSelectHall(hall: MuseumHall) {
    setSelectedHall(hall);
    setPhase("gallery");
  }

  function handleBackToHalls() {
    setPhase("halls");
    setSelectedHall(null);
  }

  function handleBackToLanding() {
    setPhase("landing");
    setSelectedHall(null);
  }

  return (
    <>
      <AiCoachDrawer />
      <AnimatePresence mode="wait">
        {phase === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
          >
            <LandingPage
              profile={profile}
              onProfileChange={setProfile}
              onEnter={handleEnter}
            />
          </motion.div>
        ) : phase === "halls" ? (
          <motion.div
            key="halls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <HallSelection
              profile={profile}
              onSelectHall={handleSelectHall}
              onBack={handleBackToLanding}
            />
          </motion.div>
        ) : selectedHall ? (
          <motion.div
            key={`gallery-${selectedHall.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <TimelineGallery
              profile={profile}
              hall={selectedHall}
              onBack={handleBackToHalls}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
