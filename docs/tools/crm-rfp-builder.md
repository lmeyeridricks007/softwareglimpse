# CRM RFP / Vendor Brief Builder

Interactive tool that turns buyer-entered CRM requirements and project context into a
structured **Vendor Brief** or **Formal RFP**, plus a vendor response workbook.

**Route:** `/tools/crm-rfp-builder/`  
**Engine:** `src/services/rfp-builder/*`  
**UI:** `src/components/rfp-builder/*`  
**Schema:** `src/domain/schemas/crm-rfp.ts`

## Purpose

Help CRM buyers generate a comparable, vendor-facing brief or formal RFP from
**their** requirements, business context, integrations, implementation needs,
security questions and commercial assumptions — without inventing requirements,
pricing, timelines or compliance claims.

## Modes

| Mode | When | Typical length | Steps |
| --- | --- | --- | --- |
| **Vendor Brief** | Smaller teams, 2–4 vendors, straightforward scope | 3–6 pages | Core steps; security/migration optional |
| **Formal RFP** | Formal procurement, complex integrations, security review | 10–15 pages | All 10 wizard steps |

Most smaller CRM purchases do **not** need a full RFP. The mode picker explains this.

## Architecture reused

| Concern | Source | How reused |
| --- | --- | --- |
| Decision profile | `CrmDecisionProfile` / `sg-crm-decision-profile-v1` | Import requirements, integrations, business context, user counts |
| CRM graph | `src/data/crm-graph/*` | Canonical requirement/capability labels & library seeds |
| RFP sample IDs | `src/data/resource-hub/crm-rfp-requirements.ts` | Stable `CRM-REQ-*` mapping when slug matches; delivery-method legend |
| Static RFP resource | `/resources/crm-rfp-template/` | Blank starter package; builder produces live user-signed packages |
| Priority mapping | Profile `must-have` / `important` / `nice-to-have` | → MoSCoW Must / Should / Could (+ Future / Out of scope) |
| Wizard + live summary | ROI / Requirements Builder patterns | Left stepper, sticky right rail, local resume |
| PDF / Excel | Dynamic `jspdf` / `xlsx` (ROI / migration pattern) | Client exports only after generate |
| Registry / privacy | Tools registry + `foundation.ts` cookies | `crm-rfp-builder`, `sg-crm-rfp-brief-v1` |
| Scorecard boundary | Vendor Scorecard | RFP asks *what vendors must answer*; Scorecard scores *how they did* |
| Cost assumptions | Cost / TCO patterns | Pricing assumption shape compatible with later cost tools |

## New models

`CrmRfpSession` (`src/domain/schemas/crm-rfp.ts`):

- `mode`: `vendor-brief` \| `formal-rfp`
- Project metadata, business context, objectives
- Scope items (capability taxonomy + phase), user groups, user counts
- Requirements with MoSCoW priority, response format, acceptance criteria
- Integrations inventory, migration objects (formal)
- Implementation questions & timeline request
- Security / support questions
- Commercial structure + pricing assumptions
- Response rules, clarification log, vendor tracker
- Version metadata + change log + optional freeze flag
- `wizardStepId` for resume

Does **not** replace `CrmDecisionProfile`. Requirements Builder remains the richer
authoring environment; RFP Builder imports, trims, and adds procurement response fields.

## Input / output relationships

```
Requirements Builder (profile)
        │ import (stable IDs / mapped CRM-REQ-*)
        ▼
RFP / Vendor Brief Builder  ──export──►  PDF + Excel + Markdown
        │
        │ same pack → Vendor A / B / C
        ▼
Vendor completes Excel
        │ (import contract — see below)
        ▼
Vendor Scorecard ← evidence by requirement ID
        ▼
Decision Matrix → Cost / ROI → Business Case
```

## Export structure

| Artifact | Contents |
| --- | --- |
| **PDF** | Vendor Brief (concise) or Formal RFP (full section set) |
| **Excel** | Vendor response workbook (mode-filtered sheets) |
| **Markdown** | Editable collaborative copy of the issued package |
| **Copy text** | Plain-text summary for email / paste |

Excel sheets (formal; brief omits advanced sheets):

`00_INSTRUCTIONS`, `01_RFP_SUMMARY`, `02_OBJECTIVES`, `03_SCOPE_USERS`,
`04_REQUIREMENTS`, `05_INTEGRATIONS`, `06_DATA_MIGRATION`, `07_SECURITY`,
`08_IMPLEMENTATION`, `09_SUPPORT`, `10_PRICING`, `11_ASSUMPTIONS_EXCEPTIONS`,
`12_VENDOR_PROFILE`, `13_REFERENCES`, `14_RESPONSE_SUMMARY`

Delivery-method legend (Native / Configuration / Custom / Third party / Roadmap /
Not supported / N/A) appears in tool, PDF, Excel and Markdown.

## Vendor response import contract

Defined in `src/services/rfp-builder/import-contract.ts`.

Goal: completed workbook → map rows by stable requirement ID → feed Scorecard evidence.
Full Excel parse may be incremental; the contract and ID stability are required now.

## Persistence

| Key | Role |
| --- | --- |
| `sg-crm-rfp-brief-v1` | Full RFP session (Zod-validated) |
| `sg-crm-decision-profile-v1` | Optional import source (Requirements Builder) |

## Analytics (no requirement text / commercial figures)

`rfp_builder_started`, `rfp_mode_selected`, `rfp_requirements_imported`,
`rfp_step_completed`, `rfp_generated`, `rfp_pdf_exported`, `rfp_excel_exported`,
`rfp_markdown_exported`, `rfp_scorecard_clicked`

## Limitations

- Does not score vendors or recommend products.
- Does not invent user counts, integrations, certifications or pricing.
- Excel data-validation dropdowns are best-effort in SheetJS (formulas included; native Excel DV limited).
- Vendor response workbook import is contract-first; UI import may be partial.
- Clarification log / vendor tracker are local workflow aids — no email sending.
- Sample/library rows are labelled; buyer must confirm before issue.

## Related

Requirements Builder · CRM Finder · Vendor Scorecard · Decision Matrix ·
Cost / ROI / TCO · Business Case · Field Mapping · Migration Planner ·
static [CRM RFP Template](/resources/crm-rfp-template/)
