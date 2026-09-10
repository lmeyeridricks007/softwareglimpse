# AI Visibility

**Measurement and analysis only.** Do not attempt to manipulate or spam AI answer engines. Observations are never fabricated.

Generated: 2026-09-06T07:58:13.524Z  
Engine: 1.0.0

Export: other · ai-visibility-export-sample.csv · 8 rows

---

## System

Tracks when SoftwareGlimpse pages appear as sources/references in AI-assisted search and answer engines, using **legitimate third-party exports** (e.g. Ahrefs AI Visibility).

| Artifact | Path |
|---|---|
| This report | `docs/seo/AI-VISIBILITY.md` |
| Machine JSON | `data/seo/ai-visibility.json` |
| Import drop folders | `data/seo/imports/ahrefs-ai-visibility/`, `data/seo/imports/ai-visibility/` |
| Fixture | `src/data/seo/fixtures/ai-visibility-export-sample.csv` |
| Implementation | `src/services/seo/ai-visibility/` |

### Platforms

ChatGPT · Perplexity · Copilot · Google AI surfaces · Gemini · other (when present in exports)

### Observation fields

platform, query, date, SoftwareGlimpse cited, cited URL, citation position (if known), competitors cited, topic, category, page type, notes — plus optional share/impressions **only when supplied**.

### Phases

1. **Data model** — typed observations (`AiVisibilityObservation`)
2. **Import** — CSV/JSON normalize; discovery of newest export; empty when missing
3. **Analysis** — totals, unique pages, by platform/category/page type, new/lost vs prior JSON, competitor overlap
4. **Content patterns** — URL/path co-occurrence heuristics (research, pricing, comparisons, tables, etc.) with explicit **correlation ≠ causation** caveats
5. **Report** — this Markdown + JSON; summary metrics for Organic Growth / GSC consumers

### Organic Growth integration

There is no separate “Organic Growth Agent” ID. Summary metrics feed:

1. `data/seo/ai-visibility.json` → `loadAiVisibilitySummary()`
2. GSC Opportunity Engine (`npm run seo:gsc-opportunities`) embeds the summary in `docs/seo/TOP-20-GROWTH-PAGES.md` and `docs/seo/GSC-OPPORTUNITIES.md`
3. Overlap notes on GSC rows that also appear in AI top cited paths (informational — **not** a ranking score boost)

### CLI

```bash
npm run seo:ai-visibility
npm run seo:ai-visibility -- --export src/data/seo/fixtures/ai-visibility-export-sample.csv
npm run seo:ai-visibility -- --no-write --json
```

### Never

- invent ChatGPT / Perplexity / Copilot / Gemini citation rows
- spam or manipulate AI systems to appear as sources
- treat content-pattern co-occurrence as proven causation
- auto-publish content changes from this report

---

## Summary (Organic Growth feed)

| Metric | Value |
|---|---|
| Total SG citations | 7 |
| Unique cited pages | 6 |
| Platforms with citations | 5 |
| Top platform | chatgpt |
| New citations vs prior | 0 |
| Lost citations vs prior | 0 |
| Export available | yes |

These summary metrics are written to `data/seo/ai-visibility.json` for Organic Growth / GSC opportunity consumers.

---

## Top cited pages

1. `/best/crm-software/` — 2 citation(s) · best · crm · platforms: chatgpt, perplexity
2. `/compare/pipedrive-vs-salesforce/` — 1 citation(s) · comparison · uncategorised · platforms: perplexity
3. `/research/crm-pricing/` — 1 citation(s) · research · crm · platforms: gemini
4. `/tools/sales-intelligence-cost-calculator/` — 1 citation(s) · tool-landing · sales-intelligence · platforms: copilot
5. `/software/zendesk-suite/` — 1 citation(s) · product-review · uncategorised · platforms: google_ai
6. `/research/crm-pricing-history/` — 1 citation(s) · research · crm · platforms: chatgpt


## New citations

_None (or no prior report to compare)._


## Lost citations

_None (or no prior report to compare)._


## Platforms

- **chatgpt**: 2
- **perplexity**: 2
- **gemini**: 1
- **copilot**: 1
- **google_ai**: 1


## Categories

- **crm**: 4
- **unknown**: 2
- **sales-intelligence**: 1


## Page types

- **best**: 2
- **research**: 2
- **comparison**: 1
- **tool-landing**: 1
- **product-review**: 1


## Competitor overlap

- **g2.com** — with SG: 3, without SG: 0
- **capterra.com** — with SG: 2, without SG: 0
- **forrester.com** — with SG: 1, without SG: 0
- **gartner.com** — with SG: 1, without SG: 0


## Content-pattern observations

- `/best/crm-software/` (2): direct_answers — _Co-occurrence with citation frequency only — not proof that the pattern caused AI citations._
- `/compare/pipedrive-vs-salesforce/` (1): comparisons — _Co-occurrence with citation frequency only — not proof that the pattern caused AI citations._
- `/research/crm-pricing/` (1): research, pricing, unique_data, tables, structured_data_likely — _Co-occurrence with citation frequency only — not proof that the pattern caused AI citations._
- `/tools/sales-intelligence-cost-calculator/` (1): interactive_tools — _Co-occurrence with citation frequency only — not proof that the pattern caused AI citations._
- `/software/zendesk-suite/` (1): product_pages — _Co-occurrence with citation frequency only — not proof that the pattern caused AI citations._
- `/research/crm-pricing-history/` (1): research, pricing, unique_data, tables, freshness_signal_in_url, structured_data_likely — _Co-occurrence with citation frequency only — not proof that the pattern caused AI citations._


---

## Methodology

- Observations come only from imported third-party exports (e.g. Ahrefs AI visibility) or empty when none supplied.
- Never fabricate ChatGPT/Perplexity/Copilot citations.
- New/lost citations compare against the previous data/seo/ai-visibility.json when present.
- Content-pattern notes are co-occurrence heuristics — correlation does not equal causation.
- This engine measures visibility; it does not attempt to manipulate AI systems.

## Compliance

- Do not spam or manipulate AI answer engines.
- Do not invent observation rows or authority metrics.
- Measurement and analysis only.
