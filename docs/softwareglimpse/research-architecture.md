# Research architecture

Trusted product research & enrichment for SoftwareGlimpse.

## Principle

```text
Source → Snapshot → Extracted fact → Normalization → Approval → Enrichment/Product
```

Never:

```text
AI → write facts directly into product JSON
```

## Data flow

```mermaid
flowchart LR
  ManualSources --> Discover
  Discover --> Fetch
  Fetch --> Snapshot
  Snapshot --> Extract
  Extract --> Normalize
  Normalize --> Conflicts
  Conflicts --> Review
  Review --> Approve
  Approve --> Enrichment
  Enrichment --> ProductPage
```

## Schemas

| Model | Role |
| --- | --- |
| `ResearchSource` | Trusted source registry + authority/type |
| `ResearchSnapshot` | Cleaned text + contentHash |
| `ResearchFact` | Typed field/value + evidence + status |
| `FactConflict` | Disagreement between sources |
| `ResearchJob` | Pipeline run record |
| `ProductResearchEnrichment` | Approved overlay for UI/merge |
| `ProductMedia` | Official vendor videos (YouTube / Vimeo / vendor-hosted) |
| `FeatureSupport` / `AiCapabilitySupport` | Nuanced capability model |
| `VendorPositioning` vs `EditorialFit` | Vendor claim ≠ SG judgment |

### Official product media (ResearchMedia)

`ProductResearchEnrichment.media[]` stores canonical research media records
(alias: `ResearchMedia` / `ProductMedia`):

- Types: `official-video`, `official-webinar`, `official-tutorial`, `softwareglimpse-video`
- Providers: `youtube`, `vimeo`, `vendor-hosted`
- Primary product UI requires `officialSource=true` + verified `officialSourceKind`
- Screenshots stay on `screenshots[]` — not duplicated in media
- Commentary: `whatThisShows[]`, `limitations[]`, `editorialCommentary`
- Relationships: feature / requirement / capability / use case / industry ids
- Lifecycle: discovered → verified → classified → needs-review → active/published
  (`embedding-disabled` = source-link fallback; `unavailable` = hide)
  Intermediate stages are **not** public — do not auto-publish
- Workflow APIs:
  - `src/services/feature-media-research/` (Feature path)
  - `src/services/capability-media-research/` (Capability path: capabilityIds + optional
    requirement/feature/useCase/industry/workflowStageIds)
  - `src/services/use-case-media-research/` (Use Case / Product path: useCaseIds +
    workflowStepIds → workflowStageIds; capability/requirement/feature/industry)
  - `src/services/requirement-media-research/` (Requirement path: requirementIds +
    requirementCriterionIds; feature/capability/useCase/industry)
  - `src/services/industry-media-research/` (Industry path: industryIds +
    mediaContext + industryRelevance; optional useCase/capability/requirement/
    feature; reportedOutcomes for case studies; never auto-publish)
  - Industry hubs: `src/services/product-media/industry-page-media.ts` +
    `buildIndustryEvidenceExplorer` (mediaContext + industryEditionLabel;
    never score from video; weak relevance not prominent)
- Coverage diagnostics:
  - `buildFeatureVisualCoverageReport` — missing video ≠ research failure
  - `buildCapabilityVisualCoverageReport` — missing workflow video ≠ incompleteness
  - `buildUseCaseVisualCoverageReport` — video coverage informational; does not alter
    research completeness unless methodology requires visual evidence
  - `buildRequirementVisualCoverageReport` — evidence coverage from docs/screenshots/
    feature assessments; official video counts informational; never alter fit scores
  - `buildIndustryVisualCoverageReport` — industry-specific / editions / demos /
    general workflows / case studies; informational only; never a ranking factor
- Do **not** store raw iframe HTML; compute privacy-aware `embedUrl`
- Do **not** auto-publish every discovered video
- Do **not** invent YouTube URLs — only verified official sources
- Do **not** invent `whatThisShows` observations via AI
- Do **not** duplicate ResearchMedia for Capability / Feature / Use Case / Requirement / Product — one record, shared tags
- Do **not** infer unseen workflow stages — only classify demonstrated workflowStepIds
- Do **not** infer unseen requirement criteria — only classify demonstrated requirementCriterionIds

Selection: `selectProductVideos()` prefers feature-specific walkthroughs, dedupes per page.

UI:

- `OfficialProductVideo` — thumbnail → consent → iframe on play
- `ProductSeeInAction` — Overview “See [Product] in action” (after verdict)
- `ProductMediaStrip` / `ProductHeroTourLink` — navigation only (no live hero iframe)

## Source priority

1. Official pricing  
2. Official product  
3. Official docs/help  
4. Integration directory  
5. Security docs  
6. Official blog/announcements  
7. Trusted third-party  
8. Review platforms  
9. Other  
100. Fixtures (demo only)

First-party current pricing outranks stale third-party. Fixtures never silently win.

## Provenance

Critical facts keep:

- `sourceIds`
- `evidence[]` (short excerpt + locator)
- `extractedAt` / `verifiedAt` / `approvedAt`
- `isFixture`

Product pages show trust notes + optional Sources list (no internal confidence dump).

## Pricing normalization

Vendor text → structured plans/rules:

- amount / amountPerSeat / amountPerUnit
- currency
- interval (`month`/`year`)
- billingInterval (`month`/`annual`)
- units (`seat`, `credit`, …)

Apollo uses credit/unit pricing — not forced into CRM seat assumptions.

## Features

Canonical feature taxonomy in `src/data/seed/features.ts`.  
Support values: `supported | limited | add-on | higher-plan-only | not-supported | unknown`.

## Freshness

Configurable days (`DEFAULT_FRESHNESS_POLICIES`):

| Domain | Max age |
| --- | --- |
| pricing / plans / AI | 30 days |
| features / integrations | 90 days |
| security | 180 days |
| identity / company | 365 days |

`isResearchDomainStale` / `getStaleResearchDomains`.

## Conflict handling

If values disagree → `FactConflict` opened.  
Priority may *suggest* a preferred fact; merge still requires approval. No silent overwrite.

## Approval & merge

- Default: facts need `approved`/`verified`
- Fixtures blocked from canonical pricing unless `--allow-fixture-merge`
- `canOverwriteFact` blocks lower-confidence candidates from clobbering verified facts

## Storage & retention

```text
src/data/research/<product>/
  sources.json
  fixtures/*.txt
  snapshots.json      # cleaned text + hash (not full HTML)
  facts.json
  conflicts.json
  jobs.json
  enrichment.json
```

Retention: keep extracted text + hash for audit/change detection; avoid raw HTML dumps.

## Providers

Abstractions interfaces:

- `ResearchSourceProvider`
- `ResearchFetcher`
- `FactExtractor`

Current implementations: manual sources + fixture fetcher/extractor.  
Env placeholders for future search/AI/fetch providers in `.env.example`.

## CLI

```bash
npm run research:product -- pipedrive --all --approve --merge --allow-fixture-merge
npm run research:product -- apollo --domain pricing --dry-run
npm run research:status
npm run research:validate
```

## Quality gates

Catalogue stubs remain publishable with identity.  
Pricing pages (future) should require verified non-fixture pricing within freshness threshold.  
Comparisons still require researched criterion outcomes.

## Future editorial / AI writing

Editorial hands-on testing is separate from vendor-fact research.  
AI content generation must consume canonical facts + evidence — not invent unsourced claims.

## Affiliate independence

Research/scoring ignores `affiliate.enabled`.
