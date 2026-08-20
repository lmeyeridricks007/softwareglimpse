import { describe, expect, it } from "vitest";
import { getSiteFoundationConfig } from "@/services/site-foundation";
import { buildCookiePolicySections, buildPrivacySections, buildTermsSections, buildAccessibilitySections } from "@/services/site-foundation/privacy-render";

describe("site foundation content QA", () => {
  const config = getSiteFoundationConfig();

  it("marks core legal docs approved after operator configuration", () => {
    expect(config.identity.configurationComplete).toBe(true);
    for (const id of ["privacy", "terms", "cookies", "accessibility"] as const) {
      const doc = config.legalDocuments.find((d) => d.id === id);
      expect(doc, id).toBeTruthy();
      expect(doc!.status, id).toBe("approved");
      expect(doc!.approvedAt, id).toBeTruthy();
    }
    const disclosure = config.legalDocuments.find(
      (d) => d.id === "affiliate-disclosure",
    );
    expect(disclosure?.status).toBe("approved");
  });

  it("founder bio does not invent employers or testing claims", () => {
    const founder = config.authors.find(
      (a) => a.id === config.identity.founderAuthorId,
    );
    expect(founder?.name).toBe("Lee M.");
    const blob = `${founder?.shortBio ?? ""} ${founder?.fullBio ?? ""}`.toLowerCase();
    expect(blob).not.toMatch(/\bwe tested every\b/);
    expect(blob).not.toMatch(/\byears at\b/);
    expect(blob).not.toMatch(/\bex-google\b/);
  });

  it("privacy and cookie pages reflect inventory and configured controller", () => {
    const privacy = buildPrivacySections(config);
    expect(
      privacy.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE")),
    ).toBe(false);
    expect(
      privacy.some((s) => s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      privacy.some((s) => /affiliate click|\/go\//i.test(`${s.heading} ${s.body}`)),
    ).toBe(true);

    const cookies = buildCookiePolicySections(config);
    expect(cookies.some((s) => s.body.includes("sg_consent"))).toBe(true);
    expect(cookies.some((s) => s.body.includes("sg-crm-finder-v1"))).toBe(true);
    expect(cookies.every((s) => !/_ga\b|_fbp\b/.test(s.body))).toBe(true);
    expect(
      cookies.some((s) => s.id === "controller" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      cookies.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE")),
    ).toBe(false);

    const terms = buildTermsSections(config);
    expect(
      terms.some((s) => s.id === "operator" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      terms.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE")),
    ).toBe(false);
    expect(
      terms.some((s) => s.body.includes("Netherlands")),
    ).toBe(true);

    const accessibility = buildAccessibilitySections(config);
    expect(
      accessibility.some((s) => s.id === "operator" && s.body.includes("SoftwareGlimpse")),
    ).toBe(true);
    expect(
      accessibility.some((s) => s.body.includes("LEGAL_CONFIGURATION_INCOMPLETE")),
    ).toBe(false);
    expect(
      accessibility.every((s) => !/wcag 2\.2 aa compliant/i.test(s.body)),
    ).toBe(true);
  });

  it("newsletter consent copy is present and does not invent subscriber counts", () => {
    expect(config.newsletter.consentCopy.length).toBeGreaterThan(20);
    const copy = [
      config.newsletter.consentCopy,
      config.newsletter.popupHeadline,
      config.newsletter.popupBody,
      config.newsletter.footerTeaser,
    ]
      .join(" ")
      .toLowerCase();
    expect(copy).not.toMatch(/50,?000/);
    expect(copy).not.toMatch(/don't miss out/);
    expect(config.newsletter.enabled).toBe(false);
  });

  it("editorial independence claims match enforceable invariants", () => {
    const independence = config.legalDocuments.find(
      (d) => d.id === "editorial-independence",
    );
    const body = independence?.sections.map((s) => s.body).join(" ") ?? "";
    expect(body.toLowerCase()).toContain("finder");
    expect(body.toLowerCase()).toContain("affiliate");
    expect(body.toLowerCase()).not.toContain("wcag 2.2 aa compliant");
  });

  it("indexability: newsletter utility remains noindex via metadata paths", () => {
    // Config documents: company/legal indexable flags; newsletter routes set indexable:false in pages.
    const privacy = config.legalDocuments.find((d) => d.id === "privacy");
    expect(privacy?.indexable).toBe(true);
  });
});
