# Pricing engine

## Problem

SaaS pricing is heterogeneous (seats, contacts, usage tiers, add-ons). One universal formula will rot.

## Approach: typed pricing rules

`Pricing` → `plans[]` → `rules[]` as a **discriminated union**:

| Kind | Use |
| --- | --- |
| `flat` | Fixed plan price |
| `per-seat` | Seat × rate (+ minimum seats) |
| `per-unit` | Contacts/messages/etc. |
| `tiered` | Volume tiers |
| `usage` | Metered overage |
| `addon` | Optional add-on |
| `minimum` | Minimum commitment floor |

Schema: `src/domain/schemas/pricing.ts`.

### `amountPeriod` vs `interval`

These are different axes — do not collapse them.

| Field | Meaning |
| --- | --- |
| `amountPeriod` | What the listed **amount** represents (`month` \| `year`) |
| `interval` | **Billing cadence** (`month` \| `year` \| `one-time` \| `custom`) |

Example (Pipedrive Essential fixture):

```text
amountPerSeat=14; interval=month; billingInterval=annual
→ amountPeriod: "month", interval: "year"
```

Semantics in `evaluate-rule.ts`:

- `amountPeriod=month` + `interval=year`: monthly-equivalent rate billed annually  
  - `monthlyEquivalent = amount × seats`  
  - `annualCost = monthlyEquivalent × 12`  
  - no `monthlyCashCost` (customer pays annually)
- `amountPeriod=month` + `interval=month`: monthly cash = amount × seats
- `amountPeriod=year` + `interval=year`: annual = amount × seats; monthly eq = annual ÷ 12

Research normalize (`src/services/research/normalize.ts`) maps fixture `interval` → `amountPeriod` and `billingInterval` → rule `interval`.

## Money model

`src/domain/money.ts`:

- `Money = { amountMinor: number, currency }` — **integer cents** (or minor units) to avoid float drift
- `fromMajor` / `toMajor` at UI boundaries; engine math stays in minor units
- `add` / `multiply` / `formatMoney`

## CRM cost engine (pure)

Location: `src/services/pricing/` — **no React, Next, affiliate, or analytics**.

| Module | Role |
| --- | --- |
| `types.ts` | `PricingSnapshot` (no affiliate) |
| `evaluate-rule.ts` | Single rule → billing + monthly equivalent |
| `plan-cost.ts` | Sum plan rules; free plan = 0; skip addons unless required |
| `plan-resolver.ts` | Minimum suitable plan |
| `eligibility.ts` | `CALCULABLE` \| `PARTIALLY_CALCULABLE` \| `CUSTOM_QUOTE` \| `INSUFFICIENT_DATA` \| `STALE_DATA` |
| `confidence.ts` | Fixture / matrix / staleness caps |
| `calculate.ts` | `calculateProductCost` |
| `compare.ts` | Multi-product sort |
| `build-snapshot.ts` | Software + enrichment → snapshot; `listCrmPricingSnapshots` |

Config: `src/data/config/pricing/crm-pricing-v1.ts` (staleness uses `DEFAULT_FRESHNESS_POLICIES` for `pricing`).

Requirements: `src/domain/schemas/crm-requirements.ts`  
Estimates: `src/domain/schemas/pricing-estimate.ts`

### Calculator composition

```text
CrmRequirements (seats, features, billingPreference)
  → PricingSnapshot[] (primary CRM only)
  → eligibility + plan resolver
  → evaluate rules → Money totals
  → ProductCostEstimate / comparison
```

### Eligible products

- Pool = `primaryCategorySlug === "crm"`
- Pipedrive + Freshsales currently have researched pricing
- Apollo is **sales-intelligence** — excluded from CRM pool
- Close / others without pricing → `insufficient-data`

### Free vs trial

- `plan.isFree` → ongoing cost $0
- `pricing.hasFreeTrial` / `plan.hasFreeTrial` → **does not** zero ongoing cost; emit an assumption note

### Contact sales

Empty rules or `contactSales: true` → `custom-quote`, **never** $0.

## Plan resolution & feature matrix

Current enrichment often has product-level `supported` / `limited` with **empty `planSlugs`**. We do **not** invent plan feature matrices.

When required features are product-supported (or limited) with empty `planSlugs`:

1. Eligible calculable plans = non-empty rules, not contact-sales
2. Pick **lowest monthly-equivalent** among those plans
3. Warning: `feature-plan-matrix-incomplete`
4. Confidence capped at **medium** (also fixture research caps)

Other cases:

| Situation | Result |
| --- | --- |
| Required feature `not-supported` | `no-suitable-plan` |
| Required feature `unknown` | `partial` / unknown-coverage |
| `higher-plan-only` without `planSlugs` | treated as unknown |
| `higher-plan-only` **with** `planSlugs` | restrict to those plans (can reject cheaper tiers) |

## Currency strategy

**Never** sort or rank `$100` as equal/comparable to `€100`.

`compareProductCosts` (`lowest-cost`):

1. Sort calculated/partial **USD** by monthly equivalent
2. Then other currencies (grouped; sorted **within** currency only)
3. Then custom-quote / no-suitable / insufficient

Documented on the comparison `notes` array.

## Confidence

- Fixture research → max **medium**
- Incomplete feature-plan matrix → max **medium**
- Stale pricing (`now` injectable) → further reduction
- Unknown required features → **low**

## CLI

```bash
npm run pricing:crm -- --fixture small-team-automation
npm run pricing:crm -- --users 15 --features workflow-automation,reporting --billing annual
npm run pricing:validate
```

Fixtures: `src/data/pricing/fixtures/`.

## Finder handoff

Map finder answers → CRM requirements:

```ts
crmRequirementsFromFinderAnswers(answers, billingPreference?)
crmRequirementsFromCalculatorInput({ crmUsers, requiredFeatureSlugs, ... })
```

Finder estimates (`pricing-fit.ts`) remain a coarse starting-price heuristic; the cost calculator uses full rule evaluation.

## Provenance

`Pricing.sourceIds` + `verifiedAt` / `domainCheckedAt.pricing` link to research. Stale pricing flips eligibility toward `STALE_DATA` and lowers confidence. Editorial refresh deps include `/tools/crm-cost-calculator/` and `/pricing/[slug]/`.

## Analytics (UI later)

`crm_cost_calculator_started`, `crm_cost_calculator_completed`, `crm_cost_result_viewed`, `crm_cost_product_clicked`, `crm_cost_sort_changed`, `pricing_page_viewed`, `pricing_cta_clicked`.

## UI

See [crm-cost-calculator.md](./crm-cost-calculator.md) for the calculator landing, client app, finder handoff (`sg-crm-finder-v1` / `sg-crm-cost-v1`), and `/pricing/[slug]/` pages.

## What not to do

- Invent prices or plan feature matrices in seeds
- Hardcode Pipedrive math in React components
- Store only a marketing “from $X” without rules if calculators need accuracy
- Treat free trial as free ongoing cost
- FX-normalize or cross-sort currencies

## Phase plan

- Phase 0: schema only ✅  
- Phase 4a: pure evaluators + CRM CLI + tests ✅  
- Phase 4b: CRM cost calculator UI + pricing pages ✅  
- Future: general `software-cost-calculator` reusing the same engine beyond CRM  
