export type CrmHubLink = {
  href: string;
  label: string;
  description?: string;
  kind: "tool" | "guide" | "hub" | "commercial";
};

export type CrmHubLinkContext = {
  /** Prefill industry on Requirements Builder when set. */
  industrySlug?: string;
  /** Soft-focus Finder query fragment when set (unused today; reserved). */
  useCaseSlug?: string;
  /** Omit links that point at the current hub surface. */
  excludeHrefs?: string[];
};

/**
 * Canonical CRM buyer-journey links for audience / industry / use-case hubs.
 * Keep lists short (tools ≤4, guides ≤3, hubs ≤4) per linking architecture.
 */
export function buildCrmHubDecisionLinks(
  context: CrmHubLinkContext = {},
): {
  tools: CrmHubLink[];
  guides: CrmHubLink[];
  hubs: CrmHubLink[];
} {
  const exclude = new Set(context.excludeHrefs ?? []);
  const requirementsHref = context.industrySlug
    ? `/tools/crm-requirements-builder/?industry=${encodeURIComponent(context.industrySlug)}&start=1`
    : "/tools/crm-requirements-builder/?start=1";

  const tools: CrmHubLink[] = (
    [
      {
        href: "/tools/crm-finder/",
        label: "CRM Software Finder",
        description: "Fit-based shortlist from your answers — not affiliate status.",
        kind: "tool" as const,
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Estimate seats, tiers, and add-ons from verified list prices.",
        kind: "tool" as const,
      },
      {
        href: requirementsHref,
        label: "Requirements Builder",
        description: "Turn must-haves into a structured evaluation checklist.",
        kind: "tool" as const,
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score shortlisted products on the criteria that matter.",
        kind: "tool" as const,
      },
    ] satisfies CrmHubLink[]
  ).filter((l) => !exclude.has(l.href.split("?")[0]!));

  const guides: CrmHubLink[] = (
    [
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Decision framework before you shortlist vendors.",
        kind: "guide" as const,
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Plain-language foundation for non-experts.",
        kind: "guide" as const,
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Define must-haves before demos and trials.",
        kind: "guide" as const,
      },
    ] satisfies CrmHubLink[]
  ).filter((l) => !exclude.has(l.href));

  const hubs: CrmHubLink[] = (
    [
      {
        href: "/best/crm-software/",
        label: "Best CRM Software",
        description: "Recommended shortlists and evaluation approach.",
        kind: "commercial" as const,
      },
      {
        href: "/categories/crm/",
        label: "CRM Software hub",
        description: "Category overview, products, and pricing teaser.",
        kind: "hub" as const,
      },
      {
        href: "/capabilities/",
        label: "CRM capabilities",
        description: "Evaluate what CRM software must do — contact, pipeline, automation, and more.",
        kind: "hub" as const,
      },
      {
        href: "/features/",
        label: "CRM features",
        description: "Compare concrete features — pipelines, email sync, SSO, forecasting, and more.",
        kind: "hub" as const,
      },
      {
        href: "/use-cases/",
        label: "CRM use cases",
        description: "Explore by workflow — pipeline, leads, forecasting, and more.",
        kind: "hub" as const,
      },
      {
        href: "/resources/",
        label: "CRM resources",
        description: "Downloadable checklists, templates, and worksheets.",
        kind: "hub" as const,
      },
      {
        href: "/requirements/",
        label: "CRM requirements",
        description:
          "Buyer needs mapped to acceptance criteria, features, and product fit.",
        kind: "hub" as const,
      },
      {
        href: "/industries/",
        label: "CRM by industry",
        description: "Vertical buying context for financial services, SaaS, and more.",
        kind: "hub" as const,
      },
      {
        href: "/for/",
        label: "CRM by business type",
        description: "Fit by team shape — small business, startups, enterprise.",
        kind: "hub" as const,
      },
      {
        href: "/compare/",
        label: "Compare CRM software",
        description: "Side-by-side product comparisons.",
        kind: "hub" as const,
      },
    ] satisfies CrmHubLink[]
  ).filter((l) => !exclude.has(l.href));

  return { tools, guides, hubs };
}

/** Flat sidebar/resource list used by hub sidebars. */
export function buildCrmHubResourceLinks(
  context: CrmHubLinkContext = {},
): Array<{ href: string; label: string }> {
  const { tools, guides, hubs } = buildCrmHubDecisionLinks(context);
  const picked = [
    ...tools.slice(0, 3),
    hubs.find((h) => h.href === "/best/crm-software/"),
    hubs.find((h) => h.href === "/categories/crm/"),
    guides[0],
    hubs.find((h) => h.href === "/resources/"),
    hubs.find((h) => h.href === "/capabilities/"),
    hubs.find((h) => h.href === "/features/"),
    hubs.find((h) => h.href === "/use-cases/"),
    hubs.find((h) => h.href === "/industries/"),
    hubs.find((h) => h.href === "/for/"),
  ].filter(Boolean) as CrmHubLink[];

  const seen = new Set<string>();
  return picked
    .filter((l) => {
      const key = l.href.split("?")[0]!;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((l) => ({ href: l.href, label: l.label }));
}
