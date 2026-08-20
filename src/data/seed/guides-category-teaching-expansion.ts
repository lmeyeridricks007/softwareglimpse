import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { softwareSeed } from "./software";
import { withTeachingDepth } from "@/services/guides/teaching-depth";
import { TEACHING_SPECS, type TeachingSpec } from "./guides-teaching-specs";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const PUBLISHED_AT = "2026-08-18T12:00:00.000Z";
const SEO_TITLE_MAX = 70;

function seoTitle(text: string): string {
  if (text.length <= SEO_TITLE_MAX) return text;
  return `${text.slice(0, SEO_TITLE_MAX - 1)}…`;
}

function publishedExamples(categorySlug: string): string[] {
  return softwareSeed
    .filter(
      (item) =>
        item.metadata?.status === "published" &&
        item.primaryCategorySlug === categorySlug,
    )
    .map((item) => item.slug)
    .sort()
    .slice(0, 5);
}

function meta(): GuidePage["metadata"] {
  return {
    status: "published",
    updatedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    reviewedAt: PUBLISHED_AT,
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  };
}

export function howWorksSlugFor(spec: TeachingSpec): string {
  return spec.categorySlug === "email-marketing"
    ? "how-email-marketing-works"
    : `how-${spec.whatIsSlug.replace(/^what-is-/, "")}-works`;
}

export function typesSlugFor(spec: TeachingSpec): string {
  if (spec.categorySlug === "email-marketing") return "types-of-email-marketing";
  if (spec.categorySlug === "hr") return "types-of-hr-software";
  if (spec.categorySlug === "ai") return "types-of-ai-software";
  if (spec.categorySlug === "ecommerce") return "types-of-ecommerce-software";
  if (spec.categorySlug === "marketing") return "types-of-marketing-software";
  return `types-of-${spec.whatIsSlug.replace(/^what-is-/, "")}`;
}

function titleName(name: string): string {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildHowItWorks(spec: TeachingSpec): GuidePage {
  const resolved = howWorksSlugFor(spec);
  const examples = publishedExamples(spec.categorySlug);
  const blocks: GuideBlockInput[] = [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${spec.loopBody} Decision rule: walk the loop in order for your weekly ritual; skip a step (especially ownership, consent, or review) and buying more seats only multiplies the mess.`,
      bullets: spec.loop.map((step) => step.label),
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: "Key takeaways",
      items: [
        {
          label: "The loop beats the logo",
          body: "Features rearrange steps. They do not erase the operating loop.",
        },
        {
          label: "One category, several jobs",
          body: "Shortlist only tools whose core product is the step that is blocking this quarter.",
        },
        {
          label: "Integrations are part of the product",
          body: "If the loop cannot land in your system of record, the demo is incomplete.",
        },
        {
          label: "No universal winner",
          body: "SoftwareGlimpse does not rank unlike jobs as one #1. Confirm live vendor packaging.",
        },
      ],
    },
    {
      type: "decision-framework",
      id: "operating-loop",
      title: `The ${spec.name} operating loop`,
      steps: spec.loop,
      ctaHref: `/guides/${spec.howToChooseSlug}/`,
      ctaLabel: `How to choose ${spec.name} →`,
      figure: {
        src: `/guides/${resolved}-hero.png`,
        alt: `${spec.name} operating loop: ${spec.loop.map((s) => s.label.toLowerCase()).join(", ")}.`,
        caption:
          "Walk the loop in order. Skipping ownership or review is how teams pay for software they cannot run.",
      },
    },
    {
      type: "step",
      id: "walk-the-loop",
      stepNumber: 1,
      heading: `How ${spec.name} works in practice`,
      body: `${spec.loopBody}\n\n${spec.loopExample}`,
      tip: spec.loopTip,
      figure: {
        src: `/guides/${resolved}-hero.png`,
        alt: `Teaching diagram of how ${spec.name} works as an operating loop, not a brand ranking.`,
        caption: "Example teams name a weekly outcome before they compare vendors.",
      },
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: "Common mistakes",
      items: [
        {
          title: "Buying the category label",
          body: "If two products fail for different reasons, they are not peers. Name the job first.",
        },
        {
          title: "Skipping the system of record",
          body: "If work still lives in inboxes after go-live, the loop never landed.",
        },
        {
          title: "Invented rankings",
          body: "Do not treat affiliate order or homepage claims as SoftwareGlimpse scores.",
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: `Is there a single best ${spec.name}?`,
          answer:
            "No. SoftwareGlimpse uses no universal winner. Choose by job-cluster fit and confirm live packaging.",
        },
        {
          question: "Where should I compare researched products?",
          answer: `See Best ${spec.name} for editor’s picks by job cluster and disclosed methodology — not commissions.`,
        },
      ],
    },
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: "Once the loop is named, shortlist only tools that own the blocking step.",
      href: `/guides/${spec.howToChooseSlug}/`,
      ctaLabel: `How to choose ${spec.name} →`,
      variant: "finder",
    },
  ];
  return withTeachingDepth({
    id: `guide-${resolved}`,
    slug: resolved,
    title: `How ${titleName(spec.name)} Works`,
    summary: `How ${spec.name} works as an operating loop — not a brand ranking.`,
    categorySlugs: [spec.categorySlug],
    productSlugs: examples,
    topicType: "how-it-works",
    journeyStage: "understand",
    knowledgeAreaSlug: "fundamentals",
    heroVisual: {
      src: `/guides/${resolved}-hero.png`,
      alt: `How ${spec.name} works: ${spec.loop.map((s) => s.label.toLowerCase()).join(" → ")}.`,
    },
    supports: [
      {
        contentId: `content:category:${spec.categorySlug}`,
        relationType: "supports-anchor",
        primary: true,
      },
      {
        contentId: `content:best:${spec.bestSlug}`,
        relationType: "supports-anchor",
        primary: false,
      },
    ],
    nextAction: {
      contentId: `content:guide:${spec.howToChooseSlug}`,
      label: `How to choose ${spec.name}`,
    },
    relatedGuideSlugs: [
      spec.whatIsSlug,
      typesSlugFor(spec),
      spec.howToChooseSlug,
      spec.pricingSlug,
    ],
    blocks: blocks as GuidePage["blocks"],
    checklist: [],
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: meta(),
    seo: {
      title: seoTitle(`How ${titleName(spec.name)} Works | SoftwareGlimpse`),
      description: `How ${spec.name} works as a weekly operating loop. No universal winner — choose by job fit.`,
      canonicalPath: `/guides/${resolved}/`,
      indexable: true,
    },
  });
}

function buildTypes(spec: TeachingSpec): GuidePage {
  const slug = typesSlugFor(spec);
  const examples = publishedExamples(spec.categorySlug);
  const blocks: GuideBlockInput[] = [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `“Types of ${spec.name}” means different product shapes that share a category label but fail for different reasons. Decision rule: name the one job blocking work this quarter, then shortlist only tools whose core product is that shape.`,
      bullets: spec.shapes.map((shape) => shape.title),
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: "Key takeaways",
      items: [
        {
          label: "Shape before brand",
          body: "A specialist that matches the job beats an all-in-one you will not run.",
        },
        {
          label: "Hybrids still need a primary job",
          body: "Buying a bundle because it “does everything” usually means you under-test the one job you need.",
        },
        {
          label: "Catalogue examples are not rankings",
          body: "Named products below are illustrations from the published SoftwareGlimpse catalogue — not a #1 list.",
        },
        {
          label: "Confirm live packaging",
          body: "Plan gates and add-ons change which shape you can actually buy.",
        },
      ],
    },
    {
      type: "crm-types",
      id: "product-shapes",
      title: `Modern ${spec.name} shapes (not rankings)`,
      types: spec.shapes,
    },
    {
      type: "step",
      id: "pick-shape",
      stepNumber: 1,
      heading: "Pick a shape before a vendor demo",
      body: `${spec.loopExample}\n\nCatalogue illustrations (alphabetical, not a ranking): ${examples.join(", ") || "see the category hub"}.`,
      tip: spec.loopTip,
      figure: {
        src: `/guides/${slug}-hero.png`,
        alt: `Types of ${spec.name} as separate product shapes, not one ranked list.`,
        caption: "Same category label — different primary jobs.",
      },
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: "Common mistakes",
      items: [
        {
          title: "One shortlist for unlike jobs",
          body: "If products fail for different reasons, split the RFP.",
        },
        {
          title: "Feature grids without a weekly outcome",
          body: "If you cannot test it in two weeks, it is not a must-have.",
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: "Can one vendor cover every type?",
          answer:
            "Sometimes as adjacent modules — still score the primary job. Do not invent a universal winner.",
        },
        {
          question: "Where are editor’s picks?",
          answer: `Best ${spec.name} groups products by job cluster with disclosed methodology.`,
        },
      ],
    },
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: "After you name the shape, use the selection framework.",
      href: `/guides/${spec.howToChooseSlug}/`,
      ctaLabel: `How to choose ${spec.name} →`,
      variant: "finder",
    },
  ];
  return withTeachingDepth({
    id: `guide-${slug}`,
    slug,
    title: `Types of ${titleName(spec.name)}`,
    summary: `The product shapes inside ${spec.name} — pick the job first, then the vendor.`,
    categorySlugs: [spec.categorySlug],
    productSlugs: examples,
    topicType: "fundamental",
    journeyStage: "learn",
    knowledgeAreaSlug: "fundamentals",
    heroVisual: {
      src: `/guides/${slug}-hero.png`,
      alt: `Types of ${spec.name}: ${spec.shapes.map((s) => s.title).join("; ")}.`,
    },
    supports: [
      {
        contentId: `content:category:${spec.categorySlug}`,
        relationType: "supports-anchor",
        primary: true,
      },
      {
        contentId: `content:best:${spec.bestSlug}`,
        relationType: "supports-anchor",
        primary: false,
      },
    ],
    nextAction: {
      contentId: `content:guide:${spec.howToChooseSlug}`,
      label: `How to choose ${spec.name}`,
    },
    relatedGuideSlugs: [
      spec.whatIsSlug,
      howWorksSlugFor(spec),
      spec.howToChooseSlug,
      spec.vs.slug,
    ],
    blocks: blocks as GuidePage["blocks"],
    checklist: [],
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: meta(),
    seo: {
      title: seoTitle(`Types of ${titleName(spec.name)} | SoftwareGlimpse`),
      description: `Types of ${spec.name} by job — not one undifferentiated ranking.`,
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  });
}

function buildVs(spec: TeachingSpec): GuidePage {
  const slug = spec.vs.slug;
  const examples = [
    ...publishedExamples(spec.categorySlug).slice(0, 3),
    ...publishedExamples(spec.vs.otherCategory).slice(0, 2),
  ];
  const blocks: GuideBlockInput[] = [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${spec.vs.difference} Decision rule: buy ${spec.name} when ${spec.vs.whenThis} Buy ${spec.vs.otherName} when ${spec.vs.whenOther} They may integrate; they are not substitutes.`,
      bullets: [
        spec.name,
        spec.vs.otherName,
        "Different jobs",
        "May integrate",
        "Not one ranking",
        "Confirm packaging",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: "Key takeaways",
      items: [
        { label: "Boundary first", body: spec.vs.difference },
        { label: `Choose ${spec.name} when`, body: spec.vs.whenThis },
        { label: `Choose ${spec.vs.otherName} when`, body: spec.vs.whenOther },
        {
          label: "No universal winner across the boundary",
          body: "Do not score unlike jobs as one #1 list.",
        },
      ],
    },
    {
      type: "comparison-framework",
      id: "boundary",
      title: "How to tell them apart",
      criteria: [
        {
          id: "job",
          label: "Weekly job",
          weight: 3,
          description: `What must happen every week — ${spec.name} vs ${spec.vs.otherName}.`,
        },
        {
          id: "system-of-record",
          label: "System of record",
          weight: 2,
          description:
            "Which object is canonical: subscribers, tickets, employees, deals, or orders.",
        },
        {
          id: "integration",
          label: "Integration direction",
          weight: 1,
          description:
            "Which tool writes, which tool reads. Confirm the live connector — do not assume.",
        },
      ],
    },
    {
      type: "step",
      id: "worked",
      stepNumber: 1,
      heading: "A worked boundary example",
      body: `${spec.loopExample}\n\nIf that weekly outcome maps to ${spec.vs.otherName}, stop this shortlist and open the other category instead.`,
      tip: "If you need both, buy for the job that creates the most rework this quarter, then integrate.",
      figure: {
        src: `/guides/${slug}-hero.png`,
        alt: `${titleName(spec.name)} vs ${titleName(spec.vs.otherName)}: different jobs, not a combined ranking.`,
        caption: "Integrations do not make unlike products peers.",
      },
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: "Common mistakes",
      items: [
        {
          title: "Forcing one vendor to do both jobs",
          body: "A weak module on the wrong object usually costs more than two focused tools.",
        },
        {
          title: "Ranking across the boundary",
          body: "Editor’s picks live on each category Best page — not as a blended #1.",
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: "Can I use one tool for both?",
          answer:
            "Only if the core product is your blocking job. Adjacent modules are optional convenience — not a reason to skip the real system of record.",
        },
        {
          question: `Where do I read more about ${spec.vs.otherName}?`,
          answer: `Start with the ${spec.vs.otherName} teaching guide, then that category’s Best page.`,
        },
      ],
    },
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: `Stay in ${spec.name} if that is the blocking job.`,
      href: `/guides/${spec.howToChooseSlug}/`,
      ctaLabel: `How to choose ${spec.name} →`,
      variant: "finder",
    },
  ];
  return withTeachingDepth({
    id: `guide-${slug}`,
    slug,
    title: `${titleName(spec.name)} vs ${titleName(spec.vs.otherName)}`,
    summary: spec.vs.difference,
    categorySlugs: [spec.categorySlug, spec.vs.otherCategory],
    productSlugs: examples,
    topicType: "comparison-education",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    heroVisual: {
      src: `/guides/${slug}-hero.png`,
      alt: `${titleName(spec.name)} vs ${titleName(spec.vs.otherName)} job-boundary diagram.`,
    },
    supports: [
      {
        contentId: `content:category:${spec.categorySlug}`,
        relationType: "supports-anchor",
        primary: true,
      },
      {
        contentId: `content:category:${spec.vs.otherCategory}`,
        relationType: "supports-anchor",
        primary: false,
      },
    ],
    nextAction: {
      contentId: `content:guide:${spec.howToChooseSlug}`,
      label: `How to choose ${spec.name}`,
    },
    relatedGuideSlugs: [
      spec.whatIsSlug,
      spec.vs.otherGuideSlug,
      spec.howToChooseSlug,
      typesSlugFor(spec),
    ],
    blocks: blocks as GuidePage["blocks"],
    checklist: [],
    sections: [],
    faq: [],
    freshnessClass: "slow-moving",
    metadata: meta(),
    seo: {
      title: seoTitle(
        `${titleName(spec.name)} vs ${titleName(spec.vs.otherName)} | SoftwareGlimpse`,
      ),
      description: spec.vs.difference.slice(0, 155),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  });
}

function buildReqEval(spec: TeachingSpec): GuidePage[] {
  if (!spec.includeReqEval || !spec.requirementsSlug || !spec.evaluationSlug) {
    return [];
  }
  const examples = publishedExamples(spec.categorySlug);
  const reqBlocks: GuideBlockInput[] = [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Write ${spec.name} requirements as jobs and evidence, not feature wishlists: primary shape, must-have workflows, volume unit, integrations, reporting cadence, and who updates the system weekly. Decision rule: every must-have must map to a weekly outcome and a plan tier you are willing to buy.`,
      bullets: [
        "Primary job statement",
        "Must-have workflows",
        "Volume / GMV / orders",
        "Integrations list",
        "Reporting cadence",
        "Roles & permissions",
      ],
    },
    {
      type: "key-takeaways",
      id: "kt",
      title: "Key takeaways",
      items: [
        {
          label: "Separate must from nice",
          body: "If the team still operates without it for 90 days, it is nice-to-have.",
        },
        {
          label: "Requirements own plan gates",
          body: "Checkout, POS, or app must-haves imply a qualifying configuration — write that explicitly.",
        },
        {
          label: "One shape per sheet",
          body: "Do not mix hosted platforms and sourcing apps on a single undifferentiated RFP.",
        },
      ],
    },
    {
      type: "step",
      id: "write-jobs",
      stepNumber: 1,
      heading: "Write three job statements",
      body: `${spec.loopExample}\n\nCapture who merchandises, who refunds, and which ESP/ads tools must sync.`,
      tip: "Reject any requirement that cannot be tested in a two-week trial.",
      figure: {
        src: `/guides/${spec.requirementsSlug}-hero.png`,
        alt: `One-page ${spec.name} requirements score sheet.`,
        caption: "Every must-have needs evidence and a plan tier.",
      },
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: "Common mistakes",
      items: [
        {
          title: "Vendor feature grids as requirements",
          body: "Start from your weekly outcome, then ask which plan unlocks it.",
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: "Should requirements include product scores?",
          answer:
            "No invented scores. Capture evidence against jobs; use the Best page for cluster editor’s picks.",
        },
      ],
    },
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: "Freeze the sheet, then run the same evaluation script on every finalist.",
      href: `/guides/${spec.evaluationSlug}/`,
      ctaLabel: "Evaluation guide →",
      variant: "finder",
    },
  ];
  const evalBlocks: GuideBlockInput[] = [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `Evaluate ${spec.name} with weighted criteria and a shared two-week script — catalog import, one real checkout path, one must-have app or POS flow, and reporting — so you compare evidence instead of demo theater. Decision rule: freeze weights before demos; run the same script on every finalist.`,
      bullets: [
        "Freeze weights first",
        "Same two-week script",
        "Catalog + checkout test",
        "Must-have app / POS",
        "Refund / order ops",
        "Non-admin scorecard",
      ],
    },
    {
      type: "key-takeaways",
      id: "key-takeaways",
      title: "Key takeaways",
      items: [
        {
          label: "Demo theater lies",
          body: "Vendors show polished themes; your catalog and refunds expose friction.",
        },
        {
          label: "Plan gates decide the score",
          body: "Test on the plan you will buy — not the unlimited sandbox.",
        },
        {
          label: "Non-admins must score",
          body: "If only the vendor SE can publish a product, adoption will fail.",
        },
      ],
    },
    {
      type: "step",
      id: "script",
      stepNumber: 1,
      heading: "Run one script on every finalist",
      body: `${spec.loopExample}\n\nScore the same day each tool finishes, with someone who is not the admin.`,
      tip: "Processing spreads belong on the card — not a post-purchase surprise.",
      figure: {
        src: `/guides/${spec.evaluationSlug}-hero.png`,
        alt: `${spec.name} evaluation script: same trial for every finalist.`,
        caption: "Freeze weights before the first demo.",
      },
    },
    {
      type: "mistakes",
      id: "mistakes",
      title: "Common mistakes",
      items: [
        {
          title: "Changing weights mid-demo",
          body: "That is how the last vendor always “wins.”",
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: "How many finalists?",
          answer: "Two or three in the same shape. Unlike jobs need a different sheet.",
        },
      ],
    },
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: "After evidence, open the Best page for cluster editor’s picks.",
      href: `/best/${spec.bestSlug}/`,
      ctaLabel: `Best ${spec.name} →`,
      variant: "finder",
    },
  ];
  return [
    withTeachingDepth({
      id: `guide-${spec.requirementsSlug}`,
      slug: spec.requirementsSlug,
      title: `${titleName(spec.name)} Requirements Guide`,
      summary: `Write ${spec.name} requirements as jobs and evidence — not a vendor feature dump.`,
      categorySlugs: [spec.categorySlug],
      productSlugs: examples,
      topicType: "checklist",
      journeyStage: "evaluate",
      knowledgeAreaSlug: "selection",
      heroVisual: {
        src: `/guides/${spec.requirementsSlug}-hero.png`,
        alt: `${titleName(spec.name)} requirements as a one-page job sheet.`,
      },
      supports: [
        {
          contentId: `content:category:${spec.categorySlug}`,
          relationType: "supports-anchor",
          primary: true,
        },
        {
          contentId: `content:best:${spec.bestSlug}`,
          relationType: "supports-anchor",
          primary: false,
        },
      ],
      nextAction: {
        contentId: `content:guide:${spec.evaluationSlug}`,
        label: `${titleName(spec.name)} evaluation guide`,
      },
      relatedGuideSlugs: [
        spec.whatIsSlug,
        spec.howToChooseSlug,
        spec.evaluationSlug,
        spec.pricingSlug,
      ],
      blocks: reqBlocks as GuidePage["blocks"],
      checklist: [],
      sections: [],
      faq: [],
      freshnessClass: "slow-moving",
      metadata: meta(),
      seo: {
        title: seoTitle(
          `${titleName(spec.name)} Requirements Guide | SoftwareGlimpse`,
        ),
        description: `Requirements for ${spec.name} as weekly jobs and evidence — no invented scores.`,
        canonicalPath: `/guides/${spec.requirementsSlug}/`,
        indexable: true,
      },
    }),
    withTeachingDepth({
      id: `guide-${spec.evaluationSlug}`,
      slug: spec.evaluationSlug,
      title: `${titleName(spec.name)} Evaluation Guide`,
      summary: `A shared trial script for ${spec.name} finalists in the same job cluster.`,
      categorySlugs: [spec.categorySlug],
      productSlugs: examples,
      topicType: "buying-guide",
      journeyStage: "evaluate",
      knowledgeAreaSlug: "selection",
      heroVisual: {
        src: `/guides/${spec.evaluationSlug}-hero.png`,
        alt: `${titleName(spec.name)} evaluation script with frozen weights.`,
      },
      supports: [
        {
          contentId: `content:category:${spec.categorySlug}`,
          relationType: "supports-anchor",
          primary: true,
        },
        {
          contentId: `content:best:${spec.bestSlug}`,
          relationType: "supports-anchor",
          primary: false,
        },
      ],
      nextAction: {
        contentId: `content:best:${spec.bestSlug}`,
        label: `Best ${spec.name}`,
      },
      relatedGuideSlugs: [
        spec.requirementsSlug,
        spec.howToChooseSlug,
        spec.pricingSlug,
        spec.whatIsSlug,
      ],
      blocks: evalBlocks as GuidePage["blocks"],
      checklist: [],
      sections: [],
      faq: [],
      freshnessClass: "slow-moving",
      metadata: meta(),
      seo: {
        title: seoTitle(
          `${titleName(spec.name)} Evaluation Guide | SoftwareGlimpse`,
        ),
        description: `Evaluate ${spec.name} with a shared trial script. No universal winner.`,
        canonicalPath: `/guides/${spec.evaluationSlug}/`,
        indexable: true,
      },
    }),
  ];
}

export function teachingExpansionFor(categorySlug: string): GuidePage[] {
  const spec = TEACHING_SPECS.find((item) => item.categorySlug === categorySlug);
  if (!spec) return [];
  return [
    buildHowItWorks(spec),
    buildTypes(spec),
    ...(spec.omitVs ? [] : [buildVs(spec)]),
    ...buildReqEval(spec),
  ];
}

export function allTeachingExpansions(): GuidePage[] {
  return TEACHING_SPECS.flatMap((spec) => teachingExpansionFor(spec.categorySlug));
}
