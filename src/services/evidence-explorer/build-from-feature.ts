import { mediaWhatThisShows } from "@/domain";
import type { FeatureDetailModel } from "@/services/feature-detail";
import type {
  EvidenceExplorerItem,
  EvidenceExplorerModel,
} from "@/services/evidence-explorer/types";

/**
 * Build a reusable EvidenceExplorerModel from a Feature Detail page model.
 * Dedupes matrix-cell docs/videos/screenshots into a flat research list.
 */
export function buildFeatureEvidenceExplorer(
  model: FeatureDetailModel,
): EvidenceExplorerModel {
  const itemsById = new Map<string, EvidenceExplorerItem>();
  const subject = model.featureName;
  const logoBySlug = new Map(
    model.productRows.map((p) => [p.slug, p.logo ?? null]),
  );
  const dimNameById = new Map(
    model.profile.evaluationDimensions.map((d) => [d.id, d.name]),
  );

  function upsert(item: EvidenceExplorerItem) {
    const existing = itemsById.get(item.id);
    if (!existing) {
      itemsById.set(item.id, item);
      return;
    }
    // Merge dimension / support labels when same evidence appears on multiple cells.
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

  // Prefer dimension-scoped evidence from product matrix cells (richer linkage).
  for (const product of model.productRows) {
    for (const dim of model.profile.evaluationDimensions) {
      const cell = product.dimensionCells[dim.id];
      const evidence = cell?.evidence;
      if (!evidence) continue;

      for (const doc of evidence.documentation) {
        upsert({
          id: `doc:${product.slug}:${doc.url}`,
          kind: "documentation",
          productSlug: product.slug,
          productName: product.name,
          logo: logoBySlug.get(product.slug),
          title: doc.title,
          supportsLabels: [dim.name, subject],
          demonstrates: [],
          dimensionIds: [dim.id],
          verifiedAt: null,
          sourceUrl: doc.url,
          media: null,
          screenshotSrc: null,
          screenshotAlt: null,
        });
      }

      for (const shot of evidence.screenshots) {
        upsert({
          id: `shot:${product.slug}:${shot.id}`,
          kind: "screenshot",
          productSlug: product.slug,
          productName: product.name,
          logo: logoBySlug.get(product.slug),
          title: shot.caption || shot.alt,
          supportsLabels: [subject],
          demonstrates: shot.caption ? [shot.caption] : [shot.alt],
          dimensionIds: [dim.id],
          verifiedAt: shot.checkedAt?.slice(0, 10) ?? null,
          sourceUrl: shot.source ?? null,
          media: null,
          screenshotSrc: shot.src,
          screenshotAlt: shot.alt,
        });
      }

      for (const video of evidence.videos) {
        const dimLabels = video.demonstratedDimensionIds
          .map((id) => dimNameById.get(id))
          .filter((n): n is string => Boolean(n));
        upsert({
          id: `video:${video.id}`,
          kind: "official-video",
          productSlug: product.slug,
          productName: product.name,
          logo: logoBySlug.get(product.slug),
          title: video.title,
          supportsLabels: [...new Set([subject, ...dimLabels])],
          demonstrates: mediaWhatThisShows(video),
          dimensionIds:
            video.demonstratedDimensionIds.length > 0
              ? video.demonstratedDimensionIds
              : [dim.id],
          verifiedAt: video.verifiedAt?.slice(0, 10) ?? null,
          sourceUrl: video.sourceUrl,
          media: video,
          screenshotSrc: null,
          screenshotAlt: null,
        });
      }
    }
  }

  // Page-level screenshots not already attached via a cell.
  for (const shot of model.screenshots) {
    const id = `shot:${shot.productSlug}:${shot.id}`;
    if (itemsById.has(id)) continue;
    upsert({
      id,
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

  // Page-level / see-in-action videos not already attached.
  for (const video of model.videos) {
    const id = `video:${video.id}`;
    if (itemsById.has(id)) continue;
    const product = model.productRows.find((p) => p.slug === video.productSlug);
    const dimLabels = video.demonstratedDimensionIds
      .map((d) => dimNameById.get(d))
      .filter((n): n is string => Boolean(n));
    upsert({
      id,
      kind: "official-video",
      productSlug: video.productSlug,
      productName: product?.name ?? video.sourceOrganization ?? video.productSlug,
      logo: logoBySlug.get(video.productSlug),
      title: video.title,
      supportsLabels: [...new Set([subject, ...dimLabels])],
      demonstrates: mediaWhatThisShows(video),
      dimensionIds: video.demonstratedDimensionIds,
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

  const products = model.productRows
    .filter((p) => items.some((i) => i.productSlug === p.slug))
    .map((p) => ({ slug: p.slug, name: p.name }));

  const usedDimIds = new Set(items.flatMap((i) => i.dimensionIds));
  const dimensions = model.profile.evaluationDimensions
    .filter((d) => usedDimIds.has(d.id))
    .map((d) => ({ id: d.id, name: d.name }));

  return {
    heading: "Feature evidence",
    supporting:
      "Explore the official documentation, screenshots and product demonstrations used to understand how each CRM implements this feature.",
    subjectLabel: subject,
    items,
    products,
    dimensions,
    typeCounts,
  };
}
