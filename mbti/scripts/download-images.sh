#!/usr/bin/env bash
# 라이더-웨이트(1909, 퍼블릭 도메인) 카드 이미지 78장을 위키미디어 커먼즈에서 내려받는다.
# 사용: bash scripts/download-images.sh
# 저장: public/cards/<card-id>.jpg
set -uo pipefail

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/cards"
mkdir -p "$DEST"
BASE="https://commons.wikimedia.org/wiki/Special:FilePath"
UA="mbti-tarot-setup/1.0 (one-time public domain asset download)"

MAJOR_NAMES=(
  "RWS_Tarot_00_Fool.jpg" "RWS_Tarot_01_Magician.jpg" "RWS_Tarot_02_High_Priestess.jpg"
  "RWS_Tarot_03_Empress.jpg" "RWS_Tarot_04_Emperor.jpg" "RWS_Tarot_05_Hierophant.jpg"
  "RWS_Tarot_06_Lovers.jpg" "RWS_Tarot_07_Chariot.jpg" "RWS_Tarot_08_Strength.jpg"
  "RWS_Tarot_09_Hermit.jpg" "RWS_Tarot_10_Wheel_of_Fortune.jpg" "RWS_Tarot_11_Justice.jpg"
  "RWS_Tarot_12_Hanged_Man.jpg" "RWS_Tarot_13_Death.jpg" "RWS_Tarot_14_Temperance.jpg"
  "RWS_Tarot_15_Devil.jpg" "RWS_Tarot_16_Tower.jpg" "RWS_Tarot_17_Star.jpg"
  "RWS_Tarot_18_Moon.jpg" "RWS_Tarot_19_Sun.jpg" "RWS_Tarot_20_Judgement.jpg"
  "RWS_Tarot_21_World.jpg"
)

fail=0

download() {
  local file="$1" out="$2"
  if [ -s "$out" ]; then
    echo "skip  $out (이미 존재)"
    return 0
  fi
  if curl -fsSL -A "$UA" -o "$out" "$BASE/$file"; then
    local size
    size=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")
    if [ "$size" -lt 5000 ]; then
      echo "FAIL  $out (크기 ${size}B — 손상 의심)"
      rm -f "$out"
      fail=1
    else
      echo "ok    $out (${size}B)"
    fi
  else
    echo "FAIL  $out (다운로드 실패: $file)"
    rm -f "$out"
    fail=1
  fi
  sleep 0.3
}

# 메이저 22장
for i in "${!MAJOR_NAMES[@]}"; do
  id=$(printf "major-%02d" "$i")
  download "${MAJOR_NAMES[$i]}" "$DEST/$id.jpg"
done

# 마이너 56장 — Wands01.jpg / Cups01.jpg / Swords01.jpg / Pents01.jpg 패턴
declare -a SUITS=("wands:Wands" "cups:Cups" "swords:Swords" "pentacles:Pents")
for pair in "${SUITS[@]}"; do
  suit="${pair%%:*}"
  prefix="${pair##*:}"
  for n in $(seq 1 14); do
    num=$(printf "%02d" "$n")
    download "${prefix}${num}.jpg" "$DEST/${suit}-${num}.jpg"
  done
done

count=$(ls "$DEST"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "총 ${count}/78장"
if [ "$fail" -ne 0 ] || [ "$count" -ne 78 ]; then
  echo "일부 실패 — 위 FAIL 항목 확인"
  exit 1
fi
echo "완료"
