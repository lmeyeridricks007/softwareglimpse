import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type StackSummaryRow = {
  id: string;
  label: string;
  value?: string;
  onEdit?: () => void;
};

type SummaryProps = {
  rows: StackSummaryRow[];
  completedSteps: number;
  totalSteps: number;
  className?: string;
};

export function StackBuilderSummaryCard({
  rows,
  completedSteps,
  totalSteps,
  className,
}: SummaryProps) {
  const pct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <Card className={cn(className)} aria-labelledby="stack-summary-heading">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="stack-summary-heading"
          className="text-sm font-semibold text-[var(--sg-color-text)]"
        >
          Your stack summary
        </h2>
        <Badge variant={completedSteps >= totalSteps ? "success" : "neutral"}>
          {completedSteps >= totalSteps ? "Ready" : "Draft"}
        </Badge>
      </div>

      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        {completedSteps}/{totalSteps} steps completed
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
        role="progressbar"
        aria-valuenow={completedSteps}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
      >
        <div
          className="h-full rounded-full bg-[var(--sg-color-primary)] transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-start justify-between gap-3 border-b border-[var(--sg-color-border)] pb-3 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {row.label}
              </p>
              <p className="mt-0.5 text-sm text-[var(--sg-color-text)]">
                {row.value ?? "Not set yet"}
              </p>
            </div>
            {row.onEdit ? (
              <button
                type="button"
                onClick={row.onEdit}
                className="shrink-0 text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Edit
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function StackBuilderCostCard({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50",
        className,
      )}
      aria-labelledby="stack-cost-heading"
    >
      <h2
        id="stack-cost-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Estimated stack cost
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        We do not invent a combined monthly total. Use the CRM Cost Calculator
        for seat pricing, then add other tools from vendor list
        prices.
      </p>
      <ButtonLink
        href="/tools/crm-cost-calculator/"
        variant="outline"
        className="mt-4 w-full justify-center bg-[var(--sg-color-surface)]"
      >
        Open CRM Cost Calculator
      </ButtonLink>
    </Card>
  );
}

export function StackBuilderFinderCard({ className }: { className?: string }) {
  return (
    <Card className={cn(className)} aria-labelledby="stack-finder-cta-heading">
      <div className="flex gap-2">
        <Compass
          className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
          aria-hidden
        />
        <div>
          <h2
            id="stack-finder-cta-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Need a CRM shortlist now?
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            CRM Finder is live today with deterministic fit scoring.
          </p>
          <ButtonLink href="/tools/crm-finder/" className="mt-3">
            Try CRM Finder
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}

export function StackBuilderToolsCard({
  items,
  className,
}: {
  items: Array<{ href: string; label: string }>;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Card className={cn(className)} aria-labelledby="stack-tools-heading">
      <h2
        id="stack-tools-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Popular tools
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between gap-2 text-sm text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-primary)]"
            >
              <span className="underline-offset-2 group-hover:underline">
                {item.label}
              </span>
              <ChevronRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
