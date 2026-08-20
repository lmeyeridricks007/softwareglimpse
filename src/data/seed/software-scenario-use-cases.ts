/**
 * Scenario use-case tags layered onto catalogue products.
 *
 * Capability-style slugs (pipeline-management, lead-management, …) stay on each
 * product in software.ts. These scenario slugs power CRM hub “Explore (N)” cards
 * and use-case pages — tagged only where editorial bestFor / assessments /
 * researched feature support support the fit (not inventing coverage).
 */

/** Scenario use cases shown on the CRM category hub. */
export const CRM_SCENARIO_USE_CASE_SLUGS = [
  "account-management",
  "outbound-sales",
  "inbound-sales",
  "field-sales",
  "high-volume-lead-management",
  "complex-sales-processes",
  "customer-follow-up",
  "sales-forecasting",
  "reporting",
] as const;

export type CrmScenarioUseCaseSlug =
  (typeof CRM_SCENARIO_USE_CASE_SLUGS)[number];

/**
 * Extra useCaseSlugs merged in `soft()` when seeding software.
 * Keys are product slugs; values are scenario tags only (legacy tags remain in seed).
 */
export const SOFTWARE_SCENARIO_USE_CASE_TAGS: Record<
  string,
  readonly CrmScenarioUseCaseSlug[]
> = {
  // Pipeline / SMB sales CRMs
  pipedrive: [
    "inbound-sales",
    "outbound-sales",
    "customer-follow-up",
    "field-sales",
    "sales-forecasting",
    "reporting",
  ],
  freshsales: [
    "inbound-sales",
    "outbound-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "field-sales",
    "sales-forecasting",
    "reporting",
  ],
  close: [
    "outbound-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "field-sales",
    "sales-forecasting",
    "reporting",
  ],
  salesflare: [
    "account-management",
    "customer-follow-up",
    "outbound-sales",
    "reporting",
  ],
  folk: ["account-management", "customer-follow-up", "outbound-sales"],
  keap: [
    "inbound-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "outbound-sales",
    "reporting",
  ],
  streak: ["customer-follow-up", "inbound-sales"],
  capsule: ["account-management", "customer-follow-up", "reporting"],

  // Platforms
  salesforce: [
    "account-management",
    "complex-sales-processes",
    "inbound-sales",
    "outbound-sales",
    "field-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  hubspot: [
    "inbound-sales",
    "account-management",
    "outbound-sales",
    "high-volume-lead-management",
    "complex-sales-processes",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  "dynamics-365": [
    "account-management",
    "complex-sales-processes",
    "inbound-sales",
    "outbound-sales",
    "field-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  "zoho-crm": [
    "inbound-sales",
    "outbound-sales",
    "account-management",
    "field-sales",
    "high-volume-lead-management",
    "complex-sales-processes",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  attio: [
    "inbound-sales",
    "account-management",
    "customer-follow-up",
    "outbound-sales",
    "reporting",
  ],
  copper: [
    "account-management",
    "customer-follow-up",
    "outbound-sales",
    "field-sales",
    "sales-forecasting",
    "reporting",
  ],
  "monday-sales-crm": [
    "inbound-sales",
    "outbound-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  nutshell: [
    "inbound-sales",
    "customer-follow-up",
    "outbound-sales",
    "sales-forecasting",
    "reporting",
  ],
  insightly: [
    "inbound-sales",
    "account-management",
    "field-sales",
    "customer-follow-up",
    "reporting",
  ],
  bitrix24: [
    "inbound-sales",
    "high-volume-lead-management",
    "field-sales",
    "customer-follow-up",
    "reporting",
  ],
  "oracle-cx": [
    "account-management",
    "complex-sales-processes",
    "inbound-sales",
    "outbound-sales",
    "field-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  sugarcrm: [
    "account-management",
    "complex-sales-processes",
    "field-sales",
    "inbound-sales",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  creatio: [
    "complex-sales-processes",
    "high-volume-lead-management",
    "inbound-sales",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  activecampaign: [
    "inbound-sales",
    "high-volume-lead-management",
    "outbound-sales",
    "customer-follow-up",
    "reporting",
  ],
  nimble: ["account-management", "customer-follow-up", "outbound-sales", "reporting"],
  "agile-crm": [
    "inbound-sales",
    "outbound-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "reporting",
  ],
  affinity: [
    "account-management",
    "complex-sales-processes",
    "customer-follow-up",
    "reporting",
  ],
  apptivo: [
    "inbound-sales",
    "field-sales",
    "customer-follow-up",
    "reporting",
  ],
  cloze: ["account-management", "customer-follow-up", "field-sales", "reporting"],
  wealthbox: ["account-management", "customer-follow-up", "reporting"],
  podio: ["customer-follow-up", "complex-sales-processes"],
  pipelinepro: [
    "outbound-sales",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  zendesk: [
    "inbound-sales",
    "outbound-sales",
    "field-sales",
    "customer-follow-up",
    "reporting",
  ],
  netsuite: [
    "account-management",
    "complex-sales-processes",
    "inbound-sales",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  pega: [
    "complex-sales-processes",
    "account-management",
    "high-volume-lead-management",
    "customer-follow-up",
    "reporting",
  ],
  act: ["account-management", "customer-follow-up", "field-sales"],
  sap: [
    "account-management",
    "complex-sales-processes",
    "field-sales",
    "inbound-sales",
    "high-volume-lead-management",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],
  siebel: [
    "account-management",
    "complex-sales-processes",
    "customer-follow-up",
    "sales-forecasting",
    "reporting",
  ],

  // Marketing-automation / adjacent — only where lead/inbound fit is real
  mailchimp: ["inbound-sales", "high-volume-lead-management"],
  marketo: ["inbound-sales", "high-volume-lead-management", "reporting"],
  pardot: ["inbound-sales", "high-volume-lead-management", "reporting"],
  // tidio: chat entry — leave untagged for scenario CRM hubs
};
