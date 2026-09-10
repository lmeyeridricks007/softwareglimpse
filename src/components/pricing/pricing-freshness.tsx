"use client";

type Props = {
  verifiedAt?: string;
  fixture?: boolean;
  /** Active OUTDATED_PRICING mark — must be visible when system knows prices are stale. */
  outdatedPricing?: boolean;
  outdatedReason?: string;
  className?: string;
};

export function PricingFreshness({
  verifiedAt,
  fixture,
  outdatedPricing,
  outdatedReason,
  className,
}: Props) {
  const checked = verifiedAt
    ? new Date(verifiedAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <p className={className ?? "text-xs text-[var(--color-fg-muted)]"}>
      {outdatedPricing ? (
        <>
          <span className="font-medium text-[var(--color-fg)]">
            Pricing status: OUTDATED_PRICING.
          </span>{" "}
          {outdatedReason
            ? `${outdatedReason} `
            : "Dependent pricing may be stale pending verification or refresh. "}
        </>
      ) : null}
      {checked ? `Pricing verified: ${checked}. ` : "Pricing verification date unknown. "}
      {fixture
        ? "Fixture research — not claimed as live vendor pricing."
        : "Based on verified public pricing where available."}
    </p>
  );
}
