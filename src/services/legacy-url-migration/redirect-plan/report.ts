import type { LegacyRedirectsFile, RedirectManifestEntry } from "./types";

function esc(v: string): string {
  return v.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function renderRedirectManifestMarkdown(input: {
  file: LegacyRedirectsFile;
  manifest: RedirectManifestEntry[];
  validationErrors: string[];
}): string {
  const { file, manifest, validationErrors } = input;
  const implemented = manifest.filter((m) => m.implemented);
  const excluded = manifest.filter(
    (m) => m.approvalStatus === "manual_review_excluded",
  );
  const retired = manifest.filter(
    (m) => m.approvalStatus === "retired_no_redirect",
  );

  const lines: string[] = [];
  lines.push("# Redirect Manifest");
  lines.push("");
  lines.push(`**Generated:** ${file.generatedAt}`);
  lines.push(`**Generator:** ${file.generator}`);
  lines.push(
    `**Source of truth:** [\`config/legacy-redirects.json\`](../../config/legacy-redirects.json)`,
  );
  lines.push("");
  lines.push(
    "> Permanent (301) redirects only. Low/medium confidence mappings are **excluded**. No homepage dumps. No middleware.",
  );
  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push("- Only **HIGH** confidence + allowlisted match bases");
  lines.push("- Permanent redirects only (no temporary migration redirects)");
  lines.push("- Chains flattened to final destination");
  lines.push("- Destinations validated against new-app inventory");
  lines.push("- Retired WP taxonomy stays 404/410 — not redirected to `/` or `/guides/`");
  lines.push("- Stretch guide merges (vertical posts → generic guides) excluded for manual review");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Redirects implemented | ${file.stats.redirects} |`);
  lines.push(`| Auto-approved (legacy) | ${file.stats.autoApproved} |`);
  lines.push(`| Manual mappings excluded | ${file.stats.manualExcluded} |`);
  lines.push(`| WP retired patterns documented | ${file.stats.retiredPatterns} |`);
  lines.push(`| Chains flattened | ${file.stats.chainsFlattened} |`);
  lines.push("");

  if (validationErrors.length) {
    lines.push("## Validation errors");
    lines.push("");
    for (const e of validationErrors) lines.push(`- ${esc(e)}`);
    lines.push("");
  }

  lines.push("## Implemented redirects");
  lines.push("");
  lines.push(
    "| Source | Destination | Type | Reason | Confidence | Implemented? | Test status |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const m of implemented) {
    lines.push(
      `| \`${m.source}\` | \`${m.destination}\` | ${m.type} | ${esc(m.reason)} | ${m.confidence} | yes | ${m.testStatus} |`,
    );
  }
  lines.push("");

  lines.push("## Manual mappings excluded (not implemented)");
  lines.push("");
  lines.push(
    "These had redirect recommendations but failed auto-approval (low/medium confidence or non-allowlisted basis):",
  );
  lines.push("");
  lines.push(
    "| Source | Destination | Type | Reason | Confidence | Implemented? | Test status |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const m of excluded.slice(0, 120)) {
    lines.push(
      `| \`${m.source}\` | ${m.destination ? `\`${m.destination}\`` : "—"} | ${m.type} | ${esc(m.reason)} | ${m.confidence} | no | ${m.testStatus} |`,
    );
  }
  if (excluded.length > 120) {
    lines.push("");
    lines.push(`_…and ${excluded.length - 120} more in JSON_`);
  }
  lines.push("");

  lines.push("## Retired (404/410) — no redirect");
  lines.push("");
  lines.push(
    "| Source | Destination | Type | Reason | Confidence | Implemented? | Test status |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  lines.push(
    `| \`/tag/*\` (pattern) | — | 410 | WP tag archives | HIGH | no (intentional) | skipped |`,
  );
  lines.push(
    `| \`/author/*\` (pattern) | — | 404 | WP author archives | HIGH | no (intentional) | skipped |`,
  );
  lines.push(
    `| \`/feed\` patterns | — | 410 | WP feeds | HIGH | no (intentional) | skipped |`,
  );
  lines.push(
    `| _${retired.length} exact URLs in mapping plan marked 404/410_ | — | 410/404 | See mapping plan | — | no | skipped |`,
  );
  lines.push("");
  lines.push(
    "Exact 410/404 paths are **not** emitted as Next redirects (Next cannot express 410 via `redirects()`). They simply have no 301 — platform/default 404 applies until explicit 410 handling is approved.",
  );
  lines.push("");

  lines.push("## WordPress legacy patterns");
  lines.push("");
  lines.push("| Pattern | Action | Notes |");
  lines.push("| --- | --- | --- |");
  for (const r of file.retired) {
    lines.push(`| \`${r.sourcePattern}\` | ${r.action} | ${esc(r.reason)} |`);
  }
  lines.push(
    "| `/category/:slug` | selective 301 | Only HIGH allowlisted category→hub maps (e.g. `/category/crm/` → `/categories/crm/`). No broad regex. |",
  );
  lines.push(
    "| `/page/2/`, `?amp`, date archives, `?attachment_id=` | 404/410 | Not implemented as catch-alls — avoid colliding with new routes. |",
  );
  lines.push("");

  lines.push("## Wiring");
  lines.push("");
  lines.push("- `config/legacy-redirects.json` — machine-readable source of truth");
  lines.push("- `next.config.ts` — loads via `toNextConfigRedirects()`");
  lines.push("- Tests: `src/services/legacy-url-migration/redirect-plan/redirect-plan.test.ts`");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run migration:redirects");
  lines.push("npm test -- src/services/legacy-url-migration/redirect-plan");
  lines.push("```");
  lines.push("");

  return `${lines.join("\n")}\n`;
}
