import Link from "next/link";
import { ShareComparisonButton } from "@/components/comparison/share-comparison-button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import type { ComparisonPageChrome } from "@/components/comparison/page/comparison-page-client";

type Props = {
  chrome: ComparisonPageChrome;
  className?: string;
};

export function ComparisonPageHeader({ chrome, className }: Props) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Comparisons", path: "/compare/" },
    { name: chrome.title, path: `/compare/${chrome.slug}/` },
  ];

  return (
    <header className={className ?? "mt-2"}>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-2">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-text)]">
          {chrome.title}
        </h1>
        <p className="mt-2 max-w-3xl text-[var(--sg-color-text-muted)]">
          {chrome.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--sg-color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full bg-[var(--sg-color-success)]"
              aria-hidden
            />
            Independently recommended
          </span>
          {chrome.lastUpdated ? (
            <span>Last updated {chrome.lastUpdated}</span>
          ) : null}
          {chrome.evidenceSourceCount > 0 ? (
            <span>
              {chrome.evidenceSourceCount} evidence source
              {chrome.evidenceSourceCount === 1 ? "" : "s"}
            </span>
          ) : null}
          {chrome.screenshotCount > 0 ? (
            <span>
              {chrome.screenshotCount} screenshot
              {chrome.screenshotCount === 1 ? "" : "s"}
            </span>
          ) : null}
          <Link
            href={chrome.howWeReviewHref}
            className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
          >
            How we compare
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ShareComparisonButton title={chrome.title} />
          <ButtonLink href="/compare/" variant="outline" size="sm">
            Compare another
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
