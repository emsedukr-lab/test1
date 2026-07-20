/**
 * 브랜드 에셋 렌더링 — Playwright Chromium으로 HTML을 PNG로 캡처한다.
 * 산출물: src/app/apple-icon.png (180×180), public/og-default.png (1200×630)
 * 사용: node scripts/render-brand-assets.mjs
 */
import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** 카드 뒷면 SVG — CardBackSprite와 동일한 모티프 */
function cardBack(width) {
  return `
  <svg viewBox="0 0 120 200" width="${width}" xmlns="http://www.w3.org/2000/svg" style="display:block">
    <rect width="120" height="200" rx="10" fill="#232a4a" stroke="#d4af6a" stroke-width="2"/>
    <rect x="8" y="8" width="104" height="184" rx="6" fill="none" stroke="#323a5e"/>
    <circle cx="60" cy="100" r="28" fill="none" stroke="#d4af6a" stroke-width="1.5"/>
    <circle cx="60" cy="100" r="18" fill="none" stroke="#d4af6a" stroke-opacity="0.6"/>
    <path d="M60 72 L64 92 L84 96 L64 100 L60 120 L56 100 L36 96 L56 92 Z" fill="#d4af6a" fill-opacity="0.85"/>
    <circle cx="60" cy="40" r="3" fill="#d4af6a" fill-opacity="0.5"/>
    <circle cx="60" cy="160" r="3" fill="#d4af6a" fill-opacity="0.5"/>
  </svg>`;
}

const FONT = `'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`;

const appleIconHtml = `<!doctype html><html><body style="margin:0">
<div style="width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#232a4a,#0e1226)">
  <svg viewBox="0 0 64 64" width="150" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="19" fill="none" stroke="#d4af6a" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="12.5" fill="none" stroke="#d4af6a" stroke-opacity="0.5" stroke-width="1.2"/>
    <path d="M32 11 L35 26.8 L52 32 L35 35 L32 53 L29 35 L12 32 L29 26.8 Z" fill="#e5c684"/>
    <circle cx="32" cy="5" r="1.8" fill="#d4af6a" fill-opacity="0.8"/>
    <circle cx="32" cy="59" r="1.8" fill="#d4af6a" fill-opacity="0.8"/>
  </svg>
</div></body></html>`;

const ogHtml = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;position:relative;overflow:hidden;
     background:radial-gradient(ellipse 900px 600px at 50% 115%, #2a3158 0%, #1a2038 45%, #0e1226 100%);
     font-family:${FONT};display:flex;flex-direction:column;align-items:center;justify-content:center">
  <div style="position:absolute;top:36px;left:48px;display:flex;align-items:center;gap:12px">
    <svg viewBox="0 0 64 64" width="34" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="19" fill="none" stroke="#d4af6a" stroke-width="2.4"/>
      <path d="M32 11 L35 26.8 L52 32 L35 35 L32 53 L29 35 L12 32 L29 26.8 Z" fill="#e5c684"/>
    </svg>
    <span style="color:#d4af6a;font-size:26px;font-weight:700;letter-spacing:1px">TaroTI</span>
  </div>

  <div style="display:flex;align-items:flex-end;margin-bottom:34px">
    <div style="transform:rotate(-14deg) translateY(12px);opacity:.62">${cardBack(118)}</div>
    <div style="transform:translateY(-8px);z-index:2;filter:drop-shadow(0 12px 28px rgba(0,0,0,.55))">${cardBack(146)}</div>
    <div style="transform:rotate(14deg) translateY(12px);opacity:.62">${cardBack(118)}</div>
  </div>

  <h1 style="margin:0;color:#f4f1e8;font-size:78px;font-weight:700;letter-spacing:-1px">
    타로<span style="color:#e5c684">티아이</span>
  </h1>
  <p style="margin:18px 0 0;color:#b8bdd4;font-size:31px;font-weight:400">
    내 MBTI에 맞는 타로 한 장
  </p>
  <p style="margin:26px 0 0;color:#8a90ad;font-size:21px;letter-spacing:.5px">
    타로 78장 · 16유형 맞춤 해석 · 무료
  </p>

  <div style="position:absolute;bottom:-40px;left:-40px;width:190px;height:190px;border-radius:50%;border:1.5px solid rgba(212,175,106,.18)"></div>
  <div style="position:absolute;top:-60px;right:-60px;width:260px;height:260px;border-radius:50%;border:1.5px solid rgba(212,175,106,.14)"></div>
  <div style="position:absolute;top:120px;right:150px;color:#d4af6a;opacity:.55;font-size:20px">✦</div>
  <div style="position:absolute;top:210px;left:130px;color:#d4af6a;opacity:.4;font-size:14px">✦</div>
  <div style="position:absolute;bottom:150px;right:230px;color:#d4af6a;opacity:.35;font-size:15px">✦</div>
  <div style="position:absolute;bottom:190px;left:210px;color:#d4af6a;opacity:.5;font-size:19px">✦</div>
</div></body></html>`;

async function shoot(browser, html, { width, height, out }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
  await page.close();
  console.log("ok", out);
}

const browser = await chromium.launch();
await shoot(browser, appleIconHtml, {
  width: 180,
  height: 180,
  out: path.join(root, "src/app/apple-icon.png"),
});
await shoot(browser, ogHtml, {
  width: 1200,
  height: 630,
  out: path.join(root, "public/og-default.png"),
});
await browser.close();
