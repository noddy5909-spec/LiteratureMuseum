"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Pencil, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ThemeComment, ThemeEntry } from "@/lib/theme-types";

const THEME_DRAFT_TEMPLATE =
  "[작가의 삶]을 살아가던 시인은, 작품 속에서 [시적 상황과 정서]를 느끼고 or 느끼지만 [대응 방식]을 보이며, 이를 [어조와 표현법] 및 [핵심 상징]을 통해 형상화했다.";

type ThemePanelProps = {
  workId: string;
  userDisplay: string;
  themes: ThemeEntry[];
  onAddTheme: (text: string) => void;
  onToggleLike: (themeId: string) => void;
  onAddComment: (themeId: string, text: string) => void;
  onUpdateComment: (themeId: string, commentId: string, text: string) => void;
  onDeleteComment: (themeId: string, commentId: string) => void;
  onDeleteTheme: (themeId: string) => void;
  onUpdateTheme: (themeId: string, text: string) => void;
  variant?: "default" | "book";
};

const fieldClassName =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-1 focus:ring-stone-200";

function commentKey(themeId: string, commentId: string) {
  return `${themeId}:${commentId}`;
}

type CommentListProps = {
  themeId: string;
  comments: ThemeComment[];
  userDisplay: string;
  editingCommentKey: string | null;
  commentEditDraft: string;
  onStartEdit: (themeId: string, comment: ThemeComment) => void;
  onCancelEdit: () => void;
  onDraftChange: (value: string) => void;
  onSaveEdit: (themeId: string, commentId: string) => void;
  onDelete: (themeId: string, commentId: string) => void;
  emptyMessage?: string;
  itemClassName?: string;
};

function CommentList({
  themeId,
  comments,
  userDisplay,
  editingCommentKey,
  commentEditDraft,
  onStartEdit,
  onCancelEdit,
  onDraftChange,
  onSaveEdit,
  onDelete,
  emptyMessage = "아직 댓글이 없습니다.",
  itemClassName = "rounded-lg border border-neutral-200/80 bg-neutral-50/50 px-4 py-3",
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm font-light text-neutral-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => {
        const isOwn = comment.author === userDisplay;
        const isEditing =
          editingCommentKey === commentKey(themeId, comment.id);

        return (
          <li key={comment.id} className={`relative ${itemClassName}`}>
            {isOwn && !isEditing ? (
              <div className="absolute top-2 right-2 flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onStartEdit(themeId, comment)}
                  className="rounded-full p-1.5 text-neutral-400 transition hover:bg-white hover:text-neutral-700"
                  aria-label="댓글 수정"
                >
                  <Pencil className="size-3 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(themeId, comment.id)}
                  className="rounded-full p-1.5 text-neutral-400 transition hover:bg-white hover:text-red-600"
                  aria-label="댓글 삭제"
                >
                  <Trash2 className="size-3 stroke-[1.5]" />
                </button>
              </div>
            ) : null}
            {isEditing ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onSaveEdit(themeId, comment.id);
                }}
                className={isOwn ? "pr-14" : undefined}
              >
                <p className="text-xs font-medium text-stone-500">
                  {comment.author}
                </p>
                <textarea
                  value={commentEditDraft}
                  onChange={(event) => onDraftChange(event.target.value)}
                  rows={2}
                  className={`${fieldClassName} mt-2 resize-none py-2 text-sm leading-relaxed`}
                  autoFocus
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={!commentEditDraft.trim()}
                    className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition enabled:hover:bg-neutral-800 disabled:opacity-40"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-stone-600 transition hover:bg-neutral-50"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p
                  className={`text-xs font-medium text-stone-500 ${isOwn ? "pr-14" : ""}`}
                >
                  {comment.author}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
                  {comment.text}
                </p>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ThemePanel({
  workId,
  userDisplay,
  themes,
  onAddTheme,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onDeleteTheme,
  onUpdateTheme,
  variant = "default",
}: ThemePanelProps) {
  const isBook = variant === "book";
  const pad = isBook ? "px-5 sm:px-8" : "px-4 sm:px-5";
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [draft, setDraft] = useState(THEME_DRAFT_TEMPLATE);
  const [portalReady, setPortalReady] = useState(false);
  const [commentThemeId, setCommentThemeId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [editingCommentKey, setEditingCommentKey] = useState<string | null>(
    null,
  );
  const [commentEditDraft, setCommentEditDraft] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const workThemes = themes.filter((theme) => theme.workId === workId);
  const selectedTheme =
    workThemes.find((theme) => theme.id === selectedThemeId) ?? null;
  const commentTheme =
    workThemes.find((theme) => theme.id === commentThemeId) ?? null;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setDraft(THEME_DRAFT_TEMPLATE);
    setIsWriteOpen(false);
    setSelectedThemeId(null);
    setEditingThemeId(null);
    setCommentThemeId(null);
    setCommentDraft("");
    setEditingCommentKey(null);
    setCommentEditDraft("");
  }, [workId]);

  useEffect(() => {
    if (!isWriteOpen && !selectedThemeId && !commentThemeId) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      if (isWriteOpen) {
        setIsWriteOpen(false);
        setEditingThemeId(null);
        setDraft(THEME_DRAFT_TEMPLATE);
        return;
      }
      if (commentThemeId) {
        setCommentThemeId(null);
        setCommentDraft("");
        return;
      }
      if (selectedThemeId) {
        setSelectedThemeId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isWriteOpen, selectedThemeId, commentThemeId]);

  useEffect(() => {
    if (!commentThemeId) return;
    const frame = requestAnimationFrame(() => {
      commentInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [commentThemeId]);

  function openWriteModal(themeToEdit?: ThemeEntry) {
    if (themeToEdit) {
      setEditingThemeId(themeToEdit.id);
      setDraft(themeToEdit.text);
      setSelectedThemeId(null);
    } else {
      setEditingThemeId(null);
      setDraft(THEME_DRAFT_TEMPLATE);
    }
    setIsWriteOpen(true);
  }

  function closeWriteModal() {
    setIsWriteOpen(false);
    setEditingThemeId(null);
    setDraft(THEME_DRAFT_TEMPLATE);
  }

  function handleExhibit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (editingThemeId) {
      onUpdateTheme(editingThemeId, trimmed);
    } else {
      onAddTheme(trimmed);
    }
    closeWriteModal();
  }

  function openDetail(themeId: string) {
    setCommentThemeId(null);
    setCommentDraft("");
    setSelectedThemeId(themeId);
  }

  function openCommentModal(themeId: string) {
    setSelectedThemeId(null);
    setCommentThemeId(themeId);
    setCommentDraft("");
  }

  function closeCommentModal() {
    setCommentThemeId(null);
    setCommentDraft("");
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = commentDraft.trim();
    if (!trimmed || !commentThemeId) return;
    onAddComment(commentThemeId, trimmed);
    setCommentDraft("");
  }

  function startEditComment(themeId: string, comment: ThemeComment) {
    setEditingCommentKey(commentKey(themeId, comment.id));
    setCommentEditDraft(comment.text);
  }

  function cancelEditComment() {
    setEditingCommentKey(null);
    setCommentEditDraft("");
  }

  function saveEditComment(themeId: string, commentId: string) {
    const trimmed = commentEditDraft.trim();
    if (!trimmed) return;
    onUpdateComment(themeId, commentId, trimmed);
    cancelEditComment();
  }

  function handleDeleteComment(themeId: string, commentId: string) {
    onDeleteComment(themeId, commentId);
    if (editingCommentKey === commentKey(themeId, commentId)) {
      cancelEditComment();
    }
  }

  const commentListProps = {
    userDisplay,
    editingCommentKey,
    commentEditDraft,
    onStartEdit: startEditComment,
    onCancelEdit: cancelEditComment,
    onDraftChange: setCommentEditDraft,
    onSaveEdit: saveEditComment,
    onDelete: handleDeleteComment,
  };

  function handleDelete(themeId: string) {
    onDeleteTheme(themeId);
    if (selectedThemeId === themeId) setSelectedThemeId(null);
    if (commentThemeId === themeId) closeCommentModal();
  }

  return (
    <>
      <div
        className={`flex flex-col ${isBook ? "lg:h-full lg:min-h-0" : "h-full min-h-0"}`}
      >
        <div
          className={`${pad} ${
            isBook
              ? "pt-10 pb-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
              : "min-h-0 flex-1 overflow-y-auto pt-5 pb-4"
          }`}
        >
          {workThemes.length === 0 ? (
            <p className="py-12 text-center text-sm font-light text-neutral-500">
              아직 갤러리에 전시된 주제 의식이 없습니다.
              <br />
              하단 버튼을 눌러 우리 조의 분석을 남겨 보세요.
            </p>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {workThemes.map((theme) => {
                  const isLiked = theme.likedBy.includes(userDisplay);
                  const isOwn = theme.author === userDisplay;

                  return (
                    <motion.li
                      key={theme.id}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <article className="flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md">
                        <header className="flex items-start justify-between gap-2 px-5 pt-5">
                          <p className="text-xs font-medium tracking-wide text-amber-800/90">
                            {theme.author}
                          </p>
                          {isOwn ? (
                            <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => openWriteModal(theme)}
                                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                                aria-label="주제 의식 수정"
                              >
                                <Pencil className="size-3.5 stroke-[1.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(theme.id)}
                                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-red-600"
                                aria-label="주제 의식 삭제"
                              >
                                <Trash2 className="size-3.5 stroke-[1.5]" />
                              </button>
                            </div>
                          ) : null}
                        </header>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => openDetail(theme.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openDetail(theme.id);
                            }
                          }}
                          className="cursor-pointer px-5 pb-3 text-left transition hover:bg-neutral-50/60"
                        >
                          <p className="text-[15px] leading-relaxed text-stone-800 lg:line-clamp-3">
                            {theme.text}
                          </p>
                        </div>
                        <footer className="relative z-10 flex shrink-0 items-center gap-1 border-t border-neutral-100 bg-white px-3 py-2">
                          <button
                            type="button"
                            onClick={() => onToggleLike(theme.id)}
                            className={`flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs transition ${
                              isLiked
                                ? "text-rose-600"
                                : "text-stone-500 hover:text-stone-700"
                            }`}
                            aria-pressed={isLiked}
                            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                          >
                            <Heart
                              className={`size-4 stroke-[1.5] ${isLiked ? "fill-current" : ""}`}
                            />
                            <span>{theme.likedBy.length}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openCommentModal(theme.id)}
                            className="flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs text-stone-500 transition hover:bg-neutral-50 hover:text-stone-700"
                            aria-label="댓글 달기"
                          >
                            <MessageCircle className="size-4 stroke-[1.5]" />
                            댓글
                            {theme.comments.length > 0
                              ? ` ${theme.comments.length}`
                              : ""}
                          </button>
                        </footer>
                      </article>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <div
          className={`shrink-0 border-t border-neutral-200/80 bg-[#FAFAFA] ${pad} py-4`}
        >
          <button
            type="button"
            onClick={() => openWriteModal()}
            className="w-full rounded-full bg-neutral-900 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition hover:bg-neutral-800 active:scale-[0.99]"
          >
            ✍️ 주제 의식 입력하기
          </button>
        </div>
      </div>

      {portalReady
        ? createPortal(
            <>
              <AnimatePresence>
                {selectedTheme ? (
                  <motion.div
                    key={`theme-detail-${selectedTheme.id}`}
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={() => setSelectedThemeId(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
              aria-label="상세 보기 닫기"
            />

            <motion.article
              role="dialog"
              aria-modal="true"
              aria-labelledby="theme-detail-author"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-y-auto overscroll-y-contain rounded-2xl bg-white shadow-2xl lg:max-h-[min(90vh,820px)] lg:overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-5 py-5 sm:px-8 sm:py-6">
                <p
                  id="theme-detail-author"
                  className="text-sm font-medium tracking-wide text-amber-800/90"
                >
                  {selectedTheme.author}
                </p>
                <div className="flex items-center gap-2">
                  {selectedTheme.author === userDisplay ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openWriteModal(selectedTheme)}
                        className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label="주제 의식 수정"
                      >
                        <Pencil className="size-3.5 stroke-[1.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedTheme.id)}
                        className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-red-600"
                        aria-label="주제 의식 삭제"
                      >
                        <Trash2 className="size-3.5 stroke-[1.5]" />
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setSelectedThemeId(null)}
                    className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                    aria-label="닫기"
                  >
                    <X className="size-5 stroke-[1.25]" />
                  </button>
                </div>
              </header>

              <section
                aria-label="주제 의식"
                className="shrink-0 border-b border-amber-100/80 bg-amber-50/40 px-5 py-5 sm:px-8 sm:py-6"
              >
                <p className="text-[11px] font-medium tracking-wide text-amber-800/80 uppercase">
                  주제 의식
                </p>
                <p className="mt-3 font-serif text-lg leading-[1.9] text-stone-800 sm:text-xl lg:text-2xl">
                  {selectedTheme.text}
                </p>
                <div className="mt-6 flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => onToggleLike(selectedTheme.id)}
                    className={`flex items-center gap-2 text-base transition ${
                      selectedTheme.likedBy.includes(userDisplay)
                        ? "text-rose-600"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                    aria-pressed={selectedTheme.likedBy.includes(userDisplay)}
                  >
                    <Heart
                      className={`size-4 stroke-[1.5] ${
                        selectedTheme.likedBy.includes(userDisplay)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    <span>{selectedTheme.likedBy.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openCommentModal(selectedTheme.id)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1 text-base text-stone-500 transition hover:bg-white/60 hover:text-stone-700"
                  >
                    <MessageCircle className="size-5 stroke-[1.5]" />
                    댓글 {selectedTheme.comments.length}
                  </button>
                </div>
              </section>

              <section
                aria-label="댓글 목록"
                className="flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-hidden"
              >
                <div className="shrink-0 border-b border-neutral-100 px-5 py-4 sm:px-8">
                  <p className="text-[11px] font-medium tracking-wide text-stone-500 uppercase">
                    댓글 {selectedTheme.comments.length}
                  </p>
                </div>
                <div className="px-5 py-4 sm:px-8 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                  <CommentList
                    themeId={selectedTheme.id}
                    comments={selectedTheme.comments}
                    {...commentListProps}
                    emptyMessage="아직 댓글이 없습니다."
                    itemClassName="rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-5 py-4"
                  />
                </div>
              </section>
            </motion.article>
          </motion.div>
        ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {commentTheme ? (
                  <motion.div
                    key={`theme-comment-${commentTheme.id}`}
                    className="fixed inset-0 z-[75] flex items-end justify-center p-4 sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <button
                      type="button"
                      onClick={closeCommentModal}
                      className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
                      aria-label="댓글 닫기"
                    />

                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="theme-comment-title"
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-y-auto overscroll-y-contain rounded-2xl bg-white shadow-2xl lg:max-h-[min(85vh,640px)] lg:overflow-hidden"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4">
                        <div>
                          <h2
                            id="theme-comment-title"
                            className="text-base font-light text-stone-800"
                          >
                            댓글
                          </h2>
                          <p className="mt-0.5 text-xs text-amber-800/90">
                            {commentTheme.author}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={closeCommentModal}
                          className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                          aria-label="닫기"
                        >
                          <X className="size-5 stroke-[1.25]" />
                        </button>
                      </header>

                      <section
                        aria-label="주제 의식"
                        className="shrink-0 border-b border-amber-100/80 bg-amber-50/40 px-5 py-4"
                      >
                        <p className="text-[11px] font-medium tracking-wide text-amber-800/80 uppercase">
                          주제 의식
                        </p>
                        <p className="mt-2 font-serif text-sm leading-relaxed text-stone-800 lg:max-h-[min(28vh,160px)] lg:overflow-y-auto">
                          {commentTheme.text}
                        </p>
                      </section>

                      <section
                        aria-label="댓글 목록"
                        className="flex flex-col bg-white lg:min-h-0 lg:flex-1 lg:overflow-hidden"
                      >
                        <div className="shrink-0 border-b border-neutral-100 px-5 py-3">
                          <p className="text-[11px] font-medium tracking-wide text-stone-500 uppercase">
                            댓글 {commentTheme.comments.length}
                          </p>
                        </div>
                        <div className="px-5 py-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                          <CommentList
                            themeId={commentTheme.id}
                            comments={commentTheme.comments}
                            {...commentListProps}
                            emptyMessage="아직 댓글이 없습니다. 첫 댓글을 남겨 보세요."
                          />
                        </div>
                      </section>

                      <form
                        onSubmit={handleCommentSubmit}
                        className="shrink-0 border-t border-neutral-100 px-5 py-4"
                      >
                        <label htmlFor="theme-comment-draft" className="sr-only">
                          댓글 입력
                        </label>
                        <textarea
                          ref={commentInputRef}
                          id="theme-comment-draft"
                          value={commentDraft}
                          onChange={(event) => setCommentDraft(event.target.value)}
                          rows={3}
                          placeholder="댓글을 입력하세요"
                          className={`${fieldClassName} resize-none py-2.5 text-sm leading-relaxed`}
                        />
                        <button
                          type="submit"
                          disabled={!commentDraft.trim()}
                          className="mt-3 w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition enabled:hover:bg-neutral-800 disabled:opacity-40"
                        >
                          댓글 등록
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {isWriteOpen ? (
                  <motion.div
                    key="theme-write-layer"
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={closeWriteModal}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
              aria-label="글쓰기 닫기"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="theme-write-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-y-contain rounded-xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-center justify-between gap-4 border-b border-neutral-100 px-6 py-5">
                <h2
                  id="theme-write-title"
                  className="text-base font-light tracking-wide text-stone-800"
                >
                  {editingThemeId ? "분석 수정하기" : "우리 조 분석 기록하기"}
                </h2>
                <button
                  type="button"
                  onClick={closeWriteModal}
                  className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="닫기"
                >
                  <X className="size-5 stroke-[1.25]" />
                </button>
              </header>

              <form onSubmit={handleExhibit} className="px-6 py-6">
                <label htmlFor="theme-draft" className="sr-only">
                  주제 의식 작성
                </label>
                {!editingThemeId ? (
                  <div className="mb-4 rounded-lg border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-600">
                    💡 작성 팁: 아래 입력창에 미리 적혀 있는 템플릿의 괄호 [ ]
                    부분을 우리 조가 조사한 내용으로 바꿔서 문장을 완성해 보세요.
                  </div>
                ) : null}
                <textarea
                  id="theme-draft"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={7}
                  className={`${fieldClassName} resize-y py-3 text-sm leading-relaxed`}
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="mt-5 w-full rounded-full bg-neutral-900 py-3.5 text-sm font-medium text-white transition enabled:hover:bg-neutral-800 disabled:opacity-40"
                >
                  {editingThemeId ? "수정 완료" : "갤러리에 전시하기"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
              </AnimatePresence>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
