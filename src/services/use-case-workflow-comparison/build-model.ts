import type { ProductMedia } from "@/domain";
import {
  mediaLimitations,
  mediaWhatThisShows,
} from "@/domain";
import {
  getAllComparisonsUnfiltered,
} from "@/data";
import {
  loadAssessment,
} from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import {
  resolveStepProductSupport,
  type WorkflowSupportStatus,
} from "@/services/workflow-experience";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";
import { selectUseCaseDeepDiveVideo } from "@/services/product-media/use-case-page-media";
import { selectDefaultComparePair } from "./pair-client";
import {
  pairAnalysisKey,
  type UseCaseWorkflowProductCompareModel,
  type WorkflowCompareMedia,
  type WorkflowComparePlanDiff,
  type WorkflowCompareProduct,
  type WorkflowCompareRequirementDiff,
  type WorkflowPairAnalysis,
} from "./types";

export type {
  UseCaseWorkflowProductCompareModel,
  WorkflowCompareMedia,
  WorkflowComparePlanDiff,
  WorkflowCompareProduct,
  WorkflowCompareRequirementDiff,
  WorkflowPairAnalysis,
} from "./types";


function supportDetail(
  status: WorkflowSupportStatus,
  featureIds: string[],
  productSlug: string,
): string {
  if (status === "unknown") return "Not assessed for these features yet";
  if (status === "not-supported") return "Not supported in researched plans";
  const enrichment = loadEnrichment(productSlug);
  const rows = (enrichment?.featureSupport ?? []).filter((f) =>
    featureIds.includes(f.featureSlug),
  );
  if (status === "partial") {
    const gated = rows.find((r) => r.availability === "higher-plan-only");
    if (gated?.planSlugs[0]) {
      return `Limited / higher-plan (${gated.planSlugs[0]})`;
    }
    return "Limited or plan-gated support";
  }
  const plans = rows.find((r) => r.planSlugs.length > 0)?.planSlugs;
  if (plans?.[0]) return `Supported (from ${plans[0]})`;
  return "Supported";
}

function planLabelForFeature(
  productSlug: string,
  featureId: string,
): string | null {
  const enrichment = loadEnrichment(productSlug);
  const row = enrichment?.featureSupport.find(
    (f) => f.featureSlug === featureId,
  );
  if (!row) return null;
  if (row.availability === "higher-plan-only" && row.planSlugs[0]) {
    return `Higher plan: ${row.planSlugs[0]}`;
  }
  if (row.availability === "add-on") return "Add-on";
  if (row.availability === "supported" && row.planSlugs[0]) {
    return `Included from ${row.planSlugs[0]}`;
  }
  if (row.availability === "supported") return "Included (plan verified)";
  if (row.availability === "not-supported") return "Not available";
  return null;
}

/**
 * Prefer products with enrichment/feature research — never video counts.
 * Re-exported from pair-client for server call sites.
 */
export { selectDefaultComparePair } from "./pair-client";

function pickScreenshot(input: {
  productSlug: string;
  productName: string;
  screenshots: Array<{
    productSlug: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
  }>;
}): WorkflowCompareMedia | null {
  const shot = input.screenshots.find((s) => s.productSlug === input.productSlug);
  if (!shot) return null;
  return {
    kind: "screenshot",
    src: shot.src,
    alt: shot.alt,
    caption: shot.caption,
    title: shot.caption || shot.alt,
    whatToNotice: [
      shot.caption || "UI layout for this workflow surface",
      "Where ownership and next actions appear",
    ],
    notShown: [
      "plan packaging",
      "comparative superiority",
      "full workflow automation limits",
    ],
    sourceUrl: shot.source ?? null,
    sourceOrganization: `Official ${input.productName} (screenshot)`,
  };
}

function pickVideoMedia(
  media: ProductMedia,
  productName: string,
): WorkflowCompareMedia {
  const enriched = enrichMediaFromSourceUrl(media);
  return {
    kind: "official-video",
    media: enriched,
    title: enriched.title,
    whatToNotice:
      enriched.whatToNotice.length > 0
        ? enriched.whatToNotice
        : [
            "how many screens are needed for the core record",
            "whether ownership is obvious",
            "where follow-up actions are surfaced",
          ],
    notShown: mediaLimitations(enriched),
    sourceUrl: enriched.sourceUrl,
    sourceOrganization:
      enriched.sourceOrganization?.trim() ||
      enriched.channelName?.trim() ||
      `Official ${productName}`,
  };
}

export function resolveCompareHref(
  leftSlug: string,
  rightSlug: string,
  useCaseSlug?: string,
): string {
  const comparisons = getAllComparisonsUnfiltered();
  const match = comparisons.find(
    (c) =>
      c.productSlugs.includes(leftSlug) &&
      c.productSlugs.includes(rightSlug),
  );
  const base = match
    ? `/compare/${match.slug}/`
    : `/compare/${leftSlug}-vs-${rightSlug}/`;
  if (!useCaseSlug) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}useCase=${encodeURIComponent(useCaseSlug)}`;
}

/**
 * Build interactive workflow product comparison for Use Case Detail.
 */
export function buildUseCaseWorkflowProductCompare(input: {
  useCaseSlug: string;
  useCaseLabel: string;
  steps: Array<{
    id: string;
    label: string;
    features?: Array<{ id: string; label: string }>;
    requirements?: Array<{ id: string; label: string }>;
  }>;
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  mediaPool: ProductMedia[];
  screenshots?: Array<{
    productSlug: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
  }>;
  mediaCtx: {
    useCaseSlug: string;
    useCaseAliases?: string[];
    workflowStepIds?: string[];
    featureIds?: string[];
    capabilityIds?: string[];
    requirementIds?: string[];
  };
}): UseCaseWorkflowProductCompareModel | null {
  if (input.products.length < 2 || input.steps.length === 0) return null;

  const steps = input.steps.map((s) => ({
    id: s.id,
    label: s.label,
    featureIds: (s.features ?? []).map((f) => f.id),
    requirementIds: (s.requirements ?? []).map((r) => r.id),
    requirementLabels: (s.requirements ?? []).map((r) => r.label),
  }));

  const products: WorkflowCompareProduct[] = input.products.map((product) => {
    const enrichment = loadEnrichment(product.slug);
    const assessment = loadAssessment(product.slug);
    const researched = Boolean(enrichment?.featureSupport?.length);

    const stepSupport: Record<string, WorkflowSupportStatus> = {};
    for (const step of steps) {
      stepSupport[step.id] = resolveStepProductSupport({
        featureIds: step.featureIds,
        productSlug: product.slug,
      });
    }

    const video = selectUseCaseDeepDiveVideo(
      input.mediaPool.filter((m) => m.productSlug === product.slug),
      { ...input.mediaCtx, productSlug: product.slug },
      { requireStrongMatch: true },
    );
    const eligibleVideo =
      video &&
      isVideoPublicEligible(video).eligible &&
      isMediaActivePublicDisplay(video)
        ? video
        : null;

    const media =
      (eligibleVideo
        ? pickVideoMedia(eligibleVideo, product.name)
        : null) ??
      pickScreenshot({
        productSlug: product.slug,
        productName: product.name,
        screenshots: input.screenshots ?? [],
      });

    const researchNotes = [
      ...(assessment?.strengths ?? [])
        .map((s) => (typeof s === "string" ? s : String(s)))
        .slice(0, 4),
      ...(assessment?.limitations ?? [])
        .map((s) => (typeof s === "string" ? s : String(s)))
        .slice(0, 2)
        .map((l) => `Limitation: ${l}`),
    ].filter(Boolean);

    return {
      slug: product.slug,
      name: product.name,
      logo: product.logo,
      media,
      stepSupport,
      researchNotes,
      researched,
    };
  });

  const [defaultLeftSlug, defaultRightSlug] =
    selectDefaultComparePair(products);

  const comparableRequirements: UseCaseWorkflowProductCompareModel["comparableRequirements"] =
    [];
  const seen = new Set<string>();
  for (const step of input.steps) {
    for (const req of step.requirements ?? []) {
      if (seen.has(req.id)) continue;
      seen.add(req.id);
      comparableRequirements.push({
        id: req.id,
        label: req.label,
        featureIds: (step.features ?? []).map((f) => f.id),
      });
    }
    for (const feature of step.features ?? []) {
      const id = `feature:${feature.id}`;
      if (seen.has(id)) continue;
      seen.add(id);
      comparableRequirements.push({
        id,
        label: feature.label,
        featureIds: [feature.id],
      });
    }
  }

  const draft: UseCaseWorkflowProductCompareModel = {
    useCaseSlug: input.useCaseSlug,
    useCaseLabel: input.useCaseLabel,
    heading: `Compare how products handle ${input.useCaseLabel.toLowerCase()}`,
    supporting:
      "Compare two products against the same workflow using researched assessments. Official demos help you see the workflow — they do not change support status.",
    steps,
    products,
    defaultLeftSlug,
    defaultRightSlug,
    comparableRequirements,
    pairAnalyses: {},
  };

  const pairAnalyses: Record<string, WorkflowPairAnalysis> = {};
  for (const left of products) {
    for (const right of products) {
      if (left.slug === right.slug) continue;
      const analysis = computePairAnalysis(draft, left.slug, right.slug);
      if (analysis) {
        pairAnalyses[pairAnalysisKey(left.slug, right.slug)] = analysis;
      }
    }
  }

  return { ...draft, pairAnalyses };
}

/** Server-only pair builder (uses research store). Prefer model.pairAnalyses on the client. */
export function computePairAnalysis(
  model: UseCaseWorkflowProductCompareModel,
  leftSlug: string,
  rightSlug: string,
): WorkflowPairAnalysis | null {
  const left = model.products.find((p) => p.slug === leftSlug);
  const right = model.products.find((p) => p.slug === rightSlug);
  if (!left || !right) return null;

  const matrix = model.steps.map((step) => ({
    stepId: step.id,
    label: step.label,
    left: left.stepSupport[step.id] ?? "unknown",
    right: right.stepSupport[step.id] ?? "unknown",
  }));

  const whereLeftDiffers: string[] = [];
  const whereRightDiffers: string[] = [];
  for (const row of matrix) {
    if (row.left === row.right) continue;
    if (row.left === "supported" && row.right !== "supported") {
      whereLeftDiffers.push(
        `${row.label}: researched as ${row.left.replace("-", " ")} vs ${row.right.replace("-", " ")} for ${right.name}`,
      );
    }
    if (row.right === "supported" && row.left !== "supported") {
      whereRightDiffers.push(
        `${row.label}: researched as ${row.right.replace("-", " ")} vs ${row.left.replace("-", " ")} for ${left.name}`,
      );
    }
    if (
      row.left === "partial" &&
      (row.right === "unknown" || row.right === "not-supported")
    ) {
      whereLeftDiffers.push(
        `${row.label}: partial / plan-gated support researched for ${left.name}`,
      );
    }
    if (
      row.right === "partial" &&
      (row.left === "unknown" || row.left === "not-supported")
    ) {
      whereRightDiffers.push(
        `${row.label}: partial / plan-gated support researched for ${right.name}`,
      );
    }
  }

  // Cap bullets; keep evidence-backed only.
  const requirementDiffs: WorkflowCompareRequirementDiff[] = [];
  for (const req of model.comparableRequirements) {
    const leftStatus = resolveStepProductSupport({
      featureIds: req.featureIds,
      productSlug: left.slug,
    });
    const rightStatus = resolveStepProductSupport({
      featureIds: req.featureIds,
      productSlug: right.slug,
    });
    if (leftStatus === rightStatus) continue;
    if (leftStatus === "unknown" && rightStatus === "unknown") continue;
    requirementDiffs.push({
      id: req.id,
      label: req.label,
      leftStatus,
      rightStatus,
      leftDetail: supportDetail(leftStatus, req.featureIds, left.slug),
      rightDetail: supportDetail(rightStatus, req.featureIds, right.slug),
    });
  }

  const planDiffs: WorkflowComparePlanDiff[] = [];
  const planSeen = new Set<string>();
  for (const step of model.steps) {
    for (const featureId of step.featureIds) {
      if (planSeen.has(featureId)) continue;
      const leftPlan = planLabelForFeature(left.slug, featureId);
      const rightPlan = planLabelForFeature(right.slug, featureId);
      if (!leftPlan && !rightPlan) continue;
      if (leftPlan === rightPlan) continue;
      // Only surface when at least one side is plan-gated or differs meaningfully.
      const leftRow = loadEnrichment(left.slug)?.featureSupport.find(
        (f) => f.featureSlug === featureId,
      );
      const rightRow = loadEnrichment(right.slug)?.featureSupport.find(
        (f) => f.featureSlug === featureId,
      );
      const gated =
        leftRow?.availability === "higher-plan-only" ||
        rightRow?.availability === "higher-plan-only" ||
        leftRow?.availability === "add-on" ||
        rightRow?.availability === "add-on";
      if (!gated && leftPlan && rightPlan) {
        // Still show if entry plan slug differs.
        if (
          leftRow?.planSlugs[0] &&
          rightRow?.planSlugs[0] &&
          leftRow.planSlugs[0] === rightRow.planSlugs[0]
        ) {
          continue;
        }
      }
      planSeen.add(featureId);
      planDiffs.push({
        id: featureId,
        label: featureId
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" "),
        left: leftPlan,
        right: rightPlan,
        evidenceNote:
          "From ProductResearchEnrichment.featureSupport planSlugs / availability",
      });
    }
  }

  return {
    left,
    right,
    matrix,
    whereLeftDiffers: whereLeftDiffers.slice(0, 5),
    whereRightDiffers: whereRightDiffers.slice(0, 5),
    requirementDiffs: requirementDiffs.slice(0, 8),
    planDiffs: planDiffs.slice(0, 6),
    compareHref: resolveCompareHref(left.slug, right.slug, model.useCaseSlug),
  };
}
