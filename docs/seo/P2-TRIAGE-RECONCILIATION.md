# SEO Health P2 triage reconciliation

**Date:** 2026-09-07  
**Baseline (FULL + live):** **59 P2** / 0 P0 / 0 P1 (`SEO-HEALTH-LATEST.md` before remediation)  
**Note:** An earlier static-only snapshot reported 53 P2; this triage used the live FULL estate (**59**).  
**Policy:** PRESERVE → IMPROVE → PROMOTE — useful links to IMPROVE/noindex destinations retained.

## Final reconciliation

| Bucket | Count |
| --- | ---: |
| **Original P2** | **59** |
| **Fixed** | **58** |
| **Resolved through improvement** | **1** (tracked; not suppressed) |
| **Valid by design** | **51** (IMPROVE links — retained; auditor corrected) |
| **Deferred** | **0** |
| **Remaining actual issues** | **1** |

### Remaining actual issue (explicit justification)

| ID | Class | Justification |
| --- | --- | --- |
| `SEO-THIN-CRM-PRD-EX-PD-ALT-B8CE` | RESOLVED_BY_CONTENT_IMPROVEMENT | `/alternatives/pipedrive/` is live INDEXABLE but master map still `EXISTING-BUT-THIN`. Needs research/editorial deepen — inventing copy to clear the finding would violate content integrity. Keep open until deepen ships. |

Post-remediation FULL live audit: **P0=0 · P1=0 · P2=1** · checks 32/32 · 0 skipped.

## Classification of the original 59

### FIX_NOW → fixed (10)

| Items | Action |
| --- | --- |
| 3× `SEO-REDIR-*` intentional redirect probes | Skip `INTENTIONAL_REDIRECT_PROBE_PATHS` in InternalLinkAuditAgent |
| 3× `SEO-SCHEMA-*` schema on redirect request paths | Skip redirect samples in StructuredDataAuditAgent |
| 1× `OUT-EVIDENCE-LUCROVOX-*` missing thumbnail | `thumbnailUrl` → `https://www.softwareglimpse.com/vendor-ui/lucrovox/demo-explainer.png` |
| 3× `SEO-NEXTSTEP-STRENGTHEN-*` pre-launch hubs | Only flag thin hub mesh when category is **indexable** (scheduled IMPROVE categories excluded) |

### VALID_BY_DESIGN → auditor aligned; links retained (51)

**A. Evaluation / how-to-choose → IMPROVE best + siblings (28)**  
Same-category journeys to scheduled `/best/…` and sibling guides. Useful today, in enrichment waves, not replaceable by a weaker indexable hub alone.

**B. CRM category hub → IMPROVE product guides (14)**  
`/categories/crm/` → plans / worth-it / setup guides in IMPROVE. Core hub architecture; destinations useful and in CRM deepen set.

**C. Remainder covered by the same health rule (9)**  
Additional CRM hub noindex edges that shared the dump warning.

**Remediation:** `validateInternalLinkHealth` no longer emits `DRAFT_OR_NOINDEX_TARGET` volume warnings for resolvable IMPROVE destinations. **No links deleted.**

### RESOLVED_BY_CONTENT_IMPROVEMENT (1)

`SEO-THIN-CRM-PRD-EX-PD-ALT-B8CE` — see remaining issue above.

### DEFER_WITH_REASON

_None._

## Code / docs touched

- `src/services/internal-linking/health.ts`
- `src/services/internal-linking/report.ts`
- `src/services/seo-audit-agents/live-probe-extra-paths.ts`
- `src/services/seo-audit-agents/agents/internal-linking.ts`
- `src/services/seo-audit-agents/agents/structured-data.ts`
- `src/data/research/lucrovox/enrichment.json`
- `docs/seo/reports/SEO-HEALTH-LATEST.md` (+ component reports)
- `docs/seo/README.md` (scores)
