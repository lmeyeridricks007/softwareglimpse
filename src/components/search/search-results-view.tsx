import Link from "next/link";
import {
  FeaturedEntityCard,
  SearchResultCard,
} from "@/components/search/search-result-cards";
import type { SearchResponse } from "@/services/search/types";

type Props = {
  result: SearchResponse;
  filtered: boolean;
};

export function SearchResultsView({ result, filtered }: Props) {
  let position = 0;

  if (filtered) {
    const group = result.groups[0];
    const hits = group?.hits ?? result.hits;
    return (
      <div className="space-y-3">
        {hits.map((hit) => {
          position += 1;
          return (
            <SearchResultCard
              key={`${hit.document.type}:${hit.document.id}`}
              hit={hit}
              position={position}
              query={result.query}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {result.groups.map((group) => (
        <section key={group.id} aria-labelledby={`search-group-${group.id}`}>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2
              id={`search-group-${group.id}`}
              className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
            >
              {group.title}
              {group.total > 1 ? (
                <span className="ml-1 font-normal normal-case tracking-normal">
                  ({group.total})
                </span>
              ) : null}
            </h2>
            {group.viewAllHref ? (
              <Link
                href={group.viewAllHref}
                className="text-sm font-medium text-[var(--sg-color-primary)]"
              >
                View all {group.total} →
              </Link>
            ) : null}
          </div>

          {group.id === "top_match" && group.hits[0] ? (
            <FeaturedEntityCard
              hit={group.hits[0]}
              position={(position += 1)}
              query={result.query}
              featured
            />
          ) : (
            <div className="grid gap-3">
              {group.hits.map((hit) => {
                position += 1;
                return (
                  <SearchResultCard
                    key={`${hit.document.type}:${hit.document.id}`}
                    hit={hit}
                    position={position}
                    query={result.query}
                  />
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
