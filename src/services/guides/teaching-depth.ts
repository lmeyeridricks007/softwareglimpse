import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { withEducationalDepth } from "./educational-depth";

type GuideBlock = z.infer<typeof GuideContentBlockSchema>;

/**
 * Structural teaching depth for category CORE guides.
 * Does not invent product scores, rankings, or unknown slugs.
 */
export function withTeachingDepth(guide: GuidePage): GuidePage {
  const blocks = [...(guide.blocks ?? [])];
  const hasRelated = blocks.some((block) => block.type === "related-content");
  if (!hasRelated) {
    const links = relatedLinks(guide);
    if (links.length > 0) {
      blocks.push({
        type: "related-content",
        id: "related-reading",
        title: "Related reading",
        links,
      });
    }
  }

  const nextAction =
    guide.nextAction ??
    defaultNextAction(guide) ??
    undefined;

  const sections =
    guide.sections.length > 0
      ? guide.sections
      : exampleSections(guide);

  const faq =
    guide.faq.length > 0 ? guide.faq : faqFromBlocks(blocks);

  const checklist =
    guide.checklist.length > 0
      ? guide.checklist
      : checklistFromDirectAnswer(blocks);

  return withEducationalDepth({
    ...guide,
    blocks: blocks as GuidePage["blocks"],
    nextAction,
    sections,
    faq,
    checklist,
  });
}

function relatedLinks(guide: GuidePage): Array<{
  href: string;
  label: string;
  description?: string;
}> {
  const links: Array<{ href: string; label: string; description?: string }> = [];
  const category = guide.categorySlugs[0];
  if (category) {
    links.push({
      href: `/categories/${category}/`,
      label: `${titleCase(category)} category`,
      description: "Job-cluster landscape for this category.",
    });
    links.push({
      href: `/best/${category}-software/`,
      label: `Best ${titleCase(category)} software`,
      description: "Editor’s picks by job cluster — not a commission ranking.",
    });
  }
  for (const slug of guide.relatedGuideSlugs.slice(0, 4)) {
    links.push({
      href: `/guides/${slug}/`,
      label: titleCase(slug),
      description: "Supporting SoftwareGlimpse teaching page.",
    });
  }
  return links.slice(0, 6);
}

function defaultNextAction(
  guide: GuidePage,
): { contentId: string; label: string } | null {
  const choose = guide.relatedGuideSlugs.find((slug) =>
    slug.startsWith("how-to-choose"),
  );
  if (choose) {
    return {
      contentId: `content:guide:${choose}`,
      label: "How to choose",
    };
  }
  const category = guide.categorySlugs[0];
  if (!category) return null;
  return {
    contentId: `content:best:${category}-software`,
    label: `Best ${titleCase(category)} software`,
  };
}

function exampleSections(guide: GuidePage): GuidePage["sections"] {
  for (const block of guide.blocks ?? []) {
    if (block.type !== "step") continue;
    const match = block.body.match(
      /(?:Worked example:|Example:)[^\n]+(?:\n\n[^\n]+)?/i,
    );
    if (match) {
      return [
        {
          id: "worked-example",
          heading: "Worked example",
          body: match[0]!.replace(/^(?:Worked example:|Example:)\s*/i, "For example, "),
        },
      ];
    }
    if (/example/i.test(block.body)) {
      return [
        {
          id: "worked-example",
          heading: "Worked example",
          body: block.body,
        },
      ];
    }
  }
  if (guide.summary) {
    return [
      {
        id: "worked-example",
        heading: "Worked example",
        body: `For example, use this page when you need a decision rule before a vendor demo: ${guide.summary}`,
      },
    ];
  }
  return [];
}

function faqFromBlocks(
  blocks: GuideBlock[],
): GuidePage["faq"] {
  const faq = blocks.find((block) => block.type === "faq");
  if (!faq || faq.type !== "faq") return [];
  return faq.items.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}

function checklistFromDirectAnswer(
  blocks: GuideBlock[],
): GuidePage["checklist"] {
  const answer = blocks.find((block) => block.type === "direct-answer");
  if (!answer || answer.type !== "direct-answer" || !answer.bullets) return [];
  return answer.bullets.slice(0, 4).map((label, order) => ({
    id: `check-${order}`,
    label,
    description: "Confirm this against the weekly job before you shortlist vendors.",
    order,
  }));
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
