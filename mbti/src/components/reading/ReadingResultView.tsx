"use client";

import Image from "next/image";
import { AdSlot } from "@/components/ads/AdSlot";
import { getCardById } from "@/data/cards";
import { DEFAULT_DISCLAIMER } from "@/data/templates/safety-messages";
import type { ReadingResult } from "@/types/reading";

const MODE_LABEL = { light: "빛", caution: "주의", action: "행동" } as const;
const MODE_COLOR = {
  light: "text-gold-strong",
  caution: "text-rose",
  action: "text-blue-cat",
} as const;

/**
 * 리딩 결과 본문 — 결과 페이지(/reading/result)와 공유 페이지(/r)가 공유한다.
 * showAds=false면 광고 슬롯을 렌더하지 않는다.
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

  return (
    <div className="space-y-8">
      {result.safety.action === "warn" && result.safety.message && (
        <div
        role="note"
          className="rounded-xl border border-gold/40 bg-surface p-4 text-sm leading-relaxed text-muted"
        >
          {result.safety.message}
        </div>
      )}

      {/* 핵심 요약 */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-lg font-bold text-gold-strong">
          핵심 메시지
        </h2>
        <p className="mt-2 leading-relaxed">{result.opening}</p>
        {result.mbtiLens && (
          <div className="mt-4 rounded-xl border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-purple-cat">
              {result.meta.mbti} 성향으로 본 이번 리딩
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed">{result.mbtiLens}</p>
          </div>
        )}
      </section>

      {showAds && <AdSlot slot="result-after-summary" minHeight={100} />}

      {/* 카드별 해석 */}
      <section aria-labelledby="cards-heading" className="space-y-5">
        <h2 id="cards-heading" className="text-lg font-bold text-gold-strong">
          카드별 해석
        </h2>
        {result.cardSections.map((section) => {
          const card = getCardById(section.cardId);
          return (
            <article
              key={section.cardId}
              className="rounded-xl border border-border-subtle bg-surface p-4"
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
              <div className="mt-3 space-y-2.5 text-sm leading-relaxed">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {/* 카드 조합 */}
      {result.combinationInsights.length > 0 && (
        <section aria-labelledby="combo-heading">
          <h2 id="combo-heading" className="text-lg font-bold text-gold-strong">
            카드 조합이 말하는 것
          </h2>
          <div className="mt-2 space-y-2">
            {result.combinationInsights.map((insight) => (
              <p
                key={insight.kind}
                className="rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-relaxed"
              >
                {insight.body}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 강점 / 주의점 */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-gold-strong">활용할 강점</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
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
          <ul className="mt-2 space-y-1.5 text-sm">
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

      {/* 행동 조언 */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-lg font-bold text-gold-strong">
          이번 주에 해볼 수 있는 것
        </h2>
        <ol className="mt-2 space-y-2">
          {result.actions.map((action, i) => (
            <li
              key={action}
              className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-relaxed"
            >
              <span className="font-bold text-blue-cat">{i + 1}</span>
              {action}
            </li>
          ))}
        </ol>
      </section>

      {/* 자기성찰 질문 */}
      <section aria-labelledby="reflect-heading">
        <h2 id="reflect-heading" className="text-lg font-bold text-purple-cat">
          스스로에게 물어보세요
        </h2>
        <ul className="mt-2 space-y-2">
          {result.reflectionQuestions.map((q) => (
            <li
              key={q}
              className="rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-relaxed"
            >
              {q}
            </li>
          ))}
        </ul>
      </section>

      {/* 마무리 */}
      <section className="rounded-xl border border-gold/30 bg-surface p-5 text-center">
        <p className="leading-relaxed">{result.closing}</p>
      </section>

      <p className="text-xs leading-relaxed text-muted">{DEFAULT_DISCLAIMER}</p>
    </div>
  );
}
