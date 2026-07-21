"use client";

import Image from "next/image";
import { AdSlot } from "@/components/ads/AdSlot";
import { getCardById } from "@/data/cards";
import { DEFAULT_DISCLAIMER } from "@/data/templates/safety-messages";
import type { ChoiceLean, ReadingResult } from "@/types/reading";

const MODE_LABEL = { light: "빛", caution: "주의", action: "행동" } as const;
const MODE_COLOR = {
  light: "text-gold-strong",
  caution: "text-rose",
  action: "text-blue-cat",
} as const;

function ChoiceLeanBar({ choiceLean }: { choiceLean: ChoiceLean }) {
  // 점수 범위 -3~+3 → 0~6 → 게이지 폭
  const widthA = ((choiceLean.scoreA + 3) / 6) * 100;
  const widthB = ((choiceLean.scoreB + 3) / 6) * 100;
  return (
    <div className="mt-4 rounded-xl bg-background/60 p-4 text-left">
      <div className="space-y-2">
        {(
          [
            ["선택 A", widthA, choiceLean.lean === "A"],
            ["선택 B", widthB, choiceLean.lean === "B"],
          ] as const
        ).map(([label, width, isLean]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-14 text-xs font-bold ${isLean ? "text-gold-strong" : "text-muted"}`}>
              {label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-raised">
              <div
                className={`h-full rounded-full ${isLean ? "bg-gold" : "bg-border-subtle"}`}
                style={{ width: `${Math.max(8, width)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{choiceLean.reason}</p>
    </div>
  );
}

/**
 * 리딩 결과 본문 — 결과 페이지(/reading/result)·공유(/r)·기록이 공유한다.
 * 구조: 히어로(한 줄 대답) → 유형 브리핑 → 카드별(핵심 한 줄+본문+MBTI 시선) → 조합 → 강점·주의 → 행동 → 질문 → 클로징
 */
export function ReadingResultView({
  result,
  showAds = true,
}: {
  result: ReadingResult;
  showAds?: boolean;
}) {
  // 위기 신호 — 안내문만 표시
  if (result.safety.action === "block") {
    return (
      <div className="rounded-xl border border-rose/40 bg-surface p-5">
        <h2 className="text-base font-bold text-rose">잠시 멈추고, 함께 이야기해요</h2>
        <p className="mt-2 text-sm leading-relaxed">{result.safety.message}</p>
      </div>
    );
  }

  const verdict = result.verdict;
  const briefing = result.mbtiBriefing;

  return (
    <div className="space-y-10">
      {result.safety.action === "warn" && result.safety.message && (
        <div
          role="note"
          className="rounded-xl border border-gold/40 bg-surface p-4 text-sm leading-relaxed text-muted"
        >
          {result.safety.message}
        </div>
      )}

      {/* ① 히어로 — 한 줄 대답 */}
      {verdict && (
        <section
          aria-labelledby="summary-heading"
          className="rounded-2xl border border-gold/40 bg-surface p-6 text-center"
        >
          <h2
            id="summary-heading"
            className="text-xs font-bold uppercase tracking-widest text-gold-strong"
          >
            핵심 메시지
          </h2>
          <p className="mt-3 text-xl font-bold leading-relaxed sm:text-2xl">{verdict.text}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {verdict.keywords.map((k, i) => (
              <span
                key={`${k}-${i}`}
                className="rounded-full border border-gold/30 bg-background px-3 py-1 text-xs font-medium text-gold-strong"
              >
                {k}
              </span>
            ))}
          </div>
          {verdict.choiceLean && <ChoiceLeanBar choiceLean={verdict.choiceLean} />}
          {verdict.firstStep && (
            <div className="mt-5 rounded-xl border border-blue-cat/30 bg-background/60 p-4 text-left">
              <p className="text-xs font-bold text-blue-cat">지금 할 일 한 가지</p>
              <p className="mt-1.5 text-sm leading-relaxed">{verdict.firstStep}</p>
            </div>
          )}
          <p className="mt-5 border-t border-border-subtle pt-4 text-sm leading-loose text-muted">
            {result.opening}
          </p>
        </section>
      )}

      {/* ② 유형 브리핑 */}
      {briefing && (
        <section
          aria-label={`${briefing.type} 유형 브리핑`}
          className="rounded-2xl border border-purple-cat/40 bg-surface p-5"
        >
          <h2 className="text-sm font-bold text-purple-cat">
            {briefing.type} 유형 브리핑 · {briefing.title}
          </h2>
          <p className="mt-2.5 text-sm leading-loose">{briefing.approach}</p>
          <div className="mt-3 rounded-xl bg-purple-cat/10 p-3.5">
            <p className="text-xs font-bold text-purple-cat">이번 배열에서 특히 볼 카드</p>
            <p className="mt-1 text-sm font-bold">
              {briefing.focusCard.positionTitle} — {briefing.focusCard.cardNameKo}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{briefing.focusCard.reason}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            <span className="mr-1.5 font-bold text-rose">함정 하나</span>
            {briefing.pitfall}
          </p>
        </section>
      )}

      {showAds && <AdSlot slot="result-after-summary" minHeight={100} />}

      {/* ③ 카드별 해석 */}
      <section aria-labelledby="cards-heading" className="space-y-5">
        <h2 id="cards-heading" className="text-lg font-bold text-gold-strong">
          카드별 해석
        </h2>
        {result.cardSections.map((section) => {
          const card = getCardById(section.cardId);
          return (
            <article
              key={section.cardId}
              className="rounded-2xl border border-border-subtle bg-surface p-5"
            >
              <div className="flex items-start gap-3">
                {card && (
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    width={60}
                    height={100}
                    className={`w-14 shrink-0 rounded border border-gold/30 ${
                      section.reversed ? "rotate-180" : ""
                    }`}
                  />
                )}
                <div>
                  <p className={`text-xs font-medium ${MODE_COLOR[section.mode]}`}>
                    {MODE_LABEL[section.mode]}의 자리
                    {section.reversed && <span className="ml-1.5 text-rose">· 역방향</span>}
                  </p>
                  <h3 className="text-base font-bold">{section.headline}</h3>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold/30 bg-background px-2.5 py-0.5 text-xs text-gold-strong">
                  {section.keyword}
                </span>
                <p className="text-sm font-bold">{section.essence}</p>
              </div>
              <p className="mt-3 text-sm leading-loose text-muted">{section.intro}</p>
              <p className="mt-2 text-sm leading-loose">{section.main}</p>

              {section.mbtiView && (
                <div className="mt-4 rounded-xl border border-purple-cat/30 bg-purple-cat/5 p-3.5">
                  <p className="text-xs font-bold text-purple-cat">{result.meta.mbti}의 시선</p>
                  <p className="mt-1.5 text-sm leading-relaxed">{section.mbtiView}</p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* ④ 카드 조합 */}
      {result.combinationInsights.length > 0 && (
        <section aria-labelledby="combo-heading">
          <h2 id="combo-heading" className="text-lg font-bold text-gold-strong">
            카드 조합이 말하는 것
          </h2>
          <div className="mt-2 space-y-2">
            {result.combinationInsights.map((insight) => (
              <p
                key={insight.kind}
                className="rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-loose"
              >
                {insight.body}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* ⑤ 강점 / 주의점 */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-gold-strong">활용할 강점</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
            {result.strengthsHighlight.map((s) => (
              <li key={s} className="flex gap-2">
                <span aria-hidden="true" className="text-gold">
                  ✦
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-rose">주의할 패턴</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
            {result.cautionsHighlight.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="text-rose">
                  ◦
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {showAds && <AdSlot slot="result-before-actions" minHeight={100} />}

      {/* ⑥ 행동 조언 */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-lg font-bold text-gold-strong">
          이번 주에 해볼 수 있는 것
        </h2>
        {result.actionsIntro && (
          <p className="mt-2 text-sm leading-relaxed text-purple-cat">{result.actionsIntro}</p>
        )}
        <ol className="mt-2 space-y-2">
          {result.actions.map((action, i) => (
            <li
              key={action}
              className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-loose"
            >
              <span className="font-bold text-blue-cat">{i + 1}</span>
              {action}
            </li>
          ))}
        </ol>
      </section>

      {/* ⑦ 자기성찰 질문 */}
      <section aria-labelledby="reflect-heading">
        <h2 id="reflect-heading" className="text-lg font-bold text-purple-cat">
          스스로에게 물어보세요
        </h2>
        <ul className="mt-2 space-y-2">
          {result.reflectionQuestions.map((q) => (
            <li
              key={q}
              className="rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-loose"
            >
              {q}
            </li>
          ))}
        </ul>
      </section>

      {/* ⑧ 마무리 */}
      <section className="rounded-2xl border border-gold/30 bg-surface p-5 text-center">
        <p className="leading-loose">{result.closing}</p>
      </section>

      <p className="text-xs leading-relaxed text-muted">{DEFAULT_DISCLAIMER}</p>
    </div>
  );
}
