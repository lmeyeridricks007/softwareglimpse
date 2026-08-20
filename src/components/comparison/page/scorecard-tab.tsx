"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  NumericBar,
  QualitativeBar,
  strengthLabel,
  strengthTone,
} from "@/components/comparison/page/scorecard-shared";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

export function ComparisonScorecardTab({ model }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  if (model.criteria.length === 0) {
    return (
      <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
        Criterion outcomes are not available for this comparison yet.
      </Card>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        Comparison scorecard
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Criterion-by-criterion results for {model.productA.name} and{" "}
        {model.productB.name}. Numeric bars appear only when both products have
        approved scores.
      </p>

      <ul className="mt-6 space-y-4">
        {model.criteria.map((row) => {
          const open = openSlug === row.slug;
          const bothScores = row.scoreA != null && row.scoreB != null;
          const hasEvidence =
            Boolean(row.evidenceSummary) ||
            Boolean(row.confidence) ||
            Boolean(row.researchStatus);

          return (
            <li key={row.slug}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--sg-color-text)]">
                      {row.name}
                    </h3>
                    {row.description ? (
                      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                        {row.description}
                      </p>
                    ) : null}
                  </div>
                  {row.winnerName ? (
                    <Badge
                      variant={
                        row.winnerName === "Tie" || row.winnerName === "Depends"
                          ? "neutral"
                          : "success"
                      }
                    >
                      {row.winnerName}
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  {row.label}
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {model.productA.name}
                      </span>
                      <Badge variant={strengthTone(row.strengthA)}>
                        {bothScores && row.scoreA != null
                          ? `${row.scoreA}/10`
                          : strengthLabel(row.strengthA)}
                      </Badge>
                    </div>
                    {bothScores && row.scoreA != null ? (
                      <NumericBar score={row.scoreA} className="mt-2" />
                    ) : (
                      <QualitativeBar
                        strength={row.strengthA}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {model.productB.name}
                      </span>
                      <Badge variant={strengthTone(row.strengthB)}>
                        {bothScores && row.scoreB != null
                          ? `${row.scoreB}/10`
                          : strengthLabel(row.strengthB)}
                      </Badge>
                    </div>
                    {bothScores && row.scoreB != null ? (
                      <NumericBar score={row.scoreB} className="mt-2" />
                    ) : (
                      <QualitativeBar
                        strength={row.strengthB}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>

                {hasEvidence ? (
                  <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenSlug(open ? null : row.slug)}
                      className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {open ? "Hide evidence" : "Why this result?"}
                    </button>
                    {open ? (
                      <div className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
                        {row.evidenceSummary ? (
                          <p>{row.evidenceSummary}</p>
                        ) : null}
                        {row.confidence ? (
                          <p>
                            Confidence:{" "}
                            <span className="font-medium text-[var(--sg-color-text)]">
                              {row.confidence}
                            </span>
                          </p>
                        ) : null}
                        {row.researchStatus ? (
                          <p>
                            Research status:{" "}
                            <span className="font-medium text-[var(--sg-color-text)]">
                              {row.researchStatus}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
