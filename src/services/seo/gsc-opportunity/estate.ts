/**
 * Map GSC paths onto the SoftwareGlimpse content estate.
 */

export type GscEstateType =
  | "software"
  | "guides"
  | "comparisons"
  | "best"
  | "alternatives"
  | "pricing"
  | "tools"
  | "categories"
  | "use-cases"
  | "industries"
  | "research"
  | "other";

export function ensureSlashPath(p: string): string {
  if (!p || p === "/") return "/";
  const withSlash = p.startsWith("/") ? p : `/${p}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

export function inferEstateType(pathName: string): GscEstateType {
  const p = ensureSlashPath(pathName);
  if (p.startsWith("/software/")) return "software";
  if (p.startsWith("/guides/")) return "guides";
  if (p.startsWith("/compare/")) return "comparisons";
  if (p.startsWith("/best/")) return "best";
  if (p.startsWith("/alternatives/")) return "alternatives";
  if (p.startsWith("/pricing/") || p.includes("/pricing/")) return "pricing";
  if (p.startsWith("/tools/") || p.startsWith("/resources/")) return "tools";
  if (p.startsWith("/categories/")) return "categories";
  if (p.startsWith("/use-cases/")) return "use-cases";
  if (p.startsWith("/industries/")) return "industries";
  if (p.startsWith("/research/")) return "research";
  return "other";
}

export function extractEstateSlug(
  pathName: string,
  estate: GscEstateType,
): string | null {
  const parts = ensureSlashPath(pathName).split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const root = parts[0];
  const slug = parts[1] ?? null;
  const rootMap: Record<string, GscEstateType> = {
    software: "software",
    guides: "guides",
    compare: "comparisons",
    best: "best",
    alternatives: "alternatives",
    pricing: "pricing",
    tools: "tools",
    resources: "tools",
    categories: "categories",
    "use-cases": "use-cases",
    industries: "industries",
    research: "research",
  };
  if (root && rootMap[root] === estate) return slug;
  return slug;
}

export type OpportunityQueueBucket =
  | "indexed_improvement"
  | "improve_promotion";

/**
 * Queue A = already indexable / keep-index pages.
 * Queue B = IMPROVE / temporary noindex / promotion candidates.
 */
export function resolveOpportunityQueueBucket(input: {
  seoIndexable: boolean | null | undefined;
  lifecycleState?: string | null;
}): OpportunityQueueBucket {
  const life = (input.lifecycleState ?? "").toUpperCase();
  if (
    life === "IMPROVE" ||
    life === "IMPROVING" ||
    life === "INDEXABLE_READY" ||
    life === "READY_FOR_REVIEW" ||
    life === "MANUAL_REVIEW"
  ) {
    return "improve_promotion";
  }
  if (input.seoIndexable === false) return "improve_promotion";
  return "indexed_improvement";
}
