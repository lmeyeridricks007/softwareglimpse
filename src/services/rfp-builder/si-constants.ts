/**
 * Sales Intelligence RFP / Vendor Brief content pack.
 * Reuses shared delivery labels / security library patterns from CRM constants.
 */

export const SI_RFP_CHANGE_TRIGGER_PROMPTS = [
  "Poor contact data coverage",
  "High bounce / bad verification",
  "Opaque credit burn",
  "Weak CRM sync",
  "Compliance / opt-out gaps",
  "Replacing list buys",
  "Enrichment not list purchase",
  "Consolidation of prospecting tools",
  "Cost reduction",
  "Geographic expansion",
] as const;

export const SI_RFP_SCOPE_CATALOG: Array<{
  id: string;
  label: string;
  capabilitySlug?: string;
}> = [
  {
    id: "data-coverage-regions",
    label: "Data coverage regions",
    capabilitySlug: "contact-data",
  },
  {
    id: "enrichment-fields",
    label: "Enrichment fields",
    capabilitySlug: "enrichment",
  },
  {
    id: "intent-signals",
    label: "Intent / buying signals (optional)",
    capabilitySlug: "intent-signals",
  },
  {
    id: "crm-integrations",
    label: "CRM integrations",
    capabilitySlug: "crm-sync",
  },
  {
    id: "credits-export-rights",
    label: "Credits / export rights",
    capabilitySlug: "enrichment",
  },
  {
    id: "security-dpa",
    label: "Security / DPA",
  },
  {
    id: "slas",
    label: "SLAs",
  },
  {
    id: "trial-success-criteria",
    label: "Trial success criteria",
  },
  {
    id: "outreach-engagement",
    label: "Outreach / engagement (if applicable)",
    capabilitySlug: "outreach-execution",
  },
  {
    id: "other",
    label: "Other",
  },
];

export const SI_RFP_USER_GROUP_PROMPTS = [
  "SDRs / BDRs",
  "Account executives",
  "Sales managers",
  "RevOps",
  "Marketing / demand gen",
  "Compliance / legal",
  "IT / security",
  "Procurement",
] as const;

export const SI_RFP_INTEGRATION_CATEGORIES = [
  "CRM",
  "Sales engagement / sequencing",
  "Email / calendar",
  "Dialer",
  "MAP / marketing automation",
  "Data warehouse",
  "Identity / SSO",
  "Enrichment waterfall / Clay-style",
  "Other",
] as const;

export const SI_RFP_MIGRATION_OBJECT_PROMPTS = [
  "Existing prospect lists",
  "Suppression / opt-out lists",
  "CRM contact mappings",
  "Saved searches / segments",
  "Sequences (if migrating engagement)",
  "Credit / usage history (if transferable)",
] as const;

export const SI_DEFAULT_SECURITY_LIBRARY: Array<{
  id: string;
  area: string;
  question: string;
  sourceSlug?: string;
}> = [
  {
    id: "SI-SEC-001",
    area: "Access",
    question: "Does the platform support SSO on the quoted edition?",
  },
  {
    id: "SI-SEC-002",
    area: "Access",
    question: "Does the platform support MFA for user and/or admin access?",
  },
  {
    id: "SI-SEC-003",
    area: "Access",
    question: "Does the platform support role-based access control (RBAC)?",
  },
  {
    id: "SI-SEC-004",
    area: "Privacy",
    question:
      "Describe GDPR / privacy programme support for prospect and customer data (do not invent certifications).",
  },
  {
    id: "SI-SEC-005",
    area: "Privacy",
    question: "Provide a current subprocessor list relevant to prospect data.",
  },
  {
    id: "SI-SEC-006",
    area: "DPA",
    question: "Is a DPA available for the quoted service? Under what terms?",
  },
  {
    id: "SI-SEC-007",
    area: "Residency",
    question: "What data residency options are available for prospect data?",
  },
  {
    id: "SI-SEC-008",
    area: "Export",
    question: "What export and deletion rights apply to buyer-exported lists?",
  },
  {
    id: "SI-SEC-009",
    area: "Suppression",
    question: "How are customer suppression / do-not-contact lists handled?",
  },
  {
    id: "SI-SEC-010",
    area: "Certifications",
    question:
      "List security certifications available for the quoted service (do not invent).",
  },
  {
    id: "SI-SEC-011",
    area: "Incident",
    question: "Describe incident notification and handling process.",
  },
  {
    id: "SI-SEC-012",
    area: "Encryption",
    question: "Is data encrypted in transit (TLS) and at rest?",
  },
];

export const SI_DEFAULT_IMPLEMENTATION_QUESTIONS: Array<{
  id: string;
  label: string;
}> = [
  { id: "si-duration", label: "Estimated rollout duration" },
  { id: "si-phases", label: "Rollout phases (pilot → expand)" },
  { id: "si-vendor-resp", label: "Vendor responsibilities" },
  { id: "si-customer-resp", label: "Customer responsibilities" },
  { id: "si-crm-connect", label: "CRM connection approach" },
  { id: "si-credit-model", label: "Credit / seat model for pilot" },
  { id: "si-training", label: "Rep training approach" },
  { id: "si-success-criteria", label: "Trial / pilot success criteria" },
  { id: "si-hypercare", label: "Post-pilot support" },
];
