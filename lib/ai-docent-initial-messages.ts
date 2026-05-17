import type { UIMessage } from "ai";

const WELCOME_MARKDOWN = `안녕하세요! 남녕 문학관의 **AI 도슨트**입니다. 작품 감상이나 주제 의식 도출에 대해 궁금한 점이 있다면 무엇이든 물어보세요.

### 질문 방식

- 특정 작품의 시대적 배경 질문하기 (예: "000이라는 작품이 쓰인 1930년대의 시대적 배경을 알려줘")
- 어려운 시어의 의미 물어보기 (예: "여기서 '눈물'은 어떤 의미로 쓰였어?")
- 나의 감상과 비교하기 (예: "나는 이 작품이 희망적이라고 생각하는데, 도슨트의 생각은 어때?")

### 주의 사항

- 정답을 바로 요구하기보다는, 스스로 생각할 수 있도록 **힌트**를 달라고 요청해 보세요.
- 문학과 관련 없는 질문에는 답변하지 않습니다.
- 바른 말 고운 말을 사용해 주세요.`;

/** 챗봇 최초 오픈 시 표시되는 안내 메시지 */
export const docentInitialMessages: UIMessage[] = [
  {
    id: "docent-welcome",
    role: "assistant",
    parts: [{ type: "text", text: WELCOME_MARKDOWN }],
  },
];
