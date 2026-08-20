import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type QuickFact = {
  label: string;
  value: React.ReactNode;
};

export type SidebarAlternative = {
  href: string;
  name: string;
  description?: string | null;
};

export type SidebarGuide = {
  href: string;
  title: string;
};

type TocItem = { id: string; label: string };

type Props = {
  facts?: QuickFact[];
  primaryCta?: React.ReactNode;
  secondaryCta?: React.ReactNode;
  alternatives?: SidebarAlternative[];
  guides?: SidebarGuide[];
  comparisons?: Array<{ href: string; label: string }>;
  onThisPage?: TocItem[];
  className?: string;
};

export function SoftwareReviewSidebar({
  facts = [],
  primaryCta,
  secondaryCta,
  alternatives = [],
  guides = [],
  comparisons = [],
  onThisPage,
  className,
}: Props) {
  const hasCtas = Boolean(primaryCta || secondaryCta);
  const hasContent =
    facts.length > 0 ||
    hasCtas ||
    alternatives.length > 0 ||
    guides.length > 0 ||
    comparisons.length > 0 ||
    (onThisPage?.length ?? 0) > 0;

  if (!hasContent) return null;

  return (
    <aside className={cn("space-y-5 lg:sticky lg:top-24", className)}>
      {hasCtas ? (
        <Card className="space-y-3">
          {primaryCta}
          {secondaryCta}
        </Card>
      ) : null}

      {facts.length > 0 ? <SoftwareQuickFacts facts={facts} /> : null}

      {alternatives.length > 0 ? (
        <SoftwareSidebarAlternatives items={alternatives} />
      ) : null}

      {guides.length > 0 ? <SoftwareSidebarGuides items={guides} /> : null}

      {comparisons.length > 0 ? (
        <SoftwareRelatedComparisons items={comparisons} />
      ) : null}

      {onThisPage && onThisPage.length > 0 ? (
        <SoftwareOnThisPage items={onThisPage} />
      ) : null}
    </aside>
  );
}

export function SoftwareQuickFacts({ facts, className }: { facts: QuickFact[]; className?: string }) {
  if (facts.length === 0) return null;

  return (
    <Card className={cn(className)} aria-labelledby="quick-facts-heading">
      <h2
        id="quick-facts-heading"
        className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
      >
        Quick facts
      </h2>
      <dl className="mt-4 space-y-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-0.5 border-b border-[var(--sg-color-border)] pb-3 last:border-0 last:pb-0"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {fact.label}
            </dt>
            <dd className="text-sm font-semibold text-[var(--sg-color-text)]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function SoftwareSidebarAlternatives({
  items,
  className,
}: {
  items: SidebarAlternative[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Card className={cn(className)} aria-labelledby="sidebar-alternatives-heading">
      <h2
        id="sidebar-alternatives-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Alternatives
      </h2>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block rounded-[var(--sg-radius-md)] border border-transparent px-1 py-0.5 hover:border-[var(--sg-color-border)]"
            >
              <span className="block text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 group-hover:text-[var(--sg-color-primary)] group-hover:underline">
                {item.name}
              </span>
              {item.description ? (
                <span className="mt-0.5 block line-clamp-2 text-xs text-[var(--sg-color-text-muted)]">
                  {item.description}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function SoftwareSidebarGuides({
  items,
  className,
}: {
  items: SidebarGuide[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Card className={cn(className)} aria-labelledby="sidebar-guides-heading">
      <h2
        id="sidebar-guides-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Related guides
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/guides/"
        className="mt-3 inline-flex text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        {withSingleArrow("All guides")}
      </Link>
    </Card>
  );
}

export function SoftwareOnThisPage({
  items,
  className,
}: {
  items: TocItem[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Card className={cn(className)} aria-labelledby="on-page-heading">
      <h2
        id="on-page-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        On this page
      </h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export type RelatedComparison = {
  href: string;
  label: string;
};

export function SoftwareRelatedComparisons({
  items,
  className,
}: {
  items: RelatedComparison[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Card className={cn(className)} aria-labelledby="related-comparisons-heading">
      <h2
        id="related-comparisons-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Related comparisons
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between gap-2 text-sm text-[var(--sg-color-text)]"
            >
              <span className="underline-offset-2 group-hover:underline">
                {item.label}
              </span>
              <span className="shrink-0 text-[var(--sg-color-primary)]">
                {withSingleArrow("Compare")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
