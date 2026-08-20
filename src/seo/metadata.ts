import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import {
  absoluteAssetUrl,
  canonicalUrl,
  defaultOgImageUrl,
  normalizePath,
  stripSiteNameSuffix,
} from "@/seo/canonical";
import type { IndexabilityDecision, SeoPageType } from "@/seo/indexability";
import type { BreadcrumbItem } from "@/seo/breadcrumbs";

export type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
  /** Explicit nofollow — defaults false (soft-publish stays crawl-followable). */
  nofollow?: boolean;
  ogType?: "website" | "article";
  /** Absolute URL or site path for OG/Twitter image. Defaults to site share image. */
  ogImage?: string | null;
  pageType?: SeoPageType;
};

/**
 * Framework-native Next.js Metadata from a small SEO definition.
 * Titles should be bare (no `| SoftwareGlimpse`) — root layout template adds the brand.
 */
export function buildPageMetadata(input: BuildMetadataInput): Metadata {
  const path = normalizePath(input.path);
  const canonical = canonicalUrl(path);
  const indexable = input.indexable ?? false;
  const follow = input.nofollow ? false : true;
  const title = stripSiteNameSuffix(input.title);
  const description = input.description.trim();
  const ogImage = resolveOgImage(input.ogImage);

  const robots = {
    index: indexable,
    follow,
    googleBot: {
      index: indexable,
      follow,
    },
  };

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: input.ogType ?? "website",
      locale: "en_US",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function buildPageMetadataFromDecision(
  input: Omit<BuildMetadataInput, "indexable" | "nofollow"> & {
    decision: IndexabilityDecision;
  },
): Metadata {
  return buildPageMetadata({
    ...input,
    indexable: input.decision.indexable,
    nofollow: input.decision.nofollow,
  });
}

function resolveOgImage(ogImage: string | null | undefined): string {
  if (!ogImage) return defaultOgImageUrl();
  if (/^https?:\/\//i.test(ogImage)) return absoluteAssetUrl(ogImage);
  return absoluteAssetUrl(ogImage);
}

/**
 * @deprecated Prefer bare titles + root `title.template`.
 * Still strips duplicate brand if present.
 */
export function buildTitle(pageTitle: string): string {
  const bare = stripSiteNameSuffix(pageTitle);
  if (bare === SITE_NAME) return SITE_NAME;
  return `${bare} | ${SITE_NAME}`;
}

export type SeoPageDefinition = {
  canonicalPath: string;
  title: string;
  description: string;
  indexability: IndexabilityDecision;
  pageType: SeoPageType;
  breadcrumbs?: BreadcrumbItem[];
  ogType?: "website" | "article";
  ogImage?: string | null;
};

export function metadataFromSeoDefinition(def: SeoPageDefinition): Metadata {
  return buildPageMetadataFromDecision({
    title: def.title,
    description: def.description,
    path: def.canonicalPath,
    decision: def.indexability,
    ogType: def.ogType,
    ogImage: def.ogImage,
    pageType: def.pageType,
  });
}
