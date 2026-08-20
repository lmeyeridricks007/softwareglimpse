import { getAllSoftwareUnfiltered } from "@/data";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import type { ProductMedia } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";

export type AssetIntegrityFinding = {
  id: string;
  severity: "critical" | "warning";
  productSlug: string;
  mediaId?: string;
  issue: string;
  /** When true, may fail CI under --strict-integrity */
  deterministic: boolean;
};

/**
 * Deterministic integrity for active media / required sources.
 * Missing screenshots / opportunity gaps are NEVER critical.
 */
export function inspectAssetIntegrity(opts?: {
  productSlug?: string;
}): AssetIntegrityFinding[] {
  const findings: AssetIntegrityFinding[] = [];
  const products = getAllSoftwareUnfiltered().filter((p) => {
    if (opts?.productSlug) return p.slug === opts.productSlug;
    return isPubliclyAvailable(p.metadata);
  });

  for (const product of products) {
    const enrichment = loadEnrichment(product.slug);
    if (!enrichment) continue;
    const media = (enrichment.media ?? []) as ProductMedia[];

    for (const raw of media) {
      const m = enrichMediaFromSourceUrl(raw);

      // Active/published but unavailable source
      if (
        (m.status === "active" || m.status === "published") &&
        (m.sourceHealth === "unavailable" ||
          m.refreshFlags.includes("source-unavailable"))
      ) {
        findings.push({
          id: `AST-INT-BROKEN-${product.slug}-${m.id}`,
          severity: "critical",
          productSlug: product.slug,
          mediaId: m.id,
          issue: `Active ResearchMedia “${m.title}” is unavailable — published embed must not reference deleted/broken media.`,
          deterministic: true,
        });
      }

      // Invalid required source URL on any catalogued media
      try {
        // eslint-disable-next-line no-new
        new URL(m.sourceUrl);
      } catch {
        findings.push({
          id: `AST-INT-URL-${product.slug}-${m.id}`,
          severity: "critical",
          productSlug: product.slug,
          mediaId: m.id,
          issue: `ResearchMedia “${m.title}” has invalid sourceUrl.`,
          deterministic: true,
        });
      }

      // Published/active official video that is not public-eligible
      if (
        (m.status === "active" || m.status === "published") &&
        m.officialSource &&
        !isVideoPublicEligible(m).eligible
      ) {
        findings.push({
          id: `AST-INT-INELIGIBLE-${product.slug}-${m.id}`,
          severity: "critical",
          productSlug: product.slug,
          mediaId: m.id,
          issue: `Active official media “${m.title}” is not public-eligible (embedding/status/source).`,
          deterministic: true,
        });
      }
    }

    // Manual sources with required URL missing when status active
    for (const s of loadManualSources(product.slug)) {
      if (s.status === "active" && !s.url) {
        findings.push({
          id: `AST-INT-SOURCE-${product.slug}-${s.id}`,
          severity: "critical",
          productSlug: product.slug,
          issue: `Active ResearchSource “${s.title ?? s.id}” missing required URL.`,
          deterministic: true,
        });
      }
      if (s.url) {
        try {
          // eslint-disable-next-line no-new
          new URL(s.url);
        } catch {
          findings.push({
            id: `AST-INT-SOURCE-URL-${product.slug}-${s.id}`,
            severity: "critical",
            productSlug: product.slug,
            issue: `ResearchSource “${s.title ?? s.id}” has invalid URL.`,
            deterministic: true,
          });
        }
      }
    }
  }

  return findings;
}
