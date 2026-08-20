import type { CrmDecisionProfile } from "@/domain";

export type CompletenessStatus = "complete" | "partial" | "not-started";

export type ProfileCompleteness = {
  sections: Array<{
    id: string;
    label: string;
    status: CompletenessStatus;
    detail?: string;
  }>;
};

function status(
  complete: boolean,
  partial: boolean,
): CompletenessStatus {
  if (complete) return "complete";
  if (partial) return "partial";
  return "not-started";
}

/**
 * Explicit completeness — no fake percentages.
 * Each section uses clear complete / partial / not-started rules.
 */
export function buildProfileCompleteness(
  profile: CrmDecisionProfile,
): ProfileCompleteness {
  const bc = profile.businessContext;
  const businessComplete = Boolean(
    bc.companySizeSlug && bc.crmUserCount != null,
  );
  const businessPartial = Boolean(
    bc.industrySlug ||
      bc.businessTypeSlug ||
      bc.companySizeSlug ||
      bc.crmUserCount != null ||
      (bc.teamIds?.length ?? 0) > 0 ||
      bc.currentState,
  );

  const useCasesComplete = profile.useCases.some((u) => u.priority === "primary");
  const useCasesPartial = profile.useCases.length > 0;

  const capsComplete = profile.capabilities.length > 0;
  const capsPartial = capsComplete;

  const activeReqs = profile.requirements.filter(
    (r) => r.priority !== "not-needed",
  );
  const reqsComplete = activeReqs.some((r) => r.priority === "must-have");
  const reqsPartial = activeReqs.length > 0;

  const featuresComplete = profile.features.some(
    (f) => f.priority === "must-have",
  );
  const featuresPartial = profile.features.length > 0;

  const integrationsComplete = profile.integrations.some(
    (i) => i.priority === "required",
  );
  const integrationsPartial = profile.integrations.length > 0;

  const securityReqs = activeReqs.filter((r) =>
    [
      "support-sso",
      "restrict-access-by-team",
      "audit-user-activity",
    ].includes(r.id),
  );
  const securityComplete =
    securityReqs.length > 0 ||
    profile.implementation.adminComplexity != null;
  const securityPartial = securityComplete;

  const budgetComplete = profile.budget.band != null;
  const budgetPartial =
    budgetComplete ||
    profile.budget.billingPreference != null ||
    profile.implementation.complexity != null ||
    profile.implementation.migrationComplexity != null;

  return {
    sections: [
      {
        id: "business",
        label: "Business context",
        status: status(businessComplete, businessPartial),
        detail: businessComplete
          ? undefined
          : businessPartial
            ? "Add company size and CRM users"
            : undefined,
      },
      {
        id: "use-cases",
        label: "Use cases",
        status: status(useCasesComplete, useCasesPartial),
      },
      {
        id: "capabilities",
        label: "Capabilities",
        status: status(capsComplete, capsPartial),
      },
      {
        id: "requirements",
        label: "Requirements",
        status: status(reqsComplete, reqsPartial),
        detail: reqsPartial
          ? `${activeReqs.length} selected`
          : undefined,
      },
      {
        id: "features",
        label: "Features",
        status: status(featuresComplete, featuresPartial),
      },
      {
        id: "integrations",
        label: "Integrations",
        status: status(integrationsComplete, integrationsPartial),
      },
      {
        id: "security",
        label: "Security",
        status: status(securityComplete, securityPartial),
      },
      {
        id: "budget",
        label: "Budget & setup",
        status: status(budgetComplete, budgetPartial),
      },
    ],
  };
}
