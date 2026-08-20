# IT industry Tier-A onboarding — 2026-08-18

**Purpose:** Onboard industry IT systems after the referenced-slug mesh scan found **0 missing peer pages**. Soft references + industry shortlists drove this wave.

**Plan:** [`it-industry-gap-plan-2026-08-18.md`](./it-industry-gap-plan-2026-08-18.md)

**Rules held:** Rank only inside job clusters. Existing awards unchanged. No WordPress auto-publish. Affiliate economics excluded. `handsOnTesting=false`.

---

## Products onboarded (8)

| Product | Slug | Cluster | Overall | Published floor (2026-08-18) |
| --- | --- | --- | ---: | --- |
| Splunk Observability Cloud | `splunk` | observability-monitoring | **7.8** | Infra from **$15/host/mo** annual; free ≤15 hosts |
| Elastic Observability | `elastic-observability` | observability-monitoring | **7.6** | Elastic Cloud Hosted Standard from **~$99/mo** |
| Sentry | `sentry` | observability-monitoring | **8.0** | Free Developer; Team from **$26/mo** (error specialist) |
| incident.io | `incident-io` | incident-oncall | **7.8** | Free Basic; Team from **$15/user/mo** annual |
| CircleCI | `circleci` | source-control-devops | **7.5** | Free; Performance from **$15/mo** (CI path, not git host) |
| DirectAdmin | `directadmin` | hosting-operations | **6.8** | Personal PLUS from **$5/mo** |
| Kinsta | `kinsta` | hosting-providers | **7.6** | Single from **$35/mo** ongoing |
| Decodo (Smartproxy) | `smartproxy` | web-data-collection | **6.9** | Residential from **3GB $11.25/mo** |

### Awards unchanged

| Cluster | Award |
| --- | --- |
| observability-monitoring | Datadog **8.6** (Sentry is error-monitoring specialist peer — not the suite award) |
| incident-oncall | PagerDuty **8.0** |
| source-control-devops | GitHub **9.1** |
| hosting-operations | Plesk **7.4** |
| hosting-providers | WP Engine **7.7** |
| web-data-collection | Bright Data **7.7** |

---

## Identity notes

- **Splunk** here = Observability Cloud entity pricing — not Splunk Platform/SIEM ingest.
- **Elastic Observability** ≠ Elasticsearch-search-only SKU.
- **Sentry** = application error / tracing specialist inside observability.
- **CircleCI** = CI/CD — not a git host; GitHub Actions remains inside GitHub.
- **Decodo** is the Smartproxy rebrand; slug `smartproxy` kept for URL stability.
- **Opsgenie** still skipped as standalone (folded into Atlassian / JSM ops story).

---

## Deliverables

- Seed soft entries (software.ts → 242 soft())
- 12 comparison pairs (same-cluster + landscape `kinsta-vs-plesk`, `sentry-vs-pagerduty`)
- Best IT page eligible list + peer copy
- Category `it-development` **configVersion 1.3.0** activated
- Lettermarks under `public/brands/`
- Overview visuals (OG where available; DirectAdmin teaching diagram)
- Product-guide primaries expanded; visuals regenerated for IT set
- Scripts: `scripts/lib/it-industry-tiera-products.mjs` + onboard / patch / append / lettermark helpers

---

## Explicitly deferred (Tier B)

ManageEngine ServiceDesk Plus, SysAid, HaloITSM, AppDynamics, Honeycomb, FireHydrant, Rootly, Buildkite, SiteGround, Zyte, IPRoyal; optional new clusters `cicd-pipeline` / `error-monitoring`.
