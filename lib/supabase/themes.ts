import { getSupabase } from "@/lib/supabase/client";
import type { ThemeComment, ThemeEntry } from "@/lib/theme-types";

export type ThemeCommentRow = {
  id: string;
  theme_id: string;
  student_id: string | null;
  author_display: string;
  body: string;
  created_at: string;
};

export type ThemeEntryRow = {
  id: string;
  student_id: string;
  hall_id: string;
  work_id: string;
  author_display: string;
  body: string;
  liked_by: string[];
  created_at: string;
};

export function mapCommentRow(row: ThemeCommentRow): ThemeComment {
  return {
    id: row.id,
    author: row.author_display,
    text: row.body,
  };
}

export function mapThemeRow(
  entry: ThemeEntryRow,
  comments: ThemeCommentRow[] = [],
): ThemeEntry {
  return {
    id: entry.id,
    hallId: entry.hall_id,
    workId: entry.work_id,
    author: entry.author_display,
    text: entry.body,
    likedBy: entry.liked_by ?? [],
    comments: comments
      .filter((c) => c.theme_id === entry.id)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map(mapCommentRow),
  };
}

export async function fetchThemesByHall(hallId: string): Promise<ThemeEntry[]> {
  const supabase = getSupabase();

  const { data: entries, error: entriesError } = await supabase
    .from("theme_entries")
    .select("*")
    .eq("hall_id", hallId)
    .order("created_at", { ascending: false });

  if (entriesError) throw entriesError;
  if (!entries?.length) return [];

  const themeIds = entries.map((e) => e.id);
  const { data: comments, error: commentsError } = await supabase
    .from("theme_comments")
    .select("*")
    .in("theme_id", themeIds);

  if (commentsError) throw commentsError;

  return entries.map((entry) =>
    mapThemeRow(entry as ThemeEntryRow, (comments ?? []) as ThemeCommentRow[]),
  );
}

export async function insertTheme(params: {
  studentId: string;
  hallId: string;
  workId: string;
  authorDisplay: string;
  text: string;
}): Promise<ThemeEntry> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("theme_entries")
    .insert({
      student_id: params.studentId,
      hall_id: params.hallId,
      work_id: params.workId,
      author_display: params.authorDisplay,
      body: params.text,
      liked_by: [],
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapThemeRow(data as ThemeEntryRow, []);
}

export async function updateThemeText(
  themeId: string,
  text: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("theme_entries")
    .update({ body: text })
    .eq("id", themeId);

  if (error) throw error;
}

export async function deleteTheme(themeId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("theme_entries")
    .delete()
    .eq("id", themeId);

  if (error) throw error;
}

export async function updateThemeLikes(
  themeId: string,
  likedBy: string[],
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("theme_entries")
    .update({ liked_by: likedBy })
    .eq("id", themeId);

  if (error) throw error;
}

export async function insertComment(params: {
  themeId: string;
  studentId: string;
  authorDisplay: string;
  text: string;
}): Promise<ThemeComment> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("theme_comments")
    .insert({
      theme_id: params.themeId,
      student_id: params.studentId,
      author_display: params.authorDisplay,
      body: params.text,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapCommentRow(data as ThemeCommentRow);
}

export async function updateCommentText(
  commentId: string,
  text: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("theme_comments")
    .update({ body: text })
    .eq("id", commentId);

  if (error) throw error;
}

export async function deleteComment(commentId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("theme_comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
}
