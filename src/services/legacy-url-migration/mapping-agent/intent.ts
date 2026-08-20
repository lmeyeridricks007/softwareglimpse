import { normalizeMigrationPath } from "../normalize";
import { classifyLegacyPath } from "../classify";
import type { ContentGraph } from "./content-graph";
import { resolveProductSlug, tokenize } from "./content-graph";
import type { LegacyIntentKind } from "./types";

export type ParsedLegacyIntent = {
  path: string;
  slug: string;
  kind: LegacyIntentKind;
  legacyPageType: string;
  titleGuess: string;
  productSlug?: string;
  productSlugs?: [string, string];
  clusterHint?: string;
  tokens: Set<string>;
};

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function stripReviewSuffix(slug: string): string {
  return slug.replace(/(?:-crm)?-review(?:-\d+)?$/, "").replace(/-\d+$/, "");
}

/**
 * Infer primary historical intent from a legacy URL (path-first, entity-aware).
 */
export function parseLegacyIntent(
  legacyUrlOrPath: string,
  graph: ContentGraph,
): ParsedLegacyIntent {
  const path = normalizeMigrationPath(legacyUrlOrPath);
  const pageType = classifyLegacyPath(path);
  const segs = path.split("/").filter(Boolean);
  const slug = segs[0] ?? "";
  const tokens = tokenize(slug.replace(/-/g, " "));

  const base: ParsedLegacyIntent = {
    path,
    slug,
    kind: "other",
    legacyPageType: pageType,
    titleGuess: humanizeSlug(slug || "Home"),
    tokens,
  };

  if (path === "/") {
    return { ...base, kind: "home", titleGuess: "Home" };
  }

  // Taxonomy / infrastructure
  if (pageType === "wp_tag" || segs[0] === "tag") {
    return { ...base, kind: "tag", titleGuess: `Tag: ${humanizeSlug(segs[1] ?? slug)}` };
  }
  if (pageType === "wp_author" || segs[0] === "author") {
    return { ...base, kind: "author", titleGuess: `Author: ${segs[1] ?? "archive"}` };
  }
  if (pageType === "wp_category" || segs[0] === "category") {
    return {
      ...base,
      kind: "category",
      clusterHint: segs[1],
      titleGuess: `Category: ${humanizeSlug(segs[1] ?? slug)}`,
    };
  }
  if (pageType === "locale") {
    return { ...base, kind: "locale", titleGuess: `Locale: ${path}` };
  }
  if (pageType === "kadence_element" || path.includes("?")) {
    return { ...base, kind: "query", titleGuess: `Query URL: ${path}` };
  }
  if (segs[0] === "feed" || path.includes("/feed/")) {
    return { ...base, kind: "feed", titleGuess: `Feed: ${path}` };
  }
  if (/\/page\/\d+\/?$/.test(path)) {
    return { ...base, kind: "pagination", titleGuess: `Pagination: ${path}` };
  }
  if (segs[0] === "wp-content" || /\.(jpg|jpeg|png|gif|pdf|webp)$/i.test(path)) {
    return { ...base, kind: "attachment", titleGuess: `Attachment: ${path}` };
  }

  // Hubs / legal / company
  if (slug === "contact") {
    return { ...base, kind: "company", titleGuess: "Contact" };
  }
  if (slug === "privacy-policy" || slug === "terms-of-service" || slug === "cookie-policy") {
    return { ...base, kind: "legal", titleGuess: humanizeSlug(slug) };
  }
  if (["software", "guides", "tools", "resources", "pricing", "compare"].includes(slug) && segs.length === 1) {
    return { ...base, kind: "hub", titleGuess: humanizeSlug(slug) };
  }

  // Product pricing moved subcontent: /pipedrive-pricing/ or /pricing-pipedrive/
  const pricingMatch =
    /^(.+)-pricing$/.exec(slug) || /^pricing-(.+)$/.exec(slug);
  if (pricingMatch) {
    const productSlug = resolveProductSlug(graph, pricingMatch[1]!);
    return {
      ...base,
      kind: "product_pricing",
      productSlug,
      titleGuess: `${humanizeSlug(pricingMatch[1]!)} Pricing`,
      tokens: tokenize(`${pricingMatch[1]} pricing`),
    };
  }

  // Alternatives
  if (pageType === "alternatives" || slug.endsWith("-alternatives")) {
    const raw = slug.replace(/(?:-crm)?-alternatives$/, "");
    const productSlug = resolveProductSlug(graph, raw);
    return {
      ...base,
      kind: "product_alternatives",
      productSlug,
      titleGuess: `${humanizeSlug(raw)} Alternatives`,
    };
  }

  // Comparisons (order-insensitive pair extraction)
  if (pageType === "comparison" || slug.includes("-vs-") || slug.includes("-versus-")) {
    let working = slug;
    for (const pref of [
      "the-ultimate-guide-to-",
      "comparing-setup-",
      "a-guide-to-",
      "guide-to-",
    ]) {
      if (working.startsWith(pref)) working = working.slice(pref.length);
    }
    working = working.replace(/-\d+$/, "").replace("-versus-", "-vs-");
    const m = /^(.+?)-vs-(.+)$/.exec(working);
    if (m) {
      const left = resolveProductSlug(graph, m[1]!);
      const right = resolveProductSlug(graph, m[2]!);
      const productSlugs =
        left && right && left !== right
          ? ([left, right] as [string, string])
          : undefined;
      return {
        ...base,
        kind: "comparison",
        productSlugs,
        titleGuess: `${humanizeSlug(m[1]!)} vs ${humanizeSlug(m[2]!)}`,
        tokens: tokenize(`${m[1]} ${m[2]} comparison`),
      };
    }
  }

  // Product reviews
  if (pageType === "product_review" || /(?:-crm)?-review(?:-\d+)?$/.test(slug)) {
    const raw = stripReviewSuffix(slug);
    const productSlug = resolveProductSlug(graph, raw);
    return {
      ...base,
      kind: "product_review",
      productSlug,
      titleGuess: `${humanizeSlug(raw)} Review`,
    };
  }

  // Best lists
  if (pageType === "best_list" || slug.startsWith("best-") || slug.startsWith("top-")) {
    let clusterHint: string | undefined;
    const forMatch = /^best-crm-for-(.+)$/.exec(slug);
    const softwareFor = /^best-crm-software-for-(.+)$/.exec(slug);
    const industryish = /^best-(.+)-crm$/.exec(slug) || /^best-crm-(.+)$/.exec(slug);
    if (forMatch) clusterHint = forMatch[1];
    else if (softwareFor) clusterHint = softwareFor[1];
    else if (industryish && !["crms", "crm", "practices"].includes(industryish[1]!)) {
      clusterHint = industryish[1];
    }
    return {
      ...base,
      kind: "best",
      clusterHint,
      titleGuess: humanizeSlug(slug),
      tokens: tokenize(slug.replace(/-/g, " ")),
    };
  }

  // Guide-like / what-is / benefits
  if (
    pageType === "guide_like" ||
    /^(what-is|how-to|guide-to|a-guide-to|benefits-of|benefits-crm)/.test(slug)
  ) {
    // benefits-of-{product}-crm → still guide intent, product secondary
    const benefitProduct = /^benefits-of-(.+?)(?:-crm)?$/.exec(slug);
    const productSlug = benefitProduct
      ? resolveProductSlug(graph, benefitProduct[1]!)
      : undefined;
    return {
      ...base,
      kind: "guide",
      productSlug,
      titleGuess: humanizeSlug(slug),
      tokens: tokenize(slug.replace(/-/g, " ")),
    };
  }

  // Feature-ish
  if (slug.startsWith("top-crm-features") || slug.includes("crm-features")) {
    return { ...base, kind: "feature", titleGuess: humanizeSlug(slug) };
  }

  return {
    ...base,
    kind: pageType === "other_article" ? "other" : "other",
    titleGuess: humanizeSlug(slug),
  };
}
