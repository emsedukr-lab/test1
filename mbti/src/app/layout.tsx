import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  // 500(medium)은 400으로 폴백 — 한글 서브셋 용량 절감 (LCP 개선)
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ClientProviders>
          <header className="border-b border-border-subtle">
            <nav
              aria-label="주요 메뉴"
              className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3"
            >
              <Link href="/" className="shrink-0 text-lg font-bold text-gold-strong">
                {SITE_NAME}
              </Link>
              <div className="flex items-center gap-3 text-sm text-muted sm:gap-4">
                <Link href="/reading/mbti" className="hover:text-foreground">
                  리딩 시작
                </Link>
                <Link href="/cards" className="hover:text-foreground">
                  카드 해설
                </Link>
                <Link href="/mbti" className="hover:text-foreground">
                  MBTI 가이드
                </Link>
                <Link href="/history" className="hover:text-foreground">
                  기록
                </Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t border-border-subtle py-6">
            <div className="mx-auto max-w-4xl space-y-3 px-4 text-xs text-muted">
              <p>
                이 서비스는 오락과 자기성찰을 위한 것으로, 미래를 예측하거나 의료·법률·투자 등
                전문적인 조언을 대신하지 않습니다.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link href="/about" className="hover:text-foreground">
                  소개
                </Link>
                <Link href="/guides" className="hover:text-foreground">
                  가이드
                </Link>
                <Link href="/privacy" className="hover:text-foreground">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="hover:text-foreground">
                  이용약관
                </Link>
                <Link href="/disclaimer" className="hover:text-foreground">
                  면책 안내
                </Link>
                <Link href="/cookie-policy" className="hover:text-foreground">
                  쿠키 정책
                </Link>
              </div>
              <p>© {new Date().getFullYear()} {SITE_NAME}</p>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
