/**
 * Canonical SAMPLE requirement rows for the CRM RFP template.
 * IDs align with CRM Requirements pillar where possible (CRM-REQ-001…010).
 * Replace/extend with your signed requirements before issuing to vendors.
 */

export type RfpRequirementPriority = "MUST HAVE" | "SHOULD HAVE" | "COULD HAVE";

export type RfpRequirementRow = {
  id: string;
  category: string;
  requirement: string;
  priority: RfpRequirementPriority;
  /** Optional link into SoftwareGlimpse requirements taxonomy */
  slug?: string;
};

/** Pillar-aligned functional / platform rows (CRM-REQ-001…010). */
export const RFP_PILLAR_REQUIREMENTS: RfpRequirementRow[] = [
  {
    id: "CRM-REQ-001",
    category: "Pipeline & forecasting",
    requirement:
      "Configure multiple sales processes / pipelines with independent stages and stage rules on the quoted edition.",
    priority: "MUST HAVE",
    slug: "separate-sales-processes",
  },
  {
    id: "CRM-REQ-002",
    category: "Sales automation",
    requirement:
      "Automate lead follow-up tasks and reminders without requiring admin intervention for every lead.",
    priority: "MUST HAVE",
    slug: "automate-lead-follow-up",
  },
  {
    id: "CRM-REQ-003",
    category: "Security & access",
    requirement:
      "Restrict record access by team / role so sellers only see authorised accounts and deals.",
    priority: "MUST HAVE",
    slug: "restrict-access-by-team",
  },
  {
    id: "CRM-REQ-004",
    category: "Pipeline & forecasting",
    requirement:
      "Produce a management forecast from CRM pipeline data without rebuilding the board in a spreadsheet.",
    priority: "MUST HAVE",
    slug: "forecast-revenue",
  },
  {
    id: "CRM-REQ-005",
    category: "Core CRM",
    requirement:
      "Track client interactions (calls, meetings, notes) on the contact and account timeline.",
    priority: "MUST HAVE",
    slug: "track-client-interactions",
  },
  {
    id: "CRM-REQ-006",
    category: "Core CRM",
    requirement:
      "Create and manage custom fields on core objects without a vendor ticket for each change.",
    priority: "SHOULD HAVE",
    slug: "customize-record-fields",
  },
  {
    id: "CRM-REQ-007",
    category: "Commercial / multi-currency",
    requirement:
      "Support multiple deal currencies with a documented rollup / reporting approach.",
    priority: "COULD HAVE",
    slug: "support-multiple-currencies",
  },
  {
    id: "CRM-REQ-008",
    category: "Communication",
    requirement:
      "Integrate with company email so activity can sync to the correct CRM records on the quoted edition.",
    priority: "MUST HAVE",
    slug: "integrate-with-email",
  },
  {
    id: "CRM-REQ-009",
    category: "Security & access",
    requirement:
      "Support SSO for named user access on the quoted edition.",
    priority: "SHOULD HAVE",
    slug: "support-sso",
  },
  {
    id: "CRM-REQ-010",
    category: "Security & access",
    requirement:
      "Provide auditability of user activity / admin changes suitable for access reviews.",
    priority: "SHOULD HAVE",
    slug: "audit-user-activity",
  },
];

/** Additional SAMPLE rows (teaching) — replace with your signed must-haves. */
export const RFP_SAMPLE_EXTRA_REQUIREMENTS: RfpRequirementRow[] = [
  {
    id: "REQ-CRM-011",
    category: "Reporting & analytics",
    requirement:
      "Build and share operational dashboards without exporting to a spreadsheet for the weekly review.",
    priority: "MUST HAVE",
  },
  {
    id: "REQ-CRM-012",
    category: "Data & exit",
    requirement:
      "Export contacts, deals, and activities in a documented format the buyer can re-import elsewhere.",
    priority: "MUST HAVE",
  },
  {
    id: "REQ-TECH-001",
    category: "Technical & integration",
    requirement:
      "Provide documented REST APIs (or equivalent) for reading and writing core CRM objects.",
    priority: "MUST HAVE",
  },
  {
    id: "REQ-TECH-002",
    category: "Technical & integration",
    requirement:
      "Support webhooks or equivalent event notifications for key record changes.",
    priority: "SHOULD HAVE",
  },
  {
    id: "REQ-SEC-001",
    category: "Security & privacy",
    requirement:
      "Support MFA for administrative and/or user access on the quoted edition.",
    priority: "MUST HAVE",
  },
  {
    id: "REQ-SEC-002",
    category: "Security & privacy",
    requirement:
      "Document data residency options and subprocessors relevant to customer CRM data.",
    priority: "SHOULD HAVE",
  },
  {
    id: "REQ-MIG-001",
    category: "Data migration",
    requirement:
      "Describe migration tooling, validation approach, and limitations for historical activities/attachments.",
    priority: "MUST HAVE",
  },
];

export const RFP_ALL_SAMPLE_REQUIREMENTS: RfpRequirementRow[] = [
  ...RFP_PILLAR_REQUIREMENTS,
  ...RFP_SAMPLE_EXTRA_REQUIREMENTS,
];

export const RFP_DELIVERY_METHODS = [
  "Native",
  "Configuration",
  "Custom",
  "Partner / Third party",
  "Roadmap",
  "Not supported",
  "N/A",
] as const;
