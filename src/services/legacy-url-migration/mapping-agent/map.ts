import { canonicalizeComparisonSlug } from "@/domain/comparison-slug";
import type { ContentGraph, GraphNode } from "./content-graph";
import { jaccard, tokenize } from "./content-graph";
import type { ParsedLegacyIntent } from "./intent";
import type {
  MappingAction,
  MappingConfidence,
  MappingMatchBasis,
  MappingRelationship,
  MappingSeoRisk,
  UrlMappingRow,
} from "./types";

type Draft = {
  node?: GraphNode | null;
  relationship: MappingRelationship;
  action: MappingAction;
  confidence: MappingConfidence;
  matchBasis: MappingMatchBasis;
  reason: string;
  notes?: string[];
};

function draft(
  partial: Draft,
): Draft {
  return { notes: [], ...partial };
}

/** Vertical / audience cluster → preferred new destinations (ordered). */
const CLUSTER_TARGETS: Record<string, string[]> = {
  startups: ["/for/startups/", "/best/crm-software/"],
  freelancers: ["/for/freelancers/", "/best/crm-software/"],
  "small-business": ["/for/small-business/", "/industries/small-business/", "/best/crm-software/"],
  "small-real-estate-business": ["/industries/real-estate/", "/best/crm-software/"],
  "real-estate": ["/industries/real-estate/", "/best/crm-software/"],
  "real-estate-investors": ["/industries/real-estate/", "/best/crm-software/"],
  "commercial-real-estate": ["/industries/real-estate/", "/best/crm-software/"],
  construction: ["/industries/construction/", "/best/crm-software/"],
  restaurants: ["/industries/hospitality/", "/best/crm-software/"],
  hotels: ["/industries/hospitality/", "/best/crm-software/"],
  hospitality: ["/industries/hospitality/", "/best/crm-software/"],
  "legal-practices": ["/industries/legal-services/", "/best/crm-software/"],
  "small-legal-practices": ["/industries/legal-services/", "/best/crm-software/"],
  "financial-advisors": ["/industries/financial-services/", "/best/crm-software/"],
  "car-dealerships": ["/industries/retail-ecommerce/", "/best/crm-software/"],
  nonprofits: ["/industries/nonprofit/", "/for/nonprofits/", "/best/crm-software/"],
  "small-nonprofits": ["/industries/nonprofit/", "/for/nonprofits/", "/best/crm-software/"],
  "field-sales": ["/use-cases/field-sales/", "/best/crm-software/"],
  coaches: ["/for/freelancers/", "/best/crm-software/"],
  agencies: ["/for/agencies/", "/best/crm-software/"],
  enterprise: ["/for/enterprise/", "/best/crm-software/"],
  "sales-teams": ["/for/sales-teams/", "/use-cases/pipeline-management/", "/best/crm-software/"],
  engineering: ["/best/crm-software/"],
  "event-management": ["/best/crm-software/"],
  "facebook-leads": ["/use-cases/lead-management/", "/best/crm-software/"],
  linkedin: ["/use-cases/prospecting/", "/best/crm-software/"],
  musicians: ["/best/crm-software/"],
  photographers: ["/best/crm-software/"],
  plumbers: ["/best/crm-software/"],
  "web-designers": ["/for/freelancers/", "/best/crm-software/"],
  "office-365": ["/best/crm-software/"],
  "investor-relations": ["/best/crm-software/"],
  "venture-capital": ["/best/crm-software/"],
  "private-equity": ["/best/crm-software/"],
  solar: ["/best/crm-software/"],
  "solar-businesses": ["/best/crm-software/"],
  dubai: ["/best/crm-software/"],
  "text-messaging": ["/features/calling/", "/best/crm-software/"],
};

const GUIDE_TOPIC_MAP: Array<{ patterns: RegExp[]; path: string }> = [
  { patterns: [/^what-is-crm/, /what-is-a-crm/, /crm-system$/], path: "/guides/what-is-crm/" },
  { patterns: [/how-crm-works/, /how-does-crm/], path: "/guides/how-crm-works/" },
  { patterns: [/types-of-crm/, /crm-types/], path: "/guides/types-of-crm/" },
  { patterns: [/crm-benefits/, /benefits-of-crm$/, /benefits-crm$/], path: "/guides/crm-benefits/" },
  { patterns: [/do-i-need-a-crm/, /need-a-crm/], path: "/guides/do-i-need-a-crm/" },
  { patterns: [/how-to-choose-crm/, /choose-.*crm/, /selecting-crm/], path: "/guides/how-to-choose-crm/" },
  { patterns: [/crm-implementation/, /implementing-crm/], path: "/guides/crm-implementation/" },
  { patterns: [/crm-migration/, /migrat.*crm/], path: "/guides/crm-data-migration/" },
  { patterns: [/crm-pricing/, /pricing-guide/], path: "/guides/crm-pricing-guide/" },
  { patterns: [/crm-vs-spreadsheet/, /spreadsheet/], path: "/guides/crm-vs-spreadsheet/" },
  { patterns: [/crm-vs-erp/, /cdp-vs-crm/, /crm-vs-cdp/, /a-guide-to-cdp-vs-crm/], path: "/guides/crm-vs-cdp/" },
  { patterns: [/crm-vs-marketing/], path: "/guides/crm-vs-marketing-automation/" },
  { patterns: [/crm-security/, /ensuring-crm-security/], path: "/guides/common-crm-mistakes/" },
  { patterns: [/best-practices-crm/, /crm-best-practices/], path: "/guides/common-crm-mistakes/" },
  { patterns: [/crm-rfp/], path: "/guides/crm-rfp-guide/" },
  { patterns: [/crm-demo/], path: "/guides/crm-demo-guide/" },
  { patterns: [/crm-training/], path: "/guides/crm-training/" },
  { patterns: [/crm-roi/], path: "/guides/crm-roi-guide/" },
];

function outOfStrategyTopic(slug: string): boolean {
  return /(seo|semrush|ahrefs|chatgpt|jasper|grammarly|surfer|rankmath|pictory|writesonic|copy-ai|bard|llama|copilot|tweet|script-writing|diy-seo)/i.test(
    slug,
  );
}

function applyExplicit(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  const hit = graph.explicitHistorical.get(intent.path);
  if (!hit) return null;
  if (hit.target === null) {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "MEDIUM",
      matchBasis: "explicit_historical",
      reason: `Explicit historical map: no target (${hit.reason})`,
      notes: [`source=${hit.source}`],
    });
  }
  const node = graph.nodesByPath.get(hit.target);
  const isMerge =
    hit.reason.toLowerCase().includes("merge") ||
    intent.path.includes("ultimate-guide") ||
    intent.path.includes("comparing-setup") ||
    intent.kind === "best";
  return draft({
    node,
    relationship: intent.path === hit.target ? "EXACT" : isMerge ? "MERGED_INTO" : "EQUIVALENT",
    action:
      intent.path === hit.target
        ? "KEEP"
        : isMerge
          ? "MERGE_AND_301"
          : "301_REDIRECT",
    confidence: "HIGH",
    matchBasis: "explicit_historical",
    reason: `Explicit historical mapping (${hit.source}): ${hit.reason}`,
    notes: node ? [] : [`Target ${hit.target} missing from content graph`],
  });
}

function mapExactPath(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  const node = graph.nodesByPath.get(intent.path);
  if (!node) return null;
  return draft({
    node,
    relationship: "EXACT",
    action: "KEEP",
    confidence: "HIGH",
    matchBasis: "canonical_entity",
    reason: "Identical path exists on new site",
  });
}

function mapProductReview(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "product_review") return null;
  if (!intent.productSlug) {
    if (outOfStrategyTopic(intent.slug)) {
      return draft({
        relationship: "NO_EQUIVALENT",
        action: "410",
        confidence: "MEDIUM",
        matchBasis: "strategy_retire",
        reason:
          "Non-CRM / out-of-strategy product review with no catalogue entity — retire rather than mislead",
      });
    }
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "MEDIUM",
      matchBasis: "unmapped",
      reason:
        "Product review without matching catalogue entity — onboard product or intentionally retire",
    });
  }
  const node = graph.softwareBySlug.get(intent.productSlug);
  const isDup = /-\d+\/$/.test(intent.path);
  return draft({
    node,
    relationship: isDup ? "DUPLICATE" : "EQUIVALENT",
    action: "301_REDIRECT",
    confidence: "HIGH",
    matchBasis: "same_product",
    reason: `Same product entity → /software/${intent.productSlug}/ (primary review intent)`,
  });
}

function mapProductPricing(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "product_pricing") return null;
  if (!intent.productSlug) {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "LOW",
      matchBasis: "unmapped",
      reason: "Pricing URL without resolvable product entity",
    });
  }
  const pricingPath = `/software/${intent.productSlug}/pricing/`;
  const node =
    graph.nodesByPath.get(pricingPath) ??
    graph.softwareBySlug.get(intent.productSlug);
  return draft({
    node,
    relationship: "EQUIVALENT",
    action: "301_REDIRECT",
    confidence: node?.path.endsWith("/pricing/") ? "HIGH" : "MEDIUM",
    matchBasis: "same_product",
    reason: node?.path.endsWith("/pricing/")
      ? `Moved subcontent: dedicated pricing tab ${pricingPath}`
      : `Pricing intent for ${intent.productSlug}; pricing tab missing — product hub fallback`,
    notes: [
      "Do not collapse to generic product overview when pricing tab exists",
    ],
  });
}

function mapAlternatives(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "product_alternatives") return null;
  if (!intent.productSlug) {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "MEDIUM",
      matchBasis: "unmapped",
      reason: "Alternatives page without resolvable product",
    });
  }
  const alt = graph.alternativesBySlug.get(intent.productSlug);
  if (alt) {
    return draft({
      node: alt,
      relationship: "EQUIVALENT",
      action: "301_REDIRECT",
      confidence: "HIGH",
      matchBasis: "same_product",
      reason: `Same product alternatives intent → ${alt.path}`,
    });
  }
  const soft = graph.softwareBySlug.get(intent.productSlug);
  if (soft) {
    return draft({
      node: soft,
      relationship: "MERGED_INTO",
      action: "MERGE_AND_301",
      confidence: "MEDIUM",
      matchBasis: "same_product",
      reason: `No /alternatives/${intent.productSlug}/ page yet — interim merge into product hub`,
      notes: ["Prefer publishing alternatives page before cutover if traffic warrants"],
    });
  }
  return draft({
    relationship: "NO_EQUIVALENT",
    action: "REVIEW",
    confidence: "MEDIUM",
    matchBasis: "unmapped",
    reason: "Alternatives intent unresolved",
  });
}

function mapComparison(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "comparison") return null;
  if (!intent.productSlugs) {
    // Guide-shaped comparisons (CRM vs CDP, etc.)
    for (const rule of GUIDE_TOPIC_MAP) {
      if (rule.patterns.some((re) => re.test(intent.slug))) {
        const node = graph.nodesByPath.get(rule.path);
        if (node) {
          return draft({
            node,
            relationship: "MERGED_INTO",
            action: "MERGE_AND_301",
            confidence: "HIGH",
            matchBasis: "same_guide_intent",
            reason: `Comparison-shaped URL is guide intent → ${rule.path}`,
          });
        }
      }
    }
    if (outOfStrategyTopic(intent.slug)) {
      return draft({
        relationship: "NO_EQUIVALENT",
        action: "410",
        confidence: "MEDIUM",
        matchBasis: "strategy_retire",
        reason:
          "Non-CRM comparison outside current site strategy — retire (do not homepage redirect)",
      });
    }
    // One side may be in catalogue
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "MEDIUM",
      matchBasis: "unmapped",
      reason:
        "Comparison pair could not be resolved to two catalogue products — review primary intent",
    });
  }
  const [a, b] = intent.productSlugs;
  let canonical: string;
  try {
    canonical = canonicalizeComparisonSlug([a, b]);
  } catch {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "LOW",
      matchBasis: "unmapped",
      reason: "Invalid comparison pair",
    });
  }
  const node = graph.comparisonsByCanonical.get(canonical);
  if (node) {
    const isDup =
      /-\d+\/$/.test(intent.path) ||
      intent.path.includes("ultimate-guide") ||
      intent.path.includes("comparing-setup");
    return draft({
      node,
      relationship: isDup ? "DUPLICATE" : "EQUIVALENT",
      action: isDup ? "MERGE_AND_301" : "301_REDIRECT",
      confidence: "HIGH",
      matchBasis: "same_comparison_pair",
      reason: `Order-insensitive comparison pair [${a}, ${b}] → canonical ${node.path}`,
    });
  }
  // Both products exist but compare page missing — REVIEW (do not invent 1:many)
  return draft({
    relationship: "NO_EQUIVALENT",
    action: "REVIEW",
    confidence: "MEDIUM",
    matchBasis: "same_comparison_pair",
    reason: `Both products in catalogue (${a}, ${b}) but no /compare/${canonical}/ page — do not guess a one-sided redirect`,
    notes: ["SPLIT/missing compare — create compare page or pick dominant intent manually"],
  });
}

function mapBest(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "best") return null;
  if (outOfStrategyTopic(intent.slug) && !intent.slug.includes("crm")) {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "410",
      confidence: "MEDIUM",
      matchBasis: "strategy_retire",
      reason: "Non-CRM best list outside strategy — retire",
    });
  }

  // Core best CRM list
  if (
    ["best-crms", "best-crm", "best-crm-software"].includes(intent.slug) ||
    intent.slug === "best-of-crm"
  ) {
    const node = graph.bestBySlug.get("crm-software");
    return draft({
      node,
      relationship: "MERGED_INTO",
      action: "MERGE_AND_301",
      confidence: "HIGH",
      matchBasis: "exact_title_topic",
      reason: "Core best-CRM list consolidates into /best/crm-software/",
    });
  }

  // best-practices → guides, not best hub
  if (intent.slug.startsWith("best-practices")) {
    const guide = graph.nodesByPath.get("/guides/common-crm-mistakes/");
    return draft({
      node: guide,
      relationship: "MERGED_INTO",
      action: "MERGE_AND_301",
      confidence: "LOW",
      matchBasis: "same_guide_intent",
      reason:
        "Best-practices article is guide intent, not a ranked best list — soft merge to related guide; confirm editorially",
    });
  }

  if (intent.clusterHint) {
    const targets = CLUSTER_TARGETS[intent.clusterHint] ?? [];
    for (const path of targets) {
      // Never auto-pick generic best in the first pass — prefer specific hubs.
      if (path === "/best/crm-software/") continue;
      const node = graph.nodesByPath.get(path);
      if (node) {
        return draft({
          node,
          relationship: "EQUIVALENT",
          action: "301_REDIRECT",
          confidence: "MEDIUM",
          matchBasis: "same_category_cluster",
          reason: `Vertical best list cluster "${intent.clusterHint}" → ${path}`,
        });
      }
    }
    if (targets.includes("/best/crm-software/")) {
      const node = graph.bestBySlug.get("crm-software");
      return draft({
        node,
        relationship: "MERGED_INTO",
        action: "REVIEW",
        confidence: "LOW",
        matchBasis: "same_category_cluster",
        reason: `Vertical best-CRM (${intent.clusterHint}) has no dedicated industry/audience/use-case page — REVIEW before merging into /best/crm-software/`,
        notes: ["Do not auto-301 vertical listicles to homepage or generic best without approval"],
      });
    }
  }

  return draft({
    relationship: "NO_EQUIVALENT",
    action: "REVIEW",
    confidence: "LOW",
    matchBasis: "unmapped",
    reason: "Best list without clear cluster mapping — editorial decision required",
  });
}

function mapGuide(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "guide" && intent.kind !== "other") return null;

  for (const rule of GUIDE_TOPIC_MAP) {
    if (rule.patterns.some((re) => re.test(intent.slug))) {
      const node = graph.nodesByPath.get(rule.path);
      if (node) {
        // Vertical "how to choose CRM for X" — generic guide is a merge candidate, not a perfect equivalent
        const verticalChoose =
          /how-to-choose/.test(intent.slug) &&
          (/-for-/.test(intent.slug) ||
            /hotels|musicians|plumbing|advisors|engineering|freelancers|linkedin|solar|security/.test(
              intent.slug,
            ));
        if (verticalChoose) {
          return draft({
            node,
            relationship: "MERGED_INTO",
            action: "REVIEW",
            confidence: "MEDIUM",
            matchBasis: "same_guide_intent",
            reason: `Vertical choose-CRM guide — candidate merge to ${rule.path}; confirm vs industry/audience page before 301`,
            notes: ["Dominant intent may be vertical, not generic selection guide"],
          });
        }
        return draft({
          node,
          relationship: "MERGED_INTO",
          action: "MERGE_AND_301",
          confidence: "HIGH",
          matchBasis: "same_guide_intent",
          reason: `Same guide intent topic map → ${rule.path}`,
        });
      }
    }
  }

  // benefits-of-{product} → product page (not a fake benefits guide)
  if (intent.productSlug && intent.slug.startsWith("benefits-of-")) {
    const node = graph.softwareBySlug.get(intent.productSlug);
    if (node) {
      return draft({
        node,
        relationship: "MERGED_INTO",
        action: "MERGE_AND_301",
        confidence: "MEDIUM",
        matchBasis: "same_product",
        reason: `Product-benefits article for ${intent.productSlug} merges into product hub`,
      });
    }
  }

  // Semantic similarity against guides
  let best: { node: GraphNode; score: number } | null = null;
  for (const g of graph.guides) {
    const score = jaccard(intent.tokens, g.tokens);
    if (!best || score > best.score) best = { node: g, score };
  }
  if (best && best.score >= 0.45) {
    return draft({
      node: best.node,
      relationship: "EQUIVALENT",
      action: "301_REDIRECT",
      confidence: best.score >= 0.6 ? "MEDIUM" : "LOW",
      matchBasis: "semantic_similarity",
      reason: `Semantic guide similarity ${(best.score * 100).toFixed(0)}% → ${best.node.path}`,
      notes: ["Slug-word overlap alone is insufficient; score gated at ≥45%"],
    });
  }

  if (intent.kind === "guide") {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "LOW",
      matchBasis: "unmapped",
      reason: "Guide-like URL without strong intent or semantic match",
    });
  }
  return null;
}

function mapCategory(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind !== "category") return null;
  const hint = intent.clusterHint ?? "";
  if (hint === "crm" || hint === "best-crms") {
    const path = hint === "best-crms" ? "/best/crm-software/" : "/categories/crm/";
    const node = graph.nodesByPath.get(path);
    return draft({
      node,
      relationship: hint === "best-crms" ? "MERGED_INTO" : "EQUIVALENT",
      action: hint === "best-crms" ? "MERGE_AND_301" : "301_REDIRECT",
      confidence: "HIGH",
      matchBasis: "same_category_cluster",
      reason: `WP category ${hint} → ${path}`,
    });
  }
  if (hint.includes("crm-comparisons") || hint === "software-comparison") {
    return draft({
      node: graph.nodesByPath.get("/compare/"),
      relationship: "MERGED_INTO",
      action: "301_REDIRECT",
      confidence: "MEDIUM",
      matchBasis: "same_category_cluster",
      reason: "WP comparison category → /compare/ hub",
    });
  }
  if (hint.includes("crm-guides") || hint === "guides") {
    return draft({
      node: graph.nodesByPath.get("/guides/"),
      relationship: "MERGED_INTO",
      action: "301_REDIRECT",
      confidence: "MEDIUM",
      matchBasis: "same_category_cluster",
      reason: "WP guides category → /guides/ hub",
    });
  }
  // Industry-flavored categories
  for (const ind of graph.industries) {
    const indSlug = ind.path.replace(/^\/industries\/|\/$/g, "");
    if (hint.includes(indSlug) || hint.includes(indSlug.replace(/-/g, ""))) {
      return draft({
        node: ind,
        relationship: "MERGED_INTO",
        action: "REVIEW",
        confidence: "LOW",
        matchBasis: "same_category_cluster",
        reason: `Possible industry category affinity → ${ind.path} (confirm before 301)`,
      });
    }
  }
  if (outOfStrategyTopic(hint)) {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "410",
      confidence: "MEDIUM",
      matchBasis: "strategy_retire",
      reason: "Out-of-strategy WP category archive — retire",
    });
  }
  return draft({
    relationship: "MERGED_INTO",
    action: "REVIEW",
    confidence: "LOW",
    matchBasis: "same_category_cluster",
    reason: "WP category — map to topical hub or retire; do not mass-301 to /categories/",
    notes: ["Suggested hub /categories/ only after topical review"],
  });
}

function mapTaxonomyRetire(intent: ParsedLegacyIntent): Draft | null {
  if (intent.kind === "tag") {
    return draft({
      relationship: "DUPLICATE",
      action: "410",
      confidence: "HIGH",
      matchBasis: "taxonomy_retire",
      reason: "WP tag archive — low-value taxonomy; retire (410). Do not homepage redirect.",
    });
  }
  if (intent.kind === "author") {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "404",
      confidence: "HIGH",
      matchBasis: "taxonomy_retire",
      reason: "Author archive not in new IA",
    });
  }
  if (intent.kind === "feed" || intent.kind === "pagination" || intent.kind === "query") {
    return draft({
      relationship: "DUPLICATE",
      action: "410",
      confidence: "HIGH",
      matchBasis: "taxonomy_retire",
      reason: `${intent.kind} URL — legacy WordPress infrastructure; retire`,
    });
  }
  if (intent.kind === "attachment") {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "410",
      confidence: "MEDIUM",
      matchBasis: "taxonomy_retire",
      reason: "Attachment/media URL — handle via media migration separately; not a content redirect",
    });
  }
  if (intent.kind === "locale") {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "REVIEW",
      confidence: "LOW",
      matchBasis: "unmapped",
      reason: "Locale URL — requires language cutover plan (not auto-mapped in EN pass)",
    });
  }
  return null;
}

function mapHubLegal(intent: ParsedLegacyIntent, graph: ContentGraph): Draft | null {
  if (intent.kind === "home") {
    return draft({
      node: graph.nodesByPath.get("/"),
      relationship: "EXACT",
      action: "KEEP",
      confidence: "HIGH",
      matchBasis: "canonical_entity",
      reason: "Homepage",
    });
  }
  if (intent.kind === "hub") {
    const path = `/${intent.slug}/`;
    const node = graph.nodesByPath.get(path);
    if (node) {
      return draft({
        node,
        relationship: "EXACT",
        action: "KEEP",
        confidence: "HIGH",
        matchBasis: "canonical_entity",
        reason: `Hub path ${path} retained`,
      });
    }
  }
  if (intent.kind === "company" && intent.slug === "contact") {
    return draft({
      node: graph.nodesByPath.get("/company/contact/"),
      relationship: "EQUIVALENT",
      action: "301_REDIRECT",
      confidence: "HIGH",
      matchBasis: "canonical_entity",
      reason: "Contact page moved under /company/",
    });
  }
  if (intent.kind === "legal" && intent.slug === "privacy-policy") {
    return draft({
      node: graph.nodesByPath.get("/legal/privacy/"),
      relationship: "EQUIVALENT",
      action: "301_REDIRECT",
      confidence: "HIGH",
      matchBasis: "canonical_entity",
      reason: "Privacy policy moved under /legal/privacy/",
    });
  }
  return null;
}

function mapOtherSemantic(intent: ParsedLegacyIntent, graph: ContentGraph): Draft {
  if (outOfStrategyTopic(intent.slug)) {
    return draft({
      relationship: "NO_EQUIVALENT",
      action: "410",
      confidence: "MEDIUM",
      matchBasis: "strategy_retire",
      reason: "Out-of-strategy article — retire rather than redirect to unrelated CRM content",
    });
  }

  // Try semantic match across guides + resources + industries
  const corpus = [
    ...graph.guides,
    ...graph.resources,
    ...graph.industries,
    ...graph.useCases,
    ...graph.audiences,
  ];
  let best: { node: GraphNode; score: number } | null = null;
  for (const n of corpus) {
    const score = jaccard(intent.tokens, n.tokens);
    if (!best || score > best.score) best = { node: n, score };
  }
  if (best && best.score >= 0.5) {
    return draft({
      node: best.node,
      relationship: "EQUIVALENT",
      action: "REVIEW",
      confidence: "LOW",
      matchBasis: "semantic_similarity",
      reason: `Weak semantic candidate ${(best.score * 100).toFixed(0)}% → ${best.node.path} — REVIEW before 301`,
      notes: ["Not auto-301: similarity-only matches require editorial confirmation"],
    });
  }

  return draft({
    relationship: "NO_EQUIVALENT",
    action: "REVIEW",
    confidence: "LOW",
    matchBasis: "unmapped",
    reason: "No safe equivalent found via entity, intent, cluster, or semantic gates",
  });
}

/**
 * Priority matching (does not use simplistic slug-contains alone).
 */
export function mapLegacyIntent(
  intent: ParsedLegacyIntent,
  graph: ContentGraph,
  legacyTitle?: string | null,
): UrlMappingRow {
  const title = legacyTitle?.trim() || intent.titleGuess;

  const pipeline: Array<() => Draft | null> = [
    () => applyExplicit(intent, graph),
    () => mapExactPath(intent, graph),
    () => mapTaxonomyRetire(intent),
    () => mapHubLegal(intent, graph),
    () => mapProductPricing(intent, graph),
    () => mapProductReview(intent, graph),
    () => mapAlternatives(intent, graph),
    () => mapComparison(intent, graph),
    () => mapBest(intent, graph),
    () => mapGuide(intent, graph),
    () => mapCategory(intent, graph),
  ];

  let chosen: Draft | null = null;
  for (const step of pipeline) {
    chosen = step();
    if (chosen) break;
  }
  if (!chosen) chosen = mapOtherSemantic(intent, graph);

  // Title/topic boost: if legacy title strongly matches destination title
  if (chosen.node && title) {
    const titleScore = jaccard(tokenize(title), chosen.node.tokens);
    if (titleScore >= 0.55 && chosen.confidence !== "HIGH") {
      chosen.confidence = chosen.confidence === "LOW" ? "MEDIUM" : "HIGH";
      chosen.matchBasis =
        chosen.matchBasis === "semantic_similarity"
          ? "exact_title_topic"
          : chosen.matchBasis;
      chosen.notes = [
        ...(chosen.notes ?? []),
        `Title/topic overlap ${(titleScore * 100).toFixed(0)}% with destination`,
      ];
    }
  }

  const seoRisk = assessSeoRisk(intent, chosen);
  const highRiskFlags = collectHighRiskFlags(intent, chosen, seoRisk);

  return {
    legacyUrl: `https://www.softwareglimpse.com${intent.path}`,
    legacyPath: intent.path,
    legacyTitle: title,
    legacyPageType: intent.legacyPageType,
    legacyIntent: intent.kind,
    newUrl: chosen.node?.url ?? null,
    newPath: chosen.node?.path ?? null,
    newTitle: chosen.node?.title ?? null,
    relationship: chosen.relationship,
    recommendedAction: chosen.action,
    confidence: chosen.confidence,
    seoRisk,
    highRiskFlags,
    matchBasis: chosen.matchBasis,
    reason: chosen.reason,
    notes: chosen.notes ?? [],
  };
}

function assessSeoRisk(intent: ParsedLegacyIntent, chosen: Draft): MappingSeoRisk {
  if (
    ["product_review", "product_pricing", "product_alternatives", "comparison", "best"].includes(
      intent.kind,
    )
  ) {
    return "HIGH";
  }
  if (intent.kind === "guide" || intent.kind === "resource" || intent.kind === "tool") {
    return "HIGH";
  }
  if (intent.kind === "hub" || intent.kind === "legal" || intent.kind === "company") {
    return "MEDIUM";
  }
  if (["tag", "author", "feed", "pagination", "query", "attachment"].includes(intent.kind)) {
    return "LOW";
  }
  if (chosen.action === "REVIEW" && chosen.confidence === "LOW") return "MEDIUM";
  return "MEDIUM";
}

function collectHighRiskFlags(
  intent: ParsedLegacyIntent,
  chosen: Draft,
  seoRisk: MappingSeoRisk,
): string[] {
  const flags: string[] = [];
  if (seoRisk === "HIGH") flags.push("high_seo_risk_intent");
  if (intent.kind === "product_review") flags.push("product_review");
  if (intent.kind === "comparison") flags.push("comparison");
  if (intent.kind === "best") flags.push("best_page");
  if (intent.kind === "guide") flags.push("high_value_guide_candidate");
  if (intent.kind === "product_pricing") flags.push("product_pricing");
  if (intent.kind === "product_alternatives") flags.push("alternatives");
  if (intent.kind === "resource" || intent.kind === "tool") flags.push("resource_or_tool");
  if (chosen.action === "REVIEW") flags.push("review_required");
  if (chosen.confidence === "LOW" && chosen.node) flags.push("low_confidence_mapping");
  if (chosen.matchBasis === "semantic_similarity") flags.push("semantic_only");
  // Historical importance heuristic: CRM commercial intents
  if (
    intent.slug.includes("crm") &&
    ["product_review", "comparison", "best", "guide"].includes(intent.kind)
  ) {
    flags.push("likely_historically_important");
  }
  return flags;
}
