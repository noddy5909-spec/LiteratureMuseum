"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMarkdownProps = {
  content: string;
  className?: string;
};

export function ChatMarkdown({ content, className = "" }: ChatMarkdownProps) {
  return (
    <div
      className={`chat-markdown text-sm leading-relaxed text-neutral-900 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 text-neutral-900 last:mb-0 [&:not(:first-child)]:mt-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-900">{children}</strong>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-xs font-medium tracking-wide text-amber-900/90 uppercase first:mt-0">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1.5 pl-4 text-neutral-900 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1.5 pl-4 text-neutral-900 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-neutral-900">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
