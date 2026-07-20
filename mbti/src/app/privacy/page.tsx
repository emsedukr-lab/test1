import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "회원가입 없음, 질문·리딩 기록은 브라우저에만 저장 — 개인정보 처리 원칙을 안내합니다.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}는 개인정보를 가능한 한 수집하지 않는 방향으로 설계되었습니다. 이
        페이지는 서비스가 어떤 정보를 어디에 저장하고, 무엇을 수집하지 않는지를
        설명합니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">수집하지 않는 정보</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          회원가입 절차가 없으므로 이름, 이메일, 연락처 등 계정 정보를 수집하지 않습니다.
          리딩 중 입력한 질문과 선택한 MBTI, 카드, 해석 결과는 서버로 전송되지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">브라우저에 저장되는 정보</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          입력한 질문과 리딩 기록은 이용자의 브라우저 저장소(localStorage,
          sessionStorage)에만 보관됩니다. 이 데이터는 이용자의 기기를 벗어나지 않으며,
          운영자를 포함한 누구도 서버에서 열람할 수 없습니다. 기록은 서비스 내 기록
          페이지에서 이용자가 직접 삭제하거나 내보낼 수 있고, 브라우저의 사이트 데이터
          삭제 기능으로도 전부 지울 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">광고와 쿠키</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스는 광고(Google AdSense)로 운영됩니다. 광고 스크립트는 이용자가 동의한
          경우에만 로드되며, 이때 광고 제공자가 광고 쿠키를 사용할 수 있습니다. 동의하지
          않아도 서비스의 모든 기능을 그대로 이용할 수 있습니다. 동의 여부는 쿠키 정책
          페이지에서 언제든 변경할 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">분석 도구</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스 개선을 위해 방문 통계 등 분석 도구를 사용하게 될 수 있습니다. 그 경우에도
          이용자가 입력한 질문 원문은 수집하지 않으며, 개인을 식별할 수 있는 형태의
          데이터를 다루지 않는 것을 원칙으로 합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">문의</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          개인정보 처리에 관한 질문이나 요청이 있다면 사이트 운영자에게 문의해 주세요.
          방침이 변경되는 경우 이 페이지를 통해 안내합니다.
        </p>
      </section>
    </div>
  );
}
