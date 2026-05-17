import type { UIMessage } from "ai";
import { docentInitialMessages } from "@/lib/ai-docent-initial-messages";

const STORAGE_KEY = "namnyeong-docent-chat-messages";

export function loadDocentChatMessages(): UIMessage[] {
  if (typeof window === "undefined") {
    return docentInitialMessages;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return docentInitialMessages;

    const parsed = JSON.parse(raw) as UIMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return docentInitialMessages;
    }

    return parsed;
  } catch {
    return docentInitialMessages;
  }
}

export function saveDocentChatMessages(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // storage quota 등 — 무시하고 메모리 상태만 유지
  }
}
