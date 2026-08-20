import type {
  ResearchDomain,
  ResearchSource,
  ResearchSourceCandidate,
  Software,
} from "@/domain";
import { getSourcePriority } from "@/domain/schemas/research-source";

export interface ResearchSourceProvider {
  discover(
    product: Software,
    domains: ResearchDomain[],
  ): Promise<ResearchSourceCandidate[]>;
}

/**
 * Manual + fixture registry provider. No live web search.
 */
export class ManualSourceProvider implements ResearchSourceProvider {
  constructor(private readonly sources: ResearchSource[]) {}

  async discover(
    product: Software,
    domains: ResearchDomain[],
  ): Promise<ResearchSourceCandidate[]> {
    return this.sources
      .filter((source) => source.productSlug === product.slug)
      .filter((source) => source.status !== "rejected")
      .filter((source) =>
        domains.length === 0
          ? true
          : source.domains.some((domain) => domains.includes(domain)),
      )
      .map((source) => ({
        url: source.url || `fixture://${source.id}`,
        title: source.title,
        sourceType: source.sourceType,
        domains: source.domains,
        discoveryMethod:
          source.sourceType === "fixture"
            ? ("fixture" as const)
            : ("manual" as const),
        priority: getSourcePriority(source.sourceType),
      }))
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  }
}
