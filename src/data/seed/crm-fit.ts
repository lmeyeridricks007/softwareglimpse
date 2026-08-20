import type { CrmProductFit, FitLevel, Software } from "@/domain";

/**
 * Structured CRM fit assessments derived from catalogue taxonomy.
 * Does not invent feature or pricing facts.
 *
 * Prefer `deriveCrmProductFit(software)` so every CRM in the catalogue
 * participates in Finder scoring. Optional curated overrides in
 * `crmFitOverridesBySlug` can refine priority/use-case emphasis.
 */

const BUSINESS_SIZES = [
  "solo",
  "micro",
  "small-business",
  "mid-market",
  "enterprise",
] as const;

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

/** simple-crm / gmail-crm → strong ease/setup/admin, weak customization */
const SIMPLE_PRIORITIES = {
  "ease-of-use": "strong",
  "fast-setup": "strong",
  customization: "weak",
  "minimal-admin": "strong",
} as const satisfies Record<string, FitLevel>;

/** sales-crm without simple → moderate ease, good customization */
const SALES_PRIORITIES = {
  "ease-of-use": "moderate",
  "fast-setup": "moderate",
  customization: "good",
  "minimal-admin": "moderate",
} as const satisfies Record<string, FitLevel>;

function priorityFitsFromSubcategories(
  subcategorySlugs: string[],
): Record<string, FitLevel> {
  const set = new Set(subcategorySlugs);
  if (set.has("simple-crm") || set.has("gmail-crm")) {
    return { ...SIMPLE_PRIORITIES };
  }
  return { ...SALES_PRIORITIES };
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

function inferBusinessSizes(
  software: Pick<Software, "businessSizeSlugs" | "subcategorySlugs">,
): string[] {
  if (software.businessSizeSlugs.length > 0) {
    return [...software.businessSizeSlugs];
  }
  // Derive only from existing subcategory taxonomy — never invent sizes.
  const sub = new Set(software.subcategorySlugs);
  const sizes = new Set<string>();
  if (
    sub.has("simple-crm") ||
    sub.has("gmail-crm") ||
    sub.has("startup-crm") ||
    sub.has("small-business-crm")
  ) {
    sizes.add("micro");
    sizes.add("small-business");
  }
  if (sub.has("sales-crm") || sub.has("ai-crm")) {
    if (sizes.size === 0) {
      sizes.add("small-business");
      sizes.add("mid-market");
    } else {
      sizes.add("mid-market");
    }
  }
  return [...sizes];
}

/**
 * Derive finder fit from Software catalogue fields only.
 */
export function deriveCrmProductFit(software: Software): CrmProductFit {
  const sizes = inferBusinessSizes(software);
  return {
    productSlug: software.slug,
    businessSizeFits: sizeFits(sizes, strongSizesFromListed(sizes)),
    useCaseFits: buildUseCaseFitMap(software.useCaseSlugs),
    priorityFits: priorityFitsFromSubcategories(software.subcategorySlugs),
    businessTypeFits: Object.fromEntries(
      software.businessTypeSlugs.map((slug, index) => [
        slug,
        index === 0 ? ("strong" as const) : ("good" as const),
      ]),
    ),
  };
}

/**
 * Optional curated refinements on top of catalogue-derived fit.
 * Keys should be rare — prefer taxonomy on Software when possible.
 */
export const crmFitOverridesBySlug: Record<string, Partial<CrmProductFit>> = {
  keap: {
    priorityFits: {
      "ease-of-use": "moderate",
      "fast-setup": "weak",
      customization: "good",
      "minimal-admin": "weak",
    },
  },
};

/**
 * Full fit map used by snapshot builders: catalogue derivation + overrides.
 * @deprecated Prefer deriveCrmProductFit(software) per product.
 */
export const crmFitBySlug: Record<string, CrmProductFit> = {};

export function resolveCrmProductFit(software: Software): CrmProductFit {
  const derived = deriveCrmProductFit(software);
  const override = crmFitOverridesBySlug[software.slug];
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
