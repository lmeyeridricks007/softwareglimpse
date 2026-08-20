import { GuideFaq, type GuideFaqItem } from "@/components/guides/guide-faq";
import { Section } from "@/components/layout/section";

export const SI_FINDER_FAQ_ITEMS: GuideFaqItem[] = [
  {
    question: "How does the Sales Intelligence Finder choose recommendations?",
    answer:
      "It scores sales intelligence products against your answers using SoftwareGlimpse structured recommendations — primary job fit, required capabilities, business size, integrations, setup preference, and budget where public pricing is verified. Rankings are deterministic for the same inputs and methodology version.",
  },
  {
    question: "How is this different from the CRM Finder?",
    answer:
      "Sales intelligence tools help you find and enrich contacts and run outreach. CRMs manage pipeline, deals, and customer records. This Finder only ranks primary sales-intelligence products — it is not a CRM replacement recommender.",
  },
  {
    question: "Does SoftwareGlimpse earn affiliate commissions?",
    answer:
      "Sometimes. When you visit a vendor through our links, we may earn a commission. That never changes Finder rankings or fit scores.",
  },
  {
    question: "Do affiliate relationships affect results?",
    answer:
      "No. Affiliate metadata is not part of the matching model. Products are ranked by fit to your requirements and available research evidence.",
  },
  {
    question: "Why might budget fit show as unknown?",
    answer:
      "Many sales intelligence vendors use credits, usage, or custom quotes. When we lack verified per-seat list pricing, budget fit stays soft/unknown rather than inventing a price.",
  },
  {
    question: "Does the Finder store my answers?",
    answer:
      "Answers stay on your device in local browser storage so you can resume. We do not put answers in the URL or store them on our servers for marketing.",
  },
  {
    question: "Can I change my answers?",
    answer:
      "Yes. Use Edit answers or Start over from the results view. Changing answers and re-running scoring updates your shortlist.",
  },
];

export function SiFinderFaq() {
  return (
    <Section padding="md" background="surface" container="wide">
      <GuideFaq items={SI_FINDER_FAQ_ITEMS} />
    </Section>
  );
}
