import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ProductTestingWorkspace } from "@/components/product-testing/product-testing-workspace";
import { getSoftware } from "@/data";
import { ensureTestingStoreDirs } from "@/data/editorial/testing/store";
import { listTestProtocols } from "@/data/editorial/testing/protocols";
import {
  buildProductTestingQueue,
  listTestSessions,
} from "@/services/product-testing";
import { getExpectedTestingSecret } from "@/services/product-testing/access";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Product testing workspace",
  description:
    "Internal human product testing workspace — not for indexing or public use.",
  path: "/dev/product-testing/",
  indexable: false,
  nofollow: true,
  pageType: "internal",
});

type Props = {
  searchParams: Promise<{ secret?: string }>;
};

/**
 * Internal testing workspace. Requires ?secret=TESTING_SECRET|PREVIEW_SECRET.
 * Unfinished sessions are never exposed on public product pages.
 */
export default async function ProductTestingPage({ searchParams }: Props) {
  const expected = getExpectedTestingSecret();
  const { secret } = await searchParams;

  if (!expected || secret !== expected) {
    notFound();
  }

  ensureTestingStoreDirs();

  const products = getSoftware({ includeUnpublished: true })
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      categorySlug: s.primaryCategorySlug,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const protocols = listTestProtocols();
  const queue = buildProductTestingQueue(10);

  return (
    <PageContainer size="wide" className="py-10">
      <h1 className="text-3xl font-bold">Product testing workspace</h1>
      <p className="mt-2 max-w-3xl text-[var(--sg-color-text-muted)]">
        Human-first hands-on sessions. AI must not claim SoftwareGlimpse tested a
        product unless a completed session with a real tester exists here. Tasks
        never auto-PASS — finish requires every required task recorded plus
        strengths or weaknesses.
      </p>
      <div className="mt-8">
        <ProductTestingWorkspace
          secret={secret}
          products={products}
          queueItems={queue.items.map((i) => ({
            rank: i.rank,
            slug: i.productSlug,
            name: i.productName,
            categorySlug: i.categorySlug ?? "crm",
            evidenceLevel: i.evidenceLevel,
            impressions: i.impressions,
            comparisonCount: i.comparisonCount,
          }))}
          protocols={protocols.map((p) => ({
            slug: p.slug,
            name: p.name,
            categorySlug: p.categorySlug,
            version: p.version,
            taskCount: p.tasks.length,
          }))}
          protocolDetails={protocols}
          initialSessions={listTestSessions()}
        />
      </div>
    </PageContainer>
  );
}
