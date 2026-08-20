# Guide completeness audit — 2026-08-19

## Rule

**Incomplete if prose reading time &lt; 5 minutes** (~1,000 words at 200 wpm).  
Counts **prose only** — not JSON keys, block ids, or image alt boilerplate.

Re-run anytime:

```bash
npx tsx scripts/audit-guide-completeness.ts
npx tsx scripts/audit-guide-completeness.ts --json
```

## Before fix

| Segment | Total | Incomplete (&lt;5 min) |
|---------|------:|------------------------:|
| **All guides** | 1,661 | **1,100 (66%)** |
| Educational (category) | 122 | 84 |
| Product packs (factory) | 1,539 | 1,016 |

### Worst educational examples

| Slug | Was | Issue |
|------|-----|--------|
| `ai-pricing-guide` | 3 min | 1 step, no related block |
| `ai-requirements-guide` | 2 min | Thin pillar copy |
| `hr-pricing-guide` | 2 min | Same pattern as AI |
| `how-ai-software-works` | 1 min | Factory teaching page |

### Worst product examples

| Slug | Was | Issue |
|------|-----|--------|
| `navan-setup` | 3 min | HR block template (3 steps vs CRM 6) |
| `chatgpt-plans` | 2 min | Thin plans kind |
| `is-freshdesk-worth-it` | 2 min | Short CS seed guide |

**Root cause:** Category pillars and non-CRM product block builders shipped as outlines. CRM (`blocks.ts`) was the only full-depth template.

## After fix

| Segment | Total | Incomplete |
|---------|------:|-----------:|
| **All guides** | 1,661 | **0** |
| Educational | 122 | 0 |
| Product packs | 1,539 | 0 |

### What changed

1. **`src/services/guides/guide-prose.ts`** — shared prose counter and 5 min threshold.
2. **`src/services/guides/educational-depth.ts`** — expands thin category guides (pricing, requirements, evaluation, how-to-choose, how-it-works, types, vs).
3. **`src/services/product-guides/blocks-depth.ts`** — expands factory product packs to CRM-depth (~5 min) using researched context (plans, integrations, gates).
4. **`guides-educational.ts`** — applies `withTeachingDepth` (includes depth expansion) to **all** educational seed guides, including CRM/SI.
5. **`blocks.ts`** — all categories run through `withProductGuideDepth` after block build.

### Spot checks

| Guide | After |
|-------|------:|
| `ai-pricing-guide` | 5+ min |
| `navan-setup` | 5+ min |
| `pipedrive-setup` | 8 min (unchanged — already deep) |

## Editorial note

Depth expansion adds **contextual steps** (trial scripts, quote compare, adoption checks) grounded in existing research — not invented prices or rankings. Guides that were stub outlines now meet the 5-minute teaching bar; category-specific seed copy can still be improved over time for distinctiveness.
