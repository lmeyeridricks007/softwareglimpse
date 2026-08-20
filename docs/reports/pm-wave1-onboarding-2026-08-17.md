# Project Management Wave-1 Onboarding

**Date:** 2026-08-17  
**Category:** `project-management`  
**Methodology:** `project-management-editorial` v1.0.0  
**Hands-on testing:** `false`  
**Affiliate economics:** excluded from every score and best-page rank. **No WordPress auto-publish.**

Affiliate Wave-1 products from category seed `seedProductSlugs`. Work Management entity is `monday` — distinct from existing CRM `monday-sales-crm`.

## Products

| Product | Slug | Job cluster | Role | Overall | Entry price (researched) | Pricing confidence | CQ |
| --- | --- | --- | --- | ---: | --- | --- | ---: |
| monday.com (Work Management) | `monday` | work-os | primary | **8.6** | Basic $9/seat/mo annual (3-seat min) + AI credits | high | **91** |
| Hive | `hive` | work-os | primary | **7.6** | Starter $5/user/mo annual (≤10); Teams $12 | high | **91** |
| Office Timeline (Lucen) | `office-timeline` | timeline | primary specialist | **6.5** | Lite $9/user/mo annual (Free add-in) | high | **91** |
| Foxit | `foxit` | document-pdf | adjacent | **5.4** | PDF Editor ~$129.99/user/year (~$10.83/mo) | high | **91** |
| Getscreen.me | `getscreen-me` | remote-access | adjacent | **5.1** | Standard $5/user + $0.10/device | high | **91** |
| WebCatalog | `webcatalog` | desktop-workspace | adjacent | **4.9** | Pro $5/user/mo annual (Basic Free 2 apps) | high | **91** |

### Criterion matrix

| Product | ease | planning | automation | collab | integr | reporting | scale | value | ai | overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| monday | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 7 | 8 | 8.6 |
| hive | 8 | 8 | 8 | 8 | 7 | 7 | 7 | 8 | 7 | 7.6 |
| office-timeline | 8 | 9 | 4 | 6 | 6 | 8 | 5 | 8 | 3 | 6.5 |
| foxit | 8 | 2 | 3 | 5 | 7 | 4 | 8 | 8 | 6 | 5.4 |
| getscreen-me | 9 | 1 | 4 | 5 | 6 | 3 | 7 | 9 | 2 | 5.1 |
| webcatalog | 9 | 2 | 3 | 4 | 6 | 3 | 6 | 9 | 2 | 4.9 |

Weights: ease 12, work-planning 15, automation-workflows 14, collaboration 12, integrations 12, reporting 10, scalability 9, value-for-money 10, ai-capabilities 6.

## Deliverables

| Artifact | Path |
| --- | --- |
| Batch script | `scripts/onboard-pm-wave1-batch.mjs` |
| Shared runtime | `scripts/lib/pm-onboard-runtime.mjs` |
| Compact expand | `scripts/lib/pm-compact-expand.mjs` |
| Product pack | `scripts/lib/pm-wave1-products.mjs` |
| Seed patcher | `scripts/patch-software-seed-pm-wave1.mjs` |
| Seed snippet | `scripts/_pm-wave1-seed-snippet.ts` |
| Comparison specs | `scripts/_pm-wave1-comparisons.json` |
| Official videos | `scripts/_pm-wave1-official-videos.json` — monday (2) + hive (1) wired into enrichment media |
| Lettermarks | `scripts/generate-pm-wave1-lettermarks.mjs` → `public/brands/{slug}.png` |
| Teaching visuals | `scripts/generate-pm-wave1-teaching-visuals.mjs` → `public/software/{slug}/overview.png` + `workflow.png` |
| Research / editorial | `src/data/research/{slug}/`, `editorial/assessments\|reviews/{slug}.json` |
| Soft seeds | `src/data/seed/software.ts` (+6; `monday` ≠ `monday-sales-crm`) |
| Category seed | `src/data/category-onboarding/seed/project-management.ts` (already listed these 6) |
| Affiliates | `programmes.json` + `destinations.json` for all six; partner-links already present |
| Comparisons | 5 `approvedPmPair` entries in `src/data/seed/comparisons.ts` |

## Comparisons added

- `hive-vs-monday` (work-OS peers)
- `monday-vs-office-timeline` (Work OS vs timeline specialist)
- `hive-vs-office-timeline` (Work OS vs timeline specialist)
- `foxit-vs-getscreen-me` (adjacent PDF vs remote)
- `getscreen-me-vs-webcatalog` (adjacent remote vs desktop workspace)

## Pricing grounding (2026-08-17)

| Product | Confidence | Notes |
| --- | --- | --- |
| monday | high | monday.com/pricing Work Management: Free ≤2 seats/3 boards; Basic/Standard/Pro $9/$12/$19 annual + AI credit bundles; 3-seat paid minimum; 14-day Pro trial |
| hive | high | hive.com/pricing: Free ≤10; Starter $5; Teams $12 annual; Enterprise contact; add-ons ~$5; 14-day trial |
| office-timeline | high | officetimeline.com/pricing (Lucen): Free add-in; Lite/Plus/Expert $9/$17/$21 annual |
| foxit | high | foxit.com/pdf-editor/pricing: Editor ~$129.99/user/year; Editor+ ~$159.99/user/year; Free Reader |
| getscreen-me | high | getscreen.me/en/plan/: Free 1 user/≤2 devices; Standard/Advanced/Enterprise $5/$8/$10 user + device fees; Lifetime one-time dollars not invented |
| webcatalog | high | webcatalog.io/pricing: Basic Free 2 apps; Pro $5; Business $8 annual; 7-day trial |

## Cluster rules

- **Work-OS ranks:** monday → Hive (peers only)
- **Landscape / specialist:** Office Timeline (timeline presentation — not work-OS peer)
- **Adjacent landscape:** Foxit (PDF), Getscreen.me (remote), WebCatalog (desktop workspace) — never undifferentiated work-OS ranks

## Quality / gates

- Assessments + reviews: **approved**, `handsOnTesting=false`, methodology `project-management-editorial` v1.0.0
- Product-review CQ: **91** for all six (target ≥75)
- Availability enums: supported | limited | add-on | higher-plan-only | not-supported | unknown only
- Logos: SoftwareGlimpse lettermarks (not scraped trademarks)
- Teaching visuals: educational SVG→PNG diagrams
- No WP auto-publish

## Follow-ups

- Prefer GenerateImage refresh for remaining ~80KB SVG needs/workflow hub diagrams
- Replace lettermarks with vendor press-kit assets only if licensing allows
- Best page + official videos (monday ×2, hive ×1) wired 2026-08-17
- Confirm Lucen Timeline rebrand packaging periodically; Getscreen Personal Lifetime dollar amount when publishing commercial claims
- Motion + non-affiliate landscape peers deferred to a later wave
- No WP auto-publish