# Tier 22 — VoIP & Business Phone subcategory launch (June 2027)

**Window:** 1–30 June 2027 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-22-voip-business-phone-launch-2027-06-01.ts`  
**Schedules:** `npm run catalogue:tier22-schedules`

Indexable subcategory hub under parent `business-communications`. Uses parent `/tools/business-communications-finder/` with voice-vs-chat primary job — no dedicated subcategory finder.

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2027-06-01 | Category hub `voip-business-phone` |
| 2027-06-03 | Guide: What is VoIP & business phone software? |
| 2027-06-05 | Guide: How to choose |
| 2027-06-07 | Guide: Pricing |
| 2027-06-09 | Guide: How VoIP & business phone software works |
| 2027-06-11 | Guide: Types of VoIP & business phone software |
| 2027-06-13 | Guide: VoIP vs broader business communications |
| 2027-06-15 | Guide: Requirements |
| 2027-06-17 | Guide: Evaluation |
| 2027-06-20 | Best page: voip-business-phone-software |
| 2027-06-23 | Guide: What is KrispCall? |
| 2027-06-25 | Guide: What is CallHippo? |
| 2027-06-27 | Guide: What is Aircall? |
| 2027-06-28 | Guide: What is Freshcaller? |
| 2027-06-30 | Guide: What is Kixie? |

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `krispcall` | `business-communications` | `voip-business-phone` (+ `business-communications` secondary) |
| `callhippo` | `business-communications` | `voip-business-phone` (+ `business-communications`, `customer-service` secondary) |
| `aircall` | `business-communications` | `voip-business-phone` (+ `business-communications`, `customer-service` secondary) |
| `freshcaller` | `business-communications` | `voip-business-phone` (+ `business-communications`, `customer-service` secondary) |
| `kixie` | `sales-intelligence` | `voip-business-phone` (+ `business-communications`, `sales-intelligence` secondary) |

## Onboarding

```bash
npm run onboard:category -- voip-business-phone
npm run onboard:category:validate
npm run catalogue:tier22-schedules
```
