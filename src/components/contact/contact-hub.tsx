"use client";

import { useCallback, useEffect, useState } from "react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  ContactHero,
  ContactIntentCards,
} from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import {
  ContactFaq,
  ContactSupportingSections,
  ContactTrustLinks,
} from "@/components/contact/contact-supporting";
import { trackSiteEvent } from "@/analytics/site-events";
import type { ContactReason } from "@/domain";

type Props = {
  defaultReason: ContactReason;
};

const FORM_ID = "send-message";

export function ContactHub({ defaultReason }: Props) {
  const [reason, setReason] = useState<ContactReason>(defaultReason);

  useEffect(() => {
    trackSiteEvent("contact_page_view", { reason: defaultReason });
  }, [defaultReason]);

  const applyReason = useCallback(
    (next: ContactReason, options?: { scroll?: boolean }) => {
      setReason(next);
      trackSiteEvent("contact_reason_selected", { reason: next });
      if (options?.scroll === false) return;
      requestAnimationFrame(() => {
        document
          .getElementById(FORM_ID)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [],
  );

  const selectReason = useCallback(
    (next: ContactReason) => applyReason(next, { scroll: true }),
    [applyReason],
  );

  const changeFormReason = useCallback(
    (next: ContactReason) => applyReason(next, { scroll: false }),
    [applyReason],
  );

  const sendMessage = useCallback(() => {
    requestAnimationFrame(() => {
      document
        .getElementById(FORM_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <>
      <Section padding="sm" background="default" container="wide">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Company", path: "/company/about/" },
            { name: "Contact", path: "/company/contact/" },
          ]}
        />
        <ContactHero
          onSelectReason={selectReason}
          onSendMessage={sendMessage}
        />
      </Section>

      <Section padding="md" background="muted" container="wide" bordered>
        <ContactIntentCards
          activeReason={reason}
          onSelectReason={selectReason}
        />
      </Section>

      <Section padding="md" background="default" container="wide">
        <div className="mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Send us a message
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
            Choose a reason above or in the form. We route messages for
            corrections, questions, vendor updates, partnerships, privacy and
            technical issues — without marketing signup.
          </p>
        </div>
        <ContactForm
          id={FORM_ID}
          reason={reason}
          onReasonChange={changeFormReason}
          showSidebar
          className="scroll-mt-28 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start"
        />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <ContactSupportingSections onSelectReason={selectReason} />
      </Section>

      <Section padding="md" background="default" container="wide">
        <ContactFaq />
      </Section>

      <Section padding="md" background="default" container="wide">
        <ContactTrustLinks />
      </Section>
    </>
  );
}
