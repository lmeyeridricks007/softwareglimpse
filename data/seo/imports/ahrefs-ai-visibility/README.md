# Drop Ahrefs AI Visibility (or similar) exports here

Supported: `.csv` or `.json` (array of rows, or `{ "observations": [] }` / `{ "rows": [] }`).

Useful columns (any subset; never invent missing fields):

- query / prompt / keyword
- platform / ai_platform / engine (ChatGPT, Perplexity, Copilot, Google AI, Gemini, other)
- date / observed_at
- cited_url / url / page (SoftwareGlimpse URL when cited)
- citation_position / position / rank (optional)
- competitors_cited / competitors / Competitor domains (optional)
- topic / theme (optional)
- softwareglimpse_cited / brand_cited / cited (optional boolean)
- notes (optional)
- ai_share / impressions (optional metrics only when present)

Example / README filenames are ignored by discovery.

```bash
npm run seo:ai-visibility
npm run seo:ai-visibility -- --export src/data/seo/fixtures/ai-visibility-export-sample.csv
```

**Compliance:** measurement and analysis only. Do not fabricate observations. Do not spam or manipulate AI answer engines.
