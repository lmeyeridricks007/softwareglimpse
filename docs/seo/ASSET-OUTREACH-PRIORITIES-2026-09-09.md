# Asset outreach priorities — DRAFT ONLY (2026-09-09)

**Authority / backlink measurement: `NOT_CONNECTED`.** No REAL Ahrefs/Semrush export is on disk. Domain-gap prospects are empty until a REAL CSV/JSON is imported. This list prioritizes **existing SoftwareGlimpse assets** for human outreach drafts.

Do **not** count these as earned links. Do **not** auto-send.

Source: `data/seo/link-opportunities.json` → `assetOutreachPriorities`  
Engine: link-opportunity 1.3.0

## How to activate REAL authority metrics

1. Drop Ahrefs/Semrush export at `data/seo/imports/ahrefs/` (or `semrush/` / `backlinks/`)
2. Filename must not contain `sample|fixture|example|demo|test`
3. `npm run seo:link-opportunities && npm run seo:growth-dashboard`
4. Confirm `authority.validity === "REAL"`

See `docs/seo/BACKLINK-AUTHORITY-REAL-EXPORT.md`.

## Metrics (blocked — NOT_CONNECTED)

| Metric | Value |
| --- | --- |
| Referring domains | — |
| Backlinks | — |
| Linked URLs | — |
| Top referring domains | — |
| Topical relevance | — |
| New / lost links | — |
| Links → research | — |
| Links → commercial | — |

## Priority mix

| Priority | Count |
| --- | ---: |
| HIGH | 20 |
| MEDIUM | 12 |
| LOW | 8 |

### HIGH (20)

| Asset | Theme | Topical | Likelihood | Draft angle |
| --- | --- | ---: | ---: | --- |
| `/research/crm-pricing/` | crm_pricing_research | 90 | 99 | Citeable CRM pricing benchmarks (methodology, not ranking) |
| `/research/crm-pricing-history/` | pricing_history | 88 | 96 | Verified CRM starting-price history |
| `/tools/crm-cost-calculator/` | calculator | — | — | Free calculator citation |
| `/tools/crm-migration-cost-calculator/` | calculator | — | — | Free calculator citation |
| `/tools/crm-tco-calculator/` | calculator | — | — | Free calculator citation |
| `/tools/crm-finder/` | tool | — | — | Interactive finder / resource-page inclusion |
| `/tools/crm-implementation-planner/` | tool | — | — | Interactive planner citation |
| `/tools/crm-migration-planner/` | tool | — | — | Interactive planner citation |
| `/tools/crm-vendor-scorecard/` | tool | — | — | Scorecard citation |
| (+ other CRM tools in JSON) | tool | — | — | See `assetOutreachPriorities` |

Full rows (all priorities): `data/seo/link-opportunities.json` and `docs/seo/WEEKLY-LINK-OPPORTUNITIES.md`.

### Classification rules (assets)

| Priority | Meaning |
| --- | --- |
| HIGH | CRM pricing research / history, or strong CRM tools/calculators/guides |
| MEDIUM | Other category calculators / tools (top slice) |
| LOW | Remaining lower-likelihood category tools |

Prospect-type hints (not domains): JOURNALIST, DATA_CITATION, RESOURCE_PAGE, SAAS_PUBLICATION, etc.

### Related draft domain opportunities (not from Ahrefs)

Older live-search earned-opportunity drafts live in `docs/authority/EARNED-BACKLINK-OPPORTUNITIES-LATEST.md` (Aug 2026). Map score bands: EXCELLENT/STRONG → treat as HIGH draft priority, GOOD → MEDIUM, LOW → LOW. Those are **still drafts**, not earned links, and do not activate dashboard `REAL` authority.

## Compliance

- No automatic outreach
- No link buying / PBNs / directory spam
- Human approval required before any send
- Record `LINK_EARNED` only when a real link is observed
