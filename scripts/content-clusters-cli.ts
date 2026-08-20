#!/usr/bin/env npx tsx
/**
 * Supporting content clusters CLI.
 *
 * Examples:
 *   npm run content:clusters -- crm
 *   npm run content:clusters -- crm --json
 *   npm run content:gaps -- --category crm
 *   npm run content:support -- content:best:crm-software
 *   npm run content:support -- product:pipedrive
 *   npm run content:plan -- --category crm --type supporting
 *   npm run content:clusters:validate
 */

import {
  buildContentCluster,
  buildSupportingTopicCandidates,
  planSupportingWorkflows,
  reportAnchorSupport,
  reportProductSupport,
  validateContentClusters,
} from "@/services/content-clusters";
import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--json") flags.json = true;
    else if (arg.startsWith("--") && arg.includes("=")) {
      const [k, ...rest] = arg.slice(2).split("=");
      flags[k!] = rest.join("=");
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = true;
      }
    } else {
      positionals.push(arg);
    }
  }
  return { flags, positionals };
}

function printJson(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function formatCluster(categorySlug: string): string {
  const cluster = buildContentCluster(categorySlug);
  if (!cluster) {
    return `No knowledge map for category: ${categorySlug}`;
  }

  const lines: string[] = [
    categorySlug.toUpperCase(),
    "",
    "ANCHORS",
    "",
  ];
  for (const a of cluster.anchors) {
    lines.push(
      `${a.published ? "✓" : "·"} ${a.title} (${a.path}) [${a.type}]`,
    );
  }

  lines.push("", "COVERAGE", "");
  for (const c of cluster.coverage) {
    lines.push(
      `${c.label.padEnd(16)} ${c.existingCoreCount}/${c.targetCoreCount} core` +
        (c.missingCoreTopicIds.length
          ? `  missing: ${c.missingCoreTopicIds.join(", ")}`
          : ""),
    );
  }

  const byClass = {
    CORE: cluster.candidates.filter((c) => c.priorityClass === "CORE"),
    SECONDARY: cluster.candidates.filter((c) => c.priorityClass === "SECONDARY"),
    OPTIONAL: cluster.candidates.filter((c) => c.priorityClass === "OPTIONAL"),
    NOT_RECOMMENDED: cluster.candidates.filter(
      (c) => c.priorityClass === "NOT_RECOMMENDED",
    ),
  };

  lines.push("", "SUPPORTING CONTENT", "");
  for (const [klass, items] of Object.entries(byClass)) {
    if (!items.length) continue;
    lines.push(klass);
    for (const item of items) {
      const mark =
        item.readiness === "exists"
          ? "✓"
          : item.readiness === "not-recommended" || item.readiness === "duplicate"
            ? "✗"
            : "-";
      lines.push(
        `${mark} ${item.titleConcept}  [${item.placement}/${item.readiness}]`,
      );
    }
    lines.push("");
  }

  lines.push(
    `Existing guides: ${cluster.existingGuideSlugs.join(", ") || "(none)"}`,
  );
  return lines.join("\n");
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0] ?? "help";
  const { flags, positionals } = parseArgs(argv.slice(1));

  switch (command) {
    case "clusters":
    case "map": {
      const category =
        (flags.category as string) || positionals[0] || "crm";
      const cluster = buildContentCluster(category);
      if (!cluster) {
        console.error(`No knowledge map for: ${category}`);
        process.exit(1);
      }
      if (flags.json) printJson(cluster);
      else console.log(formatCluster(category));
      break;
    }

    case "gaps": {
      const category = (flags.category as string) || positionals[0];
      const slugs = category
        ? [category]
        : listCategoryKnowledgeMaps().map((m) => m.categorySlug);
      const byCategory = slugs.map((slug) => ({
        category: slug,
        gaps: buildSupportingTopicCandidates(slug).filter(
          (c) =>
            c.readiness !== "exists" &&
            (c.priorityClass === "CORE" || c.evidence.knowledgeGap) &&
            c.placement === "NEW_PAGE",
        ),
      }));
      if (flags.json) {
        printJson(
          category
            ? { category: byCategory[0]!.category, gaps: byCategory[0]!.gaps }
            : { categories: byCategory },
        );
      } else {
        for (const row of byCategory) {
          console.log(`SUPPORTING GAPS — ${row.category.toUpperCase()}\n`);
          for (const g of row.gaps) {
            console.log(
              `${g.priorityClass.padEnd(10)} ${g.titleConcept}  (priority=${g.priority}, score=${g.scores.total})`,
            );
          }
          if (!row.gaps.length) console.log("(no prioritized NEW_PAGE gaps)");
          console.log("");
        }
      }
      break;
    }

    case "support": {
      const target = (flags.target as string) || positionals[0];
      if (!target) {
        console.error(
          "Usage: content:support -- <contentId|product:slug> [--json]",
        );
        process.exit(1);
      }
      if (target.startsWith("product:")) {
        const report = reportProductSupport(target.slice("product:".length));
        if (flags.json) printJson(report);
        else {
          console.log(`PRODUCT SUPPORT — ${report.productSlug}\n`);
          console.log("CATEGORY GUIDES");
          for (const g of report.categoryGuides) {
            console.log(`  ${g.status.padEnd(12)} ${g.title} (/guides/${g.slug}/)`);
          }
          console.log("\nPRODUCT GUIDES");
          for (const g of report.productGuides) {
            console.log(`  ${g.status.padEnd(12)} ${g.title}`);
          }
          if (!report.productGuides.length) console.log("  (none)");
          console.log("\nCANDIDATES");
          for (const c of report.candidates) {
            console.log(
              `  ${c.priorityClass} ${c.titleConcept} [${c.placement}/${c.readiness}]`,
            );
          }
          console.log("\nREJECTED / NOT RECOMMENDED");
          for (const c of report.rejected) {
            console.log(`  ✗ ${c.titleConcept} — ${c.placementReason}`);
          }
        }
      } else {
        const contentId = target.includes(":")
          ? target
          : `content:${target}`;
        const report = reportAnchorSupport(contentId);
        if (flags.json) printJson(report);
        else {
          console.log(`ANCHOR SUPPORT — ${report.contentId}\n`);
          console.log("SUPPORTED BY");
          for (const g of report.supportedBy) {
            console.log(`  ${g.status.padEnd(12)} ${g.title} (/guides/${g.slug}/)`);
          }
          if (!report.supportedBy.length) console.log("  (none yet)");
          console.log("\nGAPS (CORE)");
          for (const g of report.gaps) {
            console.log(`  - ${g.titleConcept} [${g.placement}]`);
          }
          if (!report.gaps.length) console.log("  (no CORE gaps for this anchor)");
        }
      }
      break;
    }

    case "plan": {
      const category =
        (flags.category as string) || positionals[0] || "crm";
      const type = (flags.type as string) || "supporting";
      if (type !== "supporting") {
        console.error(`Unsupported plan type: ${type} (use supporting)`);
        process.exit(1);
      }
      const workflows = planSupportingWorkflows(category);
      if (flags.json) {
        printJson({
          category,
          type,
          note: "Plan only — do not auto-execute",
          workflows,
        });
      } else {
        console.log(`CONTENT PLAN — ${category} supporting (not executed)\n`);
        for (const w of workflows) {
          console.log(
            `  ${w.agentId} → ${w.targetSlug} (${w.titleConcept}) [${w.priorityClass}]`,
          );
        }
        if (!workflows.length) {
          console.log("  (no ready CORE NEW_PAGE candidates)");
        }
        console.log(
          "\nExecute individually via: npm run workflow:plan -- guide <slug>",
        );
      }
      break;
    }

    case "list": {
      const maps = listCategoryKnowledgeMaps();
      if (flags.json) printJson(maps.map((m) => m.categorySlug));
      else {
        console.log("Knowledge maps:");
        for (const m of maps) console.log(`  ${m.categorySlug} (${m.topics.length} topics)`);
      }
      break;
    }

    case "validate": {
      const result = validateContentClusters();
      if (flags.json) printJson(result);
      else {
        for (const e of result.errors) console.error(`ERROR ${e}`);
        for (const w of result.warnings) console.warn(`WARN  ${w}`);
        console.log(result.ok ? "OK content-clusters validate" : "FAILED");
      }
      process.exit(result.ok ? 0 : 1);
      break;
    }

    case "help":
    default: {
      console.log(`Supporting content clusters

  clusters <category> [--json]
  gaps [--category <slug>] [--json]
  support <contentId|product:slug> [--json]
  plan --category <slug> --type supporting [--json]
  list [--json]
  validate [--json]
`);
      if (command !== "help") process.exit(1);
    }
  }
}

main();
