# CRM Cost Calculator

Interactive seat/capability cost estimates for primary CRM products.

**Route:** `/tools/crm-cost-calculator/` (indexable landing + client app)  
**Engine:** [`pricing-engine.md`](./pricing-engine.md) · `src/services/pricing/*`  
**UI:** `src/components/pricing/*`, `src/app/tools/crm-cost-calculator/page.tsx`

## Inputs

| Field | Notes |
| --- | --- |
| CRM users | Seat count (1–5000 in UI) |
| Required capabilities | Canonical CRM feature slugs — same list as CRM Finder `CAPABILITY_OPTIONS` |
| Billing preference | `monthly` \| `annual` \| `either` (show both) |

Mapped to shared `CrmRequirements` via `crmRequirementsFromCalculatorInput`.

## Finder handoff

1. CRM Finder persists answers (+ optional `resultOrder`) in `localStorage` key `sg-crm-finder-v1`.
2. Cost calculator reads that key on mount and prefills users/features.
3. Banner: “Using requirements from CRM Finder” with clear option.
4. `?from=finder` is a UX hint only — **canonical URL stays** `/tools/crm-cost-calculator/`. Requirements are **not** put in the query string (privacy).
5. Calculator draft persists separately: `sg-crm-cost-v1`.

## Results

Per product (`ProductCostEstimate`):

- Status: `calculated` | `partial` | `custom-quote` | `insufficient-data` | `no-suitable-plan`
- Recommended plan, monthly equivalent, annual cash, optional monthly cash
- Components, assumptions, warnings, confidence, pricing verified date
- Sort: Lowest cost | Catalogue order | Finder order (when `resultOrder` stored)

UI (decision-tool redesign):

- Live hero preview + sticky estimate with catalogue cost range
- Results summary KPIs, horizontal cost comparison chart, value matrix
- Compact product cards, team-size explorer (engine re-runs at seat presets)
- Deterministic buyer insights + methodology / confidence tooltips

Never fabricates prices. Multi-currency groups are labeled; `$` is never treated as `€`.

## Server vs client

| Layer | Responsibility |
| --- | --- |
| Server `page.tsx` | Indexable methodology, JSON-LD, `listCrmPricingSnapshots()` (affiliate stripped) |
| Client `CostCalculatorApp` | Wizard, localStorage, pure `compareProductCosts` |
| Shared `@/services/pricing` | Deterministic evaluation (no I/O, no affiliate, no FX) |

Same pattern as CRM Finder snapshots + client scoring.

## Product pricing pages

`/pricing/[slug]/` for CRM products where `canCalculatePricing` ≠ `INSUFFICIENT_DATA` (today: Pipedrive, Freshsales when plans exist).

- Title: `{Name} Pricing: Plans, Costs & What You'll Actually Pay`
- Fixture research → **noindex** until live verification; still render with trust note
- Plans table, example costs for 5/10/25/50 users, calculator CTA

Index: `/pricing/` lists calculable product pages.

## Site integrations

- CRM hub Tools: Find My CRM + Compare CRM Costs
- CRM product pages: Calculate CTA when calculable
- Comparisons: compact 15-user costs when both calculable
- Best CRM + Finder results + tools index + `relatedToolPaths` / software-links

## Analytics

`crm_cost_calculator_started`, `crm_cost_calculator_completed`, `crm_cost_result_viewed`, `crm_cost_product_clicked`, `crm_cost_sort_changed`, plus `pricing_page_viewed` / `pricing_cta_clicked` helpers.
