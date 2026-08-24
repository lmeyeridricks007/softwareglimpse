# Tier 15 — LMS & Course Creation category launch (December 2026)

**Window:** 1–25 December 2026 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-15-lms-course-creation-launch-2026-12-01.ts`  
**Schedules:** `npm run catalogue:tier15-schedules`

No dedicated category finder until 6+ primary products (per expansion brief).

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2026-12-01 | Category hub `lms-course-creation` |
| 2026-12-03 | Guide: What is LMS & course creation software? |
| 2026-12-05 | Guide: How to choose |
| 2026-12-07 | Guide: Pricing |
| 2026-12-09 | Guide: How LMS software works |
| 2026-12-11 | Guide: Types of LMS software |
| 2026-12-13 | Guide: LMS vs HR software |
| 2026-12-15 | Guide: Requirements |
| 2026-12-17 | Guide: Evaluation |
| 2026-12-19 | Best page: lms-course-creation-software |
| 2026-12-21 | Guide: What is LearnWorlds |
| 2026-12-23 | Guide: What is Trainual |
| 2026-12-25 | Guide: What is FlexiQuiz |

Tier 9 HR affiliate deepen (`connecteam`, `breezy-hr`, `jibble`, `carepatron`) runs **26–30 Dec** — no collision.

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `learnworlds` | `marketing` | `lms-course-creation` (+ `marketing`, `hr` secondary) |
| `trainual` | `hr` | `lms-course-creation` (+ `hr` secondary) |
| `flexiquiz` | `hr` | `lms-course-creation` (+ `hr` secondary) |

Affiliate what-is guides **moved from** Tier 9 HR (`trainual`, `flexiquiz`) and Tier 11 marketing (`learnworlds`).

## Onboarding

```bash
npm run onboard:category -- lms-course-creation
npm run onboard:category:validate
npm run catalogue:tier15-schedules
npm run catalogue:tier9-schedules
npm run catalogue:tier11-schedules
```
