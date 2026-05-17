"use client";

import { useEffect } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  mapCommentRow,
  mapThemeRow,
  type ThemeCommentRow,
  type ThemeEntryRow,
} from "@/lib/supabase/themes";
import type { ThemeEntry } from "@/lib/theme-types";

/**
 * 현재 홀의 theme_entries / theme_comments 변경을 Realtime으로 반영합니다.
 */
export function useHallThemesRealtime(
  hallId: string,
  setThemes: React.Dispatch<React.SetStateAction<ThemeEntry[]>>,
) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    const channel = supabase
      .channel(`hall-themes:${hallId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "theme_entries",
          filter: `hall_id=eq.${hallId}`,
        },
        (payload) => {
          const row = payload.new as ThemeEntryRow;
          const entry = mapThemeRow(row, []);
          setThemes((prev) => {
            if (prev.some((theme) => theme.id === entry.id)) return prev;
            return [entry, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "theme_entries",
          filter: `hall_id=eq.${hallId}`,
        },
        (payload) => {
          const row = payload.new as ThemeEntryRow;
          setThemes((prev) =>
            prev.map((theme) =>
              theme.id === row.id
                ? {
                    ...theme,
                    author: row.author_display,
                    text: row.body,
                    likedBy: row.liked_by ?? [],
                  }
                : theme,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "theme_entries",
          filter: `hall_id=eq.${hallId}`,
        },
        (payload) => {
          const row = payload.old as ThemeEntryRow;
          setThemes((prev) => prev.filter((theme) => theme.id !== row.id));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "theme_comments",
        },
        (payload) => {
          const row = payload.new as ThemeCommentRow;
          const comment = mapCommentRow(row);
          setThemes((prev) => {
            const themeIndex = prev.findIndex((theme) => theme.id === row.theme_id);
            if (themeIndex === -1) return prev;
            const theme = prev[themeIndex];
            if (theme.comments.some((c) => c.id === comment.id)) return prev;
            const next = [...prev];
            next[themeIndex] = {
              ...theme,
              comments: [...theme.comments, comment],
            };
            return next;
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "theme_comments",
        },
        (payload) => {
          const row = payload.new as ThemeCommentRow;
          const comment = mapCommentRow(row);
          setThemes((prev) =>
            prev.map((theme) =>
              theme.id === row.theme_id
                ? {
                    ...theme,
                    comments: theme.comments.map((c) =>
                      c.id === comment.id ? comment : c,
                    ),
                  }
                : theme,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "theme_comments",
        },
        (payload) => {
          const row = payload.old as ThemeCommentRow;
          setThemes((prev) =>
            prev.map((theme) =>
              theme.id === row.theme_id
                ? {
                    ...theme,
                    comments: theme.comments.filter(
                      (comment) => comment.id !== row.id,
                    ),
                  }
                : theme,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hallId, setThemes]);
}
