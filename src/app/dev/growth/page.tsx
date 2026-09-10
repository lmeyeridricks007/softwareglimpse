import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { GrowthDashboardView } from "@/components/growth/growth-dashboard-view";
import { buildGrowthDashboard } from "@/services/seo/growth-dashboard";
import { getExpectedGrowthSecret } from "@/services/seo/growth-dashboard/access";
import { buildPageMetadata } from "@/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Growth Dashboard",
  description:
    "Internal SoftwareGlimpse growth dashboard — not for indexing or public use.",
  path: "/dev/growth/",
  indexable: false,
  nofollow: true,
  pageType: "internal",
});

type Props = {
  searchParams: Promise<{ secret?: string }>;
};

/**
 * Internal growth dashboard. Requires ?secret=GROWTH_SECRET|TESTING_SECRET|PREVIEW_SECRET.
 */
export default async function GrowthDashboardPage({ searchParams }: Props) {
  const expected = getExpectedGrowthSecret();
  const { secret } = await searchParams;

  if (!expected || secret !== expected) {
    notFound();
  }

  const report = buildGrowthDashboard();

  return (
    <PageContainer size="wide" className="py-10">
      <h1 className="text-3xl font-bold">Growth Dashboard</h1>
      <p className="mt-2 max-w-3xl text-[var(--sg-color-text-muted)]">
        Is SoftwareGlimpse becoming a stronger organic search and
        software-intelligence property? Measurement only — generated{" "}
        {new Date(report.generatedAt).toLocaleString()}.
      </p>
      <GrowthDashboardView report={report} />
    </PageContainer>
  );
}
