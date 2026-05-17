"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiCoachDrawer } from "@/components/ai-coach-drawer";
import { HallSelection } from "@/components/hall-selection";
import { LandingPage } from "@/components/landing-page";
import { TimelineGallery } from "@/components/timeline-gallery";
import { getHallById, type MuseumHall } from "@/lib/halls";
import {
  clearStudentSession,
  loadStudentSession,
  saveAppNavigation,
  saveStudentSession,
} from "@/lib/student-session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatSupabaseError, isMissingTableError } from "@/lib/supabase/errors";
import { upsertStudent } from "@/lib/supabase/students";
import {
  emptyUserProfile,
  normalizeUserProfile,
  type UserProfile,
} from "@/lib/user-profile";

type AppPhase = "landing" | "halls" | "gallery";

function resolvePhaseFromSession(
  session: NonNullable<ReturnType<typeof loadStudentSession>>,
): { phase: AppPhase; hall: MuseumHall | null } {
  if (session.appPhase === "gallery" && session.hallId) {
    const hall = getHallById(session.hallId);
    if (hall) {
      return { phase: "gallery", hall };
    }
  }
  return { phase: "halls", hall: null };
}

export function LiteratureMuseumApp() {
  const [profile, setProfile] = useState<UserProfile>(() => emptyUserProfile());
  const [studentId, setStudentId] = useState<string | null>(null);
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [selectedHall, setSelectedHall] = useState<MuseumHall | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    const session = loadStudentSession();
    if (session) {
      setProfile(session.profile);
      setStudentId(session.studentId);
      const restored = resolvePhaseFromSession(session);
      setPhase(restored.phase);
      setSelectedHall(restored.hall);
    }
    setIsBootstrapped(true);
  }, []);

  async function handleEnter() {
    if (isEntering) return;

    const normalized = normalizeUserProfile(profile);
    if (
      !normalized.grade ||
      !normalized.classNum ||
      !normalized.number ||
      !normalized.name
    ) {
      return;
    }

    setIsEntering(true);
    try {
      if (!isSupabaseConfigured()) {
        alert(
          "Supabase가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.",
        );
        return;
      }

      const id = await upsertStudent(normalized);
      setProfile(normalized);
      setStudentId(id);
      saveStudentSession(id, normalized, "halls", null);
      setSelectedHall(null);
      setPhase("halls");
    } catch (error) {
      console.error("학생 저장 실패:", formatSupabaseError(error), error);
      if (isMissingTableError(error)) {
        alert(
          "데이터베이스 테이블이 없습니다. Supabase SQL Editor에서 supabase/schema.sql을 실행해 주세요.",
        );
      } else {
        alert(
          `학생 정보 저장에 실패했습니다.\n\n${formatSupabaseError(error)}\n\nURL은 https://xxxx.supabase.co 형식이어야 합니다 (/rest/v1 붙이지 마세요).`,
        );
      }
    } finally {
      setIsEntering(false);
    }
  }

  function handleSelectHall(hall: MuseumHall) {
    if (!studentId) {
      alert("학생 정보가 없습니다. 입장 화면에서 다시 등록해 주세요.");
      setPhase("landing");
      return;
    }
    setSelectedHall(hall);
    setPhase("gallery");
    saveAppNavigation("gallery", hall.id);
  }

  function handleBackToHalls() {
    setPhase("halls");
    setSelectedHall(null);
    saveAppNavigation("halls", null);
  }

  function handleBackToLanding() {
    clearStudentSession();
    setStudentId(null);
    setProfile(emptyUserProfile());
    setPhase("landing");
    setSelectedHall(null);
  }

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-400">
        불러오는 중…
      </div>
    );
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
              isEntering={isEntering}
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
        ) : selectedHall && studentId ? (
          <motion.div
            key={`gallery-${selectedHall.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <TimelineGallery
              profile={profile}
              studentId={studentId}
              hall={selectedHall}
              onBack={handleBackToHalls}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
