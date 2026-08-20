import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { Section } from "@/components/layout/section";
import type { GuidesHubTopic } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  topics: GuidesHubTopic[];
  className?: string;
};

export function GuidesCategoryDirectory({ topics, className }: Props) {
  if (topics.length === 0) return null;

  return (
    <Section
      padding="md"
      background="muted"
      container="wide"
      className={className}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Guides by software category
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Browse published guides by category — coverage expands as research is
        completed.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={topic.href}
              className={cn(
                "group flex h-full flex-col rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)] hover:shadow-[var(--sg-shadow-md)]",
              )}
            >
              <CategoryIcon categoryId={topic.slug} size="sm" />
              <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {topic.name}
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--sg-color-text-muted)]">
                {topic.comingSoon
                  ? "Guides coming soon"
                  : `${topic.guideCount} ${topic.guideCount === 1 ? "guide" : "guides"}`}
              </p>
              {!topic.comingSoon && topic.guides.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {topic.guides.slice(0, 2).map((g) => (
                    <li
                      key={g.href}
                      className="truncate text-xs text-[var(--sg-color-text-muted)]"
                    >
                      {g.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="mt-3 flex-1" />
              )}
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                {topic.comingSoon ? "View category" : "View guides"}
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/categories/"
            className="group flex h-full min-h-[10rem] flex-col items-center justify-center rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] p-4 text-center transition hover:border-[var(--sg-color-primary)]"
          >
            <LayoutGrid
              className="size-6 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
              View all categories
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
              Browse
              <ArrowRight className="size-3.5" aria-hidden />
            </span>
          </Link>
        </li>
      </ul>
    </Section>
  );
}
