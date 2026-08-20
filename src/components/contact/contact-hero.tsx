"use client";

import { ArrowRight, Check, ExternalLink, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactIconChip } from "@/components/contact/contact-icons";
import { CONTACT_INTENT_REASONS } from "@/services/contact/reasons";
import type { ContactReason } from "@/domain";
import { cn } from "@/lib/cn";

type HeroProps = {
  onSelectReason: (reason: ContactReason) => void;
  onSendMessage: () => void;
};

const reassurances = [
  "Contact does not subscribe you to marketing",
  "Corrections are always welcome",
  "Affiliate relationships never affect rankings",
] as const;

export function ContactHero({ onSelectReason, onSendMessage }: HeroProps) {
  return (
    <header className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-stretch lg:gap-10">
      <div className="flex flex-col justify-center">
        <Badge variant="primary" className="w-fit uppercase tracking-wide">
          Contact SoftwareGlimpse
        </Badge>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-text)] sm:text-4xl md:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--sg-color-text-muted)] sm:text-lg">
          Questions, corrections, vendor information, partnership enquiries,
          privacy requests and technical issues — send us the details and
          we&apos;ll route your message appropriately.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" size="lg" onClick={onSendMessage}>
            <Send className="size-4" aria-hidden />
            Send a message
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => onSelectReason("correction")}
          >
            Report a correction
            <ExternalLink className="size-4" aria-hidden />
          </Button>
        </div>
        <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
          {reassurances.map((item) => (
            <li
              key={item}
              className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)]"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card
        className="border-[var(--sg-color-primary)]/15 bg-[var(--sg-color-surface-tint)] p-5 shadow-none sm:p-6"
        aria-labelledby="contact-routes-heading"
      >
        <p
          id="contact-routes-heading"
          className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--sg-color-primary)]"
        >
          Contact routes
        </p>
        <ul className="mt-4 space-y-3.5">
          {CONTACT_INTENT_REASONS.map((route) => {
            return (
              <li key={route.id}>
                <button
                  type="button"
                  onClick={() => onSelectReason(route.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[var(--sg-radius-md)] p-1.5 text-left transition-colors",
                    "hover:bg-[var(--sg-color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]/40",
                  )}
                >
                  <ContactIconChip
                    iconKey={route.iconKey}
                    tone={route.tone}
                    size="sm"
                    className="mt-0.5"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[var(--sg-color-text)]">
                      {route.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-[var(--sg-color-text-muted)]">
                      {route.routeBlurb}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </header>
  );
}

type IntentProps = {
  activeReason: ContactReason;
  onSelectReason: (reason: ContactReason) => void;
};

export function ContactIntentCards({
  activeReason,
  onSelectReason,
}: IntentProps) {
  return (
    <section aria-labelledby="contact-intent-heading">
      <h2
        id="contact-intent-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What do you need help with?
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_INTENT_REASONS.map((reason) => {
          const selected = activeReason === reason.id;
          return (
            <li key={reason.id}>
              <button
                type="button"
                onClick={() => onSelectReason(reason.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-full w-full flex-col rounded-[var(--sg-radius-lg)] border bg-[var(--sg-color-surface)] p-5 text-left shadow-[var(--sg-shadow-sm)] transition",
                  "hover:border-[var(--sg-color-border-strong)] hover:shadow-[var(--sg-shadow-md)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]/40",
                  selected
                    ? "border-[var(--sg-color-primary)]/40 ring-1 ring-[var(--sg-color-primary-soft)]"
                    : "border-[var(--sg-color-border)]",
                )}
              >
                <ContactIconChip iconKey={reason.iconKey} tone={reason.tone} />
                <span className="mt-4 text-base font-semibold text-[var(--sg-color-text)]">
                  {reason.title}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                  {reason.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                  {reason.ctaLabel}
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
