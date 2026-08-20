# Content Quality Framework

> Spec date: 2026-08-15  
> Evaluator version: `1.0.0`  
> Status: foundational — evaluate only; no auto-rewrite

## 1. Purpose

Inspect any public editorial/research page and evaluate quality **consistently** across:

- usefulness, completeness, evidence, originality  
- decision support, structure, depth, visual enrichment  
- internal linking, buyer journey, source quality, freshness  
- differentiation, actionability  
- alignment with SoftwareGlimpse content models  

This is **not** a generic SEO word-count checker.

## 2. Architecture (reuse)

Built to sit beside existing infrastructure:

| Existing | Reuse |
| --- | --- |
| Content / guide / review / comparison / industry / feature / requirement models | Inform page-type expected sections & checklists |
| Research freshness policies (`src/domain/schemas/freshness.ts`) | Freshness dimension guidance |
| Internal-link / journey blueprint (`docs/content-ecosystem/03-crm-linking-architecture.md`) | Linking + journey criteria |
| CRM master content map | Differentiation / cannibalization context |
| Site audit quality issues | Complementary signals (orphan, duplicate intent, thin content, stale facts) |
| Page-type quality gates | Publish readiness ≠ dimensional quality |

**Input:** `PageQualitySnapshot` (normalized inspection surface).  
**Output:** `ContentQualityAssessment` → Markdown report.

Live loaders can map repository entities → snapshot later. Fixtures prove scoring today without mutating published content.

```text
PageQualitySnapshot
        ↓
page-type QualityProfile (weights + expected sections + checklist)
        ↓
15 dimension scorers (each: score, reason, evidence, gap, recommendations)
        ↓
weighted overall 0–100 (integer) + quality band
        ↓
Markdown report (optional)
```

## 3. Score scale

| Score | Meaning |
| --- | --- |
| 0 | Missing |
| 1 | Very weak |
| 2 | Weak |
| 3 | Adequate |
| 4 | Strong |
| 5 | Excellent |

Overall reporting uses integer **0–100** (no fake decimals such as 83.746).

Formula:

```text
overall = round( (Σ score_i × weight_i / Σ weight_i) / 5 × 100 )
```

## 4. Quality bands

| Range | Band |
| --- | --- |
| 90–100 | EXCELLENT |
| 80–89 | STRONG |
| 70–79 | GOOD BUT IMPROVABLE |
| 60–69 | WEAK |
| 40–59 | POOR |
| 0–39 | CRITICAL / INCOMPLETE |

Site-audit’s internal health formula (`0.4*validity + 0.35*readiness + 0.25*quality`) remains separate and must not be shown publicly. Content Quality bands are for editorial improvement planning.

## 5. Dimensions (canonical)

Every scored dimension includes:

- `score` (0–5)  
- `weight` (page-type dependent)  
- `reason`  
- `evidence[]` (from page/repo snapshot)  
- `gap` (specific)  
- `recommendations[]`  

No unexplained ratings.

| # | ID | Focus |
| --- | --- | --- |
| 1 | `user-intent-fit` | Answers the likely question; title/H1 match; correct informational vs commercial vs implementation intent; no accidental intent mix |
| 2 | `content-completeness` | Present vs profile-expected sections |
| 3 | `subject-depth` | Workflows, trade-offs, edge cases, criteria — **not** word count |
| 4 | `original-value` | SG frameworks, assessments, tools, taxonomies vs vendor-doc paraphrase |
| 5 | `evidence-source-quality` | Primary sources, docs, pricing sources, media, fact refs, verification dates |
| 6 | `research-freshness` | Last reviewed, stale/broken sources, pricing freshness (align with research policies) |
| 7 | `decision-support` | Requirements, scorecards, trade-offs, best-fit, questions |
| 8 | `actionability` | Checklist, builder, compare, calculate, implement steps |
| 9 | `structure-readability` | Quick answer, headings, sequence, scannability — no arbitrary paragraph length rules |
| 10 | `visual-media-support` | Teaching visuals where the subject needs them; no penalty for simple subjects |
| 11 | `internal-linking` | Parent/hub, supporting, tools, resources, next-step — quality over quantity |
| 12 | `journey-next-step` | Stage-appropriate next action |
| 13 | `trust-transparency` | Methodology, disclosure, dates, limitations as relevant to page type |
| 14 | `content-differentiation` | Distinct purpose; flag duplicate intent / H1-only / generic industry copies |
| 15 | `page-type-specific` | Profile checklist (review verdicts, guide recipes, feature evidence, …) |

Weights are **not** equal. Commercial reviews weight evidence/decision/trust higher; implementation guides weight intent fit + actionability; industry hubs weight differentiation; resources/tools weight actionability.

## 6. Page-type rubrics

| Profile ID | Page type |
| --- | --- |
| `ArticleQualityProfile` | article |
| `GuideQualityProfile` | guide |
| `ProductReviewQualityProfile` | product-review |
| `ComparisonQualityProfile` | comparison |
| `BestPageQualityProfile` | best |
| `ProductGuideQualityProfile` | product-guide |
| `IndustryQualityProfile` | industry |
| `UseCaseQualityProfile` | use-case |
| `CapabilityQualityProfile` | capability |
| `RequirementQualityProfile` | requirement |
| `FeatureQualityProfile` | feature |
| `ImplementationGuideQualityProfile` | implementation-guide |
| `ResourceQualityProfile` | resource |
| `ToolLandingQualityProfile` | tool-landing |

Each profile defines:

- expected primary intent  
- expected sections (completeness)  
- checklist items (`page-type-specific`)  
- weight overrides  

Example — **Product Review** expected sections: verdict, best-for, not-for, criteria, features, pricing, pros/cons, evidence, alternatives, methodology, FAQ.

Example — **Implementation guide** must primarily help **implement**, not spend half the page ranking products (`user-intent-fit`).

## 7. Evaluation evidence pattern

```text
Decision Support
2 / 5

Reason:
The guide explains CRM selection but does not provide a framework, checklist,
Finder handoff or comparison action.

Evidence:
✗ No requirements module
✗ No evaluation checklist
✗ No tool CTA

Gap:
Page explains a topic but does not help the reader choose or evaluate.

Recommendation:
[major] Add requirements, scorecard, comparison handoff, best-fit scenarios, or vendor questions.
```

## 8. Result model

```ts
ContentQualityAssessment {
  contentId
  route
  pageType
  overallScore          // 0–100 int
  qualityBand
  dimensions[] {
    id, score, weight, reason, evidence[], gap?, recommendations[]
  }
  strengths[]
  weaknesses[]
  criticalGaps[]
  quickWins[]
  majorImprovements[]
  researchGaps[]
  linkingGaps[]
  mediaGaps[]
  toolOpportunities[]
  resourceOpportunities[]
  evaluatedAt
  evaluatorVersion
  profileId
  notes[]
}
```

Schema: `src/domain/schemas/content-quality.ts`.

## 9. How recommendations are generated

1. Each dimension scorer emits zero or more recommendations with priority: `critical` | `major` | `quick-win` | `optional`.  
2. Post-pass buckets recommendations into critical gaps, major improvements, quick wins, plus research/linking/media/tool/resource opportunity lists via keyword routing.  
3. Recommendations are **advisory**. Execution requires a separate rewrite / linking / research prompt or workflow.

## 10. Explicit non-goals

The framework must **not**:

- rewrite pages  
- publish content  
- add links  
- create articles  
- change rankings  
- modify research facts  

without a separate execution prompt.

## 11. Fixtures (scoring sanity)

| Fixture ID | Expectation |
| --- | --- |
| `excellent-guide` | ≥85, strong/excellent |
| `thin-guide` | &lt;55, poor/critical |
| `good-product-review` | ≥80 |
| `thin-industry` | &lt;50; weak differentiation |
| `duplicate-article` | differentiation ≤2 |
| `feature-missing-evidence` | evidence ≤2; depth still adequate |

```bash
npm run quality:evaluate -- --all-fixtures --report
npm test -- src/services/content-quality/content-quality.test.ts
```

## 12. Limitations

- v1 scores **normalized snapshots**, not live HTML crawls.  
- Depth/originality rely on structured signals supplied by the snapshot (or future loaders) — not LLM prose judgment by default.  
- Site-audit issue ledger is not auto-merged yet (optional future input).  
- Visual quality is counted as teaching vs decorative signals, not aesthetic grading.  
- Cannibalization uses declared overlap flags; full embedding similarity is out of scope.  

## 13. How to extend

1. **New page type** — add to `ContentQualityPageTypeSchema`, create profile in `profiles.ts`, add fixture.  
2. **New dimension** — add id to schema + label + scorer in `evaluate.ts` + default weight.  
3. **Live entity loader** — map `GuidePage` / `ProductReview` / industry models → `PageQualitySnapshot` without changing evaluator core.  
4. **Optional qualitative layer** — sample AI commentary only after deterministic scores (same pattern as site-audit qualitative agent).  
5. **Bump** `CONTENT_QUALITY_EVALUATOR_VERSION` when scoring semantics change.

## 14. Journey reference (next-step fit)

```text
Learn → Define requirements → Find → Research → Compare → Price → Select → Implement → Adopt → Optimize
```

Examples:

- What Is CRM → How to Choose CRM  
- How to Choose → Requirements Builder  
- Requirements → Finder  
- Review → Comparison  
- Comparison → Cost  
- Decision → Implementation  
- Implementation → Migration  

See `docs/content-ecosystem/03-crm-linking-architecture.md`.
