# Software Price Change Monitor

Identifies meaningful differences between **current catalogue `Pricing`** and the latest **`PriceObservation`** series, then turns verified changes into:

1. data updates (observation append — CONFIRMED only, opt-in)
2. page refresh candidates
3. research signals
4. editorial opportunities (candidates only — never auto-publish)

**Do not trust scraped differences automatically.** Unverified claims must not be published.

---

## Confidence

| Verdict | Meaning |
|---|---|
| `CONFIRMED` | Deterministic verified list-price source, bounded numeric delta, no verify-live |
| `LIKELY` | Material diff without highly deterministic verification |
| `REQUIRES_REVIEW` | Structural / large / currency / free-tier / AI / contact-sales / verify-live |
| `NO_CHANGE` | Fingerprints match or insufficient history |

Large moves (≥15% or ≥$10) and structural changes always require human verification before public claims — even with a deterministic source.

---

## Monitoring queue

`buildPriceMonitorQueue()` ranks products using:

- SEO opportunity + impressions (GSC when `data/seo/gsc-opportunities.json` exists)
- comparison frequency
- affected page count
- commercial (affiliate)
- category importance
- prior observation volatility

Frequencies: **HIGH** / **MEDIUM** / **LOW**.

---

## Change kinds detected

- plan price increase / decrease
- new / removed plan
- free plan added / removed
- billing model changed
- annual discount changed
- AI add-on introduced / AI pricing changed
- contact-sales conversion
- starting price changed

---

## Impact graph

`resolvePriceChangeImpactPages(productId)` covers:

- software review, pricing page
- comparisons, alternatives, best guides
- calculators / tools
- research hub + CRM pricing reports
- category pages

CONFIRMED → `recordChangeEvent(domain: pricing)` → refresh candidates via existing publishing rules. Also marks editorial `refreshNeeded` when a review exists.

---

## Growth / organic integration

There is no separate “Organic Growth Agent” ID. The monitor feeds:

1. **`data/pricing/price-change-growth-signals.json`** — outdated pricing risk per path
2. **`scanRefreshCandidates`** — merges signals so ranking pages with outdated pricing get **increased refresh priority**
3. Publishing change events (CONFIRMED) for the standard refresh pipeline (`refresh:scan` / `refresh:run`)
4. **AI Visibility** (`data/seo/ai-visibility.json` via `npm run seo:ai-visibility`) — citation summary embedded in GSC / TOP-20 growth reports when present (measurement only)

---

## Editorial candidates

Noteworthy changes produce titles like:

> Vendor X changed pricing — what changed and who is affected?

`publishStatus: "candidate"` only. **Do not auto-publish.**

---

## Verify first

`REQUIRES_REVIEW` and `LIKELY` changes stay **unpublished** until a human confirms them.

Each run writes:

- `data/pricing/verification-tasks.json`
- `docs/pricing/PRICING-VERIFICATION-TASKS.md`

Task fields: source, current stored pricing (observations), detected catalogue pricing, difference, affected plans, affected pages (ordered).

```bash
npm run pricing:confirm -- --task <id>
npm run pricing:confirm -- --reject --task <id>
```

## After confirmation

`confirmPricingVerificationTask`:

1. appends `PriceObservation`
2. stamps canonical enrichment `pricing.verifiedAt`
3. records a publishing change event
4. emits refresh candidates in dependency order
5. keeps `OUTDATED_PRICING` marks until pages are refreshed

## Refresh dependency order

1. software pricing source (canonical stamp)
2. pricing page
3. software review
4. cost calculator
5. comparisons
6. best / category / alternatives
7. research aggregates

## Stale content marking

Dependent pages receive `OUTDATED_PRICING` (`data/pricing/outdated-pricing.json`). Pricing pages surface this via `PricingFreshness` — stale values are not shown without a visible freshness state.

---

## CLI

```bash
npm run pricing:monitor
npm run pricing:monitor -- --limit 30
npm run pricing:monitor -- --apply-confirmed
npm run pricing:monitor -- --apply-confirmed --append-observations
npm run pricing:confirm -- --task <id>
```

Default run writes:

- `docs/pricing/WEEKLY-PRICE-CHANGES.md`
- `data/pricing/price-change-growth-signals.json`
- `data/pricing/verification-tasks.json`
- `docs/pricing/PRICING-VERIFICATION-TASKS.md`
- `data/pricing/outdated-pricing.json`

`--apply-confirmed` records publishing events + refresh tasks.  
`--append-observations` also appends `PriceObservation` rows (still never overwrites history).

---

## Code map

```
src/domain/schemas/price-change-monitor.ts
src/services/price-change-monitor/
  queue.ts
  detect.ts
  confidence.ts
  impact.ts
  editorial.ts
  growth-feed.ts
  verification-task.ts
  stale-marking.ts
  refresh-order.ts
  confirm.ts
  consistency.ts
  report.ts
  run.ts
scripts/price-change-monitor-cli.ts
docs/pricing/WEEKLY-PRICE-CHANGES.md
docs/pricing/PRICING-VERIFICATION-TASKS.md
docs/pricing/PRICE-MONITOR.md
```

---

## Related

- [PRICE-HISTORY.md](./PRICE-HISTORY.md) — observation store
- Publishing refresh: `docs/softwareglimpse/publishing-engine.md`
- Research: `docs/research/RESEARCH-PLATFORM.md`
