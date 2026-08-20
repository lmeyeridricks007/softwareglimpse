import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GuideCover } from "@/components/guides/hub/guide-illustrations";
import { ImplementationSetupVideo } from "@/components/software/hub/implementation-setup-video";
import {
  SoftwareHubFinderCta,
  SoftwareHubQuickFacts,
} from "@/components/software/hub/software-hub-sidebar";
import { SoftwareHubPopularComparisons } from "@/components/software/hub/software-product-hub-shell";
import type {
  ReviewGuideCard,
  SoftwareReviewModel,
} from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import {
  resolveImplementationRelatedLinks,
  selectImplementationContextVideos,
} from "@/services/product-media/context-tab-media";

type Props = {
  model: SoftwareReviewModel;
};

const KIND_ORDER = [
  "setup",
  "implementation",
  "migration",
  "pricing-education",
  "selection",
] as const;

function kindLabel(topicType: string): string {
  switch (topicType) {
    case "setup":
      return "Setup";
    case "implementation":
      return "Implementation";
    case "migration":
      return "Migration";
    case "pricing-education":
      return "Plans";
    case "selection":
      return "Worth it?";
    default:
      return "Guide";
  }
}

function sortGuides(guides: ReviewGuideCard[]): ReviewGuideCard[] {
  return [...guides].sort((a, b) => {
    const ai = KIND_ORDER.indexOf(
      a.topicType as (typeof KIND_ORDER)[number],
    );
    const bi = KIND_ORDER.indexOf(
      b.topicType as (typeof KIND_ORDER)[number],
    );
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    if (aRank !== bRank) return aRank - bRank;
    return a.title.localeCompare(b.title);
  });
}

export function SoftwareHubGuidesTab({ model }: Props) {
  const software = model.software;
  const categorySlug = software.primaryCategorySlug;
  const isSalesIntelligence = categorySlug === "sales-intelligence";
  const guidesHubLabel = isSalesIntelligence
    ? "Sales intelligence guides"
    : categorySlug === "crm"
      ? "CRM guides hub"
      : categorySlug === "marketing"
        ? "Marketing guides hub"
        : categorySlug === "email-marketing"
          ? "Email marketing guides hub"
          : categorySlug === "hr"
            ? "HR guides hub"
            : categorySlug === "project-management"
              ? "Project management guides hub"
              : "Guides hub";
  const allGuidesLabel = isSalesIntelligence
    ? "All guides →"
    : categorySlug === "crm"
      ? "All CRM guides →"
      : categorySlug === "marketing"
        ? "All marketing guides →"
        : categorySlug === "hr"
          ? "All HR guides →"
          : categorySlug === "project-management"
            ? "All PM guides →"
            : "All guides →";
  const finderDescription = isSalesIntelligence
    ? `Compare ${software.name} against other sales intelligence options using the same requirements.`
    : categorySlug === "crm"
      ? `Use CRM Finder to compare ${software.name} against other options.`
      : `Compare ${software.name} against other options with the same requirements.`;

  const guides = sortGuides(
    model.guides.filter((g) => g.href.startsWith("/guides/")),
  );

  const setupVideos = selectImplementationContextVideos({
    media: model.media,
    overviewVideoIds: model.overviewVideos.map((v) => v.id),
    limit: 1,
  });
  const setupVideo = setupVideos[0] ?? null;

  const related = resolveImplementationRelatedLinks({
    guides: model.guides.map((g) => ({
      href: g.href,
      title: g.title,
      topicType: g.topicType,
    })),
    requirementSlug: "separate-sales-processes",
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        {setupVideo ? (
          <ImplementationSetupVideo
            productName={software.name}
            video={setupVideo}
            related={related}
          />
        ) : null}

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            {software.name} guides
          </h2>
          <p className="mt-2 max-w-3xl text-[var(--sg-color-text-muted)]">
            Practical walkthroughs for setup, rollout, migration, plan choice, and
            fit — linked from this review so you can decide and implement without
            hunting the guides hub.
          </p>

          {guides.length === 0 ? (
            <div className="mt-6 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-6 text-sm text-[var(--sg-color-text-muted)]">
              Product guides for {software.name} are not published yet. Browse the{" "}
              <Link
                href="/guides/"
                className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {guidesHubLabel}
              </Link>{" "}
              for category buying and selection frameworks.
            </div>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {guides.map((guide) => (
                <li key={guide.href}>
                  <Link href={guide.href} className="group block h-full">
                    <article className="flex h-full flex-col overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]/35 hover:shadow-[var(--sg-shadow-md)]">
                      <div className="relative">
                        <GuideCover
                          image={guide.image}
                          topicType={guide.topicType}
                          className="h-[9.5rem] rounded-none border-0 border-b border-[var(--sg-color-border)]"
                        />
                        <Badge
                          variant="neutral"
                          className="absolute right-3 top-3 bg-white/95 text-[11px] shadow-sm backdrop-blur-sm"
                        >
                          {kindLabel(guide.topicType)}
                        </Badge>
                      </div>
                      <div className="flex flex-1 flex-col p-5 pt-4">
                        <h3 className="text-base font-semibold leading-snug text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                          {guide.title}
                        </h3>
                        {guide.summary ? (
                          <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                            {guide.summary}
                          </p>
                        ) : (
                          <span className="flex-1" />
                        )}
                        <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                          Read guide
                          <ArrowRight className="size-3.5" aria-hidden />
                        </p>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/guides/"
              className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 text-sm font-medium"
            >
              {allGuidesLabel}
            </Link>
            <Link
              href={softwareHubPath(software.slug, "pricing")}
              className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 text-sm font-medium"
            >
              {software.name} pricing tab →
            </Link>
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <SoftwareHubQuickFacts
          facts={model.quickFacts}
          productSlug={software.slug}
          productName={software.name}
        />
        {model.finderHref ? (
          <SoftwareHubFinderCta
            title={`Still choosing?`}
            description={finderDescription}
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}
        <SoftwareHubPopularComparisons items={model.comparisonLinks} />
      </aside>
    </div>
  );
}
