# InternalLinkAuditAgent report

**Agent:** InternalLinkAuditAgent  
**Mode:** FULL  
**Started:** 2026-09-06T21:48:44.833Z  
**Finished:** 2026-09-06T21:51:29.274Z  

> Report-only. This agent does **not** change canonicals, robots, content, scores, or affiliate links.

## Run status

| Checks | Count |
| --- | ---: |
| Completed | 4 |
| Skipped | 1 |
| Failed | 0 |
| Findings | 51 |

## Summary

Internal linking: 48541 edges, 0 orphans, 0 weak, 51 finding(s).

## Checks

| Check | Status | Reason |
| --- | --- | --- |
| `graph-build` | completed | 48541 edges |
| `orphans` | completed | 0 orphans |
| `weak-pages` | completed | 0 weak |
| `health` | completed | 0 errors / 48 warnings |
| `redirect-links` | skipped | Requires BASE_URL / --base-url against a running origin |

## Findings

### SEO-HEALTH-BEST-SOCIAL-MEDIA-MARKETING--F89F — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/social-media-marketing-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/social-media-marketing-evaluation-guide/ to=/best/social-media-marketing-software/ |
| Affected pages | `/guides/social-media-marketing-evaluation-guide/`, `/best/social-media-marketing-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-WEBINAR-VIRTUAL-EVENTS--41C4 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/webinar-virtual-events-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/webinar-virtual-events-evaluation-guide/ to=/best/webinar-virtual-events-software/ |
| Affected pages | `/guides/webinar-virtual-events-evaluation-guide/`, `/best/webinar-virtual-events-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-LMS-COURSE-CREATION-SOF-EFE2 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/lms-course-creation-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/lms-course-creation-evaluation-guide/ to=/best/lms-course-creation-software/ |
| Affected pages | `/guides/lms-course-creation-evaluation-guide/`, `/best/lms-course-creation-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-WEBSITE-DIGITAL-PRESENC-1675 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/website-digital-presence-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/website-digital-presence-evaluation-guide/ to=/best/website-digital-presence-software/ |
| Affected pages | `/guides/website-digital-presence-evaluation-guide/`, `/best/website-digital-presence-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-ANALYTICS-BI-SOFTWARE-CB0C — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/analytics-bi-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/analytics-bi-evaluation-guide/ to=/best/analytics-bi-software/ |
| Affected pages | `/guides/analytics-bi-evaluation-guide/`, `/best/analytics-bi-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-FIELD-SERVICE-OPERATION-96E6 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/field-service-operations-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/field-service-operations-evaluation-guide/ to=/best/field-service-operations-software/ |
| Affected pages | `/guides/field-service-operations-evaluation-guide/`, `/best/field-service-operations-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-REPUTATION-REVIEWS-SOFT-20A9 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/reputation-reviews-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/reputation-reviews-evaluation-guide/ to=/best/reputation-reviews-software/ |
| Affected pages | `/guides/reputation-reviews-evaluation-guide/`, `/best/reputation-reviews-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-AI-WRITING-SOFTWARE-FB70 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/ai-writing-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/ai-writing-evaluation-guide/ to=/best/ai-writing-software/ |
| Affected pages | `/guides/ai-writing-evaluation-guide/`, `/best/ai-writing-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-AI-WEBSITE-BUILDER-SOFT-8359 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/ai-website-builder-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/ai-website-builder-evaluation-guide/ to=/best/ai-website-builder-software/ |
| Affected pages | `/guides/ai-website-builder-evaluation-guide/`, `/best/ai-website-builder-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-VOIP-BUSINESS-PHONE-SOF-3130 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/voip-business-phone-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/voip-business-phone-evaluation-guide/ to=/best/voip-business-phone-software/ |
| Affected pages | `/guides/voip-business-phone-evaluation-guide/`, `/best/voip-business-phone-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-LIVE-CHAT-SOFTWARE-A90C — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/live-chat-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/live-chat-evaluation-guide/ to=/best/live-chat-software/ |
| Affected pages | `/guides/live-chat-evaluation-guide/`, `/best/live-chat-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-HELPDESK-TICKETING-SOFT-7383 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/helpdesk-ticketing-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/helpdesk-ticketing-evaluation-guide/ to=/best/helpdesk-ticketing-software/ |
| Affected pages | `/guides/helpdesk-ticketing-evaluation-guide/`, `/best/helpdesk-ticketing-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-DROPSHIPPING-POD-SOFTWA-DBD6 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/dropshipping-pod-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/dropshipping-pod-evaluation-guide/ to=/best/dropshipping-pod-software/ |
| Affected pages | `/guides/dropshipping-pod-evaluation-guide/`, `/best/dropshipping-pod-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-FULFILLMENT-SHIPPING-SO-CB7A — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/fulfillment-shipping-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/fulfillment-shipping-evaluation-guide/ to=/best/fulfillment-shipping-software/ |
| Affected pages | `/guides/fulfillment-shipping-evaluation-guide/`, `/best/fulfillment-shipping-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-ATS-RECRUITING-SOFTWARE-664E — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-ats-recruiting-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-ats-recruiting-software/ to=/best/ats-recruiting-software/ |
| Affected pages | `/guides/how-to-choose-ats-recruiting-software/`, `/best/ats-recruiting-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-ATS-RECRUITING-SOFTWARE-976A — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/ats-recruiting-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/ats-recruiting-evaluation-guide/ to=/best/ats-recruiting-software/ |
| Affected pages | `/guides/ats-recruiting-evaluation-guide/`, `/best/ats-recruiting-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-TIME-ATTENDANCE-SOFTWAR-2ECE — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-time-attendance-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-time-attendance-software/ to=/best/time-attendance-software/ |
| Affected pages | `/guides/how-to-choose-time-attendance-software/`, `/best/time-attendance-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-TIME-ATTENDANCE-SOFTWAR-3FC9 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/time-attendance-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/time-attendance-evaluation-guide/ to=/best/time-attendance-software/ |
| Affected pages | `/guides/time-attendance-evaluation-guide/`, `/best/time-attendance-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-WEB-HOSTING-SOFTWARE-62A9 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-web-hosting-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-web-hosting-software/ to=/best/web-hosting-software/ |
| Affected pages | `/guides/how-to-choose-web-hosting-software/`, `/best/web-hosting-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-WEB-HOSTING-SOFTWARE-116C — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/web-hosting-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/web-hosting-evaluation-guide/ to=/best/web-hosting-software/ |
| Affected pages | `/guides/web-hosting-evaluation-guide/`, `/best/web-hosting-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-ITSM-SOFTWARE-4624 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-itsm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-itsm-software/ to=/best/itsm-software/ |
| Affected pages | `/guides/how-to-choose-itsm-software/`, `/best/itsm-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-ITSM-SOFTWARE-728F — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/itsm-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/itsm-evaluation-guide/ to=/best/itsm-software/ |
| Affected pages | `/guides/itsm-evaluation-guide/`, `/best/itsm-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-SOCIAL-MEDIA-MANAGEMENT-865B — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-social-media-management-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-social-media-management-software/ to=/best/social-media-management-software/ |
| Affected pages | `/guides/how-to-choose-social-media-management-software/`, `/best/social-media-management-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-SOCIAL-MEDIA-MANAGEMENT-AE9D — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/social-media-management-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/social-media-management-evaluation-guide/ to=/best/social-media-management-software/ |
| Affected pages | `/guides/social-media-management-evaluation-guide/`, `/best/social-media-management-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-LANDING-PAGES-CRO-SOFTW-9E1F — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-landing-pages-cro-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-landing-pages-cro-software/ to=/best/landing-pages-cro-software/ |
| Affected pages | `/guides/how-to-choose-landing-pages-cro-software/`, `/best/landing-pages-cro-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-LANDING-PAGES-CRO-SOFTW-4AD8 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/landing-pages-cro-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/landing-pages-cro-evaluation-guide/ to=/best/landing-pages-cro-software/ |
| Affected pages | `/guides/landing-pages-cro-evaluation-guide/`, `/best/landing-pages-cro-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-PPC-ADVERTISING-SOFTWAR-B8ED — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/how-to-choose-ppc-advertising-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/how-to-choose-ppc-advertising-software/ to=/best/ppc-advertising-software/ |
| Affected pages | `/guides/how-to-choose-ppc-advertising-software/`, `/best/ppc-advertising-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-BEST-PPC-ADVERTISING-SOFTWAR-50B8 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /guides/ppc-advertising-evaluation-guide/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/guides/ppc-advertising-evaluation-guide/ to=/best/ppc-advertising-software/ |
| Affected pages | `/guides/ppc-advertising-evaluation-guide/`, `/best/ppc-advertising-software/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-KEAP-WORTH-IT-976A — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/is-keap-worth-it/ |
| Affected pages | `/categories/crm/`, `/guides/is-keap-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-CAPSULE-PLANS-CB3A — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 6 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/capsule-plans/ |
| Affected pages | `/categories/crm/`, `/guides/capsule-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-ZOHO-CRM-PLANS-A9A4 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 7 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/zoho-crm-plans/ |
| Affected pages | `/categories/crm/`, `/guides/zoho-crm-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-PIPEDRIVE-PLANS-75E8 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 8 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/pipedrive-plans/ |
| Affected pages | `/categories/crm/`, `/guides/pipedrive-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-PIPEDRIVE-WORTH-IT-9AA7 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 9 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/is-pipedrive-worth-it/ |
| Affected pages | `/categories/crm/`, `/guides/is-pipedrive-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-CLOSE-PLANS-68B0 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 10 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/close-plans/ |
| Affected pages | `/categories/crm/`, `/guides/close-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-CLOSE-WORTH-IT-45B9 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 11 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/is-close-worth-it/ |
| Affected pages | `/categories/crm/`, `/guides/is-close-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-INSIGHTLY-PLANS-C62B — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 12 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/insightly-plans/ |
| Affected pages | `/categories/crm/`, `/guides/insightly-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-INSIGHTLY-WORTH-IT-DCDD — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 13 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/is-insightly-worth-it/ |
| Affected pages | `/categories/crm/`, `/guides/is-insightly-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-NIMBLE-PLANS-2D62 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 14 non-indexable targets from /categories/crm/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/categories/crm/ to=/guides/nimble-plans/ |
| Affected pages | `/categories/crm/`, `/guides/nimble-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-KEAP-WORTH-IT-85A2 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 5 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/is-keap-worth-it/ |
| Affected pages | `/best/crm-software/`, `/guides/is-keap-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-CAPSULE-PLANS-4F6B — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 6 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/capsule-plans/ |
| Affected pages | `/best/crm-software/`, `/guides/capsule-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-ZOHO-CRM-PLANS-B5A9 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 7 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/zoho-crm-plans/ |
| Affected pages | `/best/crm-software/`, `/guides/zoho-crm-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-PIPEDRIVE-PLANS-2B5C — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 8 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/pipedrive-plans/ |
| Affected pages | `/best/crm-software/`, `/guides/pipedrive-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-PIPEDRIVE-WORTH-IT-1BD4 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 9 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/is-pipedrive-worth-it/ |
| Affected pages | `/best/crm-software/`, `/guides/is-pipedrive-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-CLOSE-PLANS-AA82 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 10 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/close-plans/ |
| Affected pages | `/best/crm-software/`, `/guides/close-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-CLOSE-WORTH-IT-49FE — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 11 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/is-close-worth-it/ |
| Affected pages | `/best/crm-software/`, `/guides/is-close-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-INSIGHTLY-PLANS-27D5 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 12 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/insightly-plans/ |
| Affected pages | `/best/crm-software/`, `/guides/insightly-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-IS-INSIGHTLY-WORTH-IT-A82F — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 13 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/is-insightly-worth-it/ |
| Affected pages | `/best/crm-software/`, `/guides/is-insightly-worth-it/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-HEALTH-GUIDES-NIMBLE-PLANS-A582 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Primary module has 14 non-indexable targets from /best/crm-software/ — avoid crawlable dumps |
| Evidence | DRAFT_OR_NOINDEX_TARGET from=/best/crm-software/ to=/guides/nimble-plans/ |
| Affected pages | `/best/crm-software/`, `/guides/nimble-plans/` |
| Likely cause | Graph/health validator signal |
| Recommended action | Inspect validateInternalLinkHealth output and fix hrefs |
| Files/components | `src/services/internal-linking/health.ts` |
| Expected impact | Healthier internal graph |
| Effort | small |
| Confidence | 80% |

### SEO-NEXTSTEP-STRENGTHEN-ACCOUNTING-FINANC-2CE8 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Missing recommended internal link opportunity |
| Evidence | Strengthen accounting-finance hub mesh (edges=0, next=100%, parent=100%, guides=2) |
| Affected pages | — |
| Likely cause | Journey / pillar support gap |
| Recommended action | Strengthen accounting-finance hub mesh (edges=0, next=100%, parent=100%, guides=2) |
| Files/components | `src/services/internal-linking` |
| Expected impact | Stronger next-step journeys |
| Effort | small |
| Confidence | 55% |

### SEO-NEXTSTEP-STRENGTHEN-SOCIAL-MEDIA-MARK-4EF1 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Missing recommended internal link opportunity |
| Evidence | Strengthen social-media-marketing hub mesh (edges=0, next=100%, parent=100%, guides=0) |
| Affected pages | — |
| Likely cause | Journey / pillar support gap |
| Recommended action | Strengthen social-media-marketing hub mesh (edges=0, next=100%, parent=100%, guides=0) |
| Files/components | `src/services/internal-linking` |
| Expected impact | Stronger next-step journeys |
| Effort | small |
| Confidence | 55% |

### SEO-NEXTSTEP-STRENGTHEN-WEBINAR-VIRTUAL-E-6C90 — P2

| Field | Value |
| --- | --- |
| Severity | P2 |
| Area | internal-linking |
| Problem | Missing recommended internal link opportunity |
| Evidence | Strengthen webinar-virtual-events hub mesh (edges=0, next=100%, parent=100%, guides=0) |
| Affected pages | — |
| Likely cause | Journey / pillar support gap |
| Recommended action | Strengthen webinar-virtual-events hub mesh (edges=0, next=100%, parent=100%, guides=0) |
| Files/components | `src/services/internal-linking` |
| Expected impact | Stronger next-step journeys |
| Effort | small |
| Confidence | 55% |


---

_Generated by `internal-link-audit-agent` v1.0.0. No auto-fixes applied._
