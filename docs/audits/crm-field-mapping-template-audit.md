# CRM Field Mapping Template — pre-rebuild audit

**Date:** 2026-08-15  
**See rebuild report:** `docs/audits/crm-field-mapping-template-rebuild.md`

## Pre-state

| Asset | Problem |
| --- | --- |
| PDF / XLSX | Shared checklist exporter (Check item / Why / Evidence / Pass–Fail) |
| Hub profile | Checklist-shaped `artifactSections` |
| Markdown | Checklist sections |

## Root cause

Generic `export-documents.ts` path — no dedicated mapping-workbook archetype.

## Disposition

**Fixed** via dedicated PDF + Excel exporters and hub profile rewrite (same pattern as Business Case / Decision Matrix).
