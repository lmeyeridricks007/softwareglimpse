# SI Priority-2 onboarding — 6sense, Demandbase, Seamless.AI, Clay, Clearbit, Bombora

**Date:** 2026-08-17  
**Scope:** Credibility gaps from [`sales-intelligence-product-coverage.md`](./sales-intelligence-product-coverage.md) Priority 2.  
**Prior:** Priority 1 onboarded in [`si-priority1-onboarding-2026-08-17.md`](./si-priority1-onboarding-2026-08-17.md).

## Products

| Product | Slug | SI overall | CQ product-review | Best rank |
| --- | --- | ---: | ---: | ---: |
| Seamless.AI | `seamless-ai` | 7.4 | **93 / 100** | 3 |
| Clay | `clay` | 7.3 | **93 / 100** | 4 |
| 6sense | `sixsense` | 6.9 | **93 / 100** | 6 |
| Demandbase | `demandbase` | 6.6 | **93 / 100** | 7 |
| Clearbit (HubSpot Breeze Intelligence) | `clearbit` | 6.3 | **93 / 100** | 9 |
| Bombora | `bombora` | 5.3 | **93 / 100** | landscape + decision path only |

Methodology: `sales-intelligence-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded.

Bombora is scored honestly as an **intent-data specialist** (not a contact database) — eligible and in the `intent-abm` landscape bucket, but not in the ranked top list.

## Delivered

- Seed entries in `src/data/seed/software.ts` (published, research complete)
- Research packs under `src/data/research/{slug}/` (sources, fixtures, enrichment, facts)
- Approved SI assessments + product reviews
- Brand logos in `public/brands/`
- Teaching visuals in `public/software/{slug}/` (overview + workflow diagrams)
- Product guide packs (5 kinds × 6) via `product-guide-visuals.ts --si`
- Best Sales Intelligence page: eligible + ranks (Seamless #3, Clay #4, 6sense #6, Demandbase #7, Clearbit #9) + decision paths + `intent-abm` landscape
- 10 approved SI comparisons
- Relationship graph edges for competes-with / alternative-to
- Category `seedProductSlugs` updated
- Official YouTube media wired in enrichment where verified (Clearbit: none in research pass)
- Batch generator: `scripts/onboard-si-priority2-batch.mjs`

## Media / screenshots (follow-up 2026-08-17)

Sourced via approved-asset workflow + official YouTube frame extraction / HubSpot marketing captures:

| Product | Official videos (active) | Vendor-UI screenshots |
| --- | ---: | ---: |
| 6sense | 3 | 3 (CRM Accounts dashboards) |
| Demandbase | 3 | 2 (Account Journey Builder) |
| Seamless.AI | 2 | 3 (Contacts Search, lists, Chrome ext) |
| Clay | 3 | 3 (Claygent workbook / AI panel) |
| Clearbit | 4 | 4 (CRM enrichment + HubSpot Clearbit page UIs) |
| Bombora | 4 | 2 (Company Surge report exports) |

Import script: `scripts/import-si-priority2-official-videos.ts`. Vendor registry entries added for all six products.

## Best-page ranks (SI)

1. Apollo → 2. ZoomInfo → 3. Seamless.AI → 4. Clay → 5. Cognism → 6. 6sense → 7. Demandbase → 8. LinkedIn Sales Navigator → 9. Clearbit → 10. Lusha → 11. Reply → 12. BookYourData → 13. Amplemarket → 14. RocketReach → 15. Kixie

## Comparisons added

sixsense-vs-demandbase, apollo-vs-seamless-ai, apollo-vs-clay, clay-vs-clearbit, lusha-vs-seamless-ai, sixsense-vs-zoominfo, clearbit-vs-lusha, bombora-vs-sixsense, clay-vs-zoominfo, demandbase-vs-zoominfo (slug order may canonicalize)

## Gates / notes

- Onboard status: **review-required** with `RELATIONSHIP_REVIEW` warnings only (same pattern as Priority 1)
- Enterprise ABM (6sense / Demandbase) and Clearbit remain **custom-quote / HubSpot-credit** packaging — no invented seat prices
- Clay publishes Free / Launch (~$167/mo headline) / Growth / Enterprise — confirm live cards before publishing commercial claims
- Seamless.AI Free/Pro/Enterprise — Pro dollars quote-led on public pricing
- Logos are SoftwareGlimpse-generated marks (not official trademark assets) — replace with vendor press-kit logos when available
- No auto-publish to WordPress production; Next.js catalogue is the source of truth until migration cutover

## Quality bar

All six product-review CQ scores **93 ≥ 75**.
