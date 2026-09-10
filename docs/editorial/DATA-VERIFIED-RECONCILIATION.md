# DATA_VERIFIED reconciliation

Generated with Growth Dashboard 2.3.0 at 2026-09-09T18:59:14.406Z.

## Counts

| Metric | Value |
| --- | ---: |
| Total products | 315 |
| Accepted DATA_VERIFIED stamps | 164 |
| Rejected (not data verification) | 151 |
| Source coverage (accepted share) | 52.1% |
| Reconciliation confidence | low |

## Accepted by source

- `software.pricingVerifiedAt`: 0
- `software.pricing.verifiedAt`: 0
- `enrichment.pricing.verifiedAt`: 164
- `none`: 151

## Accepted by source type

- `editorial_catalogue`: 0
- `vendor_enrichment`: 164
- `invalid_or_absent`: 151

## Reject reasons

- `matches_domain_checked_at`: 138
- `matches_enrichment_updatedAt`: 11
- `mass_identical_stamp`: 1
- `no_timestamp`: 1

## Suspicious mass dates (rejected candidates)

- 2026-08-18: 64 products
- 2026-08-17: 58 products

## Mass identical ISO stamps (backfill signal)

- `2026-08-18T12:00:00.000Z`: 23 products
- `2026-08-17T20:00:00.000Z`: 18 products
- `2026-08-18T14:00:00.000Z`: 13 products
- `2026-08-19T12:00:00.000Z`: 12 products
- `2026-08-17T17:00:00.000Z`: 9 products
- `2026-08-18T22:00:00.000Z`: 8 products
- `2026-08-18T16:00:00.000Z`: 7 products
- `2026-08-16T12:00:00.000Z`: 6 products
- `2026-08-17T18:00:00.000Z`: 6 products
- `2026-08-18T09:30:00.000Z`: 6 products
- `2026-08-17T15:00:00.000Z`: 5 products
- `2026-08-17T12:00:00.000Z`: 4 products

## Accepted examples (evidence trace)

- **pipedrive**: field `enrichment.pricing.verifiedAt` · 2026-09-08T21:28:13.721Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **freshsales**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:40:42.436Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **close**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:40:45.585Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **salesflare**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:41:25.924Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **folk**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:41:03.339Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **keap**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:40:24.416Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **streak**: field `enrichment.pricing.verifiedAt` · 2026-09-08T21:28:36.429Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **capsule**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:40:22.766Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **apollo**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:41:27.237Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **lusha**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:40:58.058Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **rocketreach**: field `enrichment.pricing.verifiedAt` · 2026-09-09T06:31:33.141Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`
- **amplemarket**: field `enrichment.pricing.verifiedAt` · 2026-09-07T22:41:28.552Z · source `enrichment.pricing.verifiedAt` (vendor_enrichment) · method `enrichment_pricing_with_sources`

## Policy

Accepted: `software.pricingVerifiedAt`, `software.pricing.verifiedAt`, or enrichment `pricing.verifiedAt` with `sourceIds` that is **not** an updatedAt/generatedAt twin, not equal to any `domainCheckedAt` research clock, and not a mass-identical ISO shared by ≥3 products.

Rejected (never auto DATA_VERIFIED): file mtime, generatedAt, migration/build/import/content-generation/backfill timestamps, enrichment.updatedAt twins, domainCheckedAt clocks, mass identical stamps.

Full per-product traces: `data/seo/data-verified-reconciliation.json` → `traces[]`.
