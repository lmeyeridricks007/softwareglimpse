import type { LegacyPageType } from "./types";
import { normalizeMigrationPath } from "./normalize";

const LOCALES = new Set([
  "de",
  "nl",
  "es",
  "fr",
  "ar",
  "pt",
  "it",
  "zh",
  "ja",
]);

const HUB_OR_LEGAL = new Set([
  "about",
  "contact",
  "privacy-policy",
  "terms-of-service",
  "cookie-policy",
  "disclaimer",
  "affiliate-disclosure",
  "editorial-policy",
  "how-we-review",
  "newsletter",
  "search",
  "sitemap",
  "guides",
  "software",
  "resources",
  "tools",
  "pricing",
  "compare",
  "features",
  "categories",
  "industries",
  "capabilities",
  "requirements",
  "use-cases",
  "for",
  "legal",
  "company",
  "privacy-request",
]);

export function classifyLegacyPath(input: string): LegacyPageType {
  const path = normalizeMigrationPath(input);
  const url = new URL(`https://www.softwareglimpse.com${path}`);
  if (url.searchParams.has("kadence_element")) return "kadence_element";

  const segs = path.split("/").filter(Boolean);
  if (segs.length === 0) return "home";
  if (segs[0] && LOCALES.has(segs[0])) return "locale";
  if (segs[0] === "wp-content") return "media";
  if (segs[0] === "category") return "wp_category";
  if (segs[0] === "tag") return "wp_tag";
  if (segs[0] === "author") return "wp_author";

  const slug = segs[0] ?? "";
  if (
    slug.endsWith("-review") ||
    /-crm-review(?:-\d+)?$/.test(slug) ||
    /-ai-review(?:-\d+)?$/.test(slug)
  ) {
    return "product_review";
  }
  if (slug.includes("-vs-") || slug.includes("-versus-")) return "comparison";
  if (slug.startsWith("best-") || slug.startsWith("top-")) return "best_list";
  if (slug.includes("alternative")) return "alternatives";
  if (HUB_OR_LEGAL.has(slug)) return "hub_or_legal";
  if (
    /^(how-to|guide-to|a-guide-to|what-is|benefits-of|benefits-crm)/.test(slug) ||
    slug.startsWith("benefits-")
  ) {
    return "guide_like";
  }
  return "other_article";
}
