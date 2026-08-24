# Tier 17 — Analytics & Business Intelligence category launch (February 2027)

**Window:** 1–28 February 2027 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01.ts`  
**Schedules:** `npm run catalogue:tier17-schedules`

No dedicated category finder until canvas-score onboarding and 6+ primaries (below 5 primaries — marketing sub-hub until inventory grows).

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-02-01 | Category hub `analytics-bi` |
| 2027-02-03 | Guide: What is analytics & BI software? |
| 2027-02-05 | Guide: How to choose |
| 2027-02-07 | Guide: Pricing |
| 2027-02-09 | Guide: How analytics software works |
| 2027-02-11 | Guide: Types of analytics software |
| 2027-02-13 | Guide: Analytics & BI vs marketing software |
| 2027-02-15 | Guide: Requirements |
| 2027-02-17 | Guide: Evaluation |
| 2027-02-20 | Best page: analytics-bi-software |
| 2027-02-24 | Guide: What is WhatConverts |
| 2027-02-28 | Guide: What is Databox |

Tier 11 marketing deepen runs **11–14 Jan** (no whatconverts/databox collision).

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `whatconverts` | `marketing` | `analytics-bi` (+ `marketing` secondary) |
| `databox` | `marketing` | `analytics-bi` (+ `marketing` secondary) |
| `canvas-score` | — | Affiliate only — pending URL/seed; not in Wave-1 |

Affiliate what-is guides moved from Tier 11 (`whatconverts`, `databox`).

## Onboarding

```bash
npm run onboard:category -- analytics-bi
npm run onboard:category:validate
npm run catalogue:tier17-schedules
npm run catalogue:tier11-schedules
```
