"use client";

import Link from "next/link";
import { Lock, Send } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
} from "@/services/site-foundation/config";
import {
  composeContactMessage,
  getContactReasonDefinition,
} from "@/services/contact/reasons";
import { trackSiteEvent } from "@/analytics/site-events";
import type { ContactReason } from "@/domain";
import { useId, useMemo, useState } from "react";

export type ContactFormValues = {
  reason: ContactReason;
  name: string;
  email: string;
  message: string;
  relatedUrl: string;
  company: string;
  product: string;
  websiteField: string;
  subject: string;
  whatWrong: string;
  whatCorrect: string;
  sourceUrl: string;
  browser: string;
  privacyAcknowledged: boolean;
  website: string; // honeypot
};

type Props = {
  reason: ContactReason;
  onReasonChange: (reason: ContactReason) => void;
  /** Include contextual sidebar (hub layout). */
  showSidebar?: boolean;
  id?: string;
  className?: string;
};

const emptyValues = (reason: ContactReason): ContactFormValues => ({
  reason,
  name: "",
  email: "",
  message: "",
  relatedUrl: "",
  company: "",
  product: "",
  websiteField: "",
  subject: "",
  whatWrong: "",
  whatCorrect: "",
  sourceUrl: "",
  browser: "",
  privacyAcknowledged: false,
  website: "",
});

function emptyFieldState(): Omit<ContactFormValues, "reason"> {
  const { reason: _unused, ...rest } = emptyValues("general");
  void _unused;
  return rest;
}

export function ContactForm({
  reason,
  onReasonChange,
  showSidebar = true,
  id = "contact-form",
  className,
}: Props) {
  const config = siteFoundationConfig.contact;
  const def = getContactReasonDefinition(reason);
  const formDomId = useId();
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Omit<ContactFormValues, "reason">>(
    emptyFieldState,
  );

  const allowedReasons = useMemo(
    () =>
      config.reasons.filter((r): r is ContactReason =>
        Boolean(getContactReasonDefinition(r as ContactReason)),
      ),
    [config.reasons],
  );

  function markStarted() {
    if (!started) {
      setStarted(true);
      trackSiteEvent("contact_form_started", { reason });
    }
  }

  function validateClient(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }
    if (def.fields.relatedUrl.required && !form.relatedUrl.trim()) {
      errors.relatedUrl = "Page URL is required for corrections";
    }
    if (def.fields.whatWrong.show && !form.whatWrong.trim()) {
      errors.whatWrong = "Please describe what looks wrong";
    }
    if (!def.fields.whatWrong.show) {
      const composedPreview = composeContactMessage({
        reason,
        message: form.message,
        subject: form.subject,
        product: form.product,
        website: form.websiteField,
        whatWrong: form.whatWrong,
        whatCorrect: form.whatCorrect,
        sourceUrl: form.sourceUrl,
        browser: form.browser,
      });
      if (composedPreview.length < 10) {
        errors.message = "Please enter a message (at least 10 characters)";
      }
    } else {
      const composedPreview = composeContactMessage({
        reason,
        message: form.message,
        whatWrong: form.whatWrong,
        whatCorrect: form.whatCorrect,
        sourceUrl: form.sourceUrl,
      });
      if (composedPreview.length < 10) {
        errors.whatWrong = "Please provide enough detail for us to review";
      }
    }
    if (!form.privacyAcknowledged) {
      errors.privacyAcknowledged = "Please acknowledge the privacy notice";
    }
    return errors;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateClient();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setStatusMessage("Please check your details and try again.");
      trackSiteEvent("contact_form_error", { reason });
      return;
    }

    setStatus("loading");
    setStatusMessage("");
    trackSiteEvent("contact_form_submitted", { reason });

    const composedMessage = composeContactMessage({
      reason,
      message: form.message,
      subject: form.subject,
      product: form.product,
      website: form.websiteField,
      whatWrong: form.whatWrong,
      whatCorrect: form.whatCorrect,
      sourceUrl: form.sourceUrl,
      browser: form.browser,
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reason,
          name: form.name,
          email: form.email,
          message: composedMessage,
          relatedUrl: form.relatedUrl,
          company: form.company,
          privacyAcknowledged: form.privacyAcknowledged,
          website: form.website,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        id?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setStatusMessage(
          data.error ?? "We couldn't send your message. Please try again.",
        );
        if (data.fieldErrors) {
          const mapped: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.fieldErrors)) {
            if (msgs[0]) mapped[key] = msgs[0];
          }
          setFieldErrors(mapped);
        }
        trackSiteEvent("contact_form_error", { reason });
        return;
      }
      setStatus("ok");
      setStatusMessage("Thanks for contacting SoftwareGlimpse.");
      trackSiteEvent("contact_form_success", {
        reason,
        id: data.id,
      });
      setForm(emptyFieldState());
      setFieldErrors({});
    } catch {
      setStatus("error");
      setStatusMessage(
        "We couldn't send your message. Please check your details and try again.",
      );
      trackSiteEvent("contact_form_error", { reason });
    }
  }

  function resetToIdle() {
    setStatus("idle");
    setStatusMessage("");
  }

  if (!config.enabled) {
    return <p>Contact is temporarily unavailable.</p>;
  }

  if (status === "ok") {
    return (
      <div id={id} className={className}>
        <Alert variant="success" title="Message received" className="p-6">
          <p className="text-[var(--sg-color-text)]">
            Thanks for contacting SoftwareGlimpse.
          </p>
          <p className="mt-1">Your message has been submitted successfully.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/" variant="primary">
              Back to SoftwareGlimpse
            </ButtonLink>
            <Button type="button" variant="outline" onClick={resetToIdle}>
              Send another message
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const formPanel = (
    <form
      id={`${formDomId}-form`}
      onSubmit={onSubmit}
      onFocus={markStarted}
      className="space-y-5"
      noValidate
    >
      <Alert variant="success" className="border-none bg-[var(--sg-color-success-soft)]">
        {def.helperText}
      </Alert>

      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
        {def.formHeading}
      </h2>

      <Field label="Reason" htmlFor="contact-reason" required>
        <Select
          id="contact-reason"
          value={reason}
          onChange={(e) => {
            const next = e.target.value as ContactReason;
            onReasonChange(next);
          }}
        >
          {allowedReasons.map((r) => (
            <option key={r} value={r}>
              {getContactReasonDefinition(r).label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Your name"
          htmlFor="contact-name"
          required
          error={fieldErrors.name}
        >
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={form.name}
            disabled={status === "loading"}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field
          label={reason === "vendor" ? "Work email" : "Email address"}
          htmlFor="contact-email"
          required
          error={fieldErrors.email}
        >
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            disabled={status === "loading"}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </Field>
      </div>

      {def.fields.company.show ? (
        <Field
          label={def.fields.company.label}
          htmlFor="contact-company"
          required={def.fields.company.required}
          error={fieldErrors.company}
        >
          <Input
            id="contact-company"
            name="organization"
            autoComplete="organization"
            value={form.company}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, company: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.product.show ? (
        <Field label={def.fields.product.label} htmlFor="contact-product">
          <Input
            id="contact-product"
            value={form.product}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, product: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.website.show ? (
        <Field label={def.fields.website.label} htmlFor="contact-site-url">
          <Input
            id="contact-site-url"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={form.websiteField}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, websiteField: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.subject.show ? (
        <Field label={def.fields.subject.label} htmlFor="contact-subject">
          <Input
            id="contact-subject"
            value={form.subject}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, subject: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.relatedUrl.show ? (
        <Field
          label={def.fields.relatedUrl.label}
          htmlFor="contact-url"
          required={def.fields.relatedUrl.required}
          hint={def.fields.relatedUrl.hint}
          error={fieldErrors.relatedUrl}
        >
          <Input
            id="contact-url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://www.softwareglimpse.com/..."
            value={form.relatedUrl}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, relatedUrl: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.whatWrong.show ? (
        <Field
          label={def.fields.whatWrong.label}
          htmlFor="contact-wrong"
          required
          error={fieldErrors.whatWrong}
        >
          <Textarea
            id="contact-wrong"
            rows={4}
            value={form.whatWrong}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, whatWrong: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.whatCorrect.show ? (
        <Field
          label={def.fields.whatCorrect.label}
          htmlFor="contact-correct"
        >
          <Textarea
            id="contact-correct"
            rows={4}
            value={form.whatCorrect}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, whatCorrect: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.sourceUrl.show ? (
        <Field
          label={def.fields.sourceUrl.label}
          htmlFor="contact-source"
          hint={def.fields.sourceUrl.hint}
        >
          <Input
            id="contact-source"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={form.sourceUrl}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, sourceUrl: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.browser.show ? (
        <Field
          label={def.fields.browser.label}
          htmlFor="contact-browser"
          hint={def.fields.browser.hint}
        >
          <Input
            id="contact-browser"
            value={form.browser}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, browser: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {def.fields.whatWrong.show ? null : (
        <Field
          label={def.fields.message.label}
          htmlFor="contact-message"
          required
          hint={def.fields.message.hint}
          error={fieldErrors.message}
        >
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={config.maxMessageLength}
            value={form.message}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
          />
        </Field>
      )}

      {def.fields.whatWrong.show ? (
        <Field
          label={def.fields.message.label}
          htmlFor="contact-message"
          hint={def.fields.message.hint}
          error={fieldErrors.message}
        >
          <Textarea
            id="contact-message"
            name="message"
            rows={3}
            maxLength={config.maxMessageLength}
            value={form.message}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
          />
        </Field>
      ) : null}

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        />
      </div>

      <fieldset>
        <legend className="sr-only">Privacy acknowledgement</legend>
        <label className="flex items-start gap-3 text-sm text-[var(--sg-color-text-muted)]">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-[var(--sg-color-border)]"
            checked={form.privacyAcknowledged}
            disabled={status === "loading"}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                privacyAcknowledged: e.target.checked,
              }))
            }
            required
            aria-invalid={fieldErrors.privacyAcknowledged ? true : undefined}
            aria-describedby={
              fieldErrors.privacyAcknowledged
                ? "contact-privacy-error"
                : undefined
            }
          />
          <span>{config.privacyAcknowledgementCopy}</span>
        </label>
        {fieldErrors.privacyAcknowledged ? (
          <p
            id="contact-privacy-error"
            role="alert"
            className="mt-1 text-[var(--sg-text-caption)] text-[var(--sg-color-danger)]"
          >
            {fieldErrors.privacyAcknowledged}
          </p>
        ) : null}
      </fieldset>

      <p className="text-xs text-[var(--sg-color-text-muted)]">
        Submitting this form does not subscribe you to marketing emails. See the{" "}
        <Link
          href={LEGAL_ROUTES.privacy}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          loading={status === "loading"}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            "Sending your message..."
          ) : (
            <>
              <Send className="size-4" aria-hidden />
              Send message
              <Lock className="size-3.5 opacity-80" aria-hidden />
            </>
          )}
        </Button>
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          We respect your privacy
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {status === "error" && statusMessage ? (
          <Alert variant="danger" title="We couldn't send your message.">
            {statusMessage}
          </Alert>
        ) : null}
        {status === "loading" ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Sending your message...
          </p>
        ) : null}
      </div>
    </form>
  );

  if (!showSidebar) {
    return (
      <div id={id} className={className}>
        {formPanel}
      </div>
    );
  }

  return (
    <div
      id={id}
      className={
        className ??
        "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start"
      }
    >
      <Card className="p-5 sm:p-7">{formPanel}</Card>
      <aside className="space-y-4 lg:sticky lg:top-24">
        <Card className="bg-[var(--sg-color-surface-tint)] p-5 shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--sg-color-primary)]">
            {def.sidebarTitle}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            {def.sidebarTips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-[var(--sg-color-primary)]" aria-hidden>
                  •
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          {def.sidebarNote ? (
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              {def.sidebarNote}
            </p>
          ) : null}
          {reason === "correction" ? (
            <Link
              href={COMPANY_ROUTES.howWeReview}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              How we handle corrections →
            </Link>
          ) : null}
          {reason === "vendor" ? (
            <Link
              href={COMPANY_ROUTES.methodology}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Editorial methodology →
            </Link>
          ) : null}
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--sg-color-text-muted)]">
            Privacy
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Your contact message is not used to subscribe you to marketing.
          </p>
          <Link
            href={LEGAL_ROUTES.privacy}
            className="mt-3 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Privacy policy →
          </Link>
        </Card>
      </aside>
    </div>
  );
}

/** Standalone form used by /privacy-request and other thin embeds. */
export function ContactFormStandalone({
  defaultReason = "general",
}: {
  defaultReason?: ContactReason;
}) {
  const [reason, setReason] = useState<ContactReason>(defaultReason);
  return (
    <ContactForm
      reason={reason}
      onReasonChange={setReason}
      showSidebar={false}
    />
  );
}
