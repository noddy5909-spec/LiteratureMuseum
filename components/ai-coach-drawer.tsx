"use client";

import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChatMarkdown } from "@/components/chat-markdown";
import { loadDocentChatMessages, saveDocentChatMessages } from "@/lib/docent-chat-session";
import { getMessageText } from "@/lib/chat-message-text";

type DocentChatHelpers = UseChatHelpers<UIMessage>;

function MessageBubble({
  message,
  isStreamingPlaceholder,
}: {
  message: UIMessage;
  isStreamingPlaceholder?: boolean;
}) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

  if (!text.trim() && !isStreamingPlaceholder) return null;

  return (
    <motion.div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <motion.div
        className={`max-w-[92%] rounded-2xl px-4 py-3 ${
          isUser
            ? "border border-stone-200 bg-white"
            : "border border-stone-100 bg-stone-50"
        }`}
      >
        {isStreamingPlaceholder && !text.trim() ? (
          <span className="text-sm text-neutral-400">
            답변을 작성하고 있어요…
          </span>
        ) : isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-900">
            {text}
          </p>
        ) : (
          <ChatMarkdown content={text} />
        )}
      </motion.div>
    </motion.div>
  );
}

type AiDocentPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  chat: DocentChatHelpers;
};

function AiDocentPanel({ isOpen, onClose, chat }: AiDocentPanelProps) {
  const { messages, sendMessage, status, error } = chat;
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, status, isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setDraft("");
  }

  const statusLabel = useMemo(() => {
    if (status === "submitted") return "답변을 준비하는 중…";
    if (status === "streaming") return "답변 작성 중…";
    return null;
  }, [status]);

  if (!isOpen) return null;

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
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
        aria-labelledby="ai-docent-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles
              className="size-4 shrink-0 stroke-[1.5] text-amber-700"
              aria-hidden
            />
            <h2
              id="ai-docent-title"
              className="truncate text-sm font-medium tracking-wide text-neutral-900"
            >
              AI 도슨트
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-50 hover:text-stone-800"
            aria-label="패널 닫기"
          >
            <X className="size-5 stroke-[1.5]" />
          </button>
        </header>

        <motion.div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto overscroll-y-contain px-5 py-5"
        >
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const isStreamingAssistant =
              message.role === "assistant" &&
              isLast &&
              (status === "submitted" || status === "streaming");

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isStreamingPlaceholder={isStreamingAssistant}
              />
            );
          })}

          {isBusy && statusLabel ? (
            <motion.div className="flex justify-start">
              <p className="flex items-center gap-2 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-xs text-neutral-600">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                {statusLabel}
              </p>
            </motion.div>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error.message ||
                "응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요."}
            </p>
          ) : null}

          <motion.div ref={bottomRef} className="h-px shrink-0" aria-hidden />
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-stone-100 p-4"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="ai-docent-input" className="sr-only">
              메시지 입력
            </label>
            <input
              id="ai-docent-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="작품이나 주제 의식에 대해 물어보세요"
              disabled={isBusy}
              className="min-w-0 flex-1 rounded-full border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-stone-300 focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isBusy}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-neutral-800 transition enabled:hover:border-stone-300 enabled:hover:bg-stone-50 disabled:opacity-40"
              aria-label="메시지 보내기"
            >
              <Send className="size-4 stroke-[1.5]" />
            </button>
          </div>
        </form>
      </motion.aside>
    </>
  );
}

export function AiCoachDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSeed] = useState(() => loadDocentChatMessages());

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const chat = useChat({
    transport,
    messages: chatSeed,
    id: "namnyeong-docent-chat",
  });

  useEffect(() => {
    saveDocentChatMessages(chat.messages);
  }, [chat.messages]);

  return (
    <>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="open-docent"
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-amber-700 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.14)] sm:bottom-8 sm:right-8 sm:size-14"
            aria-label="AI 도슨트 열기"
          >
            <Sparkles className="size-5 stroke-[1.5]" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <AiDocentPanel
            isOpen={isOpen}
            chat={chat}
            onClose={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
