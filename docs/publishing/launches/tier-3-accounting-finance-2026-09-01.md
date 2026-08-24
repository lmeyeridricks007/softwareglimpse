# Tier 3 — Accounting & Finance category launch (September 2026)

**Window:** 1–29 September 2026 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-3-accounting-finance-launch-2026-09-01.ts`  
**Schedules:** `npm run catalogue:tier3-schedules`

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2026-09-01 | Category hub `accounting-finance` |
| 2026-09-03 | Guide: What is accounting & finance software? |
| 2026-09-05 | Guide: How to choose |
| 2026-09-07 | Guide: Pricing |
| 2026-09-09 | Guide: How accounting & finance software works |
| 2026-09-11 | Guide: Types of accounting & finance software |
| 2026-09-13 | Guide: Accounting & finance vs HR software |
| 2026-09-15 | Guide: Requirements |
| 2026-09-17 | Guide: Evaluation |
| 2026-09-19 | Best page: accounting-finance-software |
| 2026-09-22 | Tool: accounting-finance-finder |
| 2026-09-25 | Guide: What is Navan |
| 2026-09-28 | Guide: What is Dext |
| 2026-09-29 | Guide: What is MRPeasy |

## Recategorization

- `navan` → `accounting-finance` (from `hr`)
- `dext` → `accounting-finance` (from `hr`)
- `mrpeasy` → `accounting-finance` (from `project-management`)

Product what-is guides **moved from** Tier 9 HR (navan, dext) and Tier 12 PM (mrpeasy).

## Onboarding

```bash
npm run onboard:category -- accounting-finance
npm run onboard:category:validate
npm run catalogue:tier3-schedules
npm run catalogue:tier9-schedules   # refresh HR tier after navan/dext removal
npm run catalogue:tier12-schedules  # refresh PM tier after mrpeasy removal
```
