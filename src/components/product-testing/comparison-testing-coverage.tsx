import type { PublicHandsOnTestSummary } from "@/domain";
import { cn } from "@/lib/cn";

type Props = {
  productAName: string;
  productBName: string;
  productASlug: string;
  productBSlug: string;
  summaryA: PublicHandsOnTestSummary | null;
  summaryB: PublicHandsOnTestSummary | null;
  className?: string;
};

/**
 * Comparison evidence coverage callout.
 * Never implies equivalent testing when only one side has hands-on evidence.
 */
export function ComparisonTestingCoverage({
  productAName,
  productBName,
  summaryA,
  summaryB,
  className,
}: Props) {
  const a = Boolean(summaryA);
  const b = Boolean(summaryB);

  if (!a && !b) {
    return (
      <aside
        className={cn(
          "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]",
          className,
        )}
      >
        This comparison is based on structured research and category methodology.
        Neither product has a completed SoftwareGlimpse hands-on test session on
        record.
      </aside>
    );
  }

  if (a && b) {
    return (
      <aside
        className={cn(
          "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]",
          className,
        )}
      >
        <p className="font-medium text-[var(--sg-color-text)]">
          Both products have hands-on test evidence
        </p>
        <p className="mt-1">
          {productAName} tested {formatMonth(summaryA!.testedAt)}
          {summaryA!.planTested ? ` (${summaryA!.planTested})` : ""}.{" "}
          {productBName} tested {formatMonth(summaryB!.testedAt)}
          {summaryB!.planTested ? ` (${summaryB!.planTested})` : ""}. First-hand
          observations can strengthen this comparison where tasks overlap — still
          treat plan differences and test dates carefully.
        </p>
      </aside>
    );
  }

  const testedName = a ? productAName : productBName;
  const researchedName = a ? productBName : productAName;
  const testedSummary = a ? summaryA! : summaryB!;

  return (
    <aside
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/40 bg-[var(--sg-color-warning-soft)] px-4 py-3 text-sm text-[var(--sg-color-text)]",
        className,
      )}
    >
      <p className="font-medium">Uneven testing coverage</p>
      <p className="mt-1 text-[var(--sg-color-text-muted)]">
        {testedName} has a completed hands-on test (
        {formatMonth(testedSummary.testedAt)}
        {testedSummary.planTested ? `, ${testedSummary.planTested}` : ""}).{" "}
        {researchedName} is covered by research-based analysis only. Do not treat
        both sides as equivalently hands-on tested.
      </p>
    </aside>
  );
}

function formatMonth(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
