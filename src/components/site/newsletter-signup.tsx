"use client";

import { useEffect, useId, useState } from "react";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";
import { trackSiteEvent } from "@/analytics/site-events";

type Props = {
  source:
    | "footer"
    | "article-inline"
    | "article-end"
    | "category"
    | "tool-result"
    | "popup"
    | "header"
    | "manual";
  placement?: string;
  contentId?: string;
  pageType?: string;
  compact?: boolean;
};

export function NewsletterSignupForm({
  source,
  placement,
  contentId,
  pageType,
  compact = false,
}: Props) {
  const config = siteFoundationConfig.newsletter;
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    trackSiteEvent("newsletter_signup_viewed", { source, placement, contentId });
  }, [source, placement, contentId]);

  if (!config.enabled) {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Newsletter coming soon.
      </p>
    );
  }

  const teaser =
    source === "footer"
      ? config.footerTeaser
      : source === "popup"
        ? config.popupBody
        : config.inlineTeaser;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source,
          placement,
          contentId,
          pageType,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        result?: { status: string; message: string };
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Subscription failed");
        return;
      }
      setStatus("ok");
      setMessage(data.result?.message ?? "Check your email to confirm.");
      trackSiteEvent("newsletter_signup_submitted", {
        source,
        placement,
        contentId,
        pageType,
        status: data.result?.status,
      });
      try {
        window.localStorage.setItem(
          "sg_newsletter_popup",
          JSON.stringify({ subscribed: true, at: Date.now() }),
        );
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "space-y-2" : "space-y-3"}
      aria-describedby={`${id}-promise`}
    >
      <p id={`${id}-promise`} className="text-sm text-[var(--color-fg-muted)]">
        {teaser ?? config.consentCopy}
      </p>
      <div className={compact ? "flex flex-wrap gap-2" : "space-y-2"}>
        <label className="sr-only" htmlFor={`${id}-email`}>
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-[12rem] flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-[var(--color-accent-fg)] disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Subscribe"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-[var(--color-fg-muted)]">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          I agree to receive the {config.name} email.{" "}
          {config.frequencyExpectation}
        </span>
      </label>
      {message ? (
        <p
          role="status"
          className={
            status === "error"
              ? "text-sm text-[var(--color-danger)]"
              : "text-sm text-[var(--color-fg)]"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
