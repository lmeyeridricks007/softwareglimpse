# Email marketing guides + visuals — 2026-08-17

**Scope:** Product guides for primary ESPs, category guide heroes, marketing comparisons, official-video notes  
**Quality bar:** Teaching visuals (blue-navy-white SaaS UI); no affiliate economics in rankings; research-grounded comparisons  

---

## A) Email-marketing product guides

Parallel to SI product guides. Primary ESPs only (adjacent `bouncer` / `inboxally` skipped).

| Product | Kinds (×5) |
| --- | --- |
| getresponse | implementation, migration, setup, plans, worth-it |
| aweber | same |
| campaign-monitor | same |
| mailchimp | same |
| activecampaign | same |

**Total:** 25 guides via `buildAllEmProductGuides()` → `src/data/seed/guides-product-em.ts` → `guidesSeed`.

### Code wiring

| Area | Change |
| --- | --- |
| Pricing | `listEmailMarketingPricingSnapshots()` in `build-snapshot.ts` / `server.ts` |
| Context | `listEmProductGuideSlugs()`, EM core-loop features, snapshot lookup |
| Kinds | `EM_PRODUCT_GUIDE_KIND_CONFIG` + `productGuideKindConfig("email-marketing")` |
| Blocks | `blocks-em.ts` (campaigns / lists / automations language) |
| Build | `buildEmProductGuide` / `buildAllEmProductGuides` |
| Seed | `guides-product-em.ts` spread into `guides.ts` |
| SVG fallbacks | `product-guide-visuals.ts --em` |

---

## B) Guide hero visuals (`public/guides/`)

Generated with GenerateImage (16:9, ~1.3–1.5MB each). Category heroes match seed `heroVisual.src` paths.

| File | Purpose |
| --- | --- |
| `what-is-email-marketing-hero.png` | Category fundamentals |
| `how-to-choose-email-marketing-hero.png` | Selection framework |
| `email-marketing-pricing-guide-hero.png` | Pricing anatomy |
| `email-marketing-requirements-guide-hero.png` | Requirements |
| `email-marketing-evaluation-guide-hero.png` | Evaluation / trial scorecard |
| `getresponse-setup-cover-v4.png` | Product guide hero (`productGuideHeroSrc` prefers `-v4`) |
| `getresponse-plans-cover-v4.png` | Product guide plans hero |

**Not generated this pass:** full cover/diagram/step packs for all 5 ESPs × 5 kinds (use GenerateImage or `npx tsx scripts/product-guide-visuals.ts --em` for SVG v3 placeholders).

---

## C) Marketing comparisons

Added 4 approved pairs (`categorySlug: marketing`, marketing-editorial criteria):

| Slug | Title |
| --- | --- |
| `freshmarketer-vs-kartra` | Kartra vs Freshmarketer |
| `brand24-vs-socialbee` | Brand24 vs SocialBee |
| `kartra-vs-socialbee` | Kartra vs SocialBee |
| `freshmarketer-vs-socialbee` | Freshmarketer vs SocialBee |

Scores/verdicts grounded in approved `marketing-editorial` assessments (2026-08-17). Canonical slug order is alphabetical via `canonicalizeComparisonSlug`.

---

## D) Official videos — manual approve

`scripts/_em-batch-official-videos.json` has 2 entries. Discovery ≠ approval; lifecycle is multi-step via `npm run assets:approve`.

| Product | YouTube | Suggested register URL |
| --- | --- | --- |
| aweber | `rdUpyHxG9PA` | `https://www.youtube.com/watch?v=rdUpyHxG9PA` |
| campaign-monitor | `0hMDzGuc6WY` | `https://www.youtube.com/watch?v=0hMDzGuc6WY` |

**Manual path (per asset):**

```bash
npm run assets:approve -- register --product aweber --url "https://www.youtube.com/watch?v=rdUpyHxG9PA" --title "…" --feature ai-content-generation --shows "…"
npm run assets:approve -- verify-source <id> --kind vendor-channel --channel "AWeber (The Shift AI Show)" --org "AWeber Systems, Inc."
npm run assets:approve -- review-relevance <id> --pass --shows "…"
npm run assets:approve -- review-usage <id> --action embed
npm run assets:approve -- map <id> --product aweber --feature ai-content-generation
npm run assets:approve -- place <id> --route /software/aweber/ --section features --section-title Features
npm run assets:approve -- editorial-approve <id>
npm run assets:approve -- import <id> --persist --activate
```

Repeat for Campaign Monitor (`0hMDzGuc6WY`, channel Campaign Monitor / Marigold). Then `npm run audit:media-health`.

**Not auto-imported** in this pass (workflow requires source verification + editorial gate).

---

## E) File list

### Created
- `src/services/product-guides/blocks-em.ts`
- `src/data/seed/guides-product-em.ts`
- `public/guides/what-is-email-marketing-hero.png`
- `public/guides/how-to-choose-email-marketing-hero.png`
- `public/guides/email-marketing-pricing-guide-hero.png`
- `public/guides/email-marketing-requirements-guide-hero.png`
- `public/guides/email-marketing-evaluation-guide-hero.png`
- `public/guides/getresponse-setup-cover-v4.png`
- `public/guides/getresponse-plans-cover-v4.png`
- `docs/reports/email-marketing-guides-visuals-2026-08-17.md`

### Updated
- `src/services/pricing/build-snapshot.ts`, `server.ts`
- `src/services/product-guides/context.ts`, `kinds.ts`, `blocks.ts`, `build.ts`, `index.ts`
- `src/data/seed/guides.ts`, `comparisons.ts`
- `scripts/product-guide-visuals.ts`

---

## Follow-ups

1. Generate remaining product-guide `-cover-v4` / `-diagram-v4` / step panels for aweber, mailchimp, activecampaign, campaign-monitor  
2. Run official-video approve lifecycle for AWeber + Campaign Monitor  
3. Soft-publish check: category EM guides still `seo.indexable: false` until editorial gate; product guides currently `indexable: true` (match SI)
