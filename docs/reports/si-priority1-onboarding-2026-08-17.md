# SI Priority-1 onboarding — ZoomInfo, Cognism, LinkedIn Sales Navigator

**Date:** 2026-08-17  
**Scope:** Credibility gaps from [`sales-intelligence-product-coverage.md`](./sales-intelligence-product-coverage.md) Priority 1 (not previously onboarded).  
**Apollo / Lusha:** already onboarded — skipped.

## Products

| Product | Slug | SI overall | CQ product-review |
| --- | --- | ---: | ---: |
| ZoomInfo | `zoominfo` | 7.6 | **93 / 100** |
| Cognism | `cognism` | 6.9 | **93 / 100** |
| LinkedIn Sales Navigator | `linkedin-sales-navigator` | 6.5 | **93 / 100** |

Methodology: `sales-intelligence-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded.

## Delivered

- Seed entries in `src/data/seed/software.ts` (published, research complete)
- Research packs under `src/data/research/{slug}/` (sources, fixtures, enrichment, facts)
- Approved SI assessments + product reviews
- Brand logos in `public/brands/`
- Teaching visuals in `public/software/{slug}/` (overview + workflow diagrams)
- Product guide packs (5 kinds × 3) with cover/diagram/step visuals under `public/guides/` (via `product-guide-visuals.ts --si`)
- Best Sales Intelligence page: eligible + ranks 2–4 + decision paths + landscape
- 7 approved SI comparisons
- Relationship graph edges for competes-with / alternative-to
- Category `seedProductSlugs` updated
- Official YouTube media wired in enrichment for Cognism (2) and Sales Navigator (1); ZoomInfo had no verified official overview embed in research pass
- Batch generator: `scripts/onboard-si-priority1-batch.mjs`

## Best-page ranks (SI)

1. Apollo → 2. ZoomInfo → 3. Cognism → 4. LinkedIn Sales Navigator → 5. Lusha → … → 10. Kixie

## Comparisons added

apollo-vs-zoominfo, cognism-vs-zoominfo, apollo-vs-cognism, apollo-vs-linkedin-sales-navigator, linkedin-sales-navigator-vs-lusha, linkedin-sales-navigator-vs-zoominfo, cognism-vs-lusha

## Gates / notes

- Content workflows may still request editorial approval for agent drafts; reviews/assessments are already **approved** and score **93**
- `npm run onboard:software` reconcile may warn on fact `extractedAt` (fixed in facts packs) — re-run status if needed
- ZoomInfo main platform pricing remains **custom quote** (no invented seat $); Cognism Sales Prospecting quote-led with CRM Enrichment from **$12,000/yr** published; Sales Navigator Core/Advanced **published** USD starting prices
- Logos are SoftwareGlimpse-generated marks (not official trademark assets) — replace with vendor press-kit logos when available
- No auto-publish to WordPress production; Next.js catalogue is the source of truth until migration cutover

## Quality bar

All three product-review CQ scores **93 ≥ 75**.
