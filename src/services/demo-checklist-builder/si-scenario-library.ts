/**
 * Sales Intelligence demo scenario templates.
 * Coverage / verification / sync / credits — not CRM pipeline demos.
 */

import type { DemoItemPriority } from "@/domain";
import type { DemoScenarioTemplate } from "./scenario-library";

export const SI_DEMO_SCENARIO_TEMPLATES: DemoScenarioTemplate[] = [
  {
    id: "tmpl-si-own-account-coverage",
    name: "Own-account coverage test (200 accounts)",
    businessContext:
      "Validate database coverage against a real ICP account list before buying credits.",
    persona: "RevOps / Sales Ops",
    categoryId: "contact-data",
    startingState:
      "Buyer brings a sample of ~200 target accounts (or domains) from their ICP.",
    vendorTasks: [
      "Import or match the buyer’s account list",
      "Show match rate and coverage by region/segment",
      "Surface missing accounts and thin segments",
      "Explain how coverage would change with plan/credits",
    ],
    expectedOutcome:
      "Buyer sees a transparent match rate and coverage gaps on their own accounts.",
    successCriteria: [
      "Match rate stated for the sample",
      "Gaps called out by segment or region",
      "No substitution with a cherry-picked demo list",
    ],
    evidenceRequired: [
      "Screenshot of match / coverage results",
      "Stated match rate",
      "Limitations or plan dependencies",
    ],
    priority: "must-have" as DemoItemPriority,
    estimatedMinutes: 15,
    moderatorScript:
      "Please start from a standard product environment. We will provide ~200 of our own target accounts. Match them in your database, show coverage and gaps by region or segment, and do not replace our list with a pre-built demo set.",
    capabilityHints: ["contact-data", "prospecting"],
  },
  {
    id: "tmpl-si-verified-contact-sample",
    name: "Verified contact sample",
    businessContext:
      "Test email/phone verification quality on a small ICP contact sample.",
    persona: "SDR lead",
    categoryId: "data-accuracy",
    startingState:
      "Buyer provides 20–50 contacts or titles at known accounts to enrich/reveal.",
    vendorTasks: [
      "Reveal or enrich emails (and phones if claimed)",
      "Show verification status and freshness signals",
      "Explain bounce / bad-data handling",
      "State which credits were consumed",
    ],
    expectedOutcome:
      "Buyer can assess verification claims with a real sample and clear credit cost.",
    successCriteria: [
      "Verification status visible per contact",
      "Credit burn for the sample is stated",
      "Limitations for phones/emails are disclosed",
    ],
    evidenceRequired: [
      "Sample results screenshot",
      "Credits used",
      "Verification method stated by vendor",
    ],
    priority: "must-have" as DemoItemPriority,
    estimatedMinutes: 12,
    moderatorScript:
      "Using contacts from our ICP sample, reveal or enrich emails and phones you claim to verify. Show verification status, freshness, and exactly how many credits this sample consumed.",
    capabilityHints: ["contact-data", "enrichment", "data-accuracy"],
  },
  {
    id: "tmpl-si-crm-sync-writeback",
    name: "CRM sync writeback",
    businessContext:
      "Confirm contacts and activity write back cleanly to the CRM system of record.",
    persona: "RevOps",
    categoryId: "crm-sync",
    startingState:
      "A sandbox CRM (or agreed test org) is connected; sample contacts exist in the SI tool.",
    vendorTasks: [
      "Push or sync contacts/companies to CRM",
      "Show field mapping and dedupe behaviour",
      "Update a field in SI and show CRM writeback (or explain one-way limits)",
      "Show activity logging if claimed",
    ],
    expectedOutcome:
      "Buyer understands sync direction, mapping, and overwrite risks with evidence.",
    successCriteria: [
      "Records appear in CRM without unexplained duplicates",
      "Sync direction and overwrite rules are stated",
      "Edition / connector requirements disclosed",
    ],
    evidenceRequired: [
      "CRM record screenshot",
      "Mapping notes",
      "Sync limitations",
    ],
    priority: "must-have" as DemoItemPriority,
    estimatedMinutes: 14,
    moderatorScript:
      "Connect to our test CRM. Sync a small set of contacts from your product, show field mapping and dedupe, then demonstrate writeback or clearly state one-way limits. Do not skip to a pre-synced demo org unless that is what customers get.",
    capabilityHints: ["crm-sync", "integrations"],
  },
  {
    id: "tmpl-si-credit-burn-transparency",
    name: "Credit burn transparency",
    businessContext:
      "Make credit consumption for search, reveal, enrich, and export understandable.",
    persona: "Buyer / procurement",
    categoryId: "credit-transparency",
    startingState: "Vendor claims credit-based or hybrid pricing.",
    vendorTasks: [
      "Show credit balance and consumption rules",
      "Run a search, reveal, enrich, and export (or state N/A)",
      "Show how each action debits credits",
      "Explain rollover, overage, and seat vs credit models",
    ],
    expectedOutcome:
      "Buyer can model monthly burn without opaque marketing language.",
    successCriteria: [
      "Per-action credit cost visible or documented",
      "Overage / rollover rules stated",
      "No invented volume discounts presented as facts",
    ],
    evidenceRequired: [
      "Screenshot of credit ledger or pricing UI",
      "Written credit rules",
    ],
    priority: "must-have" as DemoItemPriority,
    estimatedMinutes: 10,
    moderatorScript:
      "Show your credit (or usage) model live. Perform a search, a reveal/enrich, and an export if available. Explain exactly what each action costs and how overages work. Do not quote special pricing as standard.",
    capabilityHints: ["credit-transparency", "enrichment"],
  },
  {
    id: "tmpl-si-compliance-opt-out",
    name: "Compliance / opt-out handling",
    businessContext:
      "Understand suppression, opt-out, and lawful outreach controls for regulated regions.",
    persona: "Compliance / RevOps",
    categoryId: "compliance",
    startingState:
      "Buyer sells into regions with GDPR or similar outreach constraints.",
    vendorTasks: [
      "Show suppression / do-not-contact lists",
      "Demonstrate opt-out or unsubscribe handling if outreach is included",
      "Explain data sourcing and DPA posture at a high level",
      "State what the customer must still own legally",
    ],
    expectedOutcome:
      "Buyer knows which controls exist in-product vs customer process.",
    successCriteria: [
      "Suppression capability demonstrated or marked unavailable",
      "Customer vs vendor responsibilities stated",
      "No legal advice presented as product guarantee",
    ],
    evidenceRequired: [
      "Screenshot of suppression UI or docs",
      "Responsibility notes",
    ],
    priority: "should-have" as DemoItemPriority,
    estimatedMinutes: 10,
    moderatorScript:
      "Show how suppression and opt-out work for outbound. If outreach is not in-product, show how exports respect suppression and what buyers must handle in their stack. Do not present legal advice as a product feature.",
    capabilityHints: ["compliance", "outreach-execution"],
  },
  {
    id: "tmpl-si-rep-day-in-life",
    name: "Rep day-in-life trial",
    businessContext:
      "Can an SDR complete a realistic daily loop: find, verify, save, sync, and next step?",
    persona: "SDR",
    categoryId: "ease-of-use",
    startingState:
      "Rep needs to build a small list for one ICP segment and leave CRM-ready records.",
    vendorTasks: [
      "Search/filter an ICP segment",
      "Select and verify a handful of contacts",
      "Save/export or sync to CRM",
      "Show how unfinished work resumes next day",
    ],
    expectedOutcome:
      "Buyer sees learning curve and friction for daily SDR work.",
    successCriteria: [
      "Loop completes without spreadsheet workarounds",
      "Time and clicks noted",
      "Edition limits affecting the loop disclosed",
    ],
    evidenceRequired: [
      "Time to complete loop",
      "Screenshot of saved list / CRM records",
      "Friction notes",
    ],
    priority: "should-have" as DemoItemPriority,
    estimatedMinutes: 12,
    moderatorScript:
      "Act as an SDR. Find contacts for one ICP segment, verify a few, save or sync them, and show how you would pick up tomorrow. Stay in a standard customer workflow — no admin-only shortcuts.",
    capabilityHints: ["ease-of-use", "contact-data", "crm-sync", "prospecting"],
  },
];

export function getSiDemoScenarioTemplate(
  id: string,
): DemoScenarioTemplate | undefined {
  return SI_DEMO_SCENARIO_TEMPLATES.find((t) => t.id === id);
}
