import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** e.g. "CRM" or "sales intelligence" */
  productNoun?: string;
};

/**
 * Methodology / trust section for pricing confidence.
 */
export function PricingMethodology({
  className,
  productNoun = "CRM",
}: Props) {
  return (
    <section
      id="pricing-methodology"
      className={cn(
        "scroll-mt-24 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-8",
        className,
      )}
      aria-labelledby="methodology-heading"
    >
      <h2
        id="methodology-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        How we calculate {productNoun} costs
      </h2>
      <div className="mt-4 space-y-3 text-sm text-[var(--sg-color-text-muted)]">
        <p>
          Estimates use verified public list prices captured in SoftwareGlimpse
          research for each product’s published plans and rules. We select the
          lowest suitable plan that can cover your required capabilities when
          the feature→plan matrix supports that decision.
        </p>
        <p>
          <strong className="font-medium text-[var(--sg-color-text)]">
            Confidence
          </strong>{" "}
          reflects research completeness — fixture research, incomplete
          feature–plan matrices, stale checks, and unknown feature coverage
          lower confidence. Medium confidence means public data exists but one
          or more components may still need vendor confirmation.
        </p>
        <p>
          We never invent implementation, training, migration, or negotiated
          discounts. Missing components are omitted — not shown as $0. Affiliate
          relationships do not change amounts or sort order.
        </p>
        <p>
          <Link
            href="/company/editorial-methodology/"
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            How we evaluate software →
          </Link>
        </p>
      </div>
    </section>
  );
}
