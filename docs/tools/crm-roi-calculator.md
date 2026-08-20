# CRM ROI Calculator

Interactive CRM return-on-investment model for SoftwareGlimpse.

**Route:** `/tools/crm-roi-calculator/`  
**Engine:** `src/services/roi/*`  
**UI:** `src/components/roi/*`  
**Schema:** `src/domain/schemas/roi.ts`  
**Methodology:** [`crm-roi-calculator-methodology.md`](./crm-roi-calculator-methodology.md)

## Purpose

Help CRM buyers estimate whether a CRM investment could create enough
**measurable** business value to justify its total cost — without inventing
vendor uplift percentages or treating uncertain benefits as guaranteed.

## Architecture reused

| Concern | Source | How reused |
| --- | --- | --- |
| Money / currency | `src/domain/money.ts` | Minor units + `formatMoney`; no FX |
| Wizard shell | Finder hero / step patterns | Left vertical stepper + sticky live summary |
| Unknown ≠ zero | TCO calculator discipline | `null` costs excluded from known totals |
| Money inputs | `TcoMoneyInput` | Blank → unknown |
| Dynamic tool load | `dynamic-tool-apps.tsx` | `DynamicCrmRoiCalculatorApp` |
| PDF / Excel | Requirements / resource pattern | Dynamic `import("jspdf")` / `import("xlsx")` |
| Cost handoff | Cost Calculator `sg-crm-cost-v1` | Explicit confirm before overwrite |
| Registry / privacy | Tools registry + foundation cookies | `crm-roi-calculator`, `sg-crm-roi-v1` |
| SEO | Cost/TCO page template | `buildPageMetadata`, breadcrumbs, FAQ JSON-LD |

## Steps

1. Current State — headcount, hourly costs (optional), process hours, current software
2. CRM Investment — licences, implementation, recurring, internal labour
3. Productivity Benefits — hours saved + **realization factor** (default 50%)
4. Revenue / Cost Benefits — cost avoidance + optional revenue scenarios
5. Assumptions — register with type / confidence / include toggles
6. Results — dashboard, cash flow, scenarios, sensitivity, break-even, exports

## Persistence

| Key | Role |
| --- | --- |
| `sg-crm-roi-v1` | Full session (Zod-validated) |
| `sg-crm-cost-v1` | Optional import source |
| `sg-crm-roi-business-case-v1` | Confirmed handoff payload for Business Case |

Query `?from=*` is a UX hint only — inputs are never put in the URL.

## Analytics (no financial values)

`roi_started`, `roi_step_completed`, `roi_result_viewed`, `roi_exported`,
`roi_business_case_clicked`, `roi_cost_calculator_imported`, `roi_scenario_changed`

## Exports

- **PDF** — executive 4–6 page summary
- **Excel** — workbook sheets `00_READ_ME` … `10_SENSITIVITY`

## Related links

Cost Calculator · TCO Calculator · Business Case Template · Requirements Builder ·
Finder · Vendor Scorecard · Implementation / Migration planners · ROI / business-case guides
