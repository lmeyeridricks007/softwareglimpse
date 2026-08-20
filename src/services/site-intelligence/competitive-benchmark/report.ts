import { competitorTypeLabel } from "../serp-competitors/classify-domain";
import { BENCHMARK_DIMENSION_KEYS } from "./score-page";
import type {
  CompetitiveBenchmarkReport,
  CompetitorProfile,
  QueryBenchmark,
} from "./types";

function scoreCell(n: number | null | undefined): string {
  return n == null ? "—" : String(n);
}

export function formatCompetitiveBenchmarkMarkdown(
  report: CompetitiveBenchmarkReport,
): string {
  const lines: string[] = [];
  lines.push("# Competitive Website Benchmark — SoftwareGlimpse");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Cluster:** ${report.cluster}`);
  lines.push(`**SERP source:** ${report.serpSource}`);
  lines.push(`**Observation mode:** ${report.observationMode}`);
  lines.push(`**Domains sampled:** ${report.domainsSampled}`);
  lines.push(`**Pages sampled:** ${report.pagesSampled}`);
  lines.push("");
  lines.push(
    "> Representative pages only — not a full-site crawl. Externally observable signals only. No traffic, DA, backlinks, conversion, or revenue claims.",
  );
  lines.push("");

  if (report.disclaimers.length) {
    lines.push("## Disclaimers");
    lines.push("");
    for (const d of report.disclaimers) lines.push(`- ${d}`);
    lines.push("");
  }

  if (report.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of report.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push("## Sampled query clusters");
  lines.push("");
  for (const c of report.clusters) {
    lines.push(`### ${c.label}`);
    lines.push("");
    lines.push(`- **Queries:** ${c.queries.join("; ")}`);
    lines.push(
      `- **SoftwareGlimpse page:** ${c.softwareGlimpsePage ? `\`${c.softwareGlimpsePage}\`` : "—"}`,
    );
    lines.push(
      `- **Domains (${c.domains.length}):** ${c.domains.map((d) => d.domain).join(", ")}`,
    );
    lines.push("");
  }

  lines.push("## Top competitor profiles (summary)");
  lines.push("");
  lines.push(
    "| Domain | Type | Significance | Pages | Strengths (top) | Weaknesses (top) |",
  );
  lines.push("| --- | --- | --- | ---: | --- | --- |");
  for (const p of report.profiles) {
    lines.push(
      `| ${p.domain} | ${competitorTypeLabel(p.type)} | ${p.significance} | ${p.pagesAnalyzed.length} | ${p.mainStrengths[0] ?? "—"} | ${p.mainWeaknesses[0] ?? "—"} |`,
    );
  }
  lines.push("");
  lines.push("Per-domain detail:");
  for (const p of report.profiles) {
    lines.push(`- [\`${p.domain}\`](./${p.domain}.md)`);
  }
  lines.push("");

  lines.push("## Page-by-page benchmarks");
  lines.push("");
  for (const b of report.benchmarks) {
    lines.push(...formatQueryBenchmarkSection(b));
  }

  if (report.softwareGlimpseNotes.length) {
    lines.push("## SoftwareGlimpse notes");
    lines.push("");
    for (const n of report.softwareGlimpseNotes) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:competitive-benchmark -- --fixture");
  lines.push("npm run site:competitive-benchmark -- --live");
  lines.push("```");
  lines.push("");
  lines.push(
    "Re-run after SERPCompetitorDiscoveryAgent refresh. Do not treat old competitor benchmarks as current.",
  );
  lines.push("");
  return lines.join("\n");
}

function formatQueryBenchmarkSection(b: QueryBenchmark): string[] {
  const lines: string[] = [];
  lines.push(`### Query: \`${b.query}\``);
  lines.push("");
  lines.push(
    `- **Cluster:** ${b.clusterId}`,
  );
  lines.push(
    `- **SoftwareGlimpse page:** ${b.softwareGlimpsePage ? `\`${b.softwareGlimpsePage}\`` : "—"}`,
  );
  lines.push("");

  const dimHeaders = BENCHMARK_DIMENSION_KEYS.map((k) => k.replace(/-/g, " "));
  lines.push(
    `| Page | ${dimHeaders.join(" | ")} |`,
  );
  lines.push(
    `| --- | ${BENCHMARK_DIMENSION_KEYS.map(() => "---:").join(" | ")} |`,
  );
  for (const row of b.rows) {
    const cells = BENCHMARK_DIMENSION_KEYS.map((k) =>
      scoreCell(row.dimensions[k]),
    );
    lines.push(
      `| ${row.label} (${row.domain}) | ${cells.join(" | ")} |`,
    );
  }
  lines.push("");
  lines.push("URLs:");
  for (const row of b.rows) {
    lines.push(`- **${row.label}:** \`${row.url}\``);
  }
  lines.push("");
  return lines;
}

export function formatDomainProfileMarkdown(
  profile: CompetitorProfile,
  generatedAt: string,
): string {
  const lines: string[] = [];
  lines.push(`# Competitor profile — ${profile.domain}`);
  lines.push("");
  lines.push(`**Generated:** ${generatedAt}`);
  lines.push(`**Type:** ${competitorTypeLabel(profile.type)}`);
  lines.push(`**SERP significance:** ${profile.significance}`);
  lines.push(`**Pages analyzed:** ${profile.pagesAnalyzed.length}`);
  lines.push("");
  lines.push(
    "> Externally observable assessment of representative pages only. Not a full-site crawl. No traffic/DA/revenue claims.",
  );
  lines.push("");

  lines.push("## Main strengths");
  lines.push("");
  for (const s of profile.mainStrengths) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## Main weaknesses");
  lines.push("");
  for (const s of profile.mainWeaknesses) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## Why it ranks / likely contributing factors");
  lines.push("");
  lines.push(
    "_Observable / structural hypotheses only — not confirmed ranking causes._",
  );
  lines.push("");
  for (const s of profile.whyRanksLikely) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## Topics where strong");
  lines.push("");
  for (const s of profile.topicsStrong) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## Topics where weak / not observed");
  lines.push("");
  for (const s of profile.topicsWeak) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## What SoftwareGlimpse can learn");
  lines.push("");
  for (const s of profile.learnFrom) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## What SoftwareGlimpse should NOT copy");
  lines.push("");
  for (const s of profile.doNotCopy) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## Sampled pages");
  lines.push("");
  for (const p of profile.pagesAnalyzed) {
    const o = p.observation;
    lines.push(`### ${o.title}`);
    lines.push("");
    lines.push(`- **URL:** \`${o.url}\``);
    lines.push(`- **Page type:** ${o.pageType}`);
    lines.push(`- **Observation source:** ${o.source}`);
    lines.push(`- **Overall (observable avg):** ${p.overall ?? "—"}`);
    if (o.query) lines.push(`- **Related query:** \`${o.query}\``);
    lines.push("");
    lines.push("| Dimension | Score | Band | Confidence | Reason |");
    lines.push("| --- | ---: | --- | --- | --- |");
    for (const d of p.dimensions) {
      lines.push(
        `| ${d.id} | ${scoreCell(d.score)} | ${d.band} | ${d.confidence} | ${d.reason.replace(/\|/g, "/")} |`,
      );
    }
    lines.push("");
  }

  if (profile.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of profile.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push("[← Competitive benchmark](./COMPETITIVE-BENCHMARK-LATEST.md)");
  lines.push("");
  return lines.join("\n");
}

export function toCompetitorPackDimensions(
  report: CompetitiveBenchmarkReport,
): Array<{ id: string; score: number; reason: string }> {
  // Aggregate relative strengths for Site Intelligence competitive pack
  const ids = [
    "intent-coverage",
    "depth",
    "evidence",
    "tools-resources",
    "freshness-trust",
    "differentiation",
  ] as const;
  const sgRows = report.benchmarks.flatMap((b) =>
    b.rows.filter((r) => r.domain === "softwareglimpse.com"),
  );
  const compRows = report.benchmarks.flatMap((b) =>
    b.rows.filter((r) => r.domain !== "softwareglimpse.com"),
  );

  const avg = (
    rows: typeof sgRows,
    key: string,
  ): number | null => {
    const vals = rows
      .map((r) => r.dimensions[key])
      .filter((n): n is number => typeof n === "number");
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const relative = (sgKey: string, compKey: string): number => {
    const sg = avg(sgRows, sgKey);
    const comp = avg(compRows, compKey);
    if (sg == null || comp == null) return 50;
    // 50 = parity; higher = SG stronger
    return Math.max(0, Math.min(100, Math.round(50 + (sg - comp) / 2)));
  };

  return [
    {
      id: ids[0],
      score: relative("search-intent-alignment", "search-intent-alignment"),
      reason: "Relative intent alignment vs sampled SERP competitors",
    },
    {
      id: ids[1],
      score: relative("content-depth", "content-depth"),
      reason: "Relative content depth proxy vs sampled pages",
    },
    {
      id: ids[2],
      score: relative("evidence", "evidence"),
      reason: "Relative evidence/methodology observability",
    },
    {
      id: ids[3],
      score: relative("tools", "tools"),
      reason: "Relative tools/resources signals",
    },
    {
      id: ids[4],
      score: relative("freshness", "freshness"),
      reason: "Relative freshness/author trust proxies",
    },
    {
      id: ids[5],
      score: relative("original-value", "original-value"),
      reason: "Relative differentiation/original-value proxies",
    },
  ];
}
