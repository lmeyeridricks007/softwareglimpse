import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProductLogo } from "@/components/software/product-logo";
import type { ProductIndustryAssessment } from "@/services/product-industry-assessment";
import { cn } from "@/lib/cn";

function fitBadgeVariant(
  fit: ProductIndustryAssessment["fitLabel"],
): "success" | "primary" | "warning" | "neutral" | "danger" {
  if (fit === "Strong") return "success";
  if (fit === "Good") return "primary";
  if (fit === "Partial") return "warning";
  if (fit === "Limited" || fit === "Emerging") return "warning";
  return "neutral";
}

/**
 * Product × industry recommendation card.
 * Demos live in #see-in-industry — this module does not embed players or chip walls.
 */
export function ProductIndustryAssessment({
  assessment,
  className,
  headingLevel = "h2",
}: {
  assessment: ProductIndustryAssessment;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const HeadingTag = headingLevel;
  const workflows = assessment.bestAlignedUseCases.slice(0, 3);

  return (
    <article
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-6",
        className,
      )}
      aria-labelledby={`pia-${assessment.productSlug}-heading`}
    >
      <div className="flex flex-wrap items-start gap-3">
        <ProductLogo
          name={assessment.productName}
          logo={assessment.logo}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <HeadingTag
            id={`pia-${assessment.productSlug}-heading`}
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)] sm:text-xl"
          >
            {assessment.productName}
          </HeadingTag>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={fitBadgeVariant(assessment.fitLabel)}>
              {assessment.fitLabel} fit
            </Badge>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--sg-color-text)]">
        {assessment.evidenceSummary}
      </p>

      {workflows.length > 0 ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          <span className="font-medium text-[var(--sg-color-text)]">
            Workflows:{" "}
          </span>
          {workflows.map((item, index) => (
            <span key={item.id}>
              {index > 0 ? (
                <span aria-hidden className="text-[var(--sg-color-border)]">
                  {" "}
                  ·{" "}
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </span>
          ))}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Recommendation confidence: {assessment.evidenceConfidence}.{" "}
        {assessment.methodologyNote}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--sg-color-border)] pt-4">
        <ButtonLink href={assessment.reviewHref} size="sm" variant="secondary">
          Review
        </ButtonLink>
        <ButtonLink href={assessment.compareHref} size="sm" variant="ghost">
          Compare
        </ButtonLink>
        <ButtonLink href={assessment.evidenceHref} size="sm" variant="ghost">
          See demos
        </ButtonLink>
      </div>
    </article>
  );
}

export function ProductIndustryAssessmentSection({
  industryLabel,
  assessments,
  className,
}: {
  industryLabel: string;
  assessments: ProductIndustryAssessment[];
  className?: string;
}) {
  if (assessments.length === 0) return null;

  return (
    <section
      id="product-industry-recommendations"
      aria-labelledby="product-industry-recommendations-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="product-industry-recommendations-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        CRM recommendations for {industryLabel.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Products we recommend evaluating for this industry’s workflows — based
        on editorial fit, not vendor demos or affiliate relationships.
      </p>
      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {assessments.map((assessment) => (
          <li key={assessment.productSlug}>
            <ProductIndustryAssessment
              assessment={assessment}
              headingLevel="h3"
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
