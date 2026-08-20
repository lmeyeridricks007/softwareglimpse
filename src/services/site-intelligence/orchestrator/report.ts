import type { WebsiteIntelligenceModel } from "./types";

function bullets(items: string[], empty = "_None flagged._"): string[] {
  if (!items.length) return [empty, ""];
  return [...items.map((i) => `- ${i}`), ""];
}

export function formatWebsiteIntelligenceMarkdown(
  model: WebsiteIntelligenceModel,
): string {
  const lines: string[] = [];
  lines.push("# SoftwareGlimpse Website Intelligence");
  lines.push("");
  lines.push(
    `**Orchestrator:** WebsiteIntelligenceOrchestrator v${model.agentVersion}`,
  );
  lines.push(`**Generated:** ${model.generatedAt}`);
  lines.push(`**Mode:** ${model.mode}`);
  lines.push(`**Cluster:** ${model.cluster}`);
  lines.push("");
  lines.push(
    "> Authoritative local assessment. **Does not** autonomously modify the site. Scores ≠ ranking predictions.",
  );
  lines.push("");

  lines.push("## Executive verdict");
  lines.push("");
  lines.push(`**How good is the website today?** ${model.executiveVerdict.howGood}`);
  lines.push("");
  lines.push(
    `**How competitive is it?** ${model.executiveVerdict.howCompetitive}`,
  );
  lines.push("");
  lines.push(
    `**What is the ranking outlook?** ${model.executiveVerdict.rankingOutlook}`,
  );
  lines.push("");
  lines.push(
    `**What currently limits growth?** ${model.executiveVerdict.growthLimits}`,
  );
  lines.push("");

  lines.push("## Scorecard");
  lines.push("");
  lines.push("```text");
  for (const c of model.scorecard) {
    if (c.id === "overall") {
      lines.push(`Overall Website Quality`);
      lines.push(`${c.display}`);
      lines.push("");
    } else {
      lines.push(`${c.label.padEnd(22)} ${c.display}`);
    }
  }
  lines.push("```");
  lines.push("");
  lines.push("| Component | Score / status | Confidence | Note |");
  lines.push("| --- | --- | --- | --- |");
  for (const c of model.scorecard) {
    lines.push(
      `| ${c.label} | ${c.display} | ${c.confidence ?? "—"} | ${c.note ?? "—"} |`,
    );
  }
  lines.push("");

  lines.push("## Confidence");
  lines.push("");
  lines.push(`**Level:** ${model.confidence.level}`);
  lines.push("");
  lines.push(...bullets(model.confidence.reasons));

  lines.push("## Measurement status (never invent)");
  lines.push("");
  lines.push("| Signal | Status |");
  lines.push("| --- | --- |");
  for (const m of model.measurementStatus) {
    lines.push(`| ${m.label} | ${m.status} |`);
  }
  lines.push("");

  lines.push("## Score history");
  lines.push("");
  if (!model.scoreHistory.length) {
    lines.push("_No previous scorecard snapshot — history starts after this run._");
    lines.push("");
  } else {
    lines.push(
      "> **Current column is authoritative.** Large Technical SEO jumps usually mean the prior scorecard was scored against a stale SEO-HEALTH snapshot (e.g. open P1s / incomplete probes), not that the live site suddenly “became” 100. Sustain ≥80 via FULL audits, production smoke, and field CWV — see `docs/seo/03-technical-seo-current-status.md`.",
    );
    lines.push("");
    lines.push("| Component | Previous | Current | Δ | Change |");
    lines.push("| --- | --- | --- | ---: | --- |");
    for (const h of model.scoreHistory) {
      const delta =
        h.delta == null ? "—" : h.delta > 0 ? `+${h.delta}` : String(h.delta);
      lines.push(
        `| ${h.label} | ${h.previousDisplay} | ${h.currentDisplay} | ${delta} | ${h.change} |`,
      );
    }
    lines.push("");
  }

  lines.push("## What SoftwareGlimpse does especially well");
  lines.push("");
  lines.push(...bullets(model.doesWell));

  lines.push("## Where SoftwareGlimpse is behind competitors");
  lines.push("");
  lines.push(...bullets(model.behindCompetitors));

  lines.push("## SEO health");
  lines.push("");
  lines.push(...bullets(model.seoHealth));

  lines.push("## Content health");
  lines.push("");
  lines.push(...bullets(model.contentHealth));

  lines.push("## UX/product health");
  lines.push("");
  lines.push(...bullets(model.uxProductHealth));

  lines.push("## Competitor landscape");
  lines.push("");
  lines.push(...bullets(model.competitorLandscape));

  lines.push("## Ranking feasibility");
  lines.push("");
  lines.push(...bullets(model.rankingFeasibility));

  lines.push("## Strongest topic clusters");
  lines.push("");
  lines.push(...bullets(model.strongestClusters));

  lines.push("## Weakest topic clusters");
  lines.push("");
  lines.push(...bullets(model.weakestClusters));

  lines.push("## Pages closest to ranking improvements");
  lines.push("");
  lines.push(...bullets(model.closestToRanking));

  lines.push("## Pages unlikely to rank without major work");
  lines.push("");
  lines.push(...bullets(model.unlikelyWithoutMajorWork));

  lines.push("## Missing content");
  lines.push("");
  lines.push(...bullets(model.missingContent));

  lines.push("## Missing tools/resources");
  lines.push("");
  lines.push(...bullets(model.missingToolsResources));

  lines.push("## Internal-link opportunities");
  lines.push("");
  lines.push(...bullets(model.internalLinkOpportunities));

  lines.push("## Authority / backlink limitations");
  lines.push("");
  lines.push(...bullets(model.authorityLimitations));

  lines.push("## Top 10 risks");
  lines.push("");
  lines.push("| ID | Priority | Area | Risk | Evidence |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const r of model.topRisks) {
    lines.push(
      `| ${r.id} | ${r.priority} | ${r.area} | ${r.title.replace(/\|/g, "/")} | ${r.evidence.replace(/\|/g, "/").slice(0, 100)} |`,
    );
  }
  lines.push("");

  lines.push("## Top 10 competitive advantages");
  lines.push("");
  lines.push(...bullets(model.topAdvantages));

  lines.push("## Top 30 recommended actions");
  lines.push("");
  lines.push(
    "| ID | Priority | Area | Affected | Problem | Evidence | Recommendation | Impact | Effort | Dependency |",
  );
  lines.push(
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  );
  for (const a of model.topActions) {
    lines.push(
      `| ${a.id} | ${a.priority} | ${a.area} | ${a.affected.replace(/\|/g, "/").slice(0, 40)} | ${a.problem.replace(/\|/g, "/").slice(0, 60)} | ${a.evidence.replace(/\|/g, "/").slice(0, 50)} | ${a.recommendation.replace(/\|/g, "/").slice(0, 70)} | ${a.impact} | ${a.effort} | ${a.dependency.slice(0, 40)} |`,
    );
  }
  lines.push("");

  if (model.refreshNotes.length) {
    lines.push("## Refresh notes");
    lines.push("");
    lines.push(...bullets(model.refreshNotes));
  }

  lines.push("## Inputs consumed");
  lines.push("");
  lines.push("| Source | Status | Path |");
  lines.push("| --- | --- | --- |");
  for (const s of model.sources) {
    lines.push(`| ${s.id} | ${s.status} | \`${s.path}\` |`);
  }
  lines.push("");

  lines.push("## Disclaimers");
  lines.push("");
  lines.push(...bullets(model.disclaimers));

  lines.push("## Commands");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:intelligence");
  lines.push("npm run site:intelligence:crm");
  lines.push("npm run site:intelligence -- --mode LIGHT");
  lines.push("npm run site:intelligence -- --mode FULL");
  lines.push("npm run site:intelligence -- --mode DEEP");
  lines.push("```");
  lines.push("");

  return lines.join("\n");
}
