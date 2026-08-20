# CRM ROI Calculator — Methodology

This document defines the financial model used by `/tools/crm-roi-calculator/`.
It is the source of truth for formulas, assumption types, and limitations.

## Design principles

1. **No invented benefits.** Blank win-rate / conversion / hours-saved inputs contribute **zero**, not an industry average.
2. **Unknown ≠ zero.** Material cost fields left blank as unknown are excluded from finalized ROI.
3. **Assumption quality is visible.** Every material benefit is labeled `verified` | `estimated` | `scenario` | `unknown`, plus high/medium/low confidence.
4. **Scenario ≠ guarantee.** Revenue impact models are optional and labeled.
5. **Prefer contribution over revenue** for financial ROI.

## Assumption types

| Type | Meaning |
| --- | --- |
| Verified | Strong supporting evidence (e.g. known tool invoice being retired) |
| Estimated | Reasoned internal estimate |
| Scenario | Hypothetical case for modelling |
| Unknown | Not yet known |

Confidence (high / medium / low) is a qualitative label — **not** a statistical probability.

## Productivity

For each role (sales reps, managers, ops/admin):

```
hours_saved = 
  scenarioHours[active] 
  OR hoursSavedPerWeek 
  OR currentHours × reductionPercent / 100

gross_annual = users × hours_saved × working_weeks × loaded_hourly_cost

realized_annual = gross_annual × realization_factor
```

**Realization factor** defaults to **50%** (user may choose 25 / 50 / 75 / 100 / custom).
Saved time is not automatically cash.

## Cost avoidance

```
annual_saving = current_annual_cost × elimination_percent / 100
```

Only included rows with known amounts enter the total.

## Optional revenue scenarios

### Win-rate (percentage points)

```
improvement_pp = scenario_win_rate% − current_win_rate%
additional_wins = annual_qualified_opportunities × (improvement_pp / 100)
annual_value = additional_wins × contribution_per_win
```

No default improvement. Relative “% increase” language is avoided.

### Conversion

```
delta = (scenario_conversion% − current_conversion%) / 100
annual_value = leads_per_year × delta × contribution_per_deal
```

### Recovered opportunities

```
annual_value = opportunities_recovered × (win_probability% / 100) × contribution
```

### Capacity / cycle

Shorter cycle time is **not** auto-converted to revenue. User must enter an
explicit additional annual contribution amount.

## Investment / TCO

```
year1_investment = known(one-time incl. internal labour) + known(Y1 software)

annual_recurring = known(licences + add-ons + admin + support + …)

horizon_tco = year1_investment + annual_recurring × (horizon_years − 1)
```

If material fields (`licences`, `implementation`, `integrations`, `migration`)
are explicitly `null` (unknown) and provisional mode is off → **ROI incomplete**.

## Benefits & net value

```
annual_benefit = Σ included benefit lines (after adoption factor per year)

3_year_benefit = Σ year_t benefits for t = 1..horizon

net_3_year_value = 3_year_benefit − horizon_tco

3_year_ROI% = (3_year_benefit − horizon_tco) / horizon_tco × 100
```

ROI is **not** calculated when the denominator is missing, zero, or incomplete.

## Payback

Monthly cash-flow walk from −year1_investment, adding monthly benefit run-rate
(respecting adoption ramp) and charging recurring from month 13 onward.
Labeled **approximate** when adoption ramp or unknowns apply.

## Adoption ramp (optional)

If enabled:

```
year_t_benefits = annual_benefit × (year_t_percent / 100)
```

Defaults when enabled: Y1 60% / Y2 85% / Y3 100%. Off by default (full realization each year once benefits are entered).

## Conservative / base / upside

Scenarios use **user-defined** values (e.g. `scenarioHours.conservative|base|upside`,
win-rate `scenarioImprovementPp`). The engine does **not** invent multipliers.

## Break-even

When year-1 investment is known:

```
annual_needed ≈ horizon_tco / horizon_years

hours_saved_per_user_week ≈ annual_needed 
  / (total_users × working_weeks × avg_hourly × realization_factor)
```

Only returned when mathematically valid.

## Business case assessment (not a score)

| Dimension | Bands |
| --- | --- |
| Payback | fast / moderate / long / none / unknown |
| Benefit confidence | high / medium / low / unknown |
| Revenue dependence | low / medium / high |
| Cost completeness | complete / partial / significant-unknowns |

Deterministic interpretation text explains what drives the result.

## Limitations

- No live FX conversion between currencies
- No vendor catalogue ROI claims
- No automatic headcount reduction from time saved
- PDF/Excel are client-generated snapshots of the current model
- Overlap warnings are advisory (e.g. productivity + “headcount saving” labels)

## Related

- [`crm-roi-calculator.md`](./crm-roi-calculator.md) — architecture & reuse map
- TCO methodology (Cost Calculator / TCO tool docs under `docs/softwareglimpse/`)
