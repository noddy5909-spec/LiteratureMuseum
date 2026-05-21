import { literaryWorks } from "@/lib/timeline-data";

/** AI 도슨트가 인용·해석할 때 사용하는 전시 작품 원문 */
export function formatDocentWorksCorpus(): string {
  return literaryWorks
    .map(
      (work) =>
        `### ${work.title} — ${work.poet} (id: ${work.id})\n${work.content}`,
    )
    .join("\n\n");
}
