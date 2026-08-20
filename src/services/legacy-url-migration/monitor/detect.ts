import { normalizeMigrationPath } from "../normalize";
import {
  assertNoRedirectChains,
  buildDestinationIndex,
  validateRedirectDestination,
} from "../redirect-plan/validate";
import { loadLegacyRedirectsFile } from "../redirect-plan/load-redirects";
import type { UrlMappingRow } from "../mapping-agent/types";
import type { SeoPriorityRow } from "../seo-priority/types";
import { collectCrmOutboundEdges } from "@/services/internal-linking/outbound-graph";
import { scanRepoForLegacyReferences } from "../seo-audit/scan-repo";
import { stableMigIssueId } from "./stable-ids";
import type { MonitorIssue, MonitorIssueKind, MonitorSeverity } from "./types";
import fs from "node:fs";
import path from "node:path";

type Draft = Omit<MonitorIssue, "state" | "firstSeenAt" | "lastSeenAt">;

function draft(input: {
  kind: MonitorIssueKind;
  severity: MonitorSeverity;
  subject: string;
  problem: string;
  evidence: string;
  recommendedAction: string;
  important?: boolean;
  signature?: string;
}): Draft {
  return {
    id: stableMigIssueId(input.kind, input.subject, input.signature ?? input.problem),
    kind: input.kind,
    severity: input.severity,
    subject: input.subject,
    problem: input.problem,
    evidence: input.evidence,
    recommendedAction: input.recommendedAction,
    important: Boolean(input.important),
  };
}

function isImportantPath(
  legacyPath: string,
  priority: SeoPriorityRow | undefined,
  mapping: UrlMappingRow | undefined,
): boolean {
  if (
    priority?.historicalSeoImportance === "CRITICAL" ||
    priority?.historicalSeoImportance === "HIGH" ||
    priority?.migrationRisk === "CRITICAL" ||
    priority?.migrationRisk === "HIGH"
  ) {
    return true;
  }
  if (priority?.proxy?.commercialValue) return true;
  if (priority?.backlinks && (priority.backlinks.backlinks ?? 0) > 0) return true;
  if (priority?.gsc && priority.gsc.clicks > 0) return true;

  const intent = mapping?.legacyIntent ?? "";
  if (
    intent === "product_review" ||
    intent === "best" ||
    intent === "comparison" ||
    intent === "guide" ||
    intent === "resource"
  ) {
    return (
      priority?.historicalSeoImportance === "MEDIUM" ||
      mapping?.seoRisk === "HIGH"
    );
  }
  return false;
}

function loadJson<T>(file: string): T | null {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

/**
 * Detect current migration health issues (static). Does not mutate redirects.
 */
export function detectMonitorIssues(opts?: {
  now?: Date;
  skipRepoScan?: boolean;
}): {
  drafts: Draft[];
  redirectsChecked: number;
  importantUrlsWatched: number;
} {
  const dataDir = path.join(process.cwd(), "docs", "migration", "data");
  const mappingRows =
    loadJson<UrlMappingRow[]>(path.join(dataDir, "url-mapping-plan.json")) ??
    [];
  const seoPriority =
    loadJson<SeoPriorityRow[]>(
      path.join(dataDir, "seo-priority-migration-map.json"),
    ) ?? [];

  const priorityByPath = new Map(
    seoPriority.map((r) => [normalizeMigrationPath(r.legacyPath), r]),
  );
  const mappingByPath = new Map(
    mappingRows.map((r) => [normalizeMigrationPath(r.legacyPath), r]),
  );

  let redirects: {
    redirects: Array<{
      source: string;
      destination: string;
      permanent: boolean;
    }>;
  };
  try {
    redirects = loadLegacyRedirectsFile();
  } catch {
    redirects = { redirects: [] };
  }

  const redirectBySource = new Map(
    redirects.redirects.map((r) => [
      normalizeMigrationPath(r.source),
      normalizeMigrationPath(r.destination),
    ]),
  );
  const redirectSources = new Set(redirectBySource.keys());
  const destIndex = buildDestinationIndex(opts?.now);

  const drafts: Draft[] = [];
  const importantWatched = new Set<string>();

  // --- Redirect health + targets ---
  for (const r of redirects.redirects) {
    const source = normalizeMigrationPath(r.source);
    const dest = normalizeMigrationPath(r.destination);
    const priority = priorityByPath.get(source);
    const mapping = mappingByPath.get(source);
    const important = isImportantPath(source, priority, mapping);
    if (important) importantWatched.add(source);

    if (r.permanent === false) {
      drafts.push(
        draft({
          kind: "REDIRECT",
          severity: "P0",
          subject: source,
          problem: "Temporary redirect where permanent migration expected",
          evidence: `permanent=${r.permanent} → ${dest}`,
          recommendedAction: "Set permanent: true (do not auto-edit — regenerate via RedirectPlanGenerator)",
          important,
        }),
      );
    }

    const validation = validateRedirectDestination(dest, destIndex);
    if (!validation.ok) {
      drafts.push(
        draft({
          kind: "TARGET",
          severity: important ? "P0" : "P1",
          subject: source,
          problem: "Redirect target failed inventory validation",
          evidence: `${source} → ${dest}: ${validation.notes.join("; ")}`,
          recommendedAction: "Fix destination to an existing canonical route; regenerate redirects",
          important,
        }),
      );
    } else if (!validation.inSitemap) {
      const row = destIndex.byPath.get(dest);
      if (row?.indexable !== false) {
        drafts.push(
          draft({
            kind: "TARGET",
            severity: important ? "P1" : "P2",
            subject: source,
            problem: "Redirect target not present in sitemap",
            evidence: `${dest} missing from sitemap builder`,
            recommendedAction: "Confirm publish/indexability of target",
            important,
          }),
        );
      }
    }

    // Mapping destination drift
    if (
      mapping?.newPath &&
      (mapping.recommendedAction === "301_REDIRECT" ||
        mapping.recommendedAction === "MERGE_AND_301")
    ) {
      const expected = normalizeMigrationPath(mapping.newPath);
      if (expected !== dest) {
        drafts.push(
          draft({
            kind: "REDIRECT",
            severity: important ? "P0" : "P1",
            subject: source,
            problem: "Configured redirect destination differs from mapping plan",
            evidence: `configured=${dest}; mapped=${expected}`,
            recommendedAction: "Align config/legacy-redirects.json with approved mapping",
            important,
          }),
        );
      }
    }
  }

  // --- Chains + loops ---
  const chainProblems = assertNoRedirectChains(
    redirects.redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
    })),
  );
  for (const problem of chainProblems) {
    const source = problem.split("→")[0]?.trim() ?? problem;
    drafts.push(
      draft({
        kind: "CHAIN",
        severity: "P0",
        subject: normalizeMigrationPath(source),
        problem: "Redirect chain detected",
        evidence: problem,
        recommendedAction: "Flatten to final destination (A → C)",
        important: true,
        signature: problem,
      }),
    );
  }

  // Loop: A→B and B→A, or A→A
  for (const [source, dest] of redirectBySource) {
    if (source === dest) {
      drafts.push(
        draft({
          kind: "LOOP",
          severity: "P0",
          subject: source,
          problem: "Redirect self-loop",
          evidence: `${source} → ${dest}`,
          recommendedAction: "Remove or retarget redirect",
          important: true,
        }),
      );
    }
    const next = redirectBySource.get(dest);
    if (next === source) {
      drafts.push(
        draft({
          kind: "LOOP",
          severity: "P0",
          subject: source,
          problem: "Redirect mutual loop",
          evidence: `${source} → ${dest} → ${source}`,
          recommendedAction: "Flatten / remove loop",
          important: true,
        }),
      );
    }
  }

  // --- Unexpected 404: redirect sources that mapping marked KEEP, or retired URLs that got redirected wrongly already covered ---
  // Mapping 301 without implementation for important URLs
  for (const row of mappingRows) {
    const legacyPath = normalizeMigrationPath(row.legacyPath);
    const priority = priorityByPath.get(legacyPath);
    const important = isImportantPath(legacyPath, priority, row);
    if (!important) continue;
    importantWatched.add(legacyPath);

    if (
      (row.recommendedAction === "301_REDIRECT" ||
        row.recommendedAction === "MERGE_AND_301") &&
      !redirectBySource.has(legacyPath)
    ) {
      drafts.push(
        draft({
          kind: "404",
          severity:
            priority?.migrationRisk === "CRITICAL" ||
            priority?.historicalSeoImportance === "CRITICAL"
              ? "P0"
              : "P1",
          subject: legacyPath,
          problem: "Important legacy URL has no implemented redirect (risk of unexpected 404)",
          evidence: `action=${row.recommendedAction}; importance=${priority?.historicalSeoImportance ?? "n/a"}`,
          recommendedAction: "Approve mapping and regenerate redirects, or mark intentional retirement",
          important: true,
        }),
      );
    }

    if (
      (row.recommendedAction === "404" || row.recommendedAction === "410") &&
      redirectBySource.has(legacyPath)
    ) {
      drafts.push(
        draft({
          kind: "REDIRECT",
          severity: "P0",
          subject: legacyPath,
          problem: "Retired URL unexpectedly has a redirect",
          evidence: `action=${row.recommendedAction} but redirects to ${redirectBySource.get(legacyPath)}`,
          recommendedAction: "Remove redirect; keep intentional 404/410",
          important: true,
        }),
      );
    }
  }

  // --- Canonical regressions on new inventory ---
  for (const [p, row] of destIndex.byPath) {
    if (!row.indexable) continue;
    const canon = normalizeMigrationPath(row.canonical);
    if (canon !== p) {
      drafts.push(
        draft({
          kind: "CANONICAL",
          severity: "P0",
          subject: p,
          problem: "Canonical path differs from page path",
          evidence: `path=${p}; canonical=${canon}`,
          recommendedAction: "Align canonical to new route",
          important: true,
        }),
      );
    }
    if (redirectSources.has(canon)) {
      drafts.push(
        draft({
          kind: "CANONICAL",
          severity: "P0",
          subject: p,
          problem: "Canonical points at a legacy redirect source",
          evidence: `canonical=${canon}`,
          recommendedAction: "Use final new-route canonical",
          important: true,
        }),
      );
    }
  }

  // --- Sitemap regressions ---
  for (const sm of destIndex.sitemap) {
    if (redirectSources.has(sm)) {
      drafts.push(
        draft({
          kind: "SITEMAP",
          severity: "P0",
          subject: sm,
          problem: "Sitemap contains redirect source URL",
          evidence: sm,
          recommendedAction: "Remove from sitemap; list final canonical only",
          important: true,
        }),
      );
    }
    const inv = destIndex.byPath.get(sm);
    if (inv && inv.indexable === false) {
      drafts.push(
        draft({
          kind: "SITEMAP",
          severity: "P0",
          subject: sm,
          problem: "Sitemap contains non-indexable URL",
          evidence: `pageType=${inv.pageType}`,
          recommendedAction: "Exclude noindex/draft from sitemap",
          important: true,
        }),
      );
    }
  }

  // --- Internal links to redirect sources ---
  for (const edge of collectCrmOutboundEdges()) {
    const to = normalizeMigrationPath(edge.to);
    if (redirectSources.has(to)) {
      drafts.push(
        draft({
          kind: "INTERNAL",
          severity: "P1",
          subject: normalizeMigrationPath(edge.from),
          problem: "Internal link points at legacy redirect source",
          evidence: `${edge.from} → ${to} (final ${redirectBySource.get(to)})`,
          recommendedAction: "Point internal links at final canonical",
          important: true,
          signature: `${edge.from}|${to}`,
        }),
      );
    }
  }

  // --- Legacy URLs reintroduced in repo ---
  if (!opts?.skipRepoScan) {
    const hits = scanRepoForLegacyReferences({ redirectSources });
    for (const hit of hits) {
      if (hit.kind !== "legacy_path" && hit.kind !== "absolute_host") continue;
      drafts.push(
        draft({
          kind: "INTERNAL",
          severity: "P1",
          subject: hit.file,
          problem: "Legacy redirect URL reintroduced in repository",
          evidence: `${hit.file}:${hit.line} → ${hit.match}`,
          recommendedAction: "Replace with final canonical path",
          important: false,
          signature: `${hit.file}:${hit.line}:${hit.match}`,
        }),
      );
    }
  }

  // Deduplicate by id
  const byId = new Map(drafts.map((d) => [d.id, d]));
  return {
    drafts: [...byId.values()],
    redirectsChecked: redirects.redirects.length,
    importantUrlsWatched: importantWatched.size,
  };
}
