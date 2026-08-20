import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import type { ProductMedia } from "@/domain";
import {
  resolveIndustryMediaContext,
  industryMediaContextLabel,
} from "@/services/product-media/industry-page-media";
import type {
  EvidenceExplorerItem,
  EvidenceExplorerModel,
} from "@/services/evidence-explorer/types";

export const INDUSTRY_EVIDENCE_METHODOLOGY =
  "Official videos illustrate industry workflow context. They do not determine product rankings, industry fit scores, regulatory compliance, security suitability, or pricing. Prefer documentation, structured assessments, and authoritative trust sources for those claims.";

export type IndustryEvidenceExplorerInput = {
  industryName: string;
  industrySlug: string;
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  /** Buyer-question / workflow groups for primary grouping. */
  buyerQuestions?: Array<{ id: string; name: string }>;
  useCases?: Array<{ id: string; name: string }>;
  capabilities?: Array<{ id: string; name: string }>;
  requirements?: Array<{ id: string; name: string }>;
  screenshots: Array<{
    id: string;
    productSlug: string;
    productName: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
    checkedAt?: string;
    groupId?: string;
  }>;
  videos: ProductMedia[];
};

/**
 * EvidenceExplorer for Industry hubs — group by buyer question / workflow.
 * Reuses ResearchMedia; no IndustryVideo entity.
 */
export function buildIndustryEvidenceExplorer(
  input: IndustryEvidenceExplorerInput,
): EvidenceExplorerModel {
  const itemsById = new Map<string, EvidenceExplorerItem>();
  const subject = input.industryName;
  const logoBySlug = new Map(
    input.products.map((p) => [p.slug, p.logo ?? null]),
  );
  const productName = new Map(input.products.map((p) => [p.slug, p.name]));

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
  }

  for (const shot of input.screenshots) {
    const dims = [
      ...(shot.groupId ? [`question:${shot.groupId}`] : []),
    ];
    upsert({
      id: `shot:${shot.productSlug}:${shot.id}`,
      kind: "screenshot",
      productSlug: shot.productSlug,
      productName: shot.productName,
      logo: logoBySlug.get(shot.productSlug),
      title: shot.caption || shot.alt,
      supportsLabels: [subject],
      demonstrates: shot.caption ? [shot.caption] : [shot.alt],
      dimensionIds: dims,
      verifiedAt: shot.checkedAt?.slice(0, 10) ?? null,
      sourceUrl: shot.source ?? null,
      media: null,
      screenshotSrc: shot.src,
      screenshotAlt: shot.alt,
      suitability: "supporting",
    });
  }

  for (const video of input.videos) {
    const kind = resolveIndustryMediaContext(video);
    const dims = [
      `context:${kind}`,
      ...video.useCaseIds.map((id) => `usecase:${id}`),
      ...video.capabilityIds.map((id) => `capability:${id}`),
      ...video.requirementIds.map((id) => `requirement:${id}`),
      ...video.workflowStageIds.map((id) => `workflow:${id}`),
    ];
    const suitability =
      kind === "customer-case-study"
        ? "weak"
        : kind === "general-workflow"
          ? "supporting"
          : "supporting";

    upsert({
      id: `video:${video.id}`,
      kind: "official-video",
      productSlug: video.productSlug,
      productName: productName.get(video.productSlug) ?? video.productSlug,
      logo: logoBySlug.get(video.productSlug),
      title: video.title,
      supportsLabels: [
        subject,
        industryMediaContextLabel(kind),
        ...(video.industryEditionLabel ? [video.industryEditionLabel] : []),
      ],
      demonstrates: mediaWhatThisShows(video),
      doesNotEstablish: mediaLimitations(video),
      dimensionIds: dims,
      verifiedAt: video.verifiedAt?.slice(0, 10) ?? null,
      sourceUrl: video.sourceUrl,
      sourceOrganization:
        video.sourceOrganization ?? video.channelName ?? null,
      media: video,
      screenshotSrc: null,
      screenshotAlt: null,
      suitability,
      suitabilityNote:
        kind === "customer-case-study"
          ? "Customer story — not independent outcome or ROI evidence."
          : kind === "general-workflow"
            ? "General workflow — not labeled industry-specific."
            : "Illustrates industry workflow context only; not compliance or ranking evidence.",
    });
  }

  const items = [...itemsById.values()];
  const typeCounts = {
    all: items.length,
    documentation: items.filter((i) => i.kind === "documentation").length,
    screenshot: items.filter((i) => i.kind === "screenshot").length,
    "official-video": items.filter((i) => i.kind === "official-video").length,
  };

  const dimensions = [
    { id: "context:industry-specific", name: "Industry-specific only" },
    { id: "context:industry-edition", name: "Industry edition" },
    { id: "context:general-workflow", name: "General workflow" },
    { id: "context:customer-case-study", name: "Customer case study" },
    ...(input.buyerQuestions ?? []).map((q) => ({
      id: `question:${q.id}`,
      name: q.name,
    })),
  ];

  return {
    heading: `Evidence for ${input.industryName}`,
    supporting:
      "Documentation, screenshots, and official videos that relate to this industry context. Video quantity never changes product rankings.",
    subjectLabel: input.industryName,
    methodology: INDUSTRY_EVIDENCE_METHODOLOGY,
    items,
    products: input.products.map((p) => ({ slug: p.slug, name: p.name })),
    dimensions,
    facets: {
      workflows: (input.buyerQuestions ?? []).map((q) => ({
        id: `question:${q.id}`,
        name: q.name,
      })),
      requirements: (input.requirements ?? []).map((r) => ({
        id: `requirement:${r.id}`,
        name: r.name,
      })),
      features: (input.capabilities ?? []).map((c) => ({
        id: `capability:${c.id}`,
        name: c.name,
      })),
    },
    typeCounts,
  };
}
