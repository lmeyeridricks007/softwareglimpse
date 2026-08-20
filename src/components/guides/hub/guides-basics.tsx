import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GuideCover } from "@/components/guides/hub/guide-illustrations";
import type { GuidesHubGuideCard } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  guides: GuidesHubGuideCard[];
  title?: string;
  description?: string;
  viewAllHref?: string;
  className?: string;
};

export function GuidesBasics({
  guides,
  title = "Start with the basics",
  description = "New to business software? Begin here.",
  viewAllHref = "#latest-guides",
  className,
}: Props) {
  if (guides.length === 0) return null;

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View all beginner guides →
        </Link>
      </div>

      <ul
        className={cn(
          "mt-7 grid gap-5",
          guides.length === 1
            ? "max-w-md sm:grid-cols-1"
            : guides.length === 2
              ? "sm:grid-cols-2 lg:max-w-4xl"
              : "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={guide.href} className="group block h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]/35 hover:shadow-[var(--sg-shadow-md)]">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
                  {guide.categoryLabel ? (
                    <Badge variant="primary" className="text-[10px]">
                      {guide.categoryLabel}
                    </Badge>
                  ) : (
                    <span />
                  )}
                  <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {guide.readingMinutes} min read
                  </span>
                </div>
                <div className="px-4 pt-3">
                  <GuideCover
                    image={guide.image}
                    topicType={guide.topicType}
                    className="h-[8.5rem]"
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
                  <div className="mt-4 flex items-center justify-between gap-2">
                    {guide.difficulty ? (
                      <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-text-muted)]">
                        {guide.difficulty}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-sm font-semibold text-[var(--sg-color-primary)]">
                      Read guide →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
