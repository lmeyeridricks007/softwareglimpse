# Sitemap ↔ lifecycle reconciliation

**Generated:** 2026-09-10T21:02:55.897Z  
**Version:** 1.0.0  
**Canonical origin:** https://www.softwareglimpse.com  

Does **not** change content lifecycle states merely to make counts match.
Promotions hydrate from `data/seo/content-lifecycle.json` into sitemap builds.

## Estate totals (reviews excluded from sum — same as software)

| Metric | Count |
| --- | ---: |
| Total entities | 6691 |
| INDEXABLE | 3794 |
| IMPROVE | 721 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 51 |
| RETIRED | 0 |
| UNTRACKED | 2125 |
| In sitemap (sum of partitions) | 3600 |
| Not in sitemap | 3091 |
| Discrepancies | 0 |
| Auto-fixable | 0 |

## By page type

### guides

Sitemap partition: `guides` · expected indexable in sitemap: **589**

| Metric | Count |
| --- | ---: |
| total | 1715 |
| INDEXABLE | 767 |
| IMPROVE | 451 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 497 |
| in sitemap | 589 |
| not in sitemap | 1126 |

- Lifecycle registry + seed seo.indexable; sitemap via isEntityIndexable.
- Future-scheduled INDEXABLE guides correctly absent until scheduledAt.

### comparisons

Sitemap partition: `comparisons` · expected indexable in sitemap: **2138**

| Metric | Count |
| --- | ---: |
| total | 4000 |
| INDEXABLE | 2154 |
| IMPROVE | 167 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 51 |
| RETIRED | 0 |
| UNTRACKED | 1628 |
| in sitemap | 2138 |
| not in sitemap | 1862 |

- Lifecycle registry + seed; reviews are not a separate compare surface.

### software

Sitemap partition: `software` · expected indexable in sitemap: **314**

| Metric | Count |
| --- | ---: |
| total | 315 |
| INDEXABLE | 314 |
| IMPROVE | 1 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 314 |
| not in sitemap | 1 |

- No content-lifecycle registry — state derived from isEntityIndexable.
- Editorial reviews live on /software/{slug}/ (not a separate sitemap).

### reviews

Sitemap partition: `software` · expected indexable in sitemap: **314**

| Metric | Count |
| --- | ---: |
| total | 315 |
| INDEXABLE | 314 |
| IMPROVE | 1 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 314 |
| not in sitemap | 1 |

- Reviews are not a separate public URL — counted with software hubs.
- No /sitemap-reviews.xml by design (SITEMAP-ARCHITECTURE).

### best

Sitemap partition: `best` · expected indexable in sitemap: **11**

| Metric | Count |
| --- | ---: |
| total | 33 |
| INDEXABLE | 11 |
| IMPROVE | 22 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 11 |
| not in sitemap | 22 |

- Best hub /best/ in sitemap: true
- No lifecycle registry — flag + quality gate.

### alternatives

Sitemap partition: `alternatives` · expected indexable in sitemap: **309**

| Metric | Count |
| --- | ---: |
| total | 312 |
| INDEXABLE | 309 |
| IMPROVE | 3 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 309 |
| not in sitemap | 3 |

- No lifecycle registry — isEntityIndexable.

### categories

Sitemap partition: `categories` · expected indexable in sitemap: **22**

| Metric | Count |
| --- | ---: |
| total | 45 |
| INDEXABLE | 22 |
| IMPROVE | 23 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 22 |
| not in sitemap | 23 |

- Category URLs use seo.canonicalPath or /categories/{path.join}/.
- No lifecycle registry — isEntityIndexable.

### use-cases

Sitemap partition: `use-cases` · expected indexable in sitemap: **87**

| Metric | Count |
| --- | ---: |
| total | 120 |
| INDEXABLE | 87 |
| IMPROVE | 33 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 87 |
| not in sitemap | 33 |

- No lifecycle registry — indexabilityFromSeoFlag.

### industries

Sitemap partition: `industries` · expected indexable in sitemap: **25**

| Metric | Count |
| --- | ---: |
| total | 25 |
| INDEXABLE | 25 |
| IMPROVE | 0 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 25 |
| not in sitemap | 0 |

- No lifecycle registry — indexabilityFromSeoFlag.

### tools

Sitemap partition: `tools` · expected indexable in sitemap: **102**

| Metric | Count |
| --- | ---: |
| total | 123 |
| INDEXABLE | 102 |
| IMPROVE | 21 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 102 |
| not in sitemap | 21 |

- Tools use registry status + pillar gate — not content-lifecycle.json.

### research

Sitemap partition: `pages` · expected indexable in sitemap: **3**

| Metric | Count |
| --- | ---: |
| total | 3 |
| INDEXABLE | 3 |
| IMPROVE | 0 |
| IMPROVING | 0 |
| INDEXABLE_READY | 0 |
| READY_FOR_REVIEW | 0 |
| MANUAL_REVIEW | 0 |
| RETIRED | 0 |
| UNTRACKED | 0 |
| in sitemap | 3 |
| not in sitemap | 0 |

- Research hubs ship under sitemap-pages (not a separate child sitemap).

## Live validation

Attempted: true · OK: true · Base: https://www.softwareglimpse.com

- Live sitemap OK — 15 child sitemaps probed

| Path | Status | URLs | Error |
| --- | ---: | ---: | --- |
| /sitemap.xml | 200 | 15 |  |
| /sitemap-pages.xml | 200 | 32 |  |
| /sitemap-software.xml | 200 | 314 |  |
| /sitemap-comparisons.xml | 200 | 2138 |  |
| /sitemap-guides.xml | 200 | 589 |  |
| /sitemap-alternatives.xml | 200 | 310 |  |
| /sitemap-categories.xml | 200 | 22 |  |
| /sitemap-tools.xml | 200 | 102 |  |
| /sitemap-best.xml | 200 | 12 |  |
| /sitemap-use-cases.xml | 200 | 87 |  |
| /sitemap-capabilities.xml | 200 | 70 |  |
| /sitemap-features.xml | 200 | 16 |  |
| /sitemap-requirements.xml | 200 | 10 |  |
| /sitemap-resources.xml | 200 | 17 |  |
| /sitemap-audiences.xml | 200 | 8 |  |
| /sitemap-industries.xml | 200 | 25 |  |

## Schema / policy notes

- Hydration: content-lifecycle.json is bundled into the lifecycle store and reloaded from disk in Node sitemap builds.
- Do not change lifecycle states merely to make counts match.
- Reviews share software sitemap partition by design.
- INDEXABLE registry counts can exceed sitemap counts when pages are future-scheduled — those exclusions are correct.
- Deploy required: www.softwareglimpse.com may still serve a legacy monolithic urlset until this build is live.

