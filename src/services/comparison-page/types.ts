import type { ComparisonWinnerKind, CurrencyCode } from "@/domain";
import type { ProductScreenshot } from "@/components/software/product-screenshot-gallery";
import type { ComparisonPageTabId } from "./tabs";

export type QualitativeStrength =
  | "stronger"
  | "weaker"
  | "tie"
  | "depends"
  | "unknown";

export type ComparisonCriterionRow = {
  slug: string;
  name: string;
  description?: string;
  winnerKind?: ComparisonWinnerKind;
  winnerSlug?: string | null;
  winnerName?: string | null;
  strengthA: QualitativeStrength;
  strengthB: QualitativeStrength;
  /** Approved 0–10 scores only — never fabricated. */
  scoreA: number | null;
  scoreB: number | null;
  label: string;
  evidenceSummary?: string;
  confidence?: string;
  researchStatus?: string;
  supportingFactIds: string[];
};

export type ComparisonFeatureRow = {
  featureSlug: string;
  name: string;
  group: string;
  availabilityA: string;
  availabilityB: string;
  labelA: string;
  labelB: string;
  winnerKind: ComparisonWinnerKind | "unknown";
  winnerName?: string | null;
  notesA?: string;
  notesB?: string;
};

export type ComparisonPageProduct = {
  slug: string;
  name: string;
  href: string;
  logo?: { src: string; alt: string } | null;
  positioning?: string;
  bestFor: string[];
  notIdealFor: string[];
  pros: string[];
  cons: string[];
  score: number | null;
  scoreApproved: boolean;
  startingPriceLabel?: string;
  freePlanLabel?: string;
  trialLabel?: string;
  pricingVerifiedAt?: string;
  screenshots: ProductScreenshot[];
  visitLabel: string;
};

export type ComparisonPageModel = {
  slug: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  provisional: boolean;
  researched: boolean;
  categorySlug?: string;
  categoryLabel?: string;
  methodologyHref: string;
  howWeReviewHref: string;
  methodologyVersion?: string;
  evidenceSourceCount: number;
  screenshotCount: number;
  featureCount: number;
  productA: ComparisonPageProduct;
  productB: ComparisonPageProduct;
  overallWinnerKind?: ComparisonWinnerKind;
  overallLabel: string;
  verdict?: string;
  winsA: ComparisonCriterionRow[];
  winsB: ComparisonCriterionRow[];
  ties: ComparisonCriterionRow[];
  depends: ComparisonCriterionRow[];
  criteria: ComparisonCriterionRow[];
  decisionCards: Array<{
    id: string;
    title: string;
    winnerSlug: string;
    winnerName: string;
    explanation: string;
  }>;
  keyDifferences: Array<{
    id: string;
    title: string;
    leftLabel: string;
    rightLabel: string;
    leftBody: string;
    rightBody: string;
    winnerName?: string | null;
  }>;
  featureGroups: Array<{ group: string; rows: ComparisonFeatureRow[] }>;
  pricing: {
    notes?: string;
    showEstimator: boolean;
    defaultSeats: number;
    verifiedAt?: string;
    cardA: {
      starting?: string;
      freePlan?: string;
      trial?: string;
      plans: Array<{
        name: string;
        priceLabel: string;
        highlights: string[];
        isFree?: boolean;
        highlighted?: boolean;
      }>;
    };
    cardB: {
      starting?: string;
      freePlan?: string;
      trial?: string;
      plans: Array<{
        name: string;
        priceLabel: string;
        highlights: string[];
        isFree?: boolean;
        highlighted?: boolean;
      }>;
    };
    estimateA?: { monthlyLabel: string; planName?: string; status: string };
    estimateB?: { monthlyLabel: string; planName?: string; status: string };
    /** Verified per-seat monthly major units for client estimator; omit when unknown. */
    unitA?: {
      perUserMonthly: number;
      currency: CurrencyCode;
      planName?: string;
    };
    unitB?: {
      perUserMonthly: number;
      currency: CurrencyCode;
      planName?: string;
    };
  };
  relatedComparisons: Array<{
    slug: string;
    title: string;
    href: string;
    productAName: string;
    productBName: string;
    logoA?: { src: string; alt: string } | null;
    logoB?: { src: string; alt: string } | null;
  }>;
  alternatives: Array<{
    slug: string;
    name: string;
    href: string;
    logo?: { src: string; alt: string } | null;
    bestFor?: string;
    why?: string;
  }>;
  guides: Array<{ href: string; title: string }>;
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{
    id: string;
    title: string;
    type?: string;
    url?: string;
    productSlug: string;
  }>;
  availableTabs: ComparisonPageTabId[];
  finderHref: string;
  finderLabel: string;
  costCalculatorHref: string;
};
