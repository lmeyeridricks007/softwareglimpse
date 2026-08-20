# IT & Development — Product Coverage Map

**Date:** 2026-08-18  
**Purpose:** Planning doc — IT / dev tooling clusters vs SoftwareGlimpse coverage after Wave-1 onboarding.

Related: [`ai-it-wave1-onboarding-2026-08-18.md`](./ai-it-wave1-onboarding-2026-08-18.md) · [`ai-it-priority2-onboarding-2026-08-18.md`](./ai-it-priority2-onboarding-2026-08-18.md) · [`ai-it-priority3-onboarding-2026-08-18.md`](./ai-it-priority3-onboarding-2026-08-18.md) · [`it-webdata-peers-onboarding-2026-08-18.md`](./it-webdata-peers-onboarding-2026-08-18.md) · [`hosting-automation-overlay-onboarding-2026-08-18.md`](./hosting-automation-overlay-onboarding-2026-08-18.md) · [`it-industry-gap-plan-2026-08-18.md`](./it-industry-gap-plan-2026-08-18.md) · [`it-industry-tiera-onboarding-2026-08-18.md`](./it-industry-tiera-onboarding-2026-08-18.md) · [`it-tierb-itsm-onboarding-2026-08-18.md`](./it-tierb-itsm-onboarding-2026-08-18.md) · [`it-optional-next-onboarding-2026-08-18.md`](./it-optional-next-onboarding-2026-08-18.md) · [`it-gapfill-paas-incident-onboarding-2026-08-18.md`](./it-gapfill-paas-incident-onboarding-2026-08-18.md)

---

## Category scope

| Job cluster | Buyer intent | Wave-1 covered |
| --- | --- | --- |
| **itsm-service-desk** | ITSM, service desk, asset ops | Freshservice |
| **observability-monitoring** | Metrics, logs, APM, SRE | Datadog |
| **source-control-devops** | Git, CI, dev platform | GitHub |
| **hosting-operations** | Server / VPS panel ops | Plesk |
| **hosting-providers** | Managed cloud / WordPress hosts | *(provider batch)* |
| **cloud-paas** | Git-push / microVM app platforms | *(optional-next)* |
| **web-data-collection** | Proxies, scraping infra | Bright Data |

Source: `src/data/category-onboarding/seed/it-development.ts` (v1.5.1)

**Ranking rule:** landscape comparisons only across clusters — never “best IT tool” undifferentiated list.

---

## Wave-1 onboarded (5)

| Product | Slug | Cluster | Overall | Affiliate |
| --- | --- | --- | ---: | --- |
| Freshservice | `freshservice` | itsm-service-desk | 8.4 | Yes |
| Datadog | `datadog` | observability-monitoring | **8.6** (award) | — |
| GitHub | `github` | source-control-devops | **9.1** (award) | — |
| Plesk | `plesk` | hosting-operations | **7.4** (award) | Yes |
| Bright Data | `bright-data` | web-data-collection | **7.7** (award) | Yes |

## Priority-2 onboarded (8) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| ServiceNow | `servicenow` | itsm-service-desk | **8.7** (award) |
| Jira Service Management | `jira-service-management` | itsm-service-desk | 8.0 |
| New Relic | `new-relic` | observability-monitoring | 8.0 |
| Grafana Cloud | `grafana-cloud` | observability-monitoring | 7.5 |
| PagerDuty | `pagerduty` | incident-oncall | **8.0** (award) |
| GitLab | `gitlab` | source-control-devops | 8.3 |
| Bitbucket Cloud | `bitbucket` | source-control-devops | 7.6 |
| cPanel | `cpanel` | hosting-operations | 7.3 |

See [`ai-it-priority2-onboarding-2026-08-18.md`](./ai-it-priority2-onboarding-2026-08-18.md).

## Priority-3 onboarded (2) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| Dynatrace | `dynatrace` | observability-monitoring | 8.2 |
| Azure DevOps | `azure-devops` | source-control-devops | 8.2 |

See [`ai-it-priority3-onboarding-2026-08-18.md`](./ai-it-priority3-onboarding-2026-08-18.md). Datadog **8.6** and GitHub **9.1** remain cluster awards.

---

## Catalogue affiliate — resolved

| Name | Status |
| --- | --- |
| ThorData | **Onboarded** as `thordata` (web-data peer) — identity resolved 2026-08-18 |

---

## Web-data peers onboarded (4) — 2026-08-18

| Product | Slug | Overall | Notes |
| --- | --- | ---: | --- |
| Oxylabs | `oxylabs` | **7.7** | Enterprise proxy / scraper-API peer (Bright Data stays award on tie) |
| Apify | `apify` | **7.5** | Actor-platform path |
| ScraperAPI | `scraperapi` | **7.3** | Managed credit-API path |
| ThorData | `thordata` | **6.8** | Budget pack peer + affiliate |

See [`it-webdata-peers-onboarding-2026-08-18.md`](./it-webdata-peers-onboarding-2026-08-18.md).

## Hosting providers onboarded (2) — 2026-08-18

| Product | Slug | Overall | Notes |
| --- | ---: | ---: | --- |
| WP Engine | `wp-engine` | **7.7** (award) | Managed WordPress — not a panel licence |
| Cloudways | `cloudways` | **7.6** | Multi-cloud managed peer from $11/mo Flexible |

See [`hosting-automation-overlay-onboarding-2026-08-18.md`](./hosting-automation-overlay-onboarding-2026-08-18.md). Plesk remains **hosting-operations** award.

## Industry Tier-A onboarded (8) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| Splunk Observability Cloud | `splunk` | observability-monitoring | 7.8 |
| Elastic Observability | `elastic-observability` | observability-monitoring | 7.6 |
| Sentry | `sentry` | observability-monitoring | 8.0 (error specialist) |
| incident.io | `incident-io` | incident-oncall | 7.8 |
| CircleCI | `circleci` | source-control-devops | 7.5 |
| DirectAdmin | `directadmin` | hosting-operations | 6.8 |
| Kinsta | `kinsta` | hosting-providers | 7.6 |
| Decodo (Smartproxy) | `smartproxy` | web-data-collection | 6.9 |

See [`it-industry-tiera-onboarding-2026-08-18.md`](./it-industry-tiera-onboarding-2026-08-18.md). **Awards unchanged.**

## Tier-B + ITSM SMB onboarded (11) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| HaloITSM | `haloitsm` | itsm-service-desk | 7.9 |
| ManageEngine ServiceDesk Plus | `manageengine-servicedesk-plus` | itsm-service-desk | 7.8 |
| SysAid | `sysaid` | itsm-service-desk | 7.7 |
| AppDynamics | `appdynamics` | observability-monitoring | 7.9 |
| Honeycomb | `honeycomb` | observability-monitoring | 7.8 |
| FireHydrant | `firehydrant` | incident-oncall | 7.7 |
| Rootly | `rootly` | incident-oncall | 7.7 |
| Buildkite | `buildkite` | source-control-devops | 7.6 |
| Zyte | `zyte` | web-data-collection | 7.4 |
| SiteGround | `siteground` | hosting-providers | 7.3 |
| IPRoyal | `iproyal` | web-data-collection | 6.7 |

See [`it-tierb-itsm-onboarding-2026-08-18.md`](./it-tierb-itsm-onboarding-2026-08-18.md). **Awards unchanged.**

## Optional-next onboarded (7) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| BMC Helix ITSM | `bmc-helix` | itsm-service-desk | 8.3 |
| Ivanti Neurons for ITSM | `ivanti` | itsm-service-desk | 8.0 |
| TOPdesk | `topdesk` | itsm-service-desk | 7.8 |
| Chronosphere | `chronosphere` | observability-monitoring | 7.9 |
| Coralogix | `coralogix` | observability-monitoring | 7.8 |
| Render | `render` | cloud-paas | **7.9** (award) |
| Fly.io | `fly-io` | cloud-paas | 7.7 |

See [`it-optional-next-onboarding-2026-08-18.md`](./it-optional-next-onboarding-2026-08-18.md). **New cloud-paas award (Render).** Prior cluster awards unchanged.

## Gap-fill onboarded (3) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| Railway | `railway` | cloud-paas | 7.8 |
| Heroku | `heroku` | cloud-paas | 7.7 |
| SolarWinds Incident Response | `squadcast` | incident-oncall | 7.7 |

See [`it-gapfill-paas-incident-onboarding-2026-08-18.md`](./it-gapfill-paas-incident-onboarding-2026-08-18.md). **Render 7.9 and PagerDuty 8.0 awards unchanged.**

---

## Priority remaining

| Cluster | Names still expected |
| --- | --- |
| itsm-service-desk | Zendesk skipped (customer-service primary) |
| observability-monitoring | optional Chronosphere YouTube when channel verified |
| incident-oncall | — (core peers covered) |
| source-control-devops | optional Harness / TeamCity; optional `cicd-pipeline` use case |
| hosting-providers | — (core peers covered) |
| cloud-paas | — (Render + Railway + Fly + Heroku covered); Render/Heroku YouTube when verified |
| web-data-collection | — (core peers covered) |

---

## Content deliverables status

| Artifact | Status |
| --- | --- |
| Category seed + activation | Done (v1.5.1) |
| Research + editorial | Done through gap-fill |
| Best page | Done (Render = cloud-paas award; peers named) |
| Comparisons | Done |
| Product-guide builders | Expanded with gap-fill primaries |
| Overview PNGs | Done (OG + teaching diagrams where blocked) |
| Official YouTube | Railway verified; Heroku / Squadcast skipped |
