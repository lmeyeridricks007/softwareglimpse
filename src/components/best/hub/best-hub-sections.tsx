import Link from "next/link";
import { CategoryIcon } from "@/components/category/category-icon";
import { ComparisonTeaserCard } from "@/components/home/comparison-teaser-card";
import { GuideCard } from "@/components/home/guide-card";
import { SectionHeader } from "@/components/home/section-header";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/stack";
import { Card } from "@/components/ui/card";
import type {
  BestHubComparisonTeaser,
  BestHubGuideCard,
  BestHubUpdateItem,
} from "@/services/best-hub";

export function PopularComparisonsSection({
  comparisons,
  className,
}: {
  comparisons: BestHubComparisonTeaser[];
  className?: string;
}) {
  if (comparisons.length === 0) return null;

  const featuredOnly = comparisons.length === 1;

  return (
    <Section padding="md" background="muted" container="wide" className={className}>
      <SectionHeader
        title="Popular software comparisons"
        description="Side-by-side evaluations using the same criteria for both products."
        action={
          <Link
            href="/compare/"
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all comparisons
          </Link>
        }
      />
      {featuredOnly ? (
        <div className="max-w-xl">
          <ComparisonTeaserCard
            href={comparisons[0]!.href}
            leftName={comparisons[0]!.left.name}
            rightName={comparisons[0]!.right.name}
            leftLogo={comparisons[0]!.left.logo}
            rightLogo={comparisons[0]!.right.logo}
            summary={comparisons[0]!.summary}
          />
        </div>
      ) : (
        <Grid cols={3} gap={4}>
          {comparisons.map((cmp) => (
            <ComparisonTeaserCard
              key={cmp.slug}
              href={cmp.href}
              leftName={cmp.left.name}
              rightName={cmp.right.name}
              leftLogo={cmp.left.logo}
              rightLogo={cmp.right.logo}
              summary={cmp.summary}
            />
          ))}
        </Grid>
      )}
    </Section>
  );
}

export function BuyingGuideGrid({
  guides,
  className,
}: {
  guides: BestHubGuideCard[];
  className?: string;
}) {
  if (guides.length === 0) return null;

  return (
    <Section padding="md" background="tint" container="wide" className={className}>
      <SectionHeader
        title="Software buying guides"
        description="Learn how to choose before you shortlist — research-backed supporting guides."
        action={
          <Link
            href="/guides/"
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            All guides
          </Link>
        }
      />
      <Grid cols={guides.length === 1 ? 2 : 3} gap={4}>
        {guides.map((g) => (
          <GuideCard
            key={g.slug}
            href={g.href}
            title={g.title}
            summary={g.summary ?? undefined}
            categoryLabel={g.categoryLabel}
            topicType={g.topicType}
            readingMinutes={g.readingMinutes}
            updatedLabel={g.updatedLabel || undefined}
          />
        ))}
      </Grid>
    </Section>
  );
}

export function BestResearchUpdateFeed({
  items,
  className,
}: {
  items: BestHubUpdateItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Section padding="md" background="surface" container="wide" className={className}>
      <SectionHeader
        title="Recently updated recommendations"
        description="Best Software guides refreshed as product research changes."
      />
      <Card className="p-5">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 rounded-[var(--sg-radius-md)] px-1 py-2.5 hover:bg-[var(--sg-color-surface-muted)]"
              >
                <CategoryIcon categoryId={item.categorySlug} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--sg-color-text)] transition-colors group-hover:text-[var(--sg-color-primary)]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                    {item.changeLabel}
                    <span aria-hidden> · </span>
                    Updated {item.dateLabel}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}
