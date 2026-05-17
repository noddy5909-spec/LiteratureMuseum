import type { PostgrestError } from "@supabase/supabase-js";

export function formatSupabaseError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "알 수 없는 오류가 발생했습니다.";
  }

  const pg = error as PostgrestError;
  const parts = [pg.message, pg.details, pg.hint, pg.code ? `(${pg.code})` : ""]
    .filter(Boolean)
    .join(" ");

  if (parts) return parts;

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const pg = error as PostgrestError;
  return pg.code === "PGRST205" || pg.message?.includes("Could not find the table") === true;
}
