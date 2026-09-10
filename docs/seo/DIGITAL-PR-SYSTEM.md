# Digital PR & Backlink Opportunity System

Legitimate editorial link earning for SoftwareGlimpse through useful research, data, tools, and expert resources.

**This is not an automated spam or link-buying system.**

## Never

- buy links
- create fake websites or profiles
- mass-submit directories
- generate comment or forum spam
- participate in PBNs
- automate unsolicited bulk email
- invent Ahrefs/Semrush metrics
- send outreach without human approval

---

## Outputs

| Artifact | Path |
|---|---|
| System doc | `docs/seo/DIGITAL-PR-SYSTEM.md` (this file) |
| Weekly report | `docs/seo/WEEKLY-LINK-OPPORTUNITIES.md` |
| Machine JSON | `data/seo/link-opportunities.json` |
| Tracking store | `data/seo/link-outreach-tracking.json` |
| Import drop folders | `data/seo/imports/ahrefs/`, `semrush/`, `backlinks/` |

---

## Phases implemented

### Import validation (production)

Rejects **example domains**, **fixture exports**, **sample files**, and **test data** from production opportunity reports. Discovery selects the newest **REAL** file under `data/seo/imports/ahrefs|semrush|backlinks/` and records filename, provider, export date, row count, and metrics available.

### Prospect quality

Excludes scraper/spam/PBN-like domains, irrelevant directories, casino/adult/pharma verticals, and domains with no topical relevance. Outreach drafts are generated **only for QUALIFIED** prospects and are never auto-sent.

### Dashboard

Only **REAL** prospects count toward authority metrics. Fixture/sample prospect count must be **0** in production status.

### 1. Linkable asset inventory

`inventoryAndScoreLinkableAssets()` wraps the authority linkable inventory (tools, resources, guides, research) and scores:

- uniqueness
- data depth
- freshness
- citation value
- journalist usefulness
- SEO relevance

Research assets include `/research/crm-pricing/`, `/research/crm-pricing-history/`, methodology, and how-we-review.

### 2. Competitor link gap

Curated pairs: `src/data/config/seo/digital-pr-competitor-pairs.ts`.

Import Ahrefs/Semrush/other CSV or JSON exports into `data/seo/imports/**`. The engine calculates:

- domains linking to competitors
- domains not linking to SoftwareGlimpse
- competitor count receiving links
- topical relevance
- authority averages **only when supplied**
- opportunity score

Without an export, gaps report honest “import required” notes — **zero fabricated RDs**.

### 3. Prospect types

`JOURNALIST` · `SAAS_PUBLICATION` · `BUSINESS_PUBLICATION` · `BLOG` · `CONSULTANT` · `NEWSLETTER` · `RESOURCE_PAGE` · `DATA_CITATION` · `PODCAST` · `ACADEMIC` · `OTHER`

### 4. Opportunity score

Weights **topical relevance and asset fit above raw authority**. Traffic/DR/DA used only when present in exports.

### 5. Pitch angle

For each prospect: why relevant, asset fit, triggering competitor URL, suggested angle, personalization **evidence only**, outreach approach. No invented personalization.

### 6. Outreach draft

Optional short draft marked “not sent”. **Human approval mandatory. Never auto-send.**

### 7. Tracking statuses

`IDENTIFIED` · `QUALIFIED` · `CONTACTED` · `REPLIED` · `LINK_EARNED` · `DECLINED` · `NO_RESPONSE` · `NOT_RELEVANT`

Track target URL, earned link, date, asset, relationship notes via `upsertDigitalPrTracking`.

### 8. Weekly report

```bash
npm run seo:link-opportunities
npm run seo:link-opportunities -- --export src/data/seo/fixtures/backlink-export-sample.csv
npm run seo:link-opportunities -- --no-write --json
```

Sections: Top 20 prospects, Best linkable assets, Competitor link gaps, Research outreach opportunities, Existing outreach status, Links earned.

---

## Related authority stack

Deeper Digital PR / earned-link agents already live under:

- `src/services/authority-intelligence/`
- `docs/authority/`
- `npm run authority:pr` / `authority:links`

This SEO engine adds **export ingest + weekly SEO-facing report** without replacing those agents.

---

## Code map

```
src/services/seo/link-opportunity/
  types.ts assets.ts ingest.ts gap.ts classify.ts
  prospects.ts tracking.ts analyze.ts report.ts
scripts/seo/analyze-link-opportunities.ts
src/data/config/seo/digital-pr-competitor-pairs.ts
```
