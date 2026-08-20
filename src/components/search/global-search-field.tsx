"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/forms";
import { trackSearchEvent } from "@/services/search/analytics";
import { getTypeLabel } from "@/services/search/labels";
import type { AutocompleteSuggestion } from "@/services/search/types";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
};

/**
 * Shared header / mobile search — same suggest API as /search hero.
 */
export function GlobalSearchField({
  id,
  className,
  inputClassName,
  placeholder = "Search software, tools, guides…",
}: Props) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
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
      // ignore
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(query);
    }, 160);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  function goSearch(next = query) {
    const q = next.trim();
    trackSearchEvent("search_submitted", { query: q, source: "header" });
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
        goSearch();
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
      const selected = activeIndex >= 0 ? suggestions[activeIndex] : null;
      if (selected) {
        trackSearchEvent("search_suggestion_clicked", {
          query,
          result_type: selected.type,
          target: selected.href,
          source: "header",
        });
        setOpen(false);
        router.push(selected.href);
      } else {
        goSearch();
      }
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search SoftwareGlimpse
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sg-color-text-muted)]"
        aria-hidden
      />
      <Input
        id={id}
        name="q"
        type="search"
        value={query}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open && suggestions.length > 0}
        placeholder={placeholder}
        className={cn("h-10 pl-9 cursor-text", inputClassName)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />
      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-md)]"
        >
          {suggestions.map((s, index) => (
            <li key={`${s.type}:${s.href}`} role="option" aria-selected={index === activeIndex}>
              <Link
                href={s.href}
                className={cn(
                  "flex items-start gap-3 px-3 py-2 text-sm hover:bg-[var(--sg-color-surface-muted)]",
                  index === activeIndex && "bg-[var(--sg-color-surface-muted)]",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  trackSearchEvent("search_suggestion_clicked", {
                    query,
                    result_type: s.type,
                    target: s.href,
                    source: "header",
                    position: index,
                  })
                }
              >
                <span className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                  {getTypeLabel(s.type)}
                </span>
                <span className="min-w-0 font-medium">{s.title}</span>
              </Link>
            </li>
          ))}
          <li className="border-t border-[var(--sg-color-border)]">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm font-medium text-[var(--sg-color-primary)] hover:bg-[var(--sg-color-surface-muted)]"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goSearch()}
            >
              See all results for “{query.trim()}”
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
