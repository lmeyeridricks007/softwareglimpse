/**
 * Sales Intelligence demo checklist content pack.
 * Evaluation areas / checks oriented to data, credits, sync — not CRM pipeline.
 */

import type { DemoItemPriority } from "@/domain";

export const SI_DEFAULT_EVALUATION_AREAS: Array<{ id: string; label: string }> =
  [
    { id: "contact-data", label: "Contact data coverage" },
    { id: "data-accuracy", label: "Data accuracy / verification" },
    { id: "enrichment", label: "Enrichment depth" },
    { id: "crm-sync", label: "CRM sync / writeback" },
    { id: "credit-transparency", label: "Credit / pricing transparency" },
    { id: "compliance", label: "Compliance / opt-out" },
    { id: "ease-of-use", label: "Ease of use" },
    { id: "outreach", label: "Outreach / engagement (if applicable)" },
    { id: "integrations", label: "Integrations" },
    { id: "export", label: "Export / list rights" },
    { id: "intent", label: "Intent / signals (optional)" },
    { id: "security", label: "Security / DPA" },
    { id: "administration", label: "Administration / seats" },
    { id: "implementation", label: "Implementation / onboarding" },
  ];

export const SI_DEFAULT_DEMO_GUIDELINES = `DEMO GUIDELINES — SALES INTELLIGENCE

Please use the scenarios provided.

Prefer a standard product environment with transparent credit balances.

Clearly identify functionality that requires:
- higher credit tiers or seat packs
- add-on data regions
- CRM connector editions
- third-party enrichment waterfalls
- outreach / sequencing modules

If a requested capability cannot be demonstrated, please state this rather than substituting a cherry-picked demo list.

Do not replace the buyer's account sample with a pre-built demo universe.
The buyer owns the demo agenda.`;

export const SI_DEFAULT_FUNCTIONAL_QUESTIONS: Array<{
  id: string;
  question: string;
}> = [
  {
    id: "SI-Q-F-001",
    question: "Can coverage be shown against the buyer's own account list?",
  },
  {
    id: "SI-Q-F-002",
    question: "Is email/phone verification status visible per contact?",
  },
  {
    id: "SI-Q-F-003",
    question: "Which enrichment fields are included in the quoted edition?",
  },
  {
    id: "SI-Q-F-004",
    question: "Does CRM sync require a specific connector or plan?",
  },
  {
    id: "SI-Q-F-005",
    question: "Can credit burn be shown for search, reveal, enrich, and export?",
  },
  {
    id: "SI-Q-F-006",
    question: "Are suppression / do-not-contact lists supported in-product?",
  },
];

export const SI_DEFAULT_ADMIN_QUESTIONS: Array<{
  id: string;
  question: string;
}> = [
  { id: "SI-Q-A-001", question: "Who can manage seats and credit pools?" },
  {
    id: "SI-Q-A-002",
    question: "Can admins set field mapping and overwrite rules for CRM sync?",
  },
  {
    id: "SI-Q-A-003",
    question: "Can admins manage suppression lists centrally?",
  },
  {
    id: "SI-Q-A-004",
    question: "Can usage / credit reports be exported for finance?",
  },
  {
    id: "SI-Q-A-005",
    question: "Does SSO require a higher edition?",
  },
];

export const SI_DEFAULT_DATA_QUESTIONS: Array<{
  id: string;
  question: string;
}> = [
  {
    id: "SI-Q-D-001",
    question: "Can buyer lists be imported for coverage matching?",
  },
  {
    id: "SI-Q-D-002",
    question: "What export formats and rights apply to revealed contacts?",
  },
  {
    id: "SI-Q-D-003",
    question: "Do exports respect suppression lists?",
  },
  {
    id: "SI-Q-D-004",
    question: "Is historical credit usage retained for audits?",
  },
  {
    id: "SI-Q-D-005",
    question: "What happens to exported data if the subscription ends?",
  },
];

export const SI_DEFAULT_INTEGRATION_CHECKS: Array<{
  id: string;
  integration: string;
  testTask: string;
}> = [
  {
    id: "SI-INT-001",
    integration: "CRM (Salesforce / HubSpot / Dynamics)",
    testTask:
      "Sync a small contact set, show field mapping, and confirm writeback or one-way limits.",
  },
  {
    id: "SI-INT-002",
    integration: "Sales engagement / sequencing",
    testTask:
      "Show how verified contacts enter a sequence without re-keying (or state N/A).",
  },
  {
    id: "SI-INT-003",
    integration: "Email / calendar",
    testTask:
      "Demonstrate any native engagement logging claimed for the quoted edition.",
  },
  {
    id: "SI-INT-004",
    integration: "SSO / identity",
    testTask:
      "Show SSO availability and which edition includes it.",
  },
  {
    id: "SI-INT-005",
    integration: "API / webhooks",
    testTask:
      "Show API auth method and an example enrichment or export endpoint (docs OK if live call blocked).",
  },
];

export const SI_DEFAULT_ADMIN_TASKS: Array<{
  id: string;
  category: "reporting" | "administration" | "ai";
  label: string;
  vendorTask: string;
  successCriteria: string;
  evidenceRequired: string;
  estimatedMinutes: number;
  priority: DemoItemPriority;
}> = [
  {
    id: "SI-ADM-001",
    category: "reporting",
    label: "Credit usage report",
    vendorTask:
      "Open usage / credit reporting for the last period and filter by user or team if available.",
    successCriteria:
      "Buyer can see what consumed credits without contacting support.",
    evidenceRequired: "Screenshot of usage report",
    estimatedMinutes: 6,
    priority: "must-have",
  },
  {
    id: "SI-ADM-002",
    category: "administration",
    label: "Seat / credit allocation",
    vendorTask:
      "Show how seats and credits are assigned across a small team.",
    successCriteria: "Allocation rules are clear for the quoted model.",
    evidenceRequired: "Screenshot or written model notes",
    estimatedMinutes: 5,
    priority: "should-have",
  },
  {
    id: "SI-ADM-003",
    category: "administration",
    label: "CRM connector settings",
    vendorTask:
      "Open CRM connector settings and explain overwrite / dedupe defaults.",
    successCriteria: "Overwrite risks are disclosed before go-live.",
    evidenceRequired: "Notes on sync direction + mapping",
    estimatedMinutes: 7,
    priority: "must-have",
  },
];

export const SI_DEFAULT_COMMERCIAL_QUESTIONS: Array<{
  id: string;
  topic: string;
  question: string;
}> = [
  {
    id: "SI-COM-001",
    topic: "Credits",
    question:
      "What exactly consumes a credit (search, reveal, enrich, export, intent)?",
  },
  {
    id: "SI-COM-002",
    topic: "Overage",
    question: "What happens when credits are exhausted mid-month?",
  },
  {
    id: "SI-COM-003",
    topic: "Regions",
    question: "Are additional data regions priced separately?",
  },
  {
    id: "SI-COM-004",
    topic: "Export rights",
    question: "What export and retention rights apply after contract end?",
  },
  {
    id: "SI-COM-005",
    topic: "Trial",
    question: "What success criteria and credit allotment apply to a pilot?",
  },
];
