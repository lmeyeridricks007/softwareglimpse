# Domain model

Schemas live in `src/domain/schemas/` (Zod). Data access lives in `src/data/`.

## Entity map

```mermaid
erDiagram
  Software ||--o{ Category : primary/secondary
  Software }o--o{ Industry : tagged
  Software }o--o{ UseCase : tagged
  Software }o--o{ Feature : featureRatings
  Software }o--o{ Integration : integrationSlugs
  Software ||--o| Pricing : has
  Software ||--o| AffiliateRelationship : has
  Software }o--o{ ResearchSource : sources
  Software }o--o{ Software : alternatives/competitors
  Comparison }o--o{ Software : productSlugs
  RecommendationCriteria ||--o{ RecommendationMatch : scores
  MigrationRecord ||--|| URL : source/target
```

## Core entities

| Entity | File | Notes |
| --- | --- | --- |
| `Software` | `software.ts` | Canonical product; taxonomy via slug refs |
| `Category` | `taxonomy.ts` | Nested via `path` + `parentSlug` |
| `Industry` | `taxonomy.ts` | Vertical tags / hubs |
| `UseCase` | `taxonomy.ts` | Need-based tags; can feed `/for/` |
| `Feature` | `taxonomy.ts` | Shared feature dictionary |
| `Integration` | `taxonomy.ts` | Shared integration dictionary |
| `SoftwareRelationship` | `relationship.ts` | Typed graph edges; symmetric inverses inferred |
| `Comparison` | `comparison.ts` | Canonical pair comparisons |
| `AlternativesPage` | `alternatives.ts` | Contextual alternatives |
| `BestPage` | `best.ts` | Methodology + explicit rankings |
| `BusinessSize` / `TeamType` / `BusinessType` / `UserPriority` | `dimensions.ts` | Recommendation dimensions |
| `ScoringCriterion` | `scoring.ts` | Category-specific editorial score dims |
| `Pricing` | `pricing.ts` | Plans + discriminated pricing rules |
| `AffiliateRelationship` | `affiliate.ts` | Embedded on software; resolved centrally |
| `ContentMetadata` | `content-metadata.ts` | Lifecycle timestamps/status |
| `ResearchSource` | `research-source.ts` | Pragmatic provenance |
| `RecommendationCriteria` | `recommendation.ts` | Structured scoring input |
| `MigrationRecord` | `migration.ts` | WP URL ledger |

## Software shape (summary)

Identity → taxonomy refs → features/integrations → pricing → editorial → relationships → affiliate → research → SEO/metadata.

**Do not** duplicate a product for each category. Multi-membership is arrays of slugs.

## Normalization choices

| Concern | Approach |
| --- | --- |
| Categories / industries / use cases | Separate entities, referenced by slug |
| Features / integrations | Separate dictionaries (seed later) |
| Affiliate | Field on software + resolver service |
| Pricing | Nested plans/rules (not a separate product row) |
| Editorial scores | Optional; never fabricate for JSON-LD |

## Publish gate

`src/domain/publishing.ts`:

- `isPubliclyAvailable(status, dates)`
- `isIndexable({ seoIndexable, metadata })`

Repositories filter non-public entities by default.

## Extensibility

Prefer additive optional fields and new rule kinds over breaking renames. AI ingest should `safeParse` before write.
