import type { RequirementDetailProfile } from "@/domain";

type Depth = Pick<
  RequirementDetailProfile,
  | "displayTitle"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "primaryCapabilityHref"
>;

/**
 * Teaching depth for the four graph-synthesized CRM requirements that
 * were scoring CQ-P2 solely because they lacked hub visuals.
 * Copy is operational — no invented rankings, prices, or product endorsements.
 */
export const requirementDepthPartC: Record<string, Depth> = {
  "manage-integrations": {
    displayTitle: "CRM requirement: Manage integrations",
    tagline:
      "Start from the stack you already run — then confirm connectors, sync direction, failure surfacing, and API access on the plan you will buy.",
    overview:
      "Managing integrations means the CRM can connect to the systems that already hold customer data without re-keying. Evaluate native connectors, field-level sync, who sees failures, and whether API access is gated. A long directory of logos is not the requirement; a maintained path for your actual stack is.",
    whoThisIsFor:
      "Revops and IT buyers whose CRM must talk to email, billing, support, or a data warehouse — a Harbor Sales team syncing Pulse billing, or a Northstar agency connecting inbox and project tools.",
    whatMattersIntro:
      "Prioritize the connectors you will use this quarter, sync direction, and what happens when a job fails. Do not score a marketplace size you will never open.",
    workedExample:
      "Worked example: Harbor Sales needs Contacts → Pulse billing and email history on the person record. In the trial they force a failed sync and check whether the CRM names the broken mapping instead of failing silently.",
    workedExampleSecondary:
      "Worked example: an 8-person agency. Native email sync is on the qualifying plan; the project-tool connector is beta. They keep the CRM if email is native and treat the project tool as API/Zapier — not as a reason to stretch the product.",
    primaryCapabilityHref: "/capabilities/integrations/",
    heroVisual: {
      src: "/requirements/manage-integrations-hero.png",
      alt: "Educational diagram of a CRM connecting to email, billing, and support systems with named sync jobs rather than a logo wall.",
      caption:
        "Integrations are owned sync jobs for your stack — not a marketplace screenshot.",
    },
    needsVisual: {
      src: "/requirements/manage-integrations-needs.png",
      alt: "Diagram mapping silent sync failure and logo-directory shopping to CRM integration checks.",
      caption:
        "What breaks when buyers shop connector counts instead of their own stack.",
    },
    workflowVisual: {
      src: "/requirements/manage-integrations-workflow.png",
      alt: "Workflow: list stack, confirm connector, test sync direction, watch a failure, check API gate.",
      caption: "A practical integration trial loop.",
    },
  },
  "retain-and-export-data": {
    displayTitle: "CRM requirement: Retain and export data",
    tagline:
      "Confirm export formats, who can delete, and whether retention is configurable — before you load the full customer history.",
    overview:
      "Retention and export is a governance requirement: how long records stay, what a usable export contains, and who can delete. Marketing “you own your data” copy is not enough. Test export of a real record set and the deletion path on the plan you will buy.",
    whoThisIsFor:
      "Ops, legal, and admins who must move or retire customer data — Harbor Sales leaving a trial CRM, or Northstar Finance needing a controlled retention clock.",
    whatMattersIntro:
      "Prioritize export completeness, role-gated delete, and configurable retention. Do not treat a CSV of names as a full exit.",
    workedExample:
      "Worked example: Harbor Sales exports 200 deals with activities and custom fields. If notes and files are missing, the CRM fails the requirement even if contacts export cleanly.",
    workedExampleSecondary:
      "Worked example: a 12-person firm. Legal asks who can hard-delete. If any user can empty a contact, they fail the trial regardless of pipeline features.",
    primaryCapabilityHref: "/capabilities/security/",
    heroVisual: {
      src: "/requirements/retain-and-export-data-hero.png",
      alt: "Educational CRM UI showing export packages, retention windows, and a role-gated delete control.",
      caption:
        "Owning your data means usable export plus controlled retention — not a slogan.",
    },
    needsVisual: {
      src: "/requirements/retain-and-export-data-needs.png",
      alt: "Diagram mapping incomplete CSV export and unrestricted delete to governance checks.",
      caption: "What breaks when export and deletion are afterthoughts.",
    },
    workflowVisual: {
      src: "/requirements/retain-and-export-data-workflow.png",
      alt: "Workflow: pick a record set, export, inspect fields, try a gated delete, confirm retention setting.",
      caption: "A practical data-exit and retention trial.",
    },
  },
  "control-data-residency": {
    displayTitle: "CRM requirement: Control data residency",
    tagline:
      "If region matters, confirm what is actually stored there — app, backups, and subprocessors — on the plan you will buy.",
    overview:
      "Data residency is a vendor-diligence requirement, not a feature checkbox. Confirm available regions, which components are covered, and whether the choice is sold on your SKU. A marketing map is not coverage of backups or subprocessors.",
    whoThisIsFor:
      "Security and ops at firms with a written region policy — Harbor EU customers, or Northstar public-sector adjacent teams that must name a processing region.",
    whatMattersIntro:
      "Prioritize written region options, covered components, and plan gates. Do not assume one ‘EU’ badge covers every processing path.",
    workedExample:
      "Worked example: Harbor’s policy requires EU storage. In the trial they ask which region the sandbox uses and whether backups and a named subprocessor follow. If the vendor cannot answer, residency is not met.",
    workedExampleSecondary:
      "Worked example: a 20-person firm. Residency is only on Enterprise. They either budget that SKU or drop the vendor — they do not pretend the Growth tile includes it.",
    primaryCapabilityHref: "/capabilities/security/",
    heroVisual: {
      src: "/requirements/control-data-residency-hero.png",
      alt: "Educational diagram of CRM data region choice covering app, backups, and subprocessors — not a decorative world map.",
      caption:
        "Residency is a covered-component question, not a marketing region badge.",
    },
    needsVisual: {
      src: "/requirements/control-data-residency-needs.png",
      alt: "Diagram mapping a region badge that ignores backups to the checks a buyer should run.",
      caption: "What breaks when residency is treated as a logo on a map.",
    },
    workflowVisual: {
      src: "/requirements/control-data-residency-workflow.png",
      alt: "Workflow: name the policy, ask region options, list covered components, check the SKU gate, verify in writing.",
      caption: "A practical residency diligence loop.",
    },
  },
  "review-vendor-security-docs": {
    displayTitle: "CRM requirement: Review vendor security documentation",
    tagline:
      "Ask for the trust center, subprocessors, and questionnaire pack early — strong pipeline fit still fails procurement if the packet is late or thin.",
    overview:
      "Security documentation is a procurement input: trust center, whitepaper, subprocessors, and questionnaire responses. SoftwareGlimpse does not certify vendors. Treat published docs as something your stakeholders review — not as a badge we awarded.",
    whoThisIsFor:
      "IT, security, and procurement at firms that run questionnaires before a CRM shortlist — Harbor’s IT lead, or a Northstar nonprofit that must file a packet.",
    whatMattersIntro:
      "Prioritize whether docs exist before the demo, whether questionnaires are answered, and whether subprocessors are listed. Do not confuse a marketing ‘enterprise-grade’ line with a packet.",
    workedExample:
      "Worked example: Harbor IT asks for SOC reports and subprocessors in week one. If the vendor only sends a one-pager after verbal commit, the requirement fails even if the pipeline demo was excellent.",
    workedExampleSecondary:
      "Worked example: a 15-person team. The trust center is public; the questionnaire needs NDA. They start NDA immediately so security review is not the last-week surprise.",
    primaryCapabilityHref: "/capabilities/security/",
    heroVisual: {
      src: "/requirements/review-vendor-security-docs-hero.png",
      alt: "Educational checklist of trust center, subprocessors, and questionnaire pack as buyer inputs — not compliance badges.",
      caption:
        "Security docs are inputs for your review, not SoftwareGlimpse certifications.",
    },
    needsVisual: {
      src: "/requirements/review-vendor-security-docs-needs.png",
      alt: "Diagram mapping late security packets and marketing-only claims to procurement checks.",
      caption: "What breaks when security paperwork arrives after the demo.",
    },
    workflowVisual: {
      src: "/requirements/review-vendor-security-docs-workflow.png",
      alt: "Workflow: request packet, NDA if needed, review subprocessors, score gaps, keep or drop before build.",
      caption: "A practical security-docs review loop.",
    },
  },
};
