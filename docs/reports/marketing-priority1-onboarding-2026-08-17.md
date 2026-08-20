# Marketing Priority-1 onboarding — Buffer, ClickFunnels, Marketo, Braze (+ Pardot landscape)

**Date:** 2026-08-17  
**Scope:** Marketing Priority-1 credibility + enterprise MAP peers from [`email-marketing-product-coverage.md`](./email-marketing-product-coverage.md) Batch C / D.  
**Status:** DONE (Next.js catalogue only — no WordPress publish).

## Products

| Product | Slug | Primary | Overall | Best-page Marketing | Notes |
| --- | --- | --- | ---: | --- | --- |
| Kartra *(existing)* | `kartra` | marketing | 7.4 | Rank **#1** | Creator all-in-one (unchanged) |
| Adobe Marketo Engage | `marketo` | **marketing** (was CRM) | 7.4 | Rank **#2** + enterprise MAP award | Reclassified; CRM secondary |
| Braze | `braze` | marketing | 7.0 | Rank **#3** | Enterprise B2C multi-channel |
| ClickFunnels | `clickfunnels` | marketing | 6.8 | Rank **#5** | Funnel peer to Kartra |
| Buffer | `buffer` | marketing | 6.6 | Rank **#6** | Major social scheduler (vs SocialBee) |
| Salesforce Account Engagement | `pardot` | **crm** | 6.7 | **Landscape / decision path** | Marketing secondary only |

Methodology for new/upgraded marketing assessments: `marketing-editorial` v1.0.0. Pardot keeps `crm-editorial` assessment with marketing landscape touch. `handsOnTesting=false`. Affiliate excluded.

## Delivered

- Batch script: `scripts/onboard-marketing-priority1-batch.mjs` (+ `scripts/lib/mkt-priority1-products.mjs`, `mkt-onboard-runtime.mjs`, `mkt-compact-expand.mjs`)
- Research packs for Buffer, ClickFunnels, Braze; Marketo research/assessment refreshed to marketing-editorial
- Pardot enrichment/review refreshed for marketing secondary + landscape positioning (CRM primary retained)
- Seed: Marketo `primaryCategorySlug: "marketing"`, `secondaryCategorySlugs: ["crm"]`
- Category `seedProductSlugs` in `src/data/category-onboarding/seed/marketing.ts`
- Best Marketing page eligible + ranks 1–8 + landscape (pardot, learnworlds, livestorm) + decision paths
- Comparisons: `kartra-vs-clickfunnels`, `buffer-vs-socialbee`, `marketo-vs-braze`, `marketo-vs-kartra`
- Logos + teaching visuals (Marketo/Pardot retained prior teaching assets; also mirrored as `overview.png` / `workflow.png`)
- Light competitor bumps on Kartra / SocialBee

## Best-page ranks (Marketing)

1. Kartra — Best all-in-one creator marketing  
2. Marketo — Best enterprise B2B MAP  
3. Braze — Best enterprise B2C engagement  
4. Freshmarketer — Freshworks marketing automation  
5. ClickFunnels — Funnel-first creator peer  
6. Buffer — Mainstream social scheduling  
7. SocialBee — Content recycling / agency social  
8. Brand24 — Social listening  

**Landscape / decision path:** Pardot (Salesforce-native B2B MA), LearnWorlds, Livestorm.

## Pricing floors (research 2026-08-17 — confirm live)

| Product | Packaging |
| --- | --- |
| Buffer | Free ≤3 channels; Essentials from $6/channel/mo; Team from $12/channel/mo |
| ClickFunnels | Launch from $97/mo ($81/mo annual researched) |
| Marketo | Custom quote only — no invented dollars |
| Braze | Contact sales / custom — no invented dollars |
| Pardot | Salesforce edition packaging / custom — no invented dollars |

## Gates / notes

- **Marketo reclassified marketing-primary** (CRM secondary) for marketing credibility
- Pardot remains CRM-primary; marketing best page landscape only
- Stopped at editorial approval — **no WP publish**
- Affiliate economics never entered scores or ranks

## Quality bar

Marketing assessments/reviews approved on `marketing-editorial` v1.0.0; Marketo enterprise award independent of #1 overall (Kartra wins creator all-in-one).
