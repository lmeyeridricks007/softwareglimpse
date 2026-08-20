import type { EditorialPageType } from "@/domain";

export type CtaPlacement = "header" | "mid" | "final";

export type CtaBudget = {
  header: number;
  mid: number;
  final: number;
};

/**
 * Max affiliate/primary CTAs by page type and placement.
 * Keep editorial pages scannable — never stack CTAs in the hero.
 */
export const CTA_BUDGET_BY_PAGE_TYPE: Record<EditorialPageType, CtaBudget> = {
  "software-review": { header: 1, mid: 1, final: 1 },
  comparison: { header: 0, mid: 1, final: 1 },
  alternatives: { header: 0, mid: 1, final: 1 },
  best: { header: 0, mid: 1, final: 1 },
  guide: { header: 0, mid: 0, final: 1 },
  pricing: { header: 1, mid: 1, final: 1 },
  "category-hub": { header: 0, mid: 1, final: 1 },
  "use-case": { header: 0, mid: 1, final: 1 },
  "knowledge-plan": { header: 0, mid: 0, final: 0 },
};

export function getCtaBudget(pageType: EditorialPageType): CtaBudget {
  return CTA_BUDGET_BY_PAGE_TYPE[pageType];
}

export function maxCtasForPlacement(
  pageType: EditorialPageType,
  placement: CtaPlacement,
): number {
  return getCtaBudget(pageType)[placement];
}

export function canPlaceCta(
  pageType: EditorialPageType,
  placement: CtaPlacement,
  alreadyPlaced: number,
): boolean {
  return alreadyPlaced < maxCtasForPlacement(pageType, placement);
}
