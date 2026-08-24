# Tier 18 — Field Service & Operations category launch (March 2027)

**Window:** 1–30 March 2027 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-18-field-service-operations-launch-2027-03-01.ts`  
**Schedules:** `npm run catalogue:tier18-schedules`

No generic category finder — vertical-specific industry use-case pages first.

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-03-01 | Category hub `field-service-operations` |
| 2027-03-03 | Guide: What is field service & operations software? |
| 2027-03-05 | Guide: How to choose |
| 2027-03-07 | Guide: Pricing |
| 2027-03-09 | Guide: How field service software works |
| 2027-03-11 | Guide: Types of field service software |
| 2027-03-13 | Guide: Field service vs project management software |
| 2027-03-15 | Guide: Requirements |
| 2027-03-17 | Guide: Evaluation |
| 2027-03-20 | Best page: field-service-operations-software |
| 2027-03-25 | Guide: What is Contractor Foreman |
| 2027-03-30 | Guide: What is ServiceM8 |

Shore `what-is` / `is-worth-it` already ship **Tier 7 CS** (Nov 2026) — not rescheduled.

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `contractor-foreman` | `project-management` | `field-service-operations` (+ `project-management` secondary) |
| `shore` | `customer-service` | `field-service-operations` (+ `customer-service` secondary) |
| `servicem8` | `project-management` | `field-service-operations` (+ `project-management` secondary) |

## Onboarding

```bash
npm run onboard:category -- field-service-operations
npm run onboard:category:validate
npm run catalogue:tier18-schedules
```
