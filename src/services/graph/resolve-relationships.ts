import {
  isSymmetricRelationship,
  type RelationshipType,
  type Software,
  type SoftwareRelationship,
} from "@/domain";
import {
  getAllSoftwareUnfiltered,
  getRelationships,
  getSoftwareBySlug,
} from "@/data/repositories/catalog";

export type ResolvedRelationship = SoftwareRelationship & {
  /** True when this edge was inferred as the inverse of a stored symmetric edge. */
  inferredInverse?: boolean;
};

/**
 * Resolve outgoing + inferred inverse relationships for a product.
 */
export function resolveRelationshipsForProduct(
  slug: string,
  types?: RelationshipType[],
): ResolvedRelationship[] {
  const results: ResolvedRelationship[] = [];
  const seen = new Set<string>();

  for (const edge of getRelationships()) {
    if (types && !types.includes(edge.type)) continue;

    if (edge.source === slug) {
      const key = `${edge.type}:${edge.source}:${edge.target}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(edge);
      }
    }

    if (edge.target === slug && isSymmetricRelationship(edge.type)) {
      const key = `${edge.type}:${slug}:${edge.source}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          ...edge,
          id: `${edge.id}:inverse`,
          source: slug,
          target: edge.source,
          inferredInverse: true,
        });
      }
    }
  }

  return results;
}

export function resolveCompetitorSlugs(slug: string): string[] {
  return uniqueTargets(
    resolveRelationshipsForProduct(slug, ["competes-with"]),
  );
}

export function resolveAlternativeSlugs(slug: string): string[] {
  return uniqueTargets(
    resolveRelationshipsForProduct(slug, ["alternative-to"]),
  );
}

export function resolveRelatedSoftware(
  slug: string,
  options?: { includeUnpublished?: boolean },
): Software[] {
  const targets = new Set([
    ...resolveCompetitorSlugs(slug),
    ...resolveAlternativeSlugs(slug),
    ...uniqueTargets(resolveRelationshipsForProduct(slug, ["related-to"])),
  ]);
  targets.delete(slug);

  return [...targets]
    .map((target) => getSoftwareBySlug(target, options))
    .filter((item): item is Software => Boolean(item));
}

function uniqueTargets(edges: ResolvedRelationship[]): string[] {
  return [...new Set(edges.map((e) => e.target))];
}

export function describeProductGraph(slug: string): string {
  const product = getAllSoftwareUnfiltered().find((s) => s.slug === slug);
  if (!product) {
    return `Unknown product: ${slug}`;
  }

  const competitors = resolveCompetitorSlugs(slug);
  const alternatives = resolveAlternativeSlugs(slug);
  const related = uniqueTargets(
    resolveRelationshipsForProduct(slug, ["related-to"]),
  );

  const lines = [
    product.name,
    "",
    `Primary category: ${product.primaryCategorySlug}`,
    product.secondaryCategorySlugs.length
      ? `Secondary: ${product.secondaryCategorySlugs.join(", ")}`
      : null,
    product.subcategorySlugs.length
      ? `Subcategories: ${product.subcategorySlugs.join(", ")}`
      : null,
    "",
    "Competitors:",
    ...(competitors.length ? competitors.map((s) => `- ${s}`) : ["- (none)"]),
    "",
    "Alternatives:",
    ...(alternatives.length ? alternatives.map((s) => `- ${s}`) : ["- (none)"]),
    "",
    "Related:",
    ...(related.length ? related.map((s) => `- ${s}`) : ["- (none)"]),
    "",
    `Use cases: ${product.useCaseSlugs.join(", ") || "(none)"}`,
    `Team types: ${product.teamTypeSlugs.join(", ") || "(none)"}`,
    `Business sizes: ${product.businessSizeSlugs.join(", ") || "(none)"}`,
    `Research status: ${product.metadata.researchStatus ?? "none"}`,
  ];

  return lines.filter((line) => line !== null).join("\n");
}
