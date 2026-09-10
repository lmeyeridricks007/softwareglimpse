# SoftwareGlimpse Research Platform

The Research section publishes **original analysis derived from SoftwareGlimpse structured data**.

It is **not** a generic blog. Every statistic must be calculated from stored data and must record:

- dataset
- sample size
- observation date
- methodology
- calculation logic

Never invent market averages, surveys, or backfilled history.

---

## Public routes

| Path | Role |
|---|---|
| `/research/` | Research hub (Latest, Pricing Intelligence, Categories, Methodology, Reports) |
| `/research/crm-pricing/` | Flagship: CRM Pricing Statistics & Benchmarks 2026 |
| `/research/crm-pricing/download/` | Public aggregated CSV |
| `/research/crm-pricing-history/` | Verified starting-price time series (collecting) |

---

## Flagship report

**CRM Pricing Statistics & Benchmarks 2026**

Built by `buildCrmPricingResearchReport()` from primary CRM enrichment pricing:

- product counts
- median starting price (USD)
- median entry monthly seat price
- free plan / free trial share
- median annual billing discount (where month+year seat pairs exist)
- starting price distribution chart
- product table + CSV

Omitted when unsupported: AI premiums, integration penetration, invented market averages.

---

## Charts

`ResearchBarChart` — accessible horizontal bars with source, sample size, observation date.

`ResearchStatGrid` — labeled metrics with n=.

---

## Methodology & citation

Every report includes Methodology (collection, sample, logic, limitations, last updated) via `ResearchMethodologySection`.

Citation block: `ResearchCitationBlock` — suggested attribution without required backlinks.

---

## SEO

- Unique title / description / canonical via `buildPageMetadata`
- `Article` + `Dataset` JSON-LD (`articleJsonLd`, `datasetJsonLd`)
- Author/editor from founder when configured
- `datePublished` / `dateModified` from observation date
- Sitemap + `llms.txt` entries

---

## Internal linking

- CRM software pages: related resources → benchmarks + history
- CRM category/hub and cost/TCO tools: recommended next step → benchmarks
- Eligibility allowlist includes `/research/` routes

Research pages link back to category hub, Best CRM, Finder, Cost Calculator.

---

## Code map

```
docs/research/DATA-READINESS.md
docs/research/RESEARCH-PLATFORM.md
src/services/research-reports/crm-pricing-report.ts
src/components/research/research-bar-chart.tsx
src/components/research/research-stat-grid.tsx
src/components/research/research-citation-block.tsx
src/components/research/research-methodology-section.tsx
src/app/(site)/research/page.tsx
src/app/(site)/research/crm-pricing/page.tsx
src/app/(site)/research/crm-pricing/download/route.ts
src/seo/structured-data.tsx  (datasetJsonLd)
```

---

## Expanding research

1. Confirm readiness in `DATA-READINESS.md` for the new category/metric.
2. Add a calculator in `src/services/research-reports/`.
3. Publish only metrics with explicit n and logic.
4. Wire hub cards, sitemap, llms.txt, and eligibility paths.
