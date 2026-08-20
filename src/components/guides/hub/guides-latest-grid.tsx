"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GuideCover } from "@/components/guides/hub/guide-illustrations";
import type {
  GuidesHubGuideCard,
  GuidesHubTopicFilterSlug,
} from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  guides: GuidesHubGuideCard[];
  filterCategories: Array<{ slug: string; name: string }>;
  filterTopics: Array<{
    slug: GuidesHubTopicFilterSlug;
    name: string;
    count: number;
  }>;
  initialCategory?: string | null;
  initialTopic?: GuidesHubTopicFilterSlug | null;
  initialQuery?: string;
  className?: string;
};

export function GuidesLatestGrid({
  guides,
  filterCategories,
  filterTopics,
  initialCategory = null,
  initialTopic = null,
  initialQuery = "",
  className,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [topic, setTopic] = useState<GuidesHubTopicFilterSlug | null>(
    initialTopic,
  );

  useEffect(() => {
    if (!initialQuery && !initialCategory && !initialTopic) return;
    const el = document.getElementById("latest-guides");
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [initialQuery, initialCategory, initialTopic]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      if (category && g.categorySlug !== category) return false;
      if (topic && g.topicFilter !== topic) return false;
      if (!q) return true;
      const hay = [
        g.title,
        g.summary ?? "",
        g.categoryLabel ?? "",
        g.topicType,
        g.topicFilterLabel,
        g.journeyStage,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [guides, query, category, topic]);

  const clearFilters = () => {
    setQuery("");
    setCategory(null);
    setTopic(null);
  };

  const hasActiveFilters = Boolean(query.trim() || category || topic);

  return (
    <div id="latest-guides" className={cn("scroll-mt-28", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            Latest software guides
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Filter by category, topic, or search published guides.
          </p>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {hasActiveFilters ? "Clear filters →" : "View all guides →"}
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Category
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter guides by category"
          >
            <FilterChip
              active={category == null}
              onClick={() => setCategory(null)}
              label="All"
            />
            {filterCategories.map((c) => (
              <FilterChip
                key={c.slug}
                active={category === c.slug}
                onClick={() => setCategory(c.slug)}
                label={shortLabel(c.name)}
              />
            ))}
          </div>
        </div>

        {filterTopics.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Topic
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter guides by topic"
            >
              <FilterChip
                active={topic == null}
                onClick={() => setTopic(null)}
                label="All topics"
              />
              {filterTopics.map((t) => (
                <FilterChip
                  key={t.slug}
                  active={topic === t.slug}
                  onClick={() => setTopic(t.slug)}
                  label={`${t.name} (${t.count})`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <label className="sr-only" htmlFor="guides-filter-search">
          Filter guides
        </label>
        <input
          id="guides-filter-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title or topic..."
          className="w-full max-w-sm rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
        />

        {hasActiveFilters ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Showing{" "}
            <span className="font-semibold text-[var(--sg-color-text)]">
              {filtered.length}
            </span>{" "}
            of {guides.length} guides
            {topic ? (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-[var(--sg-color-text)]">
                  {filterTopics.find((t) => t.slug === topic)?.name ?? topic}
                </span>
              </>
            ) : null}
            {category ? (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-[var(--sg-color-text)]">
                  {filterCategories.find((c) => c.slug === category)?.name ??
                    category}
                </span>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 px-5 py-12 text-center">
          <p className="text-sm font-medium text-[var(--sg-color-text)]">
            {category && !topic
              ? "Guides coming soon for this category."
              : "No guides match these filters."}
          </p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul
          className={cn(
            "mt-7 grid gap-5",
            filtered.length === 1
              ? "max-w-sm"
              : filtered.length === 2
                ? "sm:grid-cols-2 lg:max-w-3xl"
                : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {filtered.map((guide) => (
            <li key={guide.slug}>
              <Link href={guide.href} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]/35 hover:shadow-[var(--sg-shadow-md)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {guide.categoryLabel ? (
                        <Badge variant="primary" className="text-[10px]">
                          {guide.categoryLabel}
                        </Badge>
                      ) : null}
                      <Badge variant="neutral" className="text-[10px]">
                        {guide.topicFilterLabel}
                      </Badge>
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      {guide.readingMinutes} min read
                    </span>
                  </div>
                  <div className="px-4 pt-3">
                    <GuideCover
                      image={guide.image}
                      topicType={guide.topicType}
                      className="h-[8rem]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 pt-3">
                    <h3 className="font-semibold leading-snug text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {guide.title}
                    </h3>
                    {guide.summary ? (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                        {guide.summary}
                      </p>
                    ) : (
                      <span className="flex-1" />
                    )}
                    {guide.updatedLabel ? (
                      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                        Updated {guide.updatedLabel}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm font-semibold text-[var(--sg-color-primary)]">
                      Read guide →
                    </p>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function shortLabel(name: string): string {
  return name
    .replace(/\s*&\s*.+$/, "")
    .replace(/\s+Software$/i, "")
    .replace(/\s+Intelligence$/i, "")
    .replace(/Project Management.*/i, "Productivity")
    .replace(/Business Communications/i, "Comms")
    .replace(/Customer Service/i, "Customer Service")
    .replace(/Marketing.*/i, "Marketing")
    .replace(/Workforce.*/i, "HR")
    .replace(/IT.*/i, "IT")
    .trim();
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-[var(--sg-radius-pill)] px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--sg-color-primary)] text-white shadow-[var(--sg-shadow-sm)]"
          : "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
      )}
    >
      {label}
    </button>
  );
}
