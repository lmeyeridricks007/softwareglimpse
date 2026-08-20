import { minimumCategoryKnowledgeMap } from "./minimum-category-map";

export const marketingKnowledgeMap = minimumCategoryKnowledgeMap({
  categorySlug: "marketing",
  bestSlug: "marketing-software",
  prefix: "mkt",
  whatIs: {
    slug: "what-is-marketing-software",
    title: "What is marketing software?",
  },
  howToChoose: {
    slug: "how-to-choose-marketing-software",
    title: "How to choose marketing software",
  },
  pricing: {
    slug: "marketing-software-pricing-guide",
    title: "Marketing software pricing explained",
  },
  requirements: {
    slug: "marketing-software-requirements-guide",
    title: "Marketing software requirements guide",
  },
  evaluation: {
    slug: "marketing-software-evaluation-guide",
    title: "Marketing software evaluation guide",
  },
});
