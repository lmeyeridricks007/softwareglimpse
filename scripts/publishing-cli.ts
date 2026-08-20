#!/usr/bin/env npx tsx
/**
 * SoftwareGlimpse publishing CLI
 *
 * Usage:
 *   npm run publishing -- status
 *   npm run publishing -- status --category crm
 *   npm run publishing -- calendar --from 2026-08-01 --to 2026-09-30
 *   npm run publishing -- graph -- pipedrive
 *   npm run publishing -- publish --dry-run
 *   npm run publishing -- publish
 *   npm run publishing -- schedule -- content:compare:freshsales-vs-pipedrive --at 2026-08-20T07:00:00.000Z
 *   npm run publishing -- refresh:scan
 *   npm run publishing -- refresh:status
 *   npm run publishing -- refresh:run --dry-run
 *   npm run publishing -- validate
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
} from "@/data";
import {
  getPublishingRoot,
  getRefreshState,
  listDueSchedules,
  listVersions,
  loadSchedule,
} from "@/data/publishing/store";
import {
  ScheduleRecordSchema,
  isEntityIndexable,
  parseContentId,
  type ContentId,
  type ContentRegistryEntry,
  type ScheduleRecord,
} from "@/domain";
import { resolveAffectedPages } from "@/services/editorial/dependencies";
import { getPublicationStateForEntry } from "@/services/publishing";
import {
  approveVersion,
  buildContentRegistry,
  createDraftVersion,
  runPublishDue,
  runRefreshCandidates,
  scanRefreshCandidates,
  scheduleContent,
} from "@/services/publishing/server";

type Args = {
  command: string;
  category?: string;
  from?: string;
  to?: string;
  at?: string;
  version?: number;
  dryRun: boolean;
  positional: string[];
};

function usage(exitCode = 1): never {
  console.error(`SoftwareGlimpse publishing CLI

Commands:
  status [--category <slug>]
  calendar --from <ISO-date> --to <ISO-date>
  graph -- <product-slug>
  publish [--dry-run]
  schedule -- <contentId> --at <ISO-UTC> [--version <n>]
  refresh:scan
  refresh:status [--category <slug>]
  refresh:run [--dry-run]
  validate

Aliases (via package.json): content:status, content:calendar, content:publish,
  refresh:scan, refresh:status, refresh:run, publishing:validate
`);
  process.exit(exitCode);
}

function parseArgs(argv: string[]): Args {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    usage(0);
  }

  const command = argv[0]!;
  const rest = argv.slice(1);
  const positional: string[] = [];
  let category: string | undefined;
  let from: string | undefined;
  let to: string | undefined;
  let at: string | undefined;
  let version: number | undefined;
  let dryRun = false;

  // Allow `command -- <id> --at ...`: `--` only separates positionals;
  // flags are still parsed after it (npm-friendly).
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--") {
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--category") {
      category = rest[++i];
      continue;
    }
    if (arg.startsWith("--category=")) {
      category = arg.slice("--category=".length);
      continue;
    }
    if (arg === "--from") {
      from = rest[++i];
      continue;
    }
    if (arg.startsWith("--from=")) {
      from = arg.slice("--from=".length);
      continue;
    }
    if (arg === "--to") {
      to = rest[++i];
      continue;
    }
    if (arg.startsWith("--to=")) {
      to = arg.slice("--to=".length);
      continue;
    }
    if (arg === "--at") {
      at = rest[++i];
      continue;
    }
    if (arg.startsWith("--at=")) {
      at = arg.slice("--at=".length);
      continue;
    }
    if (arg === "--version") {
      version = Number(rest[++i]);
      continue;
    }
    if (arg.startsWith("--version=")) {
      version = Number(arg.slice("--version=".length));
      continue;
    }
    if (arg.startsWith("-")) {
      console.error(`Unknown flag: ${arg}`);
      usage();
    }
    positional.push(arg);
  }

  return { command, category, from, to, at, version, dryRun, positional };
}

function crmSoftwareSlugs(): Set<string> {
  return new Set(
    getAllSoftwareUnfiltered()
      .filter((s) => s.primaryCategorySlug === "crm")
      .map((s) => s.slug),
  );
}

function entryMatchesCategory(
  entry: ContentRegistryEntry,
  category: string,
): boolean {
  if (category !== "crm") {
    if (entry.type === "category") return entry.slug === category;
    if (entry.type === "software") {
      const software = getAllSoftwareUnfiltered().find(
        (s) => s.slug === entry.slug,
      );
      return software?.primaryCategorySlug === category;
    }
    return entry.slug.includes(category) || entry.path.includes(`/${category}/`);
  }

  const crm = crmSoftwareSlugs();
  if (entry.type === "category") {
    return entry.slug === "crm" || entry.path.includes("/crm/");
  }
  if (entry.type === "software" || entry.type === "pricing") {
    return crm.has(entry.slug);
  }
  if (entry.type === "comparison") {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === entry.slug,
    );
    return Boolean(comparison?.productSlugs.some((slug) => crm.has(slug)));
  }
  if (entry.type === "alternatives") {
    const alt = getAllAlternativesUnfiltered().find((a) => a.slug === entry.slug);
    if (!alt) return false;
    return (
      crm.has(alt.sourceSlug) ||
      alt.alternatives.some((a) => crm.has(a.targetSlug))
    );
  }
  if (entry.type === "best") {
    return entry.slug.includes("crm") || entry.path.includes("/crm");
  }
  if (entry.type === "tool") {
    return entry.slug.startsWith("crm-");
  }
  return false;
}

type StatusBucket =
  | "published"
  | "scheduled"
  | "editorial-review"
  | "research-needed"
  | "refresh-required"
  | "draft";

function classifyEntry(entry: ContentRegistryEntry): StatusBucket {
  const refresh = getRefreshState(entry.contentId);
  const status = entry.metadata.status;

  if (
    status === "refresh-needed" ||
    refresh?.refreshStatus === "refresh-required"
  ) {
    return "refresh-required";
  }
  if (status === "scheduled") return "scheduled";
  if (status === "review") return "editorial-review";
  if (status === "published" || status === "refreshing") return "published";
  if (status === "idea" || status === "researching") return "research-needed";
  if (
    (status === "draft" || status === "approved") &&
    (entry.metadata.researchStatus === "none" ||
      entry.metadata.researchStatus === undefined)
  ) {
    return "research-needed";
  }
  return "draft";
}

function printBucket(label: string, items: ContentRegistryEntry[]): void {
  console.log(`\n## ${label} (${items.length})`);
  if (items.length === 0) {
    console.log("  (none)");
    return;
  }
  for (const item of items.slice(0, 200)) {
    const refresh = getRefreshState(item.contentId);
    const extra = [
      item.metadata.status,
      item.metadata.researchStatus
        ? `research=${item.metadata.researchStatus}`
        : null,
      refresh ? `refresh=${refresh.refreshStatus}` : null,
    ]
      .filter(Boolean)
      .join(", ");
    console.log(`  - ${item.contentId}  ${item.path}  [${extra}]`);
  }
  if (items.length > 200) {
    console.log(`  … ${items.length - 200} more`);
  }
}

function cmdStatus(args: Args): void {
  let entries = buildContentRegistry({ includeUnpublishedPricing: true });
  if (args.category) {
    entries = entries.filter((e) => entryMatchesCategory(e, args.category!));
  }

  const buckets: Record<StatusBucket, ContentRegistryEntry[]> = {
    published: [],
    scheduled: [],
    "editorial-review": [],
    "research-needed": [],
    "refresh-required": [],
    draft: [],
  };

  for (const entry of entries) {
    buckets[classifyEntry(entry)].push(entry);
  }

  console.log("Content status (UTC)");
  if (args.category) console.log(`Filter: category=${args.category}`);
  console.log(`Total: ${entries.length}`);
  console.log(
    [
      `published=${buckets.published.length}`,
      `scheduled=${buckets.scheduled.length}`,
      `editorial-review=${buckets["editorial-review"].length}`,
      `research-needed=${buckets["research-needed"].length}`,
      `refresh-required=${buckets["refresh-required"].length}`,
      `draft=${buckets.draft.length}`,
    ].join("  "),
  );

  printBucket("published", buckets.published);
  printBucket("scheduled", buckets.scheduled);
  printBucket("editorial review", buckets["editorial-review"]);
  printBucket("research needed", buckets["research-needed"]);
  printBucket("refresh required", buckets["refresh-required"]);
  printBucket("draft", buckets.draft);
}

function parseUtcDayBoundary(value: string, endOfDay: boolean): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const iso = endOfDay
      ? `${value}T23:59:59.999Z`
      : `${value}T00:00:00.000Z`;
    return Date.parse(iso);
  }
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid date: ${value}`);
  }
  return ms;
}

function listAllSchedules(): ScheduleRecord[] {
  const dir = path.join(getPublishingRoot(), "schedules");
  if (!existsSync(dir)) return [];
  const out: ScheduleRecord[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(
      readFileSync(path.join(dir, file), "utf8"),
    ) as unknown;
    if (!raw || typeof raw !== "object" || "deleted" in (raw as object)) {
      continue;
    }
    out.push(ScheduleRecordSchema.parse(raw));
  }
  return out;
}

function cmdCalendar(args: Args): void {
  if (!args.from || !args.to) {
    console.error("calendar requires --from and --to (UTC dates)");
    usage();
  }
  const fromMs = parseUtcDayBoundary(args.from, false);
  const toMs = parseUtcDayBoundary(args.to, true);
  const entries = buildContentRegistry({ includeUnpublishedPricing: true });
  const byId = new Map(entries.map((e) => [String(e.contentId), e]));

  type CalItem = {
    contentId: string;
    path: string;
    kind: "scheduledAt" | "nextReviewAt";
    at: string;
  };
  const items: CalItem[] = [];

  for (const entry of entries) {
    const scheduledAt =
      entry.metadata.scheduledAt ?? loadSchedule(entry.contentId)?.scheduledAt;
    if (scheduledAt) {
      const ms = Date.parse(scheduledAt);
      if (!Number.isNaN(ms) && ms >= fromMs && ms <= toMs) {
        items.push({
          contentId: String(entry.contentId),
          path: entry.path,
          kind: "scheduledAt",
          at: scheduledAt,
        });
      }
    }
    const nextReview = entry.nextReviewAt ?? entry.metadata.nextReviewAt;
    if (nextReview) {
      const ms = Date.parse(nextReview);
      if (!Number.isNaN(ms) && ms >= fromMs && ms <= toMs) {
        items.push({
          contentId: String(entry.contentId),
          path: entry.path,
          kind: "nextReviewAt",
          at: nextReview,
        });
      }
    }
  }

  for (const schedule of listAllSchedules()) {
    const ms = Date.parse(schedule.scheduledAt);
    if (Number.isNaN(ms) || ms < fromMs || ms > toMs) continue;
    const id = String(schedule.contentId);
    if (items.some((i) => i.contentId === id && i.kind === "scheduledAt")) {
      continue;
    }
    const entry = byId.get(id);
    items.push({
      contentId: id,
      path: entry?.path ?? "(schedule only)",
      kind: "scheduledAt",
      at: schedule.scheduledAt,
    });
  }

  items.sort((a, b) => a.at.localeCompare(b.at));
  console.log(
    `Calendar UTC ${args.from} → ${args.to} (${items.length} items)`,
  );
  for (const item of items) {
    console.log(
      `  ${item.at}  ${item.kind.padEnd(13)}  ${item.contentId}  ${item.path}`,
    );
  }
  if (items.length === 0) console.log("  (none)");
}

function contentIdForAffected(page: {
  pageType: string;
  slug: string;
}): string {
  switch (page.pageType) {
    case "software-review":
      return `content:software:${page.slug}`;
    case "comparison":
      return `content:compare:${page.slug}`;
    case "pricing":
      return `content:pricing:${page.slug}`;
    case "tool":
      return `content:tool:${page.slug}`;
    case "alternatives":
      return `content:alternatives:${page.slug}`;
    case "best":
      return `content:best:${page.slug}`;
    default:
      return `content:${page.pageType}:${page.slug}`;
  }
}

function cmdGraph(args: Args): void {
  const slug = args.positional[0];
  if (!slug) {
    console.error("graph requires a product slug after --");
    usage();
  }

  const affected = resolveAffectedPages(slug);
  console.log(`Content graph for ${slug}`);
  console.log(`Affected pages: ${affected.length}`);
  for (const page of affected) {
    const contentIdHint = contentIdForAffected(page);
    let refreshNote = "";
    try {
      const refresh = getRefreshState(contentIdHint);
      if (refresh) {
        refreshNote = `  refresh=${refresh.refreshStatus} (${refresh.priority}) reasons=${refresh.reasons.join("|")}`;
      }
    } catch {
      // ignore unparsable ids
    }

    console.log(
      `  - ${contentIdHint}\n      path=${page.path}  type=${page.pageType}${refreshNote}`,
    );
  }
}

function cmdPublish(args: Args): void {
  const result = runPublishDue({
    dryRun: args.dryRun,
    actor: "publishing-cli",
  });

  const label = args.dryRun ? "Publish dry-run (due schedules)" : "Publish due";
  console.log(label);
  console.log(
    `wouldOrDid=${result.published.length}  skipped=${result.skipped.length}  failed=${result.failed.length}`,
  );

  for (const item of result.published) {
    console.log(
      `  [${item.status}] ${item.contentId} version=${item.version ?? "?"} ${item.reason ?? ""}`,
    );
  }
  for (const item of result.skipped) {
    console.log(`  [skipped] ${item.contentId} ${item.reason ?? ""}`);
  }
  for (const item of result.failed) {
    console.log(`  [failed] ${item.contentId} ${item.reason ?? ""}`);
  }

  if (
    !args.dryRun &&
    result.published.length === 0 &&
    result.failed.length === 0
  ) {
    const due = listDueSchedules();
    if (due.length === 0) {
      console.log("No due schedules in publishing store.");
    }
  }
}

function ensureApprovedVersion(
  contentId: ContentId | string,
  version?: number,
): number {
  if (version != null) {
    const existing = listVersions(contentId).find((v) => v.version === version);
    if (!existing) {
      throw new Error(`Version ${version} not found for ${contentId}`);
    }
    if (existing.status === "draft") {
      approveVersion(contentId, version, "publishing-cli");
    }
    return version;
  }

  const versions = listVersions(contentId);
  const approved = [...versions]
    .reverse()
    .find((v) => v.status === "approved");
  if (approved) return approved.version;

  const draft = [...versions].reverse().find((v) => v.status === "draft");
  if (draft) {
    approveVersion(contentId, draft.version, "publishing-cli");
    return draft.version;
  }

  const created = createDraftVersion({
    contentId,
    generator: "publishing-cli",
    summary: { note: "CLI schedule stub — fixture/ops store only" },
  });
  approveVersion(contentId, created.version, "publishing-cli");
  return created.version;
}

function cmdSchedule(args: Args): void {
  const contentIdRaw = args.positional[0];
  if (!contentIdRaw || !args.at) {
    console.error("schedule requires -- <contentId> and --at <ISO-UTC>");
    usage();
  }
  if (!args.at.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(args.at)) {
    console.error("scheduledAt must be UTC ISO (prefer Z suffix)");
    process.exit(1);
  }

  const parsed = parseContentId(contentIdRaw);
  const version = ensureApprovedVersion(parsed.contentId, args.version);
  const record = scheduleContent({
    contentId: parsed.contentId,
    scheduledAt: new Date(args.at).toISOString(),
    version,
    actor: "publishing-cli",
  });

  console.log("Scheduled (publishing store only — live seeds unchanged)");
  console.log(`  contentId: ${record.contentId}`);
  console.log(`  scheduledAt: ${record.scheduledAt}`);
  console.log(`  approvedVersion: ${record.approvedVersion}`);
}

function cmdRefreshScan(): void {
  const entries = buildContentRegistry({ includeUnpublishedPricing: true });
  const result = scanRefreshCandidates({ entries });
  console.log("Refresh scan");
  console.log(
    `candidates=${result.candidates.length}  fromEvents=${result.fromChangeEvents}  fromReview=${result.fromStaleReview}  fromResearch=${result.fromResearch}`,
  );
  for (const candidate of result.candidates) {
    console.log(
      `  - ${candidate.contentId}  [${candidate.priority}/${candidate.refreshStatus}]  ${candidate.reasons.join("; ")}`,
    );
  }
  if (result.candidates.length === 0) console.log("  (none)");
}

function cmdRefreshStatus(args: Args): void {
  let entries = buildContentRegistry({ includeUnpublishedPricing: true });
  if (args.category) {
    entries = entries.filter((e) => entryMatchesCategory(e, args.category!));
  }

  console.log("Refresh status");
  let count = 0;
  for (const entry of entries) {
    const refresh = getRefreshState(entry.contentId);
    if (!refresh) continue;
    count += 1;
    console.log(
      `  - ${entry.contentId}  ${refresh.refreshStatus}  priority=${refresh.priority}  ${refresh.reasons.join("; ")}`,
    );
  }
  if (count === 0) console.log("  (none stored)");
}

function cmdRefreshRun(args: Args): void {
  const entries = buildContentRegistry({ includeUnpublishedPricing: true });
  const scan = scanRefreshCandidates({ entries });
  const result = runRefreshCandidates({
    candidates: scan.candidates,
    dryRun: args.dryRun,
    actor: "publishing-cli",
  });

  console.log(
    args.dryRun
      ? "Refresh run dry-run (no jobs/drafts written)"
      : "Refresh run (jobs + draft stubs; no auto-publish)",
  );
  console.log(
    `results=${result.results.length}  queued=${result.queued}  drafts=${result.draftsCreated}  skipped=${result.skipped}`,
  );
  for (const item of result.results) {
    console.log(
      `  [${item.status}] ${item.contentId}${item.jobId ? ` job=${item.jobId}` : ""}${item.draftVersion != null ? ` draft=v${item.draftVersion}` : ""}${item.reason ? ` ${item.reason}` : ""}`,
    );
  }
}

type ValidationIssue = {
  code: string;
  contentId?: string;
  detail: string;
};

function checkPublishedQuality(
  entry: ContentRegistryEntry,
): ValidationIssue | null {
  if (entry.type === "software") {
    const software = getAllSoftwareUnfiltered().find((s) => s.slug === entry.slug);
    if (
      software &&
      software.seo.indexable &&
      !isEntityIndexable({ kind: "software", entity: software })
    ) {
      return {
        code: "published-failing-quality-gate",
        contentId: String(entry.contentId),
        detail: "published + seo.indexable but isEntityIndexable=false",
      };
    }
  }
  if (entry.type === "comparison") {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === entry.slug,
    );
    if (
      comparison &&
      (comparison.metadata.status === "published" ||
        comparison.metadata.status === "refresh-needed") &&
      comparison.seo.indexable &&
      !isEntityIndexable({ kind: "comparison", entity: comparison })
    ) {
      return {
        code: "published-failing-quality-gate",
        contentId: String(entry.contentId),
        detail: "published + seo.indexable but isEntityIndexable=false",
      };
    }
  }
  if (entry.type === "alternatives") {
    const page = getAllAlternativesUnfiltered().find((a) => a.slug === entry.slug);
    if (
      page &&
      (page.metadata.status === "published" ||
        page.metadata.status === "refresh-needed") &&
      page.seo.indexable &&
      !isEntityIndexable({ kind: "alternatives", entity: page })
    ) {
      return {
        code: "published-failing-quality-gate",
        contentId: String(entry.contentId),
        detail: "published + seo.indexable but isEntityIndexable=false",
      };
    }
  }
  if (entry.type === "best") {
    const page = getAllBestPagesUnfiltered().find((b) => b.slug === entry.slug);
    if (
      page &&
      (page.metadata.status === "published" ||
        page.metadata.status === "refresh-needed") &&
      page.seo.indexable &&
      !isEntityIndexable({ kind: "best", entity: page })
    ) {
      return {
        code: "published-failing-quality-gate",
        contentId: String(entry.contentId),
        detail: "published + seo.indexable but isEntityIndexable=false",
      };
    }
  }
  return null;
}

function cmdValidate(): void {
  const entries = buildContentRegistry({ includeUnpublishedPricing: true });
  const issues: ValidationIssue[] = [];
  const now = new Date();
  const seenIds = new Map<string, number>();

  for (const entry of entries) {
    const id = String(entry.contentId);
    seenIds.set(id, (seenIds.get(id) ?? 0) + 1);

    const state = getPublicationStateForEntry(entry, now);

    if (entry.metadata.status === "scheduled") {
      const schedule = loadSchedule(entry.contentId);
      const versions = listVersions(entry.contentId);
      const hasApproved =
        Boolean(schedule?.approvedVersion) ||
        versions.some(
          (v) => v.status === "approved" || v.status === "published",
        );
      if (!hasApproved && !schedule) {
        issues.push({
          code: "scheduled-without-approval",
          contentId: id,
          detail: "status=scheduled but no approved version/schedule record",
        });
      }
    }

    if (
      entry.metadata.status === "scheduled" &&
      entry.metadata.scheduledAt &&
      Date.parse(entry.metadata.scheduledAt) <= now.getTime()
    ) {
      issues.push({
        code: "scheduled-at-past-unpublished",
        contentId: id,
        detail: `scheduledAt ${entry.metadata.scheduledAt} is past and status is still scheduled`,
      });
    }

    if (
      entry.metadata.status === "published" ||
      entry.metadata.status === "refresh-needed"
    ) {
      const entityIssue = checkPublishedQuality(entry);
      if (entityIssue) issues.push(entityIssue);
    }

    if (
      (entry.metadata.status === "draft" ||
        entry.metadata.status === "review" ||
        entry.metadata.status === "approved") &&
      state.isIndexable
    ) {
      issues.push({
        code: "draft-in-sitemap",
        contentId: id,
        detail: "non-published status resolved as indexable",
      });
    }
  }

  for (const [id, count] of seenIds) {
    if (count > 1) {
      issues.push({
        code: "duplicate-content-id",
        contentId: id,
        detail: `appears ${count} times in registry`,
      });
    }
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    for (const slug of comparison.productSlugs) {
      const software = getAllSoftwareUnfiltered().find((s) => s.slug === slug);
      if (!software) {
        issues.push({
          code: "broken-dep",
          contentId: `content:compare:${comparison.slug}`,
          detail: `missing product ${slug}`,
        });
      }
    }
  }

  for (const schedule of listAllSchedules()) {
    const due = Date.parse(schedule.scheduledAt) <= now.getTime();
    if (!due) continue;
    const versions = listVersions(schedule.contentId);
    const live = versions.find(
      (v) =>
        v.version === schedule.approvedVersion && v.status === "published",
    );
    if (!live) {
      issues.push({
        code: "scheduled-at-past-unpublished",
        contentId: String(schedule.contentId),
        detail: `store schedule ${schedule.scheduledAt} due but version ${schedule.approvedVersion} not published`,
      });
    }
  }

  console.log(`Publishing validate — ${issues.length} issue(s)`);
  for (const issue of issues) {
    console.log(
      `  [${issue.code}] ${issue.contentId ?? "-"}  ${issue.detail}`,
    );
  }
  if (issues.length > 0) process.exitCode = 1;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case "status":
      cmdStatus(args);
      break;
    case "calendar":
      cmdCalendar(args);
      break;
    case "graph":
      cmdGraph(args);
      break;
    case "publish":
      cmdPublish(args);
      break;
    case "schedule":
      cmdSchedule(args);
      break;
    case "refresh:scan":
    case "scan":
      cmdRefreshScan();
      break;
    case "refresh:status":
      cmdRefreshStatus(args);
      break;
    case "refresh:run":
      cmdRefreshRun(args);
      break;
    case "validate":
      cmdValidate();
      break;
    default:
      console.error(`Unknown command: ${args.command}`);
      usage();
  }
}

main();
