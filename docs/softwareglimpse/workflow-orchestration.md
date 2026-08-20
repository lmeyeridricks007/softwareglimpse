# Workflow Orchestration

Deterministic coordination layer for SoftwareGlimpse specialized agents and platform services.

AI agents perform **bounded tasks**. They do **not** decide the platform workflow.

```text
Workflow Definition
↓
Dependency Graph (DAG)
↓
Task Readiness
↓
Specialized Agent
↓
Validation + QA
↓
Editorial approval gate
↓
Publishing Engine (manual / explicit)
```

## Definitions (v1.0.0)

| ID | Target |
| --- | --- |
| `software-onboarding-content` | Product content after onboarding |
| `category-onboarding-content` | Category hub / best / use-case |
| `content-refresh` | Change-event refresh |
| `single-content-generation` | One explicit agent target |

Location: `src/services/workflow-orchestration/definitions/`

## Step lifecycle

`pending` → `ready` → `running` → `completed` | `completed-with-warning` | `blocked` | `waiting` | `review-required` | `failed` | `skipped` | `cancelled` | `stale`

## Dependency / DAG

- Steps become `ready` only when dependencies satisfy completion policy.
- Cycles rejected at definition validation.
- Independent steps can be ready together; execution concurrency defaults to **1**.
- Optional blocked steps use `continue-with-warning` so required paths can finish.

## Agent integration

Handler `agent-run` calls `runContentAgent` / readiness via `canRun`. Workflow does not know agent internals.

## QA / revision

Agent drafts go through validation + QA. Limited automatic targeted revision (`maxAutomaticRevisions=1`) for known issue types. Otherwise `review-required`.

Optional steps with `continue-with-warning` that land in `review-required` (typically pricing QA fail) **do not** halt the required path. Resume demotes those steps to `completed-with-warning` so editorial approval can run. Required editorial gates still stop the workflow.

## Approval gates

Handler `approval-check` creates `ApprovalRecord` (`editorial` by default) and sets step `waiting` → workflow `review-required`.

```bash
npm run approval:list
npm run approval:approve -- <id>
npm run approval:reject -- <id> --reason "..."
npm run workflow:resume -- <run-id>
```

**No automatic publishing.** Pre-publish validation marks `READY_TO_PUBLISH` only after approval; publish/schedule handlers are skipped unless explicitly configured later.

## Retry / failure

Central config: `src/data/config/workflows/execution.ts`

- Retry: provider timeout / rate limit / transient
- Do not retry: quality failure, missing methodology, QA fail, taxonomy errors

## Resumability / idempotency

- Completed steps are not re-executed on resume
- Active target lock prevents concurrent workflows for same target
- New run supersedes prior active run
- Onboarding/content-plan handlers reuse existing runs

## Stale context

Steps store `inputSnapshot` (fact IDs, methodology version, agent version). Pre-publish validation + `detectStaleDraft` block publish when critical facts changed. Resume can re-queue `stale` steps.

## CLI

```bash
npm run workflow:definitions
npm run workflow:plan -- software getresponse
npm run workflow:execute -- software getresponse
npm run workflow:status -- <run-id>
npm run workflow:ready
npm run workflow:blocked
npm run workflow:resume -- <run-id>
npm run workflow:cancel -- <run-id> --reason "..."
npm run workflow:close-published
npm run workflow:validate
npm run workflow:metrics
npm run approval:list
```

Machine-readable: add `--json`.

## Services API

```ts
createSoftwareWorkflow({ productId })
runWorkflow(runId)
resumeWorkflow(runId)
getWorkflowStatus(runId)
planWorkflow(definitionId, targetId)
```

## Final content order

```text
content generation → deterministic validation → QA (+ optional 1 revision)
→ internal-link plan (after review draft)
→ editorial approval
→ pre-publish validation
→ READY TO PUBLISH (manual publishing engine)
```

## Limitations

- No bulk catalogue execution
- No automatic editorial approval or publish (`publishAfterApproval` remains false)
- Parked onboarding/content runs for **already-published** software can be cancelled via `workflow:close-published`; drafts stay unpublished
- Optional QA-fail continues the required path; it does not publish those drafts
- Workflow definition changes do not migrate old runs (new runs use new version)
- Concurrency fixed at 1 for reliability

## Cursor

Thin rule: invoke workflow planner/execute/status; do not reimplement research/content logic in prompts.
