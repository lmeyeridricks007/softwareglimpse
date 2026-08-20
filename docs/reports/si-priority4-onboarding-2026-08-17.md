# SI Priority-4 onboarding — Adapt.io, Outreach, Salesloft, Instantly, Gong (+ Lemlist, Smartlead)

**Date:** 2026-08-17  
**Scope:** Optional / adjacent products from [`sales-intelligence-product-coverage.md`](./sales-intelligence-product-coverage.md).  
**Prior:** Priority 1–3 (`si-priority{1,2,3}-onboarding-2026-08-17.md`).

## Products

| Product | Slug | SI overall | CQ product-review | Best placement |
| --- | --- | ---: | ---: | --- |
| Adapt.io | `adapt-io` | 6.3 | **91 / 100** | landscape + decision path (not ranked — thinner vs UpLead/Hunter) |
| Outreach | `outreach` | 6.3 | **91 / 100** | landscape only (SEP — not contact-DB peer) |
| Salesloft | `salesloft` | 6.3 | **91 / 100** | landscape only (SEP peer) |
| Instantly | `instantly` | 6.6 | **91 / 100** | landscape only (cold-email infra) |
| Lemlist | `lemlist` | 6.6 | **91 / 100** | landscape only (cold-email / multichannel) |
| Smartlead | `smartlead` | 6.3 | **91 / 100** | landscape only (cold-email infra) |
| Gong | `gong` | 4.9 | **91 / 100** | landscape only (conversation intelligence — adjacent) |

Methodology: `sales-intelligence-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded.

**Honest scoring notes**

- **Outreach / Salesloft:** weak `contact-data` / `data-enrichment` (3–4); strong `email-outreach` / `crm-sync` (9).
- **Gong:** intentionally low on SI data/outreach criteria; strong `reporting` (9) and `crm-sync` (8) as conversation-intel adjacent.
- **Adapt.io:** mid-tier contact DB peer scores, but **landscape not ranked** (thin vs UpLead/Hunter for Best-page ranks).

## Delivered

- Seed entries in `src/data/seed/software.ts` (`primaryCategorySlug: sales-intelligence`, published, research complete)
- Research packs under `src/data/research/{slug}/`
- Approved SI assessments + product reviews
- Brand logos under `public/brands/` (favicon-scale marks — replace with press-kit assets when available)
- Best Sales Intelligence page: all seven in `eligibleProductSlugs`; **none** in ranked `recommendations`; decision paths + landscape buckets updated
- Landscape buckets added: `cold-email-infra`, `conversation-intelligence`; SEP peers added to `engagement`; Adapt.io added to `contact-databases`
- SI comparison pairs: adapt-io–uplead, outreach–salesloft, instantly–lemlist, instantly–smartlead
- Relationship graph edges for competes-with / alternative-to
- Category `seedProductSlugs` updated
- Batch: `scripts/lib/si-priority4-products.mjs` + `scripts/lib/si-onboard-runtime.mjs` + `scripts/onboard-si-priority4-batch.mjs`

## Best-page ranks (SI)

Unchanged ranked order from Priority-3 (no P4 products inserted into ranks):

1. Apollo → 2. ZoomInfo → 3. Seamless.AI → 4. Clay → 5. Cognism → 6. 6sense → 7. Demandbase → 8. LinkedIn Sales Navigator → 9. Clearbit → 10. Lusha → 11. Hunter → 12. Snov.io → 13. LeadIQ → 14. UpLead → 15. Reply → 16. BookYourData → 17. Amplemarket → 18. RocketReach → 19. Kixie

**Landscape-only (P4):** Adapt.io, Outreach, Salesloft, Instantly, Lemlist, Smartlead, Gong (plus prior landscape: Closely, Bombora, Kaspr, Ocean).

## Pricing posture (first-party, 2026-08-17)

- **Adapt.io:** Free; Starter $49/mo; Basic $99/mo; Custom contact sales; 7-day trial — `adapt.io/pricing`
- **Outreach:** Amplify Essentials/Core/Plus/Pro — request pricing (seat + AI credits); no public dollar floors — `outreach.io/pricing`
- **Salesloft:** Talk to Sales only — no public dollar list — `salesloft.com/pricing`
- **Instantly:** Growth from $47/mo; Hypergrowth $97; Light Speed $358; Enterprise custom — `instantly.ai/pricing`
- **Lemlist:** Email from $55/user/mo yearly ($69 monthly); Multichannel from $87 yearly; Enterprise custom; 14-day trial — `lemlist.com/pricing`
- **Smartlead:** Base from $59/mo ($39/mo yearly headline) with send/verified-email bands; confirm live slider — `smartlead.ai/pricing`
- **Gong:** Per-user licenses + platform fee; custom proposal only — `gong.io/pricing`

## Gates / notes

- **No WP publish** — Next.js catalogue only
- `handsOnTesting=false` on all assessments/reviews
- No invented prices: Outreach, Salesloft, Gong remain `contactSales`
- Smartlead higher-tier dollars are dynamic on the pricing UI — Base yearly/monthly floors documented; confirm live before quoting other tiers
- Logos are favicon-scale placeholders — replace with vendor press-kit assets when available
- Official YouTube media not wired in this batch (0 videos) — optional follow-up
- Affiliate economics never enter scores

## Quality bar

All seven product-review CQ scores **91 ≥ 75**.

## Blockers

| Item | Status |
| --- | --- |
| WP publish | Intentionally skipped |
| Official videos / teaching diagrams | Optional follow-up (`product-guide-visuals.ts --si`) |
| Press-kit logos | Favicon placeholders only |
| Smartlead Pro/Smart/Prime exact dollars | Dynamic UI — Base floors only locked; higher tiers confirm live |
| Ranked Best insertion for Adapt.io | Skipped by design (landscape preferred) |
