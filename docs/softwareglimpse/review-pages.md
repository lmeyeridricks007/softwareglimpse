# SoftwareGlimpse review pages

Software review/product pages live at `/software/{slug}/` as a **tabbed product hub**.

They are **not** affiliate landing pages and **not** markdown dumps.
They are buyer decision guides. Overview is the **fast summary** (screenshots, optional official overview video after the verdict, pros/cons, compare/pricing/use-case previews). Dedicated tabs own Features, Pricing, Use Cases, Comparisons, Alternatives, Reviews & Evidence, Methodology, and FAQ.

Official vendor videos may appear contextually:

- Overview: **See [Product] in action** after verdict / who-it’s-for (not above the verdict)
- Optional hero jump: “Watch product tour” (scroll only — never a live iframe in the hero)
- **Features tab:** demos only beside high-value features with linked ResearchMedia (max ~4), via analysis + media split — not a page-level gallery
- **Use Cases tab:** workflow demos resolved by `useCaseIds` / overlapping feature ids; Overview brand promos excluded
- **Guides tab:** official setup/tutorial block with SG commentary + links to independent setup/implementation guides
- Use Cases / Guides (implementation) / Evidence
- Compact **Product media** strip when screenshots/videos/docs exist

Do not dump every vendor video onto the page.

```text
/software/{slug}/                 → Overview (summary layer)
/software/{slug}/features/
/software/{slug}/pricing/
/software/{slug}/use-cases/
/software/{slug}/comparisons/
/software/{slug}/alternatives/
/software/{slug}/evidence/
/software/{slug}/methodology/
/software/{slug}/faq/
```

Specialist deep pages remain available (`/pricing/{slug}/`, `/alternatives/{slug}/`, `/compare/{a}-vs-{b}/`) and are linked from hub tabs when useful.

```text
FAST DECISION LAYER (Overview)
  Screenshots at a glance
  Our verdict + best for / not ideal for
  Pros & cons
  Compact compare + pricing + use-case previews
  Sidebar: quick facts, finder, team cost

DEEP DETAIL (dedicated tabs)
  Features, Pricing, Use Cases, Comparisons, Alternatives
  Reviews & Evidence, Methodology, FAQ
```

## Architecture

| Layer | Source | Renderer |
|---|---|---|
| Presentation model | `buildSoftwareReviewModel()` | `src/services/software-review/build-review-model.ts` |
| Hub tabs | `SOFTWARE_HUB_TABS` / `softwareHubPath()` | `src/services/software-review/hub-tabs.ts` |
| Hub chrome | `SoftwareProductHubShell` | `src/components/software/hub/` |
| Deep-review derivation | `buildDeepReviewLayer()` | `src/services/software-review/build-deep-review.ts` |
| Stored deep content (optional) | `ProductReview.deepReview` | `src/domain/schemas/deep-review.ts` |
| Overview page | `/software/[slug]/` | `src/app/(site)/software/[slug]/page.tsx` |
| Tab pages | `/software/[slug]/[tab]/` | `src/app/(site)/software/[slug]/[tab]/page.tsx` |
| Agent | `software-review-agent` | `src/services/content-agents/agents.ts` |

Prefer extending `ProductReview` / assessment / enrichment over a parallel content blob.

## Public-copy rules

All public strings pass through `publicCopy()` / `isInternalEditorialCopy()`.

Never publish:

- `fixture`, `fact-*` IDs
- `provisional`, `pending approval`, `candidate`
- hands-on phrases (`we tested`, `our testing`, `when we used`) without `handsOnTesting: true`

Documented capability narratives must be phrased as research inference:

> Based on the documented workflow…

not:

> When we used Pipedrive…

## Deep-review schema

`DeepReviewContent` supports:

- `productExperience` — workflow narrative + steps
- `detailedSections` — methodology-driven criterion mini-reviews
- `limitations` — where the product falls short
- `planRecommendations` — which plan to choose
- `competitorDeepDives` — strategic mini-comparisons
- `finalVerdict` — choose-if / consider-other-if + closing prose
- `whyWeLike`, `keyTakeaway`
- `handsOnTests`
- `coverage` — completeness states

When `ProductReview.deepReview` is absent, the presentation layer **derives** a safe deep review from:

- category methodology criteria
- enrichment feature/AI support
- assessment strengths/weaknesses/recommendation
- pricing plans
- comparison outcomes (public-safe scenarios only)

Missing research → section omitted (no filler).

## Hands-on testing policy

Assessment fields:

- `handsOnTesting: boolean` (source of truth)
- `testingNotes`, `handsOnSummary`, `testedAt`, `testEnvironment`

Structured `HandsOnTest` records may be stored on `deepReview.handsOnTests`.

Editorial validation already blocks unsupported “we tested” claims.

## Agent responsibilities

`software-review-agent` must produce:

1. Fast summary (executive summary, verdict, best-for, not-ideal-for, pros/cons)
2. Deep sections listed in `requiredSections`
3. FAQ + methodology summary
4. Fact refs for evidence linkage

Deterministic provider emits constrained drafts for CI; live LLM providers remain gated.

## Visual components

Under `src/components/software/`:

- Fast layer: hero, verdict, pros/cons, features, pricing, use cases, competitor cards
- Deep layer: `ProductWorkflow`, `DetailedCriterionReviews`, `ProductLimitationsPanel`, `PlanDecisionTree`, `CompetitorDeepDiveCards`, `FinalVerdictPanel`, `ReviewUpdateHistory`
- Evidence: `SoftwareResearchProcess` (bottom of page)

Sticky nav is a **client-side tab bar** (Overview, Features, Pricing, Use Cases, Comparisons, Alternatives, Evidence, Methodology, FAQ). The page H1 stays `{Product} Review`; tab switches update the panel + URL via `history.pushState` without a full reload. Deep links like `/software/{slug}/pricing/` still work on first load.

## Publication requirements

Before approving a review:

- major category criteria covered (or explicitly not-applicable)
- strengths and limitations explained
- pricing covered when researched
- buyer fit covered
- competitor context when strategic comparisons exist
- evidence attached; no generic filler
- no unsupported personal-testing claims
- scores only when assessment + review are approved

## Content relationships

| Review summarizes | Specialist page owns depth |
|---|---|
| pricing + plan choice | `/pricing/{slug}/` |
| top alternatives | `/alternatives/{slug}/` |
| competitor deep dive | `/compare/{a}-vs-{b}/` |
| setup/automation detail | product/category guides |

## Review states

| State | UX |
|---|---|
| researching | soft banner; limited claims |
| provisional / editorial-review | complete product profile; score card IN PROGRESS; no giant warnings |
| published | scores + authorship; no internal status language |
| stale | publishable with refresh signals |

## CTA policy

Commercial moments: hero, pricing, final verdict.
Decision tools: Finder / Compare.
Do not place affiliate CTAs after every section.
