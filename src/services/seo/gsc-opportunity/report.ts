import type { GscOpportunityReport, GscOpportunityRow } from "./types";

function pct(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

function pos(n: number): string {
  return n.toFixed(1);
}

function querySourceLabel(row: GscOpportunityRow): string {
  const source = row.relationshipSource ??
    (row.queryProvenance === "INFERRED"
      ? row.queryMappingConfidence === "HIGH"
        ? "INFERRED_HIGH"
        : row.queryMappingConfidence === "MEDIUM"
          ? "INFERRED_MEDIUM"
          : row.queryMappingConfidence === "LOW"
            ? "INFERRED_LOW"
            : "UNKNOWN"
      : row.queryProvenance);
  if (source === "DIRECT_GSC") return "DIRECT_GSC";
  if (source === "HISTORICAL_DIRECT_GSC") return "HISTORICAL_DIRECT_GSC";
  if (source === "INFERRED_HIGH") return "INFERRED_HIGH — NOT DIRECT GSC DATA";
  if (source === "INFERRED_MEDIUM") return "INFERRED_MEDIUM — NOT DIRECT GSC DATA";
  if (source === "INFERRED_LOW") return "INFERRED_LOW — NOT DIRECT GSC DATA";
  return "UNKNOWN";
}

function targetQueryLabel(row: GscOpportunityRow): string {
  if (row.targetQuery) return row.targetQuery;
  if (row.inferredQueryCandidates?.length) {
    return `(candidates only — ${row.inferredQueryCandidates[0]!.query})`;
  }
  return "—";
}

function problemLabel(row: GscOpportunityRow): string {
  return row.rootCauses.slice(0, 2).join(", ") || "OTHER";
}

function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|");
}

export function formatTop20GrowthPagesMarkdown(
  report: GscOpportunityReport,
): string {
  const lines: string[] = [];
  lines.push("# TOP 20 — Growth pages (GSC opportunities)");
  lines.push("");
  lines.push(
    `**Generated:** ${report.generatedAt}  `,
  );
  lines.push(`**Engine:** v${report.engineVersion}  `);
  lines.push(`**GSC source:** \`${report.sourceFile}\`  `);
  if (report.provenance) {
    lines.push(
      `**Provenance:** real export · range ${report.provenance.dateRangeStart ?? "?"} → ${report.provenance.dateRangeEnd ?? "?"} · imported ${report.provenance.importRetrievedAt ?? "—"} · report ${report.provenance.generatedAt}`,
    );
  }
  if (report.dataThroughDate) {
    lines.push(`**Data through:** ${report.dataThroughDate}  `);
  }
  if (report.rangeLabel) {
    lines.push(`**Range:** ${report.rangeLabel}  `);
  }
  lines.push("");
  lines.push(
    "> Actionable shortlist of **existing** pages. Prefer Queue B (IMPROVE/noindex promotion) when historical GSC demand exists. **Do not create new pages by default.** Scores are relative prioritization — not ranking probabilities.",
  );
  lines.push("");
  lines.push("## Queue A — Indexed page improvement");
  lines.push("");
  lines.push(
    "| Priority | URL | Page opportunity | Query evidence | Query confidence | Relationship | Recommended action | Action conf |",
  );
  lines.push("| ---: | --- | ---: | --- | --- | --- | --- | --- |");
  for (const row of report.indexedImprovementQueue.slice(0, 15)) {
    lines.push(
      `| ${row.rank} | ${mdEscape(row.path)} | ${row.opportunityScore} | ${mdEscape(targetQueryLabel(row))} | ${row.queryMappingConfidence ?? "UNKNOWN"} | ${mdEscape(querySourceLabel(row))} | ${row.primaryAction} | ${row.actionConfidence ?? "PAGE_LEVEL"} |`,
    );
  }
  lines.push("");
  lines.push("## Queue B — IMPROVE / noindex promotion (critical)");
  lines.push("");
  lines.push(
    "| Priority | URL | Page opportunity | Query evidence | Query confidence | Relationship | Lifecycle | Recommended action | Action conf |",
  );
  lines.push("| ---: | --- | ---: | --- | --- | --- | --- | --- | --- |");
  for (const row of report.improvePromotionQueue.slice(0, 15)) {
    lines.push(
      `| ${row.rank} | ${mdEscape(row.path)} | ${row.opportunityScore} | ${mdEscape(targetQueryLabel(row))} | ${row.queryMappingConfidence ?? "UNKNOWN"} | ${mdEscape(querySourceLabel(row))} | ${row.lifecycleState ?? "noindex/IMPROVE"} | ${row.primaryAction} | ${row.actionConfidence ?? "PAGE_LEVEL"} |`,
    );
  }
  lines.push("");
  lines.push("## Combined Top 20");
  lines.push("");
  lines.push(
    "| Priority | URL | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf |",
  );
  lines.push(
    "| ---: | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- |",
  );

  for (const row of report.top20) {
    lines.push(
      `| ${row.rank} | ${mdEscape(row.path)} | ${row.opportunityScore} | ${mdEscape(targetQueryLabel(row))} | ${row.queryMappingConfidence ?? "UNKNOWN"} | ${mdEscape(querySourceLabel(row))} | ${Math.round(row.impressions)} | ${pos(row.avgPosition)} | ${row.primaryAction} | ${row.actionConfidence ?? "PAGE_LEVEL"} |`,
    );
  }

  lines.push("");
  lines.push("## Detail cards");
  lines.push("");

  for (const row of report.top20) {
    lines.push(`### ${row.rank}. \`${row.path}\``);
    lines.push("");
    lines.push(`- **Page opportunity score:** ${row.opportunityScore}/100`);
    lines.push(`- **Problem:** ${problemLabel(row)}`);
    lines.push(`- **Type:** ${row.pageType} · **Estate:** ${row.estateType}`);
    lines.push(
      `- **Queue:** ${row.queueBucket === "improve_promotion" ? "B — IMPROVE/promote" : "A — indexed improve"}${row.lifecycleState ? ` (${row.lifecycleState})` : ""}`,
    );
    lines.push(`- **Query relationship:** ${querySourceLabel(row)}`);
    lines.push(
      `- **Query confidence:** ${row.queryMappingConfidence ?? "UNKNOWN"}`,
    );
    lines.push(`- **Query evidence:** ${row.targetQuery ?? "—"}`);
    if (row.queryEvidence?.length) {
      lines.push(
        `- **Evidence:** ${row.queryEvidence.map((e) => e.label + (e.detail ? ` (${e.detail})` : "")).join("; ")}`,
      );
    }
    if (row.querySourceDateRange?.startDate || row.querySourceDateRange?.endDate) {
      lines.push(
        `- **Source date range:** ${row.querySourceDateRange.startDate ?? "?"} → ${row.querySourceDateRange.endDate ?? "?"}`,
      );
    }
    lines.push(
      `- **Action confidence:** ${row.actionConfidence ?? "PAGE_LEVEL"}${row.requiresHumanReview ? " · human review required" : ""}`,
    );
    if (row.queryMappingReason) {
      lines.push(`- **Mapping reason:** ${row.queryMappingReason}`);
    }
    if (row.inferredQueryCandidates?.length) {
      lines.push(
        `- **Inferred candidates (NOT DIRECT GSC):** ${row.inferredQueryCandidates
          .slice(0, 5)
          .map(
            (c) =>
              `${c.query} [${c.relationshipSource ?? c.mappingConfidence}]`,
          )
          .join("; ")}`,
      );
    }
    if (row.intentProfile?.primaryQueryCluster) {
      lines.push(
        `- **Primary cluster:** ${row.intentProfile.primaryQueryCluster}`,
      );
    }
    if (row.intentProfile?.secondaryQueryClusters.length) {
      lines.push(
        `- **Secondary clusters:** ${row.intentProfile.secondaryQueryClusters.join("; ")}`,
      );
    }
    if (row.intentProfile?.contentMismatch) {
      lines.push(
        `- **Content mismatch:** ${row.intentProfile.mismatchNotes.join("; ") || "yes"}`,
      );
    }
    if (row.secondaryQueries.length) {
      lines.push(
        `- **Secondary (trusted):** ${row.secondaryQueries.join("; ")}`,
      );
    }
    lines.push(
      `- **Metrics:** ${Math.round(row.impressions)} imp · ${row.clicks} clicks · CTR ${pct(row.ctr)} · avg pos ${pos(row.avgPosition)}`,
    );
    lines.push(`- **Intent:** ${row.commercialIntent}`);
    lines.push(`- **Root causes:** ${row.rootCauses.join(", ")}`);
    lines.push(
      `- **Actions:** ${row.recommendedActions.join(", ")} (primary: **${row.primaryAction}**)`,
    );
    lines.push(
      `- **Difficulty:** ${row.expectedDifficulty} · **Change mode:** ${row.contentChangeMode}`,
    );
    lines.push(
      `- **Backlinks likely help:** ${row.backlinksLikelyHelp ? "yes" : "no"}`,
    );
    if (row.internalLinkRecommendations.length) {
      lines.push(
        `- **Internal links:** ${row.internalLinkRecommendations.join("; ")}`,
      );
    }
    if (row.sourcePaths.length > 1) {
      lines.push(
        `- **Legacy sources rolled up:** ${row.sourcePaths.join(", ")}`,
      );
    }
    lines.push("");
  }

  lines.push("## AI Visibility (Organic Growth feed)");
  lines.push("");
  if (report.aiVisibility?.exportAvailable) {
    const a = report.aiVisibility;
    lines.push(
      `Loaded from \`data/seo/ai-visibility.json\` (${a.generatedAt}). Measurement only — do not manipulate AI systems.`,
    );
    lines.push("");
    lines.push("| Metric | Value |");
    lines.push("| --- | ---: |");
    lines.push(`| Total SG citations | ${a.totalCitations} |`);
    lines.push(`| Unique cited pages | ${a.uniqueCitedPages} |`);
    lines.push(`| Top platform | ${a.topPlatform ?? "—"} |`);
    lines.push(`| New citations vs prior | ${a.newCitationCount} |`);
    lines.push(`| Lost citations vs prior | ${a.lostCitationCount} |`);
    lines.push("");
    if (a.topCitedPaths.length) {
      lines.push("**Top cited paths (overlap check with GSC shortlist):**");
      lines.push("");
      for (const p of a.topCitedPaths) {
        const inTop20 = report.top20.some((r) => r.path === p);
        lines.push(`- \`${p}\`${inTop20 ? " ← also in TOP 20 GSC" : ""}`);
      }
      lines.push("");
    }
    lines.push("Full report: [`AI-VISIBILITY.md`](./AI-VISIBILITY.md)");
    lines.push("");
  } else {
    lines.push(
      "_No AI Visibility export on disk._ Run `npm run seo:ai-visibility` after dropping a legitimate Ahrefs (or similar) export under `data/seo/imports/ahrefs-ai-visibility/`. Never invent citations.",
    );
    lines.push("");
  }

  lines.push("## This week");
  lines.push("");
  for (const step of report.weeklyProcess) {
    lines.push(`- ${step}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function formatGscOpportunitiesMarkdown(
  report: GscOpportunityReport,
): string {
  const lines: string[] = [];
  lines.push("# GSC Opportunities — SoftwareGlimpse");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Engine version:** ${report.engineVersion}`);
  lines.push(`**Source file used:** \`${report.sourceFile}\``);
  if (report.sourceLabel) lines.push(`**Source label:** ${report.sourceLabel}`);
  if (report.dataThroughDate) {
    lines.push(`**Data through:** ${report.dataThroughDate}`);
  }
  if (report.rangeLabel) lines.push(`**Range:** ${report.rangeLabel}`);
  lines.push("");
  lines.push("## Methodology notes");
  lines.push("");
  for (const note of report.methodologyNotes) {
    lines.push(`- ${note}`);
  }
  lines.push("");
  lines.push("## Totals");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push(`| Raw page rows | ${report.totals.rawPageRows} |`);
  lines.push(`| Raw query rows | ${report.totals.rawQueryRows} |`);
  lines.push(
    `| Raw page×query rows | ${report.totals.rawPageQueryRows ?? 0} |`,
  );
  lines.push(
    `| Has page×query matrix | ${report.totals.hasPageQueryMatrix ? "yes" : "no"} |`,
  );
  lines.push(`| Excluded page rows | ${report.totals.excludedPages} |`);
  lines.push(`| Eligible rolled-up pages | ${report.totals.eligiblePages} |`);
  lines.push(`| Scored pages | ${report.totals.scoredPages} |`);
  lines.push(`| Diagnosed pages | ${report.totals.diagnosedPages} |`);
  lines.push(
    `| Pages with DIRECT_GSC query | ${report.totals.pagesWithDirectQuery ?? 0} |`,
  );
  lines.push(
    `| Pages with INFERRED only | ${report.totals.pagesWithInferredOnly ?? 0} |`,
  );
  lines.push(
    `| Pages with UNKNOWN query | ${report.totals.pagesWithUnknownQuery ?? 0} |`,
  );
  lines.push(
    `| Queue A (indexed improve) | ${report.totals.indexedImprovementCount} |`,
  );
  lines.push(
    `| Queue B (IMPROVE/promote) | ${report.totals.improvePromotionCount} |`,
  );
  lines.push(
    `| CREATE deferred → existing page | ${report.totals.createCandidatesDeferred} |`,
  );
  lines.push("");

  lines.push("## Queue A — Indexed page improvement");
  lines.push("");
  lines.push(tableFor(report.indexedImprovementQueue));
  lines.push("");

  lines.push("## Queue B — IMPROVE / noindex promotion");
  lines.push("");
  lines.push(tableFor(report.improvePromotionQueue));
  lines.push("");
  lines.push("### Exclusion summary");
  lines.push("");
  lines.push("| Reason | Count |");
  lines.push("| --- | ---: |");
  for (const [reason, count] of Object.entries(report.exclusionSummary).sort(
    (a, b) => b[1] - a[1],
  )) {
    lines.push(`| ${reason} | ${count} |`);
  }
  lines.push("");

  lines.push("## TOP 20 — Immediate opportunities");
  lines.push("");
  lines.push(tableFor(report.top20));
  lines.push("");

  lines.push("## TOP 50 — High-priority opportunities");
  lines.push("");
  lines.push(tableFor(report.top50));
  lines.push("");

  lines.push("## TOP 100 — Full improvement backlog");
  lines.push("");
  lines.push(tableFor(report.top100));
  lines.push("");

  if (report.cannibalization.length) {
    lines.push("## Cannibalization / intent overlap");
    lines.push("");
    lines.push("| Classification | Cluster/query | Provenance | Paths | Impressions | Review |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const c of report.cannibalization.slice(0, 20)) {
      lines.push(
        `| ${c.classification ?? "CANNIBALIZATION"} | ${mdEscape(c.queryOrCluster)} | ${c.queryProvenance ?? "UNKNOWN"} | ${c.paths.map(mdEscape).join("<br>")} | ${c.impressions.join(", ")} | ${c.requiresReview ? "yes" : "no"} |`,
      );
    }
    lines.push("");
  }

  if (report.queriesWithoutPage.length) {
    lines.push("## High-impression queries — existing-page-first");
    lines.push("");
    lines.push(
      "_Prefer improving an existing SoftwareGlimpse URL. CREATE_CANDIDATE only when no suitable page exists._",
    );
    lines.push("");
    lines.push("| Query | Imp | Pos | Intent | Improve existing | Create? |");
    lines.push("| --- | ---: | ---: | --- | --- | --- |");
    for (const q of report.queriesWithoutPage.slice(0, 25)) {
      lines.push(
        `| ${mdEscape(q.query)} | ${Math.round(q.impressions)} | ${pos(q.position)} | ${q.intent} | ${mdEscape(q.improveExistingPath ?? "—")} | ${q.createCandidateSuggested ? "maybe" : "no"} |`,
      );
    }
    lines.push("");
  }

  if (report.systemFeeds) {
    lines.push("## System feeds");
    lines.push("");
    for (const [k, v] of Object.entries(report.systemFeeds)) {
      lines.push(`- **${k}:** \`${v}\``);
    }
    lines.push("");
  }

  lines.push("## AI Visibility summary");
  lines.push("");
  if (report.aiVisibility?.exportAvailable) {
    const a = report.aiVisibility;
    lines.push(
      `| Citations | Unique pages | Top platform | New | Lost |`,
    );
    lines.push("| ---: | ---: | --- | ---: | ---: |");
    lines.push(
      `| ${a.totalCitations} | ${a.uniqueCitedPages} | ${a.topPlatform ?? "—"} | ${a.newCitationCount} | ${a.lostCitationCount} |`,
    );
    lines.push("");
    lines.push("See [`AI-VISIBILITY.md`](./AI-VISIBILITY.md). Measurement only.");
    lines.push("");
  } else {
    lines.push(
      "_AI Visibility not loaded — run `npm run seo:ai-visibility` when a legitimate export is available._",
    );
    lines.push("");
  }

  lines.push("## Weekly process");
  lines.push("");
  for (const step of report.weeklyProcess) {
    lines.push(`${step}`);
  }
  lines.push("");
  lines.push("## Re-run");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run seo:gsc-opportunities -- --export path/to/gsc-export.json");
  lines.push("npm run seo:ai-visibility");
  lines.push("```");
  lines.push("");
  lines.push(
    "Machine-readable output: [`data/seo/gsc-opportunities.json`](../../data/seo/gsc-opportunities.json)  ",
  );
  lines.push(
    "Actionable top 20: [`TOP-20-GROWTH-PAGES.md`](./TOP-20-GROWTH-PAGES.md)",
  );
  lines.push(
    "AI Visibility: [`AI-VISIBILITY.md`](./AI-VISIBILITY.md)",
  );
  lines.push("");
  return lines.join("\n");
}

function tableFor(rows: GscOpportunityRow[]): string {
  const lines = [
    "| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |",
    "| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |",
  ];
  for (const row of rows) {
    lines.push(
      `| ${row.rank} | ${mdEscape(row.path)} | ${row.estateType} | ${row.queueBucket === "improve_promotion" ? "B" : "A"} | ${row.opportunityScore} | ${mdEscape(targetQueryLabel(row))} | ${row.queryMappingConfidence ?? "UNKNOWN"} | ${mdEscape(querySourceLabel(row))} | ${Math.round(row.impressions)} | ${pos(row.avgPosition)} | ${row.primaryAction} | ${row.actionConfidence ?? "PAGE_LEVEL"} | ${row.expectedDifficulty} |`,
    );
  }
  return lines.join("\n");
}
