# CRM Migration Cost Calculator

Interactive CRM migration cost model for SoftwareGlimpse.

**Route:** `/tools/crm-migration-cost-calculator/`  
**Engine:** `src/services/migration-cost/*`  
**UI:** `src/components/migration-cost/*`  
**Schema:** `src/domain/schemas/crm-migration-cost.ts`  
**Tool ID:** CRM-TOOL-015

## Purpose

Help CRM buyers estimate the likely cost of moving from spreadsheets, an
existing CRM, or fragmented systems into a new CRM — without inventing
industry-average prices or treating vendor “free migration” as a full project.

## Architecture reused

| Concern | Source | How reused |
| --- | --- | --- |
| Money / currency | `src/domain/money.ts` | Minor units + `formatMoney`; no FX |
| Unknown ≠ zero | TCO / ROI discipline | `null` costs excluded from known totals |
| Money inputs | `TcoMoneyInput` | Blank → unknown |
| Number inputs | `RoiNumberInput` | Empty-friendly entry |
| Wizard shell | ROI 3-column layout | Left stepper + center + sticky live summary |
| Delayed results | `useDelayedResultsReveal` | ~1.5s loading before results |
| Dynamic tool load | `dynamic-tool-apps.tsx` | `DynamicCrmMigrationCostCalculatorApp` |
| PDF / Excel | ROI export pattern | Dynamic `jspdf` / `xlsx` |
| Registry / privacy | Tools registry + foundation cookies | `sg-crm-migration-cost-v1` (+ handoff keys) |
| SEO | ROI/TCO page template | Metadata, breadcrumbs, FAQ + WebApplication JSON-LD |

## Steps

1. Current system — source, target, users, deadline, migration type
2. Data scope — object inventory, history, attachments
3. Data quality — issue severity, owner, hours/quotes
4. Mapping & transformation — counts + Field Mapping import
5. Integrations & customization — rebuild inventory + custom work
6. Migration approach — performer, quotes, tooling, partner comparison
7. Internal effort — roles × hours × loaded cost (or totals)
8. Testing & cutover — test cycles, cutover, hypercare, training, contingency
9. Results — dashboard, drivers, scenarios, exports, handoffs

## Persistence

| Key | Role |
| --- | --- |
| `sg-crm-migration-cost-v1` | Full session (Zod-validated) |
| `sg-crm-migration-plan-v1` | Optional field-mapping import source |
| `sg-crm-readiness-assessment-v1` | Optional readiness warnings |
| `sg-crm-migration-cost-tco-handoff-v1` | Confirmed TCO / Cost handoff |
| `sg-crm-migration-cost-roi-handoff-v1` | Confirmed ROI handoff |
| `sg-crm-migration-cost-business-case-v1` | Confirmed Business Case handoff |

Query `?from=*` is a UX hint only — inputs are never put in the URL.

## Formulas (high level)

- **External** = sum of known partner quotes, rate × days, integration costs, cleansing quotes, test/cutover/hypercare external lines
- **Internal** = people × hours × loaded hourly cost **or** user-entered totals (never invented salaries)
- **Tooling** = one-time + monthly × duration rows + license line
- **Contingency** = user % applied only to selected buckets (external / internal / tooling); default **0%**
- **Optional downtime** = hours × users × impact — scenario only, excluded from base total
- **Ranges** = only when user supplies low/expected/high — never manufactured ±%
- **Complexity** = deterministic band from sources, volume, quality, history, attachments, mapping, integrations, customization, testing — **never converted to euros**

## Cost categories

A Discovery · B Data preparation · C Mapping · D Integrations/customization ·  
E Migration execution · F Testing · G Internal labour · H Training ·  
I Cutover & hypercare · J Tooling · K Contingency · Optional scenario

## Integrations

| Direction | Behaviour |
| --- | --- |
| Field Mapping / Migration Planner → this tool | Confirm import of mapping counts |
| This tool → TCO / Cost Calculator | Confirm handoff payload |
| This tool → ROI | Confirm; warn on double-count with TCO |
| This tool → Business Case | Confirm summary handoff |
| Readiness Assessment → this tool | Soft warnings only |

## Analytics (no financial values / system names / record counts)

`crm_migration_cost_started`, `migration_source_selected`,
`migration_data_scope_completed`, `migration_complexity_calculated`,
`migration_result_viewed`, `migration_exported`,
`migration_cost_imported_to_tco`, `migration_cost_imported_to_roi`

## Exports

- **PDF** — executive multi-page estimate
- **Excel** — sheets `00_READ_ME` … `13_SCENARIOS`
- **Markdown** — printable summary
- **Print** — browser print of results

## Limitations / data gaps

- Does not invent partner day rates or market averages
- Does not price storage migration unless the user supplies a cost
- Does not claim vendor-specific Salesforce/HubSpot migration prices
- Timeline only when the user enters stage durations
- Quick-estimate mode is architecturally possible later; not shipped as fake ranges

## Related links

Migration Planner · Field Mapping Template · Readiness Assessment · Cost / TCO /
ROI · Business Case · Requirements / RFP · Implementation Planner · Best CRM
