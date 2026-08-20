/**
 * SERP competitor discovery contracts.
 * Organic competitors only — never a hardcoded business-competitor list.
 */

export type SerpResultType =
  | "organic"
  | "featured-snippet"
  | "people-also-ask"
  | "video"
  | "other";

export type CompetitorDomainType =
  | "direct-review-affiliate"
  | "software-marketplace"
  | "vendor"
  | "editorial-media"
  | "consultancy"
  | "community"
  | "other";

export type CompetitorSignificance =
  | "primary-organic-competitor"
  | "secondary"
  | "query-specific";

export type SerpOrganicResult = {
  rank: number;
  domain: string;
  url: string;
  title: string;
  snippet?: string;
  resultType: SerpResultType;
};

export type SerpQueryResult = {
  query: string;
  searchedAt: string;
  provider: string;
  results: SerpOrganicResult[];
  serpFeatures?: string[];
  notes?: string[];
};

export type QuerySeed = {
  query: string;
  intent: string;
  cluster: string;
  associatedPage: string | null;
  source: string;
};

export type DomainCompetitor = {
  domain: string;
  type: CompetitorDomainType;
  significance: CompetitorSignificance;
  frequency: number;
  avgPosition: number;
  bestPosition: number;
  queryCount: number;
  queries: string[];
  sampleUrls: string[];
  pageTypesObserved: string[];
  score: number;
};

export type QueryLevelCompetitors = {
  query: string;
  intent: string;
  associatedPage: string | null;
  competitors: Array<{
    domain: string;
    type: CompetitorDomainType;
    rank: number;
    url: string;
    title: string;
  }>;
};

export type SerpCompetitorDiscoveryReport = {
  generatedAt: string;
  cluster: string;
  provider: string;
  queryCount: number;
  resultCount: number;
  staleAfterDays: number;
  domains: DomainCompetitor[];
  byQuery: QueryLevelCompetitors[];
  notes: string[];
  disclaimer: string;
};
