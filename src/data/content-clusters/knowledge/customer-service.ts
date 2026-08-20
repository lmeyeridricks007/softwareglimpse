import { minimumCategoryKnowledgeMap } from "./minimum-category-map";

export const customerServiceKnowledgeMap = minimumCategoryKnowledgeMap({
  categorySlug: "customer-service",
  bestSlug: "customer-service-software",
  prefix: "cs",
  whatIs: {
    slug: "what-is-customer-service-software",
    title: "What is customer service software?",
  },
  howToChoose: {
    slug: "how-to-choose-customer-service-software",
    title: "How to choose customer service software",
  },
  pricing: {
    slug: "customer-service-pricing-guide",
    title: "Customer service pricing explained",
  },
  requirements: {
    slug: "customer-service-requirements-guide",
    title: "Customer service requirements guide",
  },
  evaluation: {
    slug: "customer-service-evaluation-guide",
    title: "Customer service evaluation guide",
  },
});
