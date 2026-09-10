# Content Quality Gate

Reusable gate for whether an existing page is useful enough to become or remain **indexable**.

Philosophy: **more good indexed pages** — never lower thresholds to inflate URL count. Word count alone is never a hard fail.

```bash
npm run quality:gate -- analyze --type guide --slug what-is-crm
npm run quality:gate -- analyze --type comparison --slug hubspot-vs-pipedrive --json
npm run quality:gate -- profiles
npm run quality:gate -- loop --type guide --slug what-is-crm --persist
```

## Dimensions (explainable)

| Id | Focus |
| --- | --- |
| searchIntentFit | Query / job fit |
| uniqueValue | Original SG analysis |
| dataCompleteness | Required facts for the type |
| decisionSupport | Can the buyer choose? |
| evidenceQuality | Sources / verification |
| freshness | Stale pricing / research |
| internalDiscoverability | Hubs + next step |
| contentSpecificity | Not generic filler |
| technicalSEO | Canonical / route basics |
| duplicationRisk | Cannibalization / near-dup |

## Page-type profiles

software · guide · comparison · product-explainer · best · alternatives · category · use-case · industry · capability · tool-landing · research

Weights differ by type (e.g. comparisons emphasize decision support + specificity; guides emphasize intent + unique value).

## Output

Each evaluation returns: `qualityScore`, `dimensions`, `failures`, `warnings`, `requiredImprovements`, `recommendedImprovements`, `lifecycleState`, `indexEligible`.

## Improvement loop

`analyze → improve → reanalyze → promote`

Before/after states persist to `data/seo/content-quality-gate-history.json` when `--persist` is set.

## Promotion / sitemap (single bar)

Guide and comparison **index eligibility** and **promotion** share `guidePassesIndexGates` / `comparisonPassesIndexGates` and thresholds in `src/services/content-quality/gate/thresholds.ts`:

- unique ratio ≥ **0.35** (template-heavy ≥ **0.45**)
- boilerplate share &lt; **0.55**
- dimensional floor for gate `indexEligible`: **70**
- **SEMANTIC_TEMPLATE_RISK** — sibling analysis similarity after stripping product names, prices, and table values. High risk **blocks auto-promotion** (page stays IMPROVE / MANUAL_REVIEW).

### Semantic uniqueness (v1.1)

For each candidate, compare against same guide type / category / template family (nearest 20–50 siblings):

- intro · section thesis · decision framework · recommendations · limitations · conclusion · scenario analysis

Product names, prices, feature labels, and table values alone do **not** count as editorial uniqueness.

Promotion also requires page-specific analysis signals (worth-it judgment, pricing threshold, tradeoffs, target buyer, weak fit, migration risk, use-case recommendation, competitor difference).

History persists before/after similarity, sibling cluster, unique-analysis signals, and promotion reason in `data/seo/content-quality-gate-history.json` (`semanticRecords`).

Wired through:

- `canPromoteToIndexable` / `promoteToIndexable`
- `isGuideSearchIndexWorthy` / `isComparisonSearchIndexWorthy`
- `isEntityIndexable` → sitemaps / hubs

Do not invent a second weaker uniqueness bar elsewhere.
