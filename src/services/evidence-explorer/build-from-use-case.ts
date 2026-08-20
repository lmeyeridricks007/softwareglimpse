import { mediaLimitations, mediaWhatThisShows, type ProductMedia } from "@/domain";
import {
  buildUseCaseEvidenceChain,
  USE_CASE_EVIDENCE_METHODOLOGY,
  type UseCaseEvidenceChainItem,
} from "@/services/use-case-evidence";
import type {
  EvidenceExplorerItem,
  EvidenceExplorerModel,
} from "@/services/evidence-explorer/types";

export type UseCaseEvidenceExplorerInput = {
  useCaseName: string;
  useCaseSlug: string;
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  screenshots: Array<{
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
  videos: ProductMedia[];
  /** Workflow steps with optional requirement/feature chain links. */
  workflowSteps?: Array<{
    id: string;
    name: string;
    requirements?: Array<{ id: string; label: string }>;
    features?: Array<{ id: string; label: string }>;
  }>;
  /** Extra dimensions (e.g. capabilities) merged into the filter list. */
  filterDimensions?: Array<{ id: string; name: string }>;
};

function chainItemToExplorer(
  item: UseCaseEvidenceChainItem,
  logo: { src: string; alt: string } | null | undefined,
  useCaseName: string,
): EvidenceExplorerItem {
  const dimensionIds = new Set<string>();
  const supportsLabels = new Set<string>([useCaseName]);

  for (const t of item.traces) {
    dimensionIds.add(`workflow:${t.workflowStepId}`);
    supportsLabels.add(t.workflowStepLabel);
    if (t.requirementId) {
      dimensionIds.add(`requirement:${t.requirementId}`);
      if (t.requirementLabel) supportsLabels.add(t.requirementLabel);
    }
    if (t.featureId) {
      dimensionIds.add(`feature:${t.featureId}`);
      if (t.featureLabel) supportsLabels.add(t.featureLabel);
    }
  }

  // Also retain media tags so filters work when page steps omit a tag.
  if (item.media) {
    for (const id of item.media.workflowStageIds) {
      dimensionIds.add(`workflow:${id}`);
    }
    for (const id of item.media.featureIds) {
      dimensionIds.add(`feature:${id}`);
    }
    for (const id of item.media.requirementIds) {
      dimensionIds.add(`requirement:${id}`);
    }
  }

  const primary = item.traces[0];
  const assessmentLabel =
    primary?.assessmentStatus === "supported"
      ? "Supported"
      : primary?.assessmentStatus === "partial"
        ? "Partial"
        : primary?.assessmentStatus === "not-supported"
          ? "Not supported"
          : null;

  return {
    id: item.id,
    kind: item.kind,
    productSlug: item.productSlug,
    productName: item.productName,
    logo: logo ?? null,
    title: item.title,
    supportsLabels: [...supportsLabels],
    demonstrates: item.demonstrates,
    doesNotEstablish: item.doesNotEstablish,
    dimensionIds: [...dimensionIds],
    verifiedAt: item.verifiedAt,
    sourceUrl: item.sourceUrl,
    sourceOrganization: item.sourceOrganization,
    media: item.media,
    screenshotSrc: item.screenshotSrc,
    screenshotAlt: item.screenshotAlt,
    suitability: item.suitability,
    suitabilityNote: item.suitabilityNote,
    assessmentLabel,
    traceTrail: primary
      ? [
          primary.useCaseName,
          primary.workflowStepLabel,
          primary.requirementLabel,
          primary.featureLabel,
          `${primary.productName}${assessmentLabel ? ` — ${assessmentLabel}` : ""}`,
        ].filter((x): x is string => Boolean(x))
      : undefined,
  };
}

/**
 * Build EvidenceExplorerModel for Use Case pages from the evidence chain.
 * Reuses ResearchMedia — no UseCaseVideo entity.
 * Filters: Workflow / Product / Requirement / Feature / Evidence type.
 */
export function buildUseCaseEvidenceExplorer(
  input: UseCaseEvidenceExplorerInput,
): EvidenceExplorerModel {
  const logoBySlug = new Map(
    input.products.map((p) => [p.slug, p.logo ?? null]),
  );

  const chain = buildUseCaseEvidenceChain({
    useCaseSlug: input.useCaseSlug,
    useCaseName: input.useCaseName,
    steps: (input.workflowSteps ?? []).map((s) => ({
      id: s.id,
      label: s.name,
      requirements: s.requirements,
      features: s.features,
    })),
    products: input.products.map((p) => ({ slug: p.slug, name: p.name })),
    videos: input.videos,
    screenshots: input.screenshots,
  });

  // When no workflow steps are provided, still surface videos (legacy callers).
  let items: EvidenceExplorerItem[];
  if (input.workflowSteps && input.workflowSteps.length > 0) {
    items = chain.flatItems.map((item) =>
      chainItemToExplorer(item, logoBySlug.get(item.productSlug), input.useCaseName),
    );
  } else {
    items = input.videos.map((video) => {
      const product = input.products.find((p) => p.slug === video.productSlug);
      const fallback = chainItemToExplorer(
        {
          id: `video:${video.id}`,
          kind: "official-video",
          title: video.title,
          productSlug: video.productSlug,
          productName: product?.name ?? video.productSlug,
          sourceOrganization:
            video.sourceOrganization ?? video.channelName ?? null,
          demonstrates: mediaWhatThisShows(video),
          doesNotEstablish: mediaLimitations(video),
          verifiedAt: video.verifiedAt?.slice(0, 10) ?? null,
          sourceUrl: video.sourceUrl,
          media: video,
          screenshotSrc: null,
          screenshotAlt: null,
          claimTypes: ["workflow-demo"],
          suitability: "supporting",
          suitabilityNote: USE_CASE_EVIDENCE_METHODOLOGY,
          traces: [],
        },
        logoBySlug.get(video.productSlug),
        input.useCaseName,
      );
      return {
        ...fallback,
        dimensionIds: [
          ...video.workflowStageIds.map((id) => `workflow:${id}`),
          ...video.featureIds.map((f) => `feature:${f}`),
          ...video.requirementIds.map((r) => `requirement:${r}`),
        ],
      };
    });
  }

  // Sort: never put video first by default — docs → screenshots → videos.
  items.sort((a, b) => {
    const kindOrder = { documentation: 0, screenshot: 1, "official-video": 2 };
    const kd = kindOrder[a.kind] - kindOrder[b.kind];
    if (kd !== 0) return kd;
    return (a.productName ?? "").localeCompare(b.productName ?? "");
  });

  const typeCounts = {
    all: items.length,
    documentation: items.filter((i) => i.kind === "documentation").length,
    screenshot: items.filter((i) => i.kind === "screenshot").length,
    "official-video": items.filter((i) => i.kind === "official-video").length,
  };

  const workflowFacets = (input.workflowSteps ?? []).map((s) => ({
    id: `workflow:${s.id}`,
    name: s.name,
  }));

  const requirementFacets = new Map<string, string>();
  const featureFacets = new Map<string, string>();
  for (const step of input.workflowSteps ?? []) {
    for (const r of step.requirements ?? []) {
      requirementFacets.set(`requirement:${r.id}`, r.label);
    }
    for (const f of step.features ?? []) {
      featureFacets.set(`feature:${f.id}`, f.label);
    }
  }
  // Include media-tagged requirement/feature ids not on the page steps.
  for (const item of items) {
    for (const id of item.dimensionIds) {
      if (id.startsWith("requirement:") && !requirementFacets.has(id)) {
        requirementFacets.set(
          id,
          id
            .replace("requirement:", "")
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" "),
        );
      }
      if (id.startsWith("feature:") && !featureFacets.has(id)) {
        featureFacets.set(
          id,
          id
            .replace("feature:", "")
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" "),
        );
      }
    }
  }

  const facets = {
    workflows: workflowFacets,
    requirements: [...requirementFacets.entries()].map(([id, name]) => ({
      id,
      name,
    })),
    features: [...featureFacets.entries()].map(([id, name]) => ({
      id,
      name,
    })),
  };

  const dimensions = [
    ...facets.workflows,
    ...facets.requirements,
    ...facets.features,
    ...(input.filterDimensions ?? []),
  ];

  return {
    heading: `Evidence for ${input.useCaseName}`,
    supporting:
      "Trace workflow assessments to documentation, screenshots, and official vendor videos. Evidence strength depends on claim type — video quantity does not change product fit or ranking.",
    methodology: USE_CASE_EVIDENCE_METHODOLOGY,
    subjectLabel: input.useCaseName,
    items,
    products: input.products.map((p) => ({ slug: p.slug, name: p.name })),
    dimensions,
    facets,
    typeCounts,
  };
}
