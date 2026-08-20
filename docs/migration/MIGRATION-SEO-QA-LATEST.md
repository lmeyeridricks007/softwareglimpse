# Migration SEO QA

**Generated:** 2026-08-19T15:13:31.497Z
**Agent:** MigrationSEOAuditAgent v1.0.0
**Mode:** static
**Overall:** **PASS**

> Static pre-launch audit against mapping plan, redirect config, inventory, sitemap, internal-link graph, and repository scan. Optional live HTTP probes are out of band unless `BASE_URL` live mode is enabled in a future pass.

## PASS / FAIL summary

| Metric | Value |
| --- | ---: |
| Overall | PASS |
| Legacy URLs audited | 643 |
| Clean fate | 643 |
| Fate issues | 0 |
| Redirects configured | 370 |
| High-risk redirect OK | 300 |
| High-risk redirect issues | 0 |
| P0 findings | 0 |
| P1 findings | 0 |
| P2 findings | 0 |

## Checks

| Check | Status | Findings | Summary |
| --- | --- | ---: | --- |
| `legacy_url_fate` | pass | 0 | 643/643 legacy URLs have clean fate; 0 with issues |
| `redirect_hygiene` | pass | 0 | No redirect chains; permanent-only policy checked |
| `high_risk_coverage` | pass | 0 | High-risk redirect destinations validated |
| `internal_links` | pass | 0 | No internal-link graph edges target redirect sources |
| `canonicals` | pass | 0 | Canonical paths checked against inventory + redirect sources |
| `sitemaps` | pass | 0 | Sitemap checked for redirects, retirements, and noindex |
| `structured_data` | pass | 0 | Schema helpers scanned for embedded legacy paths |
| `open_graph` | pass | 0 | OG helpers + absolute host references reviewed |
| `hardcoded_legacy` | pass | 0 | App/components/data/services scanned for redirect sources |
| `legacy_assets` | pass | 0 | wp-content/uploads and attachment patterns scanned |
| `not_found_experience` | pass | 0 | not-found.tsx present with messaging + navigation |

## Legacy URL coverage

| Fate | Count |
| --- | ---: |
| Preserved 200 (KEEP) | 3 |
| Redirect 301 implemented | 368 |
| Intentional 404/410 | 272 |
| Excluded manual (not auto-301) | 0 |
| Unresolved (REVIEW / pending) | 0 |

Every legacy URL should end as **200 preserved**, **301/308 mapped**, **404 intentional**, or **410 intentional**. Unresolved REVIEW rows need editorial decisions before launch.

## Critical redirect coverage / high-risk

_None._

## Redirect chains / temporary redirects

_None._

## Broken redirects / wrong destinations / fate issues

_None._

## Old URLs in current internal links

_None._

## Sitemap issues

_None._

## Canonical issues

_None._

## Structured-data issues

_None._

## Open Graph / share URL issues

_None._

## Hardcoded legacy links

_None._

## Legacy asset issues

_None._

## 404/410 findings

_None._

## P0 launch blockers

_None._

## P1 launch risks

_None._

## P2 cleanup

_None._

## Notes

- Soft 404 / live 500 / redirect loops require a running deployment (`BASE_URL` live probe) — not asserted in static mode.
- Source of truth for redirects: `config/legacy-redirects.json`.
- Regenerate: `npm run migration:seo-audit`

