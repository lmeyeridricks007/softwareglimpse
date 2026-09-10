import Link from "next/link";
import type { EvidenceLevel } from "@/domain";
import {
  EVIDENCE_LEVEL_LABELS,
} from "@/domain/schemas/editorial-trust";
import { COMPANY_ROUTES } from "@/services/site-foundation/config";
import { cn } from "@/lib/cn";

const LEVEL_HINT: Record<EvidenceLevel, string> = {
  researched:
    "Based on structured research and category methodology — not recorded hands-on testing.",
  data_verified:
    "Key product data (such as pricing) has a verification timestamp. Not the same as hands-on testing.",
  hands_on_tested:
    "Hands-on testing is recorded with a test date in editorial metadata.",
};

type Props = {
  level: EvidenceLevel;
  testedAt?: string | null;
  pricingVerifiedAt?: string | null;
  researchDate?: string | null;
  className?: string;
  /** Compact single-line chip vs explanatory block */
  variant?: "badge" | "callout";
};

function formatMonthYear(iso?: string | null): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/**
 * Transparent evidence-state label.
 * Never shows "tested" merely because content was generated or researched.
 */
export function EvidenceLevelBadge({
  level,
  testedAt,
  pricingVerifiedAt,
  researchDate,
  className,
  variant = "badge",
}: Props) {
  const label = EVIDENCE_LEVEL_LABELS[level];
  const testedLabel = formatMonthYear(testedAt);
  const pricingLabel = formatMonthYear(pricingVerifiedAt);
  const researchLabel = formatMonthYear(researchDate);

  const detail =
    level === "hands_on_tested" && testedLabel
      ? `Hands-on tested ${testedLabel}`
      : level === "data_verified" && pricingLabel
        ? `Pricing verified ${pricingLabel}`
        : researchLabel
          ? `Research dated ${researchLabel}`
          : null;

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--sg-color-text-muted)]",
          className,
        )}
        title={LEVEL_HINT[level]}
      >
        <span className="font-medium text-[var(--sg-color-text)]">{label}</span>
        {detail ? (
          <span className="text-[var(--sg-color-text-muted)]">{detail}</span>
        ) : null}
      </span>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]",
        className,
      )}
      aria-label="Evidence level"
    >
      <p className="font-medium text-[var(--sg-color-text)]">{label}</p>
      {detail ? <p className="mt-1">{detail}</p> : null}
      <p className="mt-2 text-xs leading-relaxed">{LEVEL_HINT[level]}</p>
      <p className="mt-2 text-xs">
        <Link
          href={COMPANY_ROUTES.howWeReview}
          className="underline-offset-2 hover:underline"
        >
          How evidence levels work
        </Link>
      </p>
    </aside>
  );
}
