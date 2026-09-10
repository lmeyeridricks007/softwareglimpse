import {
  getAlternativesPageBySlug,
  getBestPageBySlug,
  getCapabilities,
  getCategoryBySlug,
  getComparisonBySlug,
  getIndustries,
  getSoftware,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import { loadReview } from "@/data/editorial/store";
import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import { getRoutableTools } from "@/data/config/tools/registry";
import { listIndustryHubProfiles } from "@/data/industry-hub";
import { listUseCaseHubProfiles } from "@/data/use-case-hub";
import { listCapabilityHubProfiles } from "@/data/capability-hub";
import { getCategoryHubProfile } from "@/data/category-hub";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { isProductExplainerGuide } from "@/services/seo/guides-index-worthiness/classify";
import { estimateGuideUniqueContentRatio } from "@/services/seo/guides-index-worthiness/uniqueness";
import {
  buildSoftwareLookup,
  hasIndexableRelationship,
  resolveComparisonRelationship,
} from "@/services/seo/compare-index-worthiness/relationship";
import {
  getLifecycleOverrideState,
  isLifecyclePromotedIndexable,
} from "@/services/seo/content-lifecycle/store";
import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";
import { resolveLifecycleState } from "@/services/seo/content-lifecycle/classify";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { snapshotFromGuide } from "../loaders/guides";
import { snapshotFromProductReview } from "../loaders/reviews";
import { snapshotFromComparison } from "../loaders/comparisons";
import { snapshotFromBestPage } from "../loaders/best";
import { snapshotFromHubProfile } from "../loaders/hubs";
import {
  comparisonPassesIndexGates,
  guidePassesIndexGates,
} from "./index-gates";
import { evaluateContentQualityGate } from "./evaluate";
import type { ContentQualityGateResult, GatePageType } from "./types";

function softLookup() {
  return buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
}

function lifecycleFor(
  kind: "guide" | "comparison",
  slug: string,
  gatesOk: boolean,
  seedIndexable: boolean,
): ContentLifecycleState {
  const promoted = isLifecyclePromotedIndexable(kind, slug);
  return resolveLifecycleState({
    legacyClassification: gatesOk ? "KEEP_INDEX" : "IMPROVE",
    qualityPasses: gatesOk,
    seedOrPromotedIndexable: seedIndexable || promoted,
    registryLifecycle: getLifecycleOverrideState(kind, slug),
  });
}

function wordCountFromSnapshot(snap: PageQualitySnapshot): number {
  return (
    snap.presentSections.length * 80 +
    snap.depthSignals.length * 40 +
    snap.decisionSupportSignals.length * 30
  );
}

export type AnalyzePageRef =
  | { pageType: "guide" | "product-explainer"; slug: string }
  | { pageType: "software"; slug: string }
  | { pageType: "comparison"; slug: string }
  | { pageType: "best"; slug: string }
  | { pageType: "alternatives"; slug: string }
  | { pageType: "category"; slug: string }
  | { pageType: "use-case"; slug: string }
  | { pageType: "industry"; slug: string }
  | { pageType: "capability"; slug: string }
  | { pageType: "tool-landing"; slug: string }
  | { pageType: "research"; slug: string };

/**
 * Resolve a live catalogue page into a Content Quality Gate result.
 */
export function analyzePageQualityGate(
  ref: AnalyzePageRef,
): ContentQualityGateResult | null {
  switch (ref.pageType) {
    case "guide":
    case "product-explainer": {
      const raw = getGuideBySlug(ref.slug, { includeUnpublished: true });
      if (!raw) return null;
      // Gate must evaluate the same merged entity the public route serves.
      const guide = mergeGuideWithOverlay(
        raw,
        loadGuideEnrichmentOverlay(ref.slug),
      );
      const explainer = isProductExplainerGuide(guide);
      const pageType: GatePageType = explainer
        ? "product-explainer"
        : "guide";
      const peers = getGuides({ includeUnpublished: true });
      const snap = snapshotFromGuide(guide);
      const gates = guidePassesIndexGates(guide, { peers });
      const uniq = estimateGuideUniqueContentRatio(guide);
      const life = lifecycleFor(
        "guide",
        guide.slug,
        gates.ok,
        guide.seo.indexable === true,
      );
      return evaluateContentQualityGate({
        pageType,
        path: `/guides/${guide.slug}/`,
        slug: guide.slug,
        title: guide.title,
        snapshot: snap,
        lifecycleState: life,
        typeIndexGatesOk: gates.ok,
        typeIndexGateDetail: gates.detail,
        wordCount: Math.max(
          wordCountFromSnapshot(snap),
          Math.round(uniq.ratio * 800),
        ),
        hardFailExtras: {
          lifecycleRetired: life === "RETIRED",
          canonicalOk: Boolean(guide.seo.canonicalPath),
          routeResolvable: true,
          emptyGenerated:
            (guide.blocks?.length ?? 0) === 0 &&
            (guide.sections?.length ?? 0) === 0,
        },
      });
    }
    case "software": {
      const soft = getSoftwareBySlug(ref.slug);
      if (!soft) return null;
      const review = loadReview(soft.slug);
      if (!review) {
        const snap: PageQualitySnapshot = {
          contentId: `software:${soft.slug}`,
          route: `/software/${soft.slug}/`,
          pageType: "product-review",
          title: soft.name,
          primaryIntent: "commercial",
          secondaryIntents: [],
          presentSections: soft.primaryCategorySlug ? ["verdict"] : [],
          missingSections: [
            "best-for",
            "criteria",
            "pricing",
            "evidence",
            "methodology",
          ],
          depthSignals: [],
          originalValueSignals: [],
          decisionSupportSignals: [],
          actionSignals: [],
          notes: ["no-approved-review"],
        };
        return evaluateContentQualityGate({
          pageType: "software",
          path: `/software/${soft.slug}/`,
          slug: soft.slug,
          title: soft.name,
          snapshot: snap,
          lifecycleState: soft.seo.indexable ? "INDEXABLE" : "IMPROVE",
          typeIndexGatesOk: Boolean(soft.name && soft.primaryCategorySlug),
          hardFailExtras: {
            routeResolvable: true,
            emptyGenerated: true,
          },
        });
      }
      const snap = snapshotFromProductReview(review);
      return evaluateContentQualityGate({
        pageType: "software",
        path: `/software/${soft.slug}/`,
        slug: soft.slug,
        title: soft.name,
        snapshot: snap,
        lifecycleState: soft.seo.indexable ? "INDEXABLE" : "IMPROVE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true, canonicalOk: true },
      });
    }
    case "comparison": {
      const raw = getComparisonBySlug(ref.slug);
      if (!raw) return null;
      const comparison = mergeComparisonWithOverlay(
        raw,
        loadCompareEnrichmentOverlay(ref.slug),
      );
      const soft = softLookup();
      const gates = comparisonPassesIndexGates(comparison, soft);
      const rel = resolveComparisonRelationship(comparison, soft);
      const snap = snapshotFromComparison(comparison);
      const life = lifecycleFor(
        "comparison",
        comparison.slug,
        gates.ok,
        comparison.seo.indexable === true,
      );
      return evaluateContentQualityGate({
        pageType: "comparison",
        path: `/compare/${comparison.slug}/`,
        slug: comparison.slug,
        title: comparison.title,
        snapshot: snap,
        lifecycleState: life,
        typeIndexGatesOk: gates.ok,
        typeIndexGateDetail: gates.detail,
        hardFailExtras: {
          lifecycleRetired: life === "RETIRED",
          invalidRelationship: !hasIndexableRelationship(rel.kind),
          routeResolvable: true,
          canonicalOk: Boolean(comparison.seo.canonicalPath),
        },
      });
    }
    case "best": {
      const page = getBestPageBySlug(ref.slug);
      if (!page) return null;
      const snap = snapshotFromBestPage(page);
      return evaluateContentQualityGate({
        pageType: "best",
        path: `/best/${page.slug}/`,
        slug: page.slug,
        title: page.title,
        snapshot: snap,
        lifecycleState: page.seo.indexable ? "INDEXABLE" : "IMPROVE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true, canonicalOk: true },
      });
    }
    case "alternatives": {
      const page = getAlternativesPageBySlug(ref.slug);
      if (!page) return null;
      const snap: PageQualitySnapshot = {
        contentId: `alternatives:${page.slug}`,
        route: `/alternatives/${page.slug}/`,
        pageType: "best",
        title: page.title,
        primaryIntent: "commercial",
        secondaryIntents: [],
        presentSections:
          page.alternatives.length >= 3
            ? ["recommendations", "methodology", "next-step"]
            : ["recommendations"],
        missingSections:
          page.alternatives.length >= 3 ? [] : ["methodology", "rationales"],
        depthSignals:
          page.alternatives.length >= 3
            ? ["surface:alternatives-table"]
            : [],
        originalValueSignals:
          page.alternatives.length >= 5 ? ["structured-alternatives"] : [],
        decisionSupportSignals:
          page.alternatives.length >= 3 ? ["alternative-shortlist"] : [],
        actionSignals: [],
        notes: [],
      };
      return evaluateContentQualityGate({
        pageType: "alternatives",
        path: `/alternatives/${page.slug}/`,
        slug: page.slug,
        title: page.title,
        snapshot: snap,
        lifecycleState: page.seo.indexable ? "INDEXABLE" : "IMPROVE",
        typeIndexGatesOk: page.alternatives.length >= 2,
        typeIndexGateDetail:
          page.alternatives.length >= 2
            ? []
            : ["insufficient-alternatives"],
        hardFailExtras: {
          routeResolvable: true,
          emptyGenerated: page.alternatives.length === 0,
        },
      });
    }
    case "category": {
      const cat = getCategoryBySlug(ref.slug);
      if (!cat) return null;
      const profile = getCategoryHubProfile(ref.slug);
      const hasHub =
        profile &&
        Boolean(
          profile.definition ||
            profile.buyingFramework?.length ||
            profile.decisionCriteria?.length ||
            profile.explorePaths?.length,
        );
      const presentSections = hasHub
        ? [
            ...(profile!.definition ? ["definition", "why-it-matters"] : []),
            ...((profile!.types?.length ?? 0) > 0 ? ["use-cases"] : []),
            ...((profile!.buyingFramework?.length ?? 0) > 0 ||
            (profile!.decisionCriteria?.length ?? 0) > 0
              ? ["evaluation-guidance"]
              : []),
            ...((profile!.explorePaths?.length ?? 0) > 0 ? ["next-step"] : []),
            ...((profile!.faq?.length ?? 0) > 0 ? ["faq"] : []),
            ...(profile!.pricingModel ? ["pricing"] : []),
          ]
        : cat.shortDescription || cat.description
          ? ["industry-priorities", "use-cases", "next-step"]
          : [];
      const snap: PageQualitySnapshot = {
        contentId: `category:${cat.slug}`,
        route: `/categories/${cat.path.join("/")}/`,
        pageType: "industry",
        title: profile?.displayName || cat.name,
        primaryIntent: "commercial",
        secondaryIntents: [],
        presentSections,
        missingSections: hasHub
          ? []
          : presentSections.length
            ? []
            : ["industry-priorities", "use-cases"],
        depthSignals: hasHub
          ? [
              "hub:category-profile",
              `criteria:${profile!.decisionCriteria?.length ?? 0}`,
              `paths:${profile!.explorePaths?.length ?? 0}`,
            ]
          : cat.shortDescription
            ? ["hub:category"]
            : [],
        originalValueSignals: hasHub
          ? [
              "category-hub-profile",
              ...(profile!.methodologyHref ? ["methodology-link"] : []),
              ...(profile!.buyingFramework?.length
                ? ["buying-framework"]
                : []),
            ]
          : cat.description
            ? ["category-description"]
            : [],
        decisionSupportSignals: hasHub
          ? [
              "hub",
              ...(profile!.finderHref ? ["finder"] : []),
              ...(profile!.chooseGuideHref ? ["choose-guide"] : []),
              ...(profile!.decisionCriteria?.length
                ? ["decision-criteria"]
                : []),
            ]
          : cat.pageIntent === "indexable"
            ? ["hub"]
            : [],
        actionSignals: profile?.finderHref
          ? ["finder-cta"]
          : profile?.chooseGuideHref
            ? ["guide-cta"]
            : [],
        notes: hasHub
          ? ["Scored from CategoryHubProfile + category seed"]
          : [],
      };
      return evaluateContentQualityGate({
        pageType: "category",
        path: `/categories/${cat.path.join("/")}/`,
        slug: cat.slug,
        title: snap.title,
        snapshot: snap,
        lifecycleState:
          cat.seo.indexable && cat.pageIntent !== "supported"
            ? "INDEXABLE"
            : "IMPROVE",
        typeIndexGatesOk: cat.pageIntent !== "supported",
        typeIndexGateDetail:
          cat.pageIntent === "supported"
            ? ["page-intent-supported-only"]
            : [],
        hardFailExtras: { routeResolvable: true },
      });
    }
    case "use-case": {
      const profile = listUseCaseHubProfiles().find(
        (p) => p.useCaseSlug === ref.slug,
      );
      const uc = getUseCases().find((u) => u.slug === ref.slug);
      if (!profile && !uc) return null;
      const title = profile?.displayTitle || uc?.name || ref.slug;
      const snap = profile
        ? snapshotFromHubProfile({
            pageType: "use-case",
            slug: profile.useCaseSlug,
            title,
            route: `/use-cases/${profile.useCaseSlug}/`,
            contentId: `use-case:${profile.useCaseSlug}`,
            profile,
            agentNote: "quality-gate",
          })
        : ({
            contentId: `use-case:${ref.slug}`,
            route: `/use-cases/${ref.slug}/`,
            pageType: "use-case",
            title,
            primaryIntent: "informational",
            secondaryIntents: [],
            presentSections: ["definition"],
            missingSections: ["workflow", "requirements"],
            depthSignals: [],
            originalValueSignals: [],
            decisionSupportSignals: [],
            actionSignals: [],
            notes: [],
          } satisfies PageQualitySnapshot);
      return evaluateContentQualityGate({
        pageType: "use-case",
        path: `/use-cases/${ref.slug}/`,
        slug: ref.slug,
        title: snap.title,
        snapshot: snap,
        lifecycleState: "IMPROVE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true },
      });
    }
    case "industry": {
      const profile = listIndustryHubProfiles().find(
        (p) => p.industrySlug === ref.slug,
      );
      const ind = getIndustries({ includeUnpublished: true }).find(
        (i) => i.slug === ref.slug,
      );
      if (!profile && !ind) return null;
      const title = profile?.displayTitle || ind?.name || ref.slug;
      const snap = profile
        ? snapshotFromHubProfile({
            pageType: "industry",
            slug: profile.industrySlug,
            title,
            route: `/industries/${profile.industrySlug}/`,
            contentId: `industry:${profile.industrySlug}`,
            profile,
            agentNote: "quality-gate",
          })
        : ({
            contentId: `industry:${ref.slug}`,
            route: `/industries/${ref.slug}/`,
            pageType: "industry",
            title,
            primaryIntent: "commercial",
            secondaryIntents: [],
            presentSections: ["industry-priorities"],
            missingSections: ["use-cases", "capabilities"],
            depthSignals: [],
            originalValueSignals: [],
            decisionSupportSignals: [],
            actionSignals: [],
            notes: [],
          } satisfies PageQualitySnapshot);
      return evaluateContentQualityGate({
        pageType: "industry",
        path: `/industries/${ref.slug}/`,
        slug: ref.slug,
        title: snap.title,
        snapshot: snap,
        lifecycleState: "IMPROVE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true },
      });
    }
    case "capability": {
      const profile = listCapabilityHubProfiles().find(
        (p) => p.capabilitySlug === ref.slug,
      );
      const cap = getCapabilities().find((c) => c.slug === ref.slug);
      if (!profile && !cap) return null;
      const title = profile?.displayTitle || cap?.name || ref.slug;
      const snap = profile
        ? snapshotFromHubProfile({
            pageType: "capability",
            slug: profile.capabilitySlug,
            title,
            route: `/capabilities/${profile.capabilitySlug}/`,
            contentId: `capability:${profile.capabilitySlug}`,
            profile,
            agentNote: "quality-gate",
          })
        : ({
            contentId: `capability:${ref.slug}`,
            route: `/capabilities/${ref.slug}/`,
            pageType: "capability",
            title,
            primaryIntent: "informational",
            secondaryIntents: [],
            presentSections: ["definition"],
            missingSections: ["related-features", "evaluation-guidance"],
            depthSignals: [],
            originalValueSignals: [],
            decisionSupportSignals: [],
            actionSignals: [],
            notes: [],
          } satisfies PageQualitySnapshot);
      return evaluateContentQualityGate({
        pageType: "capability",
        path: `/capabilities/${ref.slug}/`,
        slug: ref.slug,
        title: snap.title,
        snapshot: snap,
        lifecycleState: "IMPROVE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true },
      });
    }
    case "tool-landing": {
      const tool = getRoutableTools().find((t) => t.slug === ref.slug);
      if (!tool?.href) return null;
      const snap: PageQualitySnapshot = {
        contentId: `tool:${tool.slug}`,
        route: tool.href,
        pageType: "tool-landing",
        title: tool.name,
        primaryIntent: "commercial",
        secondaryIntents: [],
        presentSections: [
          "what-it-does",
          "who-its-for",
          "how-it-works",
          "tool-cta",
        ],
        missingSections: [],
        depthSignals: ["interactive-tool"],
        originalValueSignals: ["decision-tool"],
        decisionSupportSignals: ["finder-or-calculator"],
        actionSignals: ["run-tool"],
        notes: [],
      };
      return evaluateContentQualityGate({
        pageType: "tool-landing",
        path: tool.href,
        slug: tool.slug,
        title: tool.name,
        snapshot: snap,
        lifecycleState: "INDEXABLE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true, canonicalOk: true },
      });
    }
    case "research": {
      const snap: PageQualitySnapshot = {
        contentId: `research:${ref.slug}`,
        route: `/research/${ref.slug}/`,
        pageType: "guide",
        title: ref.slug.replace(/-/g, " "),
        primaryIntent: "informational",
        secondaryIntents: [],
        presentSections: ["quick-answer", "framework-or-steps", "sources"],
        missingSections: [],
        depthSignals: ["research:catalogue"],
        originalValueSignals: ["original-research"],
        decisionSupportSignals: ["benchmarks"],
        actionSignals: [],
        notes: ["research-landing"],
      };
      return evaluateContentQualityGate({
        pageType: "research",
        path: `/research/${ref.slug}/`,
        slug: ref.slug,
        title: snap.title,
        snapshot: snap,
        lifecycleState: "INDEXABLE",
        typeIndexGatesOk: true,
        hardFailExtras: { routeResolvable: true },
      });
    }
    default:
      return null;
  }
}
