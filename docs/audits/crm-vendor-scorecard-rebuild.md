# CRM Vendor Scorecard — rebuild note

**Date:** 2026-08-15  
**Slug:** `crm-vendor-scorecard`

## What changed

| Before | After |
| --- | --- |
| Shared checklist PDF (CHECK ITEM / Pass–Fail) | Dedicated 8-page scorecard PDF |
| Checklist-shaped Excel | Excel scoring engine (`00_README`–`07_DECISION`) |
| Checklist hub framing | Scorecard workbook + tool twin |

## Differentiation

| Artifact | Question |
| --- | --- |
| Evaluation Checklist | Did we prove X in demo/trial? |
| **Vendor Scorecard** | How did finalists score on weighted criteria? |
| Decision Matrix | Which option should we select (fit + TCO + risk)? |

## Paths

- `src/services/resource-hub/exports/crm-vendor-scorecard-{pdf,xlsx}.ts`
- `src/data/resource-hub/crm-vendor-scorecard.ts`
- `public/resources/crm-vendor-scorecard.{pdf,xlsx,md,csv}`

Page-1 banner: **SCORECARD WORKBOOK · Not a Pass/Fail checklist**. No invented vendor rankings.
