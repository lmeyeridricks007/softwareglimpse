# Supporting content clusters

SoftwareGlimpse plans educational guides as **supporting knowledge** around commercial anchors — not as blog filler.

## Architecture

```text
CATEGORY
  ├── Decision anchors (best, products, compare, alternatives, pricing, tools)
  └── Supporting knowledge (fundamentals → selection → pricing → implementation → migration …)
```

Domain:

- `GuidePage` — `/guides/[slug]/` educational page with `supports` edges + journey stage
- `CategoryKnowledgeMap` — per-category topic concepts (CORE / SECONDARY / OPTIONAL / NOT_RECOMMENDED)
- `SupportingTopicCandidate` — scored, placement-decided candidate (no auto-generation)

## Anchors

Anchor types: `category | software | best | comparison | alternatives | pricing | tool | use-case`

Guides declare typed relationships (`supports-anchor`, `explains-pricing`, …) and an optional `nextAction`.

## Topic types & journey stages

Topic types: fundamental, how-it-works, selection, buying-guide, feature-explainer, pricing-education, implementation, migration, setup, integration, use-case, strategy, troubleshooting, comparison-education, checklist.

Journey: learn → understand → evaluate → choose → implement → optimize → switch.

## Page vs section

`decideTopicPlacement()` returns one of:

| Recommendation | When |
| --- | --- |
| `NEW_PAGE` | ≥3 standalone signals, not duplicate |
| `EXPAND_EXISTING_PAGE` | Same intent as an existing guide |
| `ADD_SECTION` | Weak depth / optional / notes say section |
| `NO_ACTION` | NOT_RECOMMENDED or already exists |

## Priority / scoring

Transparent scores (no affiliate commission):

- journey value, search evidence, anchor support, knowledge gap, strategic relevance, effort penalty

Classes: CORE → SECONDARY → OPTIONAL → NOT_RECOMMENDED.

## CLI

```bash
npm run content:clusters -- crm
npm run content:clusters -- crm --json
npm run content:clusters:gaps -- --category crm
npm run content:support -- content:best:crm-software
npm run content:support -- content:tool:crm-finder
npm run content:support -- content:tool:crm-cost-calculator
npm run content:support -- product:pipedrive
npm run content:plan -- --category crm --type supporting
npm run content:clusters:validate
```

> Note: `npm run content:gaps` now runs the **Content Gap Opportunity Agent** (new-content opportunities). Supporting-cluster gaps live under `content:clusters:gaps`.
`content:plan` lists GuideAgent targets only — **does not execute**.

Accepted candidate path:

```text
content:plan → workflow:plan guide <slug> → GuideAgent → QA → approval → publish
```

## Category onboarding

Onboarding attaches `supportingKnowledgePlan` and guide content candidates. GuideAgent tasks are **BLOCKED** (plan only).

## Site audit

Checks: `SUPPORTING_KNOWLEDGE_GAP`, `ANCHOR_SUPPORT_GAP`, `SUPPORT_CONTENT_DUPLICATE`, `SUPPORT_CONTENT_ORPHAN`.

## CTA policy

Supporting guides link upward to anchors (category / Finder / calculator). Prefer indirect commercial CTAs; minimize affiliate stuffing.
