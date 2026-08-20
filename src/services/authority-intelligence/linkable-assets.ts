/**
 * Inventory SoftwareGlimpse pages/assets worth promoting for links & visibility.
 * Reuses tools registry + resources seed — does not invent pages.
 */

import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { resourcesSeed } from "@/data/seed/resources";
import type { LinkableAsset } from "@/domain/schemas/authority-intelligence";
import { stableLinkableAssetId } from "./stable-ids";

const GUIDE_LINKABLES: Array<{
  slug: string;
  name: string;
  why: string;
  angles: string[];
  cluster?: string;
}> = [
  {
    slug: "what-is-crm",
    name: "What is CRM?",
    why: "Foundational educational guide — natural citation target for glossaries and beginner resource lists.",
    angles: ["Definition clarity", "Buyer-education resource lists"],
    cluster: "crm",
  },
  {
    slug: "types-of-crm",
    name: "Types of CRM",
    why: "Taxonomy content that resource pages and educators often cite.",
    angles: ["CRM type taxonomy", "Educational roundups"],
    cluster: "crm",
  },
  {
    slug: "crm-glossary",
    name: "CRM Glossary",
    why: "Reference asset suited to reference / glossary link building.",
    angles: ["Reference link", "Academic / training citations"],
    cluster: "crm",
  },
  {
    slug: "how-to-choose-crm",
    name: "How to Choose a CRM",
    why: "Decision guide that pairs with tools and checklists for earned editorial mentions.",
    angles: ["Buyer journey resource pages", "Newsletter educational links"],
    cluster: "crm",
  },
  {
    slug: "crm-vs-spreadsheet",
    name: "CRM vs Spreadsheet",
    why: "Comparison framing that journalists and operators share when discussing tooling upgrades.",
    angles: ["Opinion / analysis citations", "Community discussions"],
    cluster: "crm",
  },
  {
    slug: "what-is-sales-intelligence",
    name: "What is Sales Intelligence?",
    why: "Category definition page for SI buyer education and glossary-style citations.",
    angles: ["Educational roundups", "SI resource lists"],
    cluster: "sales-intelligence",
  },
  {
    slug: "how-to-choose-sales-intelligence",
    name: "How to Choose Sales Intelligence",
    why: "Decision guide that pairs with SI Finder, scorecard, and readiness tools.",
    angles: ["Buyer journey resource pages", "Vendor-neutral how-to lists"],
    cluster: "sales-intelligence",
  },
  {
    slug: "sales-intelligence-glossary",
    name: "Sales Intelligence Glossary",
    why: "Reference glossary for enrichment, credits, and CRM sync terminology.",
    angles: ["Reference link", "Training / enablement citations"],
    cluster: "sales-intelligence",
  },
  {
    slug: "what-is-marketing-software",
    name: "What is Marketing Software?",
    why: "Category teaching page for MarTech beginner and resource lists.",
    angles: ["Educational roundups", "Marketing tool hubs"],
    cluster: "marketing",
  },
  {
    slug: "how-to-choose-marketing-software",
    name: "How to Choose Marketing Software",
    why: "Decision guide that pairs with Marketing Finder and vendor scorecard.",
    angles: ["Buyer journey resource pages", "MarTech evaluation lists"],
    cluster: "marketing",
  },
  {
    slug: "what-is-project-management-software",
    name: "What is Project Management Software?",
    why: "Category teaching page for PM software education lists.",
    angles: ["Educational roundups", "Ops resource hubs"],
    cluster: "project-management",
  },
  {
    slug: "how-to-choose-project-management-software",
    name: "How to Choose Project Management Software",
    why: "Decision guide that pairs with PM Finder and vendor scorecard.",
    angles: ["Buyer journey resource pages", "Ops evaluation lists"],
    cluster: "project-management",
  },
];

const RESEARCH_LINKABLES: Array<{
  id: string;
  path: string;
  name: string;
  why: string;
  angles: string[];
}> = [
  {
    id: "crm-comparison-research",
    path: "/compare/",
    name: "CRM comparison research",
    why: "Original side-by-side evaluation structure — citeable when journalists need vendor context.",
    angles: ["Data / comparison citation", "Journalist source"],
  },
  {
    id: "crm-methodology",
    path: "/methodology/",
    name: "SoftwareGlimpse methodology",
    why: "Transparency page that supports trust when partners or educators reference our process.",
    angles: ["Trust / methodology citation", "Partner references"],
  },
];

function toolLinkability(
  status: string,
  featured: boolean,
): LinkableAsset["linkability"] {
  if (status !== "available") return "low";
  if (featured) return "excellent";
  return "strong";
}

/**
 * Build the promoteable asset inventory from live registries.
 */
export function inventoryLinkableAssets(): LinkableAsset[] {
  const assets: LinkableAsset[] = [];

  for (const tool of TOOLS_REGISTRY) {
    if (!tool.href) continue;
    const id = stableLinkableAssetId("tool", tool.slug);
    assets.push({
      id,
      kind: "tool",
      name: tool.name,
      path: tool.href,
      cluster: tool.categorySlugs[0] ?? "cross-category",
      linkability: toolLinkability(tool.status, tool.featured),
      whyLinkable:
        tool.status === "available"
          ? `Interactive ${tool.type} tool — high utility for tool-citation, resource pages, and newsletter features.`
          : `Tool is ${tool.status}; promote only when publicly usable.`,
      promotionAngles: [
        "Tool citation on resource / roundup pages",
        "Newsletter feature",
        "Partner or vendor ecosystem mention",
      ],
      status:
        tool.status === "available"
          ? "available"
          : tool.status === "partial"
            ? "partial"
            : "planned",
    });
  }

  for (const resource of resourcesSeed) {
    const path = `/resources/${resource.slug}/`;
    assets.push({
      id: stableLinkableAssetId("resource", resource.slug),
      kind: resource.slug.includes("template")
        ? "template"
        : resource.slug.includes("scorecard")
          ? "template"
          : "resource",
      name: resource.name,
      path,
      cluster: "crm",
      linkability: "excellent",
      whyLinkable:
        "Downloadable practical artifact — strong magnet for template citation, resource pages, and practitioner communities.",
      promotionAngles: [
        "Template / checklist citation",
        "Resource-page inclusion",
        "Community share (no spam comments)",
      ],
      status: "available",
    });
  }

  for (const guide of GUIDE_LINKABLES) {
    assets.push({
      id: stableLinkableAssetId("guide", guide.slug),
      kind: guide.slug.includes("glossary") ? "glossary" : "guide",
      name: guide.name,
      path: `/guides/${guide.slug}/`,
      cluster: guide.cluster ?? "crm",
      linkability: "strong",
      whyLinkable: guide.why,
      promotionAngles: guide.angles,
      status: "available",
    });
  }

  for (const research of RESEARCH_LINKABLES) {
    assets.push({
      id: stableLinkableAssetId("research", research.id),
      kind: "research",
      name: research.name,
      path: research.path,
      cluster: "crm",
      linkability: "good",
      whyLinkable: research.why,
      promotionAngles: research.angles,
      status: "available",
    });
  }

  assets.push({
    id: stableLinkableAssetId("homepage", "home"),
    kind: "homepage",
    name: "SoftwareGlimpse homepage",
    path: "/",
    cluster: "brand",
    linkability: "low",
    whyLinkable:
      "Homepage is rarely the best link target — prefer tools, resources, and original research.",
    promotionAngles: ["Brand mention only when asset-specific deep links are unavailable"],
    status: "available",
  });

  return assets;
}

export function pickBestTargets(
  assets: LinkableAsset[],
  limit = 8,
): LinkableAsset[] {
  const rank: Record<LinkableAsset["linkability"], number> = {
    excellent: 5,
    strong: 4,
    good: 3,
    low: 1,
    none: 0,
    unknown: 2,
  };
  return [...assets]
    .filter((a) => a.kind !== "homepage" && a.status === "available")
    .sort(
      (a, b) =>
        rank[b.linkability] - rank[a.linkability] ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}
