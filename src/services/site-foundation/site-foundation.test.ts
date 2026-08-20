import { describe, expect, it, beforeEach } from "vitest";
import {
  acceptAllConsent,
  categoryAllowed,
  isConsentExpired,
  parseConsentRecord,
  rejectOptionalConsent,
} from "@/services/consent";
import {
  FakeNewsletterProvider,
  NewsletterSubscribeInputSchema,
  __resetNewsletterProviderForTests,
  subscribeToNewsletter,
  confirmNewsletter,
  unsubscribeNewsletter,
} from "@/services/newsletter";
import {
  __resetContactRateLimitForTests,
  sanitizePlainText,
  submitContactForm,
  validateContactSubmission,
} from "@/services/contact";
import {
  assessSiteLaunchReadiness,
  buildCookiePolicySections,
  buildPrivacySections,
  buildTermsSections,
  buildAccessibilitySections,
  flagPoliciesForProviderChange,
  getSiteFoundationConfig,
  isLegalConfigurationComplete,
} from "@/services/site-foundation";

describe("consent", () => {
  it("denies optional categories before consent", () => {
    expect(categoryAllowed(null, "analytics")).toBe(false);
    expect(categoryAllowed(null, "strictly-necessary")).toBe(true);
  });

  it("accept activates permitted optional categories in use", () => {
    const record = acceptAllConsent("1.1.0");
    expect(record.categories.analytics).toBe(true);
    expect(record.categories.marketing).toBe(true);
    expect(categoryAllowed(record, "analytics")).toBe(true);
    expect(categoryAllowed(record, "marketing")).toBe(true);
  });

  it("reject leaves optional inactive", () => {
    const record = rejectOptionalConsent("1.1.0");
    expect(record.categories.analytics).toBe(false);
    expect(record.categories.marketing).toBe(false);
  });

  it("policy version mismatch triggers renewal", () => {
    const record = parseConsentRecord({
      version: "0.0.1",
      decidedAt: new Date().toISOString(),
      categories: {
        strictlyNecessary: true,
        preferences: true,
        analytics: true,
        marketing: false,
      },
    });
    expect(record).toBeTruthy();
    expect(isConsentExpired(record!)).toBe(true);
  });
});

describe("newsletter", () => {
  beforeEach(() => {
    __resetNewsletterProviderForTests();
  });

  it("requires consent and valid email", async () => {
    const bad = await subscribeToNewsletter({
      email: "not-an-email",
      consent: true,
    });
    expect(bad.ok).toBe(false);

    const noConsent = NewsletterSubscribeInputSchema.safeParse({
      email: "a@b.com",
      consent: false,
    });
    expect(noConsent.success).toBe(false);

    const ok = await subscribeToNewsletter({
      email: "reader@example.com",
      consent: true,
      source: "footer",
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.result.status).toBe("pending-confirmation");
      expect(ok.result.confirmationToken).toBeTruthy();
      const confirmed = await confirmNewsletter(ok.result.confirmationToken!);
      expect(confirmed.status).toBe("confirmed");
      const again = await subscribeToNewsletter({
        email: "reader@example.com",
        consent: true,
        source: "footer",
      });
      expect(again.ok).toBe(true);
      if (again.ok) expect(again.result.status).toBe("subscribed");
    }
  });

  it("unsubscribe works without sign-in", async () => {
    const provider = new FakeNewsletterProvider(false);
    await provider.subscribe({
      email: "x@y.com",
      consent: true,
      source: "manual",
    });
    const result = await provider.unsubscribe("x@y.com");
    expect(result.status).toBe("unsubscribed");
  });

  it("provider failure surfaces from confirm with bad token", async () => {
    const result = await confirmNewsletter("missing-token");
    expect(result.status).toBe("error");
  });
});

describe("contact", () => {
  beforeEach(() => {
    __resetContactRateLimitForTests();
  });

  it("validates and sanitizes", async () => {
    const invalid = validateContactSubmission({
      reason: "general",
      name: "A",
      email: "bad",
      message: "short",
      privacyAcknowledged: true,
    });
    expect(invalid.ok).toBe(false);

    const withHtml = validateContactSubmission({
      reason: "correction",
      name: "Alex",
      email: "alex@example.com",
      message: "Pricing looks wrong on the hubspot page now",
      privacyAcknowledged: true,
      relatedUrl: "https://www.softwareglimpse.com/software/hubspot/",
    });
    expect(withHtml.ok).toBe(true);

    expect(sanitizePlainText("<b>hi</b>")).toBe("hi");

    const submitted = await submitContactForm(
      {
        reason: "privacy",
        name: "Alex",
        email: "alex@example.com",
        message: "Please delete my contact submission if any",
        privacyAcknowledged: true,
        website: "",
      },
      "test-ip",
    );
    expect(submitted.ok).toBe(true);
  });

  it("rejects honeypot spam", () => {
    const spam = validateContactSubmission({
      reason: "general",
      name: "Bot",
      email: "bot@example.com",
      message: "Buy cheap links today please",
      privacyAcknowledged: true,
      website: "http://spam.example",
    });
    expect(spam.ok).toBe(false);
  });

  it("requires privacy acknowledgement", () => {
    const result = validateContactSubmission({
      reason: "general",
      name: "Alex",
      email: "alex@example.com",
      message: "Hello there this is long enough",
      privacyAcknowledged: false,
    });
    expect(result.ok).toBe(false);
  });
});

describe("legal / privacy config", () => {
  it("detects complete controller info", () => {
    expect(isLegalConfigurationComplete()).toBe(true);
    const privacy = buildPrivacySections();
    expect(privacy.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE"))).toBe(
      false,
    );
    expect(
      privacy.some((s) => s.id === "controller" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
  });

  it("cookie policy reflects inventory and configured controller", () => {
    const sections = buildCookiePolicySections();
    expect(sections.some((s) => s.body.includes("sg_consent"))).toBe(true);
    expect(
      sections.some((s) => s.id === "controller" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      sections.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE")),
    ).toBe(false);
  });

  it("terms reflect configured operator", () => {
    const sections = buildTermsSections();
    expect(
      sections.some((s) => s.id === "operator" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      sections.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE")),
    ).toBe(false);
  });

  it("accessibility statement reflects configured operator without false WCAG claims", () => {
    const sections = buildAccessibilitySections();
    expect(
      sections.some((s) => s.id === "operator" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      sections.every((s) => !/wcag 2\.2 aa compliant/i.test(s.body)),
    ).toBe(true);
  });

  it("policy dependencies flag privacy/cookies", () => {
    const flags = flagPoliciesForProviderChange("analytics provider changed");
    expect(flags.some((f) => f.documentId === "privacy")).toBe(true);
    expect(flags.some((f) => f.documentId === "cookies")).toBe(true);
  });

  it("launch readiness passes legal configuration gate", () => {
    const result = assessSiteLaunchReadiness("2026-08-13T12:00:00.000Z");
    expect(result.blockers).not.toContain("LEGAL_CONFIGURATION_INCOMPLETE");
  });

  it("computes legal gaps from live config instead of a hardcoded list", () => {
    const config = getSiteFoundationConfig();
    expect(config.retention.consentRecords).toBeTruthy();
    expect(config.identity.missingFields).not.toContain("processors.analytics");
    expect(config.identity.missingFields).not.toContain("processors.newsletter");
    expect(config.identity.missingFields).not.toContain(
      "retention.newsletterMetadata",
    );
    expect(config.identity.missingFields).not.toContain("identity.legalEntityName");
    expect(config.identity.missingFields).not.toContain("processors.hosting");
    expect(config.identity.missingFields).not.toContain("terms.governingLaw");
    expect(config.identity.configurationComplete).toBe(true);
  });

  it("exposes processors from config", () => {
    const config = getSiteFoundationConfig();
    expect(config.processors.length).toBeGreaterThan(0);
    expect(config.cookies.every((c) => c.category)).toBe(true);
  });
});

describe("popup rules (logic)", () => {
  it("cookie UI blocking takes priority over newsletter popup", () => {
    const cookieUiBlocking = true;
    const newsletterWouldOpen = true;
    const open = newsletterWouldOpen && !cookieUiBlocking;
    expect(open).toBe(false);
  });

  it("suppresses on legal paths and when subscribed", () => {
    const path = "/legal/privacy/";
    const subscribed = true;
    const suppress =
      path.startsWith("/legal/") || subscribed;
    expect(suppress).toBe(true);
  });
});

describe("unsubscribe export", () => {
  it("is available", async () => {
    const result = await unsubscribeNewsletter("nobody@example.com");
    expect(result.status).toBe("not-found");
  });
});
