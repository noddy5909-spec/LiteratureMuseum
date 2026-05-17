export type UserProfile = {
  grade: string;
  classNum: string;
  number: string;
  name: string;
};

export function emptyUserProfile(): UserProfile {
  return { grade: "", classNum: "", number: "", name: "" };
}

export function isUserProfileComplete(profile: UserProfile): boolean {
  return (
    profile.grade.trim().length > 0 &&
    profile.classNum.trim().length > 0 &&
    profile.number.trim().length > 0 &&
    profile.name.trim().length > 0
  );
}

export function formatUserDisplay(profile: UserProfile): string {
  const grade = profile.grade.trim();
  const classNum = profile.classNum.trim();
  const number = profile.number.trim();
  const name = profile.name.trim();
  return `${grade}학년 ${classNum}반 ${number}번 ${name}`;
}

export function normalizeUserProfile(profile: UserProfile): UserProfile {
  return {
    grade: profile.grade.trim(),
    classNum: profile.classNum.trim(),
    number: profile.number.trim(),
    name: profile.name.trim(),
  };
}
