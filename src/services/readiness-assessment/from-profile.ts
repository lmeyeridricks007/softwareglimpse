import type { CrmDecisionProfile, CrmReadinessSession } from "@/domain";
import { setAnswer } from "./persistence";

/**
 * Prefill readiness answers from an existing CrmDecisionProfile.
 * Never silently assumes imported data is still correct — UI should label source.
 */
export function applyDecisionProfileHints(
  session: CrmReadinessSession,
  profile: CrmDecisionProfile,
): { session: CrmReadinessSession; importedQuestionIds: string[] } {
  let next = session;
  const imported: string[] = [];

  const ctx = profile.businessContext;
  const patchContext: CrmReadinessSession["context"] = {
    ...session.context,
  };

  if (ctx.companySizeSlug && !session.context.companySize) {
    const map: Record<string, NonNullable<CrmReadinessSession["context"]["companySize"]>> = {
      "1-10": "1-10",
      "11-50": "11-50",
      "51-200": "51-200",
      "201-1000": "201-1000",
      "1000+": "1000+",
      micro: "1-10",
      small: "11-50",
      midmarket: "51-200",
      mid: "51-200",
      large: "201-1000",
      enterprise: "1000+",
    };
    const mapped = map[ctx.companySizeSlug];
    if (mapped) patchContext.companySize = mapped;
  }

  if (
    typeof ctx.crmUserCount === "number" &&
    session.context.crmUsers == null
  ) {
    patchContext.crmUsers = ctx.crmUserCount;
  }

  if (ctx.industrySlug && !session.context.industry) {
    patchContext.industry = ctx.industrySlug.replace(/-/g, " ");
  }

  if (
    ctx.currentState === "existing-crm" &&
    session.context.replacingCrm == null
  ) {
    patchContext.replacingCrm = true;
  } else if (
    (ctx.currentState === "spreadsheet" || ctx.currentState === "no-crm") &&
    session.context.replacingCrm == null
  ) {
    patchContext.replacingCrm = false;
  }

  next = { ...next, context: patchContext };

  const reqCount = profile.requirements?.length ?? 0;
  if (reqCount > 0 && !session.answers["rq-gathered"]) {
    const value =
      reqCount >= 12
        ? "prioritized"
        : reqCount >= 5
          ? "draft"
          : "informal";
    next = setAnswer(next, "rq-gathered", value, "decision-profile");
    imported.push("rq-gathered");
  }

  const integrations = profile.integrations ?? [];
  if (integrations.length > 0 && !session.answers["ig-needed"]) {
    next = setAnswer(next, "ig-needed", "yes", "decision-profile");
    imported.push("ig-needed");
    const mapped: string[] = [];
    for (const row of integrations) {
      const id = String(row.id || "").toLowerCase();
      if (id.includes("email")) mapped.push("email");
      else if (id.includes("calendar")) mapped.push("calendar");
      else if (id.includes("marketing") || id.includes("hubspot"))
        mapped.push("marketing");
      else if (id.includes("erp") || id.includes("sap") || id.includes("netsuite"))
        mapped.push("erp");
      else if (
        id.includes("support") ||
        id.includes("zendesk") ||
        id.includes("intercom")
      )
        mapped.push("support");
      else if (id.includes("sso") || id.includes("okta") || id.includes("identity"))
        mapped.push("idp");
      else mapped.push("other");
    }
    const unique = [...new Set(mapped)];
    if (unique.length && !session.answers["ig-systems"]) {
      next = setAnswer(next, "ig-systems", unique, "decision-profile");
      imported.push("ig-systems");
    }
  }

  if (
    typeof profile.businessContext.crmUserCount === "number" &&
    !session.answers["bd-users"]
  ) {
    next = setAnswer(next, "bd-users", "yes", "decision-profile");
    imported.push("bd-users");
  }

  return { session: next, importedQuestionIds: imported };
}
