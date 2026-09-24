import type { Metadata } from "next";
import { Suspense } from "react";
import {
  SearchDiscoveryShell,
  SearchFromQuery,
} from "@/components/search/search-from-query";
import { buildDiscoveryHub } from "@/services/search";
import { buildPageMetadataFromDecision } from "@/seo/metadata";
import { indexabilityForUtility } from "@/seo/indexability";

export const metadata: Metadata = buildPageMetadataFromDecision({
  title: "Search SoftwareGlimpse",
  description:
    "Find software, comparisons, guides, tools, resources, features and requirements across SoftwareGlimpse.",
  path: "/search/",
  decision: indexabilityForUtility("search"),
  pageType: "search",
});

export default function SearchPage() {
  const hub = buildDiscoveryHub();
  return (
    <Suspense fallback={<SearchDiscoveryShell hub={hub} />}>
      <SearchFromQuery hub={hub} />
    </Suspense>
  );
}
