/**
 * 시드 기반 결정적 PRNG — 같은 입력이면 항상 같은 리딩을 생성한다.
 * xmur3(문자열 해시) + mulberry32(PRNG), 외부 의존성 없음.
 */

export interface Rng {
  /** [0, 1) */
  next(): number;
  pick<T>(arr: readonly T[]): T;
  /** 비복원 추출 — 원본을 훼손하지 않고 결정적 */
  pickN<T>(arr: readonly T[], n: number): T[];
  int(maxExclusive: number): number;
}

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedOf(parts: readonly (string | number)[]): number {
  return xmur3(parts.join("|"))();
}

export function createRng(seedParts: readonly (string | number)[]): Rng {
  const random = mulberry32(seedOf(seedParts));
  return {
    next: () => random(),
    int(maxExclusive: number): number {
      return Math.floor(random() * maxExclusive);
    },
    pick<T>(arr: readonly T[]): T {
      if (arr.length === 0) throw new Error("빈 배열에서 pick 호출");
      return arr[Math.floor(random() * arr.length)];
    },
    pickN<T>(arr: readonly T[], n: number): T[] {
      const copy = [...arr];
      const out: T[] = [];
      const count = Math.min(n, copy.length);
      for (let i = 0; i < count; i++) {
        out.push(copy.splice(Math.floor(random() * copy.length), 1)[0]);
      }
      return out;
    },
  };
}
