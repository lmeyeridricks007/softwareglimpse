# Analytics

## Principle

Provider-agnostic event bus. UI and services call `track()` / `analytics.*` — never import GA/affiliate SDKs directly in components.

Code: `src/analytics/events.ts`

## Event names

- `software_viewed`
- `comparison_viewed`
- `affiliate_clicked`
- `finder_started` / `finder_completed`
- `calculator_started` / `calculator_completed`
- `recommendation_viewed`
- `cta_clicked`
- CRM Finder: `crm_finder_started`, `crm_finder_step_completed`, `crm_finder_completed`, `crm_finder_result_viewed`, `crm_finder_result_clicked`, `crm_finder_comparison_clicked`, `crm_finder_restarted`
- CRM Cost Calculator: `crm_cost_calculator_started`, `crm_cost_calculator_completed`, `crm_cost_result_viewed`, `crm_cost_product_clicked`, `crm_cost_sort_changed`
- Pricing pages: `pricing_page_viewed`, `pricing_cta_clicked`
- Publishing ops (prefer audit store for truth): `content_published`, `content_updated`, `content_archived`

## Integration later

| System | How |
| --- | --- |
| GA4 | Register a sink that maps events → `gtag` |
| Search Console | Offline feedback loop (Phase 8), not client SDK |
| Affiliate networks | Enrich `affiliate_clicked` with network/campaign |
| Product analytics | Same sink interface |

## Privacy / security

- No secrets in client bundles
- Prefer first-party proxies for sensitive keys later
- Do not send PII in event properties by default
