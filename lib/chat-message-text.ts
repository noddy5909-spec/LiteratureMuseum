import type { UIMessage } from "ai";

/** UI 메시지에서 화면에 표시할 텍스트를 추출합니다. */
export function getMessageText(message: UIMessage): string {
  const fromParts =
    message.parts
      ?.filter(
        (part): part is Extract<typeof part, { type: "text" | "reasoning" }> =>
          part.type === "text" || part.type === "reasoning",
      )
      .map((part) => part.text ?? "")
      .join("") ?? "";

  if (fromParts.trim()) return fromParts;

  const legacy = (message as UIMessage & { content?: string }).content;
  if (typeof legacy === "string" && legacy.trim()) return legacy;

  return fromParts;
}

export function messageHasVisibleText(message: UIMessage): boolean {
  return getMessageText(message).trim().length > 0;
}
