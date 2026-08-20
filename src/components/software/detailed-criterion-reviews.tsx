import { Check, Minus } from "lucide-react";
import {
  ReviewCriterionScore,
  type ReviewVerdictLabel,
} from "@/components/software/review-criterion-score";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type DetailedCriterionSection = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  score?: number;
  scoreApproved?: boolean;
  verdictLabel?: ReviewVerdictLabel;
  strengths?: string[];
  weaknesses?: string[];
  evidenceLabels?: string[];
  claimType?: string;
};

export type DetailedCriterionReviewsProps = {
  productName: string;
  sections: DetailedCriterionSection[];
  className?: string;
};

export function DetailedCriterionReviews({
  productName,
  sections,
  className,
}: DetailedCriterionReviewsProps) {
  if (sections.length === 0) return null;

  return (
    <section
      id="review"
      aria-labelledby="review-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="review-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {productName} review in detail
      </h2>

      <div className="mt-6 max-w-3xl space-y-10">
        {sections.map((section) => {
          const strengths = section.strengths ?? [];
          const weaknesses = section.weaknesses ?? [];
          const evidenceLabels = section.evidenceLabels ?? [];

          return (
            <article key={section.id} aria-labelledby={`${section.id}-heading`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3
                  id={`${section.id}-heading`}
                  className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]"
                >
                  {section.title}
                </h3>
                <ReviewCriterionScore
                  score={section.score}
                  scoreApproved={section.scoreApproved}
                  verdictLabel={section.verdictLabel}
                />
              </div>

              <p className="mt-3 text-[length:var(--sg-text-body-lg)] leading-relaxed text-[var(--sg-color-text-muted)]">
                {section.summary}
              </p>

              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-4 text-sm leading-relaxed text-[var(--sg-color-text-muted)]"
                >
                  {paragraph}
                </p>
              ))}

              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {strengths.length > 0 ? (
                    <Card
                      variant="soft"
                      className="bg-[var(--sg-color-success-soft)]/30"
                    >
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                        Strengths
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {strengths.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
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
                  {weaknesses.length > 0 ? (
                    <Card
                      variant="soft"
                      className="bg-[var(--sg-color-warning-soft)]/35"
                    >
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-warning)]">
                        Weaknesses
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {weaknesses.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
                          >
                            <Minus
                              className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
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

              {evidenceLabels.length > 0 ? (
                <details className="group mt-5 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--sg-color-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="group-open:text-[var(--sg-color-primary)]">
                      View supporting research
                    </span>
                  </summary>
                  <ul className="border-t border-[var(--sg-color-border)] px-4 py-3">
                    {evidenceLabels.map((label) => (
                      <li
                        key={label}
                        className="py-1.5 text-sm text-[var(--sg-color-text-muted)]"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
