import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  industryName: string;
  importanceLabel?: string | null;
  coreObjective?: string | null;
  importantRequirementLabels?: string[];
  relatedCapabilityLabels?: string[];
  researchedProductCount: number;
  lastReviewedAt?: string | null;
  officialVideoCount?: number;
  screenshotCount?: number;
  className?: string;
};

export function CapabilityGlance({
  industryName,
  importanceLabel,
  coreObjective,
  importantRequirementLabels = [],
  relatedCapabilityLabels = [],
  researchedProductCount,
  lastReviewedAt,
  officialVideoCount = 0,
  screenshotCount = 0,
  className,
}: Props) {
  return (
    <Card
      aria-label="Capability at a glance"
      className={cn("p-5", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Capability at a glance
      </p>
      {importanceLabel ? (
        <Badge variant="success" className="mt-3">
          {importanceLabel} importance
        </Badge>
      ) : null}
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Industry
          </dt>
          <dd className="mt-0.5 text-[var(--sg-color-text)]">{industryName}</dd>
        </div>
        {coreObjective ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Core objective
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">{coreObjective}</dd>
          </div>
        ) : null}
        {importantRequirementLabels.length > 0 ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Most important requirements
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              {importantRequirementLabels.join(" · ")}
            </dd>
          </div>
        ) : null}
        {relatedCapabilityLabels.length > 0 ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Related capabilities
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              {relatedCapabilityLabels.slice(0, 4).join(" · ")}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Catalogue coverage
          </dt>
          <dd className="mt-0.5 text-[var(--sg-color-text)]">
            {researchedProductCount} CRM{" "}
            {researchedProductCount === 1 ? "product" : "products"}
          </dd>
        </div>
        {officialVideoCount > 0 || screenshotCount > 0 ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Visual evidence
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              Official videos {officialVideoCount}
              <br />
              Screenshots {screenshotCount}
            </dd>
            <a
              href="#capability-evidence"
              className="mt-1 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              See evidence →
            </a>
          </div>
        ) : null}
        {lastReviewedAt ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Last reviewed
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              {formatDate(lastReviewedAt)}
            </dd>
          </div>
        ) : null}
      </dl>
    </Card>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
