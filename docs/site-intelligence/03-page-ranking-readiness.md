# Page Ranking Readiness Agent

**Agent:** `PageRankingReadinessAgent`  
**Command:** `npm run site:page-readiness -- <route-or-content-id>`  
**Mutates production:** never  
**Promises rankings:** never

Answers, for one SoftwareGlimpse page:

> How competitive is this page and what would need to change for it to have a stronger chance of ranking?

## Output

`docs/site-intelligence/pages/[slug]-ranking-readiness.md`

Examples:

| Input | Output file |
| --- | --- |
| `/best/crm-software/` | `best-crm-software-ranking-readiness.md` |
| `/resources/crm-evaluation-checklist/` | `resources-crm-evaluation-checklist-ranking-readiness.md` |
| `software:pipedrive` | `software-pipedrive-ranking-readiness.md` |

## Report sections

1. **RANKING READINESS** — score / 100, feasibility band, confidence  
2. **WHY** — STRONG (+) / WEAK (−)  
3. **REQUIRED IMPROVEMENTS** — Must / Should / Optional / Avoid  
4. **COMPETITOR BENCHMARK** — better / equal / weaker on observable dimensions  
5. Dimension table (intent, CQ, depth, media, links, search, authority, …)

## Commands

```bash
npm run site:page-readiness -- /best/crm-software/
npm run site:page-readiness -- /resources/crm-evaluation-checklist/
npm run site:page-readiness -- /software/pipedrive/
npm run site:page-readiness -- /guides/how-to-choose-crm/
npm run site:page-readiness -- software:pipedrive --json
npm run site:page-readiness -- /best/crm-software/ --no-write
```

## Inputs consumed (read-only)

- Content Quality `scores-latest.json`
- Ranking opportunities JSON
- Competitive benchmark + gaps
- SEO issues snapshot (page-affected)
- Internal linking report
- Asset intelligence (when page mentioned)
- Search performance (live/import only for traction; synthetic ≠ live)

## Explicit non-scores

| Signal | When missing |
| --- | --- |
| Backlink authority | **NOT MEASURED** |
| Search Console | **NOT CONNECTED** |
| Page search traffic | **NOT AVAILABLE** |

## Limitations

- Feasibility is relative readiness, not “% chance to rank” or a timeline  
- Competitor rows require an existing competitive benchmark match for the page  
- Does not crawl Google HTML or invent DA/backlink counts  
- Does not edit the page

Implementation: `src/services/site-intelligence/page-readiness/`
