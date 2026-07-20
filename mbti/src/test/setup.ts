import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom에는 matchMedia가 없음 — reduced-motion 등 미디어 쿼리 기본 false
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
