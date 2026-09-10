# Backlink authority — REAL export activation

## Current status (2026-09-09)

**Authority validity: `NOT_CONNECTED`**

No REAL Ahrefs/Semrush (or equivalent) backlink CSV/JSON is present under:

- `data/seo/imports/ahrefs/`
- `data/seo/imports/semrush/`
- `data/seo/imports/backlinks/`

Fixture/sample files under `src/data/seo/fixtures/` are **rejected** for production. Authority cannot move to **REAL** until a production export is dropped and analyzed.

## Activate REAL

1. Export referring domains / backlinks from Ahrefs or Semrush for `softwareglimpse.com` (and optional competitor URLs used in Digital PR pairs).
2. Save as e.g. `data/seo/imports/ahrefs/ahrefs-backlinks-2026-09-09.csv`  
   Do **not** use names containing `sample`, `fixture`, `example`, `demo`, `test`.
3. Run:

```bash
npm run seo:link-opportunities
npm run seo:growth-dashboard
```

4. Confirm `data/seo/growth-dashboard.json` → `authority.validity` is `REAL` (or `STALE` if export date > 45 days).

## Dashboard validity

| Label | Meaning |
| --- | --- |
| `REAL` | Production-eligible export, fresh enough for north-star |
| `STALE` | Real export, data older than 45 days |
| `FIXTURE` | Sample/fixture/example/test export rejected |
| `NOT_CONNECTED` | No usable export on disk |

## Metrics (from REAL rows only)

Referring domains · backlinks · linked pages · top referring domains · topical relevance avg · new/lost RDs (needs prior `data/seo/backlink-rd-snapshot.json`) · links to research assets · links to commercial pages.

## Prospects & asset outreach

- Domain prospects from competitor gaps require a **REAL** export — never invented.
- **Asset outreach priorities** (HIGH / MEDIUM / LOW) rank EXISTING linkable assets (CRM pricing research, pricing history, calculators, tools, high-value guides) for draft pitches only.
- Outreach drafts exist only for **QUALIFIED** domain prospects and are **never auto-sent**.
- Do **not** count prospects or asset priorities as earned links.

## Rejected inputs

`src/data/seo/fixtures/backlink-export-sample.csv` and any import named like a sample — used in tests only; production `discoverLatestBacklinkExport({ realOnly: true })` skips them.
