"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UseCaseWorkflowVideo } from "@/components/software/hub/use-case-workflow-video";
import {
  SoftwareHubFinderCta,
  SoftwareHubQuickFacts,
} from "@/components/software/hub/software-hub-sidebar";
import { SoftwareHubPopularComparisons } from "@/components/software/hub/software-product-hub-shell";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import { buildUseCaseTabMediaMap } from "@/services/product-media/context-tab-media";
import { cn } from "@/lib/cn";

const SCENARIO_ICONS = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-orange-100 text-orange-700",
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

type Props = {
  model: SoftwareReviewModel;
};

export function SoftwareHubUseCasesTab({ model }: Props) {
  const software = model.software;

  const mediaByUseCase = useMemo(
    () =>
      buildUseCaseTabMediaMap({
        media: model.media,
        screenshots: model.screenshots,
        useCaseSlugs: model.useCases.map((uc) => uc.slug),
        overviewVideoIds: model.overviewVideos.map((v) => v.id),
        maxVideos: 3,
      }),
    [model.media, model.screenshots, model.useCases, model.overviewVideos],
  );

  const scenarios = model.useCases.map((uc, index) => {
    const why =
      model.deepReview.productExperience?.workflowSteps.find(
        (s) => s.featureSlug === uc.slug,
      )?.description ??
      model.pros[index] ??
      null;
    const bundle = mediaByUseCase.get(uc.slug);
    return {
      ...uc,
      bullets: [
        uc.description,
        model.bestFor[index] ?? null,
        model.deepReview.whyWeLike[index] ?? null,
      ].filter(Boolean) as string[],
      why,
      video: bundle?.video ?? null,
      diagram: bundle?.diagram ?? null,
    };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            How {software.name} fits different sales scenarios
          </h2>
          <p className="mt-2 max-w-3xl text-[var(--sg-color-text-muted)]">
            Use cases pair SoftwareGlimpse fit analysis with official workflow
            demos when ResearchMedia is linked — not brand promo videos from
            Overview.
          </p>
        </div>

        {scenarios.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
            Use-case mappings are still being added for {software.name}.
          </Card>
        ) : (
          <ul className="space-y-5">
            {            scenarios.map((scenario, index) => {
              const hasMedia = Boolean(scenario.video || scenario.diagram);
              return (
                <li key={scenario.slug} id={`use-case-${scenario.slug}`}>
                  <Card className="p-5">
                    <div
                      className={cn(
                        "grid gap-5",
                        hasMedia &&
                          "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start",
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <span
                            className={`inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold ${SCENARIO_ICONS[index % SCENARIO_ICONS.length]}`}
                          >
                            {index + 1}
                          </span>
                          <Badge variant="neutral">Use case</Badge>
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-[var(--sg-color-text)]">
                          {scenario.name}
                        </h3>
                        {scenario.description ? (
                          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                            {scenario.description}
                          </p>
                        ) : null}
                        {scenario.bullets.length > 0 ? (
                          <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                            {scenario.bullets.slice(0, 3).map((b) => (
                              <li key={b} className="flex gap-2">
                                <span
                                  className="text-[var(--sg-color-success)]"
                                  aria-hidden
                                >
                                  ✓
                                </span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {scenario.why ? (
                          <div className="mt-4 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] p-3 text-sm">
                            <p className="font-medium text-[var(--sg-color-text)]">
                              SoftwareGlimpse fit analysis
                            </p>
                            <p className="mt-1 text-[var(--sg-color-text-muted)]">
                              {scenario.why}
                            </p>
                          </div>
                        ) : null}
                        <Link
                          href={scenario.href}
                          className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          Explore use case →
                        </Link>
                      </div>

                      {scenario.video || scenario.diagram ? (
                        <div className="min-w-0 space-y-4">
                          {scenario.diagram ? (
                            <figure className="space-y-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={scenario.diagram.src}
                                alt={scenario.diagram.alt}
                                className="w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]"
                              />
                              {scenario.diagram.caption ? (
                                <figcaption className="text-xs text-[var(--sg-color-text-muted)]">
                                  {scenario.diagram.caption}
                                </figcaption>
                              ) : null}
                            </figure>
                          ) : null}
                          {scenario.video ? (
                            <UseCaseWorkflowVideo
                              vendorName={software.name}
                              video={scenario.video}
                              fitAnalysis={null}
                            />
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        {model.useCases.length > 0 ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                More ways to use {software.name}
              </h3>
              <Link
                href="/use-cases/"
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                View all use cases →
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.useCases.map((uc) => (
                <Link
                  key={uc.slug}
                  href={uc.href}
                  className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-primary-soft)] px-3 py-1.5 text-sm text-[var(--sg-color-primary-hover)]"
                >
                  {uc.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-xs text-[var(--sg-color-text-muted)]">
          Use case information is based on product evidence and common customer
          workflows. Official demos illustrate vendor workflows; they are not
          SoftwareGlimpse testing claims.
        </p>
      </div>

      <aside className="space-y-5">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Who {software.name} is best for
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            {model.bestFor.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--sg-color-success)]" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
        <SoftwareHubQuickFacts
          facts={model.quickFacts}
          productSlug={software.slug}
          productName={software.name}
        />
        {model.finderHref ? (
          <SoftwareHubFinderCta
            title={`Not sure if ${software.name} fits?`}
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}
        <SoftwareHubPopularComparisons items={model.comparisonLinks} />
        <Link
          href={
            model.alternativesHref ??
            softwareHubPath(software.slug, "alternatives")
          }
          className="inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Browse alternatives →
        </Link>
      </aside>
    </div>
  );
}
