import type { AssetEnrichmentBacklogReport } from "@/domain/schemas/asset-discovery";
import type { GuideAssetMasterReport } from "@/domain/schemas/asset-discovery";
import type { SoftwareAssetMasterReport } from "@/domain/schemas/asset-discovery";
import type { ProductMediaHealthReport } from "@/services/product-media/media-health-report";
import type {
  AssetOpportunityChange,
  AssetChangeKind,
} from "./diff";
import type { AssetIntegrityFinding } from "./integrity";
import type { ResearchMediaInventory } from "./inventory";

export type AssetIntelligenceReportInput = {
  generatedAt: string;
  mode: "LIGHT" | "FULL" | "DEEP";
  scope: string;
  previousGeneratedAt?: string;
  softwareInventoryCount: number;
  guideInventoryCount: number;
  mediaInventory: ResearchMediaInventory;
  mediaHealth?: ProductMediaHealthReport;
  softwareMaster?: SoftwareAssetMasterReport;
  guideMaster?: GuideAssetMasterReport;
  backlog?: AssetEnrichmentBacklogReport;
  changes: AssetOpportunityChange[];
  changeSummary: Record<AssetChangeKind, number>;
  integrity: AssetIntegrityFinding[];
  newOfficialAssets: Array<{ title: string; sourceUrl: string; product?: string }>;
  reusedAssets: Array<{ title: string; page: string }>;
  brokenStale: Array<{ title: string; detail: string; product?: string }>;
  weakSoftware: Array<{ name: string; rating: string; route: string }>;
  weakGuides: Array<{ title: string; rating: string; route: string }>;
  bestVideos: Array<{ title: string; page: string; priority: string }>;
  bestScreenshots: Array<{ title: string; page: string; priority: string }>;
  bestDiagrams: Array<{ title: string; page: string; priority: string }>;
  originalVisuals: Array<{ title: string; page: string; priority: string }>;
  usageReview: Array<{ title: string; page: string; note: string }>;
  systemic: Array<{ id: string; title: string; priority: string; count: number }>;
  topActions: Array<{
    id: string;
    priority: string;
    page: string;
    asset: string;
    recommendation: string;
    relatedCq?: string;
  }>;
  searchMemorySize: number;
  agentsRun: string[];
};

function esc(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ").slice(0, 180);
}

function bulletList(
  items: Array<{ title: string; [k: string]: string }>,
  line: (i: (typeof items)[number]) => string,
  empty = "_None._",
): string[] {
  if (items.length === 0) return [empty, ""];
  return [...items.map((i) => `- ${line(i)}`), ""];
}

export function formatAssetIntelligenceMarkdown(
  input: AssetIntelligenceReportInput,
): string {
  const lines: string[] = [];
  const s = input.changeSummary;
  const backlog = input.backlog?.summary;

  lines.push("# SoftwareGlimpse Content Asset Intelligence");
  lines.push("");
  lines.push(
    `> Orchestrator: **ContentAssetIntelligenceOrchestrator** · Mode: **${input.mode}** · Scope: ${input.scope}`,
  );
  lines.push("");
  lines.push(`- **Generated:** ${input.generatedAt}`);
  if (input.previousGeneratedAt) {
    lines.push(`- **Previous run:** ${input.previousGeneratedAt}`);
  }
  lines.push(
    `- **Agents run:** ${input.agentsRun.join(", ") || "—"}`,
  );
  lines.push(
    `- **Inventory:** ${input.softwareInventoryCount} software · ${input.guideInventoryCount} guides · ${input.mediaInventory.mediaCount} ResearchMedia`,
  );
  lines.push(
    `- **Search memory:** ${input.searchMemorySize} known asset keys (avoid repeated rediscovery)`,
  );
  lines.push("");
  lines.push(
    "Recommendations only — does **not** auto-edit content or auto-import assets.",
  );
  lines.push("");

  lines.push("## Executive Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push(`| Software pages inventoried | ${input.softwareInventoryCount} |`);
  lines.push(`| Guides inventoried | ${input.guideInventoryCount} |`);
  lines.push(`| ResearchMedia catalogued | ${input.mediaInventory.mediaCount} |`);
  lines.push(
    `| Active official videos | ${input.mediaInventory.activeOfficialCount} |`,
  );
  lines.push(`| Pipeline (not active) | ${input.mediaInventory.pipelineCount} |`);
  lines.push(`| Unavailable media | ${input.mediaInventory.unavailableCount} |`);
  if (backlog) {
    lines.push(`| Backlog A0 | ${backlog.a0} |`);
    lines.push(`| Backlog A1 | ${backlog.a1} |`);
    lines.push(`| Template opportunities | ${backlog.templateOpportunities} |`);
    lines.push(
      `| Original visual opportunities | ${backlog.originalVisualOpportunities} |`,
    );
  }
  lines.push(
    `| Change: NEW / STILL OPEN / IMPLEMENTED | ${s.NEW} / ${s["STILL OPEN"]} / ${s.IMPLEMENTED} |`,
  );
  lines.push(
    `| Change: STALE / NO LONGER AVAILABLE / DISMISSED | ${s.STALE} / ${s["NO LONGER AVAILABLE"]} / ${s.DISMISSED} |`,
  );
  lines.push(
    `| Integrity critical | ${input.integrity.filter((i) => i.severity === "critical").length} |`,
  );
  lines.push("");

  lines.push("## New official assets discovered");
  lines.push("");
  lines.push(
    ...bulletList(input.newOfficialAssets, (i) =>
      `${esc(i.title)}${i.product ? ` (${i.product})` : ""} — ${esc(i.sourceUrl)}`,
    ),
  );

  lines.push("## Existing assets reused");
  lines.push("");
  lines.push(
    ...bulletList(input.reusedAssets, (i) => `${esc(i.title)} → ${esc(i.page)}`),
  );

  lines.push("## Broken/stale assets");
  lines.push("");
  lines.push(
    ...bulletList(
      input.brokenStale.map((b) => ({
        title: b.title,
        detail: b.detail,
        product: b.product ?? "",
      })),
      (i) =>
        `${esc(i.title)}${i.product ? ` (${i.product})` : ""} — ${esc(i.detail)}`,
    ),
  );

  lines.push("## Product pages with weak visual coverage");
  lines.push("");
  if (input.weakSoftware.length === 0) {
    lines.push("_None flagged (or LIGHT mode without full software audit)._");
    lines.push("");
  } else {
    lines.push("| Product | Coverage | Route |");
    lines.push("| --- | --- | --- |");
    for (const w of input.weakSoftware) {
      lines.push(`| ${esc(w.name)} | ${w.rating} | \`${w.route}\` |`);
    }
    lines.push("");
  }

  lines.push("## Guides with weak visual coverage");
  lines.push("");
  if (input.weakGuides.length === 0) {
    lines.push("_None flagged (or LIGHT mode without full guide audit)._");
    lines.push("");
  } else {
    lines.push("| Guide | Visual quality | Route |");
    lines.push("| --- | --- | --- |");
    for (const w of input.weakGuides.slice(0, 40)) {
      lines.push(`| ${esc(w.title)} | ${w.rating} | \`${w.route}\` |`);
    }
    if (input.weakGuides.length > 40) {
      lines.push("");
      lines.push(`_…and ${input.weakGuides.length - 40} more._`);
    }
    lines.push("");
  }

  lines.push("## Best video opportunities");
  lines.push("");
  lines.push(
    ...bulletList(
      input.bestVideos,
      (i) => `[${i.priority}] ${esc(i.page)} — ${esc(i.title)}`,
    ),
  );

  lines.push("## Best screenshot opportunities");
  lines.push("");
  lines.push(
    ...bulletList(
      input.bestScreenshots,
      (i) => `[${i.priority}] ${esc(i.page)} — ${esc(i.title)}`,
    ),
  );

  lines.push("## Best diagram opportunities");
  lines.push("");
  lines.push(
    ...bulletList(
      input.bestDiagrams,
      (i) => `[${i.priority}] ${esc(i.page)} — ${esc(i.title)}`,
    ),
  );

  lines.push("## Original visual opportunities");
  lines.push("");
  lines.push(
    ...bulletList(
      input.originalVisuals,
      (i) => `[${i.priority}] ${esc(i.page)} — ${esc(i.title)}`,
    ),
  );

  lines.push("## Assets requiring usage review");
  lines.push("");
  lines.push(
    ...bulletList(
      input.usageReview,
      (i) => `${esc(i.title)} (${esc(i.page)}) — ${esc(i.note)}`,
    ),
  );

  lines.push("## Systemic/template improvements");
  lines.push("");
  if (input.systemic.length === 0) {
    lines.push("_None._");
    lines.push("");
  } else {
    for (const sys of input.systemic) {
      lines.push(
        `- **${sys.id}** [${sys.priority}] ${esc(sys.title)} (×${sys.count})`,
      );
    }
    lines.push("");
  }

  lines.push("## Change tracking");
  lines.push("");
  lines.push("| Kind | Count |");
  lines.push("| --- | ---: |");
  for (const k of [
    "NEW",
    "STILL OPEN",
    "IMPLEMENTED",
    "NO LONGER AVAILABLE",
    "STALE",
    "DISMISSED",
  ] as AssetChangeKind[]) {
    lines.push(`| ${k} | ${s[k]} |`);
  }
  lines.push("");
  const notable = input.changes.filter((c) => c.kind !== "STILL OPEN").slice(0, 40);
  if (notable.length) {
    lines.push("| ID | Kind | Page | Asset |");
    lines.push("| --- | --- | --- | --- |");
    for (const c of notable) {
      lines.push(
        `| \`${c.id}\` | ${c.kind} | ${esc(c.page ?? c.pageRoute)} | ${esc(c.asset ?? "—")} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Integrity (deterministic)");
  lines.push("");
  lines.push(
    "Hard-fail candidates only under `--strict-integrity`. Missing screenshots never fail CI.",
  );
  lines.push("");
  if (input.integrity.length === 0) {
    lines.push("_No integrity findings._");
    lines.push("");
  } else {
    for (const f of input.integrity) {
      lines.push(
        `- **${f.severity}** \`${f.id}\` (${f.productSlug}${f.mediaId ? ` / ${f.mediaId}` : ""}) — ${esc(f.issue)}`,
      );
    }
    lines.push("");
  }

  if (input.mediaHealth) {
    lines.push("## Media health (light)");
    lines.push("");
    lines.push(
      `| Active videos | ${input.mediaHealth.totals.activeVideos} |`,
    );
    lines.push(`| Needs review | ${input.mediaHealth.totals.needsReview} |`);
    lines.push(`| Unavailable | ${input.mediaHealth.totals.unavailable} |`);
    lines.push(
      `| Missing major coverage | ${input.mediaHealth.totals.missingMajorMediaCoverage} |`,
    );
    lines.push("");
  }

  lines.push("## Top 30 recommended actions");
  lines.push("");
  lines.push(
    "| # | ID | Priority | Page | Asset | Recommendation | Related CQ |",
  );
  lines.push("| ---: | --- | --- | --- | --- | --- | --- |");
  input.topActions.slice(0, 30).forEach((a, i) => {
    lines.push(
      `| ${i + 1} | \`${a.id}\` | ${a.priority} | ${esc(a.page)} | ${esc(a.asset)} | ${esc(a.recommendation)} | ${esc(a.relatedCq ?? "—")} |`,
    );
  });
  lines.push("");

  lines.push("## Child reports");
  lines.push("");
  lines.push("- [`SOFTWARE-ASSET-OPPORTUNITIES.md`](./SOFTWARE-ASSET-OPPORTUNITIES.md)");
  lines.push("- [`GUIDE-ASSET-OPPORTUNITIES.md`](./GUIDE-ASSET-OPPORTUNITIES.md)");
  lines.push("- [`ASSET-ENRICHMENT-BACKLOG.md`](./ASSET-ENRICHMENT-BACKLOG.md)");
  lines.push("- [`02-approved-asset-workflow.md`](./02-approved-asset-workflow.md) — approve → import");
  lines.push("");

  lines.push("## Next steps");
  lines.push("");
  lines.push("1. Review Top 30 + systemic TEMPLATE FIX items.");
  lines.push("2. Approve selected assets via `npm run assets:approve` (discovery ≠ approval).");
  lines.push("3. Re-run `npm run assets:intelligence` to verify IMPLEMENTED / STILL OPEN.");
  lines.push("4. Weekly LIGHT media-health; monthly FULL discovery; quarterly DEEP flagships.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}
