import fs from "node:fs";
import path from "node:path";

const DEFAULT_CQ_BACKLOG = path.join(
  process.cwd(),
  "docs",
  "content-quality",
  "CONTENT-IMPROVEMENT-BACKLOG.md",
);

export type CqIssueRef = {
  id: string;
  route: string;
  priority: string;
  types: string;
  summary: string;
};

function normalizeRoute(route: string): string {
  const r = route.trim();
  if (!r) return r;
  return r.endsWith("/") ? r : `${r}/`;
}

/**
 * Parse visual/media-related rows from the content-improvement backlog.
 * Lightweight MD parse — recommendations only; never mutates CQ docs.
 */
export function loadVisualCqIssuesByRoute(
  backlogPath: string = DEFAULT_CQ_BACKLOG,
): Map<string, CqIssueRef[]> {
  const byRoute = new Map<string, CqIssueRef[]>();
  if (!fs.existsSync(backlogPath)) return byRoute;

  const text = fs.readFileSync(backlogPath, "utf8");
  // e.g. CQ-IMP-149 `/compare/.../` [CQ-P2] ADD VISUAL — ...
  const re =
    /^(CQ-IMP-\d+)\s+`(\/[^`]+)`\s+\[(CQ-P[0-3])\]\s+([A-Z /]+)—\s*(.+)$/gm;

  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const types = m[4].trim();
    const isVisual =
      /VISUAL|SCREENSHOT|VIDEO|MEDIA/i.test(types) ||
      /visual|screenshot|video|diagram|media/i.test(m[5]);
    if (!isVisual) continue;

    const ref: CqIssueRef = {
      id: m[1],
      route: normalizeRoute(m[2]),
      priority: m[3],
      types,
      summary: m[5].trim().slice(0, 160),
    };
    const list = byRoute.get(ref.route) ?? [];
    list.push(ref);
    byRoute.set(ref.route, list);
  }

  // Also catch detail headers: ### CQ-IMP-001 — `/industries/saas/` (CQ-P0)
  // with Visual/media needed later in the block
  const detailRe =
    /^### (CQ-IMP-\d+)\s+[—-]\s+`(\/[^`]+)`\s+\((CQ-P[0-3])\)/gm;
  const visualNeededRe = /\*\*Visual\/media needed:\*\*\s*(.+)/i;

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    detailRe.lastIndex = 0;
    const dm = detailRe.exec(lines[i]!);
    if (!dm) continue;
    let visualLine: string | undefined;
    for (let j = i + 1; j < Math.min(i + 40, lines.length); j++) {
      if (lines[j]!.startsWith("### ")) break;
      const vm = visualNeededRe.exec(lines[j]!);
      if (vm) {
        visualLine = vm[1]!.trim();
        break;
      }
    }
    if (!visualLine) continue;
    const route = normalizeRoute(dm[2]!);
    const ref: CqIssueRef = {
      id: dm[1]!,
      route,
      priority: dm[3]!,
      types: "ADD VISUAL",
      summary: visualLine.slice(0, 160),
    };
    const list = byRoute.get(route) ?? [];
    if (!list.some((x) => x.id === ref.id)) {
      list.push(ref);
      byRoute.set(route, list);
    }
  }

  return byRoute;
}

export function formatCqLink(
  issues: CqIssueRef[] | undefined,
  fallbackIds: string[] = [],
): string | undefined {
  if (issues && issues.length > 0) {
    return issues
      .slice(0, 3)
      .map((i) => `${i.id} [${i.priority}] ${i.types.trim()}`)
      .join("; ");
  }
  if (fallbackIds.length > 0) return fallbackIds.slice(0, 3).join("; ");
  return undefined;
}
