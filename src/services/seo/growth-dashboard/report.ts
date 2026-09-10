import type { GrowthDashboardReport, LifecycleBucketCounts, MetricValue } from "./types";

function fmtMetric(m: MetricValue): string {
  if (m.kind === "not_connected") return m.label ?? "not connected";
  if (m.kind === "percent") {
    return `${m.value.toFixed(2)}%${m.note ? ` _(${m.note})_` : ""}`;
  }
  if (m.kind === "number") {
    return `${m.value}${m.note ? ` _(${m.note})_` : ""}`;
  }
  return `${m.value}${m.note ? ` _(${m.note})_` : ""}`;
}

function bulletList(items: string[]): string {
  if (items.length === 0) return "_None._\n";
  return items.map((i) => `- ${i}`).join("\n") + "\n";
}

function lifecycleTable(b: LifecycleBucketCounts): string {
  return `| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ${b.total} | ${b.indexable} | ${b.improve} | ${b.improving} | ${b.readyForPromotion} | ${b.manualReview} | ${b.retired} |`;
}

/**
 * Format docs/seo/GROWTH-DASHBOARD.md (system + latest snapshot).
 */
export function formatGrowthDashboardMarkdown(
  report: GrowthDashboardReport,
): string {
  const scorecard = report.scorecard
    .map(
      (p) =>
        `### ${p.label} — \`${p.status}\`\n\nConfidence: \`${p.confidence}\` · Freshness: ${p.dataFreshness ?? "—"} · Trend: \`${p.trendAvailability}\`\n\n${p.summary}\n\nEvidence:\n${bulletList(p.evidence)}\nGaps:\n${bulletList(p.gaps)}`,
    )
    .join("\n");

  const top20 =
    report.opportunity.top20.length === 0
      ? "_Not connected / empty._\n"
      : report.opportunity.top20
          .map(
            (r, i) =>
              `${i + 1}. \`${r.path}\` — score ${r.score ?? "—"} · pos ${r.position ?? "—"} · ${r.primaryAction ?? "—"} · ${(r.relationshipSource ?? "UNKNOWN")}${r.queryEvidence ? ` · query: ${r.queryEvidence}` : ""} · actionConf ${r.actionConfidence ?? "—"}`,
          )
          .join("\n") + "\n";

  const ctrOps =
    report.organicSearch.ctrDetail.highImpressionLowCtr.length === 0
      ? "_None / not enough comparable pages._\n"
      : report.organicSearch.ctrDetail.highImpressionLowCtr
          .slice(0, 10)
          .map(
            (r) =>
              `- \`${r.path}\` — ${r.impressions} imp · pos ${r.position} · CTR ${r.actualCtr}% vs expected ${r.expectedCtr}% (gap ${r.ctrGapPctPoints}pp)`,
          )
          .join("\n") + "\n";

  const sources = report.sourceInventory
    .map(
      (s) =>
        `| ${s.label} | \`${s.status}\` | \`${s.validity}\` | ${s.path ? `\`${s.path}\`` : "—"} |`,
    )
    .join("\n");

  const evidenceTrend =
    report.contentQuality.evidenceTrend.length === 0
      ? "_No trend points._\n"
      : report.contentQuality.evidenceTrend
          .map(
            (t) =>
              `- **${t.label}** (${t.at ?? "—"}): hands-on ${t.handsOnTested} · data-verified ${t.dataVerified} · research-based ${t.researchOnly}`,
          )
          .join("\n") + "\n";

  return `# Growth Dashboard

**Internal only.** Not a public SEO dashboard. Do not fabricate unavailable metrics.

Generated: ${report.generatedAt}  
Engine: ${report.engineVersion}  
Strategy: **${report.strategyLabel}**

---

## System

Unified internal view of whether SoftwareGlimpse is becoming a stronger organic search and software-intelligence property.

| Artifact | Path |
|---|---|
| This report | \`docs/seo/GROWTH-DASHBOARD.md\` |
| Machine JSON | \`data/seo/growth-dashboard.json\` |
| Internal UI | \`/dev/growth/?secret=…\` |
| Implementation | \`src/services/seo/growth-dashboard/\` |

### Data sources

GSC Opportunity Engine · indexing / Coverage · content lifecycle audits · quality gate history · product testing · research · digital PR · AI visibility · distribution · affiliate programme coverage.

Missing integrations show **not connected**. Validity: **REAL** / **PARTIAL** / **FIXTURE** / **NOT_CONNECTED** / **STALE**. Fixture/sample inputs never drive production north-star status.

### North-star objectives

Six primary objectives (\`on_track\` / \`building\` / \`insufficient_trend\` / \`behind\` / \`not_connected\`). Each carries **confidence**, **data freshness**, and **trend availability**. **No single vanity composite score.** Top-10 page count alone never implies \`on_track\`; missing historical trend usually yields \`insufficient_trend\`.

### CLI

\`\`\`bash
npm run seo:growth-dashboard
npm run seo:growth-dashboard -- --no-write --json
\`\`\`

### Access

Secret gate matches product testing: \`GROWTH_SECRET\` or \`TESTING_SECRET\` or \`PREVIEW_SECRET\`.

---

## North-star objectives

${scorecard}

---

## Weekly view

### What improved
${bulletList(report.weekly.improved)}

### What declined
${bulletList(report.weekly.declined)}

### Top actions
${bulletList(report.weekly.topActions)}

### Major pricing changes
${bulletList(report.weekly.majorPricingChanges)}

### Links earned
${bulletList(report.weekly.linksEarned)}

### New tested products
${bulletList(report.weekly.newTestedProducts)}

### Research published
${bulletList(report.weekly.researchPublished)}

${report.weekly.notes.map((n) => `_${n}_`).join("\n\n")}

---

## 1. Search visibility (Discovery · Ranking · CTR · Traffic)

Status: \`${report.organicSearch.status}\` · Validity: \`${report.organicSearch.validity}\`  
Source: ${report.organicSearch.sourceLabel ?? "—"} · Through ${report.organicSearch.dataThroughDate ?? "—"}

### Discovery
| Metric | Value |
|---|---|
| Pages with impressions | ${fmtMetric(report.organicSearch.discovery.pagesWithImpressions)} |
| Impressions | ${fmtMetric(report.organicSearch.discovery.impressions)} |

### Ranking
| Band | Value |
|---|---|
| Top 10 | ${fmtMetric(report.organicSearch.ranking.top10)} |
| 11–20 | ${fmtMetric(report.organicSearch.ranking.band11to20)} |
| 21–50 | ${fmtMetric(report.organicSearch.ranking.band21to50)} |
| >50 | ${fmtMetric(report.organicSearch.ranking.deeperThan50)} |
| Weighted position | ${fmtMetric(report.organicSearch.ranking.weightedPosition)} |

### Page-one quality
| Metric | Value |
|---|---|
| Top-10 impressions | ${fmtMetric(report.organicSearch.pageOneQuality.top10Impressions)} |
| Top-10 clicks | ${fmtMetric(report.organicSearch.pageOneQuality.top10Clicks)} |
| Top-10 share of impressions | ${fmtMetric(report.organicSearch.pageOneQuality.top10ShareOfImpressions)} |
| Top-10 pages ≥100 impressions | ${fmtMetric(report.organicSearch.pageOneQuality.top10PagesWith100PlusImpressions)} |
| Top-10 pages with clicks | ${fmtMetric(report.organicSearch.pageOneQuality.top10PagesWithClicks)} |
| Top-10 commercial pages | ${fmtMetric(report.organicSearch.pageOneQuality.top10CommercialPages)} |
| Commercial Top-10 share | ${fmtMetric(report.organicSearch.pageOneQuality.commercialTop10Share)} |
| Site CTR | ${fmtMetric(report.organicSearch.pageOneQuality.siteCtr)} |

${report.organicSearch.pageOneQuality.note}

### CTR
| Metric | Value |
|---|---|
| Site CTR | ${fmtMetric(report.organicSearch.ctrDetail.siteCtr)} |
| Compared pages | ${fmtMetric(report.organicSearch.ctrDetail.comparedPageCount)} |

${report.organicSearch.ctrDetail.note}

High-impression low-CTR opportunities:

${ctrOps}

### Traffic
| Metric | Value |
|---|---|
| Organic clicks | ${fmtMetric(report.organicSearch.traffic.organicClicks)} |
| Pages with clicks | ${fmtMetric(report.organicSearch.traffic.pagesWithClicks)} |

Trend: \`${report.organicSearch.trend.status}\` — ${report.organicSearch.trend.note}

---

## 2. Content estate

Status: \`${report.contentEstate.status}\`

### Totals

${lifecycleTable(report.contentEstate.totals)}

### By type

#### Guides
${lifecycleTable(report.contentEstate.byType.guides)}

#### Comparisons
${lifecycleTable(report.contentEstate.byType.comparisons)}

#### Software
${lifecycleTable(report.contentEstate.byType.software)}

#### Other (sitemap remainder)
${lifecycleTable(report.contentEstate.byType.other)}

${bulletList(report.contentEstate.notes)}

---

## 3. Improvement velocity (${report.improvementVelocity.windowLabel})

Status: \`${report.improvementVelocity.status}\`

| Metric | Value |
|---|---|
| Pages improved | ${fmtMetric(report.improvementVelocity.pagesImprovedThisWeek)} |
| Promoted to indexable | ${fmtMetric(report.improvementVelocity.pagesPromotedToIndexable)} |
| Quality score improved | ${fmtMetric(report.improvementVelocity.pagesQualityScoreImproved)} |
| Average quality delta | ${fmtMetric(report.improvementVelocity.averageQualityDelta)} |
| Quality regressions | ${fmtMetric(report.improvementVelocity.qualityRegressions)} |
| Promotion conversion rate | ${fmtMetric(report.improvementVelocity.promotionConversionRate)} |
| Rankings improved after upgrade | ${fmtMetric(report.improvementVelocity.pagesRankingsImprovedAfterUpgrade)} |

### Largest improvements
${
  report.improvementVelocity.largestImprovements.length === 0
    ? "_None in window._"
    : report.improvementVelocity.largestImprovements
        .map(
          (i) =>
            `- ${i.url}: ${i.from} → ${i.to} (**+${i.scoreDelta}**)`,
        )
        .join("\n")
}

${bulletList(report.improvementVelocity.notes)}

---

## 4. Indexation

Status: \`${report.indexing.status}\` · Validity: \`${report.indexing.validity}\`  
Source: ${report.indexing.sourceLabel ?? "—"}

| Metric | Value |
|---|---|
| Sitemap URL count | ${fmtMetric(report.indexing.sitemapUrlCount)} |
| GSC indexed (Coverage) | ${fmtMetric(report.indexing.indexedUrls)} |
| Discovered not indexed | ${fmtMetric(report.indexing.discoveredNotIndexed)} |
| Crawled not indexed | ${fmtMetric(report.indexing.crawledNotIndexed)} |
| Indexation ratio | ${fmtMetric(report.indexing.indexationRatio)} |

${bulletList(report.indexing.notes)}

---

## 5. Opportunity

Status: \`${report.opportunity.status}\` · Validity: \`${report.opportunity.validity}\`

${top20}

${bulletList(report.opportunity.notes)}

---

## 6. Evidence

Status: \`${report.contentQuality.status}\` · Validity: \`${report.contentQuality.validity}\`

| Level | Value |
|---|---|
| Hands-on tested | ${fmtMetric(report.contentQuality.handsOnTested)} |
| Data verified | ${fmtMetric(report.contentQuality.dataVerified)} |
| Research-based | ${fmtMetric(report.contentQuality.researchOnly)} |
| Reviews with evidence | ${fmtMetric(report.contentQuality.reviewsWithEvidence)} |
| Stale pricing pages | ${fmtMetric(report.contentQuality.stalePricingPages)} |
| Pages requiring refresh | ${fmtMetric(report.contentQuality.pagesRequiringRefresh)} |

### Evidence over time

${evidenceTrend}

${bulletList(report.contentQuality.notes)}

---

## 7. Authority

Status: \`${report.authority.status}\` · Validity: \`${report.authority.validity}\`

| Metric | Value |
|---|---|
| Referring domains | ${fmtMetric(report.authority.referringDomains)} |
| Backlinks | ${fmtMetric(report.authority.backlinks)} |
| Linked pages | ${fmtMetric(report.authority.linkedPages)} |
| Topical relevance (avg) | ${fmtMetric(report.authority.topicalRelevanceAverage)} |
| New referring domains | ${fmtMetric(report.authority.newReferringDomains)} |
| Lost referring domains | ${fmtMetric(report.authority.lostReferringDomains)} |
| Links → research assets | ${fmtMetric(report.authority.linksToResearchAssets)} |
| Links → commercial pages | ${fmtMetric(report.authority.linksToCommercialPages)} |
| Quality prospects | ${fmtMetric(report.authority.qualityProspects)} |
| Links earned | ${fmtMetric(report.authority.linksEarned)} |
| Research assets | ${fmtMetric(report.authority.researchAssetsEarningLinks)} |

Validity legend: \`REAL\` · \`PARTIAL\` · \`STALE\` (>45d) · \`FIXTURE\` · \`NOT_CONNECTED\`

${
  report.authority.sampleLinks.length
    ? `### Sample REAL links\n\n| Source domain | Target URL | Topical relevance | Status |\n| --- | --- | --- | --- |\n${report.authority.sampleLinks
        .map(
          (l) =>
            `| ${l.sourceDomain} | ${l.targetUrl ?? "—"} | ${l.topicalRelevance ?? "—"} | ${l.status ?? "—"} |`,
        )
        .join("\n")}\n`
    : "_No REAL backlink rows to sample (export NOT_CONNECTED or empty)._\n"
}
${bulletList(report.authority.notes)}

---

## 8. Research / AI / Distribution / Commercial

### Research
| Metric | Value |
|---|---|
| Published reports | ${fmtMetric(report.research.publishedReports)} |
| Dataset coverage | ${fmtMetric(report.research.datasetCoverage)} |
| Latest | ${fmtMetric(report.research.latestResearch)} |
| Research citations tracked | ${fmtMetric(report.research.researchCitationsTracked)} |

### AI Visibility (\`${report.aiVisibility.validity}\`)
| Metric | Value |
|---|---|
| Citations | ${fmtMetric(report.aiVisibility.citations)} |
| Unique cited pages | ${fmtMetric(report.aiVisibility.uniqueCitedPages)} |
| Platforms | ${fmtMetric(report.aiVisibility.platforms)} |

${bulletList(report.aiVisibility.notes)}

### Commercial (\`${report.commercial.validity}\`)
| Metric | Value |
|---|---|
| Affiliate clicks | ${fmtMetric(report.commercial.affiliateClicks)} |
| Conversions | ${fmtMetric(report.commercial.conversions)} |
| Matched conversions | ${fmtMetric(report.commercial.matchedConversions)} |
| Conversion rate | ${fmtMetric(report.commercial.conversionRate)} |
| Commission | ${fmtMetric(report.commercial.commission)} |
| Revenue | ${fmtMetric(report.commercial.revenue)} |
| Unmatched conversions | ${fmtMetric(report.commercial.unmatchedConversions)} |
| Programme coverage | ${fmtMetric(report.commercial.programmeCoverage)} |

Top converting source pages:
${bulletList(report.commercial.topConvertingSourcePages)}

Top products:
${bulletList(report.commercial.topProducts)}

${bulletList(report.commercial.notes)}

---

## Source inventory

| Source | Status | Validity | Path |
|---|---|---|---|
${sources}

---

## Compliance

${bulletList(report.complianceNotes)}
`;
}
