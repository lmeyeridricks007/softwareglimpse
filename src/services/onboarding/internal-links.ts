import type { InternalLinkCandidate, PageCandidate, Software } from "@/domain";

/**
 * Candidate internal-link plan — uses content map + taxonomy.
 * Only publishable targets become active public links later.
 */
export function buildInternalLinkPlan(input: {
  product: Software;
  pageCandidates: PageCandidate[];
}): InternalLinkCandidate[] {
  const { product, pageCandidates } = input;
  const links: InternalLinkCandidate[] = [];
  const productPath = `/software/${product.slug}/`;
  const categoryPath = `/categories/${product.primaryCategorySlug}/`;

  links.push({
    sourceContentHint: categoryPath,
    targetContentHint: productPath,
    relationship: "belongs-to-category",
    suggestedContext: "category hub product listing",
    anchorConcept: product.name,
    reason: "Category hub should discover product via taxonomy",
    priority: 80,
    activeWhenPublished: true,
  });

  links.push({
    sourceContentHint: productPath,
    targetContentHint: categoryPath,
    relationship: "belongs-to-category",
    suggestedContext: "breadcrumb / related category",
    anchorConcept: product.primaryCategorySlug,
    reason: "Product page links back to category hub",
    priority: 75,
    activeWhenPublished: true,
  });

  for (const page of pageCandidates) {
    if (page.status === "not-recommended" || page.status === "blocked") continue;
    if (page.pageType === "pricing") {
      links.push({
        sourceContentHint: productPath,
        targetContentHint: page.canonicalPath,
        relationship: "has-pricing-page",
        suggestedContext: "pricing section CTA",
        anchorConcept: `${product.name} pricing`,
        reason: "Product → pricing page",
        priority: 70,
        activeWhenPublished: page.status === "ready-to-create" || page.status === "duplicate",
      });
    }
    if (page.pageType === "alternatives") {
      links.push({
        sourceContentHint: productPath,
        targetContentHint: page.canonicalPath,
        relationship: "has-alternatives-page",
        suggestedContext: "alternatives callout",
        anchorConcept: `${product.name} alternatives`,
        reason: "Product → alternatives page",
        priority: 65,
        activeWhenPublished: false,
      });
    }
    if (page.pageType === "comparison") {
      const other = page.productSlugs.find((s) => s !== product.slug);
      links.push({
        sourceContentHint: productPath,
        targetContentHint: page.canonicalPath,
        relationship: "comparison",
        suggestedContext: "compare section",
        anchorConcept: other ? `${product.name} vs ${other}` : "comparison",
        reason: "Product → comparison candidate",
        priority: page.priority,
        activeWhenPublished: false,
      });
    }
    if (page.pageType === "best-inclusion") {
      links.push({
        sourceContentHint: page.canonicalPath,
        targetContentHint: productPath,
        relationship: "best-page-candidate",
        suggestedContext: "best guide listing (after editorial approval)",
        anchorConcept: product.name,
        reason: "Best page may link once product is editorially included — not auto-ranked",
        priority: 50,
        activeWhenPublished: false,
      });
    }
  }

  if (product.primaryCategorySlug === "crm") {
    links.push({
      sourceContentHint: productPath,
      targetContentHint: "/tools/crm-finder/",
      relationship: "related-tool",
      suggestedContext: "tools section",
      anchorConcept: "CRM Finder",
      reason: "CRM products link to CRM Finder when category matches",
      priority: 40,
      activeWhenPublished: true,
    });
  }

  return links;
}
