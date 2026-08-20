import { mediaWhatThisShows } from "@/domain";
import type { ProductMedia } from "@/domain";
import type {
  EvidenceExplorerItem,
  EvidenceExplorerModel,
} from "@/services/evidence-explorer/types";

export type CapabilityEvidenceExplorerInput = {
  capabilityName: string;
  capabilitySlug: string;
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
  }>;
  videos: ProductMedia[];
  /** Optional requirement / feature labels for filters (as dimension options). */
  filterDimensions?: Array<{ id: string; name: string }>;
};

/**
 * Build EvidenceExplorerModel for Capability pages (industry or hub).
 * Reuses ResearchMedia — no CapabilityVideo entity.
 */
export function buildCapabilityEvidenceExplorer(
  input: CapabilityEvidenceExplorerInput,
): EvidenceExplorerModel {
  const itemsById = new Map<string, EvidenceExplorerItem>();
  const subject = input.capabilityName;
  const logoBySlug = new Map(
    input.products.map((p) => [p.slug, p.logo ?? null]),
  );

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
    upsert({
      id: `shot:${shot.productSlug}:${shot.id}`,
      kind: "screenshot",
      productSlug: shot.productSlug,
      productName: shot.productName,
      logo: logoBySlug.get(shot.productSlug),
      title: shot.caption || shot.alt,
      supportsLabels: [subject],
      demonstrates: shot.caption ? [shot.caption] : [shot.alt],
      dimensionIds: [],
      verifiedAt: shot.checkedAt?.slice(0, 10) ?? null,
      sourceUrl: shot.source ?? null,
      media: null,
      screenshotSrc: shot.src,
      screenshotAlt: shot.alt,
    });
  }

  for (const video of input.videos) {
    const product = input.products.find((p) => p.slug === video.productSlug);
    const featureLabels = video.featureIds.map((id) =>
      id
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" "),
    );
    upsert({
      id: `video:${video.id}`,
      kind: "official-video",
      productSlug: video.productSlug,
      productName: product?.name ?? video.sourceOrganization ?? video.productSlug,
      logo: logoBySlug.get(video.productSlug),
      title: video.title,
      supportsLabels: [...new Set([subject, ...featureLabels])],
      demonstrates: mediaWhatThisShows(video),
      dimensionIds: [
        ...video.featureIds.map((f) => `feature:${f}`),
        ...video.requirementIds.map((r) => `requirement:${r}`),
      ],
      verifiedAt: video.verifiedAt?.slice(0, 10) ?? null,
      sourceUrl: video.sourceUrl,
      media: video,
      screenshotSrc: null,
      screenshotAlt: null,
    });
  }

  const items = [...itemsById.values()].sort((a, b) => {
    const kindOrder = { "official-video": 0, screenshot: 1, documentation: 2 };
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

  const products = input.products
    .filter((p) => items.some((i) => i.productSlug === p.slug))
    .map((p) => ({ slug: p.slug, name: p.name }));

  const usedDimIds = new Set(items.flatMap((i) => i.dimensionIds));
  const dimensions = (input.filterDimensions ?? []).filter((d) =>
    usedDimIds.has(d.id),
  );

  return {
    heading: "Capability evidence",
    supporting: `Explore the official documentation, screenshots and product demonstrations used to understand how each CRM implements ${subject.toLowerCase()}.`,
    subjectLabel: subject,
    items,
    products,
    dimensions,
    typeCounts,
  };
}
