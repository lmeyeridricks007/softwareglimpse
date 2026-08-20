/**
 * Sample CRM Finder shortlist for hero previews.
 * Uses real recommendCrm scores for fixed sample answers — never fabricated.
 */

import { getSoftwareBySlug } from "@/data";
import { crmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";
import { getCrmFinderSnapshots } from "@/data/recommendation/load-snapshots";
import type { CrmFinderAnswers } from "@/domain";
import {
  normalizeCrmFinderAnswers,
  recommendCrm,
} from "@/services/recommendation";

/** Mid-size sales team sample — same shape as a real finder completion. */
export const CRM_FINDER_SAMPLE_ANSWERS: CrmFinderAnswers = {
  companySizeSlug: "small-business",
  crmUsers: 25,
  primaryUseCaseSlug: "pipeline-management",
  budgetBand: "30-60",
  budgetMode: "per-user-month",
  easePreference: "easy-setup",
};

export type CrmFinderSampleMatch = {
  slug: string;
  name: string;
  matchScore: number;
  label: string;
  reasons: string[];
  logoSrc: string | null;
};

export type CrmFinderSamplePreview = {
  isLiveSample: boolean;
  caption: string;
  requirementSummary: string;
  matches: CrmFinderSampleMatch[];
};

function fitLabel(score: number): string {
  if (score >= 90) return "Excellent match";
  if (score >= 80) return "Strong match";
  if (score >= 70) return "Good match";
  if (score >= 55) return "Partial match";
  return "Limited match";
}

function shortReasons(
  reasons: Array<{ text: string; positive: boolean }>,
): string[] {
  return reasons
    .filter((r) => r.positive)
    .slice(0, 2)
    .map((r) => {
      const text = r.text.replace(/\.$/, "");
      // Keep preview chips short
      if (text.length <= 28) return text;
      return `${text.slice(0, 25)}…`;
    });
}

export function buildCrmFinderSamplePreview(): CrmFinderSamplePreview {
  const requirementSummary =
    "Sample: 11–50 team · pipeline focus · €30–60/user";

  try {
    const snapshots = getCrmFinderSnapshots();
    if (snapshots.length === 0) {
      return {
        isLiveSample: false,
        caption: "Complete the finder for your personalized shortlist",
        requirementSummary,
        matches: [],
      };
    }

    const criteria = normalizeCrmFinderAnswers(
      CRM_FINDER_SAMPLE_ANSWERS,
      crmFinderConfig,
    );
    const { results } = recommendCrm(criteria, snapshots, crmFinderConfig);
    const matches = results.slice(0, 3).map((r) => {
      const software = getSoftwareBySlug(r.productSlug);
      return {
        slug: r.productSlug,
        name: r.name,
        matchScore: Math.round(r.matchScore),
        label: fitLabel(r.matchScore),
        reasons: shortReasons(r.reasons),
        logoSrc: software?.logo?.src ?? null,
      };
    });

    if (matches.length === 0) {
      return {
        isLiveSample: false,
        caption: "Complete the finder for your personalized shortlist",
        requirementSummary,
        matches: [],
      };
    }

    return {
      isLiveSample: true,
      caption:
        "Sample shortlist from the live matching engine — not your results yet",
      requirementSummary,
      matches,
    };
  } catch {
    return {
      isLiveSample: false,
      caption: "Complete the finder for your personalized shortlist",
      requirementSummary,
      matches: [],
    };
  }
}
