# IT web-data peers — Oxylabs, ScraperAPI, Apify, ThorData

**Date:** 2026-08-18  
**Scope:** Web-data / proxy peers of Bright Data from [`it-development-product-coverage.md`](./it-development-product-coverage.md).  
**No WordPress auto-publish.** Editorial gates cleared in Next.js seed only.

Related: [`ai-it-priority3-onboarding-2026-08-18.md`](./ai-it-priority3-onboarding-2026-08-18.md) · [`it-development-product-coverage.md`](./it-development-product-coverage.md)

## Summary

| Product | Slug | Overall | Role |
| --- | --- | ---: | --- |
| Bright Data | `bright-data` | **7.7** | **Cluster award (unchanged)** |
| Oxylabs | `oxylabs` | **7.7** | Enterprise proxy / scraper-API peer (tie — award stays with Bright Data) |
| Apify | `apify` | **7.5** | Actor-platform / compute path |
| ScraperAPI | `scraperapi` | **7.3** | Managed scraping-API / credit path |
| ThorData | `thordata` | **6.8** | Budget pack peer — **affiliate identity resolved** |

**Cluster rule:** same `web-data-collection` job — different shapes (proxy estate vs credit API vs Actors vs budget packs). Never rank against Plesk, Datadog, or GitHub as peers.

## ThorData decision

Previously `REVIEW_REQUIRED` (`aff-thordata`) for **low-confidence identity** only. First-party pricing on thordata.com/pricing confirms residential/datacenter/mobile proxies plus scraper/SERP/unlocker/browser lines. Onboarded as `thordata` with catalogue mapping updated to **onboarded**. Affiliate economics remain excluded from scores.

## Pricing grounding (2026-08-18)

| Product | Confidence | Published floor |
| --- | --- | --- |
| Oxylabs | high | Residential Starter 5GB **$30/mo** ($6/GB); Web Scraper API from **$49/mo**; datacenter free trial |
| ScraperAPI | high | Free **1,000** credits; Hobby **$49/mo** ($44.10 annual); 7-day trial 5,000 credits |
| Apify | high | Free **$5** usage; Starter **$29/mo** ($26 annual); Scale $199; Business $999 |
| ThorData | high (packs) | Residential from **$2/GB** (1GB pack); volume and API credit packs on pricing page |

## Comparisons added (6)

- bright-data-vs-oxylabs  
- apify-vs-bright-data  
- bright-data-vs-scraperapi  
- bright-data-vs-thordata  
- oxylabs-vs-scraperapi  
- apify-vs-oxylabs  

## Deliverables

- Research + approved assessments/reviews under `src/data/research|editorial/`
- Seed entries in `software.ts` (+4)
- Best IT page: eligible slugs + web-data award rationale updated
- Category `seedProductSlugs` + activated JSON
- Product-guide primaries: `oxylabs`, `scraperapi`, `apify`, `thordata` (5-kind packs; 120 SVG v3 PNGs)
- Lettermarks: `public/brands/{oxylabs,scraperapi,apify,thordata}.png`
- Screenshots: OG for Oxylabs / ScraperAPI / Apify; ThorData **original-diagram** teaching overview (vendor OG unavailable)
- Official YouTube: Oxylabs `0rULasZsV3M` (author Oxylabs). ScraperAPI / Apify / ThorData — no allowlisted embed wired in this pass
- CORE what-is IT copy names the new peers
- Batch: `scripts/onboard-it-webdata-peers-batch.mjs` + `scripts/lib/it-webdata-peers-products.mjs`

## Quality / gates

- Reviews **approved**, `handsOnTesting=false`
- Affiliate economics excluded (incl. `aff-thordata` / `aff-bright-data`)
- **No WordPress publish**
- Bright Data remains award on the Oxylabs tie

## Follow-ups

1. Official YouTube embeds for ScraperAPI, Apify, ThorData when vendor-channel oEmbed matches  
2. Replace ThorData teaching overview with vendor OG/UI when available  
3. Smartproxy / other proxy brands only if explicitly requested  
4. Cloudways / WP Engine still deferred (hosting *providers*, not panels)  
5. GenerateImage `-v4` teaching packs for web-data product guides  
