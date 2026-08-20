import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";
import { planCategoryKnowledge } from "./category-planner";
import { resolveAgentForIntent } from "./intent-router";

export function validateKnowledgePlanners(): {
  ok: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const crm = planCategoryKnowledge("crm");
    if (crm.summary.coreCount === 0) {
      errors.push("CRM plan has no CORE topics");
    }
    if (crm.summary.coreCount > 12) {
      warnings.push(`CRM CORE count ${crm.summary.coreCount} > 12`);
    }
  } catch (e) {
    errors.push(`CRM plan failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    planCategoryKnowledge("email-marketing");
  } catch (e) {
    errors.push(
      `Email Marketing plan failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  for (const map of listCategoryKnowledgeMaps()) {
    try {
      planCategoryKnowledge(map.categorySlug);
    } catch (e) {
      errors.push(
        `${map.categorySlug} plan failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
    if (map.topics.filter((t) => t.priorityClass === "CORE").length > 12) {
      warnings.push(`${map.categorySlug} map CORE > 12`);
    }
  }

  const route = resolveAgentForIntent({
    query: "pipedrive vs freshsales",
  });
  if (route.agentId !== "comparison-agent") {
    errors.push("Intent router failed comparison mapping");
  }

  const pricing = resolveAgentForIntent({
    query: "pipedrive pricing",
    productSlug: "pipedrive",
  });
  if (pricing.agentId !== "pricing-page-agent") {
    errors.push("Intent router failed pricing mapping");
  }

  return { ok: errors.length === 0, errors, warnings };
}
