import type { BestPage, Software } from "@/domain";

/** Public view-model for /best/[slug] — never includes editorial workflow state. */

export type BestPageLogo = { src: string; alt: string } | null | undefined;

export type BestPageProductRef = {
  slug: string;
  name: string;
  logo?: BestPageLogo;
  href: string;
};

export type BestPageHeroModel = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: Array<{ label: string; href?: string; icon?: string }>;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  tertiaryCta?: { href: string; label: string };
  /** Researched fit highlights — never award language unless rankingsApproved. */
  fitHighlights: Array<{
    label: string;
    product: BestPageProductRef;
    reason: string;
  }>;
  shortlistTitle: string;
  shortlist: Array<{
    product: BestPageProductRef;
    bestFor?: string | null;
    summary?: string | null;
    score?: number | null;
    scoreApproved?: boolean;
    pricingTeaser?: string | null;
    /** Public rank only when the page has an approved ranked shortlist. */
    rank?: number;
  }>;
  compareHref: string;
  compareLabel: string;
  compactDisclosure: string;
};

export type BestPageRecommendationModel = {
  product: BestPageProductRef;
  /** Only set when rankings are editorially approved. */
  rank?: number;
  badge?: string | null;
  /** Non-award positioning label for shortlist cards (public-safe). */
  positioningLabel?: string | null;
  summary: string;
  bestFor?: string | null;
  keyStrength?: string | null;
  pricingTeaser?: string | null;
  strengths: string[];
  tradeOffs: string[];
  editorialSummary?: string | null;
  whyPicked?: string | null;
  idealFor: string[];
  avoidIf: string[];
  alternatives: Array<{ product: BestPageProductRef; when: string }>;
  featureSnapshot: Array<{
    label: string;
    level?: "strong" | "good" | "limited" | "unknown";
    score?: number;
  }>;
  /** Approved assessment criterion scores (0–10). Independent of award approval. */
  criterionScores: Array<{ slug: string; name: string; score: number }>;
  keyDetails: Array<{ label: string; value: string }>;
  score?: number | null;
  scoreApproved: boolean;
  keyLimitation?: string | null;
  screenshot?: {
    src: string;
    alt: string;
    caption: string;
    source?: string;
  } | null;
  pricingHref?: string;
  featuresHref?: string;
};

export type BestPageComparisonColumn =
  | "product"
  | "bestFor"
  | "focus"
  | "startingPrice"
  | "freePlan"
  | "keyStrength"
  | "keyLimitation"
  | "pipeline"
  | "automation"
  | "email"
  | "reporting"
  | "easeOfUse"
  | "rating"
  | "review"
  | "compare";

export type BestPageComparisonRow = {
  product: BestPageProductRef;
  bestFor?: string | null;
  focus?: string | null;
  startingPrice?: string | null;
  freePlan?: string | null;
  keyStrength?: string | null;
  keyLimitation?: string | null;
  pipeline?: string | null;
  automation?: string | null;
  email?: string | null;
  reporting?: string | null;
  easeOfUse?: string | null;
  rating?: number | null;
  reviewHref: string;
  compareHref?: string;
};

export type BestPageNavItem = { id: string; label: string; icon?: string };

export type BestPageModel = {
  slug: string;
  title: string;
  path: string;
  categoryName: string;
  categoryShortName: string;
  rankingsApproved: boolean;
  /** "ranked" only when approved recommendations[] carry public ranks. Cluster-award pages stay "shortlist". */
  listMode: "ranked" | "shortlist";
  hero: BestPageHeroModel;
  quickAnswer: {
    heading: string;
    intro: string;
    featured: BestPageRecommendationModel[];
    compact: BestPageRecommendationModel[];
  } | null;
  topPicks: Array<{
    category: string;
    product: BestPageProductRef;
    summary?: string | null;
  }>;
  comparison: {
    heading: string;
    columns: BestPageComparisonColumn[];
    rows: BestPageComparisonRow[];
  } | null;
  products: BestPageRecommendationModel[];
  featureMatrix: {
    heading: string;
    products: BestPageProductRef[];
    rows: Array<{
      featureSlug: string;
      featureName: string;
      featureHref?: string;
      cells: Array<"yes" | "limited" | "no" | "higher-plan" | "unknown">;
    }>;
  } | null;
  pricing: {
    heading: string;
    intro: string;
    lastChecked?: string | null;
    rows: Array<{
      product: BestPageProductRef;
      startingPrice?: string | null;
      model?: string | null;
      freeTrial?: string | null;
      freePlan?: string | null;
    }>;
    calculatorHref?: string;
    /** Product slugs for interactive cost preview (same engine as calculator). */
    interactiveProductSlugs: string[];
  } | null;
  costCalculatorCta: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
  } | null;
  decision: {
    heading: string;
    paths: Array<{ priority: string; product: BestPageProductRef; label?: string }>;
    finderHref?: string;
    finderLabel?: string;
  } | null;
  /**
   * Priority → product exploration from mappings.
   * Shown when formal decision awards are not yet approved.
   * Never presents match percentages or invented winners.
   */
  decisionExplore: {
    heading: string;
    intro: string;
    paths: Array<{
      priority: string;
      product: BestPageProductRef;
      label?: string;
    }>;
    finderHref?: string;
    finderLabel?: string;
  } | null;
  finderCta: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    requirements: string[];
    /** Only real illustrative requirements — never fake match scores. */
    previewNote?: string;
  } | null;
  useCases: Array<{
    slug: string;
    title: string;
    description: string;
    href: string;
    product?: BestPageProductRef | null;
  }>;
  /** Scenario / need matrix built from fit (landscape + use cases). */
  byNeed: Array<{
    id: string;
    title: string;
    description: string;
    href?: string;
    product?: BestPageProductRef | null;
    why?: string | null;
  }>;
  tradeOffs: Array<{
    product: BestPageProductRef;
    strengths: string[];
    limitations: string[];
  }>;
  researchTransparency: {
    productsEvaluated: number;
    featureSupportRows: number;
    productsWithPricing: number;
    productsWithScreenshots: number;
    officialSourceIds: number;
    lastRefresh: string | null;
    methodologyVersion?: string | null;
  } | null;
  productDeepDives: BestPageRecommendationModel[];
  guideGroups: Array<{
    id: string;
    title: string;
    items: Array<{ href: string; title: string; description?: string }>;
  }>;
  productHubs: Array<{
    product: BestPageProductRef;
    links: Array<{ href: string; label: string }>;
  }>;
  buyingFramework: {
    heading: string;
    steps: Array<{
      step: number;
      title: string;
      body: string;
      toolHref?: string;
      toolLabel?: string;
      guideHref?: string;
      guideLabel?: string;
    }>;
  } | null;
  companySizes: Array<{
    id: string;
    title: string;
    description: string;
    href?: string;
  }>;
  landscape: Array<{
    id: string;
    label: string;
    description?: string;
    products: BestPageProductRef[];
  }>;
  softwareTypes: Array<{
    id: string;
    name: string;
    description: string;
    href?: string;
  }>;
  methodology: {
    heading: string;
    intro: string;
    criteria: Array<{
      slug: string;
      name: string;
      description?: string;
      weightPercent?: number;
    }>;
    href: string;
  } | null;
  buyingGuide: {
    heading: string;
    steps: Array<{ step: number; title: string; body: string }>;
    guideHref?: string;
    guideLabel?: string;
  } | null;
  comparisons: Array<{
    href: string;
    title: string;
    summary?: string | null;
    products: BestPageProductRef[];
  }>;
  alternatives: Array<{
    href: string;
    label: string;
    product: BestPageProductRef;
  }>;
  guides: Array<{
    href: string;
    title: string;
    description?: string;
    featured?: boolean;
  }>;
  faq: Array<{ question: string; answer: string }>;
  verdict: {
    heading: string;
    body: string;
    paths: Array<{ product: BestPageProductRef; when: string }>;
    finderHref?: string;
    finderLabel?: string;
  } | null;
  nav: BestPageNavItem[];
  trust: {
    heading: string;
    principles: Array<{ title: string; description: string; href: string }>;
  };
  gaps: string[];
};

export type BuildBestPageDeps = {
  page: BestPage;
  category?: { name: string; path: string[]; shortName?: string } | null;
  softwareBySlug: (slug: string) => Software | undefined;
  methodology?: {
    description?: string;
    criteria: Array<{
      slug: string;
      name: string;
      description?: string;
      weight: number;
      displayOrder: number;
    }>;
  } | null;
  approvedScore: (software: Software) => {
    score: number | null;
    approved: boolean;
  };
  pricingTeaser: (software: Software) => string | null;
  pricingDetail?: (software: Software) => {
    startingPrice?: string | null;
    model?: string | null;
    freeTrial?: string | null;
    freePlan?: string | null;
    lastChecked?: string | null;
  } | null;
  featureCell?: (
    software: Software,
    featureSlug: string,
  ) => "yes" | "limited" | "no" | "higher-plan" | "unknown";
  featureName?: (featureSlug: string) => string;
  criterionScores?: (
    software: Software,
  ) => Array<{ slug: string; name: string; score: number }>;
  productScreenshot?: (software: Software) => {
    src: string;
    alt: string;
    caption: string;
    source?: string;
  } | null;
  researchTransparency?: {
    productsEvaluated: number;
    featureSupportRows: number;
    productsWithPricing: number;
    productsWithScreenshots: number;
    officialSourceIds: number;
    lastRefresh: string | null;
  } | null;
  productGuides?: Array<{
    productSlug: string;
    href: string;
    title: string;
  }>;
  comparisons: Array<{
    slug: string;
    title: string;
    summary?: string;
    productSlugs: string[];
  }>;
  alternatives: Array<{ slug: string; title?: string; sourceSlug: string }>;
  guides: Array<{
    path: string;
    title: string;
    description?: string;
    featured?: boolean;
  }>;
  useCases: Array<{
    slug: string;
    name: string;
    shortDescription?: string;
  }>;
  methodologyHref: string;
  howWeReviewHref: string;
  affiliateDisclosureHref: string;
  editorialIndependenceHref: string;
  contactCorrectionHref: string;
};
