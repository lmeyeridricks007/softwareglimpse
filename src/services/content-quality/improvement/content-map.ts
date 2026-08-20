import fs from "node:fs";
import path from "node:path";
import type { ContentMapNode } from "./types";

const DEFAULT_MAP = path.join(
  process.cwd(),
  "docs",
  "content-ecosystem",
  "04-crm-master-content-map.md",
);

function normalizeRoute(raw: string): string | null {
  const cleaned = raw.replace(/`/g, "").trim();
  if (!cleaned || cleaned === "—" || cleaned === "-" || cleaned === "same") {
    return null;
  }
  if (!cleaned.startsWith("/")) return null;
  return cleaned.endsWith("/") ? cleaned : `${cleaned}/`;
}

/**
 * Parse CRM master content map register rows into route-keyed nodes.
 */
export function loadContentMapNodes(
  mapPath: string = DEFAULT_MAP,
): Map<string, ContentMapNode> {
  const text = fs.readFileSync(mapPath, "utf8");
  const byRoute = new Map<string, ContentMapNode>();

  for (const line of text.split("\n")) {
    if (!line.startsWith("| CRM-")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 18) continue;
    const [
      id,
      status,
      priority,
      ,
      cluster,
      subcluster,
      ,
      title,
      currentRoute,
      targetRoute,
      ,
      ,
      ,
      nextStep,
      ,
      ,
      tool,
      resource,
      ,
      researchState,
    ] = cells;

    if (!/^P[0-3]$/.test(priority)) continue;
    const route =
      normalizeRoute(currentRoute) ?? normalizeRoute(targetRoute);
    if (!route) continue;

    const node: ContentMapNode = {
      id,
      priority: priority as ContentMapNode["priority"],
      cluster,
      subcluster,
      title,
      route,
      researchState: researchState ?? "",
      tool: tool && tool !== "—" ? tool : "",
      resource: resource && resource !== "—" ? resource : "",
      nextStep: nextStep && nextStep !== "—" ? nextStep : "",
      status: status ?? "",
    };

    // Prefer higher map priority if duplicate routes appear
    const existing = byRoute.get(route);
    if (
      !existing ||
      Number(node.priority.slice(1)) < Number(existing.priority.slice(1))
    ) {
      byRoute.set(route, node);
    }
  }

  return byRoute;
}

export function findMapNode(
  byRoute: Map<string, ContentMapNode>,
  route: string,
): ContentMapNode | undefined {
  const normalized = route.endsWith("/") ? route : `${route}/`;
  return byRoute.get(normalized) ?? byRoute.get(route);
}
