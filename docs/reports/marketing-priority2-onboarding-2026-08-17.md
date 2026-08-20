# Marketing Priority-2 onboarding — social suites, listening, Iterable, affiliate leftovers

**Date:** 2026-08-17  
**Scope:** Marketing Priority-2 depth from [`email-marketing-product-coverage.md`](./email-marketing-product-coverage.md).  
**Status:** DONE (Next.js catalogue only — no WordPress publish).

## Products onboarded

| Product | slug | Overall | Best Marketing disposition | Notes |
| --- | --- | ---: | --- | --- |
| Later | `later` | 5.9 | **Landscape** (visual scheduler) | Buffer peer |
| Agorapulse | `agorapulse` | 6.2 | **Landscape** (inbox + publish) | Buffer peer |
| Hootsuite | `hootsuite` | 6.3 | **Landscape** (major social suite) | Below Buffer scheduler award |
| Sprout Social | `sprout-social` | 6.4 | **Landscape** (premium social suite) | Preferred vs Buffer rank |
| Meltwater | `meltwater` | 5.8 | **Landscape** (enterprise listening) | Brand24 enterprise peer |
| Brandwatch | `brandwatch` | 6.1 | **Landscape** (enterprise CI/listening) | Brand24 enterprise peer |
| Iterable | `iterable` | 6.9 | **Rank #4** — Braze peer | Custom quote only |
| WhatConverts | `whatconverts` | 5.2 | **Landscape** (lead/call attribution) | `aff-whatconverts` |
| Uniqode | `uniqode` | 4.9 | **Landscape** (QR / offline→online) | `aff-uniqode` (no live affiliate URL) |
| Switcher Studio | `switcher-studio` | 4.3 | **Landscape** (live video) | `aff-switcher-studio`; marketing-primary |

Methodology: `marketing-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics never entered scores or ranks.

## Best-page ranks (Marketing) after P2

1. Kartra — Creator all-in-one  
2. Marketo — Enterprise B2B MAP  
3. Braze — Enterprise B2C engagement  
4. **Iterable** — Braze peer B2C engagement *(new)*  
5. Freshmarketer — Freshworks MA  
6. ClickFunnels — Funnel peer  
7. **Buffer** — Mainstream social scheduler award *(retained; was #6)*  
8. SocialBee — Content recycling  
9. Brand24 — Social listening  

**Landscape:** Later, Agorapulse, Hootsuite, Sprout Social, Meltwater, Brandwatch, WhatConverts, Uniqode, Switcher Studio, LearnWorlds, Livestorm, Pardot (CRM-primary).

## Delivered

- `scripts/lib/mkt-priority2-products.mjs` — compact configs + first-party pricing research  
- `scripts/onboard-marketing-priority2-batch.mjs` — research packs + approved editorial JSON  
- `scripts/patch-software-seed-marketing-priority2.mjs` — soft() insert into `software.ts`  
- `scripts/generate-mkt-priority2-lettermarks.mjs` — SG lettermarks under `public/brands/{slug}.png`  
- Category `seedProductSlugs` updated in `src/data/category-onboarding/seed/marketing.ts`  
- `switcher-studio` removed from business-communications `seedProductSlugs` (marketing-primary)  
- Best Marketing eligible + ranks + landscape clusters + decision paths updated  
- Affiliate hints: `scripts/_marketing-priority2-affiliate-hints.json` (WhatConverts + Switcher enable; Uniqode catalogue id only)

## Pricing floors (research 2026-08-17 — confirm live)

| Product | Packaging |
| --- | --- |
| Later | Starter ~$18.75/mo annual; Growth ~$37.50; Scale ~$82.50; 14-day trial |
| Agorapulse | Standard from $79/user/mo annual; Pro $119; Advanced $149; Custom quote |
| Hootsuite | FAQ floors: Standard $99; Professional $199; Advanced $399; Enterprise custom |
| Sprout Social | Essentials from $79/seat/mo annual; Standard $199; Pro $299; Advanced $399; Enterprise custom |
| Meltwater | Custom quote only (Starter/Pro/Enterprise/Agency modules) |
| Brandwatch | Demo / custom quote only |
| Iterable | Contact sales / custom (typically MAU + messaging) — no invented dollars |
| WhatConverts | Call Tracking from $30/mo; Plus $60; Pro $100; Elite $160 (+ usage) |
| Uniqode | Free static QR; dynamic from ~$9/mo FAQ floor; Business+ custom — confirm live checkout |
| Switcher Studio | Studio Seasonal from $55/mo (promo researched); Suite higher — confirm live list prices |

## Gates / notes

- Stopped at editorial approval — **no WP publish**  
- Buffer keeps mainstream scheduler award; Hootsuite/Sprout stay landscape  
- Switcher is marketing landscape only — not a BC ranked peer  
- Uniqode plan cards are JS-rendered; dollars limited to FAQ floor + confirm-live notes  
- Affiliate enable still requires `npm run affiliate:set` for live CTA wiring where URLs exist

## Quality bar

All ten assessments/reviews approved on `marketing-editorial` v1.0.0 with medium confidence and `handsOnTesting=false`.

## Follow-up (2026-08-17)

- Remapped invalid `aiCapabilities.capability` values (e.g. `copywriting` → `other`) in Marketing P2 `enrichment.json` files so research load passes Zod (`email-generation|lead-scoring|summaries|assistant|forecasting|automation|recommendations|transcription|other`).
- `affiliate:set` for live CTAs still operator/env-dependent where inventory URLs exist; Uniqode remains inventory-only (`affiliateUrl` null).
