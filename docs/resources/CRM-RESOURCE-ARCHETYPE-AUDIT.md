# CRM resource archetype audit

**Date:** 2026-08-15  
**Companion:** `docs/resources/RESOURCE-ARTIFACT-ARCHETYPES.md`

| Resource | Slug | Current delivery | Correct archetype | Correct? | Problems | Required changes | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Evaluation Checklist | `crm-evaluation-checklist` | Shared checklist PDF/XLSX | CHECKLIST | Yes | — | Maintain | — |
| Requirements Template | `crm-requirements-template` | Shared | WORKSHEET / TEMPLATE | Mostly | Checklist chrome | Optional dedicated worksheet PDF | P2 |
| Vendor Scorecard | `crm-vendor-scorecard` | **Dedicated exporters (2026-08-15)** | SCORECARD | Yes (after redesign) | Was checklist | Done — Excel engine + PDF pack | P0 |
| RFP Template | `crm-rfp-template` | **Dedicated exporters (2026-08-15)** | RFP | Yes (after redesign) | Was checklist | Done — Excel response workbook + PDF brief | P0 |
| Demo Checklist | `crm-demo-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |
| Implementation Checklist | `crm-implementation-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |
| Migration Checklist | `crm-migration-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |
| Go-Live Checklist | `crm-go-live-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |
| Training Plan | `crm-training-plan` | Shared | PLANNER | Partial | Checklist rows | Dedicated planner sheets later | P2 |
| Data Migration Template | `crm-data-migration-template` | Shared | WORKSHEET / INVENTORY | No | Checklist chrome on inventory | Dedicated inventory workbook | P1 |
| Field Mapping Template | `crm-field-mapping-template` | **Dedicated exporters (2026-08-15)** | MAPPING_WORKBOOK | Yes (after redesign) | Was checklist | Done — Excel matrix + PDF guide | P0 |
| Security Checklist | `crm-security-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |
| Decision Matrix | `crm-comparison-worksheet` | **Dedicated exporters (2026-08-15)** | DECISION_MATRIX | Yes (after redesign) | Was checklist | Done — Excel engine + PDF summary | P0 |
| Business Case Template | `crm-business-case-template` | Dedicated exporters | BUSINESS_CASE | Yes | — | Maintain | — |
| Optimization Checklist | `crm-optimization-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |
| Cleanup Checklist | `crm-cleanup-checklist` | Shared | CHECKLIST | Yes | — | Maintain | — |

---

## Priority notes

- **P0 done:** Decision Matrix, Field Mapping, Vendor Scorecard, and RFP no longer use Pass/Fail checklist PDFs as their core model.  
- **P1:** Data Migration Template inventory workbook.  
- Do **not** rewrite unrelated checklists in this task.
