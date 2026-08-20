import type { CrmRfpSession, RfpMode } from "@/domain";
import {
  RFP_DELIVERY_METHOD_DEFINITIONS,
  RFP_DELIVERY_METHOD_LABELS,
  RFP_DELIVERY_METHODS,
  RFP_PRIORITY_LABELS,
} from "./constants";
import { countByPriority } from "./quality";
import { assessRfpReadiness, READINESS_LABELS } from "./readiness";

function line(text: string): string {
  return text.trimEnd();
}

function section(title: string, body: string): string {
  if (!body.trim()) return "";
  return `\n## ${title}\n\n${body.trim()}\n`;
}

function bullet(items: string[]): string {
  return items
    .filter((i) => i.trim())
    .map((i) => `- ${i}`)
    .join("\n");
}

export function buildRfpMarkdown(
  session: CrmRfpSession,
  options: { vendorName?: string } = {},
): string {
  const mode: RfpMode = session.mode ?? "vendor-brief";
  const draft = session.draft;
  const title =
    mode === "formal-rfp" ? "CRM Formal RFP" : "CRM Vendor Brief";
  const counts = countByPriority(draft.requirements);
  const readiness = assessRfpReadiness(draft, mode);

  const parts: string[] = [];
  parts.push(`# ${title}`);
  parts.push("");
  parts.push(`**SoftwareGlimpse** · Version ${session.versionMeta.version}`);
  if (options.vendorName) {
    parts.push(`**Vendor package:** ${options.vendorName}`);
  }
  parts.push(
    `**Generated:** ${session.versionMeta.generatedAt ?? session.updatedAt}`,
  );
  parts.push("");
  parts.push(
    "> Every statement below is buyer-authored or explicitly selected. SoftwareGlimpse does not invent requirements, pricing, timelines or vendor capabilities.",
  );

  parts.push(
    section(
      "1. Project summary",
      bullet([
        draft.project.projectName
          ? `Project: ${draft.project.projectName}`
          : "",
        draft.project.organization
          ? `Organization: ${draft.project.organization}`
          : "",
        draft.project.owner ? `Owner: ${draft.project.owner}` : "",
        draft.project.executiveSponsor
          ? `Executive sponsor: ${draft.project.executiveSponsor}`
          : "",
        draft.project.currentCrm
          ? `Current CRM: ${draft.project.currentCrm}`
          : "",
        draft.project.geography
          ? `Geography: ${draft.project.geography}`
          : "",
        `Currency: ${draft.project.currency}`,
        draft.project.vendorsExpected != null
          ? `Vendors expected: ${draft.project.vendorsExpected}`
          : "",
        draft.project.issueDate ? `Issue date: ${draft.project.issueDate}` : "",
        draft.project.responseDeadline
          ? `Response deadline: ${draft.project.responseDeadline}`
          : "",
        draft.project.decisionDate
          ? `Target decision: ${draft.project.decisionDate}`
          : "",
        draft.project.goLiveDate
          ? `Target go-live: ${draft.project.goLiveDate}`
          : "",
        `Readiness: ${READINESS_LABELS[readiness.status]}`,
        `Requirements: ${counts.total} (${counts.mustHave} must-have)`,
      ]),
    ),
  );

  parts.push(
    section(
      "2. Business context",
      [
        draft.businessContext.currentSituation
          ? `**Current situation**\n\n${draft.businessContext.currentSituation}`
          : "",
        draft.businessContext.businessProblem
          ? `**Business problem**\n\n${draft.businessContext.businessProblem}`
          : "",
        draft.businessContext.changeTriggers.length
          ? `**Change triggers (buyer-selected prompts)**\n\n${bullet(draft.businessContext.changeTriggers)}`
          : "",
        draft.businessContext.desiredFutureState
          ? `**Desired future state**\n\n${draft.businessContext.desiredFutureState}`
          : "",
        draft.businessContext.successOutcomes
          ? `**Success outcomes**\n\n${draft.businessContext.successOutcomes}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

  if (draft.objectives.length > 0) {
    parts.push(
      section(
        "3. Objectives",
        draft.objectives
          .map(
            (o) =>
              `### ${o.id} — ${o.objective || "(untitled)"}\n\n` +
              bullet([
                o.currentBaseline ? `Current: ${o.currentBaseline}` : "",
                o.desiredOutcome ? `Target: ${o.desiredOutcome}` : "",
                o.measurement ? `Measurement: ${o.measurement}` : "",
                `Priority: ${o.priority}`,
                o.owner ? `Owner: ${o.owner}` : "",
              ]),
          )
          .join("\n\n"),
      ),
    );
  }

  const scopeLines = draft.scope.map(
    (s) => `${s.label} — ${s.phase.replace(/-/g, " ")}`,
  );
  parts.push(section("4. Scope", bullet(scopeLines)));

  const userBits = [
    draft.users.currentUsers != null
      ? `Current users: ${draft.users.currentUsers}`
      : "",
    draft.users.users12Month != null
      ? `12-month expected: ${draft.users.users12Month}`
      : "",
    draft.users.users36Month != null
      ? `36-month expected: ${draft.users.users36Month}`
      : "",
  ];
  const groupLines = draft.users.groups
    .filter((g) => g.group.trim())
    .map(
      (g) =>
        `${g.group}${g.users != null ? ` (${g.users})` : ""}${g.primaryJob ? ` — ${g.primaryJob}` : ""}`,
    );
  parts.push(
    section(
      "5. Users",
      [bullet(userBits), groupLines.length ? bullet(groupLines) : ""]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

  const reqRows = draft.requirements
    .filter((r) => r.priority !== "out-of-scope")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  parts.push(
    section(
      "6. Requirements",
      reqRows.length === 0
        ? "_No requirements entered._"
        : [
            "| ID | Category | Priority | Mandatory | Requirement |",
            "| --- | --- | --- | --- | --- |",
            ...reqRows.map(
              (r) =>
                `| ${r.id} | ${r.category} | ${RFP_PRIORITY_LABELS[r.priority]} | ${r.mandatory ? "Yes" : "No"} | ${r.requirement.replace(/\|/g, "/")} |`,
            ),
          ].join("\n"),
    ),
  );

  parts.push(
    section(
      "Vendor response legend",
      RFP_DELIVERY_METHODS.map(
        (m) =>
          `- **${RFP_DELIVERY_METHOD_LABELS[m]}** — ${RFP_DELIVERY_METHOD_DEFINITIONS[m]}`,
      ).join("\n"),
    ),
  );

  if (draft.integrations.length > 0) {
    parts.push(
      section(
        "7. Integrations",
        [
          "| System | Category | Direction | Data | Criticality |",
          "| --- | --- | --- | --- | --- |",
          ...draft.integrations.map(
            (i) =>
              `| ${i.system} | ${i.category} | ${i.direction} | ${i.data || "—"} | ${i.criticality} |`,
          ),
        ].join("\n"),
      ),
    );
  }

  if (mode === "formal-rfp" && draft.migration.objects.length > 0) {
    parts.push(
      section(
        "8. Data migration",
        [
          draft.migration.performer
            ? `Performer: ${draft.migration.performer}`
            : "",
          draft.migration.constraints
            ? `Constraints: ${draft.migration.constraints}`
            : "",
          "",
          "| Object | Source | Approx count | History | Attachments |",
          "| --- | --- | --- | --- | --- |",
          ...draft.migration.objects.map(
            (o) =>
              `| ${o.objectName} | ${o.sourceSystem} | ${o.approxRecordCount || "—"} | ${o.historyRequired ? "Yes" : "No"} | ${o.attachments ? "Yes" : "No"} |`,
          ),
        ]
          .filter((l) => l !== undefined)
          .join("\n"),
      ),
    );
  }

  const implQs = draft.implementation.questions.filter((q) => q.requested);
  parts.push(
    section(
      mode === "formal-rfp" ? "9. Implementation" : "8. Implementation",
      [
        draft.implementation.model
          ? `Model preference: ${draft.implementation.model}`
          : "",
        draft.implementation.preferredGoLive
          ? `Preferred go-live: ${draft.implementation.preferredGoLive}`
          : "",
        implQs.length
          ? `Vendors should address:\n${bullet(implQs.map((q) => q.label))}`
          : "",
        draft.implementation.customRequirements
          ? draft.implementation.customRequirements
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

  if (mode === "formal-rfp") {
    const sec = draft.securityQuestions.filter((q) => q.required);
    if (sec.length > 0) {
      parts.push(
        section(
          "10. Security & privacy",
          bullet(sec.map((q) => `${q.id}: ${q.question}`)),
        ),
      );
    }
    const support = draft.supportQuestions.filter((q) => q.requested);
    if (support.length > 0) {
      parts.push(
        section(
          "11. Support / SLA",
          bullet(support.map((q) => q.topic)),
        ),
      );
    }
  }

  const a = draft.pricingAssumptions;
  parts.push(
    section(
      "Commercial response request",
      bullet([
        a.usersYear1 != null ? `Users Year 1: ${a.usersYear1}` : "",
        a.usersYear2 != null ? `Users Year 2: ${a.usersYear2}` : "",
        a.usersYear3 != null ? `Users Year 3: ${a.usersYear3}` : "",
        a.requiredAddOns ? `Required add-ons: ${a.requiredAddOns}` : "",
        a.regions ? `Regions: ${a.regions}` : "",
        a.supportTier ? `Support tier: ${a.supportTier}` : "",
        a.implementationScope
          ? `Implementation scope: ${a.implementationScope}`
          : "",
        `Currency: ${a.currency}`,
        `Tax treatment: ${a.taxTreatment}`,
        "Provide software, add-ons, implementation, recurring services and 3-year TCO using the Excel pricing sheet.",
      ]),
    ),
  );

  parts.push(
    section(
      "Response rules",
      bullet(draft.responseRules.rules) +
        "\n\n" +
        bullet([
          draft.responseRules.responseDeadline
            ? `Response deadline: ${draft.responseRules.responseDeadline}`
            : "",
          draft.responseRules.questionsDeadline
            ? `Questions deadline: ${draft.responseRules.questionsDeadline}`
            : "",
          draft.responseRules.contactPerson
            ? `Contact: ${draft.responseRules.contactPerson}`
            : "",
          draft.responseRules.contactEmail
            ? `Email: ${draft.responseRules.contactEmail}`
            : "",
          draft.responseRules.submissionMethod
            ? `Submission: ${draft.responseRules.submissionMethod}`
            : "",
        ]),
    ),
  );

  if (mode === "formal-rfp") {
    parts.push(
      section(
        "Vendor declaration",
        "By submitting a response, the vendor confirms answers are accurate for the quoted edition, identifies all third-party dependencies, and lists assumptions and exceptions.",
      ),
    );
  }

  parts.push(
    section(
      "Next steps (buyer)",
      bullet([
        "Review internally",
        "Optionally freeze requirements",
        "Send the same pack to each shortlisted vendor",
        "Track clarifications (share material answers with all vendors)",
        "Import responses into CRM Vendor Scorecard by requirement ID",
      ]),
    ),
  );

  return parts.map(line).join("\n").trim() + "\n";
}

export function buildRfpPlainText(session: CrmRfpSession): string {
  return buildRfpMarkdown(session)
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^\|\s*/gm, "")
    .replace(/\s*\|$/gm, "");
}

export function modeDocumentTitle(mode: RfpMode): string {
  return mode === "formal-rfp"
    ? "CRM Formal RFP"
    : "CRM Vendor Brief";
}
