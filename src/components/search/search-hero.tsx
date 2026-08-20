"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms";
import { trackSearchEvent } from "@/services/search/analytics";
import type { AutocompleteSuggestion } from "@/services/search/types";
import { getTypeLabel } from "@/services/search/labels";
import { cn } from "@/lib/cn";

type Props = {
  initialQuery?: string;
  tryQueries: string[];
  tryLabel?: "Try" | "Popular searches";
  compact?: boolean;
};

export function SearchHero({
  initialQuery = "",
  tryQueries,
  tryLabel = "Try",
  compact = false,
}: Props) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.trim().length < 2) {
      abortRef.current?.abort();
      setSuggestions([]);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(
        `/api/search/suggest?q=${encodeURIComponent(value.trim())}`,
        { signal: controller.signal },
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        suggestions: AutocompleteSuggestion[];
      };
      if (controller.signal.aborted) return;
      setSuggestions(data.suggestions ?? []);
      setOpen(true);
      setActiveIndex(-1);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      // Keep typing UX intact if suggest fails.
    }
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(query);
    }, 160);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  function submit(next = query) {
    const q = next.trim();
    trackSearchEvent("search_submitted", { query: q });
    setOpen(false);
    router.push(q ? `/search/?q=${encodeURIComponent(q)}` : "/search/");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!open || suggestions.length === 0) {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const s = suggestions[activeIndex]!;
        trackSearchEvent("search_suggestion_clicked", {
          query,
          result_type: s.type,
          target: s.href,
        });
        setOpen(false);
        router.push(s.href);
      } else {
        submit();
      }
    }
  }

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-8 shadow-[var(--sg-shadow-sm)] sm:px-8",
        !compact &&
          "bg-[linear-gradient(180deg,var(--sg-color-primary-soft)_0%,var(--sg-color-surface)_42%)]",
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-primary)]">
          Search SoftwareGlimpse
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--sg-color-navy)] sm:text-4xl">
          Find software, comparisons, guides, tools & resources
        </h1>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          Search across software, buying guides, decision tools,
          requirements, use cases and more.
        </p>

        <form
          role="search"
          className="relative mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor="site-search-q" className="sr-only">
            Search SoftwareGlimpse
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sg-color-text-muted)]"
                aria-hidden
              />
              <Input
                id="site-search-q"
                name="q"
                type="search"
                value={query}
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls={listId}
                aria-expanded={open && suggestions.length > 0}
                aria-activedescendant={
                  activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
                }
                placeholder="Search software, tools, guides…"
                className="h-12 pl-10 text-base cursor-text"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                onBlur={() => {
                  // Allow click on suggestion before close.
                  setTimeout(() => setOpen(false), 120);
                }}
              />
              {open && suggestions.length > 0 ? (
                <ul
                  id={listId}
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-left shadow-[var(--sg-shadow-md)]"
                >
                  {suggestions.map((s, index) => (
                    <li
                      key={`${s.type}:${s.href}`}
                      id={`${listId}-opt-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <Link
                        href={s.href}
                        className={cn(
                          "flex items-start gap-3 px-3 py-2.5 text-sm hover:bg-[var(--sg-color-surface-muted)]",
                          index === activeIndex &&
                            "bg-[var(--sg-color-surface-muted)]",
                        )}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() =>
                          trackSearchEvent("search_suggestion_clicked", {
                            query,
                            result_type: s.type,
                            target: s.href,
                            position: index,
                          })
                        }
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                          {getTypeLabel(s.type)}
                        </span>
                        <span className="min-w-0 font-medium text-[var(--sg-color-text)]">
                          {s.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-[var(--sg-color-border)]">
                    <button
                      type="button"
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[var(--sg-color-primary)] hover:bg-[var(--sg-color-surface-muted)]"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => submit()}
                    >
                      See all results for “{query.trim()}”
                    </button>
                  </li>
                </ul>
              ) : null}
            </div>
            <Button type="submit" size="lg" className="h-12 px-5">
              Search
            </Button>
          </div>
        </form>

        {tryQueries.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-[var(--sg-color-text-muted)]">
              {tryLabel}:
            </span>
            {tryQueries.map((term) => (
              <Link
                key={term}
                href={`/search/?q=${encodeURIComponent(term)}`}
                className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                onClick={() =>
                  trackSearchEvent("search_suggestion_clicked", {
                    query: term,
                    source: "try_chip",
                  })
                }
              >
                {term}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
