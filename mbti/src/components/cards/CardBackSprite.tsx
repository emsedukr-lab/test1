/**
 * 카드 뒷면 공통 SVG — 페이지당 1회 정의하고 <use href="#card-back" />로 참조.
 * 78개 카드가 이미지를 각각 로드하지 않게 한다.
 */
export function CardBackSprite() {
  return (
    <svg aria-hidden="true" style={{ display: "none" }}>
      <symbol id="card-back" viewBox="0 0 120 200">
        <rect width="120" height="200" rx="10" fill="#232a4a" stroke="#d4af6a" strokeWidth="2" />
        <rect x="8" y="8" width="104" height="184" rx="6" fill="none" stroke="#323a5e" />
        <circle cx="60" cy="100" r="28" fill="none" stroke="#d4af6a" strokeWidth="1.5" />
        <circle cx="60" cy="100" r="18" fill="none" stroke="#d4af6a" strokeOpacity="0.6" />
        <path
          d="M60 72 L64 92 L84 96 L64 100 L60 120 L56 100 L36 96 L56 92 Z"
          fill="#d4af6a"
          fillOpacity="0.85"
        />
        <circle cx="60" cy="40" r="3" fill="#d4af6a" fillOpacity="0.5" />
        <circle cx="60" cy="160" r="3" fill="#d4af6a" fillOpacity="0.5" />
      </symbol>
    </svg>
  );
}

export function CardBackFace({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 200" className={className}>
      <use href="#card-back" />
    </svg>
  );
}
