#!/usr/bin/env npx tsx
/**
 * Content Quality Audit CLI
 *
 *   npm run content:audit
 *   npm run content:audit:crm
 *   npm run content:audit:reviews
 *   npm run content:audit:guides
 *   npm run content:audit -- --scope comparisons --json
 *
 * Evaluation only — never rewrites or publishes content.
 */
import { runContentQualityAudit } from "@/services/content-quality/audit-engine";
import type { AuditScopeFilter } from "@/services/content-quality/loaders/inventory";

type Args = {
  scope: AuditScopeFilter;
  json: boolean;
  noWrite: boolean;
  limit?: number;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    scope: "crm",
    json: false,
    noWrite: false,
  };
  const rest = [...argv];
  // npm run content:audit:reviews → script may pass "reviews" as first arg
  if (rest[0] && !rest[0].startsWith("-")) {
    args.scope = rest.shift() as AuditScopeFilter;
  }
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--scope") args.scope = rest.shift() as AuditScopeFilter;
    else if (t === "--json") args.json = true;
    else if (t === "--no-write") args.noWrite = true;
    else if (t === "--limit") args.limit = Number(rest.shift());
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const result = runContentQualityAudit({
    scope: args.scope,
    writeReports: !args.noWrite,
    writeMaster: !args.noWrite,
    limit: args.limit,
  });

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          evaluatedAt: result.evaluatedAt,
          scope: result.scope,
          summary: result.summary,
          masterPath: result.masterPath,
          sample: result.results.slice(0, 5).map((r) => ({
            route: r.assessment.route,
            score: r.assessment.overallScore,
            priority: r.improvementPriority,
            report: r.reportRelPath,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  const s = result.summary;
  console.log(`CONTENT QUALITY AUDIT — scope=${result.scope}`);
  console.log(`Pages evaluated: ${s.pagesEvaluated}`);
  console.log(`Average score:   ${s.averageScore}/100`);
  console.log(
    `Priorities:      P0=${s.byPriority["CQ-P0"]} P1=${s.byPriority["CQ-P1"]} P2=${s.byPriority["CQ-P2"]} P3=${s.byPriority["CQ-P3"]}`,
  );
  console.log("");
  console.log("Avg by page type:");
  for (const [type, avg] of Object.entries(s.byPageTypeAvg).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    console.log(`  ${type.padEnd(22)} ${avg}`);
  }
  console.log("");
  console.log("Top 10 strongest:");
  s.strongest.forEach((r, i) =>
    console.log(`  ${i + 1}. ${r.score}  ${r.route}`),
  );
  console.log("");
  console.log("Top 20 weakest:");
  s.weakest.forEach((r, i) =>
    console.log(`  ${i + 1}. ${r.score}  ${r.route}`),
  );
  console.log("");
  console.log("Most common critical gaps:");
  s.commonGaps.slice(0, 8).forEach((g) =>
    console.log(`  (${g.count}) ${g.gap}`),
  );
  console.log("");
  console.log("Most common evidence problems:");
  s.commonEvidenceProblems.slice(0, 8).forEach((g) =>
    console.log(`  (${g.count}) ${g.gap}`),
  );
  console.log("");
  console.log("Most common linking problems:");
  s.commonLinkingProblems.slice(0, 8).forEach((g) =>
    console.log(`  (${g.count}) ${g.gap}`),
  );
  if (result.masterPath) {
    console.log("");
    console.log(`Master inventory: ${result.masterPath}`);
    console.log(`Per-page reports: docs/content-quality/pages/`);
  }
}

main();
