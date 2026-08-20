import type { ResearchSnapshot } from "@/domain";
import { hashContent, nowIso } from "../utils";

export type FetchResult = {
  httpStatus?: number;
  contentType?: string;
  pageTitle?: string;
  canonicalUrl?: string;
  extractedText: string;
  retrievedAt: string;
  isFixture: boolean;
  metadata?: Record<string, unknown>;
};

export interface ResearchFetcher {
  fetch(input: {
    sourceId: string;
    productSlug: string;
    url?: string;
    domains?: string[];
  }): Promise<FetchResult>;
}

/**
 * Loads cleaned fixture text from the research store. No live HTTP.
 */
export class FixtureFetcher implements ResearchFetcher {
  constructor(
    private readonly loadFixtureText: (
      productSlug: string,
      sourceId: string,
    ) => string | null,
  ) {}

  async fetch(input: {
    sourceId: string;
    productSlug: string;
    url?: string;
  }): Promise<FetchResult> {
    const text = this.loadFixtureText(input.productSlug, input.sourceId);
    if (!text) {
      throw new Error(
        `No fixture content for ${input.productSlug}/${input.sourceId}`,
      );
    }

    return {
      httpStatus: 200,
      contentType: "text/plain",
      pageTitle: `${input.sourceId} fixture`,
      canonicalUrl: input.url,
      extractedText: text,
      retrievedAt: nowIso(),
      isFixture: true,
      metadata: { provider: "fixture-fetcher" },
    };
  }
}

export function toSnapshot(input: {
  id: string;
  sourceId: string;
  productSlug: string;
  fetch: FetchResult;
  domains?: ResearchSnapshot["domains"];
}): ResearchSnapshot {
  return {
    id: input.id,
    sourceId: input.sourceId,
    productSlug: input.productSlug,
    retrievedAt: input.fetch.retrievedAt,
    url: input.fetch.canonicalUrl,
    httpStatus: input.fetch.httpStatus,
    contentType: input.fetch.contentType,
    pageTitle: input.fetch.pageTitle,
    canonicalUrl: input.fetch.canonicalUrl,
    contentHash: hashContent(input.fetch.extractedText),
    extractedText: input.fetch.extractedText,
    domains: input.domains ?? [],
    isFixture: input.fetch.isFixture,
    metadata: input.fetch.metadata ?? {},
  };
}

export function hasContentChanged(
  previousHash: string | undefined,
  nextHash: string,
): boolean {
  if (!previousHash) return true;
  return previousHash !== nextHash;
}
