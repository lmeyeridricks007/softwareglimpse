# EM Priority-1 onboarding — Klaviyo, Brevo, MailerLite

**Date:** 2026-08-17  
**Scope:** Credibility gaps from [`email-marketing-product-coverage.md`](./email-marketing-product-coverage.md) Priority 1 (not previously onboarded).  
**ActiveCampaign / Mailchimp / GetResponse / HubSpot:** already onboarded — skipped.

## Products

| Product | Slug | EM overall | CQ product-review |
| --- | --- | ---: | ---: |
| Klaviyo | `klaviyo` | 7.9 | **91 / 100** |
| Brevo (Sendinblue) | `brevo` | 7.5 | **91 / 100** |
| MailerLite | `mailerlite` | 7.2 | **91 / 100** |

Methodology: `email-marketing-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded.

## Delivered

- Seed entries in `src/data/seed/software.ts` (published, research complete)
- Research packs under `src/data/research/{slug}/` (sources, fixtures, enrichment, facts)
- Approved EM assessments + product reviews
- Brand logos in `public/brands/` (SoftwareGlimpse-generated marks, 512×512)
- Teaching visuals in `public/software/{slug}/` (overview + workflow diagrams)
- Product guide packs via `product-guide-visuals.ts --em` (primary ESP slug list extended)
- Best Email Marketing page: eligible + ranks 1–8 + decision paths + landscape
- 7 approved EM comparisons
- Relationship graph edges for competes-with / alternative-to (light touch on Mailchimp, ActiveCampaign, GetResponse)
- Category `seedProductSlugs` updated
- Batch generator: `scripts/onboard-em-priority1-batch.mjs`
- Seed snippet: `scripts/_em-priority1-seed-snippet.ts`

## Best-page ranks (EM)

1. Klaviyo → Best ecommerce email & SMS  
2. ActiveCampaign → Best automation depth  
3. Brevo → Best value / send-based pricing  
4. GetResponse → Best all-in-one free-tier path  
5. MailerLite → Best simple free-tier / SMB ease  
6. Mailchimp → Best for beginners / brand recognition  
7. Campaign Monitor → Best design-led  
8. AWeber → Best simple creator/SMB  

**Landscape only (not ranked):** Bouncer (`list-hygiene`), InboxAlly (`deliverability`).

## Comparisons added

- klaviyo-vs-mailchimp  
- activecampaign-vs-klaviyo  
- brevo-vs-klaviyo  
- brevo-vs-mailerlite  
- mailchimp-vs-mailerlite  
- brevo-vs-getresponse  
- getresponse-vs-klaviyo  

## Pricing notes (research floors — confirm live)

| Product | Free | Paid floors (research 2026-08-17) |
| --- | --- | --- |
| Klaviyo | ≤250 active profiles / 500 emails/mo | Email from ~$20/mo (251–500 profiles); Email+SMS from ~$35/mo — **live slider required** |
| Brevo | 300 emails/day; ≤100k contacts stored | Starter from $9/mo (send volume from 5k); Standard from $18/mo; Professional from $499/mo |
| MailerLite | ≤250 subscribers / 2,500 emails/30 days | Comfort from $12/mo at 500 subs; Power from $25/mo (June 2026 rename) |

## Gates / notes

- Content workflows may still request editorial approval for agent drafts; reviews/assessments are already **approved** and score **91**
- Logos are SoftwareGlimpse-generated marks (not official trademark assets) — replace with vendor press-kit logos when available
- Overview/workflow PNGs are teaching placeholders — prefer premium GenerateImage visuals when refreshing EM guide packs
- No auto-publish to WordPress production; Next.js catalogue is the source of truth until migration cutover
- Affiliate economics never entered scores or best-page ranks

## Quality bar

All three product-review CQ scores **91 ≥ 75**.
