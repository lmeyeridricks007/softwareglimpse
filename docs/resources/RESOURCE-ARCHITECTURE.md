# Resource architecture

**Date:** 2026-08-15  
**Purpose:** Stop forcing unrelated CRM downloads through one generic checklist PDF/Excel renderer.

Related: `docs/resources/RESOURCE-ARTIFACT-ARCHETYPES.md`, `docs/audits/resource-artifact-type-audit.md`.

---

## Problem

`export-documents.ts` historically rendered almost every resource as:

Check item · Why it matters · Evidence · Result (Pass / Partial / Fail / Not tested)

That model is correct for **checklists** and wrong for RFPs, scorecards, decision matrices, mapping workbooks, and business cases.

---

## Archetypes

| Archetype | Purpose | Primary format | Vendor-facing? |
| --- | --- | --- | --- |
| CHECKLIST | Prove readiness / completion | Excel + PDF | No (buyer internal) |
| SCORECARD | Weighted evaluation scores | Excel + PDF (+ live tool) | No |
| DECISION_MATRIX | Choose among finalists | Excel + PDF | No |
| RFP | Collect comparable vendor proposals | Excel + PDF | **Yes** (omit INTERNAL page) |
| BUSINESS_CASE | Approval pack | PDF + Excel | No |
| MAPPING_WORKBOOK | Source→target field map | Excel + PDF | No |
| FINANCIAL_MODEL | Cost / TCO / ROI | Tool (+ optional Excel) | No |
| PLANNER | Phases / training / rollout | Excel + PDF | No |
| WORKSHEET | Structured capture / inventory | Excel + PDF | No |
| GUIDE | Educational download | PDF/MD | N/A |

---

## Current CRM resources → archetype

| Resource | Slug | Archetype | Dedicated exporter |
| --- | --- | --- | --- |
| Evaluation Checklist | `crm-evaluation-checklist` | CHECKLIST | Shared |
| Demo Checklist | `crm-demo-checklist` | CHECKLIST | Shared |
| Implementation / Migration / Go-Live / Security / Optimization / Cleanup | various | CHECKLIST | Shared |
| Vendor Scorecard | `crm-vendor-scorecard` | SCORECARD | `crm-vendor-scorecard-*` |
| Decision Matrix | `crm-comparison-worksheet` | DECISION_MATRIX | `crm-decision-matrix-*` |
| RFP Template | `crm-rfp-template` | RFP | `crm-rfp-*` |
| Business Case | `crm-business-case-template` | BUSINESS_CASE | `crm-business-case-*` |
| Field Mapping | `crm-field-mapping-template` | MAPPING_WORKBOOK | `crm-field-mapping-*` |
| Data Migration Template | `crm-data-migration-template` | WORKSHEET | Shared (P1) |
| Training Plan | `crm-training-plan` | PLANNER | Shared (P2) |
| Requirements Template | `crm-requirements-template` | WORKSHEET | Shared (P2) |

---

## Rendering strategy

1. **Shared path** (`export-documents.ts` default): true checklists only.  
2. **Slug branch** → dedicated `exports/crm-*-{pdf,xlsx}.ts` for non-checklist archetypes.  
3. **Do not** add more Pass/Fail labels to fake other archetypes.

### PDF

Archetype-specific page composers (cover, tables, legends, internal vs external). Blank fields for buyer/vendor inputs; SAMPLE rows labelled; no invented prices or vendor winners.

### Excel

Archetype-specific sheet maps + formulas. Excel is primary for RFP, Scorecard, Decision Matrix, Field Mapping.

---

## Cross-resource data flow

```
Requirements Builder / Template  (stable IDs)
        ↓
Evaluation Checklist             (Pass/Partial/Fail evidence)
        ↓
Shortlist
        ↓
RFP                              (same IDs → vendor delivery method + evidence)
        ↓
Vendor Scorecard                 (same IDs → 1–5 + gates + confidence)
        ↓
Decision Matrix                  (fit + TCO + risk + recommendation)
        ↓
Business Case                    (approval)
```

Canonical SAMPLE RFP requirement IDs: `src/data/resource-hub/crm-rfp-requirements.ts` (`CRM-REQ-001…010` aligned with Requirements pillar slugs).

---

## Shared components to keep

- Hub page shell (`resources/[slug]/page.tsx`)
- `buildResourceHubModel` / profile depth files
- `npm run resources:downloads`
- Design tokens (navy / primary / muted)
- Live tools (Finder, Scorecard app, Cost Calculator, Requirements Builder)

## Archetype-specific components

- Dedicated PDF/XLSX exporters per non-checklist slug
- Page preview variants: `checklist` | `business-case` | `decision-matrix` | `field-mapping` | `scorecard` | `rfp`
- Download CTA labels per archetype

---

## Next architecture steps (not blocking RFP)

1. Dedicated Data Migration Template workbook  
2. Soften / replace Training Plan checklist chrome  
3. Optional: registry map `slug → archetype → exporter` instead of long if-chains  
4. Stronger shared ID registry across Requirements ↔ RFP ↔ Scorecard
