# Resource artifact archetypes

**Date:** 2026-08-15  
**Purpose:** Prevent unrelated CRM downloads from being forced through a generic checklist PDF/Excel renderer.

---

## Principle

Each resource maps to an **archetype** that determines:

- page framing and terminology
- data / artifact schema
- PDF structure
- Excel structure
- visualization types
- primary vs secondary download

Shared infrastructure (`export-documents.ts`, hub page shell, generate script) may remain — but **non-checklist archetypes must branch to dedicated exporters**, as with Business Case and Decision Matrix.

---

## Archetypes

| Archetype | Purpose | Primary format | Secondary | Typical structure |
| --- | --- | --- | --- | --- |
| **CHECKLIST** | Validate readiness or completion with evidence | Excel | PDF | Rows: item · why · evidence · Pass/Partial/Fail/N/T |
| **SCORECARD** | Capture how well **one** vendor performed in evaluation | Interactive tool + Excel/PDF | — | Criteria · scores · must-haves · notes |
| **DECISION_MATRIX** | Choose among **finalists** | Excel engine | PDF summary | Gates · weights · multi-vendor scores · TCO · risk · recommendation |
| **FINANCIAL_MODEL** | Cost / TCO / ROI calculation | Excel | PDF summary | Inputs · formulas · scenarios · confidence |
| **BUSINESS_CASE** | Approval-ready investment case | PDF workbook | Excel model | Problem · options · TCO · benefits · risks · decision ask |
| **PLANNER** | Sequence work / training / rollout | Excel | PDF | Phases · owners · dates · exit criteria |
| **WORKSHEET** | Structured capture (requirements tables) | Excel | PDF/MD | Tables without Pass/Fail as the core UX |
| **RFP** | Collect comparable vendor proposals | Excel response workbook | PDF brief | Instructions · requirements · pricing · declaration · INTERNAL page |
| **MAPPING_WORKBOOK** | Source→target field / object mapping | Excel engine | PDF guide | Objects · field matrix · value maps · transforms · readiness |
| **GUIDE** | Educational downloadable | PDF/MD | — | Narrative teaching |

---

## Mapping rules

| If the key question is… | Use |
| --- | --- |
| “Did we complete / prove X?” | CHECKLIST |
| “How did Vendor X do in evaluation?” | SCORECARD |
| “Which finalist should we select?” | DECISION_MATRIX |
| “What does this cost / return?” | FINANCIAL_MODEL |
| “Should leadership approve this?” | BUSINESS_CASE |
| “In what order do we deliver?” | PLANNER |
| “How does source data become target data?” | MAPPING_WORKBOOK |

---

## Implementation status (SoftwareGlimpse)

| Archetype | Dedicated exporter? | Notes |
| --- | --- | --- |
| CHECKLIST | Shared `export-documents.ts` | Correct for evaluation, security, go-live, etc. |
| BUSINESS_CASE | `exports/crm-business-case-*.ts` | Branched by slug |
| DECISION_MATRIX | `exports/crm-decision-matrix-*.ts` | Branched by slug `crm-comparison-worksheet` |
| RFP | `exports/crm-rfp-*.ts` | Branched by slug `crm-rfp-template` |
| MAPPING_WORKBOOK | `exports/crm-field-mapping-*.ts` | Branched by slug `crm-field-mapping-template` |
| SCORECARD | `exports/crm-vendor-scorecard-*.ts` + live tool | Branched by slug `crm-vendor-scorecard` |
| FINANCIAL_MODEL | Live tools (cost/TCO) | Resource pack optional later |
| PLANNER | Shared | Training plan still checklist-shaped — improve later |
| WORKSHEET | Shared | Data migration inventory — still checklist-shaped (P1) |

See also: `docs/resources/CRM-RESOURCE-ARCHETYPE-AUDIT.md`, `docs/audits/resource-artifact-type-audit.md`.
