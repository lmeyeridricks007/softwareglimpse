import type { Metadata } from "next";
import Link from "next/link";
import { SearchDiscoveryHub } from "@/components/search/search-discovery-hub";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchHero } from "@/components/search/search-hero";
import { SearchResultsView } from "@/components/search/search-results-view";
import { SearchSidebar } from "@/components/search/search-sidebar";
import { SearchSubmittedBeacon } from "@/components/search/search-submitted-beacon";
import {
  SEARCH_FILTER_TYPES,
  buildDiscoveryHub,
  runSearch,
  type SearchFilterType,
} from "@/services/search";
import { CURATED_TRY_QUERIES } from "@/services/search/curated-queries";
import { buildPageMetadataFromDecision } from "@/seo/metadata";
import { indexabilityForUtility } from "@/seo/indexability";

export const metadata: Metadata = buildPageMetadataFromDecision({
  title: "Search SoftwareGlimpse",
  description:
    "Find software, comparisons, guides, tools, resources, features and requirements across SoftwareGlimpse.",
  path: "/search/",
  decision: indexabilityForUtility("search"),
  pageType: "search",
});

type SearchParams = Promise<{ q?: string; type?: string }>;

function parseType(raw: string | undefined): SearchFilterType {
  if (!raw) return "all";
  return (SEARCH_FILTER_TYPES as readonly string[]).includes(raw)
    ? (raw as SearchFilterType)
    : "all";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const type = parseType(params.type);
  const hub = buildDiscoveryHub();

  if (!query) {
    return (
      <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 py-8 sm:px-6">
        <SearchHero tryQueries={[...CURATED_TRY_QUERIES].slice(0, 5)} tryLabel="Try" />
        <SearchDiscoveryHub hub={hub} />
      </div>
    );
  }

  const allResult = runSearch({ query, type: "all", limit: 48, groupLimit: 6 });
  const result =
    type === "all"
      ? allResult
      : {
          ...allResult,
          total: allResult.hits.filter((h) => h.document.type === type).length,
          featured: undefined,
          groups: [
            {
              id: "other" as const,
              title:
                allResult.counts.find((c) => c.type === type)?.label ?? "Results",
              hits: allResult.hits
                .filter((h) => h.document.type === type)
                .slice(0, 48),
              total: allResult.hits.filter((h) => h.document.type === type)
                .length,
            },
          ],
          hits: allResult.hits
            .filter((h) => h.document.type === type)
            .slice(0, 48),
        };
  const filtered = type !== "all";

  return (
    <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 py-8 sm:px-6">
      <SearchSubmittedBeacon query={query} total={allResult.total} />
      <SearchHero
        initialQuery={query}
        tryQueries={[...CURATED_TRY_QUERIES].slice(0, 5)}
        tryLabel="Try"
        compact
      />

      <div className="mt-6">
        <SearchFilters
          query={query}
          total={allResult.total}
          counts={allResult.counts}
          activeType={type}
        />
      </div>

      {result.correction ? (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]" role="status">
          Showing results for{" "}
          <Link
            href={`/search/?q=${encodeURIComponent(result.correction.suggested)}`}
            className="font-semibold text-[var(--sg-color-primary)]"
          >
            {result.correction.suggested}
          </Link>
          <span className="text-[var(--sg-color-text-muted)]">
            {" "}
            (searched for “{result.correction.original}”)
          </span>
        </p>
      ) : null}

      {result.total === 0 ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <SearchEmptyState query={query} />
          <SearchSidebar sidebar={result.sidebar} query={query} />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <SearchResultsView result={result} filtered={filtered} />
            <p className="mt-10 text-sm text-[var(--sg-color-text-muted)]">
              Can&apos;t find what you need?{" "}
              <Link
                href="/categories/crm/"
                className="font-medium text-[var(--sg-color-primary)]"
              >
                Browse all CRM software
              </Link>{" "}
              or{" "}
              <Link
                href="/tools/crm-finder/"
                className="font-medium text-[var(--sg-color-primary)]"
              >
                try the Finder
              </Link>
              .
            </p>
          </div>
          <SearchSidebar sidebar={result.sidebar} query={query} />
        </div>
      )}
    </div>
  );
}
