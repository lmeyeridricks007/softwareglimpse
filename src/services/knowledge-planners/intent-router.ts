import type { IntentRoute } from "@/domain";
import { IntentRouteSchema } from "@/domain";

/**
 * Deterministic SEO/editorial intent → agent router.
 * No LLM selection.
 */
export function resolveAgentForIntent(input: {
  query?: string;
  suggestedPageType?: string;
  opportunityType?: string;
  productSlug?: string;
  categorySlug?: string;
}): IntentRoute {
  const q = (input.query ?? "").toLowerCase();
  const pageType = (input.suggestedPageType ?? "").toLowerCase();

  if (
    pageType === "comparison" ||
    /\bvs\b/.test(q) ||
    q.includes(" versus ")
  ) {
    return IntentRouteSchema.parse({
      intentKey: "comparison",
      agentId: "comparison-agent",
      pageType: "comparison",
      reason: "Head-to-head comparison intent",
    });
  }

  if (
    pageType === "pricing" ||
    (input.productSlug && q.includes(`${input.productSlug} pricing`)) ||
    (input.productSlug && q.endsWith(" pricing"))
  ) {
    return IntentRouteSchema.parse({
      intentKey: "pricing",
      agentId: "pricing-page-agent",
      pageType: "pricing",
      reason: "Product pricing intent → pricing page, not guide",
    });
  }

  if (
    pageType === "alternatives" ||
    q.includes(" alternative") ||
    q.includes("alternatives")
  ) {
    return IntentRouteSchema.parse({
      intentKey: "alternatives",
      agentId: "alternatives-agent",
      pageType: "alternatives",
      reason: "Replacement / alternatives intent",
    });
  }

  if (pageType === "best" || q.startsWith("best ") || q.includes(" best ")) {
    return IntentRouteSchema.parse({
      intentKey: "best",
      agentId: "best-software-agent",
      pageType: "best",
      reason: "Shortlist / best-of intent",
    });
  }

  if (pageType === "use-case" || q.includes(" for ")) {
    // Weak signal — only if page type says use-case
    if (pageType === "use-case") {
      return IntentRouteSchema.parse({
        intentKey: "use-case",
        agentId: "use-case-page-agent",
        pageType: "use-case",
        reason: "Use-case shortlist intent",
      });
    }
  }

  // Product how-to / setup → product knowledge planner (then GuideAgent)
  if (
    input.productSlug &&
    (q.includes("how to set up") ||
      q.includes("setup") ||
      q.includes("set up ") ||
      q.includes("import ") ||
      q.includes("automation guide"))
  ) {
    return IntentRouteSchema.parse({
      intentKey: "product-support",
      agentId: "product-knowledge-planner-agent",
      pageType: "knowledge-plan",
      reason: "Product how-to / setup intent → product knowledge planner",
    });
  }

  // Category educational / cost explained → category knowledge planner
  if (
    pageType === "guide" ||
    q.startsWith("what is ") ||
    q.startsWith("how to choose ") ||
    q.includes("how much does ") ||
    q.includes(" pricing explained") ||
    q.includes("implementation") ||
    q.includes("migration")
  ) {
    return IntentRouteSchema.parse({
      intentKey: "supporting-guide",
      agentId: "category-knowledge-planner-agent",
      pageType: "knowledge-plan",
      reason:
        "Informational category intent → category knowledge planner / GuideAgent",
    });
  }

  if (pageType === "software-review" || input.productSlug) {
    return IntentRouteSchema.parse({
      intentKey: "product-review",
      agentId: "software-review-agent",
      pageType: "software-review",
      reason: "Default product evaluation intent",
    });
  }

  return IntentRouteSchema.parse({
    intentKey: "category-discover",
    agentId: "category-hub-agent",
    pageType: "category-hub",
    reason: "Fallback category discovery",
  });
}
