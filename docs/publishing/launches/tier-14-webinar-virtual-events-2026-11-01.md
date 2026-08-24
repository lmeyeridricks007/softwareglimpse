# Tier 14 — Webinar & Virtual Events category launch (November 2026)

**Window:** 1–27 November 2026 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01.ts`  
**Schedules:** `npm run catalogue:tier14-schedules`

WebinarJam software ships earlier via [Sep 2026 wedge launch](./webinarjam-everwebinar-launch-2026-09-01.md).

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2026-11-01 | Category hub `webinar-virtual-events` |
| 2026-11-03 | Guide: What is webinar & virtual events software? |
| 2026-11-05 | Guide: How to choose |
| 2026-11-07 | Guide: Pricing |
| 2026-11-09 | Guide: How webinar software works |
| 2026-11-11 | Guide: Types of webinar software |
| 2026-11-13 | Guide: Webinar vs marketing software |
| 2026-11-15 | Guide: Requirements |
| 2026-11-17 | Guide: Evaluation |
| 2026-11-19 | Best page: webinar-virtual-events-software |
| 2026-11-21 | Tool: webinar-virtual-events-finder (+ demo checklist via category tools) |
| 2026-11-23 | Guide: What is WebinarJam & EverWebinar |
| 2026-11-25 | Guide: What is Livestorm |
| 2026-11-27 | Guide: What is Switcher Studio |

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `webinarjam-everwebinar` | `marketing` | `webinar-virtual-events` (+ `marketing` secondary) |
| `livestorm` | `marketing` | `webinar-virtual-events` (+ `marketing` secondary) |
| `switcher-studio` | `marketing` | `webinar-virtual-events` (+ `marketing` secondary) |
| `zoom` | `business-communications` | `business-communications` primary + `webinar-virtual-events` secondary (landscape anchor) |

Affiliate what-is guides for `webinarjam-everwebinar` and `switcher-studio` **moved from** Tier 11 (Jan 2027) to this wave.

## Onboarding

```bash
npm run onboard:category -- webinar-virtual-events
npm run onboard:category:validate
npm run catalogue:tier14-schedules
npm run catalogue:tier11-schedules   # refresh after webinarjam/switcher-studio removal
```
