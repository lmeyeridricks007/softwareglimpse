import type { GuidePage } from "@/domain/schemas";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { isProductExplainerGuide } from "@/services/seo/guides-index-worthiness/classify";

export type CannibalizationCheck = {
  ok: boolean;
  detail: string[];
  explainerIntent: "informational" | "unknown";
  reviewIntent: "commercial_evaluation" | "unknown";
};

/**
 * Ensure what-is-{product} stays informational vs /software/{product} evaluation.
 * Does not redirect — only flags identical primary-intent framing.
 */
export function checkExplainerReviewCannibalization(
  guide: GuidePage,
): CannibalizationCheck {
  const detail: string[] = [];
  if (!isProductExplainerGuide(guide)) {
    return {
      ok: true,
      detail: [],
      explainerIntent: "unknown",
      reviewIntent: "unknown",
    };
  }

  const productSlug = guide.productSlugs[0]!;
  const software = getSoftwareBySlug(productSlug);
  const name = software?.name || productSlug;
  const title = (guide.seo.title || guide.title || "").toLowerCase();
  const description = (guide.seo.description || "").toLowerCase();
  const summary = (guide.summary || "").toLowerCase();

  const looksLikeReview =
    /\b(review|rating|score|verdict|worth (it|buying)|best .+ for)\b/i.test(
      title,
    ) && !/\bwhat is\b/i.test(title);

  if (looksLikeReview) {
    detail.push(
      `Explainer title competes with review intent (“${guide.seo.title || guide.title}”)`,
    );
  }

  const reviewCopyOnExplainer =
    /\b(our (final )?verdict|we (recommend|rate)|overall score)\b/i.test(
      `${description} ${summary}`,
    );
  if (reviewCopyOnExplainer) {
    detail.push(
      "Explainer meta/summary uses commercial evaluation phrasing reserved for the product review",
    );
  }

  const pointsToReview =
    guide.nextAction?.contentId?.includes(`software:${productSlug}`) ||
    (guide.blocks ?? []).some(
      (b) =>
        b.type === "related-content" &&
        b.links.some((l) => l.href === `/software/${productSlug}/`),
    );

  if (!pointsToReview) {
    detail.push(
      `Explainer should link to /software/${productSlug}/ as the evaluation surface`,
    );
  }

  // Soft: prefer orientation framing in title
  if (!/\bwhat is\b/i.test(title) && !/\borient/i.test(title)) {
    detail.push(
      `Prefer “What is ${name}?” / orientation framing in title for informational intent`,
    );
  }

  return {
    ok: detail.filter((d) => !d.startsWith("Prefer")).length === 0,
    detail,
    explainerIntent: "informational",
    reviewIntent: "commercial_evaluation",
  };
}
