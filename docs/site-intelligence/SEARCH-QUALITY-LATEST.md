# Search Quality — SoftwareGlimpse

**Generated:** 2026-08-15T12:31:01.592Z
**Index size:** 535
**Fixtures:** 17 pass / 0 fail

> Audits common queries, expected top results, typo handling, and leakage.
> Does **not** auto-tune ranking weights.

## Findings

- **INFO** `LEAKAGE_OK` — No draft/admin/affiliate-redirect leakage detected in index
- **INFO** `TYPO_OK` (“pipedrve”) — Typo resolves to Pipedrive with related results

## Upgrade path

- Current: deterministic in-process index + scoring (no SaaS).
- Next: optional Postgres FTS / MiniSearch if catalogue grows past ~5k docs.
- Later: Typesense/Meilisearch only if latency or ops needs justify it.
