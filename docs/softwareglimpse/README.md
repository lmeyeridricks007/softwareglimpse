# SoftwareGlimpse Architecture

Implementation source of truth for the SoftwareGlimpse rebuild.

## What this is

SoftwareGlimpse is a **software decision platform**, not an affiliate blog.

Core question:

> Which software should I choose?

User activities:

- **Discover** — browse software, categories, industries, use cases
- **Decide** — compare, finders, calculators, recommendations, stack builders
- **Learn** — reviews, best-of, alternatives, pricing, guides

All three share one structured software knowledge model.

## Doc index

| Document | Purpose |
| --- | --- |
| [product-vision.md](./product-vision.md) | Product philosophy and commercial focus |
| [information-architecture.md](./information-architecture.md) | Routes, URL policy, indexability |
| [domain-model.md](./domain-model.md) | Entities, schemas, relationships |
| [content-model.md](./content-model.md) | Page-type schemas and publishing |
| [seo-architecture.md](./seo-architecture.md) | Metadata, sitemaps, structured data |
| [seo-intelligence.md](./seo-intelligence.md) | Search Console feedback, opportunities, fixture CLI |
| [content-agents.md](./content-agents.md) | Specialized content agents, QA, CLI |
| [workflow-orchestration.md](./workflow-orchestration.md) | Agent workflow DAG, approvals, resume |
| [catalogue-onboarding.md](./catalogue-onboarding.md) | Bulk affiliate catalogue import, batches, maturity |
| [site-audit.md](./site-audit.md) | Site-wide editorial QA, audit levels, remediation |
| [internal-linking.md](./internal-linking.md) | Relationship-driven links |
| [recommendation-engine.md](./recommendation-engine.md) | Deterministic scoring design |
| [crm-finder.md](./crm-finder.md) | CRM Finder UI + first engine implementation |
| [crm-cost-calculator.md](./crm-cost-calculator.md) | CRM Cost Calculator UI, handoff, pricing pages |
| [pricing-engine.md](./pricing-engine.md) | Typed pricing rules |
| [affiliate-model.md](./affiliate-model.md) | Affiliate resolution and disclosure |
| [publishing-engine.md](./publishing-engine.md) | Lifecycle, scheduling, AI readiness |
| [migration-strategy.md](./migration-strategy.md) | WordPress URL migration ledger |
| [analytics.md](./analytics.md) | Provider-agnostic events |
| [testing-strategy.md](./testing-strategy.md) | Unit/integration/e2e plan |
| [implementation-roadmap.md](./implementation-roadmap.md) | Phased delivery |
| [crm-vertical.md](./crm-vertical.md) | CRM taxonomy, graph, quality gates, tooling |
| [research-architecture.md](./research-architecture.md) | Research pipeline, provenance, freshness, CLI |
| [editorial-architecture.md](./editorial-architecture.md) | Editorial assessments, briefs, drafts, quality gates |
| [editorial-style-guide.md](./editorial-style-guide.md) | Tone, claims, disclosures, AI content policy |
| [editorial-architecture.md](./editorial-architecture.md) | Facts→Assessment→Draft→Approval pipeline; review routing; CRM methodology |
| [editorial-style-guide.md](./editorial-style-guide.md) | Tone, claims, ratings, disclosures, AI/testing policy |

## Code boundaries

```text
src/
├── app/           # Next.js routes (presentation only)
├── components/    # Reusable UI (schema-driven, no product hardcoding)
├── domain/        # Zod schemas, publish gates, pure domain types
├── data/          # Seed content + repository/data-access layer
├── services/      # Affiliate, relationships, research, editorial, recommendation, seo intelligence
├── seo/           # Metadata, breadcrumbs, sitemap, JSON-LD
├── analytics/     # Thin event API
├── lib/           # Site constants, URL helpers
└── styles/        # Design tokens
```

Editorial CLI:

```bash
npm run editorial:generate -- software pipedrive
npm run editorial:validate
npm run editorial:report -- pipedrive
```

Publishing CLI (UTC; Level 2 automation — schedule publish + refresh drafts, never auto-publish editorial):

```bash
npm run publishing -- status --category crm
npm run publishing -- calendar --from 2026-08-01 --to 2026-09-30
npm run publishing -- graph -- pipedrive
npm run publishing -- publish --dry-run
npm run publishing -- validate
npm run refresh:scan
```

SEO intelligence CLI (fixture-first; synthetic data — not live GSC):

```bash
npm run seo -- sync --fixture
npm run seo -- status
npm run seo -- opportunities --type comparison-opportunity
npm run seo -- query -- "pipedrive vs close"
npm run seo -- validate
```

Software onboarding CLI (orchestrates research/content plan — never auto-publishes):

```bash
npm run onboard:software -- getresponse --source affiliate-catalogue
npm run onboard:software -- pipedrive --skip-research
npm run onboard:status -- getresponse
npm run onboard:plan -- getresponse
npm run onboard:validate
```

Category onboarding CLI (decision-domain config — never auto-publishes hubs/rankings):

```bash
npm run onboard:category -- email-marketing
npm run onboard:category -- crm --reconcile
npm run onboard:category:status -- email-marketing
npm run onboard:category:resume-software -- getresponse email-marketing
npm run onboard:category:validate
```

Canonical product reviews render at `/software/{slug}/` (not `/reviews/`).
## Non-negotiables

1. One canonical software entity per product (multi-taxonomy via refs).
2. No fabricated facts (pricing, scores, features, commissions).
3. No affiliate-first ranking.
4. No mass thin programmatic pages — indexability is earned.
5. Presentation must not import raw seed file paths.
6. CMS may replace the data layer later without rewriting UI.

## Current phase

**Phase 2 in progress — Editorial intelligence + content rendering** (assessments, briefs, deterministic generation, review/comparison/alternatives/best editorial layers).
Phase 1 CRM catalogue + research foundation remains in place.
