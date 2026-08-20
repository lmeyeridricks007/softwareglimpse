"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  OVERALL_FIT_DISPLAY,
  type LeaderRationale,
  type OverallFitLabel,
  type ProductScorecardResult,
} from "@/services/vendor-scorecard";

function fitBadgeVariant(
  fit: OverallFitLabel,
): "success" | "primary" | "warning" | "danger" | "neutral" {
  switch (fit) {
    case "excellent-fit":
    case "strong-fit":
      return "success";
    case "good-fit":
      return "primary";
    case "conditional-fit":
      return "warning";
    case "poor-fit":
      return "danger";
    default:
      return "neutral";
  }
}

type Logo = { src: string; alt: string } | null | undefined;

export function ScorecardResultsSummary({
  leader,
  runnerUp,
  rationale,
  leaderLogo,
  runnerUpLogo,
  userAverage,
  estimatedCostLabel,
}: {
  leader: ProductScorecardResult;
  runnerUp: ProductScorecardResult | null;
  rationale: LeaderRationale;
  leaderLogo?: Logo;
  runnerUpLogo?: Logo;
  userAverage?: number | null;
  estimatedCostLabel?: string | null;
}) {
  const mh = leader.mustHaveSummary;

  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/40 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Top fit for your priorities
        </p>
        <div className="mt-3 flex flex-wrap items-start gap-4">
          {leaderLogo ? (
            <Image
              src={leaderLogo.src}
              alt=""
              width={48}
              height={48}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] object-contain p-1"
            />
          ) : (
            <span className="flex size-12 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-sm font-bold text-[var(--sg-color-navy)]">
              {leader.productName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--sg-color-navy)]">
                {leader.productName}
              </h3>
              <Badge variant={fitBadgeVariant(leader.overallFit)}>
                {OVERALL_FIT_DISPLAY[leader.overallFit]}
              </Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--sg-color-text)]">
              {rationale.headline}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5">
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Weighted research fit
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-[var(--sg-color-navy)]">
                  {leader.weightedResearchScore != null
                    ? `${leader.weightedResearchScore}/10`
                    : "Qualitative only"}
                </dd>
              </div>
              <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5">
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Research confidence
                </dt>
                <dd className="mt-0.5 text-sm font-semibold capitalize text-[var(--sg-color-navy)]">
                  {leader.researchConfidence}
                </dd>
              </div>
              <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5">
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  {userAverage != null ? "Your evaluation" : "Estimated cost"}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-[var(--sg-color-navy)]">
                  {userAverage != null
                    ? `${userAverage.toFixed(1)} / 5`
                    : (estimatedCostLabel ?? "—")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Must-have status">
          <span className="inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-success)] ring-1 ring-[var(--sg-color-border)]">
            <span className="size-1.5 rounded-full bg-[var(--sg-color-success)]" aria-hidden />
            {mh.satisfied} satisfied
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface)] px-2.5 py-1 text-xs font-medium ring-1 ring-[var(--sg-color-border)]",
              mh.failed > 0
                ? "text-[var(--sg-color-danger)]"
                : "text-[var(--sg-color-text-muted)]",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                mh.failed > 0
                  ? "bg-[var(--sg-color-danger)]"
                  : "bg-[var(--sg-color-border-strong)]",
              )}
              aria-hidden
            />
            {mh.failed} failed
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface)] px-2.5 py-1 text-xs font-medium ring-1 ring-[var(--sg-color-border)]",
              mh.unknown > 0 ? "text-amber-700" : "text-[var(--sg-color-text-muted)]",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                mh.unknown > 0 ? "bg-amber-500" : "bg-[var(--sg-color-border-strong)]",
              )}
              aria-hidden
            />
            {mh.unknown} unresolved
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/60 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            Why {leader.productName} leads
          </h4>
          {rationale.whyLeads.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text)]">
              {rationale.whyLeads.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-[var(--sg-color-success)]" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              Not enough approved criterion evidence to list specific strengths
              yet.
            </p>
          )}
          {rationale.vsRunnerUp ? (
            <p className="mt-3 border-t border-[var(--sg-color-border)] pt-3 text-sm text-[var(--sg-color-text)]">
              {rationale.vsRunnerUp}.
            </p>
          ) : null}
        </div>

        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/60 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Before you decide
          </h4>
          {rationale.watchOuts.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text)]">
              {rationale.watchOuts.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-amber-600" aria-hidden>
                    ⚠
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              No major open issues surfaced from the current evidence set.
            </p>
          )}
        </div>
      </div>

      {runnerUp ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3">
          {runnerUpLogo ? (
            <Image
              src={runnerUpLogo.src}
              alt=""
              width={28}
              height={28}
              className="rounded object-contain"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Runner-up
            </p>
            <p className="text-sm text-[var(--sg-color-text)]">
              <strong className="text-[var(--sg-color-navy)]">
                {runnerUp.productName}
              </strong>
              {" · "}
              {OVERALL_FIT_DISPLAY[runnerUp.overallFit]}
              {runnerUp.strongestAreas[0]
                ? ` — stronger on ${runnerUp.strongestAreas[0]}`
                : null}
              {runnerUp.weightedResearchScore != null
                ? ` (${runnerUp.weightedResearchScore}/10)`
                : null}
            </p>
          </div>
        </div>
      ) : null}

      <p className="text-xs text-[var(--sg-color-text-muted)]">
        This is personalized to your scorecard priorities and available
        SoftwareGlimpse evidence — not a claim that {leader.productName} is the
        best CRM overall. Affiliate relationships do not influence this ranking.
      </p>
    </div>
  );
}
