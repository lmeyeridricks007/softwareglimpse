# Tier 19 — Reputation & Review Management category launch (April 2027)

**Window:** 1–30 April 2027 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-19-reputation-reviews-launch-2027-04-01.ts`  
**Schedules:** `npm run catalogue:tier19-schedules`

Hub page only — no finder until 4+ products. Single-product category (CS-adjacent until inventory grows).

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-04-01 | Category hub `reputation-reviews` |
| 2027-04-04 | Guide: What is reputation & review management software? |
| 2027-04-07 | Guide: How to choose |
| 2027-04-10 | Guide: Pricing |
| 2027-04-13 | Guide: How reputation software works |
| 2027-04-16 | Guide: Types of reputation software |
| 2027-04-19 | Guide: Reputation vs customer service software |
| 2027-04-22 | Guide: Requirements |
| 2027-04-26 | Guide: Evaluation |
| 2027-04-30 | Best page: reputation-reviews-software |

NiceJob `what-is` / `is-worth-it` already ship **Tier 7 CS** (Nov 2026) — not rescheduled.

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `nicejob` | `customer-service` | `reputation-reviews` (+ `customer-service` secondary) |

## Onboarding

```bash
npm run onboard:category -- reputation-reviews
npm run onboard:category:validate
npm run catalogue:tier19-schedules
```
