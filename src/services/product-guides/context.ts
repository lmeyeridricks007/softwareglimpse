import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import {
  listCrmPricingSnapshots,
  listEmailMarketingPricingSnapshots,
  listMarketingPricingSnapshots,
  listBusinessCommunicationsPricingSnapshots,
  listHrPricingSnapshots,
  listEcommercePricingSnapshots,
  listProjectManagementPricingSnapshots,
  listSalesIntelligencePricingSnapshots,
  listAiPricingSnapshots,
  listItDevelopmentPricingSnapshots,
} from "@/services/pricing/server";
import {
  CRM_PRODUCT_GUIDE_KINDS,
  productGuideFigureSrc,
  productGuideHeroSrc,
  productGuidePanelSrc,
  productGuideSlug,
  type CrmProductGuideKind,
} from "./kinds";

export type ProductGuidePlanSummary = {
  id: string;
  slug: string;
  name: string;
  isFree: boolean;
  hasFreeTrial: boolean;
  trialDays: number | null;
  contactSales: boolean;
  highlighted: boolean;
  /** Researched capacity limits (seats, contacts, pipelines) — never money. */
  capacityNote: string | null;
  /** Researched seat/user ceiling for this plan, when published. */
  seatCap: number | null;
  /** Feature labels that first become available on this plan. */
  unlocks: string[];
  /** Every researched feature label available on this plan. */
  includes: string[];
};

export type ProductGuideFeature = {
  slug: string;
  /** Sentence-case label, e.g. "email sync", "AI assistance". */
  label: string;
  availability: string;
  /** Researched plan names that carry the feature (may be empty). */
  planNames: string[];
  /** True when the feature is not available on every researched plan. */
  gated: boolean;
};

export type ProductGuideContext = {
  productSlug: string;
  productName: string;
  categorySlug: string;
  reviewHref: string;
  pricingHref: string;
  planNames: string[];
  plans: ProductGuidePlanSummary[];
  hasPlanMatrix: boolean;
  freePlanNames: string[];
  paidPlanNames: string[];
  quotePlanNames: string[];
  entryPlanName: string | null;
  paidEntryPlanName: string | null;
  topPlanName: string | null;
  highlightedPlanName: string | null;
  trialDays: number | null;
  trialPlanNames: string[];
  /** Capacity sentences like "Free: up to 3 seats" — no prices. */
  planCapacityNotes: string[];
  features: ProductGuideFeature[];
  supportedFeatureLabels: string[];
  gatedFeatureHints: string[];
  gatedFeatures: ProductGuideFeature[];
  /** Feature labels available on the cheapest researched plan. */
  entryPlanFeatureLabels: string[];
  /** Contact / lead / deal / pipeline labels this product supports. */
  coreLoopLabels: string[];
  integrationNames: string[];
  nativeIntegrationNames: string[];
  aiCapabilityLabels: string[];
  aiPlanNames: string[];
  hasAi: boolean;
  shortDescription: string | null;
  vendorClaim: string | null;
  audienceHints: string[];
  enrichmentLimitations: string[];
  bestFor: string[];
  notIdealFor: string[];
  strengths: string[];
  weaknesses: string[];
  tradeoffs: string[];
  verdict: string | null;
  recommendation: string | null;
  keyFeatures: string[];
  reviewLimitations: string[];
  whoShouldChoose: string | null;
  whoShouldConsiderAlternatives: string | null;
  /** Review pricing summary with currency amounts redacted. */
  pricingSummary: string | null;
  pros: string[];
  cons: string[];
  reviewIntro: string | null;
  alternativeNames: string[];
  /** Catalogue peer slugs from the review — never invent. */
  alternativeSlugs: string[];
  siblingSlugs: Record<CrmProductGuideKind, string>;
  heroSrc: (kind: CrmProductGuideKind) => string;
  figureSrc: (kind: CrmProductGuideKind) => string;
  panelSrc: (
    kind: CrmProductGuideKind,
    panel: 1 | 2 | 3 | 4,
  ) => string;
  feature: (featureSlug: string) => ProductGuideFeature | null;
  planNamesForFeature: (featureSlug: string) => string[];
};

const FEATURE_LABELS: Record<string, string> = {
  "contact-management": "contact management",
  "lead-management": "lead management",
  "pipeline-management": "pipeline management",
  "deal-management": "deal management",
  "custom-pipelines": "custom pipelines",
  "custom-fields": "custom fields",
  "email-sync": "email sync",
  "email-tracking": "email tracking",
  "email-sequences": "email sequences",
  "email-campaigns": "email campaigns",
  "workflow-automation": "workflow automation",
  "sales-automation": "sales automation",
  reporting: "reporting",
  forecasting: "forecasting",
  "lead-scoring": "lead scoring",
  "data-enrichment": "data enrichment",
  prospecting: "prospecting",
  "meeting-scheduling": "meeting scheduling",
  "call-functionality": "built-in calling",
  "territory-management": "territory management",
  "mobile-app": "mobile app",
    "ai-assistance": "AI assistance",
  integrations: "integrations",
  "newsletter-builder": "newsletter builder",
  "email-templates": "email templates",
  "automation-workflows": "automation workflows",
  segmentation: "segmentation",
  "landing-pages": "landing pages",
  analytics: "analytics",
  "deliverability-tools": "deliverability tools",
  "ai-content-generation": "AI content generation",
  "social-scheduling": "social scheduling",
  "content-calendar": "content calendar",
  "social-listening": "social listening",
  "funnel-builder": "funnel builder",
  "marketing-automation": "marketing automation",
  "forms-lead-capture": "forms and lead capture",
  "ads-management": "ads management",
  "reputation-reviews": "reputation and reviews",
  webinars: "webinars",
  "email-sms-channels": "email and SMS channels",
  "team-collaboration": "team collaboration",
  "cloud-phone": "cloud phone",
  "call-routing": "call routing",
  "call-recording": "call recording",
  "crm-cti": "CRM CTI",
  "team-messaging": "team messaging",
  "whatsapp-business": "WhatsApp Business",
  "shared-inbox": "shared inbox",
  "video-meetings": "video meetings",
  "applicant-tracking": "applicant tracking",
  "career-site-job-boards": "career site and job boards",
  "interview-scheduling": "interview scheduling",
  "workforce-scheduling": "workforce scheduling",
  "frontline-comms": "frontline communications",
  "time-attendance": "time and attendance",
  "gps-geofence-clockin": "GPS / geofence clock-in",
  "sop-knowledge-base": "SOP knowledge base",
  "employee-training-paths": "employee training paths",
  "lms-course-commerce": "LMS course commerce",
  "hris-integrations": "HRIS integrations",
  "analytics-reporting": "analytics and reporting",
  "task-boards": "task boards",
  "timeline-gantt": "timeline / Gantt",
  "workload-resources": "workload and resources",
  "automations-workflows": "automations and workflows",
  "time-tracking": "time tracking",
  "docs-collaboration": "docs and collaboration",
  "integrations-ecosystem": "integrations",
  "reporting-dashboards": "reporting dashboards",
  "document-pdf": "document / PDF tools",
  "remote-access": "remote access",
  "desktop-workspace": "desktop workspace",
  "llm-chat": "LLM chat and assistants",
  "reasoning-models": "reasoning / advanced models",
  "writing-assist": "writing and paraphrasing",
  "image-generation": "image generation",
  "voice-tts": "voice / text-to-speech",
  "presentation-generation": "presentation generation",
  "website-generation": "website generation",
  "ad-creative-generation": "ad creative generation",
  "agent-builder": "agent / app builder",
  "custom-projects": "projects, GPTs, and memory",
  "enterprise-admin": "enterprise admin and SSO",
  "usage-credits": "usage credits and rate limits",
  connectors: "connectors and tools",
  "data-privacy": "data privacy controls",
  "video-generation": "video generation",
  "code-assist": "code assist / AI IDE",
  "meeting-notes": "meeting notes and transcription",
  "incident-management": "incident management",
  "change-problem": "change and problem management",
  "service-catalog": "service catalog",
  "infrastructure-monitoring": "infrastructure monitoring",
  "apm-tracing": "APM and distributed tracing",
  "log-management": "log management",
  "source-control": "source control and repos",
  "cicd-actions": "CI/CD and automation",
  "hosting-panel": "hosting control panel",
  "proxy-network": "proxy / web data network",
  "itsm-ai": "ITSM AI assistance",
  "dev-ai": "developer AI assistance",
  "oncall-paging": "on-call and paging",
  "enterprise-security": "enterprise security and SSO",
};

const CRM_CORE_LOOP_SLUGS = [
  "contact-management",
  "lead-management",
  "deal-management",
  "pipeline-management",
] as const;

const SI_CORE_LOOP_SLUGS = [
  "prospecting",
  "data-enrichment",
  "email-sequences",
  "email-campaigns",
  "call-functionality",
  "lead-scoring",
  "contact-management",
] as const;

const EM_CORE_LOOP_SLUGS = [
  "email-campaigns",
  "newsletter-builder",
  "segmentation",
  "automation-workflows",
  "contact-management",
  "email-templates",
] as const;

const MARKETING_CORE_LOOP_SLUGS = [
  "funnel-builder",
  "landing-pages",
  "marketing-automation",
  "forms-lead-capture",
  "social-scheduling",
  "webinars",
  "email-sms-channels",
  "analytics",
] as const;

const BC_CORE_LOOP_SLUGS = [
  "cloud-phone",
  "call-routing",
  "call-recording",
  "crm-cti",
  "team-messaging",
  "whatsapp-business",
  "shared-inbox",
  "video-meetings",
] as const;

const ECOM_CORE_LOOP_SLUGS = [
  "online-storefront",
  "product-catalog",
  "checkout-payments",
  "order-management",
  "inventory-management",
  "shipping-fulfillment",
  "pos-omnichannel",
  "dropshipping-sourcing",
] as const;

const HR_CORE_LOOP_SLUGS = [
  "applicant-tracking",
  "career-site-job-boards",
  "interview-scheduling",
  "workforce-scheduling",
  "frontline-comms",
  "time-attendance",
  "gps-geofence-clockin",
  "sop-knowledge-base",
  "employee-training-paths",
  "hris-integrations",
] as const;

const PM_CORE_LOOP_SLUGS = [
  "task-boards",
  "timeline-gantt",
  "workload-resources",
  "automations-workflows",
  "docs-collaboration",
  "reporting-dashboards",
  "time-tracking",
] as const;

const AI_CORE_LOOP_SLUGS = [
  "llm-chat",
  "reasoning-models",
  "writing-assist",
  "image-generation",
  "voice-tts",
  "presentation-generation",
  "website-generation",
  "ad-creative-generation",
  "agent-builder",
  "custom-projects",
  "video-generation",
  "code-assist",
  "meeting-notes",
] as const;

const IT_CORE_LOOP_SLUGS = [
  "incident-management",
  "change-problem",
  "service-catalog",
  "infrastructure-monitoring",
  "apm-tracing",
  "log-management",
  "source-control",
  "cicd-actions",
  "hosting-panel",
  "proxy-network",
  "oncall-paging",
] as const;

const INTEGRATION_LABELS: Record<string, string> = {
  gmail: "Gmail",
  outlook: "Outlook",
  "microsoft-outlook": "Microsoft Outlook",
  "microsoft-365": "Microsoft 365",
  "microsoft-teams": "Microsoft Teams",
  "google-workspace": "Google Workspace",
  "google-drive": "Google Drive",
  "google-meet": "Google Meet",
  slack: "Slack",
  zapier: "Zapier",
  quickbooks: "QuickBooks",
  xero: "Xero",
  stripe: "Stripe",
  paypal: "PayPal",
  shopify: "Shopify",
  wordpress: "WordPress",
  salesforce: "Salesforce",
  hubspot: "HubSpot",
  pandadoc: "PandaDoc",
  "whatsapp-business": "WhatsApp Business",
  "linkedin-sales-navigator": "LinkedIn Sales Navigator",
  "power-platform": "Power Platform",
  "power-bi": "Power BI",
  "oracle-erp": "Oracle ERP",
  "zoho-apps": "Zoho apps",
  api: "API access",
  telephony: "telephony",
};

const AI_LABELS: Record<string, string> = {
  assistant: "AI assistant",
  summaries: "AI summaries",
  "email-generation": "AI email drafting",
  "lead-scoring": "AI lead scoring",
  forecasting: "AI forecasting",
  automation: "AI automation",
  recommendations: "AI recommendations",
  transcription: "AI transcription",
  other: "additional AI features",
};

const CAPACITY_LABELS: Record<string, string> = {
  maxSeats: "seats",
  maximumSeats: "seats",
  users: "users",
  includedUsers: "included users",
  contacts: "contacts",
  pipelines: "pipelines",
  customFields: "custom fields",
  credits: "credits",
  monthlyCredits: "monthly credits",
  exportCredits: "export credits",
  subscribers: "subscribers",
  emails: "emails",
  monthlyEmails: "monthly emails",
  sends: "sends",
};

const AVAILABLE = new Set([
  "supported",
  "limited",
  "add-on",
  "higher-plan-only",
]);

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function featureLabel(slug: string): string {
  return FEATURE_LABELS[slug] ?? slug.split("-").filter(Boolean).join(" ");
}

/**
 * Removes currency amounts from researched prose so guide copy never carries
 * list prices. Numbers belong on /pricing/{slug}/ and the Cost Calculator.
 */
export function redactAmounts(text: string): string {
  let out = text.replace(
    /[$€£¥]\s?\d[\d.,]*\+?(?:\s*\/\s*(?:user|users|seat|seats|mo|month|yr|year))*(?:\s*per\s+(?:user|seat)(?:\s*\/\s*(?:month|mo|year|yr))?)?/gi,
    "list price",
  );
  out = out.replace(/[$€£¥]\s?[\d.,]+/g, "list price");
  out = out.replace(
    /list price(?:\s*(?:[/,]|and|or|to|vs\.?|versus)\s*list price)+/gi,
    "list price",
  );
  return out.replace(/\s{2,}/g, " ").trim();
}

function cleanList(values: readonly (string | undefined)[], max: number): string[] {
  const out: string[] = [];
  for (const value of values) {
    const text = value?.trim();
    if (!text) continue;
    const redacted = redactAmounts(text);
    if (!redacted || out.includes(redacted)) continue;
    out.push(redacted);
    if (out.length >= max) break;
  }
  return out;
}

function cleanText(value: string | undefined, max: number): string | null {
  const text = value?.trim();
  if (!text) return null;
  const redacted = redactAmounts(text);
  if (!redacted) return null;
  return redacted.length <= max
    ? redacted
    : `${redacted.slice(0, max).replace(/[\s,;:.-]+$/u, "")}…`;
}

function capacityNote(
  limits: Record<string, string | number | boolean> | undefined,
): string | null {
  if (!limits) return null;
  const parts: string[] = [];
  for (const [key, raw] of Object.entries(limits)) {
    const label = CAPACITY_LABELS[key];
    if (!label || typeof raw !== "number") continue;
    const unit = raw === 1 ? label.replace(/s$/u, "") : label;
    parts.push(`up to ${raw.toLocaleString("en-US")} ${unit}`);
  }
  return parts.length > 0 ? parts.join(", ") : null;
}

function seatCapOf(
  limits: Record<string, string | number | boolean> | undefined,
): number | null {
  if (!limits) return null;
  for (const key of ["maxSeats", "maximumSeats", "users", "includedUsers"]) {
    const raw = limits[key];
    if (typeof raw === "number") return raw;
  }
  return null;
}

/**
 * Keeps the researched pricing summary only when it carries no money at all.
 * Redacted amounts read badly in prose — those readers go to /pricing/{slug}/.
 */
function usablePricingSummary(value: string | undefined): string | null {
  const text = cleanText(value, 260);
  if (!text) return null;
  return /list price/i.test(text) ? null : text;
}

function displayName(slug: string, softName?: string): string {
  if (softName && softName.trim()) {
    // Fix awkward catalogue casing for monday
    if (slug === "monday-sales-crm") return "monday sales CRM";
    if (slug === "folk" && softName === "folk") return "Folk";
    return softName;
  }
  return titleCase(slug);
}

const SNAPSHOT_LISTERS: Record<
  string,
  () => ReturnType<typeof listCrmPricingSnapshots>
> = {
  crm: listCrmPricingSnapshots,
  "sales-intelligence": listSalesIntelligencePricingSnapshots,
  "email-marketing": listEmailMarketingPricingSnapshots,
  marketing: listMarketingPricingSnapshots,
  "business-communications": listBusinessCommunicationsPricingSnapshots,
  hr: listHrPricingSnapshots,
  ecommerce: listEcommercePricingSnapshots,
  "project-management": listProjectManagementPricingSnapshots,
  ai: listAiPricingSnapshots,
  "it-development": listItDevelopmentPricingSnapshots,
};

function findProductGuideSnapshot(productSlug: string) {
  const software = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  const category = software?.primaryCategorySlug;
  const preferred = category ? SNAPSHOT_LISTERS[category] : undefined;
  if (preferred) {
    const match = preferred().find((s) => s.productSlug === productSlug);
    if (match) return match;
  }
  for (const list of Object.values(SNAPSHOT_LISTERS)) {
    if (list === preferred) continue;
    const match = list().find((s) => s.productSlug === productSlug);
    if (match) return match;
  }
  return undefined;
}

export function loadProductGuideContext(
  productSlug: string,
): ProductGuideContext | null {
  const snap = findProductGuideSnapshot(productSlug);
  if (!snap) return null;

  const software = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  const enrichment = loadEnrichment(productSlug);
  const assessment = loadAssessment(productSlug);
  const review = loadReview(productSlug);
  const categorySlug =
    software?.primaryCategorySlug ?? snap.primaryCategorySlug;

  const rawPlans = snap.pricing?.plans ?? [];
  const planNameBySlug = new Map(rawPlans.map((p) => [p.slug, p.name]));
  const planOrderBySlug = new Map(rawPlans.map((p, i) => [p.slug, i]));

  const supported = (enrichment?.featureSupport ?? []).filter((f) =>
    AVAILABLE.has(f.availability),
  );

  const features: ProductGuideFeature[] = supported.map((f) => {
    const planNames = (f.planSlugs ?? []).map(
      (slug) => planNameBySlug.get(slug) ?? titleCase(slug),
    );
    const partial =
      planNames.length > 0 &&
      rawPlans.length > 0 &&
      planNames.length < rawPlans.length;
    return {
      slug: f.featureSlug,
      label: featureLabel(f.featureSlug),
      availability: f.availability,
      planNames,
      gated:
        partial ||
        f.availability === "higher-plan-only" ||
        f.availability === "add-on",
    };
  });

  // Feature labels keyed to the earliest researched plan that carries them.
  const unlocksByPlanSlug = new Map<string, string[]>();
  for (const f of supported) {
    const slugs = (f.planSlugs ?? []).filter((s) => planOrderBySlug.has(s));
    if (slugs.length === 0) continue;
    const earliest = slugs.reduce((best, slug) =>
      (planOrderBySlug.get(slug) ?? 0) < (planOrderBySlug.get(best) ?? 0)
        ? slug
        : best,
    );
    const bucket = unlocksByPlanSlug.get(earliest) ?? [];
    bucket.push(featureLabel(f.featureSlug));
    unlocksByPlanSlug.set(earliest, bucket);
  }

  const plans: ProductGuidePlanSummary[] = rawPlans.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    isFree: Boolean(p.isFree),
    hasFreeTrial: Boolean(p.hasFreeTrial) || typeof p.trialDays === "number",
    trialDays: typeof p.trialDays === "number" ? p.trialDays : null,
    contactSales: Boolean(p.contactSales),
    highlighted: Boolean(p.highlighted),
    capacityNote: capacityNote(p.limits),
    seatCap: seatCapOf(p.limits),
    unlocks: (unlocksByPlanSlug.get(p.slug) ?? []).slice(0, 6),
    includes: supported
      .filter((f) => (f.planSlugs ?? []).includes(p.slug))
      .map((f) => featureLabel(f.featureSlug)),
  }));

  const gatedFeatures = features.filter(
    (f) => f.gated && f.planNames.length > 0,
  );

  const trialPlan = plans.find((p) => p.trialDays != null);
  const trialDays = trialPlan?.trialDays ?? null;

  const siblingSlugs = Object.fromEntries(
    CRM_PRODUCT_GUIDE_KINDS.map((kind) => [
      kind,
      productGuideSlug(productSlug, kind),
    ]),
  ) as Record<CrmProductGuideKind, string>;

  const featureBySlug = new Map(features.map((f) => [f.slug, f]));
  const coreLoopSlugs =
    categorySlug === "sales-intelligence"
      ? SI_CORE_LOOP_SLUGS
      : categorySlug === "email-marketing"
        ? EM_CORE_LOOP_SLUGS
        : categorySlug === "marketing"
          ? MARKETING_CORE_LOOP_SLUGS
          : categorySlug === "business-communications"
            ? BC_CORE_LOOP_SLUGS
            : categorySlug === "hr"
              ? HR_CORE_LOOP_SLUGS
              : categorySlug === "ecommerce"
                ? ECOM_CORE_LOOP_SLUGS
              : categorySlug === "project-management"
                ? PM_CORE_LOOP_SLUGS
                : categorySlug === "ai"
                  ? AI_CORE_LOOP_SLUGS
                  : categorySlug === "it-development"
                    ? IT_CORE_LOOP_SLUGS
            : CRM_CORE_LOOP_SLUGS;

  return {
    productSlug,
    productName: displayName(productSlug, software?.name),
    categorySlug,
    reviewHref: `/software/${productSlug}/`,
    pricingHref: `/pricing/${productSlug}/`,
    planNames: plans.map((p) => p.name),
    plans,
    hasPlanMatrix: plans.length > 0,
    freePlanNames: plans.filter((p) => p.isFree).map((p) => p.name),
    paidPlanNames: plans.filter((p) => !p.isFree).map((p) => p.name),
    quotePlanNames: plans.filter((p) => p.contactSales).map((p) => p.name),
    entryPlanName: plans[0]?.name ?? null,
    paidEntryPlanName:
      plans.find((p) => !p.isFree && !p.contactSales)?.name ?? null,
    topPlanName:
      plans.length > 1 ? (plans[plans.length - 1]?.name ?? null) : null,
    highlightedPlanName: plans.find((p) => p.highlighted)?.name ?? null,
    trialDays,
    trialPlanNames: plans.filter((p) => p.hasFreeTrial).map((p) => p.name),
    planCapacityNotes: plans
      .filter((p) => p.capacityNote)
      .map((p) => `${p.name}: ${p.capacityNote}`),
    features,
    supportedFeatureLabels: features.slice(0, 8).map((f) => f.label),
    gatedFeatureHints: gatedFeatures
      .slice(0, 5)
      .map((f) => `${f.label} (${f.planNames.join(", ")})`),
    gatedFeatures,
    entryPlanFeatureLabels: plans[0]?.includes.slice(0, 8) ?? [],
    coreLoopLabels: features
      .filter((f) => (coreLoopSlugs as readonly string[]).includes(f.slug))
      .map((f) => f.label),
    integrationNames: (enrichment?.integrationSupport ?? [])
      .slice(0, 6)
      .map(
        (i) =>
          INTEGRATION_LABELS[i.integrationSlug] ?? titleCase(i.integrationSlug),
      ),
    nativeIntegrationNames: (enrichment?.integrationSupport ?? [])
      .filter((i) => i.kind === "native" || i.kind === "official-connector")
      .slice(0, 5)
      .map(
        (i) =>
          INTEGRATION_LABELS[i.integrationSlug] ?? titleCase(i.integrationSlug),
      ),
    aiCapabilityLabels: (enrichment?.aiCapabilities ?? [])
      .filter((a) => AVAILABLE.has(a.availability))
      .slice(0, 5)
      .map((a) => AI_LABELS[a.capability] ?? titleCase(a.capability)),
    aiPlanNames: featureBySlug.get("ai-assistance")?.planNames ?? [],
    hasAi:
      (enrichment?.aiCapabilities ?? []).some((a) =>
        AVAILABLE.has(a.availability),
      ) || featureBySlug.has("ai-assistance"),
    shortDescription: cleanText(enrichment?.shortDescription, 260),
    vendorClaim: cleanText(enrichment?.vendorPositioning?.[0]?.claim, 260),
    audienceHints: cleanList(
      (enrichment?.vendorPositioning ?? []).flatMap((v) => v.audienceHints),
      4,
    ),
    enrichmentLimitations: cleanList(
      (enrichment?.limitations ?? []).map((l) => l.description),
      5,
    ),
    bestFor: cleanList(
      [...(assessment?.bestFor ?? []), ...(review?.bestFor ?? [])],
      4,
    ),
    notIdealFor: cleanList(
      [...(assessment?.notIdealFor ?? []), ...(review?.notIdealFor ?? [])],
      4,
    ),
    strengths: cleanList(
      [...(assessment?.strengths ?? []), ...(review?.pros ?? [])],
      5,
    ),
    weaknesses: cleanList(
      [...(assessment?.weaknesses ?? []), ...(review?.cons ?? [])],
      5,
    ),
    tradeoffs: cleanList(assessment?.tradeoffs ?? [], 4),
    verdict: cleanText(assessment?.verdict ?? review?.verdict, 320),
    recommendation: cleanText(assessment?.recommendation, 280),
    keyFeatures: cleanList(review?.keyFeatures ?? [], 8),
    reviewLimitations: cleanList(review?.limitations ?? [], 5),
    whoShouldChoose: cleanText(review?.whoShouldChoose, 280),
    whoShouldConsiderAlternatives: cleanText(
      review?.whoShouldConsiderAlternatives,
      280,
    ),
    pricingSummary: usablePricingSummary(review?.pricingSummary),
    pros: cleanList(review?.pros ?? [], 5),
    cons: cleanList(review?.cons ?? [], 5),
    reviewIntro: cleanText(review?.intro, 300),
    alternativeSlugs: (review?.alternativeSlugs ?? [])
      .filter(
        (slug) =>
          slug !== productSlug &&
          Boolean(getSoftwareBySlug(slug, { includeUnpublished: true })),
      )
      .slice(0, 4),
    alternativeNames: (review?.alternativeSlugs ?? [])
      .slice(0, 4)
      .map((slug) =>
        displayName(
          slug,
          getSoftwareBySlug(slug, { includeUnpublished: true })?.name,
        ),
      ),
    siblingSlugs,
    heroSrc: (kind) => productGuideHeroSrc(productSlug, kind),
    figureSrc: (kind) => productGuideFigureSrc(productSlug, kind),
    panelSrc: (kind, panel) =>
      productGuidePanelSrc(productSlug, kind, panel),
    feature: (featureSlug) => featureBySlug.get(featureSlug) ?? null,
    planNamesForFeature: (featureSlug) =>
      featureBySlug.get(featureSlug)?.planNames ?? [],
  };
}

export function listCrmProductGuideSlugs(): string[] {
  return listCrmPricingSnapshots().map((s) => s.productSlug);
}

export function listSiProductGuideSlugs(): string[] {
  return listSalesIntelligencePricingSnapshots().map((s) => s.productSlug);
}

/** Every researched product with a pricing snapshot gets a full 5-kind guide pack. */
function listProductGuideSlugsFromSnapshots(
  listSnapshots: () => { productSlug: string }[],
): string[] {
  return listSnapshots().map((s) => s.productSlug);
}

export function listEmProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listEmailMarketingPricingSnapshots);
}

export function listMarketingProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listMarketingPricingSnapshots);
}

export function listBcProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(
    listBusinessCommunicationsPricingSnapshots,
  );
}

export function listHrProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listHrPricingSnapshots);
}

export function listEcommerceProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listEcommercePricingSnapshots);
}

export function listPmProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listProjectManagementPricingSnapshots);
}

export function listAiProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listAiPricingSnapshots);
}

export function listItProductGuideSlugs(): string[] {
  return listProductGuideSlugsFromSnapshots(listItDevelopmentPricingSnapshots);
}
