# Tier 16 — Website & Digital Presence category launch (January 2027)

**Window:** 1–30 January 2027 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01.ts`  
**Schedules:** `npm run catalogue:tier16-schedules`

No dedicated category finder until 6+ primaries (high scope risk per expansion brief).

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-01-01 | Category hub `website-digital-presence` |
| 2027-01-03 | Guide: What is website & digital presence software? |
| 2027-01-05 | Guide: How to choose |
| 2027-01-07 | Guide: Pricing |
| 2027-01-09 | Guide: How website software works |
| 2027-01-11 | Guide: Types of website software |
| 2027-01-13 | Guide: Website hub vs ecommerce software |
| 2027-01-15 | Guide: Requirements |
| 2027-01-17 | Guide: Evaluation |
| 2027-01-19 | Best page: website-digital-presence-software |
| 2027-01-21 | Guide: What is Shopify |
| 2027-01-23 | Guide: What is Leadpages |
| 2027-01-25 | Guide: What is Wegic |
| 2027-01-27 | Guide: What is UENI |
| 2027-01-29 | Guide: What is Flippa |
| 2027-01-30 | Guide: What is Plesk |

Tier 11 marketing deepen runs **11–26 Jan** (no leadpages collision). Tier 10 IT runs **2 & 6 Jan** (no plesk collision).

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `shopify` | `ecommerce` | `website-digital-presence` (+ `ecommerce` secondary) |
| `leadpages` | `marketing` | `website-digital-presence` (+ `marketing` secondary) |
| `wegic` | `ai` | `website-digital-presence` (+ `ai` secondary) |
| `ueni` | `ecommerce` | `website-digital-presence` (+ `ecommerce` secondary) |
| `flippa` | `ecommerce` | `website-digital-presence` (+ `ecommerce` secondary) |
| `plesk` | `it-development` | `it-development` primary + `website-digital-presence` secondary |

Affiliate what-is guides moved from Tier 5 (`wegic`), Tier 8 (`shopify`, `ueni`), Tier 10 (`plesk`), Tier 11 (`leadpages`).

## Onboarding

```bash
npm run onboard:category -- website-digital-presence
npm run onboard:category:validate
npm run catalogue:tier16-schedules
npm run catalogue:tier5-schedules
npm run catalogue:tier8-schedules
npm run catalogue:tier10-schedules
npm run catalogue:tier11-schedules
```
