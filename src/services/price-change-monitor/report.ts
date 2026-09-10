import type {
  DetectedPriceChange,
  PriceChangeEditorialCandidate,
  PriceMonitorQueueItem,
} from "@/domain";
import type { PriceChangeImpactPage } from "./impact";
import type { ApplyConfirmedPriceChangeResult } from "./impact";

export type WeeklyPriceChangeReportInput = {
  generatedAt: string;
  weekLabel: string;
  queueSample: PriceMonitorQueueItem[];
  changes: DetectedPriceChange[];
  affectedPages: PriceChangeImpactPage[];
  confirmedApplications: ApplyConfirmedPriceChangeResult[];
  editorialCandidates: PriceChangeEditorialCandidate[];
  researchSignals: string[];
};

function sectionList(title: string, lines: string[]): string {
  if (lines.length === 0) {
    return `## ${title}\n\n_None in this run._\n`;
  }
  return `## ${title}\n\n${lines.map((l) => `- ${l}`).join("\n")}\n`;
}

/**
 * Generate docs/pricing/WEEKLY-PRICE-CHANGES.md body.
 */
export function formatWeeklyPriceChangesMarkdown(
  input: WeeklyPriceChangeReportInput,
): string {
  const confirmed = input.changes.filter((c) => c.confidence === "CONFIRMED");
  const needsVerification = input.changes.filter(
    (c) =>
      c.confidence === "LIKELY" || c.confidence === "REQUIRES_REVIEW",
  );
  const major = input.changes.filter((c) => c.noteworthy);

  const confirmedLines = confirmed.map(
    (c) =>
      `**${c.productName}** (\`${c.productId}\`) — ${c.kind}: ${c.summary}`,
  );
  const verifyLines = needsVerification.map(
    (c) =>
      `**${c.productName}** — \`${c.confidence}\` — ${c.summary}${
        c.validationNotes.length
          ? ` (_${c.validationNotes.join("; ")}_)`
          : ""
      }`,
  );

  const pageLines = [
    ...new Map(
      input.affectedPages.map((p) => [p.path, p] as const),
    ).values(),
  ]
    .slice(0, 80)
    .map((p) => `\`${p.path}\` (${p.pageType}) ← ${p.productId}`);

  const majorLines = major.map(
    (c) =>
      `**${c.productName}** — ${c.kind} (${c.confidence}): ${c.summary}`,
  );

  const editorialLines = input.editorialCandidates.map(
    (e) =>
      `**${e.title}** — ${e.confidence} — ${e.rationale} _(publishStatus: candidate — do not auto-publish)_`,
  );

  const queueLines = input.queueSample.slice(0, 15).map(
    (q) =>
      `#${q.rank} ${q.productName} — **${q.frequency}** (score ${q.priorityScore}) — ${q.reasons.join("; ")}`,
  );

  const refreshLines = input.confirmedApplications.flatMap((a) =>
    a.refreshCandidates.map(
      (c) =>
        `${c.contentId} — ${c.priority} / ${c.refreshStatus} — ${c.reasons.join("; ")}`,
    ),
  );

  return `# Weekly price changes

Generated: ${input.generatedAt}  
Week: ${input.weekLabel}

Price changes require validation. **LIKELY** and **REQUIRES_REVIEW** must not be published as facts. Only **CONFIRMED** rows may drive observation appends and publishing refresh events.

---

${sectionList("Confirmed changes", confirmedLines)}
${sectionList("Needs verification", verifyLines)}
${sectionList("Affected pages", pageLines)}
${sectionList("Major changes", majorLines)}
${sectionList("Research signals", input.researchSignals)}
${sectionList("Editorial candidates", editorialLines)}
${sectionList("Monitoring queue (top)", queueLines)}
${sectionList("Refresh tasks (from CONFIRMED)", refreshLines)}

---

## Methodology

1. Prioritize products (SEO opportunity, impressions, comparisons, commercial, category, volatility).
2. Diff current catalogue \`Pricing\` against latest \`PriceObservation\` series.
3. Classify confidence with validation rules (deterministic source, structural changes, verify-live).
4. CONFIRMED → change events + refresh candidates + optional observation append.
5. Noteworthy → editorial candidates only (never auto-publish).
6. Growth signals boost refresh priority for pages with outdated pricing risk.

See [PRICE-MONITOR.md](./PRICE-MONITOR.md).
`;
}
