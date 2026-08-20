/**
 * Priority assets for promotion — tools, key resources, guides.
 * Does not invent pages; uses registries + curated high-value set.
 */

import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { resourcesSeed } from "@/data/seed/resources";
import type { PriorityAsset } from "./types";

const PRIORITY_RESOURCE_SLUGS = new Set([
  "crm-evaluation-checklist",
  "crm-vendor-scorecard",
  "crm-requirements-template",
  "crm-implementation-checklist",
  "crm-migration-checklist",
  "crm-rfp-template",
  "crm-demo-checklist",
  "crm-comparison-worksheet",
]);

const LAUNCH_TOOL_SLUGS = new Set([
  "crm-finder",
  "crm-cost-calculator",
  "crm-requirements-builder",
  "crm-vendor-scorecard",
  "crm-migration-planner",
]);

export function buildPriorityAssets(): PriorityAsset[] {
  const assets: PriorityAsset[] = [];

  for (const tool of TOOLS_REGISTRY) {
    if (!tool.href || tool.status !== "available") continue;
    const isLaunch = LAUNCH_TOOL_SLUGS.has(tool.slug);
    const isFeatured = tool.featured;
    if (!isLaunch && !isFeatured) continue;

    assets.push({
      id: `tool:${tool.slug}`,
      name: tool.name,
      path: tool.href,
      kind: "tool",
      priorityTier: isLaunch ? "P0" : "P1",
      whyPriority: isLaunch
        ? "Major interactive tool — deserves dedicated launch/distribution plan."
        : "Featured available tool for ongoing promotion.",
      audienceHints: [
        "CRM buyers",
        "RevOps",
        "sales leaders",
        "consultants advising clients",
      ],
      inputSignals: [
        "tools registry",
        "content map (CRM tools cluster)",
      ],
    });
  }

  for (const res of resourcesSeed) {
    if (!PRIORITY_RESOURCE_SLUGS.has(res.slug)) continue;
    const isEval = res.slug === "crm-evaluation-checklist";
    assets.push({
      id: `resource:${res.slug}`,
      name: res.name,
      path: `/resources/${res.slug}/`,
      kind: "resource",
      priorityTier: isEval ? "P0" : "P1",
      whyPriority: isEval
        ? "Flagship downloadable — high channel fit for RevOps/sales/consultant audiences."
        : "High-utility CRM buyer/implementer resource from published seed.",
      audienceHints: ["CRM buyers", "RevOps", "implementation consultants", "SMB founders"],
      inputSignals: ["resources seed", "content map resources"],
    });
  }

  // Curated guides (exist in linkable inventory)
  const guides: Array<Omit<PriorityAsset, "id">> = [
    {
      name: "How to Choose a CRM",
      path: "/guides/how-to-choose-crm/",
      kind: "guide",
      priorityTier: "P1",
      whyPriority: "Decision guide pairs with Finder + Evaluation Checklist for educational promotion.",
      audienceHints: ["first-time CRM buyers", "founders", "SMB"],
      inputSignals: ["content map guides", "linkable assets"],
    },
    {
      name: "CRM vs Spreadsheet",
      path: "/guides/crm-vs-spreadsheet/",
      kind: "guide",
      priorityTier: "P2",
      whyPriority: "Opinion/analysis angle for founder communities and LinkedIn.",
      audienceHints: ["founders", "small sales teams"],
      inputSignals: ["content map guides"],
    },
  ];

  for (const g of guides) {
    assets.push({ ...g, id: `guide:${g.path}` });
  }

  return assets;
}

export const MAJOR_LAUNCH_TOOLS = [
  "crm-finder",
  "crm-cost-calculator",
  "crm-requirements-builder",
  "crm-vendor-scorecard",
  "crm-migration-planner",
] as const;
