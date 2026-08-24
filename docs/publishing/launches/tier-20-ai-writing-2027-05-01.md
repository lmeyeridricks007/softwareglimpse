# Tier 20 — AI Writing subcategory launch (May 2027)

**Window:** 1–30 May 2027 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-20-ai-writing-launch-2027-05-01.ts`  
**Schedules:** `npm run catalogue:tier20-schedules`

Subcategory hub under parent `ai`. Uses parent `/tools/ai-finder/` with the `ai-writing` use-case tag — no dedicated subcategory finder.

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-05-01 | Category hub `ai-writing` |
| 2027-05-03 | Guide: What is AI writing software? |
| 2027-05-05 | Guide: How to choose |
| 2027-05-07 | Guide: Pricing |
| 2027-05-09 | Guide: How AI writing software works |
| 2027-05-11 | Guide: Types of AI writing software |
| 2027-05-13 | Guide: AI writing vs general AI software |
| 2027-05-15 | Guide: Requirements |
| 2027-05-17 | Guide: Evaluation |
| 2027-05-20 | Best page: ai-writing-software |
| 2027-05-25 | Guide: What is QuillBot? |
| 2027-05-30 | Guide: What is Writesonic? |

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `quillbot` | `ai` | `ai-writing` (+ `ai` secondary) |
| `writesonic` | `ai` | `ai-writing` (+ `ai` secondary) |

QuillBot / Writesonic `what-is` guides moved from **Tier 5 AI** (Nov 2026) to this launch.

## Onboarding

```bash
npm run onboard:category -- ai-writing
npm run onboard:category:validate
npm run catalogue:tier20-schedules
npm run catalogue:tier5-schedules
```
