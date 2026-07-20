"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";
import { StepGuard } from "@/components/wizard/StepGuard";
import { ALL_TOPICS, getTopic } from "@/data/topics";
import { QUESTION_MAX_LENGTH } from "@/types/reading";
import { useReadingStore } from "@/stores/readingStore";
import { track } from "@/lib/analytics";

export function TopicStep() {
  const router = useRouter();
  const topicId = useReadingStore((s) => s.topicId);
  const question = useReadingStore((s) => s.question);
  const setTopic = useReadingStore((s) => s.setTopic);
  const setQuestion = useReadingStore((s) => s.setQuestion);
  const textareaId = useId();

  const topic = topicId ? getTopic(topicId) : null;

  return (
    <StepGuard step="topic">
      <h1 className="text-xl font-bold">어떤 이야기를 나눠볼까요?</h1>
      <p className="mt-1 text-sm text-muted">고민 분야를 선택하면 추천 질문을 보여드립니다.</p>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ALL_TOPICS.map((t) => {
          const selected = topicId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-3 text-left transition-colors ${
                selected
                  ? "border-gold bg-surface-raised"
                  : "border-border-subtle bg-surface hover:border-gold/50"
              }`}
            >
              <span className="block text-sm font-bold">{t.nameKo}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{t.description}</span>
            </button>
          );
        })}
      </div>

      {topic && (
        <section className="mt-6 rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-medium text-gold">이런 질문은 어떠세요?</h2>
          <ul className="mt-2 space-y-1.5">
            {topic.recommendedQuestions.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="w-full rounded-lg bg-surface-raised px-3 py-2 text-left text-sm hover:text-gold-strong"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <label htmlFor={textareaId} className="text-sm font-medium">
              내 질문 직접 쓰기 <span className="text-muted">(선택)</span>
            </label>
            <textarea
              id={textareaId}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={QUESTION_MAX_LENGTH}
              rows={3}
              placeholder="예: 지금 준비하는 일을 계속 밀고 가도 될까요?"
              className="mt-1.5 w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm placeholder:text-muted/60"
            />
            <p className="mt-1 text-right text-xs text-muted" aria-live="polite">
              {question.length}/{QUESTION_MAX_LENGTH}자 · 질문은 이 브라우저에만 저장됩니다
            </p>
          </div>
        </section>
      )}

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/reading/mbti")}
          className="rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!topicId}
          onClick={() => {
            if (topicId) track("topic_selected", { topic: topicId });
            router.push("/reading/spread");
          }}
          className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-background disabled:opacity-40"
        >
          다음 — 리딩 방식 선택
        </button>
      </div>
    </StepGuard>
  );
}
