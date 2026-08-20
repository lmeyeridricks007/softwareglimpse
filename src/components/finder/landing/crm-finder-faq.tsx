import { GuideFaq, type GuideFaqItem } from "@/components/guides/guide-faq";
import { Section } from "@/components/layout/section";

export const CRM_FINDER_FAQ_ITEMS: GuideFaqItem[] = [
  {
    question: "How does the CRM Finder choose recommendations?",
    answer:
      "It scores CRM products against your answers using SoftwareGlimpse structured recommendations — use-case fit, required capabilities, business size, integrations, setup preference, and budget where public pricing is verified. Rankings are deterministic for the same inputs and methodology version.",
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
    question: "How accurate are the fit scores?",
    answer:
      "Fit scores measure how closely a product matches your stated requirements based on catalogue attributes. They are not probabilities, popularity rankings, or user-review averages. Evidence confidence is shown separately when coverage is incomplete.",
  },
  {
    question: "Where does SoftwareGlimpse get its CRM information?",
    answer:
      "From structured product research maintained in the SoftwareGlimpse catalogue — features, use-case fit, sizing, integrations, and published pricing where verified.",
  },
  {
    question: "Does the Finder store my answers?",
    answer:
      "Answers stay on your device in local browser storage so you can resume or hand off to the cost calculator. We do not put answers in the URL or store them on our servers for marketing.",
  },
  {
    question: "Can I change my answers?",
    answer:
      "Yes. Use Edit answers or Start over from the results view. Changing answers and re-running scoring updates your shortlist.",
  },
  {
    question: "What if no CRM matches all my requirements?",
    answer:
      "If must-have filters exclude every candidate, you'll see an empty state with guidance to relax requirements. Partial matches still show trade-offs and unknowns so you can decide consciously.",
  },
];

export function CrmFinderFaq() {
  return (
    <Section padding="md" background="surface" container="wide">
      <GuideFaq items={CRM_FINDER_FAQ_ITEMS} />
    </Section>
  );
}
