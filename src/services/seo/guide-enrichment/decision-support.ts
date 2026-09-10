import type { GuidePage } from "@/domain/schemas";
import {
  getComparisonsForProduct,
  getSoftwareBySlug,
} from "@/data/repositories/catalog";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
} from "@/data/config/tools/category-tool-meta";
import type { DecisionSupportAction } from "./types";
import type { GuideSearchIntent } from "./types";

/**
 * Suggest next actions from real routes only — never mechanical CTA spam.
 */
export function resolveDecisionSupportActions(
  guide: GuidePage,
  intent: GuideSearchIntent,
): DecisionSupportAction[] {
  const actions: DecisionSupportAction[] = [];
  const category = intent.categorySlug || guide.categorySlugs[0] || null;
  const productSlug = guide.productSlugs[0];
  const isExplainer =
    productSlug != null && guide.slug === `what-is-${productSlug}`;

  if (productSlug) {
    const software = getSoftwareBySlug(productSlug);
    if (software) {
      actions.push({
        kind: "review",
        label: isExplainer
          ? `Read the ${software.name} review (evaluation)`
          : `Read the ${software.name} overview`,
        href: `/software/${productSlug}/`,
        reason: isExplainer
          ? "Explainer stays informational — review is the commercial evaluation"
          : "Product hub with pricing and evidence context",
      });
      actions.push({
        kind: "pricing",
        label: `View ${software.name} pricing context`,
        href: `/software/${productSlug}/#pricing`,
        reason: "Plan structure and verification timestamps when present",
      });
    }
    const comparisons = getComparisonsForProduct(productSlug).slice(0, 3);
    for (const c of comparisons) {
      if (c.seo.indexable === false) continue;
      actions.push({
        kind: "compare",
        label: c.title || `Compare ${c.slug}`,
        href: `/compare/${c.slug}/`,
        reason: "Side-by-side decision support",
      });
      if (actions.filter((a) => a.kind === "compare").length >= 2) break;
    }
  }

  if (category) {
    const finder = categoryDecisionFinderHref(category);
    if (finder) {
      actions.push({
        kind: "finder",
        label: "Run the Finder shortlist",
        href: finder,
        reason: "Turn constraints into a fit-based shortlist",
      });
    }
    const cost = categoryDecisionCostHref(category);
    if (
      cost &&
      (isExplainer ||
        intent.commercialIntent !== "informational" ||
        guide.topicType === "pricing-education")
    ) {
      actions.push({
        kind: "cost_calculator",
        label: "Estimate cost fit",
        href: cost,
        reason: "Model plan fit before vendor calls",
      });
    }
    actions.push({
      kind: "hub",
      label: "Browse the category hub",
      href: `/categories/${category}/`,
      reason: "See related use cases and software in this category",
    });
  }

  // Cap — guides should not become CTA walls
  return actions.slice(0, isExplainer ? 6 : 4);
}
