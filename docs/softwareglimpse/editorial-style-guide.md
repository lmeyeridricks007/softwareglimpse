# Editorial style guide

Tone, claims, ratings, disclosures, and QA rules for SoftwareGlimpse editorial content.

## Positioning

SoftwareGlimpse is a **software decision platform**, not an affiliate blog.

- Prefer clear recommendations with explicit tradeoffs.
- Separate **vendor facts** (research) from **editorial judgments** (assessments/reviews).
- Researched enrichment ≠ a finished review.

## Canonical URLs

| Page type | Canonical path |
| --- | --- |
| Product review | `/software/{slug}/` — **not** `/reviews/` |
| Comparison | `/compare/{a}-vs-{b}/` (lexicographic slug) |
| Alternatives | `/alternatives/{sourceSlug}/` |
| Best-of | `/best/{slug}/` |

Comparison example: `pipedrive` + `freshsales` → `/compare/freshsales-vs-pipedrive/`.  
`pipedrive-vs-freshsales` must 301 to the canonical slug.

## Tone

- Direct, practical, buyer-first.
- Decisive when evidence supports it; explicit when it **depends**.
- No hype, no manufactured certainty, no “we tested” unless `handsOnTesting` is true and documented.
- Avoid purple marketing prose and empty superlatives.

## Claims policy

Allowed:

- Claims tied to approved/verified facts or clearly labeled provisional assessments.
- Feature differences evidenced in research fixtures/enrichment, marked provisional until approved.

Disallowed:

- Inventing **live prices** as truth.
- Claiming **hands-on testing** without the assessment flag + notes.
- “Best overall” / ranking badges unless `approved: true`.
- Commission-influenced rankings.

## Comparisons

- Prefer `overallWinnerKind: depends` or `tie` unless evidence clearly supports one product.
- Every criterion outcome needs a **reason**.
- Many ties are expected when both products evidence the same capability.
- Never force a universal winner for SEO.

## Ratings & scores

- Scores use 0–10 with a **text label** (Poor → Excellent). Never color-alone.
- Show public overall scores **only** when assessment/review status is `approved`.
- Criterion scores require rationale; confidence must be honest (`low`/`medium`/`high`).

## Uncertainty & freshness

- Provisional / review-required content stays **noindex**.
- Surface research status, editorial status, and fixture caveats via `ResearchFreshness`.
- Mark refresh needed when facts change or methodology versions bump.

## AI policy

- AI may draft from **approved facts + assessments + allowed relationships** only.
- Humans approve publishable judgments.
- AI must not invent prices, testing claims, or unsupported numbers.
- Disclose AI assistance in the footer disclosures block — not in the hero.

## Testing claims

- Default `handsOnTesting: false`.
- If true: document scope, date, environment in `testingNotes`.
- Never imply lab testing from fixture research.

## Headings & tables

- One job per section; one H2 purpose.
- Comparison tables are semantic (`<table>` + mobile stacked DL).
- Columns: criterion | product A | product B | winner | notes.

## CTAs

Use `src/services/editorial/cta-rules.ts` budgets:

| Page type | Header | Mid | Final |
| --- | --- | --- | --- |
| Software review | 1 | 1 | 1 |
| Comparison | 0 | 1 | 1 |
| Alternatives | 0 | 1 | 1 |
| Best | 0 | 1 | 1 |

No CTA stacks in the hero. Affiliate disclosure lives with other disclosures, not as hero clutter.

## Disclosures (centralized)

Use `EditorialDisclosures` / individual disclosure components:

1. Affiliate disclosure (when affiliate links present)
2. Methodology disclosure
3. Research transparency (fixture caveat when needed)
4. AI-assisted disclosure (when drafts/AI used)

Keep wording centralized — do not invent per-page variants.

## Publish gates (editorial)

Before `seo.indexable: true` + `editorialStatus: approved`:

1. Human review of verdict, scores, and tradeoffs
2. No prohibited claims
3. Unsupported numbers removed or fact-gated
4. Quality gates for page type pass
5. Hands-on / AI / affiliate disclosures accurate
