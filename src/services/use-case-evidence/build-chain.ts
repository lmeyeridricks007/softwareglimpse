import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { resolveStepProductSupport } from "@/services/workflow-experience";
import type { WorkflowSupportStatus } from "@/services/workflow-experience";
import {
  claimTypeGuidance,
  claimTypesFromMediaKinds,
  evidenceSuitabilityForClaim,
  type EvidenceClaimType,
  type EvidenceSuitability,
} from "./claim-quality";

export type UseCaseEvidenceTrace = {
  useCaseSlug: string;
  useCaseName: string;
  workflowStepId: string;
  workflowStepLabel: string;
  requirementId: string | null;
  requirementLabel: string | null;
  featureId: string | null;
  featureLabel: string | null;
  productSlug: string;
  productName: string;
  assessmentStatus: WorkflowSupportStatus;
};

export type UseCaseEvidenceChainItem = {
  id: string;
  kind: "documentation" | "screenshot" | "official-video";
  title: string;
  productSlug: string;
  productName: string;
  sourceOrganization: string | null;
  demonstrates: string[];
  doesNotEstablish: string[];
  verifiedAt: string | null;
  sourceUrl: string | null;
  media: ProductMedia | null;
  screenshotSrc: string | null;
  screenshotAlt: string | null;
  claimTypes: EvidenceClaimType[];
  suitability: EvidenceSuitability;
  suitabilityNote: string;
  /** All workflow → requirement → feature → product paths this evidence supports. */
  traces: UseCaseEvidenceTrace[];
};

export type UseCaseEvidenceChainNode = {
  workflowStepId: string;
  workflowStepLabel: string;
  requirements: Array<{
    id: string;
    label: string;
    features: Array<{ id: string; label: string }>;
    products: Array<{
      productSlug: string;
      productName: string;
      assessmentStatus: WorkflowSupportStatus;
      evidence: UseCaseEvidenceChainItem[];
    }>;
  }>;
};

export type UseCaseEvidenceChainModel = {
  useCaseSlug: string;
  useCaseName: string;
  methodology: string;
  nodes: UseCaseEvidenceChainNode[];
  /** Deduped evidence records (one video = one item). */
  flatItems: UseCaseEvidenceChainItem[];
};

export const USE_CASE_EVIDENCE_METHODOLOGY =
  "SoftwareGlimpse evaluates how products support the requirements and features that make up each workflow. Official vendor demonstrations may be used to verify visible product behavior, but video availability does not influence product rankings.";

function labelFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function mediaMatchesStep(
  media: ProductMedia,
  stepId: string,
  stepLabel: string,
  featureIds: string[],
  requirementIds: string[],
): boolean {
  if (media.workflowStageIds.some((id) => id === stepId)) return true;
  if (featureIds.some((f) => media.featureIds.includes(f))) return true;
  if (requirementIds.some((r) => media.requirementIds.includes(r))) return true;
  // Map page requirement ids (e.g. auto-assign) to media requirement slugs
  // via loose keyword overlap on labels is handled by workflowStageIds above.
  const shows = mediaWhatThisShows(media).join(" ").toLowerCase();
  const label = stepLabel.toLowerCase();
  return label.length > 3 && shows.includes(label);
}

function mergeItem(
  map: Map<string, UseCaseEvidenceChainItem>,
  item: UseCaseEvidenceChainItem,
): UseCaseEvidenceChainItem {
  const existing = map.get(item.id);
  if (!existing) {
    map.set(item.id, item);
    return item;
  }
  existing.demonstrates = [
    ...new Set([...existing.demonstrates, ...item.demonstrates]),
  ];
  existing.doesNotEstablish = [
    ...new Set([...existing.doesNotEstablish, ...item.doesNotEstablish]),
  ];
  const seen = new Set(
    existing.traces.map(
      (t) =>
        `${t.workflowStepId}|${t.requirementId}|${t.featureId}|${t.productSlug}`,
    ),
  );
  for (const t of item.traces) {
    const key = `${t.workflowStepId}|${t.requirementId}|${t.featureId}|${t.productSlug}`;
    if (!seen.has(key)) {
      existing.traces.push(t);
      seen.add(key);
    }
  }
  return existing;
}

/**
 * Build traceable Use Case → Workflow → Requirement → Feature → Product → Evidence.
 * Video quantity never changes assessmentStatus (feature research only).
 */
export function buildUseCaseEvidenceChain(input: {
  useCaseSlug: string;
  useCaseName: string;
  steps: Array<{
    id: string;
    label: string;
    requirements?: Array<{ id: string; label: string }>;
    features?: Array<{ id: string; label: string }>;
  }>;
  products: Array<{ slug: string; name: string }>;
  videos: ProductMedia[];
  screenshots?: Array<{
    id: string;
    productSlug: string;
    productName: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
    checkedAt?: string;
    workflowStepId?: string;
    featureId?: string;
  }>;
}): UseCaseEvidenceChainModel {
  const nodes: UseCaseEvidenceChainNode[] = [];
  const flatById = new Map<string, UseCaseEvidenceChainItem>();

  for (const step of input.steps) {
    const requirements =
      step.requirements && step.requirements.length > 0
        ? step.requirements
        : [
            {
              id: `${step.id}-requirement`,
              label: `${step.label} requirements`,
            },
          ];
    const features = step.features ?? [];
    const featureIds = features.map((f) => f.id);
    const requirementIds = requirements.map((r) => r.id);

    const reqNodes: UseCaseEvidenceChainNode["requirements"] = [];

    for (const req of requirements) {
      const productNodes: UseCaseEvidenceChainNode["requirements"][0]["products"] =
        [];

      for (const product of input.products) {
        const assessmentStatus = resolveStepProductSupport({
          featureIds,
          productSlug: product.slug,
        });

        const evidenceRefs: UseCaseEvidenceChainItem[] = [];
        const enrichment = loadEnrichment(product.slug);

        for (const feature of features) {
          const row = enrichment?.featureSupport.find(
            (f) => f.featureSlug === feature.id,
          );
          if (!row || row.sourceIds.length === 0) continue;
          const claimTypes: EvidenceClaimType[] = [
            "feature-existence",
            ...(row.availability === "higher-plan-only"
              ? (["plan-availability"] as EvidenceClaimType[])
              : []),
          ];
          const primary = claimTypes[0]!;
          const item = mergeItem(flatById, {
            id: `doc:${product.slug}:${feature.id}:${row.sourceIds[0]}`,
            kind: "documentation",
            title: `Official documentation — ${feature.label}`,
            productSlug: product.slug,
            productName: product.name,
            sourceOrganization: `Official ${product.name}`,
            demonstrates: [
              `${feature.label}: ${row.availability}`,
              ...(row.planSlugs[0]
                ? [`Referenced plans include ${row.planSlugs[0]}`]
                : []),
            ],
            doesNotEstablish: [
              "comparative superiority",
              "implementation effort",
            ],
            verifiedAt: null,
            sourceUrl: null,
            media: null,
            screenshotSrc: null,
            screenshotAlt: null,
            claimTypes,
            suitability: evidenceSuitabilityForClaim(
              primary,
              "documentation",
            ),
            suitabilityNote: claimTypeGuidance(primary),
            traces: [
              {
                useCaseSlug: input.useCaseSlug,
                useCaseName: input.useCaseName,
                workflowStepId: step.id,
                workflowStepLabel: step.label,
                requirementId: req.id,
                requirementLabel: req.label,
                featureId: feature.id,
                featureLabel: feature.label,
                productSlug: product.slug,
                productName: product.name,
                assessmentStatus,
              },
            ],
          });
          if (!evidenceRefs.find((e) => e.id === item.id)) {
            evidenceRefs.push(item);
          }
        }

        for (const video of input.videos) {
          if (video.productSlug !== product.slug) continue;
          if (
            !mediaMatchesStep(
              video,
              step.id,
              step.label,
              featureIds,
              requirementIds,
            )
          ) {
            continue;
          }
          // Prefer media requirement tags that match page requirement slug/id loosely
          const claimTypes = claimTypesFromMediaKinds(
            video.evidenceClaimKinds ?? [],
          );
          const primary = claimTypes[0] ?? "workflow-demo";
          const linkedFeature =
            features.find((f) => video.featureIds.includes(f.id)) ??
            features[0] ??
            null;
          const item = mergeItem(flatById, {
            id: `video:${video.id}`,
            kind: "official-video",
            title: video.title,
            productSlug: product.slug,
            productName: product.name,
            sourceOrganization:
              video.sourceOrganization?.trim() ||
              video.channelName?.trim() ||
              `Official ${product.name}`,
            demonstrates: mediaWhatThisShows(video),
            doesNotEstablish: mediaLimitations(video),
            verifiedAt: video.verifiedAt?.slice(0, 10) ?? null,
            sourceUrl: video.sourceUrl,
            media: video,
            screenshotSrc: null,
            screenshotAlt: null,
            claimTypes,
            suitability: evidenceSuitabilityForClaim(
              primary,
              "official-video",
            ),
            suitabilityNote: claimTypeGuidance(primary),
            traces: [
              {
                useCaseSlug: input.useCaseSlug,
                useCaseName: input.useCaseName,
                workflowStepId: step.id,
                workflowStepLabel: step.label,
                requirementId: req.id,
                requirementLabel: req.label,
                featureId: linkedFeature?.id ?? null,
                featureLabel: linkedFeature?.label ?? null,
                productSlug: product.slug,
                productName: product.name,
                assessmentStatus,
              },
            ],
          });
          if (!evidenceRefs.find((e) => e.id === item.id)) {
            evidenceRefs.push(item);
          }
        }

        for (const shot of input.screenshots ?? []) {
          if (shot.productSlug !== product.slug) continue;
          if (shot.workflowStepId && shot.workflowStepId !== step.id) continue;
          if (
            shot.featureId &&
            featureIds.length > 0 &&
            !featureIds.includes(shot.featureId)
          ) {
            continue;
          }
          if (!shot.workflowStepId && !shot.featureId && featureIds.length > 0) {
            continue;
          }
          const item = mergeItem(flatById, {
            id: `shot:${shot.productSlug}:${shot.id}`,
            kind: "screenshot",
            title: shot.caption || shot.alt,
            productSlug: product.slug,
            productName: product.name,
            sourceOrganization: `Official ${product.name}`,
            demonstrates: shot.caption ? [shot.caption] : [shot.alt],
            doesNotEstablish: [
              "plan limits",
              "pricing",
              "comparative superiority",
            ],
            verifiedAt: shot.checkedAt?.slice(0, 10) ?? null,
            sourceUrl: shot.source ?? null,
            media: null,
            screenshotSrc: shot.src,
            screenshotAlt: shot.alt,
            claimTypes: ["ui-behavior"],
            suitability: evidenceSuitabilityForClaim(
              "ui-behavior",
              "screenshot",
            ),
            suitabilityNote: claimTypeGuidance("ui-behavior"),
            traces: [
              {
                useCaseSlug: input.useCaseSlug,
                useCaseName: input.useCaseName,
                workflowStepId: step.id,
                workflowStepLabel: step.label,
                requirementId: req.id,
                requirementLabel: req.label,
                featureId: shot.featureId ?? features[0]?.id ?? null,
                featureLabel: shot.featureId
                  ? labelFromSlug(shot.featureId)
                  : (features[0]?.label ?? null),
                productSlug: product.slug,
                productName: product.name,
                assessmentStatus,
              },
            ],
          });
          if (!evidenceRefs.find((e) => e.id === item.id)) {
            evidenceRefs.push(item);
          }
        }

        productNodes.push({
          productSlug: product.slug,
          productName: product.name,
          assessmentStatus,
          evidence: evidenceRefs,
        });
      }

      reqNodes.push({
        id: req.id,
        label: req.label,
        features,
        products: productNodes,
      });
    }

    nodes.push({
      workflowStepId: step.id,
      workflowStepLabel: step.label,
      requirements: reqNodes,
    });
  }

  return {
    useCaseSlug: input.useCaseSlug,
    useCaseName: input.useCaseName,
    methodology: USE_CASE_EVIDENCE_METHODOLOGY,
    nodes,
    flatItems: [...flatById.values()],
  };
}

/** Find evidence that completes workflow → requirement → product → video. */
export function findWorkflowRequirementVideoTrace(
  model: UseCaseEvidenceChainModel,
  input: {
    workflowStepId: string;
    requirementId?: string;
    productSlug: string;
  },
): UseCaseEvidenceChainItem | null {
  return (
    model.flatItems.find(
      (item) =>
        item.kind === "official-video" &&
        item.productSlug === input.productSlug &&
        item.traces.some(
          (t) =>
            t.workflowStepId === input.workflowStepId &&
            (!input.requirementId || t.requirementId === input.requirementId),
        ),
    ) ?? null
  );
}
