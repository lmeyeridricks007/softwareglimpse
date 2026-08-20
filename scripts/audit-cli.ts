#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse site-wide editorial QA / audit CLI
 *
 *   npm run audit:site
 *   npm run audit:category -- crm
 *   npm run audit:product -- getresponse
 *   npm run audit:content -- content:software:pipedrive
 *   npm run audit:issues -- --severity critical
 *   npm run audit:plan
 *   npm run audit:validate
 *   npm run audit:media-health [-- <productSlug>] [--json]
 */
import {
  auditSite,
  auditCategory,
  auditProduct,
  auditContent,
  formatAuditText,
  formatAuditMarkdown,
  validateSiteAudit,
  buildRemediationPlan,
} from "@/services/site-audit/server";
import {
  loadIssueLedger,
  listAuditSnapshots,
  writeMarkdownReport,
} from "@/data/audit/store";
import {
  buildProductMediaHealthReport,
  formatProductMediaHealthReportText,
} from "@/services/product-media/media-health-report";
import type { AuditSeverity } from "@/domain";

type Args = {
  command: string;
  positional: string[];
  json: boolean;
  markdown: boolean;
  severity?: AuditSeverity;
  type?: string;
  category?: string;
  persist: boolean;
  baseline: boolean;
  report: boolean;
  forceFresh: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    command: "site",
    positional: [],
    json: false,
    markdown: false,
    persist: true,
    baseline: false,
    report: false,
    forceFresh: false,
  };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) args.command = rest.shift()!;
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--json") args.json = true;
    else if (t === "--markdown") args.markdown = true;
    else if (t === "--no-persist") args.persist = false;
    else if (t === "--baseline") args.baseline = true;
    else if (t === "--report") args.report = true;
    else if (t === "--force-fresh") args.forceFresh = true;
    else if (t === "--severity") args.severity = rest.shift() as AuditSeverity;
    else if (t === "--type") args.type = rest.shift();
    else if (t === "--category") args.category = rest.shift();
    else if (!t.startsWith("-")) args.positional.push(t);
  }
  return args;
}

function print(data: unknown, asJson: boolean): void {
  if (asJson) console.log(JSON.stringify(data, null, 2));
  else if (typeof data === "string") console.log(data);
  else console.log(JSON.stringify(data, null, 2));
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const opts = {
    persist: args.persist,
    baseline: args.baseline,
    writeReport: args.report,
    forceFresh: args.forceFresh,
  };

  switch (args.command) {
    case "site": {
      const result = await auditSite(opts);
      if (args.markdown) {
        const md = formatAuditMarkdown(result);
        if (args.report) {
          writeMarkdownReport(`${result.auditedAt.slice(0, 10)}-site.md`, md);
        }
        print(md, false);
      } else if (args.json) print(result, true);
      else print(formatAuditText(result), false);
      if (result.status === "fail") process.exitCode = 1;
      break;
    }
    case "category": {
      const id = args.positional[0] ?? args.category;
      if (!id) throw new Error("Usage: audit category <slug>");
      const result = await auditCategory(id, opts);
      if (args.json) print(result, true);
      else if (args.markdown) print(formatAuditMarkdown(result), false);
      else print(formatAuditText(result), false);
      if (result.status === "fail") process.exitCode = 1;
      break;
    }
    case "product": {
      const id = args.positional[0];
      if (!id) throw new Error("Usage: audit product <slug>");
      const result = await auditProduct(id, opts);
      if (args.json) print(result, true);
      else if (args.markdown) print(formatAuditMarkdown(result), false);
      else print(formatAuditText(result), false);
      if (result.status === "fail") process.exitCode = 1;
      break;
    }
    case "content": {
      const id = args.positional[0];
      if (!id) throw new Error("Usage: audit content <contentId>");
      const result = await auditContent(id, opts);
      if (args.json) print(result, true);
      else print(formatAuditText(result), false);
      if (result.status === "fail") process.exitCode = 1;
      break;
    }
    case "issues": {
      let issues = loadIssueLedger().filter(
        (i) => i.state !== "resolved" && i.state !== "dismissed",
      );
      if (args.severity) {
        issues = issues.filter((i) => i.severity === args.severity);
      }
      if (args.type) {
        issues = issues.filter((i) => i.type === args.type);
      }
      if (args.category) {
        issues = issues.filter((i) => i.categorySlug === args.category);
      }
      print(
        args.json
          ? issues
          : issues
              .map((i) => `[${i.severity}] ${i.type}: ${i.message}`)
              .join("\n") || "No open issues.",
        args.json,
      );
      break;
    }
    case "plan":
    case "remediate": {
      const ledger = loadIssueLedger().filter(
        (i) => i.state !== "resolved" && i.state !== "dismissed",
      );
      const plan = buildRemediationPlan(ledger);
      print(
        args.json
          ? plan
          : plan
              .slice(0, 25)
              .map(
                (r) =>
                  `${r.rank}. [${r.remediationClass}] ${r.action}\n   ${r.title}`,
              )
              .join("\n\n") || "No remediations.",
        args.json,
      );
      break;
    }
    case "history": {
      print(listAuditSnapshots(), args.json);
      break;
    }
    case "validate": {
      const result = validateSiteAudit();
      print(result, args.json);
      if (!result.ok) process.exitCode = 1;
      break;
    }
    case "media-health": {
      const productSlug = args.positional[0];
      const report = buildProductMediaHealthReport({ productSlug });
      if (args.json) print(report, true);
      else print(formatProductMediaHealthReportText(report), false);
      break;
    }
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
