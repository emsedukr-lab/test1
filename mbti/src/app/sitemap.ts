import type { MetadataRoute } from "next";
import { ALL_CARDS } from "@/data/cards";
import { GUIDE_LIST } from "@/data/guides";
import { SITE_URL } from "@/lib/site";
import { MBTI_TYPES } from "@/types/mbti";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/cards",
    "/cards/major",
    "/cards/wands",
    "/cards/cups",
    "/cards/swords",
    "/cards/pentacles",
    "/mbti",
    "/guides",
    ...GUIDE_LIST.map((g) => `/guides/${g.slug}`),
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/cookie-policy",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...ALL_CARDS.map((card) => ({
      url: `${SITE_URL}/cards/${card.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...MBTI_TYPES.map((type) => ({
      url: `${SITE_URL}/mbti/${type.toLowerCase()}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
