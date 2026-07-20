import { describe, expect, it } from "vitest";
import { createRng, seedOf } from "../rng";

describe("rng — 결정적 난수", () => {
  it("같은 시드는 같은 시퀀스를 만든다", () => {
    const a = createRng(["three-card", "love", "INFP", "major-00"]);
    const b = createRng(["three-card", "love", "INFP", "major-00"]);
    for (let i = 0; i < 20; i++) expect(a.next()).toBe(b.next());
  });

  it("시드 파트 하나만 달라도 다른 시퀀스가 나온다", () => {
    const a = createRng(["three-card", "love", "INFP", "major-00"]);
    const b = createRng(["three-card", "love", "INFJ", "major-00"]);
    const seqA = Array.from({ length: 5 }, () => a.next());
    const seqB = Array.from({ length: 5 }, () => b.next());
    expect(seqA).not.toEqual(seqB);
  });

  it("pickN은 비복원 추출이며 원본을 훼손하지 않는다", () => {
    const rng = createRng(["seed"]);
    const arr = [1, 2, 3, 4, 5];
    const picked = rng.pickN(arr, 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });

  it("seedOf는 순서에 민감하다", () => {
    expect(seedOf(["a", "b"])).not.toBe(seedOf(["b", "a"]));
  });
});
