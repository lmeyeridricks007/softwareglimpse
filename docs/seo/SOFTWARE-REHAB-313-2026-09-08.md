# Software entity rehab — core product hubs (2026-09-08)

Priority batches of 25 across the core software estate. **No fabricated facts.**
Decision hubs are assembled only from catalogue seed, research enrichment, and editorial assessment/review.

Hub overview now surfaces a **Decision snapshot** (best for / not ideal / tradeoffs / evidence / next step) from `data/seo/software-enrichment-overlays/`.

## Results

| Metric | Value |
| --- | ---: |
| Selected (priority queue) | 313 |
| Overlays applied (full estate refresh) | 315 |
| Materially improved (first pass) | 312 |
| Products with MISSING catalogue fields | 6 |
| Dependent pages flagged for refresh | 118 |
| Batches completed | 13 |

## Top MISSING fields (do not invent)

- **4×** `use_cases` — brand24, freshmarketer, kartra, socialbee
- **2×** `capabilities` — canvas-score, sellfy
- **2×** `pricing` / `plans` — canvas-score, sellfy
- **1×** `source_provenance` / `verification_date` — canvas-score

UNKNOWN fields (e.g. undocumented trial) stay UNKNOWN — never treated as “no”.

## Batch log (priority wave of 313)

| Batch | Applied | Improved | QA sample |
| --- | ---: | ---: | --- |
| 1–12 | 25 each | 24–25 | quality gate ok |
| 13 | 13 | 13 | quality gate ok |

## What each overlay contains

For every product:

1. **Field audit** — name, status, vendor, category, description, audience, use cases, capabilities, pricing/plans/free/trial, integrations, alts/competitors, affiliate, provenance, verification date  
2. **Decision hub** — what it is, best for, not ideal for, capabilities, pricing summary, tradeoffs, alternatives, important comparisons, guides, evidence state, next step  
3. **Dependents** — guides / compares / best / alternatives / pricing tabs  
4. **Remediation list** — `catalogue_fill:*` / `verify:*` only where evidence is missing  

## Downstream

- `buildSoftwareReviewModel` merges the overlay into `decisionHub`
- Overview tab renders `SoftwareHubDecisionStrip`
- Guides/compares/best listed under `dependentsNeedingRefresh` when MISSING fields remain

## Commands

```bash
npm run seo:software-rehab -- --limit 313 --batch-size 25
npm run seo:enrich-software -- --slug pipedrive
npm run seo:enrich-software -- --batch 25
```

## Policy

- Missing ≠ No / invent
- Downstream must consume canonical entity + enrichment overlays
- Catalogue remediation required before promoting thin entities (e.g. canvas-score)

Artifacts: `data/seo/batches/software-rehab-313-2026-09-08/` · overlays: `data/seo/software-enrichment-overlays/`
