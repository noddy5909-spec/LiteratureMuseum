import { getSupabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/user-profile";
import { normalizeUserProfile } from "@/lib/user-profile";

export async function upsertStudent(profile: UserProfile): Promise<string> {
  const normalized = normalizeUserProfile(profile);
  const supabase = getSupabase();

  const { data: existing, error: selectError } = await supabase
    .from("students")
    .select("id")
    .eq("grade", normalized.grade)
    .eq("class_num", normalized.classNum)
    .eq("student_number", normalized.number)
    .eq("name", normalized.name)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from("students")
    .insert({
      grade: normalized.grade,
      class_num: normalized.classNum,
      student_number: normalized.number,
      name: normalized.name,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
