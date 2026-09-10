/**
 * Coarse job families — bridges fine-grained use-case slugs without inventing
 * competitive edges. Distinct AI modalities stay in different families.
 */
const USE_CASE_FAMILY: Record<string, string> = {
  "core-hris": "hr",
  "enterprise-hcm": "hr",
  "payroll-benefits": "hr",
  "recruiting-ats": "hr",
  "talent-management": "hr",
  prospecting: "sales-data",
  "data-enrichment": "sales-data",
  "contact-management": "sales-data",
  "lead-management": "sales-data",
  "sales-engagement": "sales-engage",
  "email-outreach": "sales-engage",
  "pipeline-management": "crm-sales",
  "sales-automation": "crm-sales",
  "account-management": "crm-sales",
  "marketing-automation": "lifecycle-marketing",
  "ecommerce-email": "lifecycle-marketing",
  "lead-nurturing": "lifecycle-marketing",
  "lead-generation": "lifecycle-marketing",
  "funnel-building": "funnel",
  "landing-pages": "funnel",
  "web-data-collection": "web-data",
  "observability-monitoring": "ops-observability",
  "incident-oncall": "ops-observability",
  "itsm-service-desk": "itsm",
  "source-control-devops": "devtools",
  "ai-code": "devtools",
  "cloud-paas": "hosting",
  "hosting-providers": "hosting",
  "ai-image": "generative-visual",
  "ai-video": "generative-visual",
  "ai-ad-creative": "generative-visual",
  "ai-voice": "generative-audio",
  "ai-meeting": "meeting-assistant",
  "llm-assistant": "llm-assistant",
  "ai-automation": "automation",
};

export function jobFamiliesForUseCases(useCases: string[]): string[] {
  const out = new Set<string>();
  for (const u of useCases) {
    const fam = USE_CASE_FAMILY[u];
    if (fam) out.add(fam);
  }
  return [...out];
}

export function familiesOverlap(a: string[], b: string[]): boolean {
  const setB = new Set(b);
  return a.some((f) => setB.has(f));
}
