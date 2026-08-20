# Email Marketing Wave-1 — Best page, comparisons, relationships

**Date:** 2026-08-17  
**Scope:** Wire best page, approved comparisons, and relationship edges after Wave-1 product onboarding.  
**Not a WordPress publish.** Affiliate economics do not drive ranks.

## Ranked ESPs (best page)

Path: `/best/email-marketing-software/` · seed id `best-email-marketing-software` · `src/data/seed/best.ts`

| Rank | Product | Slug | Assessment overall | Methodology | Badge |
| ---: | --- | --- | ---: | --- | --- |
| 1 | ActiveCampaign | `activecampaign` | 7.0 | `crm-editorial` (pending EM re-score) | Best overall marketing automation depth |
| 2 | GetResponse | `getresponse` | 7.5 | `email-marketing-editorial` | Best all-in-one value / free tier path |
| 3 | Campaign Monitor | `campaign-monitor` | 7.0 | `email-marketing-editorial` | Best design-led campaigns / Marigold |
| 4 | Mailchimp | `mailchimp` | 6.8 | `crm-editorial` (pending EM re-score) | Best known freemium / brand recognition for beginners |
| 5 | AWeber | `aweber` | 6.5 | `email-marketing-editorial` | Best simple creator/SMB newsletter path |

**Ranking note:** Order is editorial fit (automation → all-in-one value → design → freemium brand → simple newsletter), not raw overall score. ActiveCampaign ranks #1 for automation depth despite CRM-era overall 7.0 vs GetResponse EM overall 7.5.

## Adjacent (landscape only — NOT ranked ESPs)

| Product | Slug | Overall | Landscape bucket | Decision path |
| --- | --- | ---: | --- | --- |
| Bouncer | `bouncer` | 4.5 | `list-hygiene` | List hygiene (adjacent) |
| InboxAlly | `inboxally` | 5.0 | `deliverability` | Deliverability repair (adjacent) |

Eligible pool includes all seven products. Ranked recommendations are the five ESPs only.

## Decision paths

| Priority | Product |
| --- | --- |
| Need strong automation | `activecampaign` |
| Need strong automation with free-tier entry | `getresponse` |
| Need beautiful templates | `campaign-monitor` |
| Starting free — all-in-one stack | `getresponse` |
| Starting free — simple newsletter | `aweber` |
| Starting free — brand-familiar freemium | `mailchimp` |
| List hygiene (adjacent) | `bouncer` |
| Deliverability repair (adjacent) | `inboxally` |

## Comparisons added

Seed: `src/data/seed/comparisons.ts` · category `email-marketing` · criteria from EM `comparisonCriteria` (factual + editorial).

| Canonical slug | Pair |
| --- | --- |
| `activecampaign-vs-getresponse` | ActiveCampaign vs GetResponse |
| `aweber-vs-getresponse` | AWeber vs GetResponse |
| `campaign-monitor-vs-getresponse` | Campaign Monitor vs GetResponse |
| `aweber-vs-campaign-monitor` | AWeber vs Campaign Monitor |
| `getresponse-vs-mailchimp` | GetResponse vs Mailchimp |
| `activecampaign-vs-mailchimp` | ActiveCampaign vs Mailchimp |
| `aweber-vs-mailchimp` | AWeber vs Mailchimp |

Pricing notes cite researched floors only (GetResponse Starter $19/@~1k, AWeber Lite $15/@500, Campaign Monitor Lite ~$13/@0–500, ActiveCampaign Starter ~$15/@~1k annual). Mailchimp paid ladder: verify live — not invented.

## Relationships

Seed: `src/data/seed/relationships.ts`

- `competes-with` mesh among the five ESPs
- `alternative-to` edges for the approved comparison pairs (+ Campaign Monitor vs Mailchimp)
- `related-to` from Bouncer / InboxAlly → ESPs (hygiene / deliverability), plus Bouncer ↔ InboxAlly

## Category hub

`src/data/seed/categories.ts` — `email-marketing` updated to `published` / `indexable: true` / `categoryLifecycle: active` so the hub can render Wave-1 products (same pattern as sales-intelligence; no CRM-style deep hub profile file required).

Category definition already lists Wave-1 `seedProductSlugs` in `src/data/category-onboarding/seed/email-marketing.ts`.

## Files touched

- `src/data/seed/best.ts`
- `src/data/seed/comparisons.ts`
- `src/data/seed/relationships.ts`
- `src/data/seed/categories.ts`
- `docs/reports/email-marketing-wave1-best-comparisons-2026-08-17.md`

## Follow-ups

- Re-score ActiveCampaign and Mailchimp on `email-marketing-editorial` (still `crm-editorial` assessments)
- Optional: deep category-hub profile file (CRM has one; SI does not)
- Do not auto-publish to WordPress
