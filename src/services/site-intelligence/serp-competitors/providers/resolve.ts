import type { SerpOrganicResult, SerpQueryResult } from "../types";
import { extractDomain } from "../classify-domain";
import type { SerpSearchProvider } from "./types";
import { SerpProviderNotConfiguredError } from "./types";

function mapItems(
  items: Array<{
    link?: string;
    url?: string;
    title?: string;
    snippet?: string;
    description?: string;
  }>,
): SerpOrganicResult[] {
  const out: SerpOrganicResult[] = [];
  let rank = 0;
  for (const item of items) {
    const url = item.link ?? item.url;
    if (!url) continue;
    rank += 1;
    out.push({
      rank,
      domain: extractDomain(url),
      url,
      title: item.title ?? url,
      snippet: item.snippet ?? item.description,
      resultType: "organic",
    });
  }
  return out;
}

export function createBraveSerpProvider(apiKey: string): SerpSearchProvider {
  return {
    id: "brave",
    isLive: true,
    async search(query, options) {
      const num = options?.num ?? 10;
      const url = new URL("https://api.search.brave.com/res/v1/web/search");
      url.searchParams.set("q", query);
      url.searchParams.set("count", String(num));
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": apiKey,
        },
      });
      if (!res.ok) {
        throw new Error(`Brave Search API error ${res.status}`);
      }
      const data = (await res.json()) as {
        web?: { results?: Array<{ url: string; title: string; description?: string }> };
      };
      const results = mapItems(
        (data.web?.results ?? []).map((r) => ({
          url: r.url,
          title: r.title,
          snippet: r.description,
        })),
      );
      return {
        query,
        searchedAt: new Date().toISOString(),
        provider: "brave",
        results,
        serpFeatures: [],
      };
    },
  };
}

export function createSerperProvider(apiKey: string): SerpSearchProvider {
  return {
    id: "serper",
    isLive: true,
    async search(query, options) {
      const num = options?.num ?? 10;
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify({ q: query, num }),
      });
      if (!res.ok) {
        throw new Error(`Serper API error ${res.status}`);
      }
      const data = (await res.json()) as {
        organic?: Array<{
          link: string;
          title: string;
          snippet?: string;
          position?: number;
        }>;
        knowledgeGraph?: unknown;
        peopleAlsoAsk?: unknown[];
        answerBox?: unknown;
      };
      const features: string[] = [];
      if (data.knowledgeGraph) features.push("knowledge-graph");
      if (data.peopleAlsoAsk?.length) features.push("people-also-ask");
      if (data.answerBox) features.push("answer-box");
      const results = mapItems(data.organic ?? []);
      return {
        query,
        searchedAt: new Date().toISOString(),
        provider: "serper",
        results,
        serpFeatures: features,
      };
    },
  };
}

export function createGoogleCseProvider(
  apiKey: string,
  cx: string,
): SerpSearchProvider {
  return {
    id: "google-cse",
    isLive: true,
    async search(query, options) {
      const num = Math.min(10, options?.num ?? 10);
      const url = new URL("https://www.googleapis.com/customsearch/v1");
      url.searchParams.set("key", apiKey);
      url.searchParams.set("cx", cx);
      url.searchParams.set("q", query);
      url.searchParams.set("num", String(num));
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Google CSE API error ${res.status}`);
      }
      const data = (await res.json()) as {
        items?: Array<{ link: string; title: string; snippet?: string }>;
      };
      return {
        query,
        searchedAt: new Date().toISOString(),
        provider: "google-cse",
        results: mapItems(data.items ?? []),
        serpFeatures: [],
        notes: [
          "Google Programmable Search Engine — results may differ from raw Google SERP",
        ],
      };
    },
  };
}

export function createFixtureSerpProvider(
  byQuery: Record<string, SerpQueryResult>,
): SerpSearchProvider {
  return {
    id: "fixture",
    isLive: false,
    async search(query) {
      const hit =
        byQuery[query] ??
        byQuery[query.toLowerCase()] ??
        Object.values(byQuery).find(
          (r) => r.query.toLowerCase() === query.toLowerCase(),
        );
      if (!hit) {
        return {
          query,
          searchedAt: new Date().toISOString(),
          provider: "fixture",
          results: [],
          notes: [`No fixture SERP for query: ${query}`],
        };
      }
      return { ...hit, searchedAt: new Date().toISOString() };
    },
  };
}

export function createImportSnapshotProvider(
  results: SerpQueryResult[],
): SerpSearchProvider {
  const map: Record<string, SerpQueryResult> = {};
  for (const r of results) {
    map[r.query.toLowerCase()] = r;
  }
  return {
    id: results[0]?.provider ? `import:${results[0].provider}` : "import",
    isLive: results.some((r) => !/fixture|synthetic/i.test(r.provider)),
    async search(query) {
      const hit = map[query.toLowerCase()];
      if (!hit) {
        return {
          query,
          searchedAt: new Date().toISOString(),
          provider: "import",
          results: [],
          notes: [`Query not in imported snapshot: ${query}`],
        };
      }
      return hit;
    },
  };
}

/**
 * Resolve approved SERP provider from env.
 * Never scrapes Google HTML.
 */
export function resolveSerpProvider(options?: {
  prefer?: "brave" | "serper" | "google-cse" | "fixture";
  fixtureMap?: Record<string, SerpQueryResult>;
}): SerpSearchProvider {
  if (options?.prefer === "fixture" || options?.fixtureMap) {
    return createFixtureSerpProvider(options.fixtureMap ?? {});
  }

  const brave = process.env.BRAVE_API_KEY;
  const serper = process.env.SERPER_API_KEY;
  const googleKey =
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ??
    process.env.RESEARCH_WEB_SEARCH_API_KEY;
  const googleCx = process.env.GOOGLE_CUSTOM_SEARCH_ID;
  const prefer =
    options?.prefer ??
    (process.env.SERP_SEARCH_PROVIDER as
      | "brave"
      | "serper"
      | "google-cse"
      | undefined);

  if (prefer === "brave" && brave) return createBraveSerpProvider(brave);
  if (prefer === "serper" && serper) return createSerperProvider(serper);
  if (prefer === "google-cse" && googleKey && googleCx) {
    return createGoogleCseProvider(googleKey, googleCx);
  }

  if (brave) return createBraveSerpProvider(brave);
  if (serper) return createSerperProvider(serper);
  if (googleKey && googleCx) return createGoogleCseProvider(googleKey, googleCx);

  throw new SerpProviderNotConfiguredError(
    "No approved SERP search provider configured. Set BRAVE_API_KEY, SERPER_API_KEY, or GOOGLE_CUSTOM_SEARCH_API_KEY+GOOGLE_CUSTOM_SEARCH_ID. Do not scrape Google HTML. Use --fixture or --import <snapshot.json> for offline runs.",
  );
}
