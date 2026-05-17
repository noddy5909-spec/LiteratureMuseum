"use client";

import { useEffect, useRef } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  mapCommentRow,
  mapThemeRow,
  type ThemeCommentRow,
  type ThemeEntryRow,
} from "@/lib/supabase/themes";
import type { ThemeEntry } from "@/lib/theme-types";

function applyThemeEntryEvent(
  hallId: string,
  payload: RealtimePostgresChangesPayload<ThemeEntryRow>,
  setThemes: React.Dispatch<React.SetStateAction<ThemeEntry[]>>,
) {
  const event = payload.eventType;

  if (event === "INSERT") {
    const row = payload.new;
    if (!row || row.hall_id !== hallId) return;
    const entry = mapThemeRow(row, []);
    setThemes((prev) => {
      if (prev.some((theme) => theme.id === entry.id)) return prev;
      return [entry, ...prev];
    });
    return;
  }

  if (event === "UPDATE") {
    const row = payload.new;
    if (!row || row.hall_id !== hallId) return;
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
    return;
  }

  if (event === "DELETE") {
    const row = payload.old;
    if (!row?.id) return;
    setThemes((prev) => {
      const target = prev.find((theme) => theme.id === row.id);
      if (!target) return prev;
      if (row.hall_id && row.hall_id !== hallId) return prev;
      return prev.filter((theme) => theme.id !== row.id);
    });
  }
}

function applyThemeCommentEvent(
  payload: RealtimePostgresChangesPayload<ThemeCommentRow>,
  setThemes: React.Dispatch<React.SetStateAction<ThemeEntry[]>>,
) {
  const event = payload.eventType;

  if (event === "INSERT") {
    const row = payload.new;
    if (!row) return;
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
    return;
  }

  if (event === "UPDATE") {
    const row = payload.new;
    if (!row) return;
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
    return;
  }

  if (event === "DELETE") {
    const row = payload.old;
    const commentId = row?.id;
    if (!commentId) return;

    // RLS + Realtime DELETE 시 old에 theme_id가 없고 id만 오는 경우가 많음
    setThemes((prev) =>
      prev.map((theme) => {
        if (row?.theme_id && theme.id !== row.theme_id) return theme;
        if (!theme.comments.some((comment) => comment.id === commentId)) {
          return theme;
        }
        return {
          ...theme,
          comments: theme.comments.filter(
            (comment) => comment.id !== commentId,
          ),
        };
      }),
    );
  }
}

/**
 * 현재 홀의 theme_entries / theme_comments 변경을 Realtime으로 반영합니다.
 * (서버 필터 없이 수신 후 hall_id로 클라이언트 필터 — hall-1 등 값 파싱 오류 방지)
 */
export function useHallThemesRealtime(
  hallId: string,
  setThemes: React.Dispatch<React.SetStateAction<ThemeEntry[]>>,
) {
  const hallIdRef = useRef(hallId);
  hallIdRef.current = hallId;

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    const channel = supabase
      .channel(`hall-themes:${hallId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "theme_entries",
        },
        (payload) => {
          applyThemeEntryEvent(
            hallIdRef.current,
            payload as RealtimePostgresChangesPayload<ThemeEntryRow>,
            setThemes,
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "theme_comments",
        },
        (payload) => {
          applyThemeCommentEvent(
            payload as RealtimePostgresChangesPayload<ThemeCommentRow>,
            setThemes,
          );
        },
      )
      .subscribe((status, err) => {
        if (process.env.NODE_ENV === "development") {
          if (status === "SUBSCRIBED") {
            console.info("[realtime] 구독됨:", `hall-themes:${hallId}`);
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.error("[realtime] 구독 실패:", status, err);
          }
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [hallId, setThemes]);
}
