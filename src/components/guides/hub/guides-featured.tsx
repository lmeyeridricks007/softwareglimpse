import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { FeaturedGuideArt } from "@/components/guides/hub/guide-illustrations";
import type { GuidesHubGuideCard } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  guide: GuidesHubGuideCard;
  className?: string;
};

export function GuidesFeatured({ guide, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/15 bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)] p-5 sm:p-8 lg:p-10",
        className,
      )}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        {guide.image?.src ? (
          <div className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white shadow-[var(--sg-shadow-sm)]">
            <Image
              src={guide.image.src}
              alt={guide.image.alt}
              width={1200}
              height={750}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-auto w-full object-contain object-center"
              priority
            />
          </div>
        ) : (
          <FeaturedGuideArt />
        )}

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-navy)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Featured guide
            </span>
            {guide.categoryLabel ? (
              <span className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {guide.categoryLabel}
              </span>
            ) : null}
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {guide.readingMinutes} min read
            </span>
          </div>

          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.5vw,2rem)] font-semibold leading-tight text-[var(--sg-color-navy)]">
            <Link
              href={guide.href}
              className="hover:text-[var(--sg-color-primary)]"
            >
              {guide.title}
            </Link>
          </h2>

          {guide.summary ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
              {guide.summary}
            </p>
          ) : null}

          {guide.learnPoints.length > 0 ? (
            <ul className="mt-5 space-y-2.5">
              {guide.learnPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm text-[var(--sg-color-text)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}

          <ButtonLink href={guide.href} className="mt-7" size="lg">
            Read the guide →
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
