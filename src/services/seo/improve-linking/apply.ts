import { getGuides } from "@/data/repositories/guides";
import { identityPath } from "@/seo/canonical";
import {
  buildCategoryLinkPlan,
  buildComparisonLinkPlan,
  buildGuideLinkPlan,
  buildSoftwareLinkPlan,
} from "@/services/internal-linking/builders";
import { flattenPlanLinks } from "@/services/internal-linking/select";
import {
  loadGuideEnrichmentOverlay,
  saveGuideEnrichmentOverlay,
} from "@/services/seo/guide-enrichment/overlay-store";
import type { GuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { classifyEnrichmentGuideType } from "@/services/seo/guide-enrichment/taxonomy";
import { upsertLinkInjections } from "./injection-store";
import { moduleForTarget } from "./module-for-target";
import type { InboundOpportunity, PageLinkingPlan } from "./types";

export { moduleForTarget } from "./module-for-target";

/** Natural plan for a referrer path (skip injections to detect builder-native links). */
function withNaturalPlans<T>(fn: () => T): T {
  const prev = process.env.SG_SKIP_LINK_INJECTIONS;
  process.env.SG_SKIP_LINK_INJECTIONS = "1";
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.SG_SKIP_LINK_INJECTIONS;
    else process.env.SG_SKIP_LINK_INJECTIONS = prev;
  }
}

function naturalOutboundHrefs(fromPath: string): Set<string> {
  return withNaturalPlans(() => {
    const p = identityPath(fromPath);
    try {
      if (p.startsWith("/guides/")) {
        const slug = p.replace(/^\/guides\/|\/$/g, "");
        const guide = getGuides({ includeUnpublished: true }).find(
          (g) => g.slug === slug,
        );
        if (!guide) return new Set();
        return new Set(
          flattenPlanLinks(buildGuideLinkPlan(guide)).map((l) => l.href),
        );
      }
      if (p.startsWith("/software/")) {
        const slug = p.replace(/^\/software\/|\/$/g, "");
        const plan = buildSoftwareLinkPlan(slug);
        return new Set(plan ? flattenPlanLinks(plan).map((l) => l.href) : []);
      }
      if (p.startsWith("/categories/")) {
        const slug = p.replace(/^\/categories\/|\/$/g, "");
        const plan = buildCategoryLinkPlan(slug);
        return new Set(plan ? flattenPlanLinks(plan).map((l) => l.href) : []);
      }
      if (p.startsWith("/compare/")) {
        const slug = p.replace(/^\/compare\/|\/$/g, "");
        const plan = buildComparisonLinkPlan({
          comparisonSlug: slug,
          title: slug,
          productSlugs: slug.split("-vs-").filter(Boolean),
        });
        return new Set(flattenPlanLinks(plan).map((l) => l.href));
      }
    } catch {
      return new Set();
    }
    return new Set();
  });
}

function ensureTargetOutbound(
  plan: PageLinkingPlan,
): { method: "guide_overlay"; fromPath: string; toPath: string } | null {
  if (plan.kind !== "guide") return null;
  const guide = getGuides({ includeUnpublished: true }).find(
    (g) => g.slug === plan.slug,
  );
  if (!guide) return null;

  const needsNext =
    !guide.nextAction && plan.outboundNextSteps.length === 0 && plan.hubPath;
  if (!needsNext && guide.nextAction) return null;
  if (!needsNext && !plan.hubPath) return null;

  const existing = loadGuideEnrichmentOverlay(guide.slug);
  const enrichmentType =
    existing?.enrichmentType ?? classifyEnrichmentGuideType(guide);

  let nextAction = guide.nextAction ?? existing?.patch.nextAction;
  if (!nextAction && plan.hubPath) {
    const hubSlug = plan.hubPath.includes("/categories/")
      ? plan.hubPath.replace(/^\/categories\/|\/$/g, "").split("/")[0]
      : null;
    if (hubSlug) {
      nextAction = {
        contentId: `content:category:${hubSlug}`,
        label: "Back to category hub",
      };
    } else if (plan.outboundNextSteps[0]) {
      const href = plan.outboundNextSteps[0].href;
      if (href.startsWith("/guides/")) {
        nextAction = {
          contentId: `content:guide:${href.replace(/^\/guides\/|\/$/g, "")}`,
          label: plan.outboundNextSteps[0].label,
        };
      } else if (href.startsWith("/software/")) {
        nextAction = {
          contentId: `content:software:${href.replace(/^\/software\/|\/$/g, "")}`,
          label: plan.outboundNextSteps[0].label,
        };
      }
    }
  }

  if (!nextAction) return null;

  const overlay: GuideEnrichmentOverlay = {
    slug: guide.slug,
    enrichmentType,
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: existing?.uniqueValueAdded ?? [],
    notes: [
      ...(existing?.notes ?? []),
      "improve-linking: ensured outbound next step / hub path",
    ],
    patch: {
      ...(existing?.patch ?? {}),
      nextAction,
    },
  };
  saveGuideEnrichmentOverlay(overlay);
  return {
    method: "guide_overlay",
    fromPath: plan.path,
    toPath: plan.hubPath ?? plan.outboundNextSteps[0]?.href ?? plan.path,
  };
}

function applyGuideReferrer(
  opp: InboundOpportunity,
  batchId: string,
): { method: "guide_overlay"; fromPath: string; toPath: string } | null {
  if (!opp.fromPath.startsWith("/guides/")) return null;
  const fromSlug = opp.fromPath.replace(/^\/guides\/|\/$/g, "");
  const toSlug = opp.toPath.replace(/^\/guides\/|\/$/g, "");
  if (!fromSlug || !toSlug) return null;

  const fromGuide = getGuides({ includeUnpublished: true }).find(
    (g) => g.slug === fromSlug,
  );
  if (!fromGuide) return null;

  const existing = loadGuideEnrichmentOverlay(fromSlug);
  const related = new Set([
    ...(existing?.patch.relatedGuideSlugs ?? fromGuide.relatedGuideSlugs),
    toSlug,
  ]);

  const overlay: GuideEnrichmentOverlay = {
    slug: fromSlug,
    enrichmentType:
      existing?.enrichmentType ?? classifyEnrichmentGuideType(fromGuide),
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: existing?.uniqueValueAdded ?? [],
    notes: [
      ...(existing?.notes ?? []),
      `improve-linking ${batchId}: contextual related → ${toSlug}`,
    ],
    patch: {
      ...(existing?.patch ?? {}),
      relatedGuideSlugs: [...related].slice(0, 12),
    },
  };
  saveGuideEnrichmentOverlay(overlay);
  return {
    method: "guide_overlay",
    fromPath: opp.fromPath,
    toPath: opp.toPath,
  };
}

/**
 * Phase 2–3: apply selected inbound opportunities into content overlays /
 * link-injection store (contextual modules — not chrome dumps).
 */
export function applyBatchLinkingPlans(
  plans: PageLinkingPlan[],
  options: { batchId: string; dryRun?: boolean } = { batchId: "batch" },
): Array<{
  toPath: string;
  fromPath: string;
  method: "guide_overlay" | "link_injection";
}> {
  const applied: Array<{
    toPath: string;
    fromPath: string;
    method: "guide_overlay" | "link_injection";
  }> = [];
  if (options.dryRun) return applied;

  const injectionEdges = [];
  const naturalCache = new Map<string, Set<string>>();

  for (const plan of plans) {
    if (!plan.eligibility.eligible) continue;

    const outbound = ensureTargetOutbound(plan);
    if (outbound) {
      applied.push({
        toPath: outbound.toPath,
        fromPath: outbound.fromPath,
        method: "guide_overlay",
      });
    }

    for (const opp of plan.selected) {
      if (opp.alreadyLinked) continue;

      if (opp.fromPath.startsWith("/guides/") && opp.toPath.startsWith("/guides/")) {
        const r = applyGuideReferrer(opp, options.batchId);
        if (r) {
          applied.push(r);
          // Dual-write: orphan/outbound detectors must see the same edge
          // without relying solely on overlay merge in builders.
          injectionEdges.push({
            fromPath: identityPath(opp.fromPath),
            toPath: identityPath(opp.toPath),
            label:
              opp.toPath.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
              opp.toPath,
            module: moduleForTarget(opp.toPath),
            reason: `${opp.reason} (dual-write guide_overlay)`,
            batchId: options.batchId,
            requireIndexable: false,
            score: 92,
          });
        }
        continue;
      }

      const fromKey = identityPath(opp.fromPath);
      let natural = naturalCache.get(fromKey);
      if (!natural) {
        natural = naturalOutboundHrefs(opp.fromPath);
        naturalCache.set(fromKey, natural);
      }
      if (natural.has(identityPath(opp.toPath))) {
        // Already present in builder plan — do not inject a duplicate edge.
        continue;
      }

      injectionEdges.push({
        fromPath: identityPath(opp.fromPath),
        toPath: identityPath(opp.toPath),
        label: opp.fromTitle
          ? `${opp.toPath.split("/").filter(Boolean).pop()?.replace(/-/g, " ")}`
          : opp.toPath,
        module: moduleForTarget(opp.toPath),
        reason: opp.reason,
        batchId: options.batchId,
        requireIndexable: false,
        score: 90,
      });
      applied.push({
        fromPath: opp.fromPath,
        toPath: opp.toPath,
        method: "link_injection",
      });
    }
  }

  if (injectionEdges.length > 0) {
    for (const edge of injectionEdges) {
      const slug = edge.toPath.replace(/\/$/, "").split("/").pop() ?? "";
      const g = getGuides({ includeUnpublished: true }).find((x) => x.slug === slug);
      if (g) edge.label = g.title;
    }
    upsertLinkInjections(injectionEdges);
  }

  return applied;
}
