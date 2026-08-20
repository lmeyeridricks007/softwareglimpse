# Resource artifact type audit

**Date:** 2026-08-15  
**Purpose:** Find CRM (and related) downloads incorrectly forced through the generic checklist PDF/Excel renderer.

Companion: `docs/resources/RESOURCE-ARTIFACT-ARCHETYPES.md`, `docs/resources/CRM-RESOURCE-ARCHETYPE-AUDIT.md`.

---

## Summary

Root cause: `export-documents.ts` default path renders Pass / Partial / Fail / Not tested tables for almost every resource. Dedicated exporters exist only where explicitly branched by slug.

| Dedicated exporter | Slug |
| --- | --- |
| Business Case | `crm-business-case-template` |
| Decision Matrix | `crm-comparison-worksheet` |
| Field Mapping | `crm-field-mapping-template` |
| Vendor Scorecard | `crm-vendor-scorecard` |
| RFP Template | `crm-rfp-template` |

---

## Audit table

| Resource | Current artifact type (delivery) | Correct artifact type | Current problem | PDF status | Excel status | Recommended change | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Evaluation Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Demo Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Implementation Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Migration Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Go-Live Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Security Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Optimization Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Cleanup Checklist | CHECKLIST | CHECKLIST | — | OK | OK | Maintain | — |
| Business Case Template | BUSINESS_CASE (dedicated) | BUSINESS_CASE | — | Dedicated | Dedicated | Maintain | — |
| Decision Matrix | DECISION_MATRIX (dedicated) | DECISION_MATRIX | — | Dedicated | Dedicated | Maintain | — |
| Field Mapping Template | MAPPING_WORKBOOK (dedicated) | MAPPING_WORKBOOK / MATRIX | Was checklist | Dedicated (2026-08-15) | Dedicated | Maintain | P0 done |
| Data Migration Template | Shared checklist | WORKSHEET / INVENTORY | Object inventory forced into Pass/Fail | Checklist-shaped | Checklist-shaped | Dedicated inventory workbook | P1 |
| Vendor Scorecard (resource pack) | SCORECARD (dedicated 2026-08-15) | SCORECARD | Was checklist | Dedicated | Dedicated | Maintain; keep interactive tool | P0 done |
| Training Plan | Shared checklist | PLANNER | Curriculum rows as Pass/Fail | Checklist-shaped | Checklist-shaped | Dedicated planner sheets | P2 |
| RFP Template | Shared checklist | WORKSHEET / TEMPLATE | RFP sections as Pass/Fail | Checklist-shaped | Checklist-shaped | Soften / dedicated RFP pack | P2 |
| Requirements Template | Shared checklist | WORKSHEET | Requirements as checklist | Partial | Partial | Dedicated requirements sheet | P2 |
| Cost / TCO (tools) | Live calculators | FINANCIAL_MODEL | Resource pack optional | N/A | Tool | Optional downloadable model later | P3 |

---

## Patterns to fix systematically

1. **Branch by archetype**, not by one-off styling of checklist rows.  
2. **Excel-primary** for interactive matrices, mapping workbooks, financial models.  
3. **PDF-primary** only when the artifact is primarily a narrative approval pack (e.g. Business Case).  
4. Do **not** invent scores, prices, readiness %, or vendor capabilities in templates.

---

## Out of scope for the Field Mapping task

Do not rewrite Data Migration Template, Training Plan, Scorecard pack, or RFP in this change set — document only (this file).
