# CRM Field Mapping Template — rebuild report

**Date:** 2026-08-15  
**Slug:** `crm-field-mapping-template`  
**URL:** `/resources/crm-field-mapping-template/`

---

## 1. What was wrong

The generated PDF/Excel used the **shared checklist exporter** (`export-documents.ts`):

- Columns: Check item · Why it matters · Evidence · Result  
- Results: Pass / Partial / Fail / Not tested  
- “HOW TO USE THIS RESOURCE” framed like a checklist  
- Markdown companion was also checklist-shaped  

A field mapping template must be a **source→target mapping workbook**, not a Pass/Fail gate sheet.

---

## 2. Root cause

Non-checklist resources fell through a single generic renderer. Only Business Case and Decision Matrix had slug branches. Field Mapping still consumed `artifactSections` as checklist rows.

---

## 3. Architecture changes

| Change | Detail |
| --- | --- |
| Dedicated PDF | `src/services/resource-hub/exports/crm-field-mapping-pdf.ts` |
| Dedicated Excel | `src/services/resource-hub/exports/crm-field-mapping-xlsx.ts` |
| Pipeline branch | `FIELD_MAPPING_SLUG` in `export-documents.ts` (PDF + XLSX + Excel-first CTAs) |
| Hub profile | `src/data/resource-hub/crm-field-mapping-template.ts` (imported from `deep-part-c.ts`) |
| Page variant | `field-mapping` preview (no Pass/Fail table) |
| Archetype | Documented as **MAPPING_WORKBOOK** / WORKSHEET subtype |

Shared checklist infrastructure left intact for true checklists.

---

## 4. Website changes

- Hero / tagline: mapping workbook language; “not an evaluation checklist”  
- Primary CTA: **Download Excel Template**  
- Secondary: **View PDF Guide**  
- Value bar: 8 PDF pages · 10 Excel sheets · Field matrix · Readiness states  
- Structured preview + Helps-you-do outcomes  
- Journey: Implementation → Data Migration Template → Field Mapping → Migration Checklist → Go-Live  
- Guides/tools: field mapping, data migration, implementation, vendor migration; migration/implementation planners; requirements builder  

---

## 5. PDF changes (8 pages)

1. Cover / project setup (blank counters — no fake 72% / 312 fields)  
2. How to use + warning before bulk testing  
3. Object mapping (EXAMPLE Pipedrive→HubSpot rows)  
4. Field mapping matrix (core)  
5. Value & picklist mapping + unknown-value handling  
6. Transformations & data quality  
7. Validation & readiness (blank metrics)  
8. Decisions, issues & sign-off  

---

## 6. Excel changes (primary artifact)

Sheets: `01_README` … `10_DASHBOARD`  

- `04_FIELD_MAP` — full schema columns + EXAMPLE rows + blanks + autofilter  
- Dashboard formulas for mapped / excluded / unmapped / required-unmapped / readiness  
- Readiness: BLOCKED → NOT READY → TEST READY → PRODUCTION READY (deterministic; empty book does not claim production ready)  

---

## 7. Data model

Source · Target · Mapping type · Transform · Defaults · Value maps · Lookups · Null/duplicate handling · Owners · Classification · Validation · Status · Issues  

Mapping types: Direct, Rename, Transform, Concatenate, Split, Lookup, Calculated, Default value, Value mapping, Do not migrate, Archive, New target field, Manual remediation  

---

## 8. Validation / readiness logic

Excel `10_DASHBOARD` counts over field-map range; **BLOCKED** if required target fields unmapped; **PRODUCTION READY** only when required covered, failed tests = 0, blocker issues = 0. No decorative percentage score as truth.

---

## 9. Internal links added (resolved)

| Link | Status |
| --- | --- |
| `/guides/crm-field-mapping/` | Exists |
| `/guides/crm-data-migration/` | Exists |
| `/guides/crm-implementation/` | Exists |
| `/guides/crm-vendor-migration/` | Exists |
| `/resources/crm-data-migration-template/` | Exists |
| `/resources/crm-migration-checklist/` | Exists |
| `/resources/crm-go-live-checklist/` | Exists |
| `/resources/crm-comparison-worksheet/` | Exists (Decision Matrix) |
| `/resources/crm-business-case-template/` | Exists |
| `/tools/crm-migration-planner/` | Exists |
| `/tools/crm-implementation-planner/` | Exists |
| `/tools/crm-requirements-builder/` | Exists |
| `/best/crm-software/` | Exists (optional hub) |
| `/capabilities/crm-data-management/` | **Opportunity** — no dedicated capability; closest `/capabilities/contact-management/` |
| `/crm/features/`, `/crm/integrations/` | **Opportunity** — use `/features/[slug]/`, `/best/crm-software/` instead |

---

## 10. Tests performed

- `buildCrmFieldMappingPdfBuffer` / `XlsxBuffer` write to `public/resources/`  
- PDF page count = 8; no “CHECK ITEM” / “HOW TO USE THIS CHECKLIST”  
- Excel sheet names verified; dashboard formulas present  
- `buildResourceHubModel('crm-field-mapping-template')` parses (Zod)  

---

## 11. Artifact paths

- `public/resources/crm-field-mapping-template.pdf`  
- `public/resources/crm-field-mapping-template.xlsx`  
- `public/resources/crm-field-mapping-template.md`  
- `public/resources/crm-field-mapping-template.csv`  

---

## 12. Remaining limitations

- SheetJS does not fully implement Excel data-validation dropdowns / freeze panes / conditional formatting UI — documented on README; users can add in Excel.  
- Hero/needs/workflow PNGs are existing assets (may still look dictionary-oriented).  
- Worked-example structured schema still uses PASS/PARTIAL enum (repurposed labels for teaching states).  

---

## 13. Other resources with the same problem

See `docs/audits/resource-artifact-type-audit.md`. Highest priority remaining checklist-shaped non-checklists: Vendor Scorecard download pack, Training Plan, Data Migration Template, RFP Template.
