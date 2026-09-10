# Content Distribution System

Transforms **genuine** SoftwareGlimpse research, product testing, and verified pricing changes into channel-specific distribution drafts.

Amplifies original work. **Does not** create generic social filler.

## Never

- Auto-post to any network
- Invent statistics or testing claims
- Distribute LIKELY / REQUIRES_REVIEW price changes as facts
- Put affiliate/ranking lectures on social image pixels
- Use vendor logos or fake scores on visuals

Human approval is mandatory before any post or newsletter send.

There is **no** approved automatic social posting integration in this workflow.

---

## DistributionCampaign

| Field | Meaning |
|---|---|
| `sourceAsset` | Named research/test/pricing asset |
| `keyFinding` | Insight sentence from real data |
| `supportingData` | Labelled figures with sample sizes when applicable |
| `sourceURL` | Canonical SoftwareGlimpse path |
| `publicationDate` | Observation / test / report date |
| `campaignType` | `research_insight` · `verified_price_change` · `product_testing` · `comparison_finding` · `data_insight` |
| `utmCampaign` | Stable UTM campaign id |

Schema: `src/domain/schemas/distribution.ts`

---

## Sources (real only)

| Source | Adapter | Gate |
|---|---|---|
| CRM Pricing Benchmarks | `sources/crm-pricing.ts` | Catalogue metrics via `buildCrmPricingResearchReport` |
| Price changes | `sources/price-changes.ts` | **CONFIRMED** only |
| Product testing | `sources/product-testing.ts` | Completed public hands-on summaries / coverage |

---

## Channel drafts

Generated for each campaign (never posted):

- LinkedIn company
- LinkedIn personal/expert (insight-first; SG attribution secondary)
- Facebook
- Instagram carousel copy + slide outline
- Newsletter block
- Reddit discussion outline (help-first)
- Short-video script

Each draft sets `requiresHumanApproval: true` and `autoPost: false`.

### Personal LinkedIn pattern

Lead with insight → evidence → light attribution. Avoid “Check out my latest blog post.”

---

## Visual specs

`buildVisualSpecs` emits chart / stat card / carousel / comparison specs from **supportingData only**.

On-pixel copy must follow `.cursor/rules/softwareglimpse-social-visuals.mdc` (no affiliate lectures on PNGs).

---

## Newsletter — SoftwareGlimpse Weekly

Sections (omit when empty — no filler):

1. Pricing Changes  
2. One Data Insight  
3. Software Worth Watching  
4. Comparison of the Week  
5. Research Update  

---

## UTM + measurement

`withUtm` / `channelUtm` attach campaign identifiers to source URLs.

Tracking store: `data/distribution/tracking.json`

Measurement fields (sessions, signups, affiliate clicks, engagement) accept **imported** values only. Hints map to first-party events such as `affiliate_clicked` and `newsletter_signup_*` — never invent counts.

---

## CLI

```bash
npm run distribution:pack
npm run distribution:pack -- --no-write --json
npm run distribution:pack -- --no-tracking
```

Writes:

- `data/distribution/latest-pack.json`
- `data/distribution/latest-pack.md`
- `data/distribution/newsletter-weekly.md`

---

## Related

- `docs/research/RESEARCH-PLATFORM.md`
- `docs/pricing/PRICE-MONITOR.md`
- `docs/editorial/PRODUCT-TESTING-SYSTEM.md`
- `docs/authority/` content-promotion plans (where/why — this system drafts copy)
- `docs/marketing/` manual Meta packs

## Code map

```
src/domain/schemas/distribution.ts
src/services/distribution/
  utm.ts drafts.ts newsletter.ts tracking.ts campaign.ts run.ts
  sources/{crm-pricing,price-changes,product-testing}.ts
scripts/distribution-cli.ts
docs/distribution/DISTRIBUTION-SYSTEM.md
```
