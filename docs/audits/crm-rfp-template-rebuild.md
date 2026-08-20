# CRM RFP Template — rebuild note

**Date:** 2026-08-15  
**Slug:** `crm-rfp-template`

## Before

Shared checklist PDF (CHECK ITEM / Pass–Fail), ~2 pages.

## After

| Artifact | Path |
| --- | --- |
| PDF (14 pages) | `public/resources/crm-rfp-template.pdf` |
| Excel (18 sheets) | `public/resources/crm-rfp-template.xlsx` |
| Exporters | `src/services/resource-hub/exports/crm-rfp-{pdf,xlsx}.ts` |
| Requirement IDs | `src/data/resource-hub/crm-rfp-requirements.ts` |
| Hub profile | `src/data/resource-hub/crm-rfp-template.ts` |
| Architecture | `docs/resources/RESOURCE-ARCHITECTURE.md` |

## Guards

- Vendor-facing delivery methods (not Pass/Fail)
- Blank glance / pricing (no invented TCO)
- INTERNAL page marked do-not-send
- SAMPLE CRM-REQ-001…010 aligned with Requirements pillar
