"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type MockMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const mockMessages: MockMessage[] = [
  {
    id: "1",
    role: "assistant",
    text: "안녕하세요. AI 리터러시 코치입니다. 작품을 읽으며 떠오른 생각을 함께 정리해 볼까요?",
  },
  {
    id: "2",
    role: "user",
    text: "「님의 침묵」에서 반복되는 표현이 주는 느낌이 궁금해요.",
  },
  {
    id: "3",
    role: "assistant",
    text: "같은 문장이 반복되면서 시간의 흐름이 느리게 느껴지고, 자연의 순환을 강조하는 효과가 있어요. 어떤 구절이 가장 인상 깊었나요?",
  },
  {
    id: "4",
    role: "user",
    text: "「님은 갔습니다」가 계속 맴돌아요.",
  },
];

export function AiCoachDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="open-coach"
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-amber-700 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.14)] sm:bottom-8 sm:right-8 sm:size-14"
            aria-label="AI 리터러시 코치 열기"
          >
            <Sparkles className="size-5 stroke-[1.5]" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-stone-900/10 backdrop-blur-[1px]"
              aria-label="패널 닫기"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed top-0 right-0 z-50 flex h-full w-full max-w-[400px] flex-col border-l border-stone-100 bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-coach-title"
            >
              <header className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-100 px-5 py-4">
                <h2
                  id="ai-coach-title"
                  className="text-sm font-light tracking-wide text-stone-800"
                >
                  AI 리터러시 코치
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-stone-500 transition hover:bg-stone-50 hover:text-stone-800"
                  aria-label="패널 닫기"
                >
                  <X className="size-5 stroke-[1.5]" />
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "border border-stone-200 bg-white text-stone-800"
                          : "bg-stone-50 text-stone-700"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSubmit}
                className="shrink-0 border-t border-stone-100 p-4"
              >
                <div className="flex items-center gap-2">
                  <label htmlFor="ai-coach-input" className="sr-only">
                    메시지 입력
                  </label>
                  <input
                    id="ai-coach-input"
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="메시지를 입력하세요"
                    className="min-w-0 flex-1 rounded-full border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-300 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition enabled:hover:border-stone-300 enabled:hover:bg-stone-50 disabled:opacity-40"
                    aria-label="메시지 보내기"
                  >
                    <Send className="size-4 stroke-[1.5]" />
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
