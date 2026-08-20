# Implementation roadmap

## Phase 0 — Architecture foundation ✅

Docs, schemas, taxonomy seeds, CRM product stubs, data layer, route skeletons, SEO utilities, nav, Pipedrive vertical slice, tests.

## Phase 1 — Software catalogue + CRM hub ✅ (this delivery)

- Deep CRM + Sales Intelligence taxonomy (supported vs indexable hubs)
- Business dimensions (size, team, type, use cases, priorities)
- Typed knowledge-graph relationships with symmetric resolution
- Comparison / alternatives / best page models + seeds
- Quality gates + centralized indexability
- CRM category decision hub
- Grouped software catalogue
- Internal linking with limits
- Content validation + graph CLI
- Search index utility (server-side)

Still deferred inside Phase 1+: researched rankings, WP migration ledger population, subcategory landing pages.

## Phase 1b — Structured product research ✅ (this delivery)

- Research source/fact/snapshot/job schemas
- Fixture-based discover → fetch → extract → normalize → approve → merge pipeline
- Source priority + conflict detection
- Freshness policies + domain completeness
- Pipedrive / Freshsales / Apollo fixture POCs
- Research CLI (`research:product`, `research:status`, `research:validate`)
- Product page trust notes + sources list from enrichment overlay

## Phase 2 — Reviews / best / alternatives / comparisons

- Enrich CRM/sales entity facts with researched provenance
- Strong `/categories/crm/` hub content
- Category-aware internal linking polish
- Begin WP migration inventory → ledger

## Phase 2 — Reviews / best / alternatives / comparisons

- Purpose-specific content schemas + first real pages
- `/alternatives/{slug}/`, `/compare/{pair}/`, `/best/...` with quality gates
- Editorial scores only when reviewed

## Phase 3 — CRM Finder

- Finder UI collecting `RecommendationCriteria`
- Wire to scoring stubs / filters before full engine if needed

## Phase 4 — Pricing engine + CRM Cost Calculator

- Populate typed pricing rules for CRM cluster
- Evaluators + `/pricing/{slug}/` + calculator tool

## Phase 5 — Recommendation engine

- Versioned scoring config
- Explainable ranking
- Affiliate-independent sort
- Finder completion analytics

## Phase 6 — Publishing + scheduling engine

- Editorial workflow tooling
- Scheduled publish automation
- Refresh queue (`nextReviewAt`)

## Phase 7 — AI research/content pipeline

- Research → evidence → draft → quality/SEO agents
- Human editorial gate retained

## Phase 8 — Search Console + analytics feedback ✅

- GA4 sink, GSC imports (fixture pathway)
- Opportunity scoring from queries/pages
- SEO CLI + content queue handoff

## Phase 8b — Software onboarding orchestrator ✅

- Resumable stage workflow (identity → taxonomy → research → content plan)
- Candidate product overlay + reconcile mode
- Agent handoff tasks (no auto-publish / no editorial scores)
- GetResponse affiliate-catalogue POC + Pipedrive reconcile

## Phase 9 — Additional category hubs / Category Onboarding ✅

- Category Onboarding Orchestrator (scope, features, methodologies, pricing dims)
- Email Marketing POC + CRM reconcile
- Activation flips software onboarding `categoryContentReady`
- Agent context DTO for future specialized content agents

## Phase 10 — Specialized content agents + stack builder

- CategoryHub / Best / Comparison / Review agents consuming category context
- Multi-product stack recommendations
- NL → criteria → deterministic engines

## Phase 10b — Agent workflow orchestrator ✅

- Dependency-aware DAG, resumability, approval gates, content task queues
- Software / category / refresh / single-content definitions
- CLI: `workflow:*`, `approval:*`

## Phase 11 — Bulk catalogue onboarding ✅

- Existing-only affiliate inventory (87 programmes)
- Normalize → classify → map → commercial priority → maturity
- Controlled batches (3–5) via software workflows; no auto-publish
- CRM reconcile + Email Marketing / HR cluster planning + composite/non-software routes
- CLI: `catalogue:*` — see `docs/softwareglimpse/catalogue-onboarding.md`

## Phase 12 — Site-wide Editorial QA & Audit Engine ✅

- Validity / readiness / quality layers (not one score)
- Check registry reusing content/research validators + linking/SEO/maturity
- Issue ledger with dedupe/resolve; transparent internal health formula
- Remediation planner (AUTO_SAFE / AGENT_SAFE / MANUAL_REVIEW) — no auto-exec
- Optional qualitative editorial-audit-agent (sampled; default off)
- CLI: `audit:*` — see `docs/softwareglimpse/site-audit.md`

## Dependency notes

- Finder (3) can ship with filter-only ranking before full scoring (5), but pricing estimates in recommendations need Phase 4.
- AI pipeline (7) depends on solid schemas + publish gates (0/6).
- Do not start programmatic SEO expansion until Phase 2 quality rules are enforced in code.
- Platform construction is largely complete — next: **controlled catalogue onboarding by category** using orchestrators/agents (do not auto-start bulk execution).
- Bulk affiliate onboarding calls workflow orchestration after Category Onboarding for non-CRM verticals.
