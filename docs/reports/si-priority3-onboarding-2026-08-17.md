# SI Priority-3 onboarding — UpLead, LeadIQ, Hunter, Snov.io, Kaspr, Ocean.io

**Date:** 2026-08-17  
**Scope:** Mid-tier comparables from [`sales-intelligence-product-coverage.md`](./sales-intelligence-product-coverage.md) Priority 3.  
**Prior:** Priority 1 ([`si-priority1-onboarding-2026-08-17.md`](./si-priority1-onboarding-2026-08-17.md)), Priority 2 ([`si-priority2-onboarding-2026-08-17.md`](./si-priority2-onboarding-2026-08-17.md)).

## Products

| Product | Slug | SI overall | CQ product-review | Best rank |
| --- | --- | ---: | ---: | ---: |
| Hunter | `hunter` | 7.3 | **93 / 100** | 11 |
| Snov.io | `snov` | 7.0 | **93 / 100** | 12 |
| LeadIQ | `leadiq` | 7.0 | **93 / 100** | 13 |
| UpLead | `uplead` | 6.8 | **93 / 100** | 14 |
| Kaspr | `kaspr` | 6.3 | **93 / 100** | landscape + decision path |
| Ocean.io | `ocean` | 6.4 | **93 / 100** | landscape + decision path |

Methodology: `sales-intelligence-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded.

Kaspr and Ocean are eligible and appear in decision paths / landscape buckets, but are not in the ranked top list (same pattern as Bombora for specialist / narrower mid-tier fit).

## Delivered

- Seed entries in `src/data/seed/software.ts` (published, research complete)
- Research packs under `src/data/research/{slug}/` (sources, fixtures, enrichment, facts)
- Approved SI assessments + product reviews
- Brand logos in `public/brands/`
- Teaching visuals in `public/software/{slug}/` (overview + workflow diagrams)
- Product guide packs via `product-guide-visuals.ts --si`
- Best Sales Intelligence page: eligible + ranks (hunter #11 → snov #12 → leadiq #13 → uplead #14) + decision paths; kaspr/ocean landscape
- SI comparison pairs (hunter–snov, apollo–hunter/snov/uplead, lusha–uplead, leadiq–lusha, cognism–kaspr, clay–ocean, etc.)
- Relationship graph edges for competes-with / alternative-to
- Category `seedProductSlugs` updated
- Official YouTube media + vendor-ui frames wired in enrichment
- Batch generator: `scripts/onboard-si-priority3-batch.mjs`
- Import script: `scripts/import-si-priority3-official-videos.ts`
- Vendor registry entries for all six products

## Media / screenshots

| Product | Official videos (active) | Vendor-UI screenshots | Teaching diagrams |
| --- | ---: | ---: | :---: |
| UpLead | 1 | 3 | Y |
| LeadIQ | 2 | 2 | Y |
| Hunter | 1 | 2 | Y |
| Snov.io | 2 | 2 | Y |
| Kaspr | 3 | 2 | Y |
| Ocean.io | 1 | 2 | Y |

## Best-page ranks (SI)

1. Apollo → 2. ZoomInfo → 3. Seamless.AI → 4. Clay → 5. Cognism → 6. 6sense → 7. Demandbase → 8. LinkedIn Sales Navigator → 9. Clearbit → 10. Lusha → **11. Hunter → 12. Snov.io → 13. LeadIQ → 14. UpLead** → 15. Reply → 16. BookYourData → 17. Amplemarket → 18. RocketReach → 19. Kixie

## Pricing posture (first-party, 2026-08-17)

- **UpLead:** trial 7d / 5 credits; Essentials $99/mo; Plus $199/mo; Professional contactSales — `uplead.com/pricing/`
- **LeadIQ:** Free 50 credits; Pro from $200/mo; Enterprise contactSales — `leadiq.com/pricing`
- **Hunter:** Free; Starter $49; Growth $149; Scale $299; Enterprise custom — `hunter.io/pricing/`
- **Snov.io:** Trial; Starter ~$39/mo; Pro tiers published; Ultra quote — `snov.io/pricing`
- **Kaspr:** Free; Starter $49 annual / $65 monthly; Business $79/$99; Enterprise custom — `kaspr.io/pricing`
- **Ocean.io:** credit model (~$0.063/credit, min ~9k, yearly ~$567) — `ocean.io/pricing`

## Gates / notes

- Onboard status: **RECONCILE OK** / Relationships **PASS** — curated competitor/alternative + graph edges are approved (relationship-review cleared 2026-08-17)
- Fixed pre-existing blocker: duplicate symmetric `alternative-to` edge `activecampaign`↔`mailchimp` in `relationships.ts` (blocked all onboard runs until removed)
- Logos are SoftwareGlimpse-generated marks (not official trademark assets) — replace with vendor press-kit logos when available
- UpLead demo video is older (2018) but official-channel; prefer newer official UI demos when available
- No auto-publish to WordPress production; Next.js catalogue is the source of truth until migration cutover
- Adapt.io intentionally skipped (optional in coverage plan)

## Quality bar

All six product-review CQ scores **93 ≥ 75**.
