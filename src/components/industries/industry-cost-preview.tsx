import Link from "next/link";
import { CostRange } from "@/components/pricing/cost-range";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CurrencyCode } from "@/domain";
import { cn } from "@/lib/cn";

type CostPreview = {
  users: number;
  billing: "monthly" | "annual";
  lowestLabel: string | null;
  midpointLabel: string | null;
  highestLabel: string | null;
  lowestMinor: number | null;
  midpointMinor: number | null;
  highestMinor: number | null;
  currency: CurrencyCode | null;
  caption: string;
};

type Props = {
  title?: string;
  industryLabel?: string;
  preview: CostPreview | null;
  calculatorHref?: string;
  comparePricingHref?: string;
  className?: string;
};

export function IndustryCostPreview({
  title,
  industryLabel = "financial-services",
  preview,
  calculatorHref = "/tools/crm-cost-calculator/",
  comparePricingHref = "/compare/",
  className,
}: Props) {
  const heading =
    title ??
    `What does CRM cost for a ${industryLabel.toLowerCase()} team?`;

  return (
    <section
      id="costs"
      aria-labelledby="costs-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="costs-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {heading}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Estimates use verified list prices for a sample team configuration.
        Adjust seats and billing in the calculator for a tailored view.
      </p>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Team size
            </p>
            <p className="mt-1 font-medium">
              {preview?.users ?? 10} users
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Billing
            </p>
            <p className="mt-1 font-medium capitalize">
              {preview?.billing ?? "monthly"}
            </p>
          </div>
        </div>

        {preview &&
        preview.currency &&
        preview.lowestMinor != null &&
        preview.midpointMinor != null &&
        preview.highestMinor != null ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--sg-color-text)]">
              Estimated catalogue range
            </p>
            <CostRange
              className="mt-3"
              low={{
                amountMinor: preview.lowestMinor,
                currency: preview.currency,
              }}
              high={{
                amountMinor: preview.highestMinor,
                currency: preview.currency,
              }}
              markers={[
                {
                  label: "Lowest",
                  money: {
                    amountMinor: preview.lowestMinor,
                    currency: preview.currency,
                  },
                  tone: "success",
                },
                {
                  label: "Typical",
                  money: {
                    amountMinor: preview.midpointMinor,
                    currency: preview.currency,
                  },
                  tone: "primary",
                },
                {
                  label: "Highest",
                  money: {
                    amountMinor: preview.highestMinor,
                    currency: preview.currency,
                  },
                  tone: "muted",
                },
              ]}
              caption={preview.caption}
            />
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--sg-color-text-muted)]">
            Open the CRM Cost Calculator to estimate costs from list
            prices for your team size.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={calculatorHref}>
            {withSingleArrow("Calculate CRM costs")}
          </ButtonLink>
          <Link
            href={comparePricingHref}
            className="inline-flex items-center text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Compare CRM pricing
          </Link>
        </div>
      </Card>
    </section>
  );
}
