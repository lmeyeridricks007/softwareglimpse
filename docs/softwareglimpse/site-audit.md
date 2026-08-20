# Site-wide Editorial QA & Audit Engine

Deterministic-first quality layer across the SoftwareGlimpse content/product ecosystem.

Draft QA (`agent:qa`) validates a single generated draft. This engine audits **site / category / product / content / workflow / migration** scopes.

## Audit levels (never collapsed)

| Level | Question |
| --- | --- |
| **Validity** | Is data/content technically valid? Catalogue refs, research schema, category-definition alignment, enrichment enums. |
| **Readiness** | Is it complete enough to publish? |
| **Quality** | Is it useful, consistent, trustworthy? |

## Scopes

```bash
npm run audit:site
npm run audit:category -- crm
npm run audit:product -- getresponse
npm run audit:content -- content:software:pipedrive
```

## Architecture

```text
existing validators + knowledge graph + research + registry + SEO
        ↓
audit check registry (deterministic)
        ↓
issue ledger (dedupe / resolve)
        ↓
health components + remediation plan
        ↓
optional qualitative editorial-audit-agent (sampled)
```

AI is optional and only after deterministic evidence. Default qualitative sample: **none**.

## Issue model

Severities: `critical` | `high` | `medium` | `low` | `info`

Typed issues in `src/domain/schemas/site-audit.ts` (e.g. `FAKE_TESTING_CLAIM`, `ORPHAN_CONTENT`, `DUPLICATE_INTENT`, `INCONSISTENT_EDITORIAL_POSITION`, `SCHEDULED_UNSAFE`).

Issue lifecycle: `open` → `accepted` / `in-progress` / `dismissed` / `resolved` / `reopened`  
Stable IDs prevent duplicate spam across runs.

## Product ecosystem shells

`MISSING_ALT_CONTEXT` and `PRODUCT_ECOSYSTEM_GAP` are closed by deterministic, **non-indexable** catalogue shells in `src/data/seed/ecosystem-shells.ts`:

- Alternatives pages from existing `alternativeSlugs` (no invented reasons or rankings)
- Comparison pages from existing `competitorSlugs` (empty outcomes, not researched verdicts)

Agent drafts remain drafts. Shells are not a substitute for editorial approval or indexable comparison research.

Parked `software-onboarding-content` / `single-content-generation` runs whose target software is **already published** are closed with `npm run workflow:close-published` (cancels the run, rejects leftover draft approvals). That is not editorial approval and does not publish agent drafts.

`WORKFLOW_STUCK` is **blocked**, optional QA-fail that parked the run, or a required editorial wait older than `WORKFLOW_EXECUTION_CONFIG.stuckAfterMs` (24h). Fresh required approval gates are not stuck.

## Publication readiness

Per result: `PUBLISHABLE` | `PUBLISHABLE_WITH_WARNINGS` | `NOT_PUBLISHABLE` with reasons.

Critical / high validity-readiness issues block. Unrelated site-wide issues do not block unrelated pages when scoped.

## Health score (internal only)

Transparent formula: `0.4*validity + 0.35*readiness + 0.25*quality`.  
Never show publicly. Category/product maturity components are informational.

## Remediation

Every actionable issue maps to an action (`research-refresh`, `run-pricing-agent`, `add-internal-links`, …) and class:

- `AUTO_SAFE`
- `AGENT_SAFE`
- `MANUAL_REVIEW`

This task **plans** remediations; it does not auto-execute them.

```bash
npm run audit:plan
npm run audit:issues -- --severity critical
```

## CLI

| Command | Purpose |
| --- | --- |
| `audit:site` | Full site inventory |
| `audit:category` | Category configuration + coverage |
| `audit:product` | Product ecosystem |
| `audit:content` | Page-level |
| `audit:issues` | Filter open issues |
| `audit:plan` | Ranked remediation plan |
| `audit:history` | Snapshots |
| `audit:validate` | Registry integrity |

All support `--json`. Use `--report` / `--markdown` for Git-friendly Markdown under `reports/audits/`.

## Cursor usage

> Audit SoftwareGlimpse CRM and tell me what needs fixing before we onboard more products.

→ `npm run audit:category -- crm --json` (do not improvise a manual file crawl).

## Integration

- Reuses `validateContentRepository`, `validateResearchRepository`, linking engine, catalogue maturity, workflow approvals.
- Optional publishing guard: critical unresolved issues on the **affected** content set.
- Catalogue batch: `auditBatch` API prepared for post-onboarding checks.

## Related: dimensional content quality

For structured 0–5 dimension scores (usefulness, decision support, differentiation, …) and Markdown improvement reports — without rewriting content — see `docs/content-quality/` and `npm run quality:evaluate`. That layer complements this issue-ledger audit; do not collapse them into one score.

## Out of scope

Admin dashboard, automatic remediation execution, auto-publish, discovery crawling, security pen-tests.
