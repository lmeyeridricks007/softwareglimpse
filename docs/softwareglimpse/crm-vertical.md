# CRM knowledge graph & vertical

CRM + Sales is the first commercial vertical and the reusable pattern for later hubs.

## Taxonomy tree

```text
CRM (indexable hub)
├── Small Business CRM      (supported / planned hub)
├── Startup CRM
├── Sales CRM
├── Simple CRM
├── Gmail CRM
└── AI CRM

Sales Intelligence (indexable hub)
├── Lead Generation
├── Prospecting
├── Contact Data
├── Sales Engagement
└── Email Outreach
```

### Taxonomy page intents

| Intent | Meaning |
| --- | --- |
| `supported` | In the graph only — no public hub required |
| `hub` | Public decision hub when published |
| `indexable` | SEO-eligible when publish + quality gates pass |

Subcategories currently use `pageIntent: "supported"` + `status: "idea"`.

## Business dimensions

Proper entities (not free-text):

- Business size — with optional employeeMin/Max thresholds
- Team type — CRM-relevant mappings first
- Business type — startup, agency, SaaS, etc.
- Use cases — pipeline, prospecting, automation, …
- User priorities — ease-of-use, low-cost, automation, … (for future scoring)

Audience hubs under `/for/` are published and indexable for CRM business types (small business, startups, enterprise, freelancers, agencies, nonprofits, growing teams, remote sales teams).

## Relationship types

Typed edges in `SoftwareRelationship`:

- `belongs-to-category` / `belongs-to-subcategory` (also denormalized on software)
- `supports-use-case`
- `best-for-audience`
- `relevant-to-business-type`
- `competes-with` (**symmetric** — inverses inferred)
- `alternative-to` (**symmetric**)
- `integrates-with`
- `related-to` (**symmetric**)

Do not manually duplicate symmetric inverses. Resolver: `resolveRelationshipsForProduct`.

## Comparison canonicalization

**Strategy: lexicographic ascending by product slug.**

`pipedrive` + `freshsales` → `/compare/freshsales-vs-pipedrive/`

Display title may still be “Pipedrive vs Freshsales”.  
Reverse URLs 301 to the canonical slug.

## Alternatives model

`AlternativesPage` with contextual entries:

- reason, betterWhen, worseWhen
- relativePricing (`unknown` until researched)
- researchStatus per entry

Not a bare `alternativeSlugs[]` list (those remain denormalized hints only).

## Best-page model

`BestPage` supports methodology, eligible pool, explicit recommendations, scenarios, related comparisons/tools.

Rankings are editorial data only — never affiliate-derived.  
`/best/crm-software/` is published as a **scope/methodology** page, **noindex** until quality gates pass.

## Quality gates

`isEntityIndexable({ kind, entity })` combines:

1. `seo.indexable`
2. publish gate (`published` / `refresh-needed`, dates)
3. page-type quality gate

Examples:

- Comparison: research complete, verdict, ≥3 researched criteria
- Alternatives: ≥2 reasoned alternatives, research complete
- Best: methodology, eligible pool, ≥2 rationalized recommendations, research complete

## Internal linking

`getSoftwareLinkGroups(software)`:

- only publishable destinations
- priority by page type
- limits from `INTERNAL_LINK_LIMITS`

## CRM scoring criteria

Configured for CRM only (`scoringCriteriaSeed`): overall, ease-of-use, features, value, automation, reporting, integrations, support, AI.

No product scores assigned until researched.

## CRM Finder readiness (schema hooks)

Software already carries:

- businessSizeSlugs, teamTypeSlugs, businessTypeSlugs
- useCaseSlugs, userPrioritySlugs
- subcategorySlugs, integrationSlugs
- deploymentModels, pricing envelope

Finder UI / scoring engine remain Phase 3–5.

## Tooling

```bash
npm run content:validate
npm run sg:graph -- pipedrive
```
