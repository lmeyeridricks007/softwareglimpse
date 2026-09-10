# Product testing system

SoftwareGlimpse can progressively replace research-only coverage with **genuine first-hand product evaluation**.

This system **assists a human tester**. It must **never impersonate one**.

AI / content pipelines must **never** claim SoftwareGlimpse tested a product unless a **completed** `ProductTestSession` with a real human `testerId` exists.

Related: [`EDITORIAL-SYSTEM.md`](./EDITORIAL-SYSTEM.md) · [`PRODUCT-TESTING-QUEUE.md`](./PRODUCT-TESTING-QUEUE.md) · [`PRODUCT-TESTING-REFRESH-TASKS.md`](./PRODUCT-TESTING-REFRESH-TASKS.md)

---

## Hard rules

1. Incomplete sessions (`draft`, `in_progress`, `abandoned`) are **never** public.
2. Public hands-on claims require `status === "completed"`, `completedAt`, `testerId`, and `finalAssessment.recommendHandsOnClaim !== false`.
3. `internalNotes` are workspace-only — never auto-published.
4. Evidence marked `public: false` stays off review/comparison pages.
5. Task results are human-entered. Do **not** auto-PASS because a pipeline ran.
6. Completing a session requires **all required protocol tasks** human-recorded (not auto-PASS) **and** at least one strength or weakness. Empty drafts cannot be finished.
7. Never fabricate completed sessions to inflate coverage metrics.

Evidence levels still apply:

| Level | Meaning |
|---|---|
| Researched | Structured research / methodology |
| Data verified | Pricing/data verification timestamps |
| Hands-on tested | Valid completed human test session (or legacy assessment flags that already meet both `handsOnTesting` + `testedAt`) |

---

## Data model

Schema: `src/domain/schemas/product-testing.ts`

### ProductTestSession

Supports: `productSlug` / optional `productId`, `testerId`, `startedAt`, `completedAt`, `productVersion`, `planTested`, `testEnvironment`, `testScenario`, `evidenceLevel`, `notes`, `internalNotes`, `screenshotPaths`, `tasks`, `observations`, `issues`, `setupMinutes`, `pricingObserved`, `pricingVerifiedAt`, `finalAssessment`, `evidenceIds`.

Store: `src/data/editorial/testing/sessions/{sessionId}.json`

### Task status

`NOT_STARTED` · `PASS` · `PARTIAL` · `FAIL` · `NOT_AVAILABLE` · `NOT_APPLICABLE`

Plus per-task: `notes`, `internalNotes`, `timeSpentMinutes`, `evidenceIds`, `screenshotPaths`.

### Evidence library

Kinds: `SCREENSHOT` · `OBSERVATION` · `TIMING` · `PRICING` · `FEATURE_TEST` · `INTEGRATION_TEST` · `LIMITATION` · `SUPPORT_TEST`

Each record references: product, session, date, tester, optional task.

Store: `src/data/editorial/testing/evidence/{evidenceId}.json`

Screenshots uploaded from the workspace land under `public/testing-evidence/{product}/{session}/`.

---

## Category protocols

| Protocol | Category | Module |
| --- | --- | --- |
| `crm-hands-on` | CRM | `protocols/crm.ts` |
| `email-marketing-hands-on` | Email marketing | `protocols/email-marketing.ts` |
| `sales-intelligence-hands-on` | Sales intelligence | `protocols/sales-intelligence.ts` |

Registry: `src/data/editorial/testing/protocols/index.ts`

CRM workflow: create account → onboarding → import contacts → company → pipeline → deal → move deal → automation → report → email/integration → search → permissions → mobile → admin → help/support → setup friction → verify pricing.

**Completion rule:** every **required** task must be human-recorded (PASS / PARTIAL / FAIL / NOT_AVAILABLE / NOT_APPLICABLE). Tasks never auto-PASS. Optional tasks may remain NOT_STARTED.

Top-10 prep: `npm run testing:prepare-top-10` · packs in `docs/editorial/HANDS-ON-TESTING-WAVE-TOP-10-*.md`
---

## Testing workspace (internal)

| Surface | Path |
|---|---|
| UI | `/dev/product-testing/?secret=$TESTING_SECRET` (or `PREVIEW_SECRET`) |
| API | `/api/dev/product-testing/` with `x-testing-secret` or `?secret=` |
| Upload | `/api/dev/product-testing/upload/` (multipart image upload) |

Noindex · `pageType: "internal"` · returns 404 without secret.

Capabilities: choose product, start session, follow checklist, notes, **time spent**, **secure screenshot upload**, timings, task status, strengths/weaknesses/unexpected findings, pricing verification, finish test.

Screenshot upload rules: secret-gated · PNG/JPEG/WebP/GIF · magic-byte validated · 5MB max · path-rooted under `public/testing-evidence/`.

---

## Public review integration

When a valid completed session exists:

- Evidence level can resolve to **Hands-on tested**
- Software Evidence tab shows **How we tested [Product]**
- Shows tester, test date, plan, scenario, selected public screenshots
- Does **not** show internal notes

Components:

- `HowWeTestedSection`
- `buildPublicHandsOnSummary()` / `getValidCompletedTestSession()`
- `buildEditorialTrustMetadata()` consults completed sessions

---

## Comparison integration

`ComparisonTestingCoverage` on the comparison Evidence tab:

| Coverage | Behaviour |
|---|---|
| Both tested | State that both have hands-on evidence; note dates/plans |
| One tested | Explicit uneven-coverage warning — never imply equivalent testing |
| Neither | Research/methodology-based only |

---

## Testing queue

Generator: `npm run testing:queue`

Output: `docs/editorial/PRODUCT-TESTING-QUEUE.md`

**Top 5 only**, ranked by evidence-priority composite:

1. Real GSC page-level opportunity (software URL rows)
2. Comparison dependency count
3. Commercial importance
4. Strategic category importance
5. Current evidence gap

Products with a valid completed hands-on session are excluded.

---

## Evidence propagation (after real complete)

On human finish:

1. Session becomes completed (tasks **not** auto-PASS)
2. Public How We Tested + screenshots become available for that product
3. Comparison coverage resolves both/one/none from completed sessions
4. Dependent **refresh tasks** are created (review, top comparisons, best, guides) — **no blind rewrites**

Artifacts:

- `data/editorial/testing-refresh-tasks.json`
- `docs/editorial/PRODUCT-TESTING-REFRESH-TASKS.md`

---

## Coverage metrics

`buildTestCoverageMetrics()` reports:

- total products
- researched / data verified / hands-on tested
- reviews with public test evidence
- comparisons with evidence (both / one / none)

Embedded in the queue markdown snapshot. Hands-on stays **0** until a real session exists.

---

## Code map

```
src/domain/schemas/product-testing.ts
src/data/editorial/testing/store.ts
src/data/editorial/testing/protocols/crm.ts
src/data/editorial/testing/sessions/
src/data/editorial/testing/evidence/
src/services/product-testing/
src/app/dev/product-testing/page.tsx
src/app/api/dev/product-testing/route.ts
src/app/api/dev/product-testing/upload/route.ts
src/components/product-testing/
scripts/generate-product-testing-queue.ts
docs/editorial/PRODUCT-TESTING-SYSTEM.md
docs/editorial/PRODUCT-TESTING-QUEUE.md
docs/editorial/PRODUCT-TESTING-REFRESH-TASKS.md
```
