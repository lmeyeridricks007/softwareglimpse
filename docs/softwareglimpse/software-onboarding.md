# Software onboarding orchestrator

Coordinates existing research, taxonomy, relationships, pricing readiness, content planning, and agent handoff — without duplicating those engines.

## Core principle

```text
Onboarding request
→ identity + duplicate check
→ taxonomy
→ research plan → research pipeline
→ enrichment policy (approve/merge only)
→ relationship candidates
→ pricing / finder / editorial readiness
→ content map + agent tasks
→ READY FOR CONTENT PIPELINE (not published)
```

This is **not** “prompt AI to write a review.”

Hard boundaries:

- Does **not** auto-publish
- Does **not** assign editorial scores / best rankings
- Affiliate may link inventory → product, never rankings
- Does **not** invent categories or pairwise comparisons without caps

## Stages

1. intake  
2. identity  
3. duplication-check  
4. taxonomy  
5. research-planning  
6. research  
7. enrichment  
8. relationship-resolution  
9. editorial-readiness  
10. pricing-readiness  
11. content-mapping  
12. internal-link-planning  
13. validation  
14. onboarding-summary  

Runs are resumable (`--resume <run-id>`). Completed stages are skipped.

## New vs reconcile

| Situation | Mode |
| --- | --- |
| Unknown slug / no match | `new` — writes candidate under `src/data/onboarding/candidates/` |
| Exact slug / alias / website match | `reconcile` — no second entity |
| Ambiguous overlap | `POSSIBLE_DUPLICATE` blocker |

Candidates overlay the catalogue (seed wins on slug collision). Public indexability stays `false` until publishing lifecycle promotes content.

## Identity / duplicates

Checks: name, slug, aliases, formerlyKnownAs, website host, migration ledger mentions, affiliate catalogue hints.

Entity types: `software | service | marketplace | platform | hybrid`.  
`service` / `marketplace` → `NOT_STANDARD_SOFTWARE` (no blind `/software/` create).

## Taxonomy

Uses existing category seeds. Prefer suggested / affiliate hints; light name heuristics only as fallback. Missing category → `CATEGORY_GAP` (feeds future Category Onboarding). Low confidence → review warning. Category without methodology → `CATEGORY_NOT_READY` warning; research continues, content may be `category-blocked`.

## Research integration

`buildResearchPlan` reads `src/data/config/onboarding/policy.ts` category overrides, then calls `runResearchPipeline`. Onboarding does **not** scrape. Provider/fixture failure → stage `blocked`, run resumable.

## Pricing readiness

`FULL | PARTIAL | CUSTOM_QUOTE | UNSUPPORTED_MODEL | INSUFFICIENT_RESEARCH`  
Unsupported models emit enhancement requirements — no calculator hacks.

## Relationships

Candidates only (`candidate | approved | rejected`). Origins: taxonomy, graph, manual, research, editorial. Same-category peers capped. Never auto-approved into editorial graph.

## Content planning

Page candidates: software review, pricing, alternatives, comparisons (max 5), best-page **eligibility** (not ranking). Statuses include `ready-to-create`, `research-required`, `relationship-review-required`, `category-blocked`, `duplicate`, `blocked`, `not-recommended`.

## Agent handoff

Tasks use `AgentHandoffTask` (`agentType`, dependencies, `READY|BLOCKED|WAITING|COMPLETE`, `briefInput`). Agent types prepared: research, software-review, pricing-page, comparison, alternatives, best-page, category-hub, use-case, guide, internal-link, refresh, qa.

## CLI

```bash
npm run onboard:software -- getresponse --source affiliate-catalogue
npm run onboard:software -- getresponse --dry-run --skip-research
npm run onboard:software -- pipedrive --skip-research
npm run onboard:software -- --resume onboard-getresponse-...
npm run onboard:status -- getresponse
npm run onboard:list
npm run onboard:plan -- getresponse
npm run onboard:plan -- getresponse --json
npm run onboard:validate
```

Programmatic API:

```typescript
import { onboardSoftware } from "@/services/onboarding";

await onboardSoftware({
  name: "GetResponse",
  source: "affiliate-catalogue",
  suggestedCategoryIds: ["marketing"],
});
```

## Storage

```text
src/data/onboarding/
  candidates/   # Software skeletons (catalogue overlay)
  runs/         # SoftwareOnboardingRun JSON
  manifests/    # Compact per-product orchestration state
```

## Manual review points

- Uncertain identity / possible duplicate  
- Category gap / low-confidence taxonomy  
- Competitor relationships  
- Unsupported pricing model  
- Best-page ranking (never decided here)  
- Editorial assessments  

## Failure recovery

Blocked research keeps prior stages. Configure fixtures/provider, then `--resume <run-id>`.

## Bulk readiness

`onboardSoftware(request)` is callable in a loop (Prompt 13). Per-product isolated state; no concurrency infrastructure yet.

## GetResponse POC notes

Affiliate catalogue hint + marketing category. Identity fixture under `src/data/research/getresponse/` is **labeled fixture** — not live vendor truth. Marketing category content may be `category-blocked` until Category Onboarding adds methodology.
