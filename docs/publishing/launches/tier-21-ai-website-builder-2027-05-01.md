# Tier 21 — AI Website Builder subcategory launch (May 2027)

**Window:** 2–29 May 2027 (~every 2–3 days, interleaved with Tier 20 ai-writing)  
**Config:** `src/data/config/publishing/tier-21-ai-website-builder-launch-2027-05-01.ts`  
**Schedules:** `npm run catalogue:tier21-schedules`

Subcategory hub under parent `ai`. Uses parent `/tools/ai-finder/` with build-surface constraint — no dedicated subcategory finder.

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-05-02 | Category hub `ai-website-builder` |
| 2027-05-04 | Guide: What is AI website builder software? |
| 2027-05-06 | Guide: How to choose |
| 2027-05-08 | Guide: Pricing |
| 2027-05-10 | Guide: How AI website builder software works |
| 2027-05-12 | Guide: Types of AI website builder software |
| 2027-05-14 | Guide: AI website builders vs general AI software |
| 2027-05-16 | Guide: Requirements |
| 2027-05-18 | Guide: Evaluation |
| 2027-05-22 | Best page: ai-website-builder-software |
| 2027-05-26 | Guide: What is Wegic? |
| 2027-05-28 | Guide: What is MindStudio? |
| 2027-05-29 | Guide: What is Emergent? |

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `wegic` | `website-digital-presence` | `ai-website-builder` (+ `ai` secondary) |
| `mindstudio` | `ai` | `ai-website-builder` (+ `ai` secondary) |
| `emergent` | `ai` | `ai-website-builder` (+ `ai` secondary) |

Wegic `what-is` moved from **Tier 16 WDP** (Jan 2027). MindStudio / Emergent `what-is` moved from **Tier 5 AI** (Nov 2026).

## Onboarding

```bash
npm run onboard:category -- ai-website-builder
npm run onboard:category:validate
npm run catalogue:tier21-schedules
npm run catalogue:tier5-schedules
npm run catalogue:tier16-schedules
```
