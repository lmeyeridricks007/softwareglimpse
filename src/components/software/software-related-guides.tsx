import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { GuideCard } from "@/components/home/guide-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type RelatedGuideItem = {
  href: string;
  title: string;
  summary?: string | null;
  topicType?: string;
};

export type PopularComparisonItem = {
  href: string;
  label: string;
};

type Props = {
  productName: string;
  guides?: RelatedGuideItem[];
  comparisons?: PopularComparisonItem[];
  className?: string;
};

export function SoftwareRelatedGuides({
  productName,
  guides = [],
  comparisons = [],
  className,
}: Props) {
  if (guides.length === 0 && comparisons.length === 0) return null;

  return (
    <section
      aria-labelledby="related-guides-heading"
      className={cn("scroll-mt-28 space-y-8", className)}
    >
      {guides.length > 0 ? (
        <div>
          <h2
            id="related-guides-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            Guides about {productName}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.href}>
                <GuideCard
                  href={guide.href}
                  title={guide.title}
                  summary={guide.summary ?? undefined}
                  topicType={guide.topicType}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {comparisons.length > 0 ? (
        <Card variant="soft">
          <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Popular comparisons
          </h3>
          <ul className="mt-3 space-y-2">
            {comparisons.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-2 text-sm text-[var(--sg-color-text)]"
                >
                  <span className="underline-offset-2 group-hover:underline">
                    {item.label}
                  </span>
                  <span className="shrink-0 font-medium text-[var(--sg-color-primary)]">
                    {withSingleArrow("Compare")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </section>
  );
}
