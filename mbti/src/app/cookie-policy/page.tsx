import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import { ConsentReset } from "@/components/consent/ConsentReset";

export const metadata: Metadata = {
  title: "쿠키 정책",
  description:
    "필수 저장(localStorage·sessionStorage)과 광고 쿠키의 차이, 동의를 변경하는 방법을 안내합니다.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">쿠키 정책</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}가 이용자의 브라우저에 저장하는 것은 크게 두 가지입니다. 서비스가
        동작하기 위한 필수 저장과, 동의한 경우에만 사용되는 광고 쿠키입니다. 둘의 차이를
        설명하고, 동의를 변경하는 방법을 안내합니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">필수 저장</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스 기능을 위해 브라우저 저장소를 사용합니다. localStorage에는 리딩 기록과
          쿠키 동의 상태가, sessionStorage에는 진행 중인 리딩의 임시 데이터가 저장됩니다.
          이 데이터는 이용자의 기기에만 존재하며 서버로 전송되지 않습니다. 광고나 추적
          목적이 아니라 서비스 동작 자체를 위한 것이므로 별도의 동의 없이 사용되며,
          브라우저의 사이트 데이터 삭제 기능으로 언제든 지울 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">광고 쿠키</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스는 무료 운영을 위해 광고(Google AdSense)를 게재합니다. 광고 스크립트는
          이용자가 배너에서 동의를 선택한 경우에만 로드되며, 이때 광고 제공자가 맞춤 광고를
          위한 쿠키를 사용할 수 있습니다. 동의하지 않으면 광고 스크립트가 로드되지 않고,
          서비스의 모든 기능은 동의 여부와 관계없이 동일하게 이용할 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">동의 변경하기</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          한 번 선택한 동의는 고정되지 않습니다. 아래 버튼으로 현재 동의 상태를
          초기화하면 동의 배너가 다시 표시되고, 동의 또는 거부를 새로 선택할 수 있습니다.
        </p>
        <ConsentReset />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">더 알아보기</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          개인정보 전반의 처리 원칙은 개인정보처리방침 페이지에서 확인할 수 있습니다.
          쿠키 정책에 관한 질문은 사이트 운영자에게 문의해 주세요.
        </p>
      </section>
    </div>
  );
}
