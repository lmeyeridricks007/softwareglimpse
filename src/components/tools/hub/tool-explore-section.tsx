"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { track } from "@/analytics/events";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/layout/section";
import { ToolsTrackedButtonLink } from "@/components/tools/hub/tools-tracked-button-link";
import type {
  ToolsHubDirectoryGroup,
  ToolsHubModel,
  ToolsHubToolCard,
} from "@/services/tools-hub";
import { cn } from "@/lib/cn";

type FilterType =
  | "all"
  | "finder"
  | "calculator"
  | "comparison"
  | "stack-builder"
  | "scorecard"
  | "builder";
type StatusFilter = "all" | "available" | "coming-soon";

type Props = {
  tools: ToolsHubToolCard[];
  directory: ToolsHubDirectoryGroup[];
  categoryOptions: Array<{ slug: string; name: string }>;
  primaryFinder: ToolsHubModel["primaryFinder"];
  browseSoftwareHref: string;
  noAccountRequired: boolean;
  initialCategory?: string;
};

const TYPE_FILTERS: Array<{ id: FilterType; label: string }> = [
  { id: "all", label: "All" },
  { id: "finder", label: "Finders" },
  { id: "calculator", label: "Calculators" },
  { id: "scorecard", label: "Scorecards" },
  { id: "builder", label: "Builders" },
  { id: "comparison", label: "Comparisons" },
  { id: "stack-builder", label: "Stack Builders" },
];

export function ToolExploreSection({
  tools,
  directory,
  categoryOptions,
  primaryFinder,
  browseSoftwareHref,
  noAccountRequired,
  initialCategory = "all",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<FilterType>("all");
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState<StatusFilter>("all");

  const activeCategoryName =
    category !== "all"
      ? categoryOptions.find((c) => c.slug === category)?.name
      : null;

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (type !== "all" && tool.type !== type) return false;
      if (category !== "all") {
        if (!tool.categorySlugs.includes(category)) return false;
      }
      if (status === "available" && tool.status === "coming-soon") return false;
      if (status === "coming-soon" && tool.status !== "coming-soon") return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q)
      );
    });
  }, [tools, query, type, category, status]);

  function emitFilter(kind: string, value: string) {
    track({
      name: "tool_filter",
      properties: { filter_kind: kind, filter_value: value },
    });
  }

  return (
    <Section id="explore-tools" padding="md" background="muted" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        {activeCategoryName
          ? `Explore ${activeCategoryName} tools`
          : "Explore all tools"}
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sg-color-text-muted)]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              emitFilter("search", e.target.value);
            }}
            placeholder="Search tools..."
            className="h-10 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]"
            aria-label="Search tools"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setType(f.id);
                emitFilter("type", f.id);
              }}
              className={cn(
                "h-8 shrink-0 rounded-[var(--sg-radius-pill)] border px-3 text-xs font-semibold transition",
                type === f.id
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)]",
              )}
            >
              {f.label}
            </button>
          ))}

          <label className="flex items-center gap-2 text-xs text-[var(--sg-color-text-muted)] sm:ml-auto">
            Category
            <select
              value={category}
              onChange={(e) => {
                const next = e.target.value;
                setCategory(next);
                emitFilter("category", next);
                // Full navigation so hero, featured tools, and directory re-scope
                const href =
                  next === "all"
                    ? "/tools/"
                    : `/tools/?category=${encodeURIComponent(next)}`;
                router.push(href);
              }}
              className="h-8 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2 text-xs font-medium text-[var(--sg-color-text)]"
            >
              <option value="all">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-[var(--sg-color-text-muted)]">
            Status
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                emitFilter("status", e.target.value);
              }}
              className="h-8 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2 text-xs font-medium text-[var(--sg-color-text)]"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="coming-soon">Coming soon</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <div className="space-y-6">
          {directory.map((group) => {
            const groupTools = filtered.filter((t) =>
              group.tools.some((gt) => gt.id === t.id),
            );
            if (groupTools.length === 0) return null;
            return (
              <div key={group.type}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
                  {group.label}
                </h3>
                <ul className="mt-2 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
                  {groupTools.map((tool) => (
                    <li
                      key={tool.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      {tool.isInteractive && tool.href ? (
                        <Link
                          href={tool.href}
                          className="text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                          onClick={() =>
                            track({
                              name: "tool_card_click",
                              properties: {
                                tool_id: tool.id,
                                tool_type: tool.type,
                                source_section: "directory",
                              },
                            })
                          }
                        >
                          {tool.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-[var(--sg-color-text)]">
                          {tool.name}
                        </span>
                      )}
                      <Badge
                        variant={
                          tool.status === "coming-soon" ? "warning" : "success"
                        }
                      >
                        {tool.statusLabel}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No tools match these filters.
            </p>
          ) : null}
        </div>

        <aside className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-navy)] p-6 text-[var(--sg-color-text-inverse)] shadow-[var(--sg-shadow-md)] sm:p-7">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            Ready to find your software?
          </h3>
          <p className="mt-2 text-sm text-white/75">
            Start with a few questions and turn hundreds of software options into
            a shortlist built around your requirements.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {primaryFinder.exists ? (
              <ToolsTrackedButtonLink
                href={primaryFinder.href}
                variant="onDark"
                size="lg"
                className="w-full"
                sourceSection="final_cta"
                event="tools_final_cta_click"
                toolType="finder"
              >
                {primaryFinder.label}
              </ToolsTrackedButtonLink>
            ) : null}
            <ToolsTrackedButtonLink
              href={browseSoftwareHref}
              variant="outline"
              size="lg"
              className="w-full border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
              sourceSection="final_cta"
              event="tools_final_cta_click"
              toolType="browse"
            >
              Browse Software
            </ToolsTrackedButtonLink>
          </div>
          <p className="mt-4 text-xs text-white/60">
            Free to use
            {noAccountRequired ? " · No account required" : null}
          </p>
        </aside>
      </div>
    </Section>
  );
}
