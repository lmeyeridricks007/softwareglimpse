# Specialized Content Agents

SoftwareGlimpse uses **specialized content agents**, not one generic writer.

Each agent has a stable ID, version, readiness contract, constrained context, structured draft output, validation, and QA. Agents create **drafts only** — never published pages. Missing alternatives/comparison **catalogue shells** are generated from existing peer slugs in `src/data/seed/ecosystem-shells.ts` (non-indexable, no invented reasons). Do not hand-write those pages in chat.

## Framework

```text
ContentAgent
  canRun(context) → READY | BLOCKED | REVIEW_REQUIRED
  buildBrief(context) → AgentBrief
  execute(brief, context) → AgentDraftBundle
  validate(output, context) → ValidationResult
```

Registry: `src/services/content-agents/registry.ts`  
Contracts: `src/domain/schemas/content-agents.ts`  
Context builder: `src/services/content-agents/context-builder.ts`  
Runner: `src/services/content-agents/runner.ts`  
Provider profiles: `src/data/config/agents/provider-profiles.ts`  
Prompts: `src/services/content-agents/prompts/`

## Registry (v1.0.0)

| Agent ID | Purpose |
| --- | --- |
| `software-review-agent` | Canonical product review |
| `pricing-page-agent` | Editorial layer on pricing-engine data |
| `comparison-agent` | A vs B decision pages |
| `alternatives-agent` | Approved alternatives only |
| `best-software-agent` | Explains approved rankings (does not invent order) |
| `category-hub-agent` | Category decision/navigation hub |
| `use-case-page-agent` | Audience-specific pages |
| `guide-agent` | Educational / informational |
| `internal-link-agent` | Deterministic link plan |
| `refresh-agent` | Change-driven targeted updates |
| `qa-agent` | Draft QA (typed issues, not a score) |

### Discovery agents (reports only — not draft writers)

| Agent | Purpose | CLI |
| --- | --- | --- |
| `software-asset-discovery-agent` (**SoftwareAssetDiscoveryAgent**) | Audit every software/product page for official asset opportunities; write Markdown recommendations | `npm run assets:agent:software -- --all --write` |
| `guide-asset-discovery-agent` (**GuideAssetDiscoveryAgent**) | Audit guides/articles for official, authoritative, and original visual opportunities | `npm run assets:agent:guides -- --all --write` |
| `asset-opportunity-prioritization-agent` (**AssetOpportunityPrioritizationAgent**) | Prioritize asset opportunities into A0–A3 enrichment backlog (impact, not count); detect TEMPLATE FIX patterns | `npm run assets:agent:prioritize -- --write` |
| `content-asset-intelligence-orchestrator` (**ContentAssetIntelligenceOrchestrator**) | Periodic inventory → discovery → prioritize → master asset intelligence report (no content mutation) | `npm run assets:intelligence` |
| `resource-quality-agent` (**ResourceQualityAgent**) | Score every `/resources/` page for purpose, artifact, stage fit, linking, downloads, SEO | `npm run resources:quality` |
| `resource-ecosystem-agent` (**ResourceEcosystemAgent**) | Identify missing/overlapping resources and journey gaps (does not create resources) | `npm run resources:ecosystem` |
| `content-intelligence-orchestrator` (**ContentIntelligenceOrchestrator**) | Full quality → backlog → gaps → master recommendations (no content mutation) | `npm run content:intelligence` |
| `website-intelligence-orchestrator` (**WebsiteIntelligenceOrchestrator**) | Master site quality + SEO + competitor + ranking assessment (no site mutation) | `npm run site:intelligence` |
| `page-ranking-readiness-agent` (**PageRankingReadinessAgent**) | Per-page ranking readiness / feasibility + competitor benchmark (no ranking promises, no mutation) | `npm run site:page-readiness -- <route>` |
| SEO audit suite (**SEOHealthOrchestrator** + 7 agents) | Local technical / links / coverage / schema / perf / media / outbound ANALYZE→REPORT→RECOMMEND | `npm run seo:audit` (`docs/seo/README.md`) |
| `authority-intelligence-orchestrator` (**AuthorityIntelligenceOrchestrator**) | Foundational seed discover→qualify→angles (`authority:seed`) | `npm run authority:seed` |
| `authority-visibility-intelligence-orchestrator` (**AuthorityVisibilityIntelligenceOrchestrator**) | Master recurring report: earned/paid/PR/presence/partners/promotion + scorecard + 30/90/180 plans (no outreach/purchases) | `npm run authority:intelligence` / `authority:audit` |
| `earned-backlink-opportunity-agent` (**EarnedBacklinkOpportunityAgent**) | Live-web search hits → Top 50 realistic free/earned link opportunities + reject list (no outreach) | `npm run authority:links` |
| `paid-promotion-opportunity-agent` (**PaidPromotionOpportunityAgent**) | Live-web paid promo channels (newsletters, podcasts, events, directories for visibility) + experiments; avoids dofollow/SEO-link schemes; never purchases | `npm run authority:paid` |
| `digital-pr-opportunity-agent` (**DigitalPROpportunityAgent**) | Data-led digital PR / citation assets from real SG research corpus + publication/commentary matches; never invents stats or pitches | `npm run authority:pr` |
| `presence-opportunity-agent` (**PresenceOpportunityAgent**) | Directory/listing presence for visibility (not paid SEO links); never submits forms | `npm run authority:presence` |
| `partnership-opportunity-agent` (**PartnershipOpportunityAgent**) | Mutual-value partnership candidates (consultancies, communities, vendor ecosystems); rejects link exchange & false SI claims; never contacts partners | `npm run authority:partners` |
| `content-promotion-opportunity-agent` (**ContentPromotionOpportunityAgent**) | Audience-fit promotion plans for priority tools/resources; repurposing ideas + tool launches; never posts or spam communities | `npm run authority:promotion` |
| `catalogue-content-opportunity-agent` (**CatalogueContentOpportunityAgent**) | Category-scoped audit: reviews, 5-kind packs, educational guides, best-page gaps, affiliate deepen opportunities (no mutation) | `npm run catalogue:opportunities` |
| `catalogue-category-expansion-agent` (**CatalogueCategoryExpansionAgent**) | Net-new category and subcategory hub opportunities with recommended products per vertical; launch sequence and recategorization notes (no mutation) | `npm run catalogue:category-expansion` |

SoftwareAssetDiscoveryAgent never edits product pages or auto-publishes ResearchMedia. GuideAssetDiscoveryAgent never edits guides. AssetOpportunityPrioritizationAgent never implements assets. ContentIntelligenceOrchestrator never creates/publishes pages. WebsiteIntelligenceOrchestrator never mutates production content, canonicals, robots, or affiliate links — report and recommend only. PageRankingReadinessAgent never promises rankings and never mutates pages. ContentAssetIntelligenceOrchestrator never auto-edits content (asset recommendations only). SEO audit agents never change canonicals, robots, copy, scores, or affiliate links. AuthorityIntelligenceOrchestrator / AuthorityVisibilityIntelligenceOrchestrator never send outreach, submit forms, buy placements, or mutate production content. EarnedBacklinkOpportunityAgent never invents URLs or sends outreach — it qualifies live-verified hits only. PaidPromotionOpportunityAgent never purchases placements or recommends paying for dofollow/SEO juice — report and experiment design only. DigitalPROpportunityAgent never invents statistics or pitches journalists — corpus-grounded PR ideas and live matches only. PresenceOpportunityAgent never submits directory forms. PartnershipOpportunityAgent never contacts partners, never recommends mass link exchange, and never misrepresents SoftwareGlimpse as an implementation partner. ContentPromotionOpportunityAgent never posts to communities, never automates Reddit, and never generates fake social proof — channel-fit plans and angles only. CatalogueCategoryExpansionAgent never mutates taxonomy, onboarding state, or product primary categories — expansion recommendations only. Approved imports use `npm run assets:approve` (discovery ≠ approval) — see `docs/content-assets/02-approved-asset-workflow.md`. See also `docs/content-assets/`, `docs/content-quality/`, `docs/seo/README.md`, `docs/site-intelligence/`, and `docs/authority/`.

## Outbound linking (commercial vs research)

1. Load approved evidence and prefer primary vendor sources.
2. Attach source references to factual claims; validate URLs before publication.
3. Commercial CTAs → `SoftwareCta` / `AffiliateLink` (direct affiliate URL, `rel=sponsored`).
4. Evidence / pricing / docs → `ExternalLink` / `EvidenceSourceLink` (never affiliate URLs).
5. Never invent outbound links solely for SEO; never use affiliate destinations as evidence.
6. Record source verification dates; flag unavailable sources for research refresh.
7. Official product videos → `ProductMedia` on enrichment; render via `OfficialProductVideo`. Video source links stay editorial (`vendor-official`), never affiliate.

### Official product videos (when generating product / feature / requirement pages)

1. Search canonical `ProductResearchEnrichment.media` relationships (`featureIds`, `requirementIds`, `capabilityIds`, `useCaseIds`, `placements`).
2. Select only public-eligible official videos (`officialSource`, verified/published, title + source URL).
3. Prefer specific workflow / tutorial videos over generic brand promos.
4. Do not repeat the same video multiple times on one page.
5. Video evidence may support feature existence / workflow / UI / setup claims — never pricing, security certification, performance, or comparative superiority by itself.
6. Always keep “Watch on YouTube ↗” (or vendor source) as an ordinary editorial link.

## Shared context

Agents may receive: approved/verified facts, assessments, methodology, approved relationships, pricing-engine examples, SEO intent hints, approved rankings, change events, CTA budget.

Agents must **not** receive: full repository dumps, affiliate commission/payout/revenue fields, unverified candidate research (unless explicitly configured for research-stage POC).

## Fact boundary

- Approved/verified claims → allowed  
- Unknown → omit / qualify  
- Invented detail → prohibited  

## Generation provider

Provider-neutral `GenerationProvider`. Default: `deterministic-v1` (no live LLM in CI). Live OpenAI/Anthropic/Gemini profiles exist but are unconfigured until enabled.

## No direct publication

```text
draft → validation → QA → editorial approval → publishing engine
```

## QA

Typed issues include: `UNSUPPORTED_FACT`, `UNVERIFIED_NUMBER`, `FAKE_TESTING_CLAIM`, `RANKING_CHANGED`, `AFFILIATE_BIAS`, `MISSING_REQUIRED_SECTION`, `BROKEN_INTERNAL_LINK`, `STALE_CRITICAL_FACT`, `THIN_CONTENT`, `DUPLICATE_INTENT`, `SEO_METADATA_INVALID`, …

`BROKEN_INTERNAL_LINK` also fires when a draft href points at `/software/`, `/use-cases/`, or `/categories/` slugs that are not in the live catalogue. Do not invent competitor or use-case slugs.

Result: `pass` | `pass-with-warnings` | `fail` (never a single score).

## Revision

`reviseDraft` targets affected sections from QA issues and keeps history under `src/data/agents/revisions/`.

## CLI

```bash
npm run agent:list
npm run agent:status
npm run agent:ready
npm run agent:ready -- getresponse
npm run agent:run -- software-review -- getresponse
npm run agent:run -- software-review -- getresponse --dry-run --json
npm run agent:run -- pricing-page -- pipedrive
npm run agent:run -- comparison -- freshsales-vs-pipedrive
npm run agent:run -- alternatives -- pipedrive
npm run agent:run -- best-software -- crm-software
npm run agent:run -- category-hub -- crm
npm run agent:run -- refresh -- pipedrive --change pricing-changed
npm run agent:qa -- <draft-id>
npm run agent:revise -- <draft-id>
npm run agent:validate
```

## Task integration

Onboarding `AgentHandoffTask` maps into `AgentRunTask` via `handoffToRunTask`. Ready report: `npm run agent:ready`.

Bulk execution of all READY tasks is **not** implemented yet (Prompt 12).

## Security

Minimal generation context only. No secrets, no affiliate credentials, no arbitrary HTML/React execution — structured text/data only.

## Cursor

Thin Cursor guidance may invoke these services/CLI commands. **Business logic stays in the repository**, not in Cursor prompt files.

## Related

- Editorial pipeline: `docs/softwareglimpse/editorial-methodology.md` (if present)
- Style: `docs/softwareglimpse/editorial-style-guide.md`
- Onboarding handoffs: software + category onboarding docs
