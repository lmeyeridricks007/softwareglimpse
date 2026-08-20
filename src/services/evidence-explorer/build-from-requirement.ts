import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import type { ProductMedia } from "@/domain";
import type {
  EvidenceExplorerItem,
  EvidenceExplorerModel,
} from "@/services/evidence-explorer/types";

export const REQUIREMENT_EVIDENCE_METHODOLOGY =
  "SoftwareGlimpse assesses whether products satisfy a requirement by evaluating the specific criteria and features needed to meet that buyer need. Official vendor demonstrations may be used as evidence of visible product behavior, but video availability does not influence product ranking and videos are not used alone to establish pricing, plan entitlement, security or comparative superiority.";

export type RequirementEvidenceExplorerInput = {
  requirementName: string;
  requirementSlug: string;
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  criteria: Array<{ id: string; name: string; featureSlugs?: string[] }>;
  features: Array<{ id: string; name: string }>;
  screenshots: Array<{
    id: string;
    productSlug: string;
    productName: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
    checkedAt?: string;
  }>;
  videos: ProductMedia[];
  /** Documentation stubs from featureSupport sourceIds. */
  documentation?: Array<{
    id: string;
    productSlug: string;
    productName: string;
    title: string;
    featureId?: string;
    criterionIds?: string[];
    sourceUrl?: string | null;
  }>;
};

/**
 * EvidenceExplorer for Requirement Detail — primary grouping by criterion.
 * Reuses ResearchMedia; no RequirementVideo entity.
 */
export function buildRequirementEvidenceExplorer(
  input: RequirementEvidenceExplorerInput,
): EvidenceExplorerModel {
  const itemsById = new Map<string, EvidenceExplorerItem>();
  const logoBySlug = new Map(
    input.products.map((p) => [p.slug, p.logo ?? null]),
  );
  const criterionName = new Map(input.criteria.map((c) => [c.id, c.name]));
  const featureName = new Map(input.features.map((f) => [f.id, f.name]));

  function upsert(item: EvidenceExplorerItem) {
    const existing = itemsById.get(item.id);
    if (!existing) {
      itemsById.set(item.id, item);
      return;
    }
    existing.dimensionIds = [
      ...new Set([...existing.dimensionIds, ...item.dimensionIds]),
    ];
    existing.supportsLabels = [
      ...new Set([...existing.supportsLabels, ...item.supportsLabels]),
    ];
    existing.demonstrates = [
      ...new Set([...existing.demonstrates, ...item.demonstrates]),
    ];
    if (item.doesNotEstablish?.length) {
      existing.doesNotEstablish = [
        ...new Set([
          ...(existing.doesNotEstablish ?? []),
          ...item.doesNotEstablish,
        ]),
      ];
    }
  }

  for (const doc of input.documentation ?? []) {
    const dims = [
      ...(doc.criterionIds ?? []).map((id) => `criterion:${id}`),
      ...(doc.featureId ? [`feature:${doc.featureId}`] : []),
    ];
    const labels = [
      input.requirementName,
      ...(doc.criterionIds ?? []).map(
        (id) => criterionName.get(id) ?? id,
      ),
      ...(doc.featureId
        ? [featureName.get(doc.featureId) ?? doc.featureId]
        : []),
    ];
    upsert({
      id: doc.id,
      kind: "documentation",
      productSlug: doc.productSlug,
      productName: doc.productName,
      logo: logoBySlug.get(doc.productSlug),
      title: doc.title,
      supportsLabels: labels,
      demonstrates: [doc.title],
      doesNotEstablish: [
        "comparative superiority",
        "implementation effort",
      ],
      dimensionIds: dims,
      verifiedAt: null,
      sourceUrl: doc.sourceUrl ?? null,
      sourceOrganization: `Official ${doc.productName}`,
      media: null,
      screenshotSrc: null,
      screenshotAlt: null,
      suitability: "strong",
      suitabilityNote:
        "Official documentation is preferred for feature existence and plan packaging claims.",
    });
  }

  for (const shot of input.screenshots) {
    upsert({
      id: `shot:${shot.productSlug}:${shot.id}`,
      kind: "screenshot",
      productSlug: shot.productSlug,
      productName: shot.productName,
      logo: logoBySlug.get(shot.productSlug),
      title: shot.caption || shot.alt,
      supportsLabels: [input.requirementName],
      demonstrates: shot.caption ? [shot.caption] : [shot.alt],
      doesNotEstablish: ["pricing", "plan entitlement", "comparative superiority"],
      dimensionIds: [],
      verifiedAt: shot.checkedAt?.slice(0, 10) ?? null,
      sourceUrl: shot.source ?? null,
      sourceOrganization: `Official ${shot.productName}`,
      media: null,
      screenshotSrc: shot.src,
      screenshotAlt: shot.alt,
      suitability: "strong",
      suitabilityNote: "Screenshots can be strong evidence for visible UI behavior.",
    });
  }

  for (const video of input.videos) {
    const product = input.products.find((p) => p.slug === video.productSlug);
    const criterionDims = (video.requirementCriterionIds ?? []).map(
      (id) => `criterion:${id}`,
    );
    const featureDims = video.featureIds.map((f) => `feature:${f}`);
    const labels = [
      input.requirementName,
      ...(video.requirementCriterionIds ?? []).map(
        (id) => criterionName.get(id) ?? id,
      ),
      ...video.featureIds.map((f) => featureName.get(f) ?? f),
    ];
    const primaryCriterion = video.requirementCriterionIds?.[0];
    upsert({
      id: `video:${video.id}`,
      kind: "official-video",
      productSlug: video.productSlug,
      productName: product?.name ?? video.productSlug,
      logo: logoBySlug.get(video.productSlug),
      title: video.title,
      supportsLabels: [...new Set(labels)],
      demonstrates: mediaWhatThisShows(video),
      doesNotEstablish: mediaLimitations(video),
      dimensionIds: [
        ...criterionDims,
        ...featureDims,
        `requirement:${input.requirementSlug}`,
      ],
      verifiedAt: video.verifiedAt?.slice(0, 10) ?? null,
      sourceUrl: video.sourceUrl,
      sourceOrganization:
        video.sourceOrganization ?? video.channelName ?? null,
      media: video,
      screenshotSrc: null,
      screenshotAlt: null,
      suitability: "supporting",
      suitabilityNote:
        "Official video may support visible behavior for mapped criteria only — not pricing, plan entitlement, or full requirement support.",
      traceTrail: primaryCriterion
        ? [
            input.requirementName,
            criterionName.get(primaryCriterion) ?? primaryCriterion,
            product?.name ?? video.productSlug,
          ]
        : [input.requirementName, product?.name ?? video.productSlug],
    });
  }

  const items = [...itemsById.values()].sort((a, b) => {
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

  const criterionFacets = input.criteria.map((c) => ({
    id: `criterion:${c.id}`,
    name: c.name,
  }));
  const featureFacets = input.features.map((f) => ({
    id: `feature:${f.id}`,
    name: f.name,
  }));

  return {
    heading: `Evidence for ${input.requirementName}`,
    supporting:
      "Browse documentation, screenshots, and official vendor videos by requirement criterion and feature. Video quantity does not change product fit.",
    methodology: REQUIREMENT_EVIDENCE_METHODOLOGY,
    subjectLabel: input.requirementName,
    items,
    products: input.products.map((p) => ({ slug: p.slug, name: p.name })),
    dimensions: [...criterionFacets, ...featureFacets],
    facets: {
      workflows: [],
      requirements: criterionFacets,
      features: featureFacets,
    },
    typeCounts,
  };
}
