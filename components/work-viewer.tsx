"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemePanel } from "@/components/theme-panel";
import type { ThemeEntry } from "@/lib/theme-types";
import { getEraById, type LiteraryWork } from "@/lib/timeline-data";

type WorkViewerProps = {
  work: LiteraryWork | null;
  eraLabel?: string;
  userDisplay: string;
  themes: ThemeEntry[];
  onClose: () => void;
  onAddTheme: (workId: string, text: string) => void;
  onToggleLike: (themeId: string) => void;
  onAddComment: (themeId: string, text: string) => void;
  onUpdateComment: (themeId: string, commentId: string, text: string) => void;
  onDeleteComment: (themeId: string, commentId: string) => void;
  onDeleteTheme: (themeId: string) => void;
  onUpdateTheme: (themeId: string, text: string) => void;
};

const WORK_TEXT_MAX_PX = 20;
const WORK_TEXT_MIN_PX = 11;

function WorkTextScroll({ content }: { content: string }) {
  return (
    <motion.div className="mt-6 lg:hidden" aria-label="작품 본문">
      <p className="whitespace-pre-line text-left font-serif text-[15px] leading-[1.85] text-stone-800 sm:text-base">
        {content}
      </p>
    </motion.div>
  );
}

function WorkFitContent({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(WORK_TEXT_MAX_PX);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    function fitText() {
      const box = containerRef.current;
      const paragraph = textRef.current;
      if (!box || !paragraph) return;

      const maxHeight = box.clientHeight;
      if (maxHeight <= 0) return;

      let size = WORK_TEXT_MAX_PX;
      paragraph.style.fontSize = `${size}px`;

      while (paragraph.scrollHeight > maxHeight && size > WORK_TEXT_MIN_PX) {
        size -= 0.5;
        paragraph.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    }

    fitText();
    const observer = new ResizeObserver(fitText);
    observer.observe(container);
    return () => observer.disconnect();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="mt-6 hidden min-h-0 flex-1 overflow-hidden lg:flex"
      aria-label="작품 본문"
    >
      <p
        ref={textRef}
        style={{ fontSize: `${fontSize}px` }}
        className="whitespace-pre-line text-left font-serif leading-[1.85] text-stone-800"
      >
        {content}
      </p>
    </div>
  );
}

export function WorkViewer({
  work,
  eraLabel,
  userDisplay,
  themes,
  onClose,
  onAddTheme,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onDeleteTheme,
  onUpdateTheme,
}: WorkViewerProps) {
  useEffect(() => {
    if (!work) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [work, onClose]);

  const displayEraLabel =
    eraLabel ?? (work ? getEraById(work.eraId)?.label : undefined);

  return (
    <AnimatePresence>
      {work ? (
        <motion.div
          key={work.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 lg:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/25 backdrop-blur-sm"
            aria-label="작품 닫기"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex min-h-0 w-full flex-1 flex-col sm:h-auto sm:flex-none sm:max-w-7xl sm:w-[95vw] lg:w-[90vw]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-2 z-50 flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-stone-700 shadow-lg ring-4 ring-white/90 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-stone-900 sm:-top-3 sm:-right-3 sm:size-11"
              aria-label="작품 모달 닫기"
            >
              <X className="size-5 stroke-[2]" />
            </button>

            <motion.article
              className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-y-contain bg-white shadow-2xl sm:max-h-[92dvh] sm:flex-none sm:rounded-2xl lg:grid lg:h-[85vh] lg:max-h-none lg:overflow-hidden lg:grid-cols-10"
            >
            <section className="flex shrink-0 flex-col border-b border-neutral-100 px-5 py-5 sm:px-8 sm:py-7 lg:col-span-6 lg:min-h-0 lg:max-h-none lg:flex-1 lg:overflow-hidden lg:border-b-0 lg:border-r lg:px-10 lg:py-10 xl:px-14 xl:py-12">
              <header className="shrink-0">
                {displayEraLabel ? (
                  <p className="text-center text-xs text-neutral-400">
                    {displayEraLabel}
                  </p>
                ) : null}
                <h2
                  id="work-title"
                  className="title-glow mt-3 text-center font-serif text-2xl font-light text-stone-900 sm:text-3xl"
                >
                  {work.title}
                </h2>
                <p className="mt-1.5 text-right text-sm text-neutral-500">
                  {work.poet}
                </p>
              </header>

              <WorkTextScroll key={`${work.id}-scroll`} content={work.content} />
              <WorkFitContent key={`${work.id}-fit`} content={work.content} />
            </section>

            <section className="flex shrink-0 flex-col bg-[#FAFAFA] lg:col-span-4 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
              <ThemePanel
                variant="book"
                workId={work.id}
                userDisplay={userDisplay}
                themes={themes}
                onAddTheme={(text) => onAddTheme(work.id, text)}
                onToggleLike={onToggleLike}
                onAddComment={onAddComment}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                onDeleteTheme={onDeleteTheme}
                onUpdateTheme={onUpdateTheme}
              />
            </section>
            </motion.article>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
