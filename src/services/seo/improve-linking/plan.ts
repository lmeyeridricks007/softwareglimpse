import { getCategoryBySlug, getIndustries, getSoftware, getAllBestPagesUnfiltered, getAlternativesPageBySlug, getUseCases } from "@/data";
import { categorySharedToolHref } from "@/data/config/tools/category-tool-meta";
import { getGuides } from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import { identityPath, normalizePath } from "@/seo/canonical";
import {
  buildCategoryLinkPlan,
  buildComparisonLinkPlan,
  buildGuideLinkPlan,
  buildSoftwareLinkPlan,
} from "@/services/internal-linking/builders";
import { flattenPlanLinks } from "@/services/internal-linking/select";
import { injectionsToPath } from "@/services/internal-linking/link-injections";
import type { ContentLifecycleKind } from "@/services/seo/content-lifecycle";
import { assessLinkingEligibility } from "./eligibility";
import { buildKnowledgeGraph } from "@/services/seo/knowledge-graph/build-graph";
import { buildImproveInboundReports } from "@/services/seo/knowledge-graph/improve-inbound";
import { authorityScoreForPath } from "@/services/seo/knowledge-graph/authority";
import type {
  BatchPageRef,
  InboundOpportunity,
  PageLinkingPlan,
  PreferReferrerKind,
} from "./types";

const PREFER_ORDER: PreferReferrerKind[] = [
  "product",
  "category",
  "best",
  "guide",
  "comparison",
  "use-case",
  "industry",
  "research",
  "tool",
];

/** High-signal industry hubs used when seeding CRM-adjacent improve pages. */
const CORNERSTONE_INDUSTRIES = [
  "small-business",
  "saas",
  "legal-services",
  "coaching",
];

function kindFromPath(p: string): PreferReferrerKind | "other" {
  if (p.startsWith("/software/")) return "product";
  if (p.startsWith("/categories/")) return "category";
  if (p.startsWith("/best/")) return "best";
  if (p.startsWith("/guides/")) return "guide";
  if (p.startsWith("/compare/")) return "comparison";
  if (p.startsWith("/use-cases/")) return "use-case";
  if (p.startsWith("/industries/")) return "industry";
  if (p.startsWith("/research/")) return "research";
  if (p.startsWith("/tools/")) return "tool";
  return "other";
}

function preferRank(kind: PreferReferrerKind | "other"): number {
  const i = PREFER_ORDER.indexOf(kind as PreferReferrerKind);
  return i === -1 ? 99 : i;
}

function titleForPath(path: string): string {
  const slug = path.replace(/\/$/, "").split("/").pop() ?? path;
  if (path.startsWith("/software/")) {
    return getSoftware().find((s) => s.slug === slug)?.name ?? slug;
  }
  if (path.startsWith("/categories/")) {
    return getCategoryBySlug(slug)?.name ?? slug;
  }
  if (path.startsWith("/guides/")) {
    return (
      getGuides({ includeUnpublished: true }).find((g) => g.slug === slug)
        ?.title ?? slug
    );
  }
  if (path.startsWith("/industries/")) {
    return getIndustries().find((i) => i.slug === slug)?.name ?? slug;
  }
  return slug.replace(/-/g, " ");
}

function withNaturalPlans<T>(fn: () => T): T {
  const prev = process.env.SG_SKIP_LINK_INJECTIONS;
  process.env.SG_SKIP_LINK_INJECTIONS = "1";
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.SG_SKIP_LINK_INJECTIONS;
    else process.env.SG_SKIP_LINK_INJECTIONS = prev;
  }
}

function referrerAlreadyLinks(fromPath: string, toPath: string): boolean {
  const to = identityPath(toPath);
  const p = identityPath(fromPath);
  return withNaturalPlans(() => {
    try {
      if (p.startsWith("/guides/")) {
        const slug = p.replace(/^\/guides\/|\/$/g, "");
        const guide = getGuides({ includeUnpublished: true }).find(
          (g) => g.slug === slug,
        );
        if (!guide) return false;
        return flattenPlanLinks(buildGuideLinkPlan(guide)).some(
          (l) => l.href === to,
        );
      }
      if (p.startsWith("/software/")) {
        const slug = p.replace(/^\/software\/|\/$/g, "");
        const plan = buildSoftwareLinkPlan(slug);
        return Boolean(
          plan && flattenPlanLinks(plan).some((l) => l.href === to),
        );
      }
      if (p.startsWith("/categories/")) {
        const slug = p.replace(/^\/categories\/|\/$/g, "");
        const plan = buildCategoryLinkPlan(slug);
        return Boolean(
          plan && flattenPlanLinks(plan).some((l) => l.href === to),
        );
      }
      if (p.startsWith("/compare/")) {
        const slug = p.replace(/^\/compare\/|\/$/g, "");
        return flattenPlanLinks(
          buildComparisonLinkPlan({
            comparisonSlug: slug,
            title: slug,
            productSlugs: slug.split("-vs-").filter(Boolean),
          }),
        ).some((l) => l.href === to);
      }
    } catch {
      return false;
    }
    return false;
  });
}

function alreadySetForTarget(to: string): Set<string> {
  const already = new Set(
    injectionsToPath(to).map((e) => identityPath(e.fromPath)),
  );
  return already;
}

function pushOpp(
  out: InboundOpportunity[],
  already: Set<string>,
  input: Omit<InboundOpportunity, "alreadyLinked">,
): void {
  const from = identityPath(input.fromPath);
  const linked =
    already.has(from) || referrerAlreadyLinks(input.fromPath, input.toPath);
  if (linked) already.add(from);
  out.push({ ...input, fromPath: from, alreadyLinked: linked });
}

function seedCategoryAdjacent(
  out: InboundOpportunity[],
  already: Set<string>,
  to: string,
  categorySlugs: string[],
): void {
  for (const catSlug of categorySlugs.slice(0, 2)) {
    const research =
      catSlug === "crm"
        ? "/research/crm-pricing/"
        : catSlug === "sales-intelligence"
          ? null
          : null;
    if (research) {
      pushOpp(out, already, {
        fromPath: research,
        fromKind: "research",
        fromTitle: "CRM pricing research",
        toPath: to,
        reason: "Research hub → related deep-dive",
        authorityScore: 72,
      });
    }

    const finder = categorySharedToolHref(catSlug, "finder");
    if (finder) {
      pushOpp(out, already, {
        fromPath: finder,
        fromKind: "tool",
        fromTitle: `${catSlug} finder`,
        toPath: to,
        reason: "Decision tool → supporting page",
        authorityScore: 68,
      });
    }

    if (catSlug === "crm" || catSlug === "sales-intelligence") {
      for (const indSlug of CORNERSTONE_INDUSTRIES.slice(0, 3)) {
        const ind = getIndustries().find((i) => i.slug === indSlug);
        if (!ind || ind.seo.indexable !== true) continue;
        pushOpp(out, already, {
          fromPath: `/industries/${indSlug}/`,
          fromKind: "industry",
          fromTitle: ind.name,
          toPath: to,
          reason: "Industry page → contextual resource",
          authorityScore: 55,
        });
      }
    }
  }
}

function seedOpportunitiesForPage(page: BatchPageRef): InboundOpportunity[] {
  const out: InboundOpportunity[] = [];
  const to = identityPath(page.path);
  const already = alreadySetForTarget(to);

  if (page.pageType === "guide") {
    const guide = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === page.slug,
    );
    if (!guide) return out;

    for (const productSlug of guide.productSlugs.slice(0, 3)) {
      const soft = getSoftware().find((s) => s.slug === productSlug);
      if (!soft || !isEntityIndexable({ kind: "software", entity: soft })) {
        continue;
      }
      pushOpp(out, already, {
        fromPath: `/software/${productSlug}/`,
        fromKind: "product",
        fromTitle: soft.name,
        toPath: to,
        reason: `Product review → related ${guide.topicType || "guide"}`,
        authorityScore: 60,
      });
    }

    for (const catSlug of guide.categorySlugs.slice(0, 1)) {
      const cat = getCategoryBySlug(catSlug);
      if (!cat || !isEntityIndexable({ kind: "category", entity: cat })) {
        continue;
      }
      const fromPath = cat.seo.canonicalPath || `/categories/${catSlug}/`;
      pushOpp(out, already, {
        fromPath: normalizePath(fromPath),
        fromKind: "category",
        fromTitle: cat.name,
        toPath: to,
        reason: "Category hub → contextual guide",
        authorityScore: 70,
      });
      const bestPath = `/best/${catSlug}-software/`;
      pushOpp(out, already, {
        fromPath: bestPath,
        fromKind: "best",
        fromTitle: `Best ${cat.name} software`,
        toPath: to,
        reason: "Best page → supporting guide",
        authorityScore: 65,
      });
    }

    seedCategoryAdjacent(out, already, to, guide.categorySlugs);

    for (const peer of getGuides()) {
      if (peer.slug === guide.slug) continue;
      if (!isEntityIndexable({ kind: "guide", entity: peer })) continue;
      const sameCat = guide.categorySlugs.some((c) =>
        peer.categorySlugs.includes(c),
      );
      const sameProduct = guide.productSlugs.some((p) =>
        peer.productSlugs.includes(p),
      );
      if (!sameCat && !sameProduct) continue;
      if (peer.relatedGuideSlugs.includes(guide.slug)) {
        already.add(identityPath(`/guides/${peer.slug}/`));
      }
      pushOpp(out, already, {
        fromPath: `/guides/${peer.slug}/`,
        fromKind: "guide",
        fromTitle: peer.title,
        toPath: to,
        reason: sameProduct
          ? "Same-product guide cluster"
          : "Same-category guide cluster",
        authorityScore: 50,
      });
    }
  }

  if (page.pageType === "comparison") {
    const parts = page.slug.split("-vs-");
    for (const productSlug of parts.slice(0, 2)) {
      const soft = getSoftware().find((s) => s.slug === productSlug);
      if (!soft) continue;
      pushOpp(out, already, {
        fromPath: `/software/${productSlug}/`,
        fromKind: "product",
        fromTitle: soft.name,
        toPath: to,
        reason: "Product review → comparison",
        authorityScore: 58,
      });
    }
    const soft = getSoftware().find((s) => s.slug === parts[0]);
    if (soft) {
      seedCategoryAdjacent(out, already, to, [soft.primaryCategorySlug]);
    }
  }

  if (page.pageType === "software") {
    const soft = getSoftware().find((s) => s.slug === page.slug);
    if (soft) {
      const cat = getCategoryBySlug(soft.primaryCategorySlug);
      if (cat && isEntityIndexable({ kind: "category", entity: cat })) {
        pushOpp(out, already, {
          fromPath: cat.seo.canonicalPath || `/categories/${soft.primaryCategorySlug}/`,
          fromKind: "category",
          fromTitle: cat.name,
          toPath: to,
          reason: "Category hub → product review",
          authorityScore: 70,
        });
      }
      seedCategoryAdjacent(out, already, to, [soft.primaryCategorySlug]);
    }
  }

  if (page.pageType === "best") {
    const best =
      getAllBestPagesUnfiltered().find((b) => b.slug === page.slug) ?? null;
    const catSlug =
      best?.categorySlug ??
      page.slug.replace(/-software$/, "").replace(/^best-/, "");
    const cat = getCategoryBySlug(catSlug);
    if (cat && isEntityIndexable({ kind: "category", entity: cat })) {
      pushOpp(out, already, {
        fromPath: cat.seo.canonicalPath || `/categories/${catSlug}/`,
        fromKind: "category",
        fromTitle: cat.name,
        toPath: to,
        reason: "Category hub → evaluation shortlist",
        authorityScore: 78,
      });
    }
    const choose = getGuides().find(
      (g) =>
        g.categorySlugs.includes(catSlug) &&
        (g.slug.includes("how-to-choose") || g.topicType === "buying-guide") &&
        isEntityIndexable({ kind: "guide", entity: g }),
    );
    if (choose) {
      pushOpp(out, already, {
        fromPath: `/guides/${choose.slug}/`,
        fromKind: "guide",
        fromTitle: choose.title,
        toPath: to,
        reason: "Buying guide → shortlist next step",
        authorityScore: 72,
      });
    }
    for (const soft of getSoftware()
      .filter((s) => s.primaryCategorySlug === catSlug)
      .filter((s) => isEntityIndexable({ kind: "software", entity: s }))
      .slice(0, 4)) {
      pushOpp(out, already, {
        fromPath: `/software/${soft.slug}/`,
        fromKind: "product",
        fromTitle: soft.name,
        toPath: to,
        reason: "Product review → category shortlist",
        authorityScore: 58,
      });
    }
    seedCategoryAdjacent(out, already, to, [catSlug]);
  }

  if (page.pageType === "alternatives") {
    const alt = getAlternativesPageBySlug(page.slug, {
      includeUnpublished: true,
    });
    const productSlug = alt?.sourceSlug ?? page.slug;
    const soft = getSoftware().find((s) => s.slug === productSlug);
    if (soft && isEntityIndexable({ kind: "software", entity: soft })) {
      pushOpp(out, already, {
        fromPath: `/software/${productSlug}/`,
        fromKind: "product",
        fromTitle: soft.name,
        toPath: to,
        reason: "Product review → alternatives",
        authorityScore: 70,
      });
      const cat = getCategoryBySlug(soft.primaryCategorySlug);
      if (cat && isEntityIndexable({ kind: "category", entity: cat })) {
        pushOpp(out, already, {
          fromPath:
            cat.seo.canonicalPath ||
            `/categories/${soft.primaryCategorySlug}/`,
          fromKind: "category",
          fromTitle: cat.name,
          toPath: to,
          reason: "Category hub → alternatives path",
          authorityScore: 65,
        });
      }
      seedCategoryAdjacent(out, already, to, [soft.primaryCategorySlug]);
    }
  }

  if (page.pageType === "use-case") {
    const uc = getUseCases().find((u) => u.slug === page.slug);
    const catSlug = uc?.categorySlugs?.[0];
    if (catSlug) {
      const cat = getCategoryBySlug(catSlug);
      if (cat && isEntityIndexable({ kind: "category", entity: cat })) {
        pushOpp(out, already, {
          fromPath: cat.seo.canonicalPath || `/categories/${catSlug}/`,
          fromKind: "category",
          fromTitle: cat.name,
          toPath: to,
          reason: "Category hub → use-case journey",
          authorityScore: 72,
        });
      }
      const best = getAllBestPagesUnfiltered().find(
        (b) => b.categorySlug === catSlug,
      );
      if (best && isEntityIndexable({ kind: "best", entity: best })) {
        pushOpp(out, already, {
          fromPath: `/best/${best.slug}/`,
          fromKind: "best",
          fromTitle: best.title,
          toPath: to,
          reason: "Shortlist → related use case",
          authorityScore: 60,
        });
      }
      seedCategoryAdjacent(out, already, to, [catSlug]);
    }
  }

  if (page.pageType === "category") {
    seedCategoryAdjacent(out, already, to, [page.slug]);
  }

  return out;
}

function selectOpportunities(
  candidates: InboundOpportunity[],
  min = 3,
  max = 8,
): InboundOpportunity[] {
  const sorted = [...candidates].sort(
    (a, b) =>
      Number(a.alreadyLinked) - Number(b.alreadyLinked) ||
      preferRank(a.fromKind) - preferRank(b.fromKind) ||
      b.authorityScore - a.authorityScore,
  );

  const picked: InboundOpportunity[] = [];
  const seenFrom = new Set<string>();
  for (const c of sorted) {
    if (c.alreadyLinked) continue;
    const key = identityPath(c.fromPath);
    if (seenFrom.has(key)) continue;
    if (c.fromKind === "other") continue;
    seenFrom.add(key);
    picked.push(c);
    if (picked.length >= max) break;
  }

  if (picked.length < min) {
    for (const c of sorted) {
      if (picked.length >= min) break;
      const key = identityPath(c.fromPath);
      if (seenFrom.has(key)) continue;
      if (c.fromKind === "other") continue;
      seenFrom.add(key);
      picked.push(c);
    }
  }

  return picked.slice(0, max);
}

function resolveOutboundAndHub(page: BatchPageRef): {
  hubPath: string | null;
  outboundNextSteps: Array<{ href: string; label: string }>;
} {
  if (page.pageType === "guide") {
    const guide = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === page.slug,
    );
    if (!guide) return { hubPath: null, outboundNextSteps: [] };
    const plan = buildGuideLinkPlan(guide);
    const hubPath = plan.parentHub[0]?.href ?? null;
    const outboundNextSteps = [
      ...plan.recommendedNextStep.map((l) => ({
        href: l.href,
        label: l.label,
      })),
      ...(guide.nextAction
        ? [
            {
              href: guide.nextAction.contentId.includes("guide:")
                ? `/guides/${guide.nextAction.contentId.split(":").pop()}/`
                : guide.nextAction.contentId,
              label: guide.nextAction.label,
            },
          ]
        : []),
    ].slice(0, 4);
    return { hubPath, outboundNextSteps };
  }
  if (page.pageType === "comparison") {
    const plan = buildComparisonLinkPlan({
      comparisonSlug: page.slug,
      title: page.slug,
      productSlugs: page.slug.split("-vs-").filter(Boolean),
    });
    return {
      hubPath: plan.parentHub[0]?.href ?? null,
      outboundNextSteps: plan.recommendedNextStep.map((l) => ({
        href: l.href,
        label: l.label,
      })),
    };
  }
  if (page.pageType === "software") {
    const plan = buildSoftwareLinkPlan(page.slug);
    if (!plan) return { hubPath: null, outboundNextSteps: [] };
    return {
      hubPath: plan.parentHub[0]?.href ?? null,
      outboundNextSteps: plan.recommendedNextStep.map((l) => ({
        href: l.href,
        label: l.label,
      })),
    };
  }
  if (page.pageType === "category") {
    const plan = buildCategoryLinkPlan(page.slug);
    if (!plan) return { hubPath: null, outboundNextSteps: [] };
    return {
      hubPath: plan.parentHub[0]?.href ?? null,
      outboundNextSteps: plan.recommendedNextStep.map((l) => ({
        href: l.href,
        label: l.label,
      })),
    };
  }
  if (page.pageType === "best") {
    const best = getAllBestPagesUnfiltered().find((b) => b.slug === page.slug);
    const catSlug = best?.categorySlug;
    if (!catSlug) return { hubPath: null, outboundNextSteps: [] };
    const hubPath = `/categories/${catSlug}/`;
    const finder = categorySharedToolHref(catSlug, "finder");
    const steps: Array<{ href: string; label: string }> = [];
    if (finder) steps.push({ href: finder, label: "Open finder" });
    for (const soft of getSoftware()
      .filter((s) => s.primaryCategorySlug === catSlug)
      .filter((s) => isEntityIndexable({ kind: "software", entity: s }))
      .slice(0, 3)) {
      steps.push({ href: `/software/${soft.slug}/`, label: soft.name });
    }
    return { hubPath, outboundNextSteps: steps.slice(0, 4) };
  }
  if (page.pageType === "alternatives") {
    const alt = getAlternativesPageBySlug(page.slug, {
      includeUnpublished: true,
    });
    const productSlug = alt?.sourceSlug ?? page.slug;
    return {
      hubPath: `/software/${productSlug}/`,
      outboundNextSteps: [
        { href: `/software/${productSlug}/`, label: "Product review" },
        {
          href: `/software/${productSlug}/pricing/`,
          label: "Pricing",
        },
      ],
    };
  }
  if (page.pageType === "use-case") {
    const uc = getUseCases().find((u) => u.slug === page.slug);
    const catSlug = uc?.categorySlugs?.[0];
    if (!catSlug) return { hubPath: null, outboundNextSteps: [] };
    return {
      hubPath: `/categories/${catSlug}/`,
      outboundNextSteps: [
        { href: `/best/${catSlug}-software/`, label: "Category shortlist" },
      ],
    };
  }
  return { hubPath: null, outboundNextSteps: [] };
}

function pageKind(page: BatchPageRef): PageLinkingPlan["kind"] {
  if (page.pageType === "guide") return "guide";
  if (page.pageType === "comparison") return "comparison";
  if (page.pageType === "software") return "software";
  if (page.pageType === "category") return "category";
  return "other";
}

/**
 * For each eligible improve-batch page, identify 3–8 contextual
 * inbound opportunities across hubs, software, best, guides, compares,
 * use cases, industry, research, and tools.
 */
export function planBatchLinking(
  pages: BatchPageRef[],
  options: { light?: boolean; minPerPage?: number; maxPerPage?: number } = {},
): PageLinkingPlan[] {
  const light = options.light === true;
  const min = options.minPerPage ?? 3;
  const max = options.maxPerPage ?? 8;

  let byPath = new Map<
    string,
    {
      candidates: Array<{
        fromPath: string;
        fromTitle: string;
        relation: string;
        reason: string;
        alreadyLinked: boolean;
        authorityScore: number;
      }>;
    }
  >();

  if (!light) {
    const improveReports = buildImproveInboundReports(buildKnowledgeGraph(), {
      limit: 200,
      light: false,
    });
    byPath = new Map(improveReports.map((r) => [identityPath(r.path), r]));
  }

  const plans: PageLinkingPlan[] = [];

  for (const page of pages) {
    const eligibility = assessLinkingEligibility(page);
    if (!eligibility.eligible) {
      plans.push({
        path: page.path,
        slug: page.slug,
        kind: pageKind(page),
        eligibility,
        opportunities: [],
        selected: [],
        outboundNextSteps: [],
        hubPath: null,
      });
      continue;
    }

    const seeded = seedOpportunitiesForPage(page);
    const report = byPath.get(identityPath(page.path));
    const fromReport: InboundOpportunity[] = (report?.candidates ?? []).map(
      (c) => ({
        fromPath: c.fromPath,
        fromKind: kindFromPath(c.fromPath),
        fromTitle: c.fromTitle || titleForPath(c.fromPath),
        toPath: page.path,
        reason: c.reason || String(c.relation),
        alreadyLinked:
          c.alreadyLinked || referrerAlreadyLinks(c.fromPath, page.path),
        authorityScore: c.authorityScore,
      }),
    );

    const merged = [...seeded, ...fromReport];
    if (!light) {
      for (const o of merged) {
        if (o.authorityScore < 40) {
          o.authorityScore = Math.max(
            o.authorityScore,
            authorityScoreForPath(o.fromPath, null),
          );
        }
      }
    }

    const selected = selectOpportunities(merged, min, max);
    const { hubPath, outboundNextSteps } = resolveOutboundAndHub(page);

    plans.push({
      path: page.path,
      slug: page.slug,
      kind: pageKind(page) as ContentLifecycleKind | PageLinkingPlan["kind"],
      eligibility,
      opportunities: merged.slice(0, 16),
      selected,
      outboundNextSteps,
      hubPath,
    });
  }

  return plans;
}
