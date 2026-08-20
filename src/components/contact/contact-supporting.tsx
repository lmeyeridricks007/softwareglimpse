"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  Check,
  ChevronDown,
  Handshake,
  Scale,
  Shield,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import type { ContactReason } from "@/domain";

type SelectReason = (reason: ContactReason) => void;

const correctionChecks = [
  "outdated pricing",
  "feature changes",
  "broken links",
  "incorrect product information",
  "misleading comparison context",
] as const;

export const CONTACT_FAQ_ITEMS = [
  {
    question: "How do I report incorrect software information?",
    answer:
      "Choose “Correction / factual issue”, include the page URL, describe what looks wrong, and share the correct information or a supporting source if you have one. Corrections help keep SoftwareGlimpse current.",
  },
  {
    question: "Can software vendors submit corrections?",
    answer:
      "Yes. Use the software / vendor enquiry route to share product changes, pricing updates, documentation, or factual corrections. Providing information does not guarantee inclusion, ranking, or a favorable editorial assessment.",
  },
  {
    question: "Can vendors pay to change rankings?",
    answer:
      "No. Affiliate relationships and commercial discussions never determine rankings, Finder results, or editorial conclusions. We currently do not offer sponsored rankings or paid editorial placement.",
  },
  {
    question: "How do I contact SoftwareGlimpse about an affiliate partnership?",
    answer:
      "Select “Affiliate / partnership” and tell us about your company and proposal. Affiliate status does not influence editorial rankings.",
  },
  {
    question: "How do I submit a privacy request?",
    answer:
      "Choose “Privacy” on this form (or use the dedicated privacy request page) and state whether you need access, deletion, correction, unsubscribe handling, or another privacy action. Share only what is needed.",
  },
  {
    question: "How do I report an accessibility problem?",
    answer:
      "Choose “Technical / accessibility issue”, include the page or interaction that is difficult to use, and describe the barrier. You can also review our accessibility statement.",
  },
  {
    question: "Does submitting this form subscribe me to marketing emails?",
    answer:
      "No. Contact submissions are used to respond to your request according to the Privacy Policy. They do not subscribe you to marketing.",
  },
  {
    question: "Do you offer sponsored placements?",
    answer:
      "We currently do not offer sponsored rankings or paid editorial placement. Commercial enquiries are welcome, but they do not rewrite editorial outcomes.",
  },
] as const;

export function ContactSupportingSections({
  onSelectReason,
}: {
  onSelectReason: SelectReason;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="flex h-full flex-col p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          Found something outdated?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          We regularly review software pricing, features and product
          information, but software changes quickly. If you spot:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
          {correctionChecks.map((item) => (
            <li key={item} className="flex gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          send us the page and correction.
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Button type="button" onClick={() => onSelectReason("correction")}>
            Report a correction
          </Button>
          <Link
            href={COMPANY_ROUTES.howWeReview}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            How we review software →
          </Link>
        </div>
      </Card>

      <Card className="flex h-full flex-col p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          Are you a software vendor?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          We welcome factual product corrections and updated source material.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
          <li>Product changes</li>
          <li>Pricing changes</li>
          <li>Feature documentation</li>
          <li>Official screenshots</li>
          <li>Updated help documentation</li>
          <li>Corrections to factual information</li>
        </ul>
        <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
          Providing information does not guarantee inclusion, ranking or a
          favorable editorial assessment.
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Button type="button" onClick={() => onSelectReason("vendor")}>
            Send vendor information
          </Button>
          <Link
            href={COMPANY_ROUTES.methodology}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Editorial methodology →
          </Link>
        </div>
      </Card>

      <Card className="flex h-full flex-col p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          Partnerships &amp; affiliates
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          SoftwareGlimpse may use affiliate relationships where appropriate, but
          affiliate status does not determine rankings, Finder results or
          editorial conclusions.
        </p>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          We currently do not offer sponsored rankings or paid editorial
          placement.
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Button type="button" onClick={() => onSelectReason("affiliate")}>
            Partnership enquiry
          </Button>
          <Link
            href={LEGAL_ROUTES.affiliateDisclosure}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Affiliate disclosure →
          </Link>
        </div>
      </Card>

      <Card className="flex h-full flex-col gap-4 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          Privacy &amp; accessibility
        </h2>
        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-4">
          <div className="flex items-start gap-3">
            <Shield
              className="mt-0.5 size-5 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            <div>
              <p className="font-semibold text-[var(--sg-color-text)]">
                Privacy request
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Access, correction, deletion, unsubscribe, or other privacy
                actions.
              </p>
              <button
                type="button"
                onClick={() => onSelectReason("privacy")}
                className="mt-2 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Submit privacy request →
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-4">
          <div className="flex items-start gap-3">
            <Wrench
              className="mt-0.5 size-5 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            <div>
              <p className="font-semibold text-[var(--sg-color-text)]">
                Accessibility
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Tell us what page or interaction is difficult to use.
              </p>
              <button
                type="button"
                onClick={() => onSelectReason("technical")}
                className="mt-2 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Report accessibility issue →
              </button>
              <div>
                <Link
                  href={LEGAL_ROUTES.accessibility}
                  className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Accessibility statement →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ContactFaq() {
  return (
    <section
      id="contact-faq"
      className="scroll-mt-28"
      aria-labelledby="contact-faq-heading"
    >
      <h2
        id="contact-faq-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Common contact questions
      </h2>
      <ul className="sg-guide-card mt-5 grid md:grid-cols-2">
        {CONTACT_FAQ_ITEMS.map((item, index) => (
          <li
            key={item.question}
            className={
              index % 2 === 0
                ? "border-b border-[var(--sg-guide-card-border)] md:border-r"
                : "border-b border-[var(--sg-guide-card-border)]"
            }
          >
            <details className="group px-4 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium text-[var(--sg-color-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="size-4 shrink-0 text-[var(--sg-color-text-muted)] transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 text-sm text-[var(--sg-color-text-muted)]">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

const trustLinks = [
  {
    title: "How we recommend",
    description: "Our software evaluation methodology",
    href: COMPANY_ROUTES.howWeReview,
    Icon: BookOpenCheck,
  },
  {
    title: "Editorial guidelines",
    description: "How we review and score software",
    href: COMPANY_ROUTES.methodology,
    Icon: Scale,
  },
  {
    title: "Affiliate disclosure",
    description: "How affiliate relationships work",
    href: LEGAL_ROUTES.affiliateDisclosure,
    Icon: Handshake,
  },
  {
    title: "Privacy policy",
    description: "How we protect your information",
    href: LEGAL_ROUTES.privacy,
    Icon: ShieldCheck,
  },
] as const;

export function ContactTrustLinks() {
  return (
    <section
      aria-labelledby="contact-trust-heading"
      className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-5 sm:p-6"
    >
      <h2 id="contact-trust-heading" className="sr-only">
        Trust and editorial links
      </h2>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {trustLinks.map(({ title, description, href, Icon }) => (
          <li key={href}>
            <Link href={href} className="group block">
              <Icon
                className="size-6 text-[var(--sg-color-primary)]"
                aria-hidden
              />
              <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {title}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
