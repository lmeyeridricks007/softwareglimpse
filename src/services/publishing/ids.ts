import {
  buildContentId,
  contentIdToFileToken,
  fileTokenToContentId,
  parseContentId,
  type ContentId,
  type ContentType,
} from "@/domain";

export {
  buildContentId,
  contentIdToFileToken,
  fileTokenToContentId,
  parseContentId,
};

export function softwareContentId(slug: string): ContentId {
  return buildContentId("software", slug);
}

export function categoryContentId(slug: string): ContentId {
  return buildContentId("category", slug);
}

export function comparisonContentId(slug: string): ContentId {
  return buildContentId("comparison", slug);
}

export function alternativesContentId(slug: string): ContentId {
  return buildContentId("alternatives", slug);
}

export function bestContentId(slug: string): ContentId {
  return buildContentId("best", slug);
}

export function pricingContentId(slug: string): ContentId {
  return buildContentId("pricing", slug);
}

export function toolContentId(slug: string): ContentId {
  return buildContentId("tool", slug);
}

export function guideContentId(slug: string): ContentId {
  return buildContentId("guide", slug);
}

export function pathForContent(type: ContentType, slug: string): string {
  switch (type) {
    case "software":
      return `/software/${slug}/`;
    case "category":
      return `/categories/${slug}/`;
    case "comparison":
      return `/compare/${slug}/`;
    case "alternatives":
      return `/alternatives/${slug}/`;
    case "best":
      return `/best/${slug}/`;
    case "pricing":
      return `/pricing/${slug}/`;
    case "tool":
      return `/tools/${slug}/`;
    case "guide":
      return `/guides/${slug}/`;
    case "industry":
      return `/industries/${slug}/`;
    case "use-case":
      return `/use-cases/${slug}/`;
    default:
      return `/${type}/${slug}/`;
  }
}
