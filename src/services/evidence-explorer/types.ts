import type { ProductMedia } from "@/domain";

export type EvidenceExplorerKind =
  | "documentation"
  | "screenshot"
  | "official-video";

export type EvidenceExplorerGroupMode = "none" | "product" | "dimension";

export type EvidenceExplorerItem = {
  id: string;
  kind: EvidenceExplorerKind;
  productSlug: string | null;
  productName: string | null;
  logo?: { src: string; alt: string } | null;
  title: string;
  /** Feature / capability / criterion labels this evidence supports. */
  supportsLabels: string[];
  /** Structured observations — not raw marketing copy. */
  demonstrates: string[];
  /** Explicit non-claims — pricing, plan limits, etc. */
  doesNotEstablish?: string[];
  dimensionIds: string[];
  verifiedAt: string | null;
  sourceUrl: string | null;
  /** e.g. Official HubSpot */
  sourceOrganization?: string | null;
  media: ProductMedia | null;
  screenshotSrc: string | null;
  screenshotAlt: string | null;
  /** Claim-type suitability — video is never auto-strongest. */
  suitability?: "strong" | "supporting" | "weak" | "inappropriate";
  suitabilityNote?: string;
  /** Product assessment label from structured research (not media volume). */
  assessmentLabel?: string | null;
  /** Use case → workflow → requirement → feature → product trail. */
  traceTrail?: string[];
};

export type EvidenceExplorerProductOption = {
  slug: string;
  name: string;
};

export type EvidenceExplorerDimensionOption = {
  id: string;
  name: string;
};

export type EvidenceExplorerFacets = {
  workflows: EvidenceExplorerDimensionOption[];
  requirements: EvidenceExplorerDimensionOption[];
  features: EvidenceExplorerDimensionOption[];
};

export type EvidenceExplorerModel = {
  heading: string;
  supporting: string;
  subjectLabel: string;
  /** Optional methodology note shown under the supporting line. */
  methodology?: string;
  items: EvidenceExplorerItem[];
  products: EvidenceExplorerProductOption[];
  dimensions: EvidenceExplorerDimensionOption[];
  /** When set, EvidenceExplorer shows Workflow / Requirement / Feature filters. */
  facets?: EvidenceExplorerFacets;
  typeCounts: Record<EvidenceExplorerKind | "all", number>;
};

export type EvidenceExplorerFilters = {
  productSlug: string | "all";
  kind: EvidenceExplorerKind | "all";
  dimensionId: string | "all";
  workflowId: string | "all";
  requirementId: string | "all";
  featureId: string | "all";
  groupBy: EvidenceExplorerGroupMode;
};

export const DEFAULT_EVIDENCE_EXPLORER_FILTERS: EvidenceExplorerFilters = {
  productSlug: "all",
  kind: "all",
  dimensionId: "all",
  workflowId: "all",
  requirementId: "all",
  featureId: "all",
  groupBy: "none",
};

export function filterEvidenceExplorerItems(
  items: EvidenceExplorerItem[],
  filters: EvidenceExplorerFilters,
): EvidenceExplorerItem[] {
  return items.filter((item) => {
    if (
      filters.productSlug !== "all" &&
      item.productSlug !== filters.productSlug
    ) {
      return false;
    }
    if (filters.kind !== "all" && item.kind !== filters.kind) return false;
    if (
      filters.dimensionId !== "all" &&
      !item.dimensionIds.includes(filters.dimensionId)
    ) {
      return false;
    }
    if (
      filters.workflowId !== "all" &&
      !item.dimensionIds.includes(filters.workflowId)
    ) {
      return false;
    }
    if (
      filters.requirementId !== "all" &&
      !item.dimensionIds.includes(filters.requirementId)
    ) {
      return false;
    }
    if (
      filters.featureId !== "all" &&
      !item.dimensionIds.includes(filters.featureId)
    ) {
      return false;
    }
    return true;
  });
}

export type EvidenceExplorerGroup = {
  id: string;
  label: string;
  items: EvidenceExplorerItem[];
};

export function groupEvidenceExplorerItems(
  items: EvidenceExplorerItem[],
  groupBy: EvidenceExplorerGroupMode,
  options?: {
    products?: EvidenceExplorerProductOption[];
    dimensions?: EvidenceExplorerDimensionOption[];
  },
): EvidenceExplorerGroup[] {
  if (groupBy === "none" || items.length === 0) {
    return [{ id: "all", label: "All evidence", items }];
  }

  if (groupBy === "product") {
    const order =
      options?.products?.map((p) => p.slug) ??
      [...new Set(items.map((i) => i.productSlug).filter(Boolean))];
    const nameBySlug = new Map(
      (options?.products ?? []).map((p) => [p.slug, p.name]),
    );
    const groups: EvidenceExplorerGroup[] = [];
    for (const slug of order) {
      if (!slug) continue;
      const groupItems = items.filter((i) => i.productSlug === slug);
      if (groupItems.length === 0) continue;
      groups.push({
        id: slug,
        label: nameBySlug.get(slug) ?? groupItems[0]?.productName ?? slug,
        items: groupItems,
      });
    }
    const orphan = items.filter((i) => !i.productSlug);
    if (orphan.length) {
      groups.push({ id: "unknown", label: "Other", items: orphan });
    }
    return groups;
  }

  // dimension
  const dimOrder =
    options?.dimensions?.map((d) => d.id) ??
    [...new Set(items.flatMap((i) => i.dimensionIds))];
  const nameById = new Map(
    (options?.dimensions ?? []).map((d) => [d.id, d.name]),
  );
  const groups: EvidenceExplorerGroup[] = [];
  const claimed = new Set<string>();
  for (const dimId of dimOrder) {
    const groupItems = items.filter((i) => i.dimensionIds.includes(dimId));
    if (groupItems.length === 0) continue;
    for (const item of groupItems) claimed.add(item.id);
    groups.push({
      id: dimId,
      label: nameById.get(dimId) ?? dimId,
      items: groupItems,
    });
  }
  const unscoped = items.filter((i) => !claimed.has(i.id));
  if (unscoped.length) {
    groups.push({
      id: "unscoped",
      label: "General feature evidence",
      items: unscoped,
    });
  }
  return groups;
}

export function availableEvidenceKinds(
  items: EvidenceExplorerItem[],
): EvidenceExplorerKind[] {
  const present = new Set(items.map((i) => i.kind));
  const order: EvidenceExplorerKind[] = [
    "documentation",
    "screenshot",
    "official-video",
  ];
  return order.filter((k) => present.has(k));
}
