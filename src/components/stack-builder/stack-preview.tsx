import Link from "next/link";
import {
  BarChart3,
  Binoculars,
  Calculator,
  Headset,
  Layers,
  Mail,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  STACK_CATEGORY_PREVIEWS,
  type StackCategoryPreview,
} from "./stack-builder-questions";

const ICONS: Record<string, LucideIcon> = {
  crm: Users,
  "sales-intelligence": Binoculars,
  "email-marketing": Mail,
  "project-management": Layers,
  "help-desk": Headset,
  accounting: Calculator,
  analytics: BarChart3,
};

const FILTERS = [
  { id: "all", label: "All categories" },
  { id: "customer", label: "Customer management" },
  { id: "marketing", label: "Marketing" },
  { id: "operations", label: "Operations" },
  { id: "finance", label: "Finance" },
] as const;

type Props = {
  filter: string;
  onFilterChange: (id: string) => void;
  selectedRequirementIds: string[];
  complete: boolean;
  onContinue: () => void;
  className?: string;
};

export function StackPreviewPanel({
  filter,
  onFilterChange,
  selectedRequirementIds,
  complete,
  onContinue,
  className,
}: Props) {
  const items = STACK_CATEGORY_PREVIEWS.filter((item) => {
    if (filter === "all") return true;
    return item.group === filter;
  });

  return (
    <section
      className={cn("mt-8", className)}
      aria-labelledby="stack-preview-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="stack-preview-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            Your recommended stack
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            CRM and sales intelligence available now · More categories being
            added
          </p>
        </div>
        {!complete ? <Badge variant="warning">Coming soon</Badge> : null}
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Stack category filters"
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onFilterChange(f.id)}
              className={cn(
                "rounded-[var(--sg-radius-pill)] px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)]"
                  : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <CategoryPreviewCard
              item={item}
              highlighted={selectedRequirementIds.includes(item.id)}
            />
          </li>
        ))}
      </ul>

      {!complete ? (
        <div className="mt-6 flex flex-col gap-3 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            <span className="font-semibold text-[var(--sg-color-text)]">
              Complete all 5 steps
            </span>{" "}
            to lock your profile and jump into the live CRM and sales
            intelligence tools that already ship.
          </p>
          <Button
            type="button"
            onClick={onContinue}
            className="shrink-0 bg-[var(--sg-color-success)] hover:opacity-90"
          >
            Continue building →
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function CategoryPreviewCard({
  item,
  highlighted,
}: {
  item: StackCategoryPreview;
  highlighted: boolean;
}) {
  const Icon = ICONS[item.id] ?? Layers;
  return (
    <Card
      className={cn(
        "h-full",
        highlighted && "border-[var(--sg-color-primary)]/40 ring-1 ring-[var(--sg-color-primary-soft)]",
      )}
    >
      <Icon
        className="size-6 text-[var(--sg-color-primary)]"
        aria-hidden
      />
      <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
        {item.title}
      </p>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        {item.description}
      </p>
      {item.availableHref ? (
        <ButtonLink
          href={item.availableHref}
          size="sm"
          className="mt-4"
        >
          {item.availableLabel ?? "Open tool"}
        </ButtonLink>
      ) : (
        <p className="mt-4 text-sm font-medium text-[var(--sg-color-text-muted)]">
          Coming soon
        </p>
      )}
      {!item.availableHref ? (
        <Link
          href="/categories/"
          className="mt-2 inline-flex text-xs text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Browse categories
        </Link>
      ) : null}
    </Card>
  );
}
