import type { UserProfile } from "@/lib/user-profile";
import { normalizeUserProfile } from "@/lib/user-profile";

const STUDENT_ID_KEY = "literature-museum-student-id";
const PROFILE_KEY = "literature-museum-profile";
const PHASE_KEY = "literature-museum-phase";
const HALL_KEY = "literature-museum-hall-id";

export type PersistedAppPhase = "halls" | "gallery";

export type StudentSession = {
  studentId: string;
  profile: UserProfile;
  appPhase: PersistedAppPhase;
  hallId: string | null;
};

export function saveStudentSession(
  studentId: string,
  profile: UserProfile,
  appPhase: PersistedAppPhase = "halls",
  hallId: string | null = null,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STUDENT_ID_KEY, studentId);
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(normalizeUserProfile(profile)));
  sessionStorage.setItem(PHASE_KEY, appPhase);
  if (hallId) {
    sessionStorage.setItem(HALL_KEY, hallId);
  } else {
    sessionStorage.removeItem(HALL_KEY);
  }
}

export function saveAppNavigation(
  appPhase: PersistedAppPhase,
  hallId: string | null = null,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PHASE_KEY, appPhase);
  if (hallId) {
    sessionStorage.setItem(HALL_KEY, hallId);
  } else {
    sessionStorage.removeItem(HALL_KEY);
  }
}

export function loadStudentSession(): StudentSession | null {
  if (typeof window === "undefined") return null;

  const studentId = sessionStorage.getItem(STUDENT_ID_KEY);
  const rawProfile = sessionStorage.getItem(PROFILE_KEY);
  if (!studentId || !rawProfile) return null;

  try {
    const profile = JSON.parse(rawProfile) as UserProfile;
    if (!profile.grade || !profile.classNum || !profile.number || !profile.name) {
      return null;
    }

    const phaseRaw = sessionStorage.getItem(PHASE_KEY);
    const appPhase: PersistedAppPhase =
      phaseRaw === "gallery" ? "gallery" : "halls";

    return {
      studentId,
      profile: normalizeUserProfile(profile),
      appPhase,
      hallId: sessionStorage.getItem(HALL_KEY),
    };
  } catch {
    return null;
  }
}

export function clearStudentSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STUDENT_ID_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
  sessionStorage.removeItem(PHASE_KEY);
  sessionStorage.removeItem(HALL_KEY);
}
