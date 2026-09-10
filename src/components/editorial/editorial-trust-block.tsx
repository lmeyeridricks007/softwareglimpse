import Link from "next/link";
import type { ReactNode } from "react";
import type { Author, EditorialTrustMetadata } from "@/domain";
import { EVIDENCE_LEVEL_LABELS } from "@/domain/schemas/editorial-trust";
import { EvidenceLevelBadge } from "@/components/editorial/evidence-level-badge";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
} from "@/services/site-foundation/config";
import { cn } from "@/lib/cn";

export type EditorialTrustVariant = "default" | "guide" | "review" | "comparison";

type Props = {
  trust: EditorialTrustMetadata;
  author?: Author | null;
  reviewer?: Author | null;
  className?: string;
  /** Hide rows that would only repeat a parent byline */
  compact?: boolean;
  /**
   * Page-type placement — keeps chrome light:
   * - guide: Written by · Last updated · Methodology (+ evidence when compact allows)
   * - review: full trust surface
   * - comparison: Evidence · Pricing · Testing · Methodology
   */
  variant?: EditorialTrustVariant;
};

function formatShortDate(iso?: string | null): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-sm">
      <dt className="text-[var(--sg-color-text-muted)]">{label}</dt>
      <dd className="font-medium text-[var(--sg-color-text)]">{children}</dd>
    </div>
  );
}

/**
 * Subtle editorial trust block for reviews, comparisons, and guides.
 * Renders only fields with real data — never fabricates authors, dates, or testing.
 */
export function EditorialTrustBlock({
  trust,
  author,
  reviewer,
  className,
  compact = false,
  variant = "default",
}: Props) {
  const lastUpdated = formatShortDate(trust.lastUpdated);
  const pricingChecked = formatShortDate(trust.pricingVerifiedAt);
  const researchDate = formatShortDate(trust.researchDate);
  const testedAt = formatShortDate(trust.testedAt);
  const methodologyHref = COMPANY_ROUTES.methodology;
  const methodologyLabel = trust.methodologyVersion
    ? `Methodology v${trust.methodologyVersion}`
    : "Methodology";

  const showAuthor = variant !== "comparison" && Boolean(author);
  const showReviewer =
    variant === "review" || variant === "default"
      ? Boolean(reviewer && reviewer.id !== author?.id)
      : false;
  // Guides stay light: author · updated · methodology (skip evidence/pricing chrome)
  const showEvidence =
    variant !== "guide" && Boolean(trust.evidenceLevel);
  const showLastUpdated =
    variant === "comparison" ? false : Boolean(lastUpdated);
  const showPricing =
    variant === "guide" ? false : Boolean(pricingChecked);
  const showResearchDate =
    (variant === "review" || variant === "default") && Boolean(researchDate);
  const showTesting =
    (variant === "review" ||
      variant === "comparison" ||
      variant === "default") &&
    Boolean(testedAt) &&
    trust.handsOnTesting === true;

  const hasPeople = showAuthor || showReviewer;
  const hasDates =
    showLastUpdated || showPricing || showResearchDate || showTesting;
  const hasMethod = true; // always offer methodology / how-we-review link

  if (!hasPeople && !hasDates && !hasMethod && !showEvidence) {
    return null;
  }

  return (
    <aside
      className={cn(
        "space-y-3 border-b border-[var(--sg-color-border)] pb-6",
        className,
      )}
      aria-label="Editorial trust"
    >
      <dl className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-6 sm:gap-y-2">
        {showAuthor && author ? (
          <MetaRow label="Written by">
            <Link
              href={COMPANY_ROUTES.myStory}
              className="underline-offset-2 hover:underline"
            >
              {author.name}
            </Link>
            {author.role && !compact ? (
              <span className="ml-1 font-normal text-[var(--sg-color-text-muted)]">
                · {author.role}
              </span>
            ) : null}
          </MetaRow>
        ) : null}

        {showReviewer && reviewer ? (
          <MetaRow label="Reviewed by">
            <span>{reviewer.name}</span>
          </MetaRow>
        ) : null}

        {showEvidence && trust.evidenceLevel ? (
          <MetaRow
            label={variant === "comparison" ? "Research status" : "Evidence"}
          >
            <EvidenceLevelBadge
              level={trust.evidenceLevel}
              testedAt={trust.testedAt}
              pricingVerifiedAt={trust.pricingVerifiedAt}
              researchDate={trust.researchDate}
            />
          </MetaRow>
        ) : null}

        {showLastUpdated && lastUpdated ? (
          <MetaRow label="Last updated">
            <time dateTime={trust.lastUpdated}>{lastUpdated}</time>
          </MetaRow>
        ) : null}

        {showResearchDate && researchDate ? (
          <MetaRow label="Researched">
            <time dateTime={trust.researchDate}>{researchDate}</time>
          </MetaRow>
        ) : null}

        {showPricing && pricingChecked ? (
          <MetaRow label="Pricing verified">
            <time dateTime={trust.pricingVerifiedAt}>{pricingChecked}</time>
          </MetaRow>
        ) : null}

        {showTesting && testedAt ? (
          <MetaRow label="Hands-on tested">
            <time dateTime={trust.testedAt}>{testedAt}</time>
          </MetaRow>
        ) : variant === "comparison" && !trust.handsOnTesting ? (
          <MetaRow label="Testing coverage">
            <span className="font-normal text-[var(--sg-color-text-muted)]">
              Research/data-based — no completed hands-on session on file
            </span>
          </MetaRow>
        ) : null}

        <MetaRow label="Methodology">
          <Link
            href={
              trust.methodologySlug || trust.methodologyVersion
                ? methodologyHref
                : COMPANY_ROUTES.howWeReview
            }
            className="underline-offset-2 hover:underline"
          >
            {trust.methodologySlug || trust.methodologyVersion
              ? methodologyLabel
              : "How we review"}
          </Link>
        </MetaRow>
      </dl>

      {!compact && variant !== "guide" ? (
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          {EVIDENCE_LEVEL_LABELS[trust.evidenceLevel]}. Affiliate relationships
          do not set rankings.{" "}
          <Link
            href={LEGAL_ROUTES.affiliateDisclosure}
            className="underline-offset-2 hover:underline"
          >
            Disclosure
          </Link>
          {" · "}
          <Link
            href={LEGAL_ROUTES.correctionsPolicy}
            className="underline-offset-2 hover:underline"
          >
            Corrections
          </Link>
        </p>
      ) : null}
    </aside>
  );
}
