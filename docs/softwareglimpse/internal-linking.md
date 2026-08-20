# Internal linking

## Principle

Links are derived from entity relationships, not hardcoded per template.

Service: `src/services/relationships/software-links.ts`  
Limits: `src/services/relationships/link-limits.ts`  
Graph: `src/services/graph/resolve-relationships.ts`

## Limits

```text
related comparisons: max 4
alternatives: max 5
related guides: max 4
related tools: max 3
related software: max 6
related categories: max 3
```

## Ranking

Deterministic priority by page type (`LINK_TYPE_PRIORITY`) plus relationship boosts. Unpublished destinations are excluded.

## Relationship vocabulary

| Relationship | Meaning |
| --- | --- |
| `belongsToCategory` | Product → category hub |
| `belongsToSubcategory` | Product → published subcategory hub |
| `competesWith` / `hasAlternative` | From typed graph edges |
| `comparisonPage` / `alternativesPage` / `bestGuide` | Content objects when publishable |
| `relatedTool` | Finder / calculators |

Symmetric graph types (`competes-with`, `alternative-to`, `related-to`) expose inverses automatically.

## Example: Pipedrive

```text
Pipedrive
  → /categories/crm/
  → competitors/alternatives software cards (Freshsales, Close, …)
  → /best/crm-software/ (when publicly available)
  → comparison URLs (when published + quality-approved)
  → /tools/software-finder/
```
