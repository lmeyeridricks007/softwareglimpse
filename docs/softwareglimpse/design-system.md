# Design system (softwareglimpse-ui-v1)

Reusable visual system for SoftwareGlimpse. Tokens → primitives → domain components → page templates.

## Architecture

```text
src/styles/tokens.css          # CSS variables (source of truth)
src/lib/cn.ts                  # class merge helper
src/components/ui/             # Button, Card, Badge, forms, Alert, Rating…
src/components/layout/         # PageContainer, Section, Stack/Grid
src/components/navigation/     # Logo, Header, Footer
src/components/software/       # SoftwareCard, ProductLogo, FeaturedSoftware…
src/components/category/       # CategoryCard, BestSoftwareListCard
src/components/trust/          # TrustStrip, TrustIndicators
src/components/newsletter/     # NewsletterCard
```

## Tokens

Groups in `:root`:

- **Surfaces** — `--sg-color-bg`, `--sg-color-surface`, muted, tint  
- **Text** — `--sg-color-text`, muted, inverse  
- **Brand** — primary / hover / soft / navy  
- **Semantic** — success, warning, danger, rating amber  
- **Type** — display → caption scale, single DM Sans family  
- **Space / radius / shadow** — shared scales  
- **Containers** — narrow, article, standard, wide  

Legacy `--color-*` aliases map to `--sg-*` so existing pages inherit the new palette.

## Layout

- Homepage: full-bleed `Section`s (`app/page.tsx`)  
- Content routes: `app/(site)/layout.tsx` → `PageContainer`  
- Software reviews: `app/(site)/software/layout.tsx` wide breakout + mockup two-column template  
- Comparisons: `app/(site)/compare/layout.tsx` wide breakout  
- Categories: `app/(site)/categories/layout.tsx` wide breakout  
- Tools: `app/(site)/tools/layout.tsx` wide breakout  
- Guides: `app/(site)/guides/layout.tsx` wide breakout  
- Best: `app/(site)/best/layout.tsx` wide breakout  
- Alternatives: `app/(site)/alternatives/layout.tsx` wide breakout  
- Use cases: `app/(site)/use-cases/layout.tsx` wide breakout  

## Calculator template

- Hero with calculator value props + visual  
- 4-step flow: Business → Requirements → What’s included → Results  
- Live estimate sidebar from researched list prices only  
- No invented implementation / training / migration fees  
- Trust strip (no fake reader counts)  

## Guide template (supporting / decision guides)

**Template ID:** `softwareglimpse-guide-template-v1`  
**Contract:** `src/components/guides/guide-template.ts`  
**CSS:** `src/styles/tokens.css` (`.sg-guide-*` tokens/classes)

All new `/guides/[slug]/` pages reuse this template — do not invent alternate layouts.

### Layout

1. **Hero (2-col, stretch):** left = category pill, H1, summary, author meta, CTAs, **Quick Answer** (`belowCta`); right = **unique** `heroVisual` via `GuideHeroIllustration` (selection guides may use `CrmSelectionFrameworkVisual` when that art matches the guide).
2. **Body (2-col):** `GuideBlocksRenderer` + sticky `GuideSidebar`.
3. **Sidebar:** numbered **In this guide** TOC → solid blue Finder CTA → recommended tools → related → newsletter.

### Components (`src/components/guides/`)

- `GuideHero` — decision chrome + Quick Answer slot + **unique** `heroVisual` per guide  
- `GuideBlocksRenderer` — `GuideContentBlock` types via `GUIDE_BLOCK_RECIPES`  
- `guide-visuals` — `GuideFigure`, `GuideHeroIllustration`, roadmap, `GoalScenarioCards`, must/nice cards, integrations, cost donut, TipCallout  
- `guide-interactive` — checklist / scorecard / copyable demo questions  
- `GuideSidebar` — TOC + Finder CTA + tools  
- Hub: `GuideCover` uses `guide.heroVisual` from `build-hub-model` — not shared topic placeholders when a hero exists  
- Pastel icon tones via `GUIDE_ICON_TONE_CLASSES` / `.sg-guide-icon-chip`

### Visual rules (`GUIDE_VISUAL_APPROACH`)

- Pastel **multi-color** icon chips (blue/teal/violet/orange/fuchsia/emerald/sky/amber) — not monochrome blue only  
- Each guide needs its own hero artwork (`heroVisual`) — never reuse another guide’s PNG  
- Break up text with generated topic diagrams (`figure` on steps/matrices or `type: "figure"`) under `public/guides/{slug}-*.png`  
- **Framing:** show the **full** image at natural aspect, width-filling (`h-auto w-full` / `object-contain`). Never CSS scale/zoom or `object-cover` that clips diagram labels  
- **Asset prep:** gentle edge crop of title/footer gutters only; prefer regenerating tighter art over live-page cropping. Do not aggressive content-band auto-crops  
- **Adaptive grids:** `GoalScenarioCards` (and similar) size columns to the item count so rows fill content width (3 → 3 cols)  
- Tips: left accent bar (`.sg-guide-tip`)  
- Must-have = green; Nice-to-have = purple  
- Soft-publish: `seo.indexable: false` until editorial gate; `publishedAt` must be ≤ now or `getGuides()` hides the page  
- Commercial visits: `SoftwareCta` / `AffiliateLink` → direct affiliate destination (`rel=sponsored`). `/go/{slug}` is backward-compat only. 

### Agent

`guide-agent` must follow `GUIDE_AGENT_TEMPLATE_RULES` and emit blocks from `GUIDE_BLOCK_RECIPES` by `topicType`. Selection guides prefer blocks over thin H2 essays. Fundamentals need educational diagrams, not the selection-framework hero.  
Fact-checked only when research is complete + reviewed. No fake research-hour / dollar-total claims.  

Hub: `/guides/`. Detail: `/guides/[slug]/`.  

## Best template

Reusable buying-guide architecture under `src/components/best/guide/` for `/best/[slug]/`:

- `BestSoftwareHero` + `BestSoftwareQuickSummary` — eyebrow, H1, research metadata, CTAs, product shortlist (no empty radar)
- `BestSoftwareQuickAnswer` — featured + compact recommendation hierarchy
- `BestSoftwareComparisonTable` — columns only when verified data exists
- `BestSoftwareTopPicks` — approved use-case awards only
- `BestSoftwareProductSection` — detailed pros/cons/fit/feature snapshot
- `BestSoftwareFeatureMatrix` / `BestSoftwarePricingComparison` — verified research only
- `BestSoftwareFinderCta` / `BestSoftwareCostCalculatorCta`
- `BestMethodologySummary`, `BestSoftwareBuyingGuide`, use-case / landscape / types / comparisons / alternatives / guides / FAQ / verdict
- `BestGuideSidebar` — TOC + Finder CTA (decision content stays in main column)

View model: `buildBestPageModel` (`src/services/best-page/`). Public content gate strips provisional/candidate/fixture/editorial-approval language. Rank numbers and awards render only when editorially approved. Newsletter renders nothing until enabled (`hideWhenDisabled`).

Legacy thin components (`best-hero`, `best-ranked-list`, …) remain for reference but the detail route uses the guide architecture.

No fabricated review counts, research hours, or editor’s choice without approval.  
Best: `app/(site)/best/layout.tsx` wide breakout  

## Alternatives template

Components under `src/components/alternatives/`:

- `AlternativesHero` — source + top-alternative card, honest stats  
- `AlternativesMethodologyNote`  
- `AlternativesTable` — ranked alternatives table (scores only when approved)  
- `AlternativesSidebar` — why switch, finder CTA, comparisons, guides  
- `AlternativesHowToChoose`  

No fabricated review counts, research hours, or “trusted by thousands.”  
Alternatives: `app/(site)/alternatives/layout.tsx` wide breakout  

## Use-case template

Components under `src/components/use-cases/`:

- `UseCaseHubHero` — CRM use-case hub hero + abstract visual  
- `UseCaseExploreGrid`, `UseCaseAudienceRow`  
- `UseCaseSidebar` — featured use case, comparisons, resources, newsletter  
- `UseCaseQuizBanner`, `UseCaseMethodSteps`  

Hub: `/use-cases/` (CRM-focused). Detail: `/use-cases/[slug]/`.  
No fabricated research hours, deal metrics, or “trusted by thousands.”  

## Business type / audience template (`/for/`)

Route: `/for/` index + `/for/[slug]/`  
Profiles: `AudienceHubProfile` (`src/domain/schemas/audience-hub.ts`) +
`src/data/audience-hub/` + `buildAudienceHubModel()` in `src/services/audience-hub/`.

Components under `src/components/for/`:

- `AudienceHubHero` / `AudienceDetailHero` — unique per-audience hero art under `public/for/`
- `AudienceConceptVisual` — teaching diagram per business type (not a product screenshot)
- Sections: glance, what matters, fit signals, scenarios, catalogue tags, buying steps, FAQ, related
- CRM hub surfaces `CategoryBusinessTypes` (`#business-types`)

Business type = company/team shape (not industry vertical). Editorial gate approved (`seo.indexable: true`). Catalogue product lists are size/type tags — never rankings.

## Industry capability detail template

Route: `/industries/[slug]/capabilities/[capability]/`  
Profiles: `IndustryCapabilityProfile` (`src/domain/schemas/industry-capability.ts`) +
`src/data/industry-capability/` + `buildIndustryCapabilityModel()` in `src/services/industry-capability/`.

Components under `src/components/industries/capability/`:

- `CapabilityHero`, `CapabilityGlance`, `CapabilityWhyMatters`
- `CapabilityRequirements` / essential-vs-advanced
- `CapabilityScorecard`, `CapabilityRequirementMatrix`, `CapabilityProductCards`
- `CapabilityScreenshots` (verified enrichment captures + lightbox)
- Shared sections: outcomes, trade-offs, use-case fit, vendor questions, methodology, FAQ, final CTA

Capability identity = canonical feature slug (e.g. `pipeline-management`).  
Fit labels prefer **approved criterion assessments**; otherwise evidence-coverage labels.  
Unknown evidence never renders as hard “No”. Soft-published / noindex until ready.

POC profiles: Financial Services × Pipeline Management, Financial Services × Workflow Automation.

## Feature detail template

Route: `/features/` index + `/features/[slug]/`  
Contextual: `/industries/[slug]/features/[feature]/`  
Template: `<FeatureDetailPage />`  
Profiles: `FeatureDetailProfile` (`src/domain/schemas/feature-detail.ts`) +
`src/data/feature-detail/` (`deep.ts` depth merge) + `buildFeatureDetailModel()` in
`src/services/feature-detail/`.

Concrete evidence surface (support + plan + implementation), not a listicle.
URL slug may differ from catalogue slug (e.g. `multiple-pipelines` /
`custom-pipeline-stages` → `custom-pipelines` enrichment; `calling` →
`call-functionality`; `reporting-dashboards` → `reporting`).

Components under `src/components/features/`:

- `FeatureDetailPage`, `FeatureHero` (PNG hero preferred; CSS concept fallback)
- Depth sections: overview, challenges, outcomes, workflow (+ needs/workflow PNGs)
- Glance strip, definition / need guidance
- Product support cards, comparison matrix (differences-only), plan table
- Implementation differences, deep dives, screenshots, trade-offs
- Use-case / industry relevance, vendor questions, HubDecisionLinks, Finder + methodology + FAQ

Support taxonomy: supported / partially-supported / plan-dependent / limited /
not-supported / not-evidenced — unknown never renders as hard “No”.

CRM Features pillar (CRM-FEAT-000…016) editorial gate approved —
`seo.indexable: true`. Teaching PNGs under `public/features/{slug}-{hero|needs|workflow}.png`.

## Industry use-case detail template

Route: `/industries/[slug]/use-cases/[useCase]/`  
Template: `<IndustryUseCasePage />`  
Profiles: `IndustryUseCaseProfile` (`src/domain/schemas/industry-use-case.ts`) +
`src/data/industry-use-case/` + `buildIndustryUseCaseModel()` in `src/services/industry-use-case/`.

Decision-oriented (fit + scenarios), not a listicle. Capability priorities are
**industry × use-case** specific. Weighted fit uses approved criterion scores ×
configured weights when both exist — never invent percentages or scores.

Components under `src/components/industries/use-case/`:

- `IndustryUseCasePage`, `UseCaseHero`, glance strip, `CapabilityPriorityProfile`
- Short answer / product cards / scorecard / requirement matrix
- Scenarios, deep dives, screenshots, pricing CTA, trade-offs, vendor questions
- Related capabilities/use cases, Finder + methodology + FAQ + final CTA

POC: Financial Services × Advisory & Relationship Management; reuse proof =
Complex Sales Processes (different priorities, requirements, scenarios, fit).  
Soft-published / noindex until ready.

## Requirement detail template

CRM Requirements pillar (CRM-REQ-000…010) editorial gate approved —
`seo.indexable: true`. Teaching PNGs under `public/requirements/{slug}-{hero|needs|workflow}.png`.

Route: `/requirements/[slug]/`  
Contextual: `/industries/[slug]/requirements/[requirement]/`  
Template: `<RequirementDetailPage />`  
Profiles: `RequirementDetailProfile` (`src/domain/schemas/requirement-detail.ts`) +
`src/data/requirement-detail/` (depth overlays) + `buildRequirementDetailModel()` in
`src/services/requirement-detail/`.

Buyer-need bridge between capability and features — not a Feature/Capability
duplicate or SEO article. Emphasizes evaluation criteria, required vs supporting
features, product fit from linked feature evidence, plan impact, and vendor
questions. Fit statuses: strong / good / partial / limited / does-not-satisfy /
insufficient-evidence — unknown never equals failure. Coverage is evidenced
feature fraction, not invented numeric scores.

Depth layer (approved): overview, who this is for, worked examples, challenges /
outcomes, acceptance needs, trial validation workflow, unique hero/needs/workflow
visuals.

Components under `src/components/requirements/`:

- `RequirementDetailPage`, hero, glance strip, short answer, need guidance, why cards
- Depth sections (overview, challenges, how it helps, acceptance, eval workflow)
- Fit model hierarchy, evaluation criteria, feature relationship cards
- Product fit cards, scorecard, comparison matrix, deep dives, plan table
- Screenshots, scenarios, trade-offs, use cases, industry relevance
- Vendor questions, related entities, Finder CTA, methodology, FAQ

Pillar: CRM-REQ-001…010. Industry overlay example: Financial Services × Separate
Sales Processes.


Components under `src/components/industries/`:

- `IndustryHubHero` — two-column hero with priorities dashboard, CTAs, trust chips
- `IndustryGlanceStrip` — at-a-glance stats from real catalogue counts/dates
- `IndustryWhatMatters`, `IndustryUseCases` — decision framework (not product rankings)
- `IndustryProductExplorer`, `IndustryCompareTable`, `IndustryCapabilityMatrix` — catalogue + enrichment evidence only
- `IndustryFinderModule`, `IndustryCostPreview` — CRM Finder / Cost Calculator cross-links
- `IndustryHowToChoose`, `IndustryVendorQuestions`, `IndustrySecuritySection`, `IndustryImplementation`
- `IndustryComparisonsSection`, guides/FAQ via shared category components
- `IndustryResearchPanel`, `IndustryRelatedSection`, `IndustryFinalCta`
- Hub index still uses `IndustryHubHero` (index), `IndustryExploreGrid`, `IndustrySidebar`

Hub presentation: `IndustryHubProfile` (`src/domain/schemas/industry-hub.ts`) +
`src/data/industry-hub/` + `buildIndustryHubModel()` in `src/services/industry-hub/`.

Hub: `/industries/` (CRM-by-industry). Detail: `/industries/[slug]/`.  
Soft-published / noindex until researched. Stats = real catalogue counts only — no invented industry rankings or compliance badges.  
Research maturity (`unresearched` → `editorially-approved`) drives confidence copy — never expose internal “navigation shell” language.  
Industries: `app/(site)/industries/layout.tsx` wide breakout  

## Software review template

Hub presentation: `buildSoftwareReviewModel()` in `src/services/software-review/`.
All public strings run through `publicCopy()` so fixture / provisional / fact-IDs never leak.

Components under `src/components/software/`:

- `SoftwareReviewHero` — product identity, hero facts, CTAs, editorial score card (approved or pending)
- `SoftwareEditorialScoreCard` — numeric bars only when dual-approved; otherwise IN PROGRESS dimensions
- `SoftwareReviewNav` — sticky section anchors with icons
- `ProductScreenshotGallery` — verified captures only; polished empty state otherwise
- `OfficialProductVideo` / `OfficialProductVideoSection` — thumbnail-first official vendor videos; consent-gated iframe on play; never autoplay
- `SoftwareReviewVerdict`, `SoftwareProsCons`, `SoftwareScoreBreakdownPanel`
- `SoftwareFeaturesGrid`, `SoftwareFeatureBreakdown`
- `SoftwarePricingCards`, `SoftwareTeamCostEstimator`, `SoftwarePricingCompare`
- `SoftwareUseCaseCards`, `SoftwareCompetitorCards`, `SoftwareIntegrationsGrid`
- `SoftwareThingsToKnow`, `SoftwareResearchProcess`, `SoftwareRelatedGuides`
- Sidebar: `SoftwareReviewSidebar` (quick facts, CTAs, alternatives, guides)

Does **not** invent scores, testimonials, screenshots, subscriber counts, or deals.
Provisional pages still render product profile sections; only unapproved judgments stay pending.

Deep editorial layer (methodology-driven):

- `ProductWorkflow`, `DetailedCriterionReviews`, `ProductLimitationsPanel`
- `PlanDecisionTree`, `CompetitorDeepDiveCards`, `FinalVerdictPanel`
- Derived via `buildDeepReviewLayer()`; optional stored `ProductReview.deepReview`
- Docs: `docs/softwareglimpse/review-pages.md`


## Comparison template

Components under `src/components/comparison/`:

- `ComparisonHero` — title, summary, independent/provisional badge, share  
- Product cards + `ComparisonVerdictCard` — three-column snapshot  
- `ComparisonQuickTable`, `ComparisonFeatureTable`, `ComparisonChooseSection`  
- `ComparisonSidebar` — related comparisons + guides  
- Shared `SectionAnchorNav` for sticky section jumps  

Scores and CTAs follow the same gates as reviews (approved scores only; affiliate via resolve APIs). No fabricated review counts or social proof.

## Category template

Components under `src/components/category/`:

- `CategoryHero` — title, definition, CTAs, real catalogue stats, `CategoryDecisionSnapshot`
- `CategoryQuickNav` — sticky section anchors (existing destinations only)
- `CategoryExplorePaths` — Best / Finder / Compare / Calculator / Guides decision cards
- `CategoryAtAGlance`, `CategoryTypes`, `CategoryLogoStrip`, `CategoryProductGrid`
- `CategoryBestPreview` — ranked only when editorial rankings are approved
- `CategoryFinderCTA`, `CategoryUseCases`, `CategoryIndustries`, `CategoryComparisons`
- `CategoryPricingPreview`, `CategoryFeatures`, `CategoryFeatureMatrix` (verified evidence only)
- `CategoryBuyingFramework`, `CategoryGuides`, `CategoryMethodology`, `CategoryFAQ`

Hub presentation data: `CategoryHubProfile` (`src/domain/schemas/category-hub.ts`) +
`src/data/category-hub/`. Primary-category products power core lists; secondary/adjacent
membership is available via `getSoftwareByCategory({ membership })`.

No fabricated product counts, research hours, prices, scores, or “trusted by thousands.”
Internal editorial language (provisional / candidate / fixture) must never render publicly.

## Finder / tools template

Components under `src/components/finder/`:

- `FinderPageHero` — title, honest value props, abstract visual (`finder` | `calculator` | `stack`)  
- `FinderStepper` — 5-stage progress (Business → Results)  
- Card-style `FinderOption`, live matches sidebar, privacy note  
- CRM Finder scoring unchanged (deterministic fit; affiliate-blind)  

## Stack builder template

Components under `src/components/stack-builder/`:

- 5-step wizard (Business → Goals → Requirements → Preferences → Results)  
- Live draft summary sidebar; no invented combined stack cost  
- Category preview grid with CRM Finder live; other categories “coming soon”  
- Route: `/tools/software-stack-builder/` (noindex until multi-product scoring ships)  

No fabricated “trusted by thousands”, research-hour, or reader-count stats.


## Principles

- No fabricated ratings, counts, or product logos  
- Affiliate CTAs use the same button language  
- Reject / cookie actions stay clear (no dark patterns)  
- `prefers-reduced-motion` respected in tokens  

## Icons

`lucide-react` only.

## Version

`softwareglimpse-ui-v1` (`--sg-ui-version`)
