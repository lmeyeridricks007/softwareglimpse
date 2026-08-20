import { createElement } from "react";
import { CheckCircle2 } from "lucide-react";
import { TipCallout } from "@/components/guides/guide-visuals";
import {
  iconForGuideSection,
  toneForGuideSection,
  toneKeyForGuideSection,
} from "@/components/guides/guide-section-icons";
import { cn } from "@/lib/cn";

export type GuideSectionBlock = {
  id: string;
  heading: string;
  body: string;
  tip?: string;
};

type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  order?: number;
};

type KeyPoint = {
  title: string;
  body: string;
};

type Props = {
  sections: GuideSectionBlock[];
  checklist?: ChecklistItem[];
  keyPoints?: KeyPoint[];
  /** When true, prefix headings with 1. 2. 3. (supporting-article mockup). */
  numbered?: boolean;
  className?: string;
};

/**
 * Legacy section renderer — kept for drafts without blocks.
 * Prefer GuideBlocksRenderer + guide-template for published guides.
 */
export function GuideBody({
  sections,
  checklist = [],
  keyPoints = [],
  numbered = true,
  className,
}: Props) {
  return (
    <div className={cn("space-y-12", className)}>
      {sections.map((section, index) => {
        const Icon = iconForGuideSection(section.id, index);
        const tone = toneForGuideSection(section.id, index);
        const toneKey = toneKeyForGuideSection(section.id, index);
        const heading = numbered
          ? `${index + 1}. ${section.heading.replace(/^\d+\.\s*/, "")}`
          : section.heading;

        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28"
          >
            <div className="flex gap-4">
              <span
                data-tone={toneKey}
                className={cn(
                  "sg-guide-icon-chip mt-1 hidden size-12 shrink-0 sm:inline-flex",
                  tone,
                )}
              >
                {createElement(Icon, {
                  className: "size-6",
                  "aria-hidden": true,
                })}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
                  {heading}
                </h2>
                <GuideParagraphs body={section.body} />
                {section.tip ? (
                  <TipCallout className="mt-5" tone="info">
                    <p className="font-semibold text-[var(--sg-color-text)]">
                      Tip
                    </p>
                    <p className="mt-1 text-[var(--sg-color-text-muted)]">
                      {section.tip}
                    </p>
                  </TipCallout>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      {keyPoints.length > 0 ? (
        <section id="key-concepts" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Key concepts
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {keyPoints.map((point) => (
              <li key={point.title} className="sg-guide-card p-4">
                <p className="font-semibold text-[var(--sg-color-text)]">
                  {point.title}
                </p>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {checklist.length > 0 ? (
        <section id="checklist" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Checklist
          </h2>
          <ul className="mt-4 space-y-3">
            {[...checklist]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((item) => (
                <li key={item.id} className="flex gap-3 text-sm">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-[var(--sg-color-text)]">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="text-[var(--sg-color-text-muted)]">
                        {" "}
                        — {item.description}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function GuideParagraphs({ body }: { body: string }) {
  const blocks = body
    .split(/\n{2,}/u)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="mt-4 space-y-4 text-[length:var(--sg-text-body)] leading-relaxed text-[var(--sg-color-text-muted)]">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const bulletLines = lines.filter((l) => /^[-*•]\s+/.test(l));
        if (bulletLines.length >= 2 && bulletLines.length === lines.length) {
          return (
            <ul key={index} className="space-y-2">
              {bulletLines.map((line) => (
                <li key={line} className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  <span>{line.replace(/^[-*•]\s+/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
