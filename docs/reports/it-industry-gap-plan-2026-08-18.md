# IT systems — referenced gaps + industry shortlist

**Date:** 2026-08-18  
**Purpose:** Plan the next IT onboarding wave after hosting providers + web-data peers.  
**Method:** (1) scan SoftwareGlimpse references for missing products, (2) industry buyers’ shortlists by job cluster.  
**Rules:** Rank only inside clusters. No WordPress auto-publish. Affiliate economics excluded. `handsOnTesting=false`.

Related: [`it-development-product-coverage.md`](./it-development-product-coverage.md) · [`hosting-automation-overlay-onboarding-2026-08-18.md`](./hosting-automation-overlay-onboarding-2026-08-18.md)

---

## Scan result — referenced but missing

| Check | Result |
| --- | --- |
| IT `competitorSlugs` / `alternativeSlugs` / `comparableSlugs` pointing at absent seed products | **0** — mesh is clean |
| Soft / copy references without a product page | Opsgenie (in JSM enrichment), Smartproxy (deferred in web-data report), “AWS observability peers” (Wave-1 follow-up) |
| Affiliate inventory still open for `it-development` | ThorData / Bright Data / Plesk already handled; no new IT affiliate waiting |

**Cross-category (not missing, but identity-aware):** Freshservice (customer-service primary) lists `jira` (PM) and `zendesk-suite` (CS) — landscape, not IT seed gaps.

**Conclusion:** There is no “referenced slug but no page” fire to put out. The next wave is **industry credibility** inside existing (and optionally new) job clusters.

---

## Current IT coverage (20 IT-primary + Freshservice CS/ITSM)

| Cluster | Onboarded | Award |
| --- | --- | --- |
| itsm-service-desk | ServiceNow, JSM, Freshservice (CS primary) | ServiceNow 8.7 |
| observability-monitoring | Datadog, New Relic, Grafana Cloud, Dynatrace | Datadog 8.6 |
| incident-oncall | PagerDuty | PagerDuty 8.0 |
| source-control-devops | GitHub, GitLab, Bitbucket, Azure DevOps | GitHub 9.1 |
| hosting-operations | Plesk, cPanel | Plesk 7.4 |
| hosting-providers | WP Engine, Cloudways | WP Engine 7.7 |
| web-data-collection | Bright Data, Oxylabs, Apify, ScraperAPI, ThorData | Bright Data 7.7 |

---

## Proposed Wave — industry IT systems

### Tier A — recommended next batch (existing clusters only)

| Product | Slug | Cluster | Why |
| --- | --- | --- | --- |
| **Splunk** (Observability / Cloud) | `splunk` | observability-monitoring | Classic enterprise observability peer of Datadog / Dynatrace |
| **Elastic Observability** | `elastic-observability` | observability-monitoring | Open-core / Elastic Cloud path vs Grafana / Datadog |
| **Sentry** | `sentry` | observability-monitoring* | App error / performance — *score as specialist peer; do not steal Datadog award* |
| **incident.io** | `incident-io` | incident-oncall | Modern incident peer of PagerDuty (Opsgenie absorbed into Atlassian — do **not** fake a separate Opsgenie product) |
| **CircleCI** | `circleci` | source-control-devops | CI/CD peer (GitHub Actions stays inside GitHub) |
| **DirectAdmin** | `directadmin` | hosting-operations | Historic panel peer of Plesk / cPanel (was soft-referenced earlier) |
| **Kinsta** | `kinsta` | hosting-providers | Managed WordPress peer of WP Engine |
| **Smartproxy (Decodo)** | `smartproxy` | web-data-collection | Explicitly deferred; now in-scope if this wave runs |

\*Optional: introduce use case `error-monitoring` later so Sentry is not forced into undifferentiated APM ranking vs Datadog.

### Tier B — second wave / optional new clusters

| Product | Cluster / note |
| --- | --- |
| ManageEngine ServiceDesk Plus, SysAid, HaloITSM | itsm-service-desk (SMB / mid-market ITSM depth) |
| AppDynamics, Honeycomb | observability-monitoring (enterprise APM / high-cardinality) |
| FireHydrant, Rootly | incident-oncall |
| Buildkite | source-control-devops (CI) |
| SiteGround | hosting-providers (hybrid shared/managed — identity review) |
| Zyte, IPRoyal | web-data-collection |
| **New cluster candidates (not in Tier A):** `cicd-pipeline`, `error-monitoring`, `remote-access` (Getscreen.me is currently PM-mapped — review separately) |

### Explicit skips / identity traps

| Name | Decision |
| --- | --- |
| Opsgenie | **Skip as standalone** — folded into Atlassian / JSM ops story |
| AWS CloudWatch / Azure Monitor | Skip as catalogue products for now (cloud-platform meters, not peer SaaS suites) |
| Jenkins | Defer — OSS + CloudBees packaging identity |
| Zendesk | Stays customer-service primary (already decided) |
| Prometheus / Grafana OSS | Grafana Cloud already covered; raw OSS not a product page |

---

## Ranking / deliverable expectations if Tier A is approved

1. Research packs + assessments with first-party pricing  
2. Seed + comparisons (same-cluster peers; landscape only across clusters)  
3. Best-page use-case peers updated; **existing awards unchanged** unless a same-cluster product clearly outranks on published evidence  
4. Lettermarks, official YouTube where vendor channel exists, overview visuals  
5. Product-guide packs for Tier A primaries  
6. Coverage map + onboarding report  
7. **No auto-publish**

---

## Approval gate

**Do not run onboarding until a batch is approved.** Recommended default: **Tier A (8 products)** in one batch, cluster by cluster.
