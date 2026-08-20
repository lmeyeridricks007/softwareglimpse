/**
 * CRM RFP Template — Excel vendor response workbook (slug: crm-rfp-template).
 * PRIMARY vendor-facing response artifact. Blank buyer/vendor inputs + SAMPLE
 * requirement rows only. Optional COUNTIF / SUM formulas compute in Excel.
 * Do not invent pricing, vendor winners, or Pass/Partial/Fail as the response model.
 */

import {
  RFP_ALL_SAMPLE_REQUIREMENTS,
  RFP_DELIVERY_METHODS,
} from "@/data/resource-hub/crm-rfp-requirements";

type AOA = (string | number | null)[][];

type SheetSpec = {
  name: string;
  aoa: AOA;
  cols?: { wch: number }[];
  autofilter?: string;
};

const FUNC_HEADERS = [
  "ID",
  "Category",
  "Requirement",
  "Priority",
  "Vendor response",
  "Delivery method",
  "Edition/tier",
  "Evidence/reference",
  "Comments",
] as const;

/** Functional req data: header Excel row 5; data from row 6. */
const FUNC_HEADER_ROW = 5;
const FUNC_DATA_FIRST = 6;
const FUNC_BLANK_EXTRA = 15;
const FUNC_DATA_LAST =
  FUNC_DATA_FIRST + RFP_ALL_SAMPLE_REQUIREMENTS.length + FUNC_BLANK_EXTRA - 1;

const TECH_REQS = RFP_ALL_SAMPLE_REQUIREMENTS.filter((r) =>
  r.id.startsWith("REQ-TECH"),
);
const TECH_HEADER_ROW = 5;
const TECH_DATA_FIRST = 6;
const TECH_BLANK_EXTRA = 12;
const TECH_DATA_LAST =
  TECH_DATA_FIRST + TECH_REQS.length + TECH_BLANK_EXTRA - 1;

const blankRow = (cols: number): (string | number | null)[] =>
  Array.from({ length: cols }, () => "");

/** Build all sheets as array-of-arrays; formulas as Excel formula strings. */
export function buildCrmRfpWorkbookAoa(): SheetSpec[] {
  const deliveryLegend = RFP_DELIVERY_METHODS.map((method) => {
    const defs: Record<(typeof RFP_DELIVERY_METHODS)[number], string> = {
      Native: "Available as standard product functionality on the quoted edition.",
      Configuration:
        "Available through product configuration / admin setup (not custom code).",
      Custom: "Requires custom development (buyer, vendor, or partner).",
      "Partner / Third party":
        "Depends on another product, marketplace app, or implementation partner.",
      Roadmap: "Not available today; planned — treat as not current for MUST HAVEs.",
      "Not supported": "Requirement cannot currently be met.",
      "N/A": "Not applicable to this proposal / out of quoted scope.",
    };
    return [method, defs[method]];
  });

  const instructions: AOA = [
    ["SoftwareGlimpse — CRM RFP Template (Excel)"],
    ["Updated", new Date().toISOString().slice(0, 10)],
    ["Stable slug", "crm-rfp-template"],
    ["Version", "1.0"],
    [],
    ["Purpose"],
    [
      "This workbook is the PRIMARY VENDOR RESPONSE artifact for a CRM RFP. Buyers fill context and requirements; vendors complete response columns (especially Delivery method + evidence). Score answers later on the Vendor Scorecard — not inside this file with Pass/Partial/Fail.",
    ],
    [],
    ["SAMPLE content warning"],
    [
      "SAMPLE — REPLACE WITH YOUR SIGNED REQUIREMENTS. Rows on 06_Functional_Requirements (and SAMPLE prompts elsewhere) are teaching examples only. Clear or replace them before issuing to vendors. Do not treat SAMPLE rows as SoftwareGlimpse research or product guarantees.",
    ],
    [],
    ["How to use (buyer)"],
    ["1. Complete 02_Project_Context, 03_Objectives, 04_Scope, and 05_Users."],
    [
      "2. Replace SAMPLE requirements on 06 with your signed must/should/could list (stable IDs). Extend technical rows on 07; fill integrations, migration, security, implementation, training, support, and pricing shells.",
    ],
    [
      "3. Issue the same package to every invited vendor. Vendors answer in-workbook — do not accept slide decks as a substitute for the response tables.",
    ],
    [
      "4. After responses, use 18_Response_Summary counts for completeness; map answers to CRM Vendor Scorecard / Decision Matrix. Keep INTERNAL notes off the vendor send package.",
    ],
    [],
    ["Response rules (vendors)"],
    ["Do not remove requirement IDs."],
    ["Answer every applicable requirement."],
    ["Distinguish native capability from configuration / custom development."],
    ["Identify third-party or partner dependencies."],
    ["Name the edition / tier required for gated capabilities."],
    ["Provide evidence (doc URL, admin path, or demo reference) where requested."],
    ["Mark roadmap items explicitly — roadmap ≠ available for MUST HAVE scoring."],
    ["State assumptions and exclusions on 17_Risks_Exceptions."],
    ["Use the pricing structure on 14_Pricing — leave cells blank if unknown; do not invent."],
    ["Do not substitute marketing collateral for requested table responses."],
    [],
    ["Delivery method legend (use these values on requirement sheets)"],
    ["Delivery method", "Meaning"],
    ...deliveryLegend,
    [],
    ["Allowed values (set Data Validation in Excel after open)"],
    [
      "Delivery method",
      RFP_DELIVERY_METHODS.join(" / "),
    ],
    [
      "Priority (buyer)",
      "MUST HAVE / SHOULD HAVE / COULD HAVE / Out of Scope",
    ],
    [
      "Primary vendor response model",
      "Delivery method + short Vendor response + Edition/tier + Evidence — NOT Pass / Partial / Fail.",
    ],
    [],
    ["When NOT to use a formal RFP"],
    [
      "Tiny team, simple self-service CRM need, obvious 1–2 vendor shortlist, or no procurement/security mandate — prefer Requirements Builder + Evaluation Checklist + demos instead of a full RFP cycle.",
    ],
    [
      "Good fit for an RFP: multiple serious finalists, larger buying committee, material integration/migration work, security/procurement requirements, or pricing that needs a normalized comparison.",
    ],
    [],
    ["Sheet map"],
    ["01_Instructions", "Purpose, rules, delivery legend, links (this sheet)"],
    ["02_Project_Context", "Buyer company / project / dates (blank)"],
    ["03_Objectives", "Business objectives (OBJ-##)"],
    ["04_Scope", "In / out of scope + phases"],
    ["05_Users", "User groups + growth"],
    ["06_Functional_Requirements", "Primary requirement–response table (SAMPLE + blanks)"],
    ["07_Technical_Requirements", "REQ-TECH + blank technical rows"],
    ["08_Integrations", "System integration matrix"],
    ["09_Data_Migration", "Objects, responsibility, vendor questions"],
    ["10_Security", "Security / privacy questions"],
    ["11_Implementation", "Timeline phases (blank durations)"],
    ["12_Training", "Training services"],
    ["13_Support", "Severity / SLA commitments"],
    ["14_Pricing", "Normalized commercial response (BLANK — no invented prices)"],
    ["15_Vendor_Profile", "Vendor company / product profile"],
    ["16_References", "Customer references"],
    ["17_Risks_Exceptions", "Assumptions, exceptions, risks"],
    ["18_Response_Summary", "COUNTIF helpers + declaration + INTERNAL notes"],
    [],
    ["Related SoftwareGlimpse resources"],
    [
      "CRM RFP Template (this resource)",
      "https://softwareglimpse.com/resources/crm-rfp-template/",
    ],
    [
      "CRM Requirements Builder",
      "https://softwareglimpse.com/tools/crm-requirements-builder/",
    ],
    [
      "CRM Evaluation Checklist",
      "https://softwareglimpse.com/resources/crm-evaluation-checklist/",
    ],
    [
      "CRM Vendor Scorecard",
      "https://softwareglimpse.com/resources/crm-vendor-scorecard/",
    ],
    [
      "CRM Comparison Worksheet",
      "https://softwareglimpse.com/resources/crm-comparison-worksheet/",
    ],
    [
      "CRM Business Case Template",
      "https://softwareglimpse.com/resources/crm-business-case-template/",
    ],
    [
      "CRM Field Mapping Template",
      "https://softwareglimpse.com/resources/crm-field-mapping-template/",
    ],
    [
      "CRM Cost Calculator",
      "https://softwareglimpse.com/tools/crm-cost-calculator/",
    ],
  ];

  const projectContext: AOA = [
    ["02 — PROJECT CONTEXT"],
    [],
    ["COMPANY OVERVIEW"],
    ["Company name", ""],
    ["Industry", ""],
    ["Employees (band)", ""],
    ["Locations", ""],
    ["Markets", ""],
    ["Business model", ""],
    ["Sales model / motion", ""],
    [],
    ["CURRENT ENVIRONMENT"],
    ["Current CRM", ""],
    ["Other relevant systems", ""],
    ["Current number of users", ""],
    ["Current integrations", ""],
    [],
    ["PROJECT"],
    ["Project / initiative name", ""],
    ["RFP issue date", ""],
    ["Questions deadline", ""],
    ["Response due date", ""],
    ["Demo window", ""],
    ["Decision target date", ""],
    ["Buyer contact name", ""],
    ["Buyer contact email", ""],
    ["Clarification rule", "Material clarifications shared with all invited vendors"],
    [],
    ["WHY WE ARE EVALUATING CRM"],
    ["Current problems", ""],
    ["Business impact", ""],
    ["What triggered the evaluation", ""],
    ["Desired future state", ""],
    [],
    ["CONFIDENTIALITY"],
    [
      "Note",
      "This RFP and responses are confidential between the buyer and the invited vendor. Do not redistribute without written permission.",
    ],
  ];

  const objectives: AOA = [
    ["03 — BUSINESS OBJECTIVES"],
    [],
    [
      "Objectives explain WHY the CRM project exists — not product feature requirements. SAMPLE rows are teaching only; replace with yours.",
    ],
    [],
    [
      "ID",
      "Business objective",
      "Current baseline",
      "Target outcome",
      "Measurement",
      "Priority",
    ],
    [
      "OBJ-01",
      "SAMPLE — Improve pipeline visibility",
      "",
      "",
      "",
      "",
    ],
    [
      "OBJ-02",
      "SAMPLE — Reduce forecast preparation time",
      "",
      "",
      "",
      "",
    ],
    [
      "OBJ-03",
      "SAMPLE — Improve follow-up consistency",
      "",
      "",
      "",
      "",
    ],
    [
      "OBJ-04",
      "SAMPLE — Unify customer activity history",
      "",
      "",
      "",
      "",
    ],
    ["OBJ-05", "", "", "", "", ""],
    ["OBJ-06", "", "", "", "", ""],
    ["OBJ-07", "", "", "", "", ""],
    ["OBJ-08", "", "", "", "", ""],
  ];

  const scopeInItems = [
    "Contact / account management",
    "Opportunity management",
    "Pipeline management",
    "Activity management",
    "Email / calendar integration",
    "Forecasting",
    "Reporting / dashboards",
    "Workflow automation",
    "Mobile CRM",
    "Integrations",
    "Data migration",
  ];

  const scope: AOA = [
    ["04 — SCOPE"],
    [],
    [
      "Mark In scope? Yes/No for each item. Leave blank until decided. Do not invent scope for the buyer.",
    ],
    [],
    ["IN SCOPE"],
    ["Item", "In scope? (Yes/No)", "Notes"],
    ...scopeInItems.map((item) => [item, "", ""]),
    [],
    ["OUT OF SCOPE"],
    ["Item / exclusion", "Notes"],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    [],
    ["PHASES"],
    ["Phase", "In scope for this phase?", "Notes"],
    ["Phase 1 (day one)", "", ""],
    ["Phase 2", "", ""],
    ["Future", "", ""],
  ];

  const users: AOA = [
    ["05 — USERS & OPERATING MODEL"],
    [],
    [
      "Fill user groups for quoting and architecture. SAMPLE labels are structure only — leave counts blank until known.",
    ],
    [],
    [
      "User group",
      "Number of users",
      "Primary job",
      "Access level",
      "Key workflows",
    ],
    ["SAMPLE — Sales reps", "", "", "", ""],
    ["SAMPLE — Sales managers", "", "", "", ""],
    ["SAMPLE — RevOps", "", "", "", ""],
    ["SAMPLE — CRM admins", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    [],
    ["REGIONS / LANGUAGES"],
    ["Regions", ""],
    ["Languages", ""],
    [],
    ["EXPECTED GROWTH"],
    ["Current users", ""],
    ["12-month users", ""],
    ["36-month users", ""],
  ];

  const funcRows: AOA = RFP_ALL_SAMPLE_REQUIREMENTS.map((r) => [
    r.id,
    r.category,
    r.requirement,
    r.priority,
    "",
    "",
    "",
    "",
    "",
  ]);

  const functional: AOA = [
    ["06 — FUNCTIONAL REQUIREMENTS (primary vendor response table)"],
    [],
    [
      `SAMPLE — REPLACE WITH YOUR SIGNED REQUIREMENTS. Pre-filled ID / Category / Requirement / Priority from SoftwareGlimpse sample set. Leave Vendor response, Delivery method (${RFP_DELIVERY_METHODS.join(", ")}), Edition/tier, Evidence, and Comments blank for vendors. Data rows Excel ${FUNC_DATA_FIRST}–${FUNC_DATA_LAST}.`,
    ],
    [],
    [...FUNC_HEADERS],
    ...funcRows,
    ...Array.from({ length: FUNC_BLANK_EXTRA }, () =>
      blankRow(FUNC_HEADERS.length),
    ),
  ];

  const techHeaders = [
    "ID",
    "Requirement",
    "Priority",
    "Vendor response",
    "Delivery / approach (Native/API/Partner/…)",
    "Limits",
    "Evidence",
    "Comments",
  ] as const;

  const techRows: AOA = TECH_REQS.map((r) => [
    r.id,
    r.requirement,
    r.priority,
    "",
    "",
    "",
    "",
    "",
  ]);

  const technical: AOA = [
    ["07 — TECHNICAL REQUIREMENTS"],
    [],
    [
      "REQ-TECH sample rows + blank rows for APIs, webhooks, auth, SSO, SCIM, rate limits, bulk APIs, sandbox, export, marketplace, events. Do not invent product capabilities.",
    ],
    [],
    [...techHeaders],
    ...techRows,
    ...Array.from({ length: TECH_BLANK_EXTRA }, () =>
      blankRow(techHeaders.length),
    ),
  ];

  const integrations: AOA = [
    ["08 — INTEGRATIONS"],
    [],
    [
      "System integration matrix — leave vendor columns blank. Name your real systems; do not invent vendor connectors.",
    ],
    [],
    [
      "System",
      "Direction",
      "Data",
      "Frequency",
      "Integration method",
      "Vendor comments",
    ],
    ["ERP", "", "", "", "", ""],
    ["Marketing automation", "", "", "", "", ""],
    ["Customer support", "", "", "", "", ""],
    ["Data warehouse", "", "", "", "", ""],
    ["Email / calendar", "", "", "", "", ""],
    ["Identity provider (IdP)", "", "", "", "", ""],
    ["Website / forms", "", "", "", "", ""],
    ...Array.from({ length: 6 }, () => blankRow(6)),
  ];

  const migration: AOA = [
    ["09 — DATA MIGRATION"],
    [],
    [
      "Object scope + responsibility + vendor questions. Link field detail to CRM Field Mapping Template. Do not invent volumes.",
    ],
    [],
    ["DATA MIGRATION SCOPE"],
    [
      "Object",
      "Approx records",
      "Source",
      "History required",
      "Attachments",
      "Notes",
    ],
    ["Contacts", "", "", "", "", ""],
    ["Accounts", "", "", "", "", ""],
    ["Leads", "", "", "", "", ""],
    ["Opportunities", "", "", "", "", ""],
    ["Activities", "", "", "", "", ""],
    ["Emails", "", "", "", "", ""],
    ["Notes", "", "", "", "", ""],
    ["Custom objects", "", "", "", "", ""],
    ...Array.from({ length: 4 }, () => blankRow(6)),
    [],
    ["MIGRATION RESPONSIBILITY"],
    ["Area", "Buyer", "Vendor", "Implementation partner", "Shared", "Notes"],
    ["Extract / export", "", "", "", "", ""],
    ["Field mapping", "", "", "", "", ""],
    ["Transform / load", "", "", "", "", ""],
    ["Validation", "", "", "", "", ""],
    ["Cutover / rollback", "", "", "", "", ""],
    [],
    ["VENDOR QUESTIONS"],
    ["Question", "Vendor response", "Evidence / notes"],
    ["Migration tooling provided?", "", ""],
    ["Migration validation approach?", "", ""],
    ["Deduplication support?", "", ""],
    ["Rollback approach?", "", ""],
    ["Historical activity migration?", "", ""],
    ["Attachment limitations?", "", ""],
  ];

  const securityQs = [
    ["SEC-01", "Authentication model for named users"],
    ["SEC-02", "SSO support and required edition"],
    ["SEC-03", "MFA options for admin and/or end users"],
    ["SEC-04", "Role-based access / record sharing model"],
    ["SEC-05", "Audit logs for user and admin activity"],
    ["SEC-06", "Encryption in transit and at rest (describe)"],
    ["SEC-07", "Data residency options"],
    ["SEC-08", "Backup and restore approach"],
    ["SEC-09", "Retention and deletion controls"],
    ["SEC-10", "GDPR / privacy support (describe; no legal advice)"],
    ["SEC-11", "Subprocessors relevant to CRM customer data"],
    ["SEC-12", "Security certifications (list only what you hold; attach evidence)"],
    ["SEC-13", "Incident management process"],
    ["SEC-14", "Business continuity / disaster recovery summary"],
  ];

  const security: AOA = [
    ["10 — SECURITY / PRIVACY / COMPLIANCE"],
    [],
    [
      "Vendor response template only. Do not claim certifications for any vendor. Leave response / evidence / exception blank for vendors.",
    ],
    [],
    [
      "ID",
      "Requirement / question",
      "Vendor response",
      "Evidence",
      "Exception",
    ],
    ...securityQs.map(([id, q]) => [id, q, "", "", ""]),
    ...Array.from({ length: 4 }, () => blankRow(5)),
  ];

  const implPhases = [
    "Discovery",
    "Design",
    "Configuration",
    "Integration",
    "Migration",
    "Testing",
    "Training",
    "Go-live",
    "Hypercare",
  ];

  const implementation: AOA = [
    ["11 — IMPLEMENTATION"],
    [],
    [
      "Vendors propose approach and durations. Leave blank until responded — do not invent timelines.",
    ],
    [],
    ["PROPOSED APPROACH"],
    ["Estimated total duration", ""],
    ["Vendor responsibilities", ""],
    ["Customer responsibilities", ""],
    ["Partner responsibilities", ""],
    ["Dependencies", ""],
    ["Required customer resources", ""],
    [],
    ["IMPLEMENTATION TIMELINE"],
    ["Phase", "Estimated duration", "Vendor notes"],
    ...implPhases.map((p) => [p, "", ""]),
  ];

  const training: AOA = [
    ["12 — TRAINING / ADOPTION"],
    [],
    [
      "Ask what is included vs paid. Leave Cost blank if not quoted — do not invent prices.",
    ],
    [],
    ["Service", "Included?", "Delivery model", "Cost", "Notes"],
    ["Administrator training", "", "", "", ""],
    ["End-user training", "", "", "", ""],
    ["Manager training", "", "", "", ""],
    ["Training format (live / virtual / self-paced)", "", "", "", ""],
    ["Learning portal / LMS access", "", "", "", ""],
    ["Documentation", "", "", "", ""],
    ["Change-management services", "", "", "", ""],
    ...Array.from({ length: 3 }, () => blankRow(5)),
  ];

  const support: AOA = [
    ["13 — SUPPORT & SLA"],
    [],
    [
      "Requested vendor commitments — not SoftwareGlimpse claims. Leave targets blank until the vendor fills them.",
    ],
    [],
    ["SUPPORT MODEL"],
    ["Support hours", ""],
    ["Channels", ""],
    ["Dedicated CSM", ""],
    ["Technical account manager", ""],
    ["Premium support options", ""],
    [],
    ["SEVERITY TABLE"],
    [
      "Severity",
      "Target response",
      "Target resolution",
      "Vendor commitment",
      "Notes",
    ],
    ["Critical / Sev-1", "", "", "", ""],
    ["High / Sev-2", "", "", "", ""],
    ["Medium / Sev-3", "", "", "", ""],
    ["Low / Sev-4", "", "", "", ""],
  ];

  // Pricing: blank structure + optional SUM formulas (stay 0 until filled)
  const pricing: AOA = [
    ["14 — PRICING RESPONSE"],
    [],
    [
      "Normalized commercial structure. ALL amount cells intentionally BLANK — do not invent list prices, discounts, or TCO. Optional SUM formulas recalculate when opened in Excel after you enter numbers.",
    ],
    [],
    ["A. SOFTWARE"],
    [
      "Edition",
      "Users",
      "List price / user / month",
      "Proposed price",
      "Billing period",
      "Discount",
      "Annual cost",
    ],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["Software annual subtotal", "", "", "", "", "", "=SUM(G7:G10)"],
    [],
    ["B. ADD-ONS"],
    [
      "Product / add-on",
      "Quantity",
      "Unit price",
      "Annual cost",
      "Required / optional",
      "Notes",
    ],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["Add-ons annual subtotal", "", "", "=SUM(D15:D18)", "", ""],
    [],
    ["C. IMPLEMENTATION (one-time)"],
    ["Line item", "Amount", "Notes"],
    ["Discovery", "", ""],
    ["Configuration", "", ""],
    ["Integration", "", ""],
    ["Migration", "", ""],
    ["Training", "", ""],
    ["Project management", "", ""],
    ["Other", "", ""],
    ["Implementation subtotal", "=SUM(B23:B29)", ""],
    [],
    ["D. RECURRING SERVICES (annual)"],
    ["Line item", "Annual amount", "Notes"],
    ["Premium support", "", ""],
    ["Success services", "", ""],
    ["Integration platform", "", ""],
    ["Storage", "", ""],
    ["API packages", "", ""],
    ["Other", "", ""],
    ["Recurring services subtotal", "=SUM(B34:B39)", ""],
    [],
    ["E. 3-YEAR TCO (enter Year 1–3 totals; do not invent)"],
    ["", "Year 1", "Year 2", "Year 3", "TOTAL"],
    ["Software", "", "", "", "=SUM(B44:D44)"],
    ["Add-ons", "", "", "", "=SUM(B45:D45)"],
    ["Implementation (typically Y1)", "", "", "", "=SUM(B46:D46)"],
    ["Recurring services", "", "", "", "=SUM(B47:D47)"],
    ["Other", "", "", "", "=SUM(B48:D48)"],
    [
      "Year totals",
      "=SUM(B44:B48)",
      "=SUM(C44:C48)",
      "=SUM(D44:D48)",
      "=SUM(E44:E48)",
    ],
    [],
    ["PRICING ASSUMPTIONS"],
    ["Price escalation / uplift terms", ""],
    ["Minimum commitments", ""],
    ["Contract term", ""],
    ["Renewal terms", ""],
    ["Other assumptions", ""],
  ];

  const vendorProfile: AOA = [
    ["15 — VENDOR PROFILE"],
    [],
    ["Company name", ""],
    ["Product name", ""],
    ["Product edition quoted", ""],
    ["Company headquarters", ""],
    ["Year founded", ""],
    ["CRM customers (stated by vendor)", ""],
    ["Relevant customers / segment fit", ""],
    ["Target customer profile", ""],
    ["Implementation model", ""],
    ["Partner ecosystem summary", ""],
    [],
    ["PRODUCT ROADMAP (future capability — not current for MUST HAVE scoring)"],
    [
      "Requirement / item",
      "Current status",
      "Expected availability",
      "Committed?",
      "Public documentation",
      "Dependency",
    ],
    ...Array.from({ length: 6 }, () => blankRow(6)),
    [],
    [
      "Warning",
      "Roadmap functionality should not be treated as currently available during scoring.",
    ],
  ];

  const references: AOA = [
    ["16 — REFERENCES"],
    [],
    [
      "Customer references — leave blank for vendor. Do not invent reference companies.",
    ],
    [],
    [
      "Company",
      "Industry",
      "Approx size",
      "Use case",
      "Contact available?",
      "Reference restrictions",
      "Notes",
    ],
    ...Array.from({ length: 8 }, () => blankRow(7)),
  ];

  const risks: AOA = [
    ["17 — ASSUMPTIONS, EXCEPTIONS & RISKS"],
    [],
    ["ASSUMPTIONS"],
    ["ID", "Assumption", "Impact"],
    ...Array.from({ length: 6 }, (_, i) => [`A-${String(i + 1).padStart(2, "0")}`, "", ""]),
    [],
    ["EXCEPTIONS"],
    [
      "Requirement ID",
      "Exception",
      "Proposed workaround",
      "Commercial impact",
      "Timeline impact",
    ],
    ...Array.from({ length: 6 }, () => blankRow(5)),
    [],
    ["RISKS"],
    ["Risk", "Likelihood", "Impact", "Mitigation", "Owner"],
    ...Array.from({ length: 6 }, () => blankRow(5)),
  ];

  const fr = `'06_Functional_Requirements'`;
  const idRange = `${fr}!A${FUNC_DATA_FIRST}:A${FUNC_DATA_LAST}`;
  const priorityRange = `${fr}!D${FUNC_DATA_FIRST}:D${FUNC_DATA_LAST}`;
  const responseRange = `${fr}!E${FUNC_DATA_FIRST}:E${FUNC_DATA_LAST}`;
  const deliveryRange = `${fr}!F${FUNC_DATA_FIRST}:F${FUNC_DATA_LAST}`;

  const summary: AOA = [
    ["18 — RESPONSE SUMMARY"],
    [],
    [
      `COUNTIF helpers reference ${fr} rows ${FUNC_DATA_FIRST}–${FUNC_DATA_LAST}. Formulas stay at 0 until vendors fill Delivery method / Vendor response. Primary model is Delivery method — not Pass/Partial/Fail.`,
    ],
    [],
    ["COMPLETENESS (auto)"],
    ["Metric", "Value", "Definition"],
    [
      "Requirement rows (ID filled)",
      `=COUNTA(${idRange})`,
      "Non-blank ID on functional sheet",
    ],
    [
      "Requirements with Vendor response",
      `=COUNTIF(${responseRange},"<>")`,
      "Vendor response column non-blank",
    ],
    [
      "Requirements with Delivery method",
      `=COUNTIF(${deliveryRange},"<>")`,
      "Delivery method column non-blank",
    ],
    [
      "MUST HAVE rows",
      `=COUNTIF(${priorityRange},"MUST HAVE")`,
      "Priority = MUST HAVE",
    ],
    [
      "MUST HAVE with Delivery = Not supported",
      `=COUNTIFS(${priorityRange},"MUST HAVE",${deliveryRange},"Not supported")`,
      "Must-have marked Not supported",
    ],
    [
      "Delivery = Roadmap",
      `=COUNTIF(${deliveryRange},"Roadmap")`,
      "Roadmap dependencies (count)",
    ],
    [
      "Delivery = Partner / Third party",
      `=COUNTIF(${deliveryRange},"Partner / Third party")`,
      "Third-party / partner dependencies (count)",
    ],
    [],
    ["VENDOR-ENTERED SUMMARY (optional free text / links)"],
    ["Implementation duration (stated)", ""],
    ["Year-1 cost (stated — from 14_Pricing)", ""],
    ["3-year TCO (stated — from 14_Pricing)", ""],
    ["Major exclusions (summary)", ""],
    [],
    ["DECLARATION"],
    [
      "Text",
      "We confirm that the information provided in this response accurately represents the proposed solution, pricing and implementation assumptions as of the submission date.",
    ],
    ["Vendor company", ""],
    ["Name", ""],
    ["Role", ""],
    ["Signature", ""],
    ["Date", ""],
    [],
    ["INTERNAL — DO NOT SEND TO VENDOR"],
    [
      "Buyer evaluation notes only. Keep this section off packages issued to vendors.",
    ],
    ["Response completeness notes", ""],
    ["Must-have gaps", ""],
    ["Major exceptions", ""],
    ["Pricing completeness", ""],
    ["Implementation concerns", ""],
    ["Evidence gaps", ""],
    ["Questions for demo", ""],
    ["Questions requiring clarification", ""],
    [],
    ["NEXT STEP (buyer)"],
    ["Reject", ""],
    ["Clarification required", ""],
    ["Invite to demo", ""],
    ["Invite to proof-of-concept", ""],
    ["Move to scorecard", ""],
    [],
    [
      "Next artifacts",
      "https://softwareglimpse.com/resources/crm-vendor-scorecard/ · https://softwareglimpse.com/resources/crm-comparison-worksheet/ · https://softwareglimpse.com/resources/crm-business-case-template/",
    ],
  ];

  const funcCols = FUNC_HEADERS.map((h) => ({
    wch: Math.min(36, Math.max(12, h.length + 2)),
  }));
  funcCols[0] = { wch: 14 };
  funcCols[1] = { wch: 22 };
  funcCols[2] = { wch: 56 };
  funcCols[3] = { wch: 14 };
  funcCols[4] = { wch: 28 };
  funcCols[5] = { wch: 20 };
  funcCols[6] = { wch: 14 };
  funcCols[7] = { wch: 28 };
  funcCols[8] = { wch: 24 };

  const lastFuncCol = String.fromCharCode(64 + FUNC_HEADERS.length); // I

  return [
    {
      name: "01_Instructions",
      aoa: instructions,
      cols: [{ wch: 36 }, { wch: 88 }],
    },
    {
      name: "02_Project_Context",
      aoa: projectContext,
      cols: [{ wch: 32 }, { wch: 56 }],
    },
    {
      name: "03_Objectives",
      aoa: objectives,
      cols: [
        { wch: 10 },
        { wch: 36 },
        { wch: 28 },
        { wch: 28 },
        { wch: 22 },
        { wch: 12 },
      ],
    },
    {
      name: "04_Scope",
      aoa: scope,
      cols: [{ wch: 32 }, { wch: 18 }, { wch: 40 }],
    },
    {
      name: "05_Users",
      aoa: users,
      cols: [
        { wch: 24 },
        { wch: 16 },
        { wch: 24 },
        { wch: 14 },
        { wch: 28 },
      ],
    },
    {
      name: "06_Functional_Requirements",
      aoa: functional,
      cols: funcCols,
      autofilter: `A${FUNC_HEADER_ROW}:${lastFuncCol}${FUNC_DATA_LAST}`,
    },
    {
      name: "07_Technical_Requirements",
      aoa: technical,
      cols: [
        { wch: 14 },
        { wch: 56 },
        { wch: 14 },
        { wch: 28 },
        { wch: 28 },
        { wch: 16 },
        { wch: 24 },
        { wch: 20 },
      ],
      autofilter: `A${TECH_HEADER_ROW}:H${TECH_DATA_LAST}`,
    },
    {
      name: "08_Integrations",
      aoa: integrations,
      cols: [
        { wch: 22 },
        { wch: 14 },
        { wch: 20 },
        { wch: 14 },
        { wch: 20 },
        { wch: 28 },
      ],
    },
    {
      name: "09_Data_Migration",
      aoa: migration,
      cols: [
        { wch: 36 },
        { wch: 16 },
        { wch: 16 },
        { wch: 18 },
        { wch: 14 },
        { wch: 28 },
      ],
    },
    {
      name: "10_Security",
      aoa: security,
      cols: [
        { wch: 10 },
        { wch: 52 },
        { wch: 28 },
        { wch: 24 },
        { wch: 24 },
      ],
    },
    {
      name: "11_Implementation",
      aoa: implementation,
      cols: [{ wch: 28 }, { wch: 20 }, { wch: 40 }],
    },
    {
      name: "12_Training",
      aoa: training,
      cols: [
        { wch: 40 },
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
        { wch: 28 },
      ],
    },
    {
      name: "13_Support",
      aoa: support,
      cols: [
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 22 },
        { wch: 28 },
      ],
    },
    {
      name: "14_Pricing",
      aoa: pricing,
      cols: [
        { wch: 32 },
        { wch: 12 },
        { wch: 22 },
        { wch: 16 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
      ],
    },
    {
      name: "15_Vendor_Profile",
      aoa: vendorProfile,
      cols: [
        { wch: 28 },
        { wch: 20 },
        { wch: 20 },
        { wch: 14 },
        { wch: 22 },
        { wch: 20 },
      ],
    },
    {
      name: "16_References",
      aoa: references,
      cols: [
        { wch: 22 },
        { wch: 16 },
        { wch: 12 },
        { wch: 24 },
        { wch: 16 },
        { wch: 22 },
        { wch: 24 },
      ],
    },
    {
      name: "17_Risks_Exceptions",
      aoa: risks,
      cols: [
        { wch: 16 },
        { wch: 36 },
        { wch: 28 },
        { wch: 20 },
        { wch: 18 },
      ],
    },
    {
      name: "18_Response_Summary",
      aoa: summary,
      cols: [{ wch: 44 }, { wch: 48 }, { wch: 48 }],
    },
  ];
}

export async function buildCrmRfpXlsxBuffer(): Promise<Buffer> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const sheets = buildCrmRfpWorkbookAoa();

  for (const s of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(
      s.aoa.map((row) =>
        row.map((cell) =>
          typeof cell === "string" && cell.startsWith("=") ? null : cell,
        ),
      ),
    );
    if (s.cols) ws["!cols"] = s.cols;

    s.aoa.forEach((row, r) => {
      row.forEach((value, c) => {
        if (typeof value === "string" && value.startsWith("=")) {
          const addr = XLSX.utils.encode_cell({ r, c });
          ws[addr] = { t: "n", f: value.slice(1), v: 0 };
        }
      });
    });

    const range = XLSX.utils.decode_range(ws["!ref"] ?? "A1");
    s.aoa.forEach((row, r) => {
      range.e.r = Math.max(range.e.r, r);
      range.e.c = Math.max(range.e.c, row.length - 1);
    });
    ws["!ref"] = XLSX.utils.encode_range(range);

    if (s.autofilter) {
      ws["!autofilter"] = { ref: s.autofilter };
    }

    XLSX.utils.book_append_sheet(wb, ws, s.name);
  }

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
