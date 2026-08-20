# EM Priority-2 onboarding — Omnisend, Kit, Constant Contact, Flodesk, Moosend, Beehiiv

**Date:** 2026-08-17  
**Scope:** Priority-2 / Batch B segment depth from [`email-marketing-product-coverage.md`](./email-marketing-product-coverage.md).  
**Status:** DONE (Next.js catalogue only — no WordPress publish).

## Products

| Product | Slug | EM overall | Best-page | Notes |
| --- | --- | ---: | --- | --- |
| Omnisend | `omnisend` | 7.7 | Rank **#3** | Ecommerce multichannel Klaviyo alternative |
| Kit (ConvertKit) | `kit` | 7.1 | Rank **#6** | Creator / newsletter ESP; aliases ConvertKit |
| Moosend | `moosend` | 6.9 | Rank **#8** | Budget automation |
| Flodesk | `flodesk` | 6.6 | Rank **#12** | Design-led creator ESP (≥6.5 ranked) |
| Constant Contact | `constant-contact` | 6.5 | Rank **#14** | SMB / local brand recognition |
| Beehiiv | `beehiiv` | 6.2 | **Landscape** | Newsletter growth platform (adjacent) |

Methodology: `email-marketing-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded. Reviews/assessments **approved** / published in seed metadata.

## Delivered

- Batch script: `scripts/onboard-em-priority2-batch.mjs` (+ `scripts/lib/em-priority2-products.mjs`, shared `em-onboard-runtime.mjs` / `em-compact-expand.mjs`)
- Research packs: `src/data/research/{slug}/`
- Approved assessments + product reviews under `src/data/editorial/`
- Seed entries in `src/data/seed/software.ts` (`primaryCategorySlug: email-marketing`)
- Category `seedProductSlugs` updated in `src/data/category-onboarding/seed/email-marketing.ts`
- Best Email Marketing page ranks + landscape + decision paths in `src/data/seed/best.ts`
- Comparisons: `klaviyo-vs-omnisend`, `kit-vs-mailerlite`, `kit-vs-flodesk`, `constant-contact-vs-mailchimp`, `moosend-vs-getresponse`
- Brand logos: `public/brands/{slug}.png` (SG lettermarks, 512×512)
- Teaching visuals: `public/software/{slug}/overview.png` + `workflow.png`
- Product guide primary list extended; `npx tsx scripts/product-guide-visuals.ts --em`
- Light competitor/alternative bumps on related ESPs (Klaviyo, Brevo, MailerLite, ActiveCampaign)

## Pricing floors (research 2026-08-17 — confirm live)

| Product | Free | Paid floor (research) |
| --- | --- | --- |
| Omnisend | ≤250 contacts / 500 emails/mo | Standard from ~$16/mo at 500 contacts (intro discounts common) |
| Kit | Newsletter free (automation-limited) | Creator from $33/mo at 1k subscribers |
| Constant Contact | No free plan | Lite from $12/mo at ≤500 contacts |
| Flodesk | Limited free path researched | Lite from $25/mo at ≤1k subscribers |
| Moosend | No free plan (30-day trial) | Pro from $9/mo at 500 contacts |
| Beehiiv | Free publication tier | Scale from $49/mo researched |

## Gates / notes

- Stopped at editorial approval — **no WP publish**
- Logos are SoftwareGlimpse-generated marks (not vendor trademarks)
- Beehiiv kept landscape (newsletter-adjacent; overall 6.2 &lt; 6.5 rank bar)
- Affiliate economics never entered scores or ranks

## Quality bar

Pack structure mirrors Priority-1 (CQ target ≥75 / aim 91–93). Assessments and reviews approved; overall scores coherent with EM methodology.
