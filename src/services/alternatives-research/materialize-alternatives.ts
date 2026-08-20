import type { z } from "zod";
import { AlternativesPageSchema } from "@/domain";
import type { ProductEditorialAssessment } from "@/domain";
import { loadAssessment } from "@/data/editorial/store";
import {
  catalogueSubstituteSlugs,
  type EcosystemProduct,
} from "@/data/seed/ecosystem-shells";

type AltInput = z.input<typeof AlternativesPageSchema>;
type AltEntry = NonNullable<AltInput["alternatives"]>[number];

const PUBLISHED_AT = "2026-08-18T16:00:00.000Z";
const MAX_TARGETS = 8;
const SEO_TITLE_MAX = 70;
const SEO_DESC_MAX = 160;

const assessmentCache = new Map<string, ProductEditorialAssessment | null>();

function assessmentFor(slug: string): ProductEditorialAssessment | null {
  if (!assessmentCache.has(slug)) {
    assessmentCache.set(slug, loadAssessment(slug));
  }
  return assessmentCache.get(slug) ?? null;
}

function displayName(product: EcosystemProduct): string {
  const name = product.name?.trim();
  return name && name.length > 0 ? name : product.slug;
}

function clause(value: string | undefined): string | undefined {
  const text = value?.trim().replace(/\.+$/, "");
  return text && text.length > 0 ? text : undefined;
}

function firstTwo(values: string[] | undefined): string[] {
  return (values ?? []).map((item) => item.trim()).filter(Boolean).slice(0, 2);
}

function seoTitle(name: string): string {
  const title = `${name} alternatives`;
  if (title.length <= SEO_TITLE_MAX) return title;
  return `${name.slice(0, Math.max(8, SEO_TITLE_MAX - 14)).trim()} alternatives`;
}

function seoDescription(name: string, targets: string[]): string {
  const listed = targets.slice(0, 3).join(", ");
  const raw = listed
    ? `Compare ${name} with ${listed}. Substitutes from approved assessments — not a ranked best-of list.`
    : `Catalogue substitutes for ${name} from approved assessments — not a ranked best-of list.`;
  if (raw.length <= SEO_DESC_MAX) return raw;
  return `Approved substitutes for ${name}. Not a ranked best-of list.`.slice(
    0,
    SEO_DESC_MAX,
  );
}

function overlappingUseCases(
  source: EcosystemProduct,
  target: EcosystemProduct,
): string[] {
  const wanted = new Set(source.useCaseSlugs ?? []);
  return (target.useCaseSlugs ?? []).filter((slug) => wanted.has(slug)).slice(0, 4);
}

function approvedAssessment(slug: string): ProductEditorialAssessment | null {
  const assessment = assessmentFor(slug);
  if (!assessment || assessment.status !== "approved") return null;
  if (!clause(assessment.bestFor[0])) return null;
  return assessment;
}

function buildEntry(
  source: EcosystemProduct,
  target: EcosystemProduct,
  sourceAssessment: ProductEditorialAssessment,
  targetAssessment: ProductEditorialAssessment,
): AltEntry | null {
  const sourceName = displayName(source);
  const targetName = displayName(target);
  const betterWhen = firstTwo(targetAssessment.bestFor);
  if (betterWhen.length === 0) return null;

  const worseFromTarget = firstTwo(targetAssessment.notIdealFor);
  const worseWhen =
    worseFromTarget.length > 0
      ? worseFromTarget
      : firstTwo(sourceAssessment.bestFor).map(
          (item) => `${sourceName} is the better fit when ${clause(item)}`,
        );
  if (worseWhen.length === 0) return null;

  const sourceStay = clause(sourceAssessment.bestFor[0]);
  const targetFit = clause(betterWhen[0]);
  if (!sourceStay || !targetFit) return null;

  const sourceTradeoff = clause(sourceAssessment.tradeoffs[0]);
  const targetTradeoff = clause(targetAssessment.tradeoffs[0]);
  const keyTradeoff =
    sourceTradeoff &&
    targetTradeoff &&
    sourceTradeoff.toLowerCase() !== targetTradeoff.toLowerCase()
      ? `${targetTradeoff} vs ${sourceTradeoff}.`
      : `${targetName} fits ${targetFit}; ${sourceName} fits ${sourceStay}.`;

  return {
    targetSlug: target.slug,
    reason: `${targetName} is a catalogue substitute when ${targetFit}. Stay with ${sourceName} when ${sourceStay}. Reasons come from approved editorial assessments — not a ranked best-of list.`,
    betterWhen,
    worseWhen,
    keyTradeoff,
    relativePricing: "unknown",
    useCaseSlugs: overlappingUseCases(source, target),
    researchStatus: "complete",
  };
}

function existingKeys(pages: AltInput[]): Set<string> {
  const keys = new Set<string>();
  for (const page of pages) {
    if (page.sourceSlug) keys.add(page.sourceSlug);
    if (page.slug) keys.add(page.slug);
  }
  return keys;
}

/**
 * Indexable alternatives pages from existing catalogue substitutes + approved
 * assessments. Does not invent products, prices, ranks, or testing claims.
 * Products with fewer than two honest substitutes (Fastmail / SaneBox) are skipped.
 */
export function buildAlternativesFromResearch(
  products: EcosystemProduct[],
  authored: AltInput[] = [],
): AltInput[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const covered = existingKeys(authored);
  const generated: AltInput[] = [];

  for (const product of products) {
    if (covered.has(product.slug)) continue;
    if (product.metadata?.status !== "published") continue;
    const sourceAssessment = approvedAssessment(product.slug);
    if (!sourceAssessment) continue;

    const targetSlugs = catalogueSubstituteSlugs(product, products).slice(
      0,
      MAX_TARGETS,
    );
    const entries: AltEntry[] = [];
    for (const targetSlug of targetSlugs) {
      const target = bySlug.get(targetSlug);
      if (!target) continue;
      const targetAssessment = approvedAssessment(targetSlug);
      if (!targetAssessment) continue;
      const entry = buildEntry(
        product,
        target,
        sourceAssessment,
        targetAssessment,
      );
      if (entry) entries.push(entry);
    }
    if (entries.length < 2) continue;

    const name = displayName(product);
    const targetNames = entries.map((entry) =>
      displayName(bySlug.get(entry.targetSlug) ?? { slug: entry.targetSlug }),
    );
    const stay = clause(sourceAssessment.bestFor[0])!;
    const moves = entries
      .slice(0, 4)
      .map((entry, index) => {
        const targetName = targetNames[index];
        const when = clause(entry.betterWhen?.[0]);
        return when ? `Move to ${targetName} when ${when}.` : null;
      })
      .filter((item): item is string => Boolean(item));

    generated.push({
      id: `alt-${product.slug}`,
      slug: product.slug,
      title: `${name} alternatives`,
      sourceSlug: product.slug,
      summary: `Approved substitutes for ${name} from existing SoftwareGlimpse catalogue peers and editorial assessments. This is a job-fit list, not a ranked best-of.`,
      editorialRecommendation: `Stay on ${name} when ${stay}. ${moves.join(" ")} Not a ranked best-of list — affiliate relationships never set the order.`,
      editorialStatus: "approved",
      alternatives: entries,
      metadata: {
        status: "published",
        researchStatus: "complete",
        publishedAt: PUBLISHED_AT,
        updatedAt: PUBLISHED_AT,
      },
      seo: {
        title: seoTitle(name),
        description: seoDescription(name, targetNames),
        indexable: true,
        canonicalPath: `/alternatives/${product.slug}/`,
      },
    });
    covered.add(product.slug);
  }

  return generated;
}

export function alternativesResearchCoverage(pages: AltInput[]): {
  generated: number;
  indexable: number;
} {
  return {
    generated: pages.length,
    indexable: pages.filter((page) => page.seo?.indexable === true).length,
  };
}
