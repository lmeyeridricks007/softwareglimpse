import type { DataAvailabilityReport, SeoPriorityRow } from "./types";

function esc(v: string | null | undefined): string {
  return (v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function sortByImportance(rows: SeoPriorityRow[]): SeoPriorityRow[] {
  const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return [...rows].sort((a, b) => {
    const i =
      rank[a.historicalSeoImportance] - rank[b.historicalSeoImportance];
    if (i !== 0) return i;
    const r = rank[a.migrationRisk] - rank[b.migrationRisk];
    if (r !== 0) return r;
    const clicks = (b.gsc?.clicks ?? 0) - (a.gsc?.clicks ?? 0);
    if (clicks !== 0) return clicks;
    return a.legacyPath.localeCompare(b.legacyPath);
  });
}

function table(
  headers: string[],
  rows: string[][],
): string {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
}

export function renderSeoPriorityMigrationMapMarkdown(input: {
  generatedAt: string;
  availability: DataAvailabilityReport;
  rows: SeoPriorityRow[];
}): string {
  const { generatedAt, availability, rows } = input;
  const sorted = sortByImportance(rows);
  const lines: string[] = [];

  const critical = sorted.filter((r) => r.historicalSeoImportance === "CRITICAL");
  const high = sorted.filter((r) => r.historicalSeoImportance === "HIGH");
  const highTrafficRedirects = sorted.filter(
    (r) =>
      (r.gsc?.clicks ?? 0) > 0 &&
      (r.recommendedAction === "301_REDIRECT" ||
        r.recommendedAction === "MERGE_AND_301"),
  );
  const highImpression = sorted.filter((r) => (r.gsc?.impressions ?? 0) > 0);
  const backlinked = sorted.filter(
    (r) => (r.backlinks?.referringDomains ?? 0) > 0,
  );
  const unmappedValuable = sorted.filter(
    (r) =>
      !r.newPath &&
      (r.historicalSeoImportance === "CRITICAL" ||
        r.historicalSeoImportance === "HIGH") &&
      r.recommendedAction === "REVIEW",
  );
  const trafficLossRisks = sorted.filter(
    (r) =>
      r.migrationRisk === "CRITICAL" ||
      r.migrationRisk === "HIGH",
  );
  const lowValueRetire = sorted.filter(
    (r) =>
      r.historicalSeoImportance === "LOW" &&
      (r.recommendedAction === "410" || r.recommendedAction === "404"),
  );

  lines.push("# SEO Priority Migration Map");
  lines.push("");
  lines.push(`**Generated:** ${generatedAt}`);
  lines.push(`**Agent:** SeoPriorityMigrationAgent v1.0.0`);
  lines.push("");
  lines.push(
    "> Enriches the URL mapping plan with **historical SEO importance** where data exists. Does **not** invent GSC, Analytics, or backlink metrics.",
  );
  lines.push("");

  lines.push("## Data availability");
  lines.push("");
  lines.push(
    table(
      ["Source", "Available", "Notes"],
      [
        [
          "Google Search Console",
          availability.searchConsole.available ? "YES" : "NO",
          esc(availability.searchConsole.notes.join("; ")),
        ],
        [
          "Analytics (GA4 / sessions)",
          availability.analytics.available ? "YES" : "NO",
          esc(availability.analytics.notes.join("; ")),
        ],
        [
          "Backlink index",
          availability.backlinks.available ? "YES" : "NO",
          esc(availability.backlinks.notes.join("; ")),
        ],
        [
          "Proxy signals (mapping + content role + new-site inbound)",
          availability.proxySignals.available ? "YES" : "NO",
          esc(availability.proxySignals.notes.join("; ")),
        ],
      ],
    ),
  );
  lines.push("");
  lines.push("### How to attach live GSC later");
  lines.push("");
  lines.push("```bash");
  lines.push("# Place an approved GSC query×page export (non-synthetic) at:");
  lines.push("#   docs/migration/data/gsc-export.json");
  lines.push("# then:");
  lines.push("npm run migration:seo-priority");
  lines.push("# or:");
  lines.push("npm run migration:seo-priority -- --import path/to/gsc-export.json");
  lines.push("```");
  lines.push("");
  lines.push("## Importance rubric");
  lines.push("");
  lines.push("| Tier | When (evidence-based) |");
  lines.push("| --- | --- |");
  lines.push(
    "| CRITICAL | Live GSC clicks/impressions above threshold, or strong backlink evidence; **not** assigned from heuristics alone |",
  );
  lines.push(
    "| HIGH | Commercial product/comparison/best + brand relevance; and/or strong destination inbound; and/or mid GSC traffic when available |",
  );
  lines.push(
    "| MEDIUM | Guide/cluster role or weaker commercial signals |",
  );
  lines.push(
    "| LOW | Taxonomy/strategy retirements and thin infrastructure URLs (unless live traffic contradicts) |",
  );
  lines.push("");
  lines.push(
    `**Current run:** Search Console available = **${availability.searchConsole.available}**. Analytics = **${availability.analytics.available}**. Backlinks = **${availability.backlinks.available}**. Metric confidence for most rows is therefore **LOW** (proxy-only) or **NONE**.`,
  );
  lines.push("");

  lines.push("## Summary counts");
  lines.push("");
  lines.push(
    table(
      ["Bucket", "Count"],
      [
        ["CRITICAL importance", String(critical.length)],
        ["HIGH importance", String(high.length)],
        ["MEDIUM importance", String(sorted.filter((r) => r.historicalSeoImportance === "MEDIUM").length)],
        ["LOW importance", String(sorted.filter((r) => r.historicalSeoImportance === "LOW").length)],
        ["High-traffic redirects (GSC clicks > 0)", String(highTrafficRedirects.length)],
        ["High-impression pages (GSC impressions > 0)", String(highImpression.length)],
        ["Backlinked pages (referring domains > 0)", String(backlinked.length)],
        ["Unmapped valuable (HIGH/CRITICAL + REVIEW, no new URL)", String(unmappedValuable.length)],
        ["Migration risk CRITICAL/HIGH", String(trafficLossRisks.length)],
        ["Low-value retirement candidates", String(lowValueRetire.length)],
      ],
    ),
  );
  lines.push("");

  const rowCols = (r: SeoPriorityRow) => [
    `\`${r.legacyPath}\``,
    esc(r.legacyTitle),
    r.newPath ? `\`${r.newPath}\`` : "—",
    r.recommendedAction,
    r.historicalSeoImportance,
    r.migrationRisk,
    r.metricConfidence,
    esc(r.dataSources.join(", ")),
    esc(r.importanceReasons[0] ?? ""),
  ];

  const headers = [
    "Legacy URL",
    "Legacy title",
    "New URL",
    "Action",
    "Historical SEO importance",
    "Migration risk",
    "Metric confidence",
    "Data source",
    "Reason",
  ];

  lines.push("## Critical URLs");
  lines.push("");
  if (!availability.searchConsole.available && !availability.backlinks.available) {
    lines.push(
      "_None — CRITICAL tier requires live Search Console or backlink evidence. Those sources are **not available** in this repository run._",
    );
  } else if (critical.length === 0) {
    lines.push("_No URLs met CRITICAL thresholds in available data._");
  } else {
    lines.push(table(headers, critical.map(rowCols)));
  }
  lines.push("");

  lines.push("## High-traffic redirects");
  lines.push("");
  if (!availability.searchConsole.available) {
    lines.push(
      "_DATA NOT AVAILABLE — no live/import GSC page performance for legacy URLs. Cannot list high-traffic redirects without inventing clicks._",
    );
  } else if (highTrafficRedirects.length === 0) {
    lines.push("_No redirect candidates with GSC clicks > 0 in the loaded snapshot._");
  } else {
    lines.push(
      table(
        [...headers, "Clicks", "Impressions"],
        highTrafficRedirects.map((r) => [
          ...rowCols(r),
          String(r.gsc?.clicks ?? 0),
          String(r.gsc?.impressions ?? 0),
        ]),
      ),
    );
  }
  lines.push("");

  lines.push("## High-impression pages");
  lines.push("");
  if (!availability.searchConsole.available) {
    lines.push(
      "_DATA NOT AVAILABLE — impressions require Search Console import/live data._",
    );
  } else if (highImpression.length === 0) {
    lines.push("_No pages with impressions > 0 in the loaded snapshot._");
  } else {
    lines.push(
      table(
        ["Legacy URL", "Impressions", "Clicks", "Avg pos", "CTR", "Importance", "Action"],
        highImpression.slice(0, 100).map((r) => [
          `\`${r.legacyPath}\``,
          String(r.gsc?.impressions ?? 0),
          String(r.gsc?.clicks ?? 0),
          r.gsc?.averagePosition != null
            ? r.gsc.averagePosition.toFixed(1)
            : "—",
          r.gsc?.ctr != null ? `${(r.gsc.ctr * 100).toFixed(2)}%` : "—",
          r.historicalSeoImportance,
          r.recommendedAction,
        ]),
      ),
    );
  }
  lines.push("");

  lines.push("## Backlinked pages");
  lines.push("");
  if (!availability.backlinks.available) {
    lines.push(
      "_DATA NOT AVAILABLE — no backlink index provider or per-URL referring-domain export is wired. Do not invent backlink counts._",
    );
  } else if (backlinked.length === 0) {
    lines.push("_No backlinked legacy URLs in loaded dataset._");
  } else {
    lines.push(
      table(
        ["Legacy URL", "Referring domains", "Backlinks", "Importance", "Action"],
        backlinked.map((r) => [
          `\`${r.legacyPath}\``,
          String(r.backlinks?.referringDomains ?? 0),
          String(r.backlinks?.backlinks ?? "—"),
          r.historicalSeoImportance,
          r.recommendedAction,
        ]),
      ),
    );
  }
  lines.push("");

  lines.push("## Unmapped valuable URLs");
  lines.push("");
  lines.push(
    "HIGH importance (from commercial/cluster proxies and/or live metrics) still on **REVIEW** with no safe new URL:",
  );
  lines.push("");
  if (unmappedValuable.length === 0) {
    lines.push("_None in this run._");
  } else {
    lines.push(table(headers, unmappedValuable.slice(0, 80).map(rowCols)));
    if (unmappedValuable.length > 80) {
      lines.push("");
      lines.push(`_…and ${unmappedValuable.length - 80} more in data file_`);
    }
  }
  lines.push("");

  lines.push("## Potential traffic-loss risks");
  lines.push("");
  lines.push(
    "Migration risk CRITICAL/HIGH — prioritise editorial confirmation before cutover:",
  );
  lines.push("");
  lines.push(
    table(headers, trafficLossRisks.slice(0, 100).map(rowCols)),
  );
  if (trafficLossRisks.length > 100) {
    lines.push("");
    lines.push(`_…and ${trafficLossRisks.length - 100} more_`);
  }
  lines.push("");

  lines.push("## Low-value retirement candidates");
  lines.push("");
  lines.push(
    "LOW importance + 404/410 — safest retirement set **unless** a future GSC import shows residual clicks:",
  );
  lines.push("");
  lines.push(
    table(
      ["Legacy URL", "Action", "Intent", "Reason"],
      lowValueRetire.slice(0, 80).map((r) => [
        `\`${r.legacyPath}\``,
        r.recommendedAction,
        r.proxy.mappingAction ?? "",
        esc(r.importanceReasons[0] ?? ""),
      ]),
    ),
  );
  if (lowValueRetire.length > 80) {
    lines.push("");
    lines.push(`_…and ${lowValueRetire.length - 80} more (see JSON)_`);
  }
  lines.push("");

  lines.push("## HIGH importance (proxy-based) — commercial / cluster");
  lines.push("");
  lines.push(
    "These are **not** claimed as high-traffic. They are high migration priority from commercial and content-role signals while GSC is unavailable:",
  );
  lines.push("");
  lines.push(table(headers, high.slice(0, 80).map(rowCols)));
  if (high.length > 80) {
    lines.push("");
    lines.push(`_…and ${high.length - 80} more_`);
  }
  lines.push("");

  lines.push("## Fields added to each record");
  lines.push("");
  lines.push("- `historicalSeoImportance` — CRITICAL | HIGH | MEDIUM | LOW");
  lines.push("- `migrationRisk` — CRITICAL | HIGH | MEDIUM | LOW");
  lines.push("- `dataSources` — which evidence was used");
  lines.push("- `metricConfidence` — HIGH | MEDIUM | LOW | NONE");
  lines.push("- `gsc` / `analytics` / `backlinks` — null when unavailable");
  lines.push("");
  lines.push(
    "Machine-readable: [`data/seo-priority-migration-map.json`](./data/seo-priority-migration-map.json).",
  );
  lines.push("");

  return `${lines.join("\n")}\n`;
}
