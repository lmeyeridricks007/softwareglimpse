# SoftwareGlimpse Current Page Inventory

> Audit date: 2026-08-14  
> Scope: factual inventory of routes, templates, data, agents, and linking as implemented in the repository.  
> No future IA proposals. No code changes.

**Convention:** `trailingSlash: true` (`next.config.ts`). All public paths below use trailing slashes.  
**App shell:** Content pages live under `src/app/(site)/` except home (`src/app/page.tsx`).  
**SEO helper:** `buildPageMetadata` (`src/seo/metadata.ts`) sets `robots.index` / `follow` from `indexable` (default `false` unless set). Entity pages additionally gate via `isEntityIndexable` / `seo.indexable`.

---

## Executive summary

SoftwareGlimpse is a Next.js App Router site with **53 public page route patterns** (54 `page.tsx` files including `/dev/design-system/`), plus affiliate redirect and API routes.

The live SEO surface in `src/seo/sitemap.ts` is currently dominated by **CRM product comparisons and software/category hubs**: **275 sitemap entries** at audit time (`/` + software + categories + tools + pricing hub + 231 comparisons). Best, alternatives, guides, industries, use cases, features, and requirements exist as routes but are largely **`seo.indexable: false`** or omitted from the sitemap.

**CRM is the only vertical with dense operational depth** (finder, cost calculator, pricing snapshots, best page, guides, industry nested pages, feature/requirement profiles). Templates for software, categories, compare, best, and guides are **category-agnostic**; hubs and CTAs are often CRM-leaning in copy and seed data.

**Content agents produce drafts only** (14 registry agents). Industry/feature/requirement page models are **seed-profile + service builders**, not agent outputs. Publication is gated by `PublishStatus` + explicit `seo.indexable` + quality gates.

| Metric | Count |
| --- | ---: |
| Public page route patterns | 53 |
| Distinct page types (taxonomy below) | 38 |
| CRM-hardcoded or CRM-primary route patterns | 22 |
| PLACEHOLDER route patterns | 3 |
| THIN route patterns | 2 |
| PARTIAL route patterns | 7 |
| Sitemap entries (runtime) | 275 |
| Software entities (public / indexable) | 27 / 27 |
| Categories (public / indexable) | 10 / 10 |
| Comparisons (public / indexable) | 231 / 231 |
| Best pages (published / indexable) | 1 / 0 |
| Guides (published / indexable) | 2 / 0 |
| Alternatives (published / indexable) | 1 / 0 |
| Industries (seeded / indexable / rich hub profile) | 13 / 0 / 1 |

---

## Route inventory table

| Route | Page type | Template/component | Static/dynamic | Indexable | CRM relevance | Implementation status | Data source | Primary links out | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | home | `src/app/page.tsx` + home components | static | **yes** (root layout) | CRM-leaning CTAs; comparisons filtered to `crm` | COMPLETE | `@/data` seeds, site foundation, assessments | categories, software, compare, best, tools, use-cases, industries, guides, search | High visual/functional maturity |
| `/software/` | software-directory | `software/page.tsx` | static | **yes** | generic | COMPLETE | `getSoftware`, categories | `/software/{slug}/`, category hubs | Filtering noted as future |
| `/software/[slug]/` | software-review | `SoftwareProductHub` | dynamic; gSP=`getSoftware()` | entity gate | generic template | COMPLETE | software + `buildSoftwareReviewModel` | category, hub tabs, related via graph | 27 public products |
| `/software/[slug]/[tab]/` | software-review | same hub | dynamic slug+tab | entity gate | generic | COMPLETE | hub tabs: features, pricing, use-cases, comparisons, alternatives, evidence, methodology, faq | tab paths via `softwareHubPath` | Overview is parent route |
| `/categories/` | category-hub | `categories/page.tsx` | static | **yes** | CRM card featured | COMPLETE | top-level categories | `/categories/{path}/` | |
| `/categories/[...slug]/` | category-hub | category hub component suite | catch-all; gSP=`getCategories()` | entity gate | generic template; CRM densest | COMPLETE | `buildCategoryHubModel` | best, compare, finder, guides, products, industries, use-cases | Nested subcategory paths |
| `/best/` | best-landing | `components/best/hub` | static | hub model (true if any best indexable) | generic hub | COMPLETE | `buildBestHubModel` | `/best/{slug}/`, tools, guides | Currently no indexable best children → hub may not force SEO |
| `/best/[slug]/` | best-detail | `components/best/guide` | dynamic; all best slugs | entity gate | CRM methodology when category=`crm` | COMPLETE | `buildBestPageModel`, editorial, guides | category, compare, guides, tools, trust links | Only `crm-software`; published, **indexable:false**, research in-progress |
| `/compare/` | comparison-landing | `components/comparison/hub` | static; `?category=` | hub model | CRM-heavy seed | COMPLETE | `buildCompareHubModel` | `/compare/{slug}/`, builder, tools | |
| `/compare/[slug]/` | comparison-detail | `ComparisonPageClient` | dynamic; slug + reversed `b-vs-a` | entity gate | generic entity | COMPLETE | `buildComparisonPageModel` | `/compare/`, product CTAs, software | 231 indexable |
| `/compare/build/` | comparison-builder | thin result page | static; `?a=&b=` | **no** | generic | PARTIAL | software + `resolveComparisonDestination` | published compare or software | Redirects or thin table |
| `/alternatives/` | alternatives-landing | list + scaffold | static | if any alt indexable | generic | PARTIAL | alternatives seeds | `/alternatives/{slug}/` | Scaffold when empty |
| `/alternatives/[slug]/` | alternatives-detail | alternatives suite | dynamic | entity gate | CRM deep-links when CRM | COMPLETE UI | alternatives + software + comparisons | software, compare, best/crm, finder | 1 published (`pipedrive`), indexable:false; 4 researching |
| `/pricing/` | pricing-landing | `pricing/page.tsx` | static | **yes** | **CRM-only** (`listCrmPricingSnapshots`) | COMPLETE | CRM pricing snapshots | calculator, `/pricing/{slug}/` | |
| `/pricing/[slug]/` | product-pricing | pricing tables + CTAs | dynamic; calculable CRM | no if fixture research | **CRM-only** | COMPLETE | pricing engine + snapshots | calculator, software, alts | 22 CRM snapshots |
| `/tools/` | tools-landing | `components/tools/hub` | static | **yes** | CRM tools featured | COMPLETE | `buildToolsHubModel` / `TOOLS_REGISTRY` | tool hrefs | |
| `/tools/crm-finder/` | finder | `CrmFinderApp` + landing | static | **yes** | **hardcoded CRM** | COMPLETE | CRM finder snapshots, comparisons | tools, calculator, research | |
| `/tools/crm-cost-calculator/` | calculator | `CostCalculatorApp` | static | **yes** | **hardcoded CRM** | COMPLETE | CRM pricing + CRM guides | best/crm, finder, pricing, guides | |
| `/tools/software-finder/` | finder | Coming-soon card | static | **no** | placeholder → CRM Finder | PLACEHOLDER | site foundation only | crm-finder, calculator, `/categories/crm/` | Registry status `coming-soon` |
| `/tools/software-stack-builder/` | stack-builder | `StackBuilderApp` | static | **no** | CRM-first | PARTIAL | tool config | `/tools/` | Multi-category incomplete |
| `/guides/` | guides-landing | `components/guides/hub` | static; filters | **no** (hardcoded) | CRM-heavy content | COMPLETE hub | `buildGuidesHubModel` | `/guides/{slug}/`, tools | Deliberately noindex |
| `/guides/[slug]/` | guide-detail | guide template v1 | dynamic; `getGuides()` | entity gate | both seeds CRM | COMPLETE | guide seeds + blocks | related guides, category, tools | `what-is-crm`, `how-to-choose-crm`; indexable:false |
| `/use-cases/` | use-case-landing | use-case hub | static | **no** | **CRM-titled/filtered** | COMPLETE hub | use cases with `crm` | detail, best/crm, finder, calculator, `/for/`, industries | Audiences link to `/for/` as unavailable |
| `/use-cases/[slug]/` | use-case-detail | detail + product grid | dynamic | only if `seo.indexable` | CRM CTAs when CRM category | PARTIAL | use-case seed + tagged software | related UC, software, tools | 9 use cases; all indexable:false |
| `/industries/` | industry-landing | industry hub index | static | **no** | **CRM-titled** | COMPLETE hub | `getIndustries` | `/industries/{slug}/`, CRM best/category | |
| `/industries/[slug]/` | industry-detail | full industry suite | dynamic; all industries | `industry.seo.indexable` | **CRM CTAs throughout** | COMPLETE shell; data varies | `buildIndustryHubModel`; profile only for FS | finder, compare, calculator, capabilities, UC | 13 industries; **0 indexable**; rich profile: `financial-services` only |
| `/industries/[slug]/capabilities/[capability]/` | capability-detail | capability suite | nested dynamic | **always no** | CRM framing | COMPLETE | `src/data/industry-capability` | industry hub | 2 FS pages |
| `/industries/[slug]/use-cases/[useCase]/` | industry-use-case | `IndustryUseCasePage` | nested dynamic | **always no** | CRM×industry | COMPLETE | `src/data/industry-use-case` | industry hub | 2 FS pages |
| `/industries/[slug]/features/[feature]/` | feature-detail | `FeatureDetailPage` | nested dynamic | **always no** | CRM | COMPLETE | feature-detail + industry context | `/features/`, industry | 2 FS×feature |
| `/industries/[slug]/requirements/[requirement]/` | requirement-detail | `RequirementDetailPage` | nested dynamic | **always no** | CRM | COMPLETE | requirement-detail + industry context | `/requirements/`, industry | 2 FS×requirement |
| `/features/` | feature-landing | card grid | static | **no** | **CRM Features** | PARTIAL | `listFeatureDetailParams` | `/features/{slug}/` | 2 features |
| `/features/[slug]/` | feature-detail | `FeatureDetailPage` | dynamic | **always no** | CRM | COMPLETE | feature-detail profiles | `/features/` | |
| `/requirements/` | requirement-landing | card grid | static | **no** | CRM | PARTIAL | requirement-detail params | `/requirements/{slug}/` | 2 requirements |
| `/requirements/[slug]/` | requirement-detail | `RequirementDetailPage` | dynamic | **always no** | CRM | COMPLETE | requirement profiles | `/requirements/` | |
| `/for/` | audience-landing | ComingSoon + list | static | **no** | planned CRM+cross-cat | PLACEHOLDER | `getAllAudiencesUnfiltered` | breadcrumbs only | **No `/for/[slug]/` route** |
| `/search/` | search | inline form | static; `?q=` | **no** | generic | THIN | substring match software/categories | software, categories | No dedicated search service |
| `/privacy-request/` | privacy-request | `FoundationPageShell` + form | static | **no** | none | COMPLETE | contact service | `/api/contact/` | |
| `/company/about/` | company | `FoundationPageShell` | static | **yes** | none | COMPLETE | site identity | company/legal | |
| `/company/my-story/` | company | foundation shell | static | **yes** | none | COMPLETE | founder bio | company | Thin if unset |
| `/company/editorial-methodology/` | methodology | methodology list | static | **yes** | lists CRM methodology among others | COMPLETE | `listMethodologies()` | company | |
| `/company/how-we-review-software/` | methodology | static steps | static | **yes** | none | COMPLETE | static copy | company | |
| `/company/contact/` | contact | `ContactHub` | static; `?reason=` | **yes** | none | COMPLETE | contact reasons | API | |
| `/legal/privacy/` | legal | `PrivacyLegalPage` | static | **yes** | none | COMPLETE | legal content | legal | |
| `/legal/terms/` | legal | `StaticLegalPage` | static | **yes** | none | COMPLETE | static | legal | |
| `/legal/cookies/` | legal | `CookiesLegalPage` | static | **yes** | none | COMPLETE | static | legal | |
| `/legal/affiliate-disclosure/` | legal | static | static | **yes** | none | COMPLETE | static | legal | |
| `/legal/editorial-independence/` | legal | static | static | **yes** | none | COMPLETE | static | legal | |
| `/legal/advertising-sponsorship/` | legal | static | static | **yes** | none | COMPLETE | static | legal | |
| `/legal/disclaimer/` | legal | static | static | **yes** | none | COMPLETE | static | legal | |
| `/legal/accessibility/` | legal | static | static | **yes** | none | COMPLETE | static | legal | |
| `/newsletter/confirm/` | newsletter | confirm flow | static; `?token=` | **no** | none | COMPLETE | newsletter service | — | |
| `/newsletter/thanks/` | newsletter | static thanks | static | **no** | none | THIN | static | finder, categories, how-we-review | |
| `/newsletter/preferences/` | newsletter | placeholder copy | static | **no** | none | PLACEHOLDER | — | — | Provider controls not live |
| `/dev/design-system/` | internal | design tokens | static | **no** | none | INTERNAL-ONLY | — | — | Not public content |

### Non-page public/internal routes

| Route | Kind | File | Notes |
| --- | --- | --- | --- |
| `/go/[product]/[[...destination]]/` | affiliate redirect | `src/app/go/.../route.ts` | `X-Robots-Tag: noindex`; disallowed in `robots.ts` |
| `/api/newsletter/subscribe/` | API | `api/newsletter/subscribe/route.ts` | |
| `/api/contact/` | API | `api/contact/route.ts` | |
| `/api/preview/` | API | draft mode enable | disallowed in robots |
| `/api/preview/disable/` | API | draft mode disable | |
| `/sitemap.xml` | sitemap | `src/app/sitemap.ts` → `src/seo/sitemap.ts` | published+indexable entities only |
| `/robots.txt` | robots | `src/app/robots.ts` | allow `/`; disallow `/go/`, `/api/preview` |

---

## Page type summary

| Page type | Route patterns | Approx. materialized URLs (audit) |
| --- | ---: | --- |
| home | 1 | 1 |
| software-directory | 1 | 1 |
| software-review (+ tabs) | 2 | 27 overview + 27×8 tabs |
| category-hub (index + catch-all) | 2 | 1 + 10 public categories |
| best-landing | 1 | 1 |
| best-detail | 1 | 1 (`crm-software`) |
| comparison-landing | 1 | 1 |
| comparison-detail | 1 | 231 (+ reverse redirects) |
| comparison-builder | 1 | 1 |
| alternatives-landing | 1 | 1 |
| alternatives-detail | 1 | 5 gSP (1 published) |
| pricing-landing | 1 | 1 |
| product-pricing | 1 | ≤22 CRM |
| tools-landing | 1 | 1 |
| finder | 2 | crm-finder + software-finder placeholder |
| calculator | 1 | 1 |
| stack-builder | 1 | 1 |
| guides-landing | 1 | 1 |
| guide-detail | 1 | 2 |
| use-case-landing | 1 | 1 |
| use-case-detail | 1 | 9 |
| industry-landing | 1 | 1 |
| industry-detail | 1 | 13 |
| capability-detail | 1 | 2 |
| industry-use-case | 1 | 2 |
| feature-landing | 1 | 1 |
| feature-detail (+ industry nest) | 2 | 2 + 2 industry nests |
| requirement-landing | 1 | 1 |
| requirement-detail (+ industry nest) | 2 | 2 + 2 industry nests |
| audience-landing | 1 | 1 (no child routes) |
| search | 1 | 1 |
| privacy-request | 1 | 1 |
| company | 4 | 4 |
| methodology (company) | counted under company | — |
| contact | 1 | 1 |
| legal | 8 | 8 |
| newsletter | 3 | 3 |
| internal | 1 | 1 |

**Distinct page types used in this audit: 38.**

---

## CRM pages currently available

### Hub
| Route | Status | Indexable |
| --- | --- | --- |
| `/categories/crm/` (and CRM subpaths if published) | COMPLETE category hub | yes if entity gate passes |
| `/use-cases/` | COMPLETE CRM use-case hub | no |
| `/industries/` | COMPLETE CRM-by-industry hub | no |
| `/features/` | PARTIAL index | no |
| `/requirements/` | PARTIAL index | no |
| `/pricing/` | COMPLETE CRM pricing index | yes |

### Best
| Route | Status | Indexable |
| --- | --- | --- |
| `/best/crm-software/` | COMPLETE; research in-progress | **no** |
| `/best/` hub | COMPLETE | depends on children |

### Software
| Route | Status | Notes |
| --- | --- | --- |
| `/software/{slug}/` (+ tabs) | COMPLETE for 27 public products | Most CRM catalogue products + some other categories |
| `/software/` | COMPLETE directory | generic |

### Comparisons
| Route | Status | Notes |
| --- | --- | --- |
| `/compare/` | COMPLETE | CRM-heavy |
| `/compare/{a}-vs-{b}/` | COMPLETE | **231** indexable (largely CRM pairs) |
| `/compare/build/` | PARTIAL noindex | |

### Tools
| Route | Status | Indexable |
| --- | --- | --- |
| `/tools/crm-finder/` | COMPLETE | yes |
| `/tools/crm-cost-calculator/` | COMPLETE | yes |
| `/tools/software-stack-builder/` | PARTIAL CRM-first | no |
| `/tools/software-finder/` | PLACEHOLDER | no |
| Registry-only (no route): `software-cost-calculator` | coming-soon | `href: null` |

### Guides
| Route | Status | Indexable |
| --- | --- | --- |
| `/guides/what-is-crm/` | COMPLETE | no |
| `/guides/how-to-choose-crm/` | COMPLETE | no |
| `/guides/` hub | COMPLETE UI | no |

### Industries
| Route | Status | Notes |
| --- | --- | --- |
| `/industries/{slug}/` | Shell for 13; rich profile **financial-services** only | all `seo.indexable: false` |
| Nested capability / use-case / feature / requirement under FS | COMPLETE noindex | 2+2+2+2 |

### Use cases
| Route | Status | Notes |
| --- | --- | --- |
| `/use-cases/{slug}/` | PARTIAL editorial depth | 9 CRM-tagged; none indexable |

### Capabilities / Requirements / Features
| Surface | Count | Indexable |
| --- | --- | --- |
| Global feature detail | 2 | no |
| Global requirement detail | 2 | no |
| Industry capability | 2 (FS) | no |
| Industry-scoped feature/requirement | 2+2 | no |

### Resources
| Route | Notes |
| --- | --- |
| No dedicated `/resources/` route | — |
| Homepage research feed / related modules | exist as components, not a resource IA |

### Company / support
| Routes | Indexable |
| --- | --- |
| About, My Story, Methodology, How We Review, Contact | yes |
| Legal suite (8) | yes |
| Privacy request, newsletter flows | no |

---

## Existing content agents/orchestrators

### Registry agents (`src/services/content-agents/registry.ts`)

Draft-only. Publication is a separate publishing/workflow step.

| Agent ID | Responsibility | Page types | Real data? | CRM? | Arbitrary categories? | Publication gating |
| --- | --- | --- | --- | --- | --- | --- |
| `software-review-agent` | Product review draft | software-review | yes (facts/methodology) | via methodology | yes if methodology | draft only |
| `pricing-page-agent` | Pricing editorial layer | pricing | yes (verified pricing) | CRM pricing mature | where pricing verified | blocks unverified |
| `comparison-agent` | A vs B draft | comparison | yes | CRM bulk scripts | pair + relationship | draft only |
| `alternatives-agent` | Alternatives draft | alternatives | approved `alternative-to` | same | same | draft only |
| `best-software-agent` | Explains approved rankings | best | rankings ≥3 | often CRM | needs methodology | REVIEW_REQUIRED if unapproved |
| `category-hub-agent` | Category hub draft | category-hub | methodology | CRM seed strong | yes | draft only |
| `use-case-page-agent` | Use-case page draft | use-case | fit/rankings | same | same | draft only |
| `guide-agent` | Guide blocks | guide | context facts | same | topic/category | draft only |
| `internal-link-agent` | Link plan (not a page) | plan | relationship graph | N/A | N/A | excludes draft targets |
| `refresh-agent` | Targeted refresh | software-review refresh | change events | same | same | never auto-publish |
| `qa-agent` | QA issues | consumes drafts | drafts | N/A | N/A | via `agent:qa` |
| `category-knowledge-planner-agent` | Knowledge plan | knowledge-plan | catalogue/clusters | default CRM fallback in one path | yes | plans only |
| `product-knowledge-planner-agent` | Product guide candidates | knowledge-plan | same | same | per product | plans only |
| `supporting-content-planner-agent` | Supporting content decisions | knowledge-plan | same | same | same | plans only |

CLI: `scripts/agent-cli.ts` (`npm run agent:*`).

Docs (`docs/softwareglimpse/content-agents.md`) list **11** agents; code registry has **14** (adds three knowledge planners).

### Orchestrators / pipelines (not page templates)

| Tool | Path | Role |
| --- | --- | --- |
| Workflow engine | `src/services/workflow-orchestration/` | software-onboarding-content, category-content, content-refresh, single-content, supporting-content |
| Workflow CLI | `scripts/workflow-cli.ts` | plan/run/approve |
| Software onboarding | `scripts/onboarding-cli.ts`, `src/services/onboarding/` | stages → `PageCandidate` → agents |
| Category onboarding | `scripts/category-onboarding-cli.ts` | category lifecycle/graph |
| Catalogue onboarding | `scripts/catalogue-cli.ts` | affiliate inventory batches |
| Research | `scripts/research-*.ts`, `src/services/research/` | facts → approve/merge |
| CRM comparisons | `scripts/materialize-crm-comparisons.ts`, `run-crm-comparison-agents.ts` | CRM pair research + agents |
| Knowledge / clusters | `scripts/knowledge-cli.ts`, `content-clusters-cli.ts` | planners/gaps |
| Publishing / SEO / audit | `publishing-cli.ts`, `seo-cli.ts`, `audit-cli.ts` | ops |
| Editorial generate | `scripts/editorial-generate.ts` | separate editorial path |

### Page types **without** dedicated content agents

Built from seed profiles + page-model services:

- Industry hub / capability / industry-use-case — `src/services/industry-hub|industry-capability|industry-use-case/`
- Feature detail / requirement detail — `src/services/feature-detail|requirement-detail/`

---

## Existing data models

From `src/domain/schemas/` (re-exported via `src/domain/index.ts`).

| Concept | Actual schema | File | Notes |
| --- | --- | --- | --- |
| Category | `CategorySchema` | `taxonomy.ts` | path, parentSlug, lifecycle, metadata, seo |
| Software/Product | `SoftwareSchema` | `software.ts` | categories/industries/useCases, pricing, scores, affiliate |
| Review | no standalone `Review`; `DeepReviewContentSchema`, `EditorialReview` | `deep-review.ts`, `editorial-review.ts` | |
| Comparison | `ComparisonSchema` | `comparison.ts` | lexicographic `a-vs-b` slug |
| Guide | `GuidePageSchema` + blocks | `guide.ts`, `guide-blocks.ts` | |
| Industry | `IndustrySchema` | `taxonomy.ts` | |
| Industry hub profile | `IndustryHubProfile` etc. | `industry-hub.ts` | researchMaturity, priorities, useCases |
| UseCase | `UseCaseSchema` | `taxonomy.ts` | categorySlugs, audienceSlugs |
| Industry×UseCase | `IndustryUseCaseProfile` | `industry-use-case.ts` | |
| Capability | `IndustryCapabilityProfile` | `industry-capability.ts` | |
| Feature | `FeatureSchema` | `taxonomy.ts` | |
| Feature detail | `FeatureDetailProfile` | `feature-detail.ts` | |
| Requirement detail | `RequirementDetailProfile` | `requirement-detail.ts` | |
| Evidence | nested `FactEvidenceSchema` | `research-fact.ts` | not top-level entity |
| Source | `ResearchSourceSchema` | `research-source.ts` | |
| Pricing | `PricingSchema` + rules | `pricing.ts` | |
| Affiliate / Promotion | affiliate schemas | `affiliate.ts` | |
| Tool | **not** Zod domain entity; `ToolDefinition` | `src/data/config/tools/registry.ts` | |
| Resource | **no** schema found | — | |
| PageCandidate | `PageCandidateSchema` | `onboarding.ts` | |
| PublicationState | type + helpers | `src/domain/publishing.ts` | not a Zod enum schema |
| Alternatives | `AlternativesPageSchema` | `alternatives.ts` | |
| Best | `BestPage` / recommendations | `best.ts` | |
| Category hub models | category-hub schemas | `category-hub.ts` | |
| Content registry | `ContentRegistryEntry` | `publishing-ops.ts` | |

Seed / profile roots: `src/data/seed/`, `src/data/industry-hub/`, `industry-capability/`, `industry-use-case/`, `feature-detail/`, `requirement-detail/`, `src/data/config/tools/registry.ts`.

---

## Existing internal-link architecture

| Surface | File | Mechanism |
| --- | --- | --- |
| Header primary nav | `src/components/navigation/site-header.tsx` | **Hardcoded:** Categories, Best Software, Comparisons, Software, Tools, Guides |
| Header category dropdown | same | **Data-driven:** `getTopLevelCategories().slice(0, 8)` |
| Footer Explore | `site-footer.tsx` | **Hardcoded:** Software, Best, Comparisons, Tools, Guides, Use Cases, Industries, Search |
| Footer Popular Categories | same | **Data-driven:** top 6 categories |
| Footer Company / Legal | same | `COMPANY_ROUTES` / `LEGAL_ROUTES` (`src/services/site-foundation/config.ts`) |
| Breadcrumbs | `src/components/seo/breadcrumbs.tsx`, per-page | **Per-page constructed** |
| Product related links | `src/services/relationships/software-links.ts`, `link-limits.ts`, graph resolve | **Graph/data-driven**; unpublished excluded |
| Internal-link agent | content-agents | Draft link plans from relationships |
| Onboarding link candidates | `src/services/onboarding/internal-links.ts` | From `PageCandidate`s |
| Sitemap | `src/seo/sitemap.ts` | Hardcoded hubs + entity loops with `isEntityIndexable` |
| Structured data | `src/seo/structured-data.ts` | Used on selected hubs (e.g. industry) |

**Documented principle** (`docs/softwareglimpse/internal-linking.md`): links from entity relationships, not hardcoded per template — with chrome nav as the main hardcoded exception.

### What is missing from global nav (but routed)

- `/pricing/`, `/alternatives/`, `/features/`, `/requirements/`, `/for/`, `/company/*` (except footer company), `/privacy-request/`
- Features/requirements/industry nests are discoverable mainly via industry hub modules and direct URLs

### Hub → child relationships that currently exist in code (examples)

Documented only where implemented in page models / components:

- Category hub → products, best preview, compare, finder CTA, guides, industries, use-cases (`buildCategoryHubModel`)
- Best → products, compare, guides, tools (CRM finder/calculator when CRM)
- Software hub → category, comparisons, alternatives, pricing tab, evidence
- Comparison → product CTAs / profiles
- Industry hub → use-cases, capabilities, finder, calculator, compare, guides (CRM-oriented hrefs)
- Industry capability → requirements / features / products (capability model)
- Feature/requirement detail → product support evidence
- Guides sidebar → tools, related, category
- Use-case hub → `/for/` (marked unavailable), industries, CRM tools/best
- Homepage → most major hubs

---

## Existing publication/research states

### Publish lifecycle — `PublishStatusSchema` (`src/domain/schemas/content-metadata.ts`)

`idea` → `researching` → `draft` → `review` → `approved` → `scheduled` → `published` → `refresh-needed` / `refreshing` → `rejected` / `archived`

Publicly available: `published` | `refresh-needed` | `refreshing` (`PUBLISHED_STATUSES`).

### Nested metadata

- `researchStatus`: `none` | `in-progress` | `complete` | `stale`
- `seoStatus`: `none` | `draft` | `optimized` | `needs-refresh`
- `seo.indexable`: explicit boolean (default false)

### Related enums

| Enum | Values | File |
| --- | --- | --- |
| FactStatus | extracted…approved/rejected/stale/conflict | `research-fact.ts` |
| ResearchJobStatus | queued…approved/failed | `research-job.ts` |
| EditorialStatus | not-assessed…outdated | `editorial.ts` |
| PageCandidateStatus | ready-to-create…blocked | `onboarding.ts` |
| IndustryResearchMaturity | unresearched…editorially-approved | `industry-hub.ts` |
| ProductLifecycle / categoryLifecycle | candidate…archived | software/taxonomy |
| ToolStatus | available / partial / coming-soon | tools registry |
| Agent readiness | READY / BLOCKED / REVIEW_REQUIRED | content-agents |

### Indexability gate (entities)

`isEntityIndexable` (`src/domain/quality-gates.ts`) requires publish availability + quality + `seo.indexable`. Sitemap uses this for software, categories, comparisons, alternatives, best.

**Notable current states:**

- Best `crm-software`: published, `researchStatus: in-progress`, **indexable false**
- Guides: published, **indexable false**; guides **index** hard-noindex
- Alternatives: 1 published noindex; 4 researching
- Industries / use cases: seeded published entities with **indexable false**
- Features / requirements / industry nests: **always noindex** in page metadata

---

## Thin / incomplete areas

| Area | Status | Evidence |
| --- | --- | --- |
| `/tools/software-finder/` | PLACEHOLDER | Coming-soon card; redirects users to CRM Finder |
| `/for/` | PLACEHOLDER | ComingSoonNotice; lists planned `/for/{slug}/` with **no child route** |
| `/newsletter/preferences/` | PLACEHOLDER | Copy: controls when provider supports them |
| `/search/` | THIN | Simple name/slug substring; noindex |
| `/newsletter/thanks/` | THIN | Static confirmation + few links |
| `/compare/build/` | PARTIAL | Redirect or thin verified table |
| `/alternatives/` | PARTIAL | Scaffold when no public list |
| `/features/`, `/requirements/` | PARTIAL | Index cards only (2 each) |
| `/use-cases/[slug]/` | PARTIAL | Product grid + related; not deep editorial article |
| `/tools/software-stack-builder/` | PARTIAL | Interactive but noindex; CRM-first |
| `/industries/*` outside financial-services | PARTIAL data | 12 industries lack `IndustryHubProfile`; model falls back with `profile: null` |
| Tools registry `software-cost-calculator` | NON-ROUTED | `href: null`, coming-soon |
| Docs IA (`docs/softwareglimpse/information-architecture.md`) | stale relative to code | Still describes many hubs as Phase-0 shells; several are now full UIs (often still noindex) |

**PLACEHOLDER patterns: 3 · THIN: 2 · clearly PARTIAL: 7** (plus thin industry data for 12 of 13 industries).

---

## Routes that appear unused or orphaned

| Item | Observation |
| --- | --- |
| `/for/` | Linked from use-cases/industries hubs; **no detail routes**; audiences listed as planned |
| `/tools/software-finder/` | Linked from header CTA patterns / docs / relationship examples; page is placeholder |
| `software-cost-calculator` tool | In `TOOLS_REGISTRY` but **no page route** |
| Features / requirements indexes | Not in header/footer; reachable via industry modules / direct URL |
| Industry nested pages | Only FS pairs exist; not in global nav |
| `/dev/design-system/` | Internal-only |
| `/go/` | Functional redirects; not content pages; robots-disallowed |
| Alternatives researching slugs | Routes generated via gSP; not indexable / not publicly listed as finished |
| Sitemap omissions | Best, alternatives, guides, industries, use-cases, features, requirements, company, legal intentionally absent or gated out of `getSitemapEntries` despite live routes |

---

## Important implementation observations

1. **Templates vs vertical depth:** Software, category, compare, best, and guide **templates are generic**; CRM provides almost all **dense seed/profile/tool** depth.
2. **Sitemap ≠ route map:** Many complete UIs are deliberately noindex / omitted from sitemap (guides hub, industries, use cases, features, requirements, best page).
3. **Publication is multi-gate:** status ∈ published family ∧ quality ∧ explicit `seo.indexable` (and sometimes non-fixture research for pricing).
4. **Agents ≠ all page types:** Industry/feature/requirement clusters are **hand-authored seed profiles** + builders; agents cover review/pricing/compare/alternatives/best/category/use-case/guide/link/refresh/QA/planners.
5. **Catch-all categories:** `/categories/[...slug]/` supports nested taxonomy without exploding route files.
6. **Software hub tabs** are first-class routes (`src/services/software-review/hub-tabs.ts`), expanding URL count beyond overview.
7. **CRM comparison scale:** 231 indexable comparisons dominate sitemap; CRM comparison scripts/agents are first-class ops.
8. **Audience IA incomplete:** `/for/` exists as shell only; no `[slug]` page under `src/app`.
9. **Tools registry is source of truth for hub**, including non-routed coming-soon tools.
10. **Nav under-represents vertical knowledge graph:** Industries/use-cases are footer-only; features/requirements/pricing/alternatives are mostly contextual.

---

## File index (primary)

| Concern | Paths |
| --- | --- |
| Routes | `src/app/page.tsx`, `src/app/(site)/**/page.tsx` |
| Sitemap / robots | `src/seo/sitemap.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| Publishing registry | `src/services/publishing/registry.ts` |
| Content agents | `src/services/content-agents/` |
| Domain schemas | `src/domain/schemas/` |
| Nav | `src/components/navigation/site-header.tsx`, `site-footer.tsx` |
| Tools | `src/data/config/tools/registry.ts` |
| Company/legal paths | `src/services/site-foundation/config.ts` |
| Linking | `src/services/relationships/`, `docs/softwareglimpse/internal-linking.md` |

---

*End of inventory. Audit only — no recommended target architecture in this document.*
