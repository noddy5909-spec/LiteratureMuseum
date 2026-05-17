"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
import { EraWorksView } from "@/components/era-works-view";
import { HorizontalTimeline } from "@/components/horizontal-timeline";
import { SpotlightShell } from "@/components/spotlight-shell";
import { WorkViewer } from "@/components/work-viewer";
import {
  getWorksByEraId,
  timelineEras,
  type LiteraryWork,
  type TimelineEra,
} from "@/lib/timeline-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  deleteComment,
  deleteTheme,
  fetchThemesByHall,
  insertComment,
  insertTheme,
  updateCommentText,
  updateThemeLikes,
  updateThemeText,
} from "@/lib/supabase/themes";
import type { ThemeEntry } from "@/lib/theme-types";
import type { MuseumHall } from "@/lib/halls";
import { formatUserDisplay, type UserProfile } from "@/lib/user-profile";

type TimelineGalleryProps = {
  profile: UserProfile;
  studentId: string;
  hall: MuseumHall;
  onBack: () => void;
};

export function TimelineGallery({
  profile,
  studentId,
  hall,
  onBack,
}: TimelineGalleryProps) {
  const userDisplay = formatUserDisplay(profile);
  const [selectedEra, setSelectedEra] = useState<TimelineEra | null>(null);
  const [selectedWork, setSelectedWork] = useState<LiteraryWork | null>(null);
  const [themes, setThemes] = useState<ThemeEntry[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  const eraWorks = selectedEra ? getWorksByEraId(selectedEra.id) : [];
  const hallThemes = themes.filter((theme) => theme.hallId === hall.id);

  const loadThemes = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setThemes([]);
      setIsLoadingThemes(false);
      return;
    }

    setIsLoadingThemes(true);
    try {
      const data = await fetchThemesByHall(hall.id);
      setThemes(data);
    } catch (error) {
      console.error(error);
      alert("주제 의식을 불러오지 못했습니다.");
    } finally {
      setIsLoadingThemes(false);
    }
  }, [hall.id]);

  useEffect(() => {
    void loadThemes();
  }, [loadThemes]);

  function handleHeaderBack() {
    if (selectedEra) {
      setSelectedEra(null);
      return;
    }
    onBack();
  }

  async function handleAddTheme(workId: string, text: string) {
    try {
      const entry = await insertTheme({
        studentId,
        hallId: hall.id,
        workId,
        authorDisplay: userDisplay,
        text,
      });
      setThemes((prev) => [entry, ...prev]);
    } catch (error) {
      console.error(error);
      alert("주제 의식 저장에 실패했습니다.");
    }
  }

  async function handleToggleLike(themeId: string) {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    const liked = theme.likedBy.includes(userDisplay);
    const likedBy = liked
      ? theme.likedBy.filter((name) => name !== userDisplay)
      : [...theme.likedBy, userDisplay];

    try {
      await updateThemeLikes(themeId, likedBy);
      setThemes((prev) =>
        prev.map((t) => (t.id === themeId ? { ...t, likedBy } : t)),
      );
    } catch (error) {
      console.error(error);
      alert("좋아요 저장에 실패했습니다.");
    }
  }

  async function handleAddComment(themeId: string, text: string) {
    try {
      const comment = await insertComment({
        themeId,
        studentId,
        authorDisplay: userDisplay,
        text,
      });
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === themeId
            ? { ...theme, comments: [...theme.comments, comment] }
            : theme,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("댓글 저장에 실패했습니다.");
    }
  }

  async function handleUpdateComment(
    themeId: string,
    commentId: string,
    text: string,
  ) {
    try {
      await updateCommentText(commentId, text);
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === themeId
            ? {
                ...theme,
                comments: theme.comments.map((comment) =>
                  comment.id === commentId ? { ...comment, text } : comment,
                ),
              }
            : theme,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("댓글 수정에 실패했습니다.");
    }
  }

  async function handleDeleteComment(themeId: string, commentId: string) {
    try {
      await deleteComment(commentId);
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === themeId
            ? {
                ...theme,
                comments: theme.comments.filter(
                  (comment) => comment.id !== commentId,
                ),
              }
            : theme,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("댓글 삭제에 실패했습니다.");
    }
  }

  async function handleDeleteTheme(themeId: string) {
    try {
      await deleteTheme(themeId);
      setThemes((prev) => prev.filter((theme) => theme.id !== themeId));
    } catch (error) {
      console.error(error);
      alert("주제 의식 삭제에 실패했습니다.");
    }
  }

  async function handleUpdateTheme(themeId: string, text: string) {
    try {
      await updateThemeText(themeId, text);
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === themeId ? { ...theme, text } : theme,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("주제 의식 수정에 실패했습니다.");
    }
  }

  return (
    <SpotlightShell>
      <WorkViewer
        work={selectedWork}
        eraLabel={selectedEra?.label}
        userDisplay={userDisplay}
        themes={hallThemes}
        onClose={() => setSelectedWork(null)}
        onAddTheme={handleAddTheme}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onDeleteTheme={handleDeleteTheme}
        onUpdateTheme={handleUpdateTheme}
      />
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <BackButton
              onClick={handleHeaderBack}
              label={selectedEra ? "연표" : "관 선택"}
            />
            <span className="text-sm font-medium tracking-[0.15em] text-neutral-500">
              {hall.label}
            </span>
          </div>
          <p className="w-full text-right text-sm text-neutral-500 sm:w-auto sm:max-w-none">
            <span className="font-medium text-stone-900">{userDisplay}</span>{" "}
            님, 환영합니다
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        {isLoadingThemes ? (
          <p className="px-6 text-center text-sm text-neutral-400">
            주제 의식을 불러오는 중…
          </p>
        ) : null}
        <AnimatePresence mode="wait">
          {selectedEra ? (
            <div className="px-6">
              <EraWorksView
                key={selectedEra.id}
                era={selectedEra}
                works={eraWorks}
                onSelectWork={setSelectedWork}
                onBack={() => setSelectedEra(null)}
              />
            </div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="mb-14 px-6 text-center">
                <p className="text-xs font-medium tracking-[0.2em] text-amber-800/80 uppercase">
                  {hall.label}
                </p>
                <h2 className="title-glow mt-2 font-serif text-2xl sm:text-3xl">
                  어둠을 건너는 시선들
                </h2>
                <p className="mt-3 text-base leading-relaxed text-neutral-500">
                  시대를 선택하고 작품을 만나 보세요.
                </p>
              </div>

              <HorizontalTimeline
                eras={timelineEras}
                onSelectEra={setSelectedEra}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </SpotlightShell>
  );
}
