import {
  getAllSoftwareUnfiltered,
  getRelationships,
} from "@/data";
import type { RelationshipCandidate, Software } from "@/domain";

function candidateId(
  type: RelationshipCandidate["type"],
  from: string,
  to: string,
): string {
  return `rel-candidate:${type}:${from}:${to}`;
}

/**
 * Infer candidate relationships for content planning.
 *
 * Seed-backed edges (denormalized competitor/alternative slugs + existing graph)
 * are marked **approved** — they were already curated into catalogue data and do
 * not need another relationship-review gate.
 *
 * Weak same-category taxonomy peers stay **candidate** and only surface when the
 * product lacks curated peer lists (so net-new products still get a review cue).
 * Taxonomy peers are never written to the editorial relationship graph here.
 */
export function discoverRelationshipCandidates(
  product: Software,
  opts?: { maxPeers?: number },
): RelationshipCandidate[] {
  const maxPeers = opts?.maxPeers ?? 5;
  const candidates: RelationshipCandidate[] = [];
  const seen = new Set<string>();
  const knownSoftware = new Set(
    getAllSoftwareUnfiltered().map((item) => item.slug),
  );

  const push = (c: RelationshipCandidate) => {
    if (c.targetSlug === product.slug) return;
    if (seen.has(c.id)) return;
    seen.add(c.id);
    candidates.push(c);
  };

  for (const slug of product.competitorSlugs) {
    if (!knownSoftware.has(slug)) continue;
    push({
      id: candidateId("competes-with", product.slug, slug),
      type: "competes-with",
      targetSlug: slug,
      confidence: "high",
      status: "approved",
      origin: "manual",
      reason: "Denormalized competitorSlugs on product (editorially curated)",
    });
  }

  for (const slug of product.alternativeSlugs) {
    if (!knownSoftware.has(slug)) continue;
    push({
      id: candidateId("alternative-to", product.slug, slug),
      type: "alternative-to",
      targetSlug: slug,
      confidence: "high",
      status: "approved",
      origin: "manual",
      reason: "Denormalized alternativeSlugs on product (editorially curated)",
    });
  }

  const graph = getRelationships();
  for (const edge of graph) {
    if (edge.source !== product.slug && edge.target !== product.slug) continue;
    const other = edge.source === product.slug ? edge.target : edge.source;
    if (edge.type === "competes-with" || edge.type === "alternative-to") {
      push({
        id: candidateId(edge.type, product.slug, other),
        type: edge.type,
        targetSlug: other,
        confidence: "high",
        status: "approved",
        origin: "graph",
        reason: `Existing graph edge ${edge.type} (already seeded)`,
      });
    }
  }

  const curatedPeerCount =
    product.competitorSlugs.length + product.alternativeSlugs.length;
  // Soft same-category suggestions only when the product has no curated peers yet.
  if (curatedPeerCount === 0) {
    const peers = getAllSoftwareUnfiltered()
      .filter(
        (s) =>
          s.slug !== product.slug &&
          s.primaryCategorySlug === product.primaryCategorySlug &&
          s.entityType === "software",
      )
      .slice(0, maxPeers);

    for (const peer of peers) {
      push({
        id: candidateId("related-to", product.slug, peer.slug),
        type: "related-to",
        targetSlug: peer.slug,
        confidence: "medium",
        status: "candidate",
        origin: "taxonomy",
        reason: `Same primary category: ${product.primaryCategorySlug}`,
      });
    }
  }

  return candidates;
}

export function relationshipReviewSummary(
  candidates: RelationshipCandidate[],
): {
  competitors: string[];
  alternatives: string[];
  needsReview: string[];
} {
  return {
    competitors: candidates
      .filter((c) => c.type === "competes-with")
      .map((c) => c.targetSlug),
    alternatives: candidates
      .filter((c) => c.type === "alternative-to")
      .map((c) => c.targetSlug),
    // Only unresolved candidates need human relationship review.
    needsReview: candidates
      .filter((c) => c.status === "candidate")
      .map((c) => c.targetSlug),
  };
}

export function resolveProductForRelationships(
  slug: string,
): Software | undefined {
  return getSoftwareBySlug(slug, { includeUnpublished: true });
}
