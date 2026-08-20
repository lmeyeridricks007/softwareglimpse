#!/usr/bin/env npx tsx
/**
 * Local SEO audit-agent CLI (ANALYZE → REPORT → RECOMMEND).
 *
 * Never mutates production SEO/content.
 *
 * Usage:
 *   npm run seo:audit
 *   npm run seo:audit -- --mode=full
 *   BASE_URL=http://127.0.0.1:3000 npm run seo:audit -- --mode=full
 *   npm run seo:audit -- --mode=full --base-url=http://127.0.0.1:3000
 *   npm run seo:technical
 *   npm run seo:links
 *   npm run seo:content
 *   npm run seo:performance
 *   npm run seo:schema
 *   npm run seo:media
 *   npm run seo:outbound
 */
import {
  getAgentByKey,
  runSEOHealthOrchestrator,
  runSeoAgent,
  type SeoAuditMode,
} from "@/services/seo-audit-agents";

function parseArgs(argv: string[]) {
  const modeArg = argv.find((a) => a.startsWith("--mode="));
  const modeRaw = (modeArg?.split("=")[1] ?? "fast").toUpperCase();
  const mode: SeoAuditMode = modeRaw === "FULL" ? "FULL" : "FAST";
  const write = !argv.includes("--no-write");
  const json = argv.includes("--json");
  const baseUrl =
    argv.find((a) => a.startsWith("--base-url="))?.split("=")[1] ||
    process.env.BASE_URL ||
    undefined;
  const agent =
    argv.find((a) => a.startsWith("--agent="))?.split("=")[1] ??
    argv.find((a) => !a.startsWith("-") && a !== "seo-audit");
  return { mode, write, json, agent, baseUrl };
}

function usage(): never {
  console.error(`SoftwareGlimpse SEO audit agents

Commands (via npm scripts):
  seo:audit [-- --mode=fast|full] [-- --base-url=URL] [-- --json] [-- --no-write]
  seo:technical | seo:links | seo:content | seo:performance
  seo:schema | seo:media | seo:outbound

Set BASE_URL (or --base-url) to a running origin to enable live HTML/HTTP checks
that are otherwise skipped (robots meta, status codes, JSON-LD, images, redirects).

Agents only write Markdown recommendations under docs/seo/reports/.
They never change canonicals, robots, content, scores, or affiliate links.
`);
  process.exit(1);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) usage();

  // npm run seo:technical → script passes "technical" as first arg via package.json
  const { mode, write, json, agent, baseUrl } = parseArgs(argv);

  if (!agent || agent === "audit" || agent === "all") {
    if (baseUrl) {
      console.log(`Live probes enabled against ${baseUrl}`);
    } else if (mode === "FULL") {
      console.warn(
        "FULL mode without BASE_URL / --base-url — live HTML/HTTP checks will still skip.",
      );
    }
    const result = await runSEOHealthOrchestrator({
      mode,
      writeReports: write,
      baseUrl,
    });
    if (json) {
      console.log(
        JSON.stringify(
          {
            mode: result.mode,
            findings: result.findings.length,
            diff: result.diff.summary,
            checksCompleted: result.checksCompleted,
            checksSkipped: result.checksSkipped,
            checksFailed: result.checksFailed,
            masterReportPath: result.masterReportPath,
            failedChecks: result.failedChecks,
            skippedChecks: result.skippedChecks,
          },
          null,
          2,
        ),
      );
    } else {
      console.log(
        `SEOHealthOrchestrator (${result.mode}): ${result.findings.length} findings | NEW ${result.diff.summary.NEW} RESOLVED ${result.diff.summary.RESOLVED} REGRESSED ${result.diff.summary.REGRESSED}`,
      );
      console.log(
        `Checks: completed=${result.checksCompleted} skipped=${result.checksSkipped} failed=${result.checksFailed}`,
      );
      if (result.skippedChecks.length) {
        console.log(
          `Still skipped: ${result.skippedChecks.map((c) => c.checkId).join(", ")}`,
        );
      }
      if (result.masterReportPath) {
        console.log(`Master report: ${result.masterReportPath}`);
      }
      if (result.checksFailed > 0) {
        console.error("One or more checks failed — do not claim clean SEO.");
        process.exitCode = 2;
      }
    }
    return;
  }

  const runner = getAgentByKey(agent);
  if (!runner) {
    console.error(`Unknown agent '${agent}'`);
    usage();
  }

  const result = await runSeoAgent(runner, {
    mode,
    now: new Date(),
    writeReports: write,
    baseUrl,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.meta.name,
          findings: result.findings.length,
          checks: result.checks,
          reportPath: result.reportPath,
          error: result.error,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      `${result.meta.name} (${result.mode}): ${result.findings.length} finding(s)`,
    );
    if (result.reportPath) console.log(`Report: ${result.reportPath}`);
    if (result.error) {
      console.error(result.error);
      process.exitCode = 2;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
