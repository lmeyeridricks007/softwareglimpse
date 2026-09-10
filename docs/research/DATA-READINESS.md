# Research data readiness

Assessment of SoftwareGlimpse structured data for **citation-worthy research** (not blog posts). Statistics may only be published when calculated from stored data with explicit sample size, observation date, and calculation logic.

Generated from live catalogue inspection (2026-09-06).

---

## Datasets inventoried

| Domain | Primary source | CRM completeness | Research-ready? |
|---|---|---|---|
| Products / categories | `Software` catalogue + `primaryCategorySlug` | 37 primary CRM | Yes (universe definition) |
| Pricing plans | Research enrichment `pricing` | 37/37 with plans | Yes |
| Starting prices | `pricing.startingPriceMonthly` | 29 USD with value | Yes (subset) |
| Free plans | `hasFreePlan` / `plan.isFree` | 11 products | Yes |
| Free trials | `hasFreeTrial` | 28 products | Yes |
| Billing cycles | `rules[].interval` month/year | Dense on seat plans | Yes for annual discount pairs |
| Annual discounts | Derived (no stored %) | 15 USD products with month+year seat pair | Yes (n≥5 rule) |
| Features | enrichment `featureSupport` | ~40/40 | Partial (counts OK; not used in v1 report) |
| AI features | enrichment `aiCapabilities` | Present but not SKU-priced | **No** for premiums |
| Company-size suitability | enrichment `editorialFit` | Dense | Editorial only — not a list-price metric |
| Integrations | enrichment `integrationSupport` | ~24/40 sparse | **No** for penetration % |
| Pricing history | `src/data/research/pricing-history/crm.json` | 7 snapshots | Yes as time series (separate page) |

---

## Safe metrics for CRM Pricing Benchmarks 2026

| Metric | Sample | Notes |
|---|---:|---|
| Primary CRM products analyzed | 37 | Catalogue membership |
| USD products with plans | 35 | Currency statistics exclude EUR |
| Median starting price (USD/mo) | 29 | Where `startingPriceMonthly` set |
| Starting price distribution | 29 | Bucketed counts |
| Median entry monthly seat | 18 | Cheapest paid `per-seat` month rule |
| Free plan share | 35 | % of USD-with-plans |
| Free trial share | 35 | % of USD-with-plans |
| Median annual billing discount | 15 | Products with month+year seat pair |

## Not published (insufficient / misleading)

- Market-wide “average CRM price” outside this catalogue
- AI feature premiums (capabilities not reliably tied to priced SKUs)
- Integration penetration percentages
- Company-size price curves (fit tags are editorial, not pricing)
- Backfilled historical averages not in `pricing-history/crm.json`

---

## Pricing history

Current-state `Pricing` and historical `PriceObservation` rows are separate. See [`../pricing/PRICE-HISTORY.md`](../pricing/PRICE-HISTORY.md).

- Legacy CRM starting-price seeds: `pricing-history/crm.json` (7 rows)
- Migrated observation store: `pricing-history/observations/*.json` (append-only)
- Category change analysis requires ≥2 starting-price observations per product — do not invent inflation or AI premiums

---

## Related docs

- [`RESEARCH-PLATFORM.md`](./RESEARCH-PLATFORM.md)
- [`../editorial/EDITORIAL-SYSTEM.md`](../editorial/EDITORIAL-SYSTEM.md)
