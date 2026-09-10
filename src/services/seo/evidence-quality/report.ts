import type { EvidenceQualityReport } from "./types";

export function renderEvidenceQualityMarkdown(
  report: EvidenceQualityReport,
): string {
  const promoted = report.packs.filter((p) => p.promotedToDataVerified);
  const failed = report.packs.filter(
    (p) =>
      p.pricingVerification.attempted && !p.pricingVerification.verified,
  );

  const lines: string[] = [
    `# Evidence quality upgrade`,
    ``,
    `**Wave:** ${report.waveId}  `,
    `**Generated:** ${report.generatedAt}  `,
    `**Version:** ${report.version}  `,
    ``,
    `Uses existing research sources + live vendor plan confirmation.`,
    `Does **not** fabricate hands-on testing or ProductTestSession records.`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Priority products packed | ${report.packsBuilt} |`,
    `| Live pricing checks | ${report.pricingChecksAttempted} |`,
    `| Vendor plan confirmations | ${report.pricingChecksVerified} |`,
    `| Promoted RESEARCHED → DATA_VERIFIED | ${report.promotedToDataVerified} |`,
    `| Already DATA_VERIFIED | ${report.alreadyDataVerified} |`,
    `| Still RESEARCHED (in wave) | ${report.retainedResearched} |`,
    `| Banned hands-on language hits | ${report.languageHits} |`,
    `| Evidence/schema QA | ${report.schemaQaOk ? "PASS" : "FAIL"} |`,
    ``,
    `## Propagation`,
    ``,
    `Verified stamps live on enrichment \`pricing.verifiedAt\` + \`sourceIds\`.`,
    `Software / review / pricing / compare / guide / alternatives / best surfaces`,
    `read via \`resolvePricingVerifiedAtForEvidence\` / \`buildEditorialTrustMetadata\``,
    `— no duplicated page-level price copies written.`,
    ``,
    `Public labels: **Research-based review** · **Data verified** · **Hands-on tested**.`,
    ``,
    `## Promoted to DATA_VERIFIED`,
    ``,
  ];

  if (promoted.length === 0) {
    lines.push(`_None in this run._`, ``);
  } else {
    lines.push(
      `| Product | Source | Plans confirmed | Stamp | Dependents |`,
      `| --- | --- | --- | --- | ---: |`,
    );
    for (const p of promoted) {
      const v = p.pricingVerification;
      lines.push(
        `| [${p.name}](/software/${p.slug}/) | ${v.sourceUrl ?? "—"} | ${v.planNamesFound.length}/${v.planNamesChecked.length} | \`${v.verifiedAt}\` | ${p.dependentPages.length} |`,
      );
    }
    lines.push(``);
  }

  lines.push(`## Live verify failures (not elevated)`, ``);
  if (failed.length === 0) {
    lines.push(`_None._`, ``);
  } else {
    lines.push(`| Product | Reason |`, `| --- | --- |`);
    for (const p of failed) {
      lines.push(
        `| ${p.slug} | ${p.pricingVerification.rejectReason ?? "unknown"} |`,
      );
    }
    lines.push(``);
  }

  lines.push(
    `## Hands-on testing`,
    ``,
    `HANDS_ON is **0 / NOT_CURRENT_SCOPE** for the current remediation phase.`,
    `Do not block DATA_VERIFIED promotion or page improvement on missing human tests.`,
    `Do not create ProductTestSessions or testing tasks in this wave.`,
    `Public copy must not claim “we tested”, “our testing found”, “hands-on”, or “we used the product” unless a genuine completed session exists.`,
    ``,
    `Future enhancement only — ranked candidates (not a current queue):`,
    ``,
    `| Rank | Product | Priority | Comps | GSC opp | Impressions | Evidence |`,
    `| ---: | --- | ---: | ---: | ---: | ---: | --- |`,
  );
  for (const t of report.testingQueueTop10) {
    lines.push(
      `| ${t.rank} | [${t.name}](/software/${t.slug}/) (\`${t.slug}\`) | ${t.evidencePriorityScore} | ${t.comparisonCount} | ${t.opportunityScore} | ${t.impressions} | ${t.evidenceLevel} |`,
    );
  }

  lines.push(
    ``,
    `Future ranked list only: \`docs/editorial/PRODUCT-TESTING-QUEUE.md\` — not a current operating queue.`,
    ``,
    `## Evidence / schema QA`,
    ``,
  );
  for (const note of report.schemaQaNotes) {
    lines.push(`- ${note}`);
  }
  if (report.languageQa.length > 0) {
    lines.push(``, `### Banned language hits`, ``);
    for (const hit of report.languageQa.slice(0, 30)) {
      lines.push(
        `- \`${hit.path}\` · ${hit.pattern} · _${hit.excerpt}_ · level=${hit.evidenceLevel}`,
      );
    }
  } else {
    lines.push(``, `_No banned “We tested / Our experience / During testing” hits on research-only surfaces._`);
  }

  lines.push(
    ``,
    `## Artifacts`,
    ``,
    `- Packs: \`data/seo/evidence-packs/*.json\``,
    `- Report JSON: \`data/seo/evidence-quality-report.json\``,
    `- Reconciliation: \`docs/editorial/DATA-VERIFIED-RECONCILIATION.md\` (refresh via \`npm run seo:growth-dashboard\`)`,
    ``,
  );

  return `${lines.join("\n")}\n`;
}
