# Price history

SoftwareGlimpse separates **current pricing** (`Pricing` on enrichment / catalogue) from **historical price observations** (`PriceObservation`).

Never overwrite historical observations. Never invent backfilled prices.

---

## Concepts

| Concept | Meaning |
|---|---|
| Current pricing | Live `Pricing` envelope used by calculators, cards, reviews |
| Price observation | Point-in-time list-price row for a product/plan/billing axis |
| Series | Timeline keyed by product + plan + metric + billing period + basis |
| Material change | Difference in price, currency, period, basis, per-user, or minimum users |

`PricingSnapshot` in `services/pricing` remains a **live** calculator view — not history.

---

## PriceObservation fields

Defined in `src/domain/schemas/price-observation.ts`:

- `productId`, `planId` (nullable for product-level starting price)
- `observedAt`, `price`, `currency`
- `billingPeriod` (`month` \| `year` \| `one-time` \| `custom`)
- `billingBasis` (`per-user` \| `flat-rate` \| `usage-based` \| `custom` \| `contact-sales`)
- `perUser`, `minimumUsers`
- `source`, `sourceIds`, `verificationMethod`, `confidence`, `notes`
- `metricKind`: `starting-price` \| `plan-list` \| `rule`

---

## Storage

```
src/data/research/pricing-history/
  crm.json                          # legacy CRM starting-price seeds (kept)
  observations/{productId}.json     # append-only PriceObservation files
```

Append only. Existing rows are never mutated.

---

## Snapshot on verify / refresh

`snapshotPricingHistory()` / `recordPriceObservations()`:

1. Extract candidates from current `Pricing`
2. Compare fingerprint with latest observation in the same series
3. Append only on material change (or `forcePeriodic: true`)
4. Preserve all previous observations

Wired from research merge when canonical pricing is written (`merge.ts`).

---

## Change calculation

`calculatePriceChange(previous, current)` returns:

- previous / new price
- absolute + percentage change
- change date
- affected plan

`analyzeCategoryPriceChanges(categorySlug)` supports research: increases, decreases, same-price re-observations. Requires ≥2 starting-price observations — otherwise empty (no invented inflation).

---

## Product pages

`buildProductPriceHistorySummary(productId)` feeds the hub Pricing tab via `SoftwarePriceHistoryPanel`.

**UI rule:** show history only when a series has ≥2 observations. A single migration seed is not “history.”

---

## Research

- `/research/crm-pricing-history/` reads `listCrmStartingPriceHistory()` (observations preferred, crm.json fallback)
- Change summary panel when sample supports it
- Hub Pricing Intelligence card shows observation counts + change sample size

Future-ready (when more dated re-verifies exist): category inflation, AI premium deltas, annual discount changes — **only from observation pairs**, never invented.

---

## Migration

```bash
npm run pricing:history:migrate
npm run pricing:history:validate
```

1. Import legacy `crm.json` rows as `verificationMethod: legacy-crm-history` (preserve dates; allow same-price re-verifies)
2. For products with current `Pricing` and **empty series**, seed first observation as `migration-from-current`
   - Cutover date constant: `2026-09-06` when `verifiedAt` missing
   - Notes explicitly mark migration seed

Does **not** invent prices before the earliest real observation.

---

## Services (reuse)

`src/services/pricing-history/` — consumed by reviews, research, merge, monitoring CLIs.

Do not duplicate change math in UI or research pages.

---

## Related

- `docs/softwareglimpse/pricing-engine.md` — current-state cost engine
- `docs/research/DATA-READINESS.md` — research metric gates
- `docs/research/RESEARCH-PLATFORM.md` — research hub
- [`PRICE-MONITOR.md`](./PRICE-MONITOR.md) — change detection, refresh, editorial candidates
