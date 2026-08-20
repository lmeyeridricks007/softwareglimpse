import fs from "node:fs";
import path from "node:path";
import type { GapPriority } from "./types";

const DEFAULT_MAP = path.join(
  process.cwd(),
  "docs",
  "content-ecosystem",
  "04-crm-master-content-map.md",
);

export type MapRegisterRow = {
  id: string;
  statusRaw: string;
  priority: GapPriority;
  cluster: string;
  subcluster: string;
  pageType: string;
  title: string;
  currentRoute: string | null;
  targetRoute: string | null;
  parent: string;
  supports: string;
  nextStep: string;
  intent: string;
  tool: string;
  resource: string;
  evidenceRequirement: string;
  researchState: string;
  notes: string;
};

function cell(cells: string[], i: number): string {
  return (cells[i] ?? "").trim();
}

function normalizeRoute(raw: string): string | null {
  const cleaned = raw.replace(/`/g, "").trim();
  if (!cleaned || cleaned === "—" || cleaned === "-" || cleaned === "same") {
    return null;
  }
  // Skip template placeholders
  if (cleaned.includes("{") || cleaned.includes("[slug]")) return cleaned.startsWith("/")
    ? cleaned
    : null;
  if (!cleaned.startsWith("/")) return null;
  return cleaned.endsWith("/") ? cleaned : `${cleaned}/`;
}

export function loadMapRegister(
  mapPath: string = DEFAULT_MAP,
): MapRegisterRow[] {
  const text = fs.readFileSync(mapPath, "utf8");
  const rows: MapRegisterRow[] = [];

  for (const line of text.split("\n")) {
    if (!line.startsWith("| CRM-")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 18) continue;
    const priority = cell(cells, 2);
    if (!/^P[0-3]$/.test(priority)) continue;

    rows.push({
      id: cell(cells, 0),
      statusRaw: cell(cells, 1),
      priority: priority as GapPriority,
      cluster: cell(cells, 4),
      subcluster: cell(cells, 5),
      pageType: cell(cells, 6),
      title: cell(cells, 7),
      currentRoute: normalizeRoute(cell(cells, 8)),
      targetRoute: normalizeRoute(cell(cells, 9)),
      parent: cell(cells, 10),
      supports: cell(cells, 11),
      nextStep: cell(cells, 13),
      intent: cell(cells, 14),
      tool: cell(cells, 16),
      resource: cell(cells, 17),
      evidenceRequirement: cell(cells, 18),
      researchState: cell(cells, 19),
      notes: cell(cells, 22) || cell(cells, cells.length - 1),
    });
  }

  return rows;
}

export function resolveRowRoute(row: MapRegisterRow): string | null {
  return row.currentRoute ?? row.targetRoute;
}

export function isMissingStatus(status: string): boolean {
  return /NOT-YET-IMPLEMENTED|MISSING|not-started/i.test(status);
}

export function isThinOrResearch(status: string, research: string): boolean {
  return (
    /EXISTING-BUT-THIN|PARTIAL|research-required|NOT-YET-RESEARCHED/i.test(
      status + " " + research,
    ) || /🔬/.test(status)
  );
}

export function isOptionalStatus(status: string): boolean {
  return /OPTIONAL|optional/i.test(status);
}

export function isExistingStatus(status: string): boolean {
  return (
    (/EXISTING|LIVE|approved|shipped/i.test(status) &&
      !/EXISTING-BUT-THIN|PARTIAL/i.test(status)) ||
    /✅|🟢/.test(status)
  );
}
