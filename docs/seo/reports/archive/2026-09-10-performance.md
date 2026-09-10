# PerformanceAuditAgent report

**Agent:** PerformanceAuditAgent  
**Mode:** FULL  
**Started:** 2026-09-10T09:47:16.287Z  
**Finished:** 2026-09-10T09:49:14.868Z  

> Report-only. This agent does **not** change canonicals, robots, content, scores, or affiliate links.

## Run status

| Checks | Count |
| --- | ---: |
| Completed | 8 |
| Skipped | 0 |
| Failed | 0 |
| Findings | 6 |

## Summary

Performance audit (FULL): 6 finding(s). Budgets defined in src/performance/budgets.ts. Field CWV not claimed.

## Checks

| Check | Status | Reason |
| --- | --- | --- |
| `cwv-targets` | completed | LCP≤2500ms INP≤200ms CLS≤0.1 |
| `field-cwv` | completed | Lab TTFB proxies via BASE_URL (34 pages, 6 over warn) — not CrUX/RUM field truth |
| `hero-weights` | completed | — |
| `youtube-api` | completed | — |
| `tool-dynamic-imports` | completed | — |
| `cwv-collector` | completed | useReportWebVitals wired in src/components/site/web-vitals.tsx (consent-gated sink; not CrUX) |
| `client-chunks` | completed | 0 large chunk warning(s) |
| `third-party-inventory` | completed | Consent-gated analytics; video click-to-play expected |

## Findings

### PERF-TTFB-SEARCH-B82D — P1

| Field | Value |
| --- | --- |
| Severity | P1 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/search/` ttfb=10720ms (warn 800ms) html=83458B base=https://www.softwareglimpse.com |
| Affected pages | `/search/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

### PERF-TTFB-SITE-350E — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/` ttfb=1056ms (warn 800ms) html=394290B base=https://www.softwareglimpse.com |
| Affected pages | `/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

### PERF-TTFB-CATEGORIES-CRM-597E — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/categories/crm/` ttfb=1033ms (warn 800ms) html=801576B base=https://www.softwareglimpse.com |
| Affected pages | `/categories/crm/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

### PERF-TTFB-CAPABILITIES-PIPELINE-MANAGE-D148 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/capabilities/pipeline-management/` ttfb=869ms (warn 800ms) html=503130B base=https://www.softwareglimpse.com |
| Affected pages | `/capabilities/pipeline-management/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

### PERF-TTFB-REQUIREMENTS-SEPARATE-SALES--5C25 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/requirements/separate-sales-processes/` ttfb=1027ms (warn 800ms) html=773953B base=https://www.softwareglimpse.com |
| Affected pages | `/requirements/separate-sales-processes/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |

### PERF-TTFB-FEATURES-WORKFLOW-AUTOMATION-9119 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | performance |
| Problem | Lab TTFB above warn budget on live probe |
| Evidence | `/features/workflow-automation/` ttfb=869ms (warn 800ms) html=800639B base=https://www.softwareglimpse.com |
| Affected pages | `/features/workflow-automation/` |
| Likely cause | Cold server, heavy SSR, or slow data path |
| Recommended action | Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP |
| Files/components | `src/app`, `src/performance/budgets.ts` |
| Expected impact | Better perceived load / crawl efficiency |
| Effort | medium |
| Confidence | 60% |


---

_Generated by `performance-audit-agent` v1.0.0. No auto-fixes applied._
