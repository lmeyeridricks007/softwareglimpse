# Research media population notes

## Populated

| Product | Media | Source verification |
| --- | --- | --- |
| HubSpot | Sales Hub overview + official tutorial (YouTube) | Official HubSpot channel / training |
| Pipedrive | Product overview (`cU0FYEDRop8`) | Official Pipedrive YouTube channel |

## Pending (do not invent URLs)

| Product | Gap |
| --- | --- |
| Pipedrive | Feature-specific + use-case workflow official tutorials — Overview tour stays Overview-only; use-case/setup media pending channel verification |
| Salesforce | No `media[]` yet |
| Freshsales | No `media[]` yet |

## Lifecycle

```text
Feature research path:
Feature → Products → Official sources → Documentation / Screenshots / Videos
  → Evidence review → ProductFeatureAssessment (FeatureSupport + Feature Detail)

Capability research path:
Capability → Products → Requirements → Features → Evidence discovery
  → Official tutorials / workflow demos / webinars / vendor-hosted demos
  → Classification (capabilityIds + optional requirement/feature/useCase/industry)
  → Editorial review → explicit activation

Use Case / Product research path:
Product / Use Case → Official workflow demos / tutorials / product demos / webinars
  → Official-source verification
  → Classification (useCaseIds + workflowStepIds + optional capability/requirement/feature/industry)
  → Editorial review (whatThisShows / whatToNotice / limitations) → explicit activation
  → Workflow coverage = demonstrated vs not-shown from classified steps only (no inference)

Industry research / onboarding path:
Industry → Products → Official industry demos / editions / workflows / webinars /
  tutorials / vendor-published customer case studies
  → Official-source verification (never infer from title/logo)
  → Classification (industryIds + mediaContext + industryRelevance + optional
    useCase/capability/requirement/feature; reportedOutcomes for case studies)
  → Editorial review → explicit activation
  → Weak relevance does not surface prominently; coverage is informational only

Video onboarding (never auto-publish):
discovered
  → verified (officialSource=true after researcher confirms vendor source)
  → classified (ids + grounded whatThisShows; optional workflowStageIds)
  → needs-review / editorially-reviewed
  → active|published (explicit activation only)
```

API: `src/services/feature-media-research/`

- `discoverOfficialVideo` — status `discovered`, `officialSource=false`
- `verifyOfficialSource` — sets `officialSource=true` + status `verified`
- `classifyOfficialVideo` — maps features/dimensions; requires researcher-supplied `whatThisShows`
- `submitEditorialReview` — status `needs-review`
- `activateOfficialVideo` — status `active`|`published` (public)
- `findDuplicateResearchMedia` — match provider + providerId / sourceUrl
- `buildFeatureVisualCoverageReport` — diagnostics; missing video ≠ failure

CLI: `npm run research:feature-media -- coverage <featureSlug>`

API: `src/services/capability-media-research/`

- `discoverCapabilityOfficialVideo` — types: official-video | official-tutorial | official-webinar
- `verifyCapabilityOfficialSource` / `classifyCapabilityOfficialVideo` / `submitCapabilityEditorialReview` / `activateCapabilityOfficialVideo`
- `mapVideoToAdditionalCapability` — multi-capability without duplicating ResearchMedia
- `buildCapabilityVisualCoverageReport` — products assessed / screenshots / official workflow video; missing video ≠ incompleteness

CLI: `npm run research:capability-media -- coverage <capabilitySlug> [--industry financial-services]`

API: `src/services/use-case-media-research/`

- `discoverUseCaseOfficialVideo` — types: official-video | official-tutorial | official-webinar;
  rejects generic brand marketing by default
- `verifyUseCaseOfficialSource` / `classifyUseCaseOfficialVideo` / `submitUseCaseEditorialReview` /
  `activateUseCaseOfficialVideo`
- Classification maps: productIds, useCaseIds, workflowStepIds (→ workflowStageIds),
  capabilityIds, requirementIds, featureIds, industryIds
- `buildExplicitWorkflowCoverage` — demonstrated vs not-shown from classified step ids only
  (never infer unseen stages)
- Editorial: `whatThisShows[]`, `whatToNotice[]`, `limitations[]` (not vendor marketing copy)
- `mapVideoToAdditionalUseCase` / `mapUseCaseResearchTags` — multi-context without duplication
- `buildUseCaseVisualCoverageReport` — products assessed / workflow evidence / screenshots /
  official workflow video; coverage is informational
- `evaluateUseCaseMediaHealth` — availability, embedding, source status, verification freshness

CLI: `npm run research:use-case-media -- coverage <useCaseSlug>`

API: `src/services/requirement-media-research/`

- `discoverRequirementOfficialVideo` — types: official-video | official-tutorial | official-webinar;
  rejects generic brand marketing by default
- `verifyRequirementOfficialSource` / `classifyRequirementOfficialVideo` /
  `submitRequirementEditorialReview` / `activateRequirementOfficialVideo`
- Classification maps: productIds, requirementIds, requirementCriterionIds[],
  featureIds, capabilityIds, useCaseIds, industryIds
- `buildExplicitCriterionCoverage` — demonstrated vs not-shown from classified
  criterion ids only (never infer unseen criteria)
- Editorial: `whatThisShows[]`, `whatToNotice[]`, `limitations[]` (not vendor marketing)
- `mapVideoToAdditionalRequirement` / `mapRequirementResearchTags` — multi-context
  without duplication
- `buildRequirementVisualCoverageReport` — criteria / products assessed /
  evidence coverage (non-video) / products with official video (informational)
- Video count must never alter requirement fit scores

CLI: `npm run research:requirement-media -- coverage <requirementSlug>`

API: `src/services/industry-media-research/`

- `discoverIndustryOfficialVideo` — types: official-video | official-tutorial |
  official-webinar | official-customer-case-study; rejects generic brand marketing
- `verifyIndustryOfficialSource` — officialSource=true only after researcher
  confirms vendor channel/host (never infer from title/logo)
- `classifyIndustryOfficialVideo` — maps productIds, industryIds[], mediaContext
  (`industry-specific` | `industry-edition` | `general-workflow` |
  `customer-case-study`), industryRelevance
  (`exact-industry-specific` | `strongly-relevant-general` | `weak`),
  optional useCaseIds / capabilityIds / requirementIds / featureIds /
  workflowStageIds, whatThisShows / whatToNotice / limitations,
  reportedOutcomes (case studies — vendor-reported only)
- Weak relevance must not surface prominently on Industry hubs
- `mapVideoToAdditionalIndustry` / `mapIndustryResearchTags` — multi-context
  without duplicating ResearchMedia (Product / Use Case / Capability reuse)
- `buildIndustryVisualCoverageReport` — industry-specific / editions / products
  with demos / general workflows / case studies (informational; never a ranking
  factor)
- Health: unavailable, embedding-disabled, stale-ui, source-changed,
  industry-relationship-needs-review

CLI: `npm run research:industry-media -- coverage <industrySlug>`

Never auto-publish discovered videos. Never convert source URLs to affiliate links.
Never create one ResearchMedia copy for Capability and another for Product — reuse by
provider + providerId / sourceUrl.
Never auto-delete research history when a video fails — set `status: unavailable`,
`sourceHealth: unavailable`, and/or `refreshFlags`, then hide from active public display.

Public eligibility requires `officialSource=true` and status in
`active` | `published` | `embedding-disabled`. Intermediate stages are research-only.

## Governance

| Field | Purpose |
| --- | --- |
| `verifiedAt` | Editorial verification timestamp |
| `publishedAt` | Vendor publish date when known |
| `lastCheckedAt` | Last health / link check |
| `status` | Lifecycle including `needs-review`, `embedding-disabled`, `unavailable` |
| `sourceHealth` | `live` / `unavailable` / `unknown` |
| `refreshFlags` | Why research refresh is needed |

Refresh flags: `source-unavailable`, `embedding-disabled`, `product-materially-changed`,
`linked-feature-changed`, `beyond-review-threshold`, `source-no-longer-official`,
`stale-ui`, `source-changed`, `industry-relationship-needs-review`.

Freshness domain: `official-media` (default max age 90 days).

Public fallback:

- Embed fails, source live → **Watch official video ↗**
- Source fails → hide from active public UI + flag research refresh

Internal report: `buildProductMediaHealthReport()` — Product Media Health (not public).

## Feature Detail reuse

Canonical ResearchMedia records resolve onto `/features/[slug]/` via
`featureIds` (+ optional `demonstratedDimensionIds`, `capabilityIds`,
`requirementIds`). Selection lives in `feature-page-media.ts` — never hardcode
media inside page components.

## Use Case Detail reuse

Canonical ResearchMedia records resolve onto `/use-cases/[slug]/` (and industry
variants) via `useCaseIds` (+ optional `workflowStageIds`, `capabilityIds`,
`requirementIds`, `featureIds`, `industryIds`). Selection lives in
`use-case-page-media.ts`. Prefer workflow demos over generic product tours.
Absence of video is not absence of product support; video quantity never
affects ranking.

UI: `UseCaseSeeInAction`, `UseCaseWorkflowComparison`, EvidenceExplorer via
`buildUseCaseEvidenceExplorer`.

## Requirement Detail reuse

Canonical ResearchMedia resolves onto `/requirements/[slug]/` (and industry
variants) via `requirementIds` + optional `requirementCriterionIds[]`,
`featureIds`, `capabilityIds`, `industryIds`, `useCaseIds`. Selection lives in
`requirement-page-media.ts`. Priority: exact Requirement+Product(+Industry) →
required features → supporting features → capability/use-case → generic last.

A video must never mark a requirement as supported. Fit remains feature-assessment
driven. Criterion mapping is partial evidence only.

UI: `RequirementSeeWhatSupportLooksLike`, EvidenceExplorer via
`buildRequirementEvidenceExplorer` (group by criterion), deep-dive “See it in
action”, verification gaps, demo checklist / Finder / Calculator CTAs.

## Industry hub reuse

Canonical ResearchMedia resolves onto `/industries/[slug]/` via `industryIds` +
optional `mediaContext` (`industry-specific` | `industry-edition` |
`general-workflow` | `customer-case-study`), `industryEditionLabel`,
`useCaseIds`, `capabilityIds`, `requirementIds`, `featureIds`, `workflowStageIds`.

Selection: `src/services/product-media/industry-page-media.ts`

- Prefer genuine industry / industry-edition demos
- Label general workflow demos clearly — never as “Financial Services Demo”
- Customer case studies labeled as vendor-published stories (weak evidence)
- Video quantity never affects product rankings or industry fit
- Zero-video hubs remain complete (screenshot fallback optional)

UI: `IndustrySeeCrmInIndustry`, product card media flags, product × industry
spotlight, workflow compare, EvidenceExplorer via `buildIndustryEvidenceExplorer`,
`IndustryCustomerStoriesSection` (Real-world examples — vendor-published only).

CLI research lifecycle: `src/services/industry-media-research/`
(`npm run research:industry-media -- coverage <industrySlug>`).
Append `industryIds` / `mediaContext` / `industryRelevance` on the canonical
ResearchMedia record (no IndustryVideo entity). Weak relevance stays out of
primary see-in-action / customer-story surfaces.

Do not invent URLs for symmetry. Prefer exact feature demos; exclude brand
overview promos from Feature Detail “See in action” cards.
