import Link from "next/link";
import { ComparisonTabLink } from "@/components/comparison/page/comparison-page-client";
import { ComparisonBottomCta } from "@/components/comparison/page/bottom-cta";
import { RelatedDiscovery } from "@/components/comparison/page/related-discovery";
import { ScorecardPreview } from "@/components/comparison/page/scorecard-shared";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

const METHODOLOGY_STEPS = [
  {
    title: "Collect",
    body: "Collect official product information, pricing, and product evidence.",
  },
  {
    title: "Normalize",
    body: "Map evidence to the same category evaluation criteria for both products.",
  },
  {
    title: "Compare",
    body: "Evaluate both products against identical criteria — ties and depends are allowed.",
  },
  {
    title: "Explain",
    body: "Show why each product wins, loses, or ties, with evidence behind the outcome.",
  },
];

export function ComparisonOverviewTab({ model }: Props) {
  const hasChoose =
    model.productA.bestFor.length > 0 || model.productB.bestFor.length > 0;

  return (
    <div className="space-y-12">
      {model.criteria.length > 0 ? (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
                {model.productA.name} vs {model.productB.name} at a glance
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Criterion-level leaders from verified research.
              </p>
            </div>
            <ComparisonTabLink
              tab="scorecard"
              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Full scorecard →
            </ComparisonTabLink>
          </div>
          <ScorecardPreview
            criteria={model.criteria}
            nameA={model.productA.name}
            nameB={model.productB.name}
            className="mt-5"
          />
        </section>
      ) : null}

      {model.decisionCards.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Which {model.categoryLabel ?? "product"} is better for you?
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Quick picks based on fit — not a universal ranking.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {model.decisionCards.map((card) => {
              const isA = card.winnerSlug === model.productA.slug;
              return (
                <li key={card.id}>
                  <Card
                    className={
                      isA
                        ? "h-full border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/35"
                        : "h-full border-[var(--sg-color-danger)]/20 bg-[var(--sg-color-danger-soft)]/30"
                    }
                  >
                    <Badge variant={isA ? "success" : "danger"} className="w-fit">
                      → {card.winnerName}
                    </Badge>
                    <h3 className="mt-3 font-semibold text-[var(--sg-color-text)]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                      {card.explanation}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {model.keyDifferences.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            The biggest differences
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Where the products diverge most clearly on verified criteria.
          </p>
          <ul className="mt-5 space-y-4">
            {model.keyDifferences.map((diff) => (
              <li key={diff.id}>
                <Card className="overflow-hidden p-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] px-5 py-3">
                    <h3 className="font-semibold text-[var(--sg-color-text)]">
                      {diff.title}
                    </h3>
                    {diff.winnerName ? (
                      <Badge
                        variant={
                          diff.winnerName === "Tie" ||
                          diff.winnerName === "Depends"
                            ? "primary"
                            : "success"
                        }
                      >
                        {diff.winnerName === "Tie" ||
                        diff.winnerName === "Depends"
                          ? diff.winnerName
                          : `${diff.winnerName} wins`}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="grid gap-0 sm:grid-cols-2">
                    <div className="border-b border-[var(--sg-color-border)] px-5 py-4 sm:border-b-0 sm:border-r">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                        {diff.leftLabel}
                      </p>
                      <p className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
                        {diff.leftBody}
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
                        {diff.rightLabel}
                      </p>
                      <p className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
                        {diff.rightBody}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasChoose ? (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Which should you choose?
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {model.productA.bestFor.length > 0 ? (
              <Card className="border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/40">
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  Choose {model.productA.name} if
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {model.productA.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}
            {model.productB.bestFor.length > 0 ? (
              <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30">
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  Choose {model.productB.name} if
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {model.productB.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        </section>
      ) : null}

      <RelatedDiscovery model={model} />

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          How we compare
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          A short look at the comparison process.{" "}
          <Link
            href={model.methodologyHref}
            className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
          >
            Full methodology
          </Link>
        </p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METHODOLOGY_STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full border-[var(--sg-color-primary)]/15 bg-[var(--sg-color-surface-tint)]/70">
                <p className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-xs font-bold text-white">
                  {index + 1}
                </p>
                <h3 className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {step.body}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <ComparisonBottomCta model={model} />
    </div>
  );
}
