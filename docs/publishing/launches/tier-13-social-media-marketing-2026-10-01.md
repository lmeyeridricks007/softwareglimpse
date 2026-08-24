# Tier 13 — Social Media Marketing category launch (October 2026)

**Window:** 1–29 October 2026 (~every 2–3 days)  
**Config:** `src/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01.ts`  
**Schedules:** `npm run catalogue:tier13-schedules`

Runs alongside **Tier 4** CRM editorial-anchor guides (different content IDs — no collision).

## What ships

| Date (CET 08:00) | Content |
| --- | --- |
| 2026-10-01 | Category hub `social-media-marketing` |
| 2026-10-03 | Guide: What is social media marketing software? |
| 2026-10-05 | Guide: How to choose |
| 2026-10-07 | Guide: Pricing |
| 2026-10-09 | Guide: How social media marketing software works |
| 2026-10-11 | Guide: Types of social media marketing software |
| 2026-10-13 | Guide: Social media marketing vs marketing software |
| 2026-10-15 | Guide: Requirements |
| 2026-10-17 | Guide: Evaluation |
| 2026-10-19 | Best page: social-media-marketing-software |
| 2026-10-21 | Tool: social-media-marketing-finder |
| 2026-10-23 | Guide: What is Brand24 |
| 2026-10-25 | Guide: What is SocialBee |
| 2026-10-27 | Guide: What is Zypper |

## Recategorization

| Product | From | To |
| --- | --- | --- |
| `brand24` | `marketing` | `social-media-marketing` |
| `socialbee` | `marketing` | `social-media-marketing` |
| `zypper` | `marketing` | `social-media-marketing` |
| `buffer` | `marketing` | `social-media-marketing` (editorial anchor) |
| `hootsuite` | `marketing` | `social-media-marketing` (editorial anchor) |

Affiliate what-is guides for `socialbee` and `zypper` **moved from** Tier 11 (Jan 2027) to this wave. `brand24` is new schedule.

## Onboarding

```bash
npm run onboard:category -- social-media-marketing
npm run onboard:category:validate
npm run catalogue:tier13-schedules
npm run catalogue:tier11-schedules   # refresh after socialbee/zypper removal
```
