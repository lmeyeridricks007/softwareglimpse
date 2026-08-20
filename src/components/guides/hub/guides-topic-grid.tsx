import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import type { GuidesHubTopic } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  topics: GuidesHubTopic[];
  className?: string;
};

export function GuidesTopicGrid({ topics, className }: Props) {
  if (topics.length === 0) return null;

  return (
    <div className={cn(className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Explore guides by topic
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          Find practical advice for every stage of your software decision.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link href={topic.href} className="group block h-full">
              <article
                className={cn(
                  "flex h-full flex-col rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] transition duration-200",
                  "hover:border-[var(--sg-color-primary)]/40 hover:shadow-[var(--sg-shadow-md)] motion-safe:group-hover:-translate-y-0.5",
                )}
              >
                <CategoryIcon categoryId={topic.slug} size="md" />
                <h3 className="mt-4 text-base font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {topic.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[var(--sg-color-text-muted)]">
                  {topic.comingSoon
                    ? "Guides coming soon"
                    : `${topic.guideCount} ${topic.guideCount === 1 ? "guide" : "guides"}`}
                </p>
                {topic.description ? (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {topic.description}
                  </p>
                ) : (
                  <span className="flex-1" />
                )}
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                  {topic.comingSoon ? "Explore category" : "Explore guides"}
                  <ArrowRight
                    className="size-3.5 transition-transform motion-safe:group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </p>
              </article>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/categories/" className="group block h-full">
            <article className="flex h-full min-h-[11rem] flex-col items-center justify-center rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] p-5 text-center transition hover:border-[var(--sg-color-primary)] hover:shadow-[var(--sg-shadow-sm)]">
              <span className="inline-flex size-11 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                <LayoutGrid className="size-5" aria-hidden />
              </span>
              <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                View all categories
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                Browse
                <ArrowRight className="size-3.5" aria-hidden />
              </p>
            </article>
          </Link>
        </li>
      </ul>
    </div>
  );
}
