# FR-009 authority flow — 2026-09-08

Goal: **useful discoverability**, not zero orphans.

CLI: `npm run seo:authority-flow -- --limit 60 --apply`

## Headline

Structural hub orphans from the original FR-009 sample (`/best/*`, `/alternatives/*`, `/use-cases/*`) were prioritized. **29 / 44** targeted pages now have meaningful inbound (no longer orphan). **Indexable orphan detector: 0**.

The IMPROVE sample still shows 80/80 orphans because the priority list is filled by remaining long-tail compares/explainers — those were intentionally not mass-linked.

## Before → after (estate)

| Metric | Before (issue) | After |
| --- | ---: | ---: |
| KG nodes | 6,787 | 6,785 |
| KG edges (semantic) | 26,855 | 26,853 |
| IMPROVE sample orphans | **58 / 80** | 80 / 80* |
| Indexable orphans (detector) | (included best/alternatives hubs) | **0** |
| Lane A orphans | ~0 | 0 |
| INDEXABLE_READY orphans | 0 | 0 |

\*Sample sorts orphans first; once structural hubs gained inbound they fell out of the top-80 orphan list and long-tail IMPROVE URLs filled it. Not a regression of hub discoverability.

## Links injected

| Metric | Count |
| --- | ---: |
| Wave targets | 44 (12 alternatives + 32 use-cases; best hubs already repaired via category next-steps) |
| Contextual inbound applied | 66 |
| Module injections | 66 |
| Guide overlay links | 0 |
| Authority-hoarder outbounds | 42 across runs (hub → shortlist / software / finder / journey) |
| FR-009-tagged injection edges | ~156 |
| Skipped weak | 0 |
| Targets fixed (orphan → ok) | **29 / 44** |
| Targets still orphan | 15 (thin alternatives without indexable software parent) |

## Selection priority used

1. INDEXABLE_READY — none remaining
2. Lane A IMPROVE — none with GSC demand in orphan set
3. Recently enriched — first pass (8 compares)
4. Structural orphans — alternatives + use-cases with clear category/product parents

## Journey / hoarder work

High-authority nodes (`/best/crm-software/`, `/categories/crm/`, `/guides/how-to-choose-crm/`, top software) received outbound next-steps where missing:

Guide → category/best → software → comparison → pricing → tool

## System changes

- Seed inbound for `best` / `alternatives` / `use-case` page types in improve-linking
- Cap 2–6 contextual inbounds per target
- Clear outbound-edge cache after injection writes (accurate orphan recount)
- CLI: `seo:authority-flow`

## Notes

- No footer spam / mass related grids / exact-match anchor dumps
- Did not chase zero orphan on long-tail IMPROVE compares
- Remaining orphan pool is mostly weak compares + product explainers — next wave only if Lane A / READY / enriched

Artifacts: `data/seo/batches/fr009-authority-flow-2026-09-08/`
