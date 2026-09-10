import { getGuides } from "@/data/repositories/guides";
import { identityPath } from "@/seo/canonical";
import {
  buildGuideLinkPlan,
  buildComparisonLinkPlan,
} from "@/services/internal-linking/builders";
import { injectionsToPath } from "@/services/internal-linking/link-injections";
import { inboundStatsForPath } from "@/services/seo/knowledge-graph/authority";
import type { LinkReadinessResult } from "./types";

const MIN_MEANINGFUL_INBOUND = 2;

/**
 * INDEXABLE_READY / promote gate: ≥2 meaningful inbound, hub path,
 * relevant outbound next steps.
 */
export function assessLinkReadiness(
  path: string,
  options: {
    kind?: "guide" | "comparison";
    slug?: string;
    /** Skip expensive orphan/CRM scans (unit tests). */
    light?: boolean;
  } = {},
): LinkReadinessResult {
  const p = identityPath(path);
  const detail: string[] = [];

  let meaningfulInbound = injectionsToPath(p).length;

  // Guide referrers via relatedGuideSlugs
  if (p.startsWith("/guides/")) {
    const targetSlug = p.replace(/^\/guides\/|\/$/g, "");
    for (const g of getGuides()) {
      if (g.relatedGuideSlugs.includes(targetSlug)) {
        meaningfulInbound += 1;
      }
    }
  }

  if (!options.light) {
    try {
      const stats = inboundStatsForPath(p);
      meaningfulInbound = Math.max(
        meaningfulInbound,
        stats.contentInboundCount,
      );
    } catch {
      // light fallback already counted
    }
  }

  let hasHubPath = false;
  let hasOutboundNext = false;

  const kind = options.kind;
  const slug =
    options.slug ??
    p.replace(/\/$/, "").split("/").pop() ??
    "";

  if (kind === "guide" || p.startsWith("/guides/")) {
    const guide = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === slug,
    );
    if (guide) {
      const plan = buildGuideLinkPlan(guide);
      hasHubPath = plan.parentHub.length > 0;
      hasOutboundNext =
        Boolean(guide.nextAction) || plan.recommendedNextStep.length > 0;
    }
  } else if (kind === "comparison" || p.startsWith("/compare/")) {
    const plan = buildComparisonLinkPlan({
      comparisonSlug: slug,
      title: slug,
      productSlugs: slug.split("-vs-").filter(Boolean),
    });
    hasHubPath = plan.parentHub.length > 0;
    hasOutboundNext = plan.recommendedNextStep.length > 0;
  }

  if (meaningfulInbound < MIN_MEANINGFUL_INBOUND) {
    detail.push(
      `Need ≥${MIN_MEANINGFUL_INBOUND} meaningful inbound (have ${meaningfulInbound})`,
    );
  }
  if (!hasHubPath) detail.push("Missing hub path (parentHub)");
  if (!hasOutboundNext) detail.push("Missing outbound next step");

  const ok =
    meaningfulInbound >= MIN_MEANINGFUL_INBOUND &&
    hasHubPath &&
    hasOutboundNext;

  if (ok) {
    detail.push(
      `Link readiness ok: inbound=${meaningfulInbound}, hub, outbound`,
    );
  }

  return {
    ok,
    path: p,
    meaningfulInbound,
    hasHubPath,
    hasOutboundNext,
    detail,
  };
}
