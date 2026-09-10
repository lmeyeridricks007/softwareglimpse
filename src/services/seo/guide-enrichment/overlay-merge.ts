/**
 * Pure overlay merge — safe for any bundle (no node:fs).
 */
import type { GuidePage } from "@/domain/schemas";
import type { EnrichmentGuideType, UniqueValueElement } from "./types";

export type GuideEnrichmentOverlay = {
  slug: string;
  enrichmentType: EnrichmentGuideType;
  updatedAt: string;
  uniqueValueAdded: UniqueValueElement[];
  patch: Partial<
    Pick<
      GuidePage,
      | "summary"
      | "blocks"
      | "sections"
      | "checklist"
      | "faq"
      | "relatedGuideSlugs"
      | "nextAction"
      | "supports"
      | "seo"
    >
  >;
  notes: string[];
};

export function mergeGuideWithOverlay(
  guide: GuidePage,
  overlay: GuideEnrichmentOverlay | null,
): GuidePage {
  if (!overlay || overlay.slug !== guide.slug) return guide;
  const patch = overlay.patch;
  const existingBlocks = guide.blocks ?? [];
  const patchBlocks = patch.blocks ?? [];
  const replacedTypes = new Set(
    patchBlocks.map((b) =>
      b && typeof b === "object" && "type" in b
        ? String((b as { type?: string }).type)
        : "",
    ),
  );
  const kept = existingBlocks.filter((b) => {
    const t =
      b && typeof b === "object" && "type" in b
        ? String((b as { type?: string }).type)
        : "";
    return !replacedTypes.has(t);
  });

  return {
    ...guide,
    summary: patch.summary ?? guide.summary,
    blocks: [...kept, ...patchBlocks],
    sections: patch.sections ?? guide.sections,
    checklist:
      patch.checklist && patch.checklist.length > 0
        ? patch.checklist
        : guide.checklist,
    faq: patch.faq && patch.faq.length > 0 ? patch.faq : guide.faq,
    relatedGuideSlugs: patch.relatedGuideSlugs ?? guide.relatedGuideSlugs,
    nextAction: patch.nextAction ?? guide.nextAction,
    supports:
      patch.supports && patch.supports.length > 0
        ? patch.supports
        : guide.supports,
    seo: patch.seo
      ? {
          ...guide.seo,
          ...patch.seo,
        }
      : guide.seo,
  };
}
