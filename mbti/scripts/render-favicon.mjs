/**
 * favicon.ico 생성 — icon.svg와 동일한 모티프를 64×64 PNG로 렌더 후
 * PNG 임베드 방식의 ICO 컨테이너로 감싼다 (모던 브라우저 호환).
 * 사용: node scripts/render-favicon.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = fs.readFileSync(path.join(root, "src/app/icon.svg"), "utf8");

const html = `<!doctype html><html><body style="margin:0;width:64px;height:64px">${svg.replace(
  "<svg ",
  '<svg width="64" height="64" ',
)}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 64, height: 64 } });
await page.setContent(html);
const png = await page.screenshot({
  clip: { x: 0, y: 0, width: 64, height: 64 },
  omitBackground: true,
});
await browser.close();

// ICO 컨테이너: ICONDIR(6B) + ICONDIRENTRY(16B) + PNG 원본
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count: 1

const entry = Buffer.alloc(16);
entry.writeUInt8(64, 0); // width
entry.writeUInt8(64, 1); // height
entry.writeUInt8(0, 2); // palette
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bpp
entry.writeUInt32LE(png.length, 8); // data size
entry.writeUInt32LE(22, 12); // data offset (6 + 16)

const out = path.join(root, "src/app/favicon.ico");
fs.writeFileSync(out, Buffer.concat([header, entry, png]));
console.log("ok", out, png.length + 22, "bytes");
