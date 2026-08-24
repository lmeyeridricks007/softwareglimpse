import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildContentRegistry } from "@/services/publishing/registry";
import { getPublicationStateForEntry } from "@/services/publishing/resolver";
import { validatePublicationDependencies } from "./dependency-validation";

export type LaunchManifestEntry = {
  contentId: string;
  type: string;
  title: string;
  path: string;
  status: string;
  scheduledAt?: string;
  quality: "READY" | "READY_WITH_WARNINGS" | "BLOCKED";
  warnings: string[];
};

export type ContentLaunch = {
  id: string;
  name: string;
  publicationDate?: string;
  timezone?: string;
  contentIds: string[];
  status: "draft" | "scheduled" | "published";
};

const DOCS_ROOT = path.join(process.cwd(), "docs/publishing");

export function listScheduledRegistryEntries(now = new Date()) {
  return buildContentRegistry().filter((entry) => {
    const state = getPublicationStateForEntry(entry, now);
    return entry.metadata.status === "scheduled" || state.isScheduled;
  });
}

export function writeScheduledContentReport(
  outputPath = path.join(DOCS_ROOT, "SCHEDULED-CONTENT-LATEST.md"),
): string {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  const now = new Date();
  const scheduled = listScheduledRegistryEntries(now).sort((a, b) => {
    const aTs = Date.parse(a.metadata.scheduledAt ?? "") || Infinity;
    const bTs = Date.parse(b.metadata.scheduledAt ?? "") || Infinity;
    return aTs - bTs;
  });
  const deps = validatePublicationDependencies(now);

  const lines: string[] = [
    "# Scheduled content",
    "",
    `Generated: ${now.toISOString()}`,
    "",
    "## Next 7 days",
    "",
  ];

  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const soon = scheduled.filter((entry) => {
    const ts = Date.parse(entry.metadata.scheduledAt ?? "");
    return !Number.isNaN(ts) && ts <= now.getTime() + weekMs;
  });

  if (!soon.length) {
    lines.push("_No scheduled content in the next 7 days._", "");
  } else {
    for (const entry of soon) {
      lines.push(
        `### ${entry.title}`,
        "",
        `- Route: \`${entry.path}\``,
        `- Type: ${entry.type}`,
        `- Status: ${entry.metadata.status}`,
        `- Publish: ${entry.metadata.scheduledAt ?? "—"}`,
        `- Content ID: \`${entry.contentId}\``,
        "",
      );
    }
  }

  lines.push("## Later", "");
  const later = scheduled.filter((e) => !soon.includes(e));
  if (!later.length) {
    lines.push("_None._", "");
  } else {
    for (const entry of later) {
      lines.push(
        `- **${entry.metadata.scheduledAt?.slice(0, 10) ?? "TBD"}** · ${entry.title} · \`${entry.path}\``,
      );
    }
    lines.push("");
  }

  if (deps.length) {
    lines.push("## Dependency issues", "");
    for (const issue of deps) {
      lines.push(`- **BLOCKED** ${issue.sourceId}: ${issue.message}`);
    }
    lines.push("");
  }

  const body = lines.join("\n");
  writeFileSync(outputPath, body, "utf8");
  return outputPath;
}

export function writeContentCalendar(
  outputPath = path.join(DOCS_ROOT, "CONTENT-CALENDAR-LATEST.md"),
): string {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  const now = new Date();
  const registry = buildContentRegistry();
  const scheduled = registry
    .filter((e) => e.metadata.status === "scheduled")
    .sort((a, b) => {
      const aTs = Date.parse(a.metadata.scheduledAt ?? "") || Infinity;
      const bTs = Date.parse(b.metadata.scheduledAt ?? "") || Infinity;
      return aTs - bTs;
    });

  const lines = [
    "# Content calendar",
    "",
    `Generated: ${now.toISOString()}`,
    "",
    "## Scheduled",
    "",
    ...scheduled.map(
      (e) =>
        `- ${e.metadata.scheduledAt ?? "TBD"} · ${e.type} · [${e.title}](${e.path})`,
    ),
    "",
    "## Draft",
    "",
    ...registry
      .filter((e) => e.metadata.status === "draft")
      .map((e) => `- ${e.type} · ${e.title} · \`${e.path}\``),
    "",
  ];

  const body = lines.join("\n");
  writeFileSync(outputPath, body, "utf8");
  return outputPath;
}

export function writeLaunchManifest(
  launch: ContentLaunch,
  entries: LaunchManifestEntry[],
  outputPath?: string,
): string {
  const slug = launch.id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const file =
    outputPath ??
    path.join(DOCS_ROOT, "launches", `${slug}-launch.md`);
  mkdirSync(path.dirname(file), { recursive: true });

  const lines = [
    `# ${launch.name} Launch`,
    "",
    `Status: ${launch.status.toUpperCase()}`,
    "",
    launch.publicationDate
      ? `Publication: ${launch.publicationDate}${launch.timezone ? ` ${launch.timezone}` : ""}`
      : "Publication: not scheduled",
    "",
    "## Content",
    "",
    ...entries.map(
      (e) =>
        `### ${e.title}\n\n- ${e.quality}\n- \`${e.path}\`\n- ${e.status}${e.scheduledAt ? ` · ${e.scheduledAt}` : ""}${e.warnings.length ? `\n- Warnings: ${e.warnings.join("; ")}` : ""}\n`,
    ),
  ];

  writeFileSync(file, lines.join("\n"), "utf8");
  return file;
}
