"use client";

type Props = {
  verifiedAt?: string;
  fixture?: boolean;
  className?: string;
};

export function PricingFreshness({ verifiedAt, fixture, className }: Props) {
  const checked = verifiedAt
    ? new Date(verifiedAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <p className={className ?? "text-xs text-[var(--color-fg-muted)]"}>
      {checked ? `Pricing verified: ${checked}. ` : "Pricing verification date unknown. "}
      {fixture
        ? "Fixture research — not claimed as live vendor pricing."
        : "Based on verified public pricing where available."}
    </p>
  );
}
