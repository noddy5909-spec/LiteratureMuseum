"use client";

import { ChevronLeft } from "lucide-react";

type BackButtonProps = {
  onClick: () => void;
  label?: string;
};

export function BackButton({ onClick, label = "뒤로" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glow-hover glass-panel group flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
      aria-label={label}
    >
      <ChevronLeft className="size-4 stroke-[1.5] transition group-hover:-translate-x-0.5" />
      {label}
    </button>
  );
}
