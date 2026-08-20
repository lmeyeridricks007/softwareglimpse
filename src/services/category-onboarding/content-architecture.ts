import {
  getAlternativesPages,
  getBestPageBySlug,
  getCategoryBySlug,
  getComparisons,
  getSoftwareByCategory,
} from "@/data";
import {
  getGuidesByCategory,
} from "@/data/repositories/guides";
import { getCategoryKnowledgeMap } from "@/data/content-clusters/knowledge";
import type {
  CategoryContentCandidate,
  CategoryCoverageThresholds,
  CategoryDefinition,
  CategoryMembership,
} from "@/domain";
import { buildSupportingKnowledgePlan } from "@/services/content-clusters";

export function buildCategoryContentArchitecture(input: {
  definition: CategoryDefinition;
  memberships: CategoryMembership[];
}): CategoryContentCandidate[] {
  const { definition, memberships } = input;
  const thresholds = definition.coverageThresholds;
  const primary = memberships.filter((m) => m.role === "primary");
  const inCatalogue = primary.filter((m) => m.existsInCatalogue);
  const candidates: CategoryContentCandidate[] = [];

  const hub = getCategoryBySlug(definition.slug, { includeUnpublished: true });
  candidates.push({
    id: `content:category-hub:${definition.slug}`,
    pageType: "category-hub",
    canonicalPath: `/categories/${definition.slug}/`,
    status: hub
      ? inCatalogue.length >= thresholds.hubMinProducts
        ? "ready-to-create"
        : "blocked"
      : "missing",
    reason:
      inCatalogue.length >= thresholds.hubMinProducts
        ? "Category definition + minimum products for hub"
        : `Need ${thresholds.hubMinProducts} catalogue products (have ${inCatalogue.length})`,
    dependencies: [`category-def:${definition.slug}`],
    priority: 90,
  });

  const bestSlug = `${definition.slug}-software`.replace(
    /email-marketing-software/,
    "email-marketing-software",
  );
  // Prefer conventional /best/email-marketing-software/
  const coreBestSlug =
    definition.slug === "email-marketing"
      ? "email-marketing-software"
      : definition.slug === "crm"
        ? "crm-software"
        : `${definition.slug}-software`;

  const existingBest = getBestPageBySlug(coreBestSlug, {
    includeUnpublished: true,
  });
  candidates.push({
    id: `content:best:${coreBestSlug}`,
    pageType: "best",
    canonicalPath: `/best/${coreBestSlug}/`,
    status: existingBest
      ? "exists"
      : inCatalogue.length >= thresholds.bestMinResearchedProducts
        ? "blocked"
        : "blocked",
    reason: existingBest
      ? "Best page entity exists — rankings still require editorial approval"
      : `Best page blocked — need ${thresholds.bestMinResearchedProducts} researched + assessed products (catalogue primary: ${inCatalogue.length})`,
    dependencies: [
      `methodology:${definition.editorialMethodology.slug}`,
      `min-assessments:${thresholds.bestMinResearchedProducts}`,
    ],
    priority: 85,
  });
  void bestSlug;

  for (const m of inCatalogue.slice(0, 8)) {
    candidates.push({
      id: `content:software:${m.productSlug}`,
      pageType: "software-review",
      canonicalPath: `/software/${m.productSlug}/`,
      status: "ready-to-create",
      reason: "Primary member eligible for product page pipeline",
      dependencies: [`research:${m.productSlug}`],
      priority: 70,
    });
    candidates.push({
      id: `content:pricing:${m.productSlug}`,
      pageType: "pricing",
      canonicalPath: `/pricing/${m.productSlug}/`,
      status:
        definition.pricingCapability === "UNSUPPORTED" ? "blocked" : "ready-to-create",
      reason:
        definition.pricingCapability === "UNSUPPORTED"
          ? "Pricing capability unsupported"
          : "Pricing page candidate when verified pricing exists",
      dependencies: [`research:${m.productSlug}:pricing`],
      priority: 60,
    });
  }

  // Comparison candidates — cap pairwise among primary catalogue members
  const comparePool = inCatalogue.slice(0, 4);
  let comparisonCount = 0;
  for (let i = 0; i < comparePool.length; i++) {
    for (let j = i + 1; j < comparePool.length; j++) {
      if (comparisonCount >= 3) break;
      const a = comparePool[i]!.productSlug;
      const b = comparePool[j]!.productSlug;
      const [left, right] = a < b ? [a, b] : [b, a];
      const slug = `${left}-vs-${right}`;
      const existing = getComparisons({ includeUnpublished: true }).find(
        (c) => c.slug === slug,
      );
      candidates.push({
        id: `content:comparison:${slug}`,
        pageType: "comparison",
        canonicalPath: `/compare/${slug}/`,
        status: existing ? "exists" : "ready-to-create",
        reason: "Primary members with overlapping decision space",
        dependencies: [`research:${a}`, `research:${b}`, `relationship:${a}:${b}`],
        priority: 55,
      });
      comparisonCount++;
    }
  }

  for (const m of inCatalogue.slice(0, 5)) {
    const alts = getAlternativesPages({ includeUnpublished: true }).find(
      (p) => p.slug === m.productSlug,
    );
    candidates.push({
      id: `content:alternatives:${m.productSlug}`,
      pageType: "alternatives",
      canonicalPath: `/alternatives/${m.productSlug}/`,
      status: alts ? "exists" : "ready-to-create",
      reason: "Alternatives page candidate for primary member",
      dependencies: [`relationship-review:${m.productSlug}`],
      priority: 50,
    });
  }

  for (const uc of definition.useCases.filter(
    (u) => u.pageEligibility === "content-candidate",
  )) {
    const pathSlug =
      definition.slug === "email-marketing"
        ? `email-marketing-for-${uc.slug.replace(/-/g, "-")}`
        : `${definition.slug}-for-${uc.slug}`;
    candidates.push({
      id: `content:use-case:${uc.slug}`,
      pageType: "use-case-best",
      canonicalPath: `/best/${pathSlug}/`,
      status: "blocked",
      reason: "Use-case page is a content candidate — not auto-published",
      dependencies: [`use-case:${uc.slug}`, `best:${coreBestSlug}`],
      priority: 40,
    });
  }

  // Supporting guides from knowledge map — plan only, do not execute
  const knowledgeMap = getCategoryKnowledgeMap(definition.slug);
  const existingGuides = getGuidesByCategory(definition.slug, {
    includeUnpublished: true,
  });
  if (knowledgeMap) {
    for (const topic of knowledgeMap.topics.filter(
      (t) => t.priorityClass === "CORE" || t.priorityClass === "SECONDARY",
    )) {
      const exists = existingGuides.some((g) => g.slug === topic.suggestedSlug);
      candidates.push({
        id: `content:guide:${topic.suggestedSlug}`,
        pageType: "guide",
        canonicalPath: `/guides/${topic.suggestedSlug}/`,
        status: exists
          ? "exists"
          : topic.priorityClass === "CORE"
            ? "ready-to-create"
            : "blocked",
        reason: exists
          ? "Guide entity exists"
          : "Supporting knowledge candidate — execute via single-content workflow after acceptance",
        dependencies: [
          `knowledge-map:${definition.slug}`,
          ...topic.supportsContentIds,
        ],
        priority: topic.priorityClass === "CORE" ? 45 : 30,
      });
    }
  } else if (definition.supportingKnowledgeAreas.length) {
    candidates.push({
      id: `content:guide-plan:${definition.slug}`,
      pageType: "guide",
      canonicalPath: `/guides/`,
      status: "blocked",
      reason:
        "supportingKnowledgeAreas declared but no CategoryKnowledgeMap yet",
      dependencies: [`knowledge-map:${definition.slug}`],
      priority: 25,
    });
  }

  return candidates;
}

export function supportingKnowledgePlanForCategory(
  categorySlug: string,
) {
  return buildSupportingKnowledgePlan(categorySlug);
}

export function summarizeProductCoverage(
  memberships: CategoryMembership[],
  categorySlug: string,
): {
  total: number;
  inCatalogue: number;
  primary: number;
  secondary: number;
  adjacent: number;
  uncertain: number;
} {
  const byCat = getSoftwareByCategory(categorySlug, {
    includeUnpublished: true,
  });
  return {
    total: memberships.length,
    inCatalogue: memberships.filter((m) => m.existsInCatalogue).length,
    primary: memberships.filter((m) => m.role === "primary").length,
    secondary: memberships.filter((m) => m.role === "secondary").length,
    adjacent: memberships.filter((m) => m.role === "adjacent").length,
    uncertain: memberships.filter((m) => m.role === "uncertain").length,
    // touch catalogue count for reporting
    ...(byCat ? {} : {}),
  };
}

export function meetsCoverageThreshold(
  memberships: CategoryMembership[],
  thresholds: CategoryCoverageThresholds,
  kind: "hub" | "best" | "finder",
): boolean {
  const cataloguePrimary = memberships.filter(
    (m) => m.role === "primary" && m.existsInCatalogue,
  ).length;
  if (kind === "hub") return cataloguePrimary >= thresholds.hubMinProducts;
  if (kind === "best")
    return cataloguePrimary >= thresholds.bestMinResearchedProducts;
  return cataloguePrimary >= thresholds.finderMinEnrichedProducts;
}
