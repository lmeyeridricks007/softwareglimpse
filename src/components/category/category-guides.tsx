import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { GuideCard } from "@/components/home/guide-card";
import { cn } from "@/lib/cn";

export type GuideHubItem = {
  href: string;
  title: string;
  summary: string | null;
  topicType: string;
};

type Props = {
  title: string;
  items: GuideHubItem[];
  featuredHref?: string;
  resourcesHref?: string;
  className?: string;
};

const SUPPORTING_LIMIT = 3;

export function CategoryGuides({
  title,
  items,
  featuredHref,
  resourcesHref,
  className,
}: Props) {
  const featured =
    items.length === 0
      ? null
      : ((featuredHref
          ? items.find((g) => g.href === featuredHref)
          : null) ?? items[0]!);
  const supporting = featured
    ? items.filter((g) => g.href !== featured.href).slice(0, SUPPORTING_LIMIT)
    : [];

  return (
    <section
      id="guides"
      aria-labelledby="guides-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-muted)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="guides-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>

      {featured ? (
        <div className="mt-5 space-y-4">
          <GuideCard
            href={featured.href}
            title={featured.title}
            summary={featured.summary ?? undefined}
            topicType={featured.topicType}
          />
          {supporting.length > 0 ? (
            <ul
              className={cn(
                "grid gap-3",
                supporting.length === 2 && "sm:grid-cols-2",
                supporting.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {supporting.map((g) => (
                <li key={g.href} className="min-w-0">
                  <GuideCard
                    href={g.href}
                    title={g.title}
                    summary={g.summary ?? undefined}
                    topicType={g.topicType}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          Category-specific guides are still being added. Browse the full
          library meanwhile.
        </p>
      )}

      <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          href="/guides/"
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow("Browse all guides")}
        </Link>
        {resourcesHref ? (
          <Link
            href={resourcesHref}
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("Download CRM resources")}
          </Link>
        ) : null}
      </p>
    </section>
  );
}
