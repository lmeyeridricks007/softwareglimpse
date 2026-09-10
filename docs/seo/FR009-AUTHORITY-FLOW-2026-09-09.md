# FR-009 authority flow — fr009-authority-flow-2026-09-09

Goal: useful discoverability — not zero orphans.

## Before → after

| Metric | Before | After |
| --- | ---: | ---: |
| Nodes | 6785 | 6785 |
| Edges | 26853 | 26853 |
| IMPROVE orphans (sample) | 80 | 80 |
| IMPROVE pages sampled | 80 | 80 |
| Target orphans | 69 | 0 |
| Target weak inbound (<2) | 150 | 0 |
| Lane A orphans (targets) | 0 | 0 |
| READY orphans (targets) | 0 | 0 |
| Avg hub depth (overlap) | — | — |

## Links

| Metric | Count |
| --- | ---: |
| Opportunities selected | 692 |
| Applied (inbound) | 692 |
| Module injections | 452 |
| Guide overlay links | 240 |
| Authority-hoarder outbounds | 3 |
| Skipped weak | 0 |

## Selection mix

- LANE_A: 1
- RECENT_ENRICHED: 149

## Hub depth changes (sample)

- No depth deltas in overlapping sample

## Notes

- Preferred sources: category hubs, software, buying guides, tools, research, use-cases.
- Avoided footer spam / mass related grids / exact-match anchor dumps.
- Target orphan count must fall; sample IMPROVE 80/80 is weak long-tail (not mass-linked).

Artifacts: `data/seo/batches/fr009-authority-flow-2026-09-09/`

## Post-apply verification

| Metric | Value |
| --- | ---: |
| Target orphans | 69 → **0** |
| Target weak inbound (<2) | 150 → **0** |
| Lane A orphans (targets) | 0 → 0 |
| READY orphans (targets) | 0 → 0 |
| Avg content inbound after | 3.55 |
| Min content inbound after | 2 |
| IMPROVE sample orphans | 80 → **58** / 80 |
| FR-009 injection edges | 452 |
| Guide overlay links | 240 |
| Module injection links | 452 |

Selection: {'LANE_A': 1, 'RECENT_ENRICHED': 149}

Hub depth: overlapping IMPROVE-sample hub-depth pairs were sparse (targets were mostly recent enriched compares/guides outside the weak IMPROVE sample). Orphan detector content-inbound is the success metric for this wave.
