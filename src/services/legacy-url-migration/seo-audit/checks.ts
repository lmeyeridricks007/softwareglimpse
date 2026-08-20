import fs from "node:fs";
import path from "node:path";
import { normalizeMigrationPath } from "../normalize";
import {
  assertNoRedirectChains,
  buildDestinationIndex,
  validateRedirectDestination,
} from "../redirect-plan/validate";
import { makeFinding } from "./findings";
import type { AuditInputs } from "./load-inputs";
import { scanRepoForLegacyReferences } from "./scan-repo";
import type {
  AuditCheckResult,
  AuditFinding,
  LegacyFateKind,
  LegacyFateRow,
} from "./types";

export type CheckBundle = {
  findings: AuditFinding[];
  checks: AuditCheckResult[];
  fateRows: LegacyFateRow[];
};

function checkResult(
  id: AuditCheckResult["id"],
  title: string,
  findings: AuditFinding[],
  summary: string,
  emptyStatus: "pass" | "skip" = "pass",
): AuditCheckResult {
  const mine = findings.filter((f) => f.check === id);
  const hasP0 = mine.some((f) => f.severity === "P0");
  const hasP1 = mine.some((f) => f.severity === "P1");
  return {
    id,
    title,
    status: mine.length === 0 ? emptyStatus : hasP0 ? "fail" : hasP1 ? "warn" : "warn",
    summary,
    findingCount: mine.length,
  };
}

function resolveExpectedFate(
  action: string,
  inRedirects: boolean,
  inExcluded: boolean,
): LegacyFateKind {
  if (action === "KEEP") return "preserved_200";
  if (action === "404") return "intentional_404";
  if (action === "410") return "intentional_410";
  if (action === "301_REDIRECT" || action === "MERGE_AND_301") {
    if (inRedirects) return "redirect_301";
    if (inExcluded) return "excluded_manual";
    return "unresolved";
  }
  if (inRedirects) return "redirect_301";
  return "unresolved";
}

export function runAllAuditChecks(
  inputs: AuditInputs,
  opts?: {
    destinationIndex?: ReturnType<typeof buildDestinationIndex>;
    /** When true, skip filesystem repo scan (unit tests). */
    skipRepoScan?: boolean;
  },
): CheckBundle {
  const findings: AuditFinding[] = [];
  const fateRows: LegacyFateRow[] = [];

  const excludedSources = new Set(
    inputs.redirects.excludedManual.map((e) =>
      normalizeMigrationPath(e.source),
    ),
  );

  const destIndex = opts?.destinationIndex ?? buildDestinationIndex();

  // --- 1 + redirect hygiene: legacy URL fate ---
  for (const row of inputs.mappingRows) {
    const legacyPath = normalizeMigrationPath(row.legacyPath);
    const priority = inputs.importanceByPath.get(legacyPath);
    const importance = priority?.historicalSeoImportance ?? "LOW";
    const migrationRisk = priority?.migrationRisk ?? "LOW";
    const implemented = inputs.redirectBySource.get(legacyPath) ?? null;
    const inRedirects = implemented != null;
    const inExcluded = excludedSources.has(legacyPath);
    const expectedDest = row.newPath
      ? normalizeMigrationPath(row.newPath)
      : null;
    const expectedFate = resolveExpectedFate(
      row.recommendedAction,
      inRedirects,
      inExcluded,
    );
    const issues: string[] = [];

    if (row.recommendedAction === "KEEP") {
      const inv = inputs.inventoryByPath.get(legacyPath);
      if (!inv) {
        issues.push("KEEP path missing from new inventory");
      }
      if (inRedirects) {
        issues.push("KEEP path unexpectedly has a configured redirect");
      }
    }

    if (
      row.recommendedAction === "301_REDIRECT" ||
      row.recommendedAction === "MERGE_AND_301"
    ) {
      if (inRedirects) {
        if (expectedDest && implemented !== expectedDest) {
          issues.push(
            `Incorrect destination: configured ${implemented} vs mapping ${expectedDest}`,
          );
        }
        const v = validateRedirectDestination(implemented!, destIndex);
        if (!v.ok) {
          issues.push(`Invalid destination: ${v.notes.join("; ")}`);
        }
        if (inputs.redirectSources.has(implemented!)) {
          issues.push(`Redirect chain: ${legacyPath} → ${implemented} is also a source`);
        }
      } else if (inExcluded) {
        // intentional manual hold — not an auto failure unless high risk
        if (importance === "CRITICAL" || migrationRisk === "CRITICAL") {
          issues.push(
            "CRITICAL mapping excluded from redirects — must resolve before launch",
          );
        }
      } else if (row.confidence === "HIGH") {
        issues.push("HIGH confidence redirect mapping not implemented");
      }
      // MEDIUM/LOW without exclusion entry: still unresolved but lower urgency
      else if (!inExcluded) {
        issues.push(
          `${row.confidence} confidence redirect not implemented (manual review)`,
        );
      }
    }

    if (
      (row.recommendedAction === "404" || row.recommendedAction === "410") &&
      inRedirects
    ) {
      issues.push(
        `Retired ${row.recommendedAction} URL has a redirect — should remain retired`,
      );
    }

    if (
      row.recommendedAction === "REVIEW" ||
      row.recommendedAction === "NOINDEX"
    ) {
      // Unresolved until editorial decision — track fate, only escalate HIGH/CRITICAL.
      if (!inRedirects) {
        if (
          importance === "CRITICAL" ||
          migrationRisk === "CRITICAL" ||
          importance === "HIGH" ||
          migrationRisk === "HIGH"
        ) {
          issues.push(
            `Unresolved high-importance fate (${row.recommendedAction}) — decide 301/404/410/KEEP before launch`,
          );
        }
      }
    }

    const ok = issues.length === 0;
    fateRows.push({
      legacyPath,
      expectedFate,
      mappingAction: row.recommendedAction,
      expectedDestination: expectedDest,
      implementedDestination: implemented,
      ok,
      issues,
      importance,
      migrationRisk,
    });

    for (const issue of issues) {
      const isCritical =
        importance === "CRITICAL" ||
        migrationRisk === "CRITICAL" ||
        issue.includes("Incorrect destination") ||
        issue.includes("Redirect chain") ||
        issue.includes("Invalid destination") ||
        issue.includes("Retired");
      const isHigh =
        importance === "HIGH" ||
        migrationRisk === "HIGH" ||
        row.confidence === "HIGH";
      findings.push(
        makeFinding({
          check: "legacy_url_fate",
          severity: isCritical ? "P0" : isHigh ? "P1" : "P2",
          subject: legacyPath,
          problem: issue,
          evidence: `action=${row.recommendedAction}; confidence=${row.confidence}; importance=${importance}`,
          recommendedAction:
            row.recommendedAction === "404" || row.recommendedAction === "410"
              ? "Remove redirect; keep URL retired"
              : "Implement approved 301, fix destination, or explicitly document retirement",
        }),
      );
    }
  }

  // Temporary redirects where permanent expected
  for (const r of inputs.redirects.redirects) {
    if (r.permanent === false) {
      findings.push(
        makeFinding({
          check: "redirect_hygiene",
          severity: "P0",
          subject: r.source,
          problem: "Temporary redirect where permanent migration expected",
          evidence: `permanent=${r.permanent}`,
          recommendedAction: "Set permanent: true (301/308)",
        }),
      );
    }
  }

  const chainProblems = assertNoRedirectChains(
    inputs.redirects.redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
    })),
  );
  for (const problem of chainProblems) {
    findings.push(
      makeFinding({
        check: "redirect_hygiene",
        severity: "P0",
        subject: problem.split("→")[0]?.trim() ?? "chain",
        problem: "Redirect chain detected",
        evidence: problem,
        recommendedAction: "Flatten to final destination (A → C)",
      }),
    );
  }

  // --- 2. High-risk coverage ---
  const highRisk = inputs.seoPriority.filter(
    (r) =>
      r.historicalSeoImportance === "CRITICAL" ||
      r.historicalSeoImportance === "HIGH" ||
      r.migrationRisk === "CRITICAL" ||
      r.migrationRisk === "HIGH",
  );
  for (const row of highRisk) {
    const legacyPath = normalizeMigrationPath(row.legacyPath);
    const mapping = inputs.mappingRows.find(
      (m) => normalizeMigrationPath(m.legacyPath) === legacyPath,
    );
    if (!mapping) continue;
    if (
      mapping.recommendedAction !== "301_REDIRECT" &&
      mapping.recommendedAction !== "MERGE_AND_301"
    ) {
      continue;
    }
    const dest = inputs.redirectBySource.get(legacyPath);
    if (!dest) {
      findings.push(
        makeFinding({
          check: "high_risk_coverage",
          severity:
            row.historicalSeoImportance === "CRITICAL" ||
            row.migrationRisk === "CRITICAL"
              ? "P0"
              : "P1",
          subject: legacyPath,
          problem: "High-risk legacy URL lacks implemented permanent redirect",
          evidence: `importance=${row.historicalSeoImportance}; risk=${row.migrationRisk}; mapped→${row.newPath}`,
          recommendedAction:
            "Approve and implement 301 to mapped destination, or document intentional exclusion",
        }),
      );
      continue;
    }
    if (row.newPath && normalizeMigrationPath(row.newPath) !== dest) {
      findings.push(
        makeFinding({
          check: "high_risk_coverage",
          severity: "P0",
          subject: legacyPath,
          problem: "High-risk redirect destination does not match mapping",
          evidence: `configured=${dest}; mapped=${row.newPath}`,
          recommendedAction: "Align redirect destination with approved mapping",
        }),
      );
    }
    const v = validateRedirectDestination(dest, destIndex);
    if (!v.ok) {
      findings.push(
        makeFinding({
          check: "high_risk_coverage",
          severity: "P0",
          subject: legacyPath,
          problem: "High-risk redirect destination failed validation",
          evidence: v.notes.join("; "),
          recommendedAction: "Fix destination to an existing canonical indexable URL",
        }),
      );
    }
    if (!inputs.sitemapPaths.has(dest)) {
      const inv = inputs.inventoryByPath.get(dest);
      if (inv?.indexable !== false) {
        findings.push(
          makeFinding({
            check: "high_risk_coverage",
            severity: "P1",
            subject: legacyPath,
            problem: "High-risk redirect target not in sitemap",
            evidence: `destination=${dest}`,
            recommendedAction: "Ensure target is published and sitemap-eligible",
          }),
        );
      }
    }
  }

  // --- 3. Internal links to redirect sources ---
  for (const edge of inputs.internalLinkEdges) {
    if (inputs.redirectSources.has(edge.to)) {
      const finalDest = inputs.redirectBySource.get(edge.to);
      findings.push(
        makeFinding({
          check: "internal_links",
          severity: "P1",
          subject: edge.from,
          problem: "Internal link points at a legacy redirect source",
          evidence: `${edge.from} → ${edge.to} (should be ${finalDest})`,
          recommendedAction: "Update link to final canonical destination",
        }),
      );
    }
  }

  // --- 4. Canonicals on new inventory ---
  for (const page of inputs.inventory) {
    if (!page.indexable) continue;
    const pathNorm = normalizeMigrationPath(page.path);
    const canonPath = normalizeMigrationPath(page.canonical);
    if (canonPath !== pathNorm) {
      findings.push(
        makeFinding({
          check: "canonicals",
          severity: "P0",
          subject: pathNorm,
          problem: "Canonical path does not match page path",
          evidence: `path=${pathNorm}; canonical=${canonPath}`,
          recommendedAction: "Align seo.canonicalPath / inventory canonical",
        }),
      );
    }
    if (inputs.redirectSources.has(canonPath)) {
      findings.push(
        makeFinding({
          check: "canonicals",
          severity: "P0",
          subject: pathNorm,
          problem: "Canonical points at a redirect source (legacy URL)",
          evidence: `canonical=${canonPath}`,
          recommendedAction: "Use final new-route canonical",
        }),
      );
    }
    if (page.inSitemap && !inputs.sitemapPaths.has(pathNorm)) {
      findings.push(
        makeFinding({
          check: "canonicals",
          severity: "P1",
          subject: pathNorm,
          problem: "Indexable page marked inSitemap but missing from sitemap builder",
          evidence: page.url,
          recommendedAction: "Fix sitemap inclusion for this entity",
        }),
      );
    }
    if (!page.inSitemap && page.indexable && inputs.sitemapPaths.has(pathNorm)) {
      // inventory lag — soft
    }
  }

  // --- 5. Sitemap hygiene ---
  for (const smPath of inputs.sitemapPaths) {
    if (inputs.redirectSources.has(smPath)) {
      findings.push(
        makeFinding({
          check: "sitemaps",
          severity: "P0",
          subject: smPath,
          problem: "Sitemap contains a redirect source URL",
          evidence: smPath,
          recommendedAction: "Remove from sitemap; only list final canonicals",
        }),
      );
    }
    const inv = inputs.inventoryByPath.get(smPath);
    if (!inv) {
      findings.push(
        makeFinding({
          check: "sitemaps",
          severity: "P1",
          subject: smPath,
          problem: "Sitemap URL not found in new inventory",
          evidence: smPath,
          recommendedAction: "Verify route exists and is inventory-tracked",
        }),
      );
      continue;
    }
    if (inv.indexable === false) {
      findings.push(
        makeFinding({
          check: "sitemaps",
          severity: "P0",
          subject: smPath,
          problem: "Sitemap contains noindex / non-indexable URL",
          evidence: `pageType=${inv.pageType}; publicationState=${inv.publicationState}`,
          recommendedAction: "Exclude noindex/draft URLs from sitemap",
        }),
      );
    }
  }

  // Retired mapping paths must not appear in sitemap
  for (const row of inputs.mappingRows) {
    if (row.recommendedAction !== "404" && row.recommendedAction !== "410") {
      continue;
    }
    const p = normalizeMigrationPath(row.legacyPath);
    if (inputs.sitemapPaths.has(p)) {
      findings.push(
        makeFinding({
          check: "sitemaps",
          severity: "P0",
          subject: p,
          problem: "Sitemap contains intentional 404/410 legacy URL",
          evidence: `action=${row.recommendedAction}`,
          recommendedAction: "Remove from sitemap",
        }),
      );
    }
  }

  // --- 6 + 7 + 8 + 9: repo scan ---
  const repoHits = opts?.skipRepoScan
    ? []
    : scanRepoForLegacyReferences({
        redirectSources: inputs.redirectSources,
      });

  for (const hit of repoHits) {
    if (hit.kind === "legacy_path") {
      findings.push(
        makeFinding({
          check: "hardcoded_legacy",
          severity: "P1",
          subject: hit.file,
          problem: "Hardcoded legacy redirect path in repository",
          evidence: `${hit.file}:${hit.line} → ${hit.match}`,
          recommendedAction: "Replace with final canonical path",
        }),
      );
    } else if (hit.kind === "absolute_host") {
      // Absolute host to non-new path or redirect source
      const isRedirectish = [...inputs.redirectSources].some((s) =>
        hit.match.includes(s.replace(/\/$/, "")),
      );
      findings.push(
        makeFinding({
          check: isRedirectish ? "hardcoded_legacy" : "open_graph",
          severity: isRedirectish ? "P1" : "P2",
          subject: hit.file,
          problem: isRedirectish
            ? "Absolute softwareglimpse.com URL points at legacy path"
            : "Absolute softwareglimpse.com URL outside new IA prefixes",
          evidence: `${hit.file}:${hit.line} → ${hit.match}`,
          recommendedAction:
            "Use canonical new route (prefer path helpers / canonicalUrl)",
        }),
      );
    } else if (hit.kind === "wp_media") {
      findings.push(
        makeFinding({
          check: "legacy_assets",
          severity: "P0",
          subject: hit.file,
          problem: "WordPress media URL referenced in new codebase",
          evidence: `${hit.file}:${hit.line} → ${hit.match}`,
          recommendedAction:
            "Copy asset into /public, update reference, or add media redirect",
        }),
      );
    } else if (hit.kind === "attachment" || hit.kind === "amp_query") {
      findings.push(
        makeFinding({
          check: "hardcoded_legacy",
          severity: "P2",
          subject: hit.file,
          problem: `Legacy WordPress query pattern (${hit.kind})`,
          evidence: `${hit.file}:${hit.line} → ${hit.match}`,
          recommendedAction: "Remove WP query patterns from new site links",
        }),
      );
    }
  }

  // Structured data builders use canonicalUrl — smoke-check for hardcoded legacy in schema helpers
  const schemaFiles = [
    path.join(process.cwd(), "src/seo/structured-data.tsx"),
    path.join(process.cwd(), "src/seo/breadcrumbs.ts"),
    path.join(process.cwd(), "src/seo/metadata.ts"),
  ];
  for (const file of schemaFiles) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const source of inputs.redirectSources) {
      if (source === "/") continue;
      const bare = source.replace(/\/$/, "");
      if (text.includes(bare) && !bare.startsWith("/features/")) {
        // feature aliases may appear in PATH_ALIASES adjacent files — skip canonical.ts aliases
        findings.push(
          makeFinding({
            check: "structured_data",
            severity: "P0",
            subject: path.relative(process.cwd(), file),
            problem: "Structured-data / SEO helper embeds legacy redirect path",
            evidence: bare,
            recommendedAction: "Emit only final canonical URLs in JSON-LD / OG",
          }),
        );
      }
    }
  }

  // OG policy: metadata.ts uses canonical for openGraph.url — confirm no stale override patterns
  const metaPath = path.join(process.cwd(), "src/seo/metadata.ts");
  if (fs.existsSync(metaPath)) {
    const meta = fs.readFileSync(metaPath, "utf8");
    if (!meta.includes("openGraph") || !meta.includes("canonical")) {
      findings.push(
        makeFinding({
          check: "open_graph",
          severity: "P1",
          subject: "src/seo/metadata.ts",
          problem: "Open Graph URL may not follow canonical helper",
          evidence: "Expected openGraph.url derived from canonicalUrl(path)",
          recommendedAction: "Keep OG url = canonical new route",
        }),
      );
    }
  }

  // --- 10. 404 experience ---
  const notFoundPath = path.join(process.cwd(), "src/app/not-found.tsx");
  if (!fs.existsSync(notFoundPath)) {
    findings.push(
      makeFinding({
        check: "not_found_experience",
        severity: "P0",
        subject: "src/app/not-found.tsx",
        problem: "Missing App Router not-found.tsx",
        evidence: "File not found",
        recommendedAction: "Add not-found page with useful navigation",
      }),
    );
  } else {
    const nf = fs.readFileSync(notFoundPath, "utf8");
    if (!/Page not found|not found/i.test(nf)) {
      findings.push(
        makeFinding({
          check: "not_found_experience",
          severity: "P1",
          subject: "src/app/not-found.tsx",
          problem: "404 page lacks clear not-found messaging",
          evidence: "Expected visible 'not found' copy",
          recommendedAction: "Clarify 404 messaging",
        }),
      );
    }
    if (!/href=["']\//.test(nf) && !/<Link/.test(nf)) {
      findings.push(
        makeFinding({
          check: "not_found_experience",
          severity: "P1",
          subject: "src/app/not-found.tsx",
          problem: "404 page lacks useful navigation links",
          evidence: "No Link/href navigation detected",
          recommendedAction: "Add hub / search / home links",
        }),
      );
    }
  }

  // Deduplicate findings by id
  const deduped = [...new Map(findings.map((f) => [f.id, f])).values()];

  const fateIssues = fateRows.filter((r) => !r.ok).length;
  const highRiskFindings = deduped.filter((f) => f.check === "high_risk_coverage");

  const checks: AuditCheckResult[] = [
    checkResult(
      "legacy_url_fate",
      "Legacy URL fate coverage",
      deduped,
      `${fateRows.length - fateIssues}/${fateRows.length} legacy URLs have clean fate; ${fateIssues} with issues`,
    ),
    checkResult(
      "redirect_hygiene",
      "Redirect hygiene (chains / temporary)",
      deduped,
      chainProblems.length === 0
        ? "No redirect chains; permanent-only policy checked"
        : `${chainProblems.length} chain problem(s)`,
    ),
    checkResult(
      "high_risk_coverage",
      "CRITICAL/HIGH legacy redirect coverage",
      deduped,
      highRiskFindings.length === 0
        ? "High-risk redirect destinations validated"
        : `${highRiskFindings.length} high-risk issue(s)`,
    ),
    checkResult(
      "internal_links",
      "Internal links avoid redirect sources",
      deduped,
      deduped.filter((f) => f.check === "internal_links").length === 0
        ? "No internal-link graph edges target redirect sources"
        : "Internal links point at redirect sources",
    ),
    checkResult(
      "canonicals",
      "New-page canonical alignment",
      deduped,
      "Canonical paths checked against inventory + redirect sources",
    ),
    checkResult(
      "sitemaps",
      "Sitemap hygiene",
      deduped,
      "Sitemap checked for redirects, retirements, and noindex",
    ),
    checkResult(
      "structured_data",
      "Structured data legacy URL scan",
      deduped,
      "Schema helpers scanned for embedded legacy paths",
    ),
    checkResult(
      "open_graph",
      "Open Graph / share URL policy",
      deduped,
      "OG helpers + absolute host references reviewed",
    ),
    checkResult(
      "hardcoded_legacy",
      "Hardcoded legacy links in repo",
      deduped,
      "App/components/data/services scanned for redirect sources",
    ),
    checkResult(
      "legacy_assets",
      "WordPress media / asset references",
      deduped,
      "wp-content/uploads and attachment patterns scanned",
    ),
    checkResult(
      "not_found_experience",
      "404 page experience",
      deduped,
      "not-found.tsx present with messaging + navigation",
    ),
  ];

  return { findings: deduped, checks, fateRows };
}
