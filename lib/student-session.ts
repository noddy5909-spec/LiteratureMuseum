import type { UserProfile } from "@/lib/user-profile";
import { normalizeUserProfile } from "@/lib/user-profile";

const STUDENT_ID_KEY = "literature-museum-student-id";
const PROFILE_KEY = "literature-museum-profile";

export function saveStudentSession(studentId: string, profile: UserProfile): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STUDENT_ID_KEY, studentId);
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(normalizeUserProfile(profile)));
}

export function loadStudentSession(): {
  studentId: string;
  profile: UserProfile;
} | null {
  if (typeof window === "undefined") return null;

  const studentId = sessionStorage.getItem(STUDENT_ID_KEY);
  const rawProfile = sessionStorage.getItem(PROFILE_KEY);
  if (!studentId || !rawProfile) return null;

  try {
    const profile = JSON.parse(rawProfile) as UserProfile;
    if (!profile.grade || !profile.classNum || !profile.number || !profile.name) {
      return null;
    }
    return { studentId, profile: normalizeUserProfile(profile) };
  } catch {
    return null;
  }
}

export function clearStudentSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STUDENT_ID_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
}
