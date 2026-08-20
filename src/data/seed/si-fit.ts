import type { CrmProductFit, FitLevel, Software } from "@/domain";

/**
 * Structured Sales Intelligence fit assessments derived from catalogue taxonomy.
 * Does not invent feature or pricing facts.
 *
 * Prefer `deriveSiProductFit(software)` so every SI product participates
 * in Finder scoring.
 */

const BUSINESS_SIZES = [
  "solo",
  "micro",
  "small-business",
  "mid-market",
  "enterprise",
] as const;

/** Data / contact tools → lean ease-of-use and fast-setup. */
const DATA_TOOL_PRIORITIES = {
  "ease-of-use": "strong",
  "fast-setup": "strong",
  customization: "moderate",
  "minimal-admin": "good",
} as const satisfies Record<string, FitLevel>;

/** Engagement / outreach tools → balanced priorities. */
const ENGAGEMENT_PRIORITIES = {
  "ease-of-use": "good",
  "fast-setup": "moderate",
  customization: "good",
  "minimal-admin": "moderate",
} as const satisfies Record<string, FitLevel>;

const DATA_SUBCATEGORIES = new Set([
  "contact-data",
  "prospecting",
  "lead-generation",
  "data-enrichment",
  "list-building",
]);

const ENGAGEMENT_SUBCATEGORIES = new Set([
  "sales-engagement",
  "email-outreach",
]);

function sizeFits(
  listed: string[],
  strongSlugs: string[] = [],
): Record<string, FitLevel> {
  const listedSet = new Set(listed);
  const strongSet = new Set(strongSlugs);
  const out: Record<string, FitLevel> = {};
  for (const size of BUSINESS_SIZES) {
    if (!listedSet.has(size)) {
      out[size] = "unknown";
    } else if (strongSet.has(size)) {
      out[size] = "strong";
    } else {
      out[size] = "good";
    }
  }
  return out;
}

function buildUseCaseFitMap(slugs: string[]): Record<string, FitLevel> {
  const out: Record<string, FitLevel> = {};
  slugs.forEach((slug, index) => {
    out[slug] = index === 0 ? "strong" : "good";
  });
  return out;
}

function strongSizesFromListed(listed: string[]): string[] {
  if (listed.length === 0) return [];
  if (listed.length <= 2) return [...listed];
  const preferred = listed.filter(
    (s) => s === "small-business" || s === "mid-market",
  );
  if (preferred.length > 0) return preferred;
  return listed.slice(0, 2);
}

function priorityFitsFromTaxonomy(
  software: Pick<Software, "subcategorySlugs" | "useCaseSlugs">,
): Record<string, FitLevel> {
  const subs = new Set(software.subcategorySlugs);
  const uses = new Set(software.useCaseSlugs);

  const engagementHit =
    [...ENGAGEMENT_SUBCATEGORIES].some((s) => subs.has(s) || uses.has(s));
  const dataHit =
    [...DATA_SUBCATEGORIES].some((s) => subs.has(s) || uses.has(s));

  // Engagement-primary tools stay balanced; pure data tools lean ease/setup.
  if (engagementHit && !dataHit) {
    return { ...ENGAGEMENT_PRIORITIES };
  }
  if (engagementHit && dataHit) {
    // Combined data + engagement (e.g. Apollo) — balanced with strong ease.
    return {
      "ease-of-use": "strong",
      "fast-setup": "good",
      customization: "good",
      "minimal-admin": "moderate",
    };
  }
  return { ...DATA_TOOL_PRIORITIES };
}

/**
 * Derive finder fit from Software catalogue fields only.
 */
export function deriveSiProductFit(software: Software): CrmProductFit {
  const sizes =
    software.businessSizeSlugs.length > 0
      ? [...software.businessSizeSlugs]
      : [];
  return {
    productSlug: software.slug,
    businessSizeFits: sizeFits(sizes, strongSizesFromListed(sizes)),
    useCaseFits: buildUseCaseFitMap(software.useCaseSlugs),
    priorityFits: priorityFitsFromTaxonomy(software),
    businessTypeFits: Object.fromEntries(
      software.businessTypeSlugs.map((slug, index) => [
        slug,
        index === 0 ? ("strong" as const) : ("good" as const),
      ]),
    ),
  };
}

/** Optional curated refinements — prefer taxonomy on Software when possible. */
export const siFitOverridesBySlug: Record<string, Partial<CrmProductFit>> = {};

/** @deprecated Prefer deriveSiProductFit(software) per product. */
export const siFitBySlug: Record<string, CrmProductFit> = {};

export function resolveSiProductFit(software: Software): CrmProductFit {
  const derived = deriveSiProductFit(software);
  const override = siFitOverridesBySlug[software.slug];
  if (!override) return derived;
  return {
    productSlug: software.slug,
    businessSizeFits: {
      ...derived.businessSizeFits,
      ...override.businessSizeFits,
    },
    useCaseFits: {
      ...derived.useCaseFits,
      ...override.useCaseFits,
    },
    priorityFits: {
      ...derived.priorityFits,
      ...override.priorityFits,
    },
    businessTypeFits: {
      ...derived.businessTypeFits,
      ...override.businessTypeFits,
    },
  };
}
