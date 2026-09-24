"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchDiscoveryHub } from "@/components/search/search-discovery-hub";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchHero } from "@/components/search/search-hero";
import { SearchResultsView } from "@/components/search/search-results-view";
import { SearchSidebar } from "@/components/search/search-sidebar";
import { SearchSubmittedBeacon } from "@/components/search/search-submitted-beacon";
import { CURATED_TRY_QUERIES } from "@/services/search/curated-queries";
import { parsePublicSearchType } from "@/services/search/public-query-params";
import type {
  SearchFilterType,
  SearchResponse,
  SearchTypeCount,
} from "@/services/search/types";
import type { DiscoveryHubModel } from "@/services/search/types";

type Payload = {
  type: SearchFilterType;
  total: number;
  counts: SearchTypeCount[];
  result: SearchResponse;
};

const TRY = [...CURATED_TRY_QUERIES].slice(0, 5);

export function SearchDiscoveryShell({ hub }: { hub: DiscoveryHubModel }) {
  return (
    <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 py-8 sm:px-6">
      <SearchHero tryQueries={TRY} tryLabel="Try" />
      <SearchDiscoveryHub hub={hub} />
    </div>
  );
}

export function SearchFromQuery({ hub }: { hub: DiscoveryHubModel }) {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const type = parsePublicSearchType(params.get("type"));
  const requestKey = `${query}\0${type}`;
  const [payload, setPayload] = useState<{ key: string; body: Payload } | null>(null);
  const [error, setError] = useState<{ key: string; message: string } | null>(null);
  const current = payload?.key === requestKey ? payload.body : null;
  const currentError = error?.key === requestKey ? error.message : null;

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    const key = requestKey;
    const url = `/api/search/query/?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`;

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            response.status === 400
              ? "That search is too long."
              : "Search is unavailable right now.",
          );
        }
        return (await response.json()) as Payload;
      })
      .then((body) => {
        if (!controller.signal.aborted) setPayload({ key, body });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError({
          key,
          message: cause instanceof Error ? cause.message : "Search failed.",
        });
      });

    return () => controller.abort();
  }, [query, type, requestKey]);

  if (!query) {
    return <SearchDiscoveryShell hub={hub} />;
  }

  return (
    <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 py-8 sm:px-6">
      {current ? (
        <SearchSubmittedBeacon query={query} total={current.total} />
      ) : null}
      <SearchHero initialQuery={query} tryQueries={TRY} tryLabel="Try" compact />

      {currentError ? (
        <p className="mt-6 text-sm text-[var(--sg-color-text-muted)]" role="status">
          {currentError}
        </p>
      ) : null}

      {!current && !currentError ? (
        <p className="mt-6 text-sm text-[var(--sg-color-text-muted)]" role="status">
          Searching…
        </p>
      ) : null}

      {current ? (
        <>
          <div className="mt-6">
            <SearchFilters
              query={query}
              total={current.total}
              counts={current.counts}
              activeType={current.type}
            />
          </div>

          {current.result.correction ? (
            <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]" role="status">
              Showing results for{" "}
              <Link
                href={`/search/?q=${encodeURIComponent(current.result.correction.suggested)}`}
                className="font-semibold text-[var(--sg-color-primary)]"
              >
                {current.result.correction.suggested}
              </Link>
              <span className="text-[var(--sg-color-text-muted)]">
                {" "}
                (searched for “{current.result.correction.original}”)
              </span>
            </p>
          ) : null}

          {current.result.total === 0 ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <SearchEmptyState query={query} />
              <SearchSidebar sidebar={current.result.sidebar} query={query} />
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div>
                <SearchResultsView
                  result={current.result}
                  filtered={current.type !== "all"}
                />
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
              <SearchSidebar sidebar={current.result.sidebar} query={query} />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
