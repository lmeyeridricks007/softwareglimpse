# Website Intelligence Orchestrator

**Agent:** `WebsiteIntelligenceOrchestrator`  
**Command:** `npm run site:intelligence` / `npm run site:intelligence:crm`  
**Mutates production:** never

Produces one authoritative local assessment of site quality, SEO health, competitor position, ranking opportunities, risks, and growth actions.

## Outputs

| Path | Role |
| --- | --- |
| `docs/site-intelligence/WEBSITE-INTELLIGENCE-LATEST.md` | Master report |
| `docs/site-intelligence/archive/YYYY-MM-DD-website-intelligence.md` | Dated archive |
| `docs/site-intelligence/website-intelligence-latest.json` | Machine-readable summary |
| `docs/site-intelligence/website-intelligence-scorecard-latest.json` | Score history baseline |

## Modes

| Mode | Typical cadence | Behavior |
| --- | --- | --- |
| **LIGHT** | Weekly | Refresh search-performance (store) + website overview; **consume** existing competitive / ranking packs |
| **FULL** | Monthly | LIGHT + refresh competitive gaps + ranking opportunities |
| **DEEP** | Quarterly | FULL + refresh SERP discovery + competitive benchmark (fixture-safe in CI) |

Underlying SEO / Content Quality / Asset audits are **not** re-run by default — the orchestrator consumes their latest reports.

## Commands

```bash
npm run site:intelligence
npm run site:intelligence:crm
npm run site:intelligence -- --mode LIGHT
npm run site:intelligence -- --mode FULL
npm run site:intelligence -- --mode DEEP
npm run site:intelligence -- --fixture          # offline-safe SERP/search fixtures
npm run site:intelligence -- --no-write --json
```

Fixture scoring (separate): `npm run site:intelligence:fixtures`

## Scorecard (never invent missing data)

| Component | Notes |
| --- | --- |
| Overall Website Quality | Weighted A–E |
| Technical SEO | From SEO health |
| Content Quality | From CQ / Content Intelligence |
| Website Experience | Product / UX beyond SEO |
| Content Ecosystem | Clusters / map / linking |
| Competitive Strength | Only when competitor pack exists |
| Search Visibility | Live/import only — else **NOT CONNECTED** / **NOT AVAILABLE** |

Explicit measurement lines always include:

- Backlink authority: **NOT MEASURED** (unless a future approved provider exists)
- Search traffic: **NOT AVAILABLE** without live/import GSC-shaped data
- Search Console: **NOT CONNECTED** unless live/import

## Schedule

`.github/workflows/website-intelligence.yml`

- Weekly LIGHT (Monday 07:00 UTC)
- Monthly FULL (first Sunday 06:00 UTC)
- Quarterly DEEP (1 Jan/Apr/Jul/Oct 05:00 UTC)

CI runs with `--fixture` so jobs stay offline-safe. Reports upload as artifacts; they are not auto-committed.

## Limitations

- Does not predict Google rankings or claim “will rank #1”
- Does not mutate content, canonicals, robots, or affiliate links
- Does not fabricate GSC / backlink / DA metrics
- Competitive Strength unavailable without a competitor research pack
- Ranking feasibility may be overstated when authority is not measured
- Synthetic search fixtures never count as live Search Visibility

## Architecture

```text
SEO / CQ / Assets / Resources / SERP / Gaps / Ranking / Search Performance
        ↓ (consume LATEST + selective refresh by mode)
WebsiteOverviewAgent
        ↓
WebsiteIntelligenceOrchestrator (compose + score history)
        ↓
WEBSITE-INTELLIGENCE-LATEST.md
```

Implementation: `src/services/site-intelligence/orchestrator/`
