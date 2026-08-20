import type { CrmDecisionProfile } from "@/domain";

export type ProfileWarning = {
  id: string;
  severity: "warning" | "info";
  message: string;
};

/**
 * Deterministic logical warnings only — no fabricated market facts.
 */
export function buildProfileWarnings(
  profile: CrmDecisionProfile,
): ProfileWarning[] {
  const warnings: ProfileWarning[] = [];

  const mustHaveReqs = profile.requirements.filter(
    (r) => r.priority === "must-have",
  );
  if (mustHaveReqs.length >= 12) {
    warnings.push({
      id: "many-must-haves",
      severity: "warning",
      message: `You marked ${mustHaveReqs.length} requirements as Must Have. Consider moving lower-priority items to Important so shortlists stay realistic.`,
    });
  }

  const mustHaveFeatures = profile.features.filter(
    (f) => f.priority === "must-have",
  );
  if (mustHaveFeatures.length >= 15) {
    warnings.push({
      id: "many-must-have-features",
      severity: "info",
      message: `You require ${mustHaveFeatures.length} must-have features. That can narrow qualifying plans and products.`,
    });
  }

  const band = profile.budget.band;
  const securityHeavy = profile.requirements.some(
    (r) =>
      r.priority === "must-have" &&
      (r.id === "support-sso" ||
        r.id === "restrict-access-by-team" ||
        r.id === "audit-user-activity"),
  );
  const automationHeavy = profile.requirements.some(
    (r) =>
      r.priority === "must-have" && r.id === "automate-lead-follow-up",
  );
  const advancedAdmin =
    profile.implementation.adminComplexity === "advanced" ||
    profile.implementation.complexity === "advanced-customization";

  if (
    (band === "under-15" || band === "15-30") &&
    (securityHeavy || (automationHeavy && advancedAdmin))
  ) {
    warnings.push({
      id: "budget-vs-complexity",
      severity: "warning",
      message:
        "You selected a lower per-user budget while requiring advanced security and/or automation. Those requirements may narrow your options significantly — especially on entry-level plans.",
    });
  }

  if (
    profile.businessContext.crmUserCount != null &&
    profile.businessContext.crmUserCount >= 100 &&
    profile.implementation.complexity === "easy-setup" &&
    securityHeavy
  ) {
    warnings.push({
      id: "scale-vs-ease",
      severity: "info",
      message:
        "Larger teams with must-have security controls often need more than the simplest self-serve setup. Review your implementation preference if administration must stay advanced.",
    });
  }

  if (
    profile.useCases.length === 0 &&
    profile.requirements.some((r) => r.priority === "must-have")
  ) {
    warnings.push({
      id: "reqs-without-use-cases",
      severity: "info",
      message:
        "You have must-have requirements without selected use cases. Adding use cases helps keep the profile coherent for Finder matching.",
    });
  }

  return warnings;
}
