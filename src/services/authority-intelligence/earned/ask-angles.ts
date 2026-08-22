/**
 * Build actionable request/submit guidance for earned opportunities.
 * Does not send outreach — drafts human-ready ask copy only.
 *
 * Page titles come from the live linkable inventory (tools registry +
 * resources seed + curated guides) so asks stay aligned with published pages.
 */

import { inventoryLinkableAssets } from "../linkable-assets";

const SITE_ORIGIN = "https://www.softwareglimpse.com";

function buildPageNames(): Record<string, string> {
  const names: Record<string, string> = {
    "/methodology/": "SoftwareGlimpse methodology",
    "/compare/": "CRM comparison research",
  };
  for (const asset of inventoryLinkableAssets()) {
    if (asset.path && asset.name) names[asset.path] = asset.name;
  }
  return names;
}

const PAGE_NAMES = buildPageNames();

export function absoluteSgUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}

export function sgPageName(path?: string): string {
  if (!path) return "a relevant SoftwareGlimpse buyer resource";
  return PAGE_NAMES[path] ?? path;
}

export type AskBundle = {
  targetPagePath: string;
  targetPageUrl: string;
  targetPageName: string;
  /** Direct URL where a human should submit, contribute, or start the request */
  submitOrContactUrl: string;
  /** How to submit / request (steps) */
  howToSubmitOrRequest: string;
  /** Suggested ask / pitch angle for the editor or maintainer */
  suggestedAsk: string;
};

export function buildAskBundle(input: {
  opportunityUrl: string;
  opportunityTitle: string;
  type: string;
  relevantSgPage?: string;
  contactPath?: string;
  submissionPath?: string;
  whyTheyMightLink: string;
}): AskBundle {
  const targetPagePath =
    input.relevantSgPage ?? "/resources/crm-evaluation-checklist/";
  const targetPageUrl =
    absoluteSgUrl(targetPagePath) ??
    `${SITE_ORIGIN}/resources/crm-evaluation-checklist/`;
  const targetPageName = sgPageName(targetPagePath);

  const urlFromContact = extractHttpUrl(input.contactPath);
  const urlFromSubmission = extractHttpUrl(input.submissionPath);
  const submitOrContactUrl =
    urlFromSubmission ?? urlFromContact ?? input.opportunityUrl;

  let howToSubmitOrRequest: string;
  if (input.submissionPath && input.contactPath) {
    howToSubmitOrRequest = `${normalizeStep(input.submissionPath, submitOrContactUrl)} Contact/route: ${input.contactPath}. Ask them to cite/link ${targetPageName} (${targetPageUrl}).`;
  } else if (input.submissionPath) {
    howToSubmitOrRequest = `${normalizeStep(input.submissionPath, submitOrContactUrl)} Propose adding ${targetPageName} (${targetPageUrl}) as a complementary resource.`;
  } else if (input.contactPath) {
    howToSubmitOrRequest = `Open ${submitOrContactUrl}. Use contact route: ${input.contactPath}. Request a citation/link to ${targetPageName} (${targetPageUrl}).`;
  } else if (/github\.com/i.test(input.opportunityUrl)) {
    howToSubmitOrRequest = `Open ${input.opportunityUrl} → Issues or Pull Request. Propose adding ${targetPageName} (${targetPageUrl}) under Resources / Related tools.`;
  } else if (
    input.type === "RESOURCE_PAGE" ||
    input.type === "TEMPLATE_CITATION" ||
    input.type === "TOOL_CITATION"
  ) {
    howToSubmitOrRequest = `Open the resource page (${input.opportunityUrl}). Find About/Contact/Contribute, or reply via the site’s editorial contact. Ask to add ${targetPageName} (${targetPageUrl}) to the resource list because it helps their readers with vendor-neutral software selection/evaluation.`;
  } else if (input.type === "ACADEMIC_EDUCATIONAL") {
    howToSubmitOrRequest = `Open ${input.opportunityUrl}. Contact the page author/department listed on the page (or .edu contact). Suggest citing ${targetPageName} (${targetPageUrl}) as a free practical worksheet/tool for students or trainees.`;
  } else {
    howToSubmitOrRequest = `Open ${input.opportunityUrl}. Locate editorial/about/contact. Request a citation to ${targetPageName} (${targetPageUrl}) only where it genuinely helps their readers.`;
  }

  const suggestedAsk = buildSuggestedAsk({
    type: input.type,
    opportunityTitle: input.opportunityTitle,
    targetPageName,
    targetPageUrl,
    whyTheyMightLink: input.whyTheyMightLink,
  });

  return {
    targetPagePath,
    targetPageUrl,
    targetPageName,
    submitOrContactUrl,
    howToSubmitOrRequest,
    suggestedAsk,
  };
}

function extractHttpUrl(text?: string): string | undefined {
  if (!text) return undefined;
  const m = text.match(/https?:\/\/[^\s)]+/i);
  return m?.[0]?.replace(/[.,;:]+$/, "");
}

/** Prefer submissionPath as-is when it already includes Open/URL instructions. */
function normalizeStep(submissionPath: string, submitUrl: string): string {
  if (/^open\s+https?:\/\//i.test(submissionPath.trim())) {
    return `${submissionPath.trim()}.`;
  }
  if (submissionPath.includes("http://") || submissionPath.includes("https://")) {
    return `${submissionPath.trim()}.`;
  }
  return `Open ${submitUrl} → ${submissionPath}.`;
}

function buildSuggestedAsk(input: {
  type: string;
  opportunityTitle: string;
  targetPageName: string;
  targetPageUrl: string;
  whyTheyMightLink: string;
}): string {
  const fit = input.whyTheyMightLink.replace(/\s+/g, " ").trim();
  const fitShort =
    fit.length > 180 ? `${fit.slice(0, 177)}…` : fit;

  if (
    input.type === "RESOURCE_PAGE" ||
    input.type === "TEMPLATE_CITATION" ||
    input.type === "TOOL_CITATION"
  ) {
    return `Hi — I noticed “${input.opportunityTitle}” already helps people evaluate software and tooling. ${fitShort} Would you consider adding our free ${input.targetPageName} for readers? Link: ${input.targetPageUrl} Happy to adjust title/blurb to match your list style.`;
  }

  if (input.type === "ACADEMIC_EDUCATIONAL") {
    return `Hello — your page “${input.opportunityTitle}” is a strong educational resource. We publish a free ${input.targetPageName} students/practitioners can use without signup: ${input.targetPageUrl}. If it fits your materials, a citation would help learners apply the concepts.`;
  }

  if (input.type === "ASSOCIATION" || input.type === "COMMUNITY") {
    return `Hi — for members researching software selection, we offer a free ${input.targetPageName} (${input.targetPageUrl}). ${fitShort} Open to listing it in your resources, or swapping a short member tip?`;
  }

  return `Hi — regarding “${input.opportunityTitle}”: ${fitShort} If useful for your audience, here’s our free ${input.targetPageName}: ${input.targetPageUrl}. Glad to rephrase the mention to your house style.`;
}
