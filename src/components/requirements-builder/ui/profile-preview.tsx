"use client";

import { CheckCircle2, Circle, Lightbulb } from "lucide-react";
import type { CrmDecisionProfile } from "@/domain";
import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  labelForOption,
} from "@/components/finder/crm-finder-questions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  buildProfileCompleteness,
  listSelectableUseCasesForProfile,
} from "@/services/decision-profile/client";
import { INDUSTRY_OPTIONS } from "../crm/definition";
import { cn } from "@/lib/cn";

type Props = {
  profile: CrmDecisionProfile;
  className?: string;
  onReview?: () => void;
};

export function ProfilePreviewSidebar({ profile, className, onReview }: Props) {
  const completeness = buildProfileCompleteness(profile);
  const mustHave = profile.requirements.filter(
    (r) => r.priority === "must-have",
  ).length;
  const important = profile.requirements.filter(
    (r) => r.priority === "important",
  ).length;
  const useCaseNames = listSelectableUseCasesForProfile(profile);
  const industry =
    profile.businessContext.industrySlug &&
    (INDUSTRY_OPTIONS.find(
      (o) => o.value === profile.businessContext.industrySlug,
    )?.label ??
      profile.businessContext.industrySlug);

  return (
    <aside className={cn("space-y-4", className)}>
      <Card className="border-[var(--sg-color-primary)]/15 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              Your Requirements Profile
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
              Live summary
            </h2>
          </div>
          <Badge variant="neutral">Draft</Badge>
        </div>

        <ul className="mt-5 space-y-3">
          {completeness.sections.map((section) => (
            <li key={section.id} className="flex items-start gap-2 text-sm">
              {section.status === "complete" ? (
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
              ) : (
                <Circle
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-border)]"
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="font-medium text-[var(--sg-color-text)]">
                  {section.label}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                  {section.status === "complete"
                    ? sectionDetail(profile, section.id, industry, useCaseNames)
                    : section.status === "partial"
                      ? section.detail ?? "In progress"
                      : "Not started"}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--sg-color-border)] pt-4 text-sm">
          <div>
            <dt className="text-xs text-[var(--sg-color-text-muted)]">
              Must-have
            </dt>
            <dd className="font-semibold text-[var(--sg-color-navy)]">
              {mustHave}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--sg-color-text-muted)]">
              Important
            </dt>
            <dd className="font-semibold text-[var(--sg-color-navy)]">
              {important}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--sg-color-text-muted)]">Users</dt>
            <dd className="font-semibold text-[var(--sg-color-navy)]">
              {profile.businessContext.crmUserCount ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--sg-color-text-muted)]">Budget</dt>
            <dd className="font-semibold text-[var(--sg-color-navy)]">
              {profile.budget.band
                ? labelForOption(BUDGET_OPTIONS, profile.budget.band)
                : "—"}
            </dd>
          </div>
        </dl>

        {onReview ? (
          <button
            type="button"
            onClick={onReview}
            className="mt-4 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm font-medium text-[var(--sg-color-primary)] hover:bg-[var(--sg-color-primary-soft)]/40"
          >
            Review profile
          </button>
        ) : null}
      </Card>

      <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30 p-4">
        <div className="flex gap-3">
          <Lightbulb
            className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
            aria-hidden
          />
          <div>
            <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
              Why build your requirements?
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              A structured profile helps you evaluate vendors consistently —
              before affiliate links or product rankings enter the picture.
            </p>
          </div>
        </div>
      </Card>
    </aside>
  );
}

function sectionDetail(
  profile: CrmDecisionProfile,
  sectionId: string,
  industry: string | false | undefined,
  useCaseNames: ReturnType<typeof listSelectableUseCasesForProfile>,
): string {
  switch (sectionId) {
    case "business": {
      const parts = [
        industry || null,
        labelForOption(
          COMPANY_SIZE_OPTIONS,
          profile.businessContext.companySizeSlug,
        ),
        profile.businessContext.crmUserCount != null
          ? `${profile.businessContext.crmUserCount} users`
          : null,
      ].filter(Boolean);
      return parts.join(", ") || "Complete";
    }
    case "use-cases":
      return (
        profile.useCases
          .map(
            (u) =>
              useCaseNames.find((x) => x.slug === u.id)?.name ?? u.id,
          )
          .slice(0, 2)
          .join(", ") || `${profile.useCases.length} selected`
      );
    case "capabilities":
      return `${profile.capabilities.length} selected`;
    case "requirements": {
      const n = profile.requirements.filter(
        (r) => r.priority !== "not-needed",
      ).length;
      return `${n} selected`;
    }
    case "features":
      return `${profile.features.length} selected`;
    case "integrations":
      return profile.integrations.length
        ? `${profile.integrations.length} selected`
        : "Complete";
    default:
      return "Complete";
  }
}

export function industryOptions(): Array<{ value: string; label: string }> {
  return INDUSTRY_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
}

/** Compact mobile profile trigger summary. */
export function profilePreviewCounts(profile: CrmDecisionProfile): string {
  const n = profile.requirements.filter(
    (r) => r.priority !== "not-needed",
  ).length;
  return `${n} requirement${n === 1 ? "" : "s"}`;
}
