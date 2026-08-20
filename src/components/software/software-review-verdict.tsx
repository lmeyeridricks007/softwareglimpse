import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  productName: string;
  verdict?: string | null;
  bottomLine?: string | null;
  bestFor?: string[];
  notIdealFor?: string[];
  provisional?: boolean;
  className?: string;
};

export function SoftwareReviewVerdict({
  productName,
  verdict,
  bottomLine,
  bestFor = [],
  notIdealFor = [],
  provisional = false,
  className,
}: Props) {
  const hasVerdict = Boolean(verdict?.trim());
  const hasBestFor = bestFor.length > 0;
  const hasNotIdeal = notIdealFor.length > 0;
  const hasBottomLine = Boolean(bottomLine?.trim());

  if (!hasVerdict && !hasBestFor && !hasNotIdeal && !hasBottomLine) {
    return null;
  }

  const showProgressBadge = provisional && !hasVerdict;

  return (
    <section
      id="verdict"
      aria-labelledby="verdict-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2
          id="verdict-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold uppercase tracking-wide text-[var(--sg-color-text)]"
        >
          Our verdict
        </h2>
        {showProgressBadge ? (
          <Badge variant="warning">Assessment in progress</Badge>
        ) : null}
      </div>

      {hasVerdict ? (
        <p className="mt-4 max-w-3xl text-[length:var(--sg-text-body-lg)] leading-relaxed text-[var(--sg-color-text-muted)]">
          {verdict}
        </p>
      ) : provisional ? (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          Our editorial team is still evaluating {productName}. Fit guidance
          below is based on product data — a full verdict publishes
          after review approval.
        </p>
      ) : null}

      {(hasBestFor || hasNotIdeal) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {hasBestFor ? (
            <Card variant="soft" className="bg-[var(--sg-color-success-soft)]/30">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                Best for
              </h3>
              <ul className="mt-3 space-y-2.5">
                {bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-[var(--sg-color-text-muted)]"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
          {hasNotIdeal ? (
            <Card variant="soft" className="bg-[var(--sg-color-danger-soft)]/25">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
                Not ideal for
              </h3>
              <ul className="mt-3 space-y-2.5">
                {notIdealFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-[var(--sg-color-text-muted)]"
                  >
                    <X
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      )}

      {hasBottomLine ? (
        <Card
          variant="soft"
          className="mt-6 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Bottom line
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text)]">
            {bottomLine}
          </p>
        </Card>
      ) : null}
    </section>
  );
}
