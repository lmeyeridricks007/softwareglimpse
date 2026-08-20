import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Attach already-extracted research fact IDs to comparison outcomes.
 * Does not change winners, scores, or verdicts.
 */

type FactRecord = { id?: string };

const factIdCache = new Map<string, Set<string>>();

function researchRoot(): string {
  return join(process.cwd(), "src/data/research");
}

function factIdsForProduct(slug: string): Set<string> {
  const cached = factIdCache.get(slug);
  if (cached) return cached;
  const path = join(researchRoot(), slug, "facts.json");
  const ids = new Set<string>();
  if (existsSync(path)) {
    const rows = JSON.parse(readFileSync(path, "utf8")) as FactRecord[];
    for (const row of rows) {
      if (row.id) ids.add(row.id);
    }
  }
  factIdCache.set(slug, ids);
  return ids;
}

/**
 * Criterion slug → fact-id suffixes after `fact-{productSlug}-`.
 * Only IDs that exist in that product's facts.json are attached.
 */
const CRITERION_FACT_SUFFIXES: Record<string, string[]> = {
  "ease-of-use": [
    "positioning.core",
    "positioning.sales-intelligence",
    "positioning.vendorClaim",
    "positioning.claim",
    "features.prospecting",
    "features.social-scheduling",
    "features.drag-drop-editor",
  ],
  "contact-data": [
    "features.contact-data",
    "features.data-enrichment",
    "features.prospecting",
  ],
  prospecting: [
    "features.prospecting",
    "features.list-building",
    "features.contact-data",
    "features.data-enrichment",
  ],
  "email-outreach": [
    "features.email-sequences",
    "features.email-outreach",
    "ai.email-generation",
  ],
  integrations: [
    "features.integrations",
    "integrations.crm",
    "features.crm-cti",
    "features.crm-sync",
    "features.email-sync",
    "features.hris-integrations",
    "features.helpdesk-integrations",
    "features.integrations-ecosystem",
    "features.app-extensions",
    "features.connectors",
    "features.cicd-actions",
    "features.enterprise-security",
    "positioning.jobCluster",
    "features.ads-management",
    "features.forms-lead-capture",
    "features.forms",
    "features.email-sms-channels",
    "features.pipeline-management",
    "features.workflow-automation",
    "features.lead-management",
    "features.contact-management",
  ],
  "value-for-money": [
    "pricing.startingPriceMonthly",
    "pricing.hasFreePlan",
    "pricing.model",
  ],
  "starting-pricing": [
    "pricing.startingPriceMonthly",
    "pricing.hasFreePlan",
    "pricing.model",
  ],
  "contact-limits": [
    "pricing.startingPriceMonthly",
    "pricing.plans.free",
    "pricing.model",
  ],
  "email-limits": ["pricing.startingPriceMonthly", "pricing.model"],
  "user-minimum": ["pricing.startingPriceMonthly", "pricing.model"],
  automation: [
    "features.automation-workflows",
    "features.marketing-automation",
    "features.email-sequences",
    "features.workflow-automation",
    "features.sales-automation",
    "ai.automation",
  ],
  templates: [
    "features.email-templates",
    "features.drag-drop-editor",
    "features.newsletter-builder",
    "features.email-campaigns",
    "features.email-sequences",
    "ai.email-generation",
  ],
  segmentation: [
    "features.segmentation",
    "features.personalization",
    "features.contact-management",
    "features.custom-fields",
  ],
  "landing-pages": [
    "features.landing-pages",
    "features.forms",
    "features.forms-lead-capture",
    "features.lead-management",
  ],
  analytics: [
    "features.analytics",
    "features.analytics-reporting",
    "features.reporting",
    "features.reporting-dashboards",
  ],
  "ai-features": [
    "features.ai-content-generation",
    "features.ai-assistance",
    "ai.assistant",
    "features.chatbot-ai-agent",
    "features.agent-copilot",
    "features.itsm-ai",
    "features.dev-ai",
  ],
  "campaign-content": [
    "features.social-scheduling",
    "features.content-calendar",
    "features.email-campaigns",
    "features.email-templates",
  ],
  "marketing-automation": [
    "features.marketing-automation",
    "features.automation-workflows",
  ],
  "funnel-conversion": [
    "features.funnel-builder",
    "features.landing-pages",
    "features.forms-lead-capture",
  ],
  "analytics-attribution": ["features.analytics", "features.analytics-reporting"],
  "brand-monitoring": [
    "features.social-listening",
    "features.reputation-reviews",
  ],
  scalability: [
    "pricing.plans.team",
    "pricing.plans.enterprise",
    "pricing.model",
    "features.custom-objects",
    "features.custom-pipelines",
    "features.integrations",
  ],
  administration: [
    "features.sso",
    "features.custom-fields",
    "features.custom-objects",
    "features.custom-pipelines",
    "features.enterprise-admin",
    "features.mobile-app",
  ],
  "ai-capabilities": [
    "features.ai-content-generation",
    "features.ai-assistance",
    "ai.assistant",
    "features.chatbot-ai-agent",
  ],
  "number-coverage": ["features.cloud-phone", "features.call-routing"],
  "power-dialer": ["features.power-dialer", "features.cloud-phone"],
  "whatsapp-business": ["features.whatsapp-business", "features.sms-messaging"],
  "crm-integrations": [
    "features.crm-cti",
    "features.integrations",
    "integrations.crm",
    "features.crm-sync",
    "features.email-sync",
    "features.workflow-automation",
  ],
  routing: ["features.call-routing", "features.cloud-phone"],
  "free-plan": ["pricing.hasFreePlan", "pricing.plans.free", "pricing.model"],
  "seat-minimum": [
    "pricing.startingPriceMonthly",
    "pricing.model",
    "pricing.hasFreePlan",
  ],
  "agent-minimum": [
    "pricing.startingPriceMonthly",
    "pricing.model",
    "pricing.hasFreePlan",
  ],
  automations: [
    "features.automations-workflows",
    "features.automation-workflows",
    "features.workflow-automation",
  ],
  "timeline-gantt": ["features.timeline-gantt", "features.task-boards"],
  "work-planning": [
    "features.task-boards",
    "features.workload-resources",
    "features.timeline-gantt",
  ],
  "automation-workflows": [
    "features.automations-workflows",
    "features.automation-workflows",
    "features.workflow-automation",
  ],
  collaboration: [
    "features.docs-collaboration",
    "features.team-collaboration",
    "features.team-messaging",
  ],
  reporting: [
    "features.reporting",
    "features.reporting-dashboards",
    "features.helpdesk-reporting",
    "features.analytics-reporting",
  ],
  "hiring-workflow": [
    "features.applicant-tracking",
    "features.career-site-job-boards",
    "features.interview-scheduling",
  ],
  "core-hris": [
    "features.core-hris",
    "features.benefits-admin",
    "positioning.jobCluster",
    "features.hris-integrations",
  ],
  "payroll-processing": [
    "features.payroll-processing",
    "features.core-hris",
    "positioning.jobCluster",
    "features.hris-integrations",
  ],
  "scheduling-depth": [
    "features.workforce-scheduling",
    "features.interview-scheduling",
  ],
  "training-depth": [
    "features.employee-training-paths",
    "features.sop-knowledge-base",
    "features.lms-course-commerce",
  ],
  "time-tracking-depth": [
    "features.time-attendance",
    "features.time-tracking",
    "features.gps-geofence-clockin",
  ],
  mobile: ["features.mobile-app", "features.frontline-comms"],
  "llm-chat-depth": [
    "features.llm-chat",
    "features.reasoning-models",
    "features.custom-projects",
  ],
  "writing-depth": ["features.writing-assist", "features.presentation-generation"],
  "voice-depth": ["features.voice-tts", "features.meeting-notes"],
  "agent-depth": ["features.agent-builder", "features.custom-projects"],
  governance: [
    "features.data-privacy",
    "features.enterprise-admin",
    "features.enterprise-security",
  ],
  "usage-model": [
    "features.usage-credits",
    "pricing.model",
    "pricing.hasFreePlan",
  ],
  "itsm-depth": [
    "features.itsm-service-desk",
    "features.incident-management",
    "features.change-problem",
    "features.service-catalog",
  ],
  "observability-depth": [
    "features.infrastructure-monitoring",
    "features.apm-tracing",
    "features.log-management",
  ],
  "source-control-depth": [
    "features.source-control",
    "features.cicd-actions",
  ],
  "hosting-panel-depth": ["features.hosting-panel"],
  "web-data-depth": ["features.proxy-network"],
  "security-admin": [
    "features.enterprise-security",
    "features.enterprise-admin",
    "features.data-privacy",
  ],
  "ticketing-depth": ["features.ticketing", "features.macros-automation"],
  "live-chat": ["features.live-chat", "features.shared-inbox"],
  "knowledge-base": [
    "features.knowledge-base",
    "features.self-service-portal",
  ],
  omnichannel: [
    "features.omnichannel-inbox",
    "features.unified-inbox",
    "features.shared-inbox",
  ],
  "sla-routing": ["features.sla-routing", "features.ticketing"],
  "ecommerce-helpdesk": [
    "features.ecommerce-helpdesk",
    "features.ticketing",
  ],
  "storefront-commerce-fit": [
    "features.online-storefront",
    "features.product-catalog",
  ],
  "catalog-orders-depth": [
    "features.product-catalog",
    "features.order-management",
    "features.inventory-management",
  ],
  "checkout-conversion": [
    "features.checkout-payments",
    "features.online-storefront",
  ],
  "omnichannel-pos": [
    "features.pos-omnichannel",
    "features.marketplace-channels",
  ],
};

const PRICING_CRITERIA = new Set([
  "starting-pricing",
  "value-for-money",
  "free-plan",
  "user-minimum",
  "seat-minimum",
  "agent-minimum",
  "usage-model",
]);

const PRICING_SUFFIXES = [
  "pricing.startingPriceMonthly",
  "pricing.hasFreePlan",
  "pricing.model",
];

function pushIfKnown(
  known: Set<string>,
  out: string[],
  id: string,
): void {
  if (known.has(id) && !out.includes(id)) {
    out.push(id);
    return;
  }
  for (const existing of known) {
    if (
      (existing.startsWith(`${id}-`) || existing === id) &&
      !out.includes(existing)
    ) {
      out.push(existing);
      return;
    }
  }
}

export function existingFactIdsForCriterion(
  productSlug: string,
  criterionSlug: string,
): string[] {
  const known = factIdsForProduct(productSlug);
  const out: string[] = [];
  const suffixes = CRITERION_FACT_SUFFIXES[criterionSlug] ?? [];
  for (const suffix of suffixes) {
    pushIfKnown(known, out, `fact-${productSlug}-${suffix}`);
  }
  pushIfKnown(known, out, `fact-${productSlug}-features.${criterionSlug}`);
  const stripped = criterionSlug.replace(/-depth$/, "").replace(/-fit$/, "");
  if (stripped !== criterionSlug) {
    pushIfKnown(known, out, `fact-${productSlug}-features.${stripped}`);
  }
  if (out.length === 0 && PRICING_CRITERIA.has(criterionSlug)) {
    for (const suffix of PRICING_SUFFIXES) {
      pushIfKnown(known, out, `fact-${productSlug}-${suffix}`);
    }
  }
  return out.slice(0, 4);
}

export function attachExistingSupportingFacts<
  T extends { criterionSlug: string; supportingFactIds?: string[] },
>(slugA: string, slugB: string, outcomes: T[]): T[] {
  return outcomes.map((outcome) => {
    const ids = [
      ...existingFactIdsForCriterion(slugA, outcome.criterionSlug),
      ...existingFactIdsForCriterion(slugB, outcome.criterionSlug),
    ];
    if (ids.length === 0) return outcome;
    const existing = outcome.supportingFactIds ?? [];
    const merged = [...existing];
    for (const id of ids) {
      if (!merged.includes(id)) merged.push(id);
    }
    return { ...outcome, supportingFactIds: merged };
  });
}

/**
 * Do not declare a product-A or product-B win when the row still has no
 * existing facts or approved assessment IDs. Tie / depends rows are unchanged.
 */
export function softenUnfactedProductA<
  T extends {
    winnerKind?: string;
    winnerSlug?: string | null;
    supportingFactIds?: string[];
    assessmentIds?: string[];
  },
>(outcomes: T[]): T[] {
  return outcomes.map((outcome) => {
    if (
      (outcome.winnerKind === "product-a" || outcome.winnerKind === "product-b") &&
      (outcome.supportingFactIds?.length ?? 0) === 0 &&
      (outcome.assessmentIds?.length ?? 0) === 0
    ) {
      return {
        ...outcome,
        winnerKind: "depends",
        winnerSlug: null,
      };
    }
    return outcome;
  });
}
