import type { ThemeEntry } from "@/lib/theme-types";

export const MOCK_THEME_ID_PREFIX = "mock-theme-";

/** 교목(gyomok) 갤러리 전시용 목업 주제 의식 */
export const GYOMOK_MOCK_THEME_TEXT = `[작가의 삶] 17차례의 투옥 속에서도 독립 투사로서의 숭고한 신념을 지켰던 이육사 시인은, [시적 상황과 정서] 「교목」에서 끝없는 시련이 놓인 암울하고 정체된 식민지의 현실을 느끼지만, [대응 방식] 죽음의 위기 앞에서도 사사로운 안락을 거부하며 끝까지 타협하지 않겠다는 강인한 저항 의지를 보였고, 이를 [어조와 표현법] 단호한 의지적 어조와 [핵심 상징] 하늘로 곧게 뻗은 '교목'의 이미지를 통해 형상화했다.`;

export function isMockThemeId(id: string): boolean {
  return id.startsWith(MOCK_THEME_ID_PREFIX);
}

export function getMockThemesForHall(hallId: string): ThemeEntry[] {
  return [
    {
      id: `${MOCK_THEME_ID_PREFIX}gyomok`,
      hallId,
      workId: "gyomok",
      author: "예시",
      text: GYOMOK_MOCK_THEME_TEXT,
      likedBy: [],
      comments: [],
    },
  ];
}

/** DB에서 불러온 주제 의식 앞에 목업 항목을 붙입니다(동일 id가 DB에 있으면 생략). */
export function mergeThemesWithMocks(
  hallId: string,
  fromDb: ThemeEntry[],
): ThemeEntry[] {
  const dbIds = new Set(fromDb.map((entry) => entry.id));
  const mocks = getMockThemesForHall(hallId).filter(
    (mock) => !dbIds.has(mock.id),
  );
  return [...mocks, ...fromDb];
}
