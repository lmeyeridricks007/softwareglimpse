/**
 * Deterministic field-name suggestions.
 * Suggestions are always status "suggested" — never silently confirmed.
 * No fuzzy AI mapping.
 */

export type FieldSuggestion = {
  targetObject: string;
  targetField: string;
  confidence: "exact-name";
};

const NORMALIZE = (s: string) =>
  s
    .toLowerCase()
    .replace(/[_\-\s]+/g, "")
    .replace(/__c$/i, "");

/** Common CRM field aliases → suggested target labels (generic, not product-specific). */
const ALIAS_MAP: Array<{
  aliases: string[];
  targetObject: string;
  targetField: string;
}> = [
  {
    aliases: ["email", "emailaddress", "workemail", "primaryemail"],
    targetObject: "Person",
    targetField: "Email",
  },
  {
    aliases: ["phone", "phonenumber", "mobile", "mobilephone", "workphone"],
    targetObject: "Person",
    targetField: "Phone",
  },
  {
    aliases: ["firstname", "first", "givenname"],
    targetObject: "Person",
    targetField: "First name",
  },
  {
    aliases: ["lastname", "last", "surname", "familyname"],
    targetObject: "Person",
    targetField: "Last name",
  },
  {
    aliases: ["fullname", "fullnamename", "accountname", "organization", "organisation"],
    targetObject: "Organization",
    targetField: "Name",
  },
  {
    aliases: ["title", "jobtitle"],
    targetObject: "Person",
    targetField: "Job title",
  },
  {
    aliases: ["website", "url", "web"],
    targetObject: "Organization",
    targetField: "Website",
  },
  {
    aliases: ["dealname", "opportunityname", "oppname"],
    targetObject: "Deal",
    targetField: "Title",
  },
  {
    aliases: ["amount", "value", "dealvalue", "opportunityamount"],
    targetObject: "Deal",
    targetField: "Value",
  },
  {
    aliases: ["closedate", "expectedclosedate", "closed_date"],
    targetObject: "Deal",
    targetField: "Expected close date",
  },
];

export function suggestTargetField(
  sourceField: string,
): FieldSuggestion | null {
  const key = NORMALIZE(sourceField);
  for (const entry of ALIAS_MAP) {
    if (entry.aliases.some((a) => NORMALIZE(a) === key)) {
      return {
        targetObject: entry.targetObject,
        targetField: entry.targetField,
        confidence: "exact-name",
      };
    }
  }
  return null;
}

/**
 * Apply deterministic suggestions to unmapped fields.
 * Never overwrites a confirmed mapping (mapped / do-not-migrate).
 */
export function applyFieldSuggestions<
  T extends {
    id: string;
    sourceField: string;
    targetField?: string;
    targetObject?: string;
    status: string;
    suggestionPending?: boolean;
    transformation?: string;
  },
>(
  mappings: T[],
): { mappings: T[]; suggestedCount: number } {
  let suggestedCount = 0;
  const next = mappings.map((m) => {
    if (
      m.status === "mapped" ||
      m.status === "do-not-migrate" ||
      (m.targetField && m.status !== "unknown" && m.status !== "suggested")
    ) {
      return m;
    }
    const suggestion = suggestTargetField(m.sourceField);
    if (!suggestion) return m;
    suggestedCount += 1;
    return {
      ...m,
      targetObject: m.targetObject || suggestion.targetObject,
      targetField: suggestion.targetField,
      status: "suggested" as T["status"],
      suggestionPending: true,
    };
  });
  return { mappings: next, suggestedCount };
}

export type FieldTypeRisk = "ok" | "transformation-required" | "potential-data-loss";

/**
 * Compare source/target type labels when present.
 * Conservative: unknown types → no automatic risk.
 */
export function assessFieldTypeRisk(
  sourceType?: string,
  targetType?: string,
): FieldTypeRisk {
  if (!sourceType || !targetType) return "ok";
  const s = sourceType.toLowerCase();
  const t = targetType.toLowerCase();
  if (s === t) return "ok";

  const freeText = /text|string|textarea|longtext|free/.test(s);
  const enumLike = /picklist|dropdown|select|enum|status|stage/.test(t);
  if (freeText && enumLike) return "transformation-required";

  if (/lookup|reference|id/.test(s) && /text|string|email|phone/.test(t)) {
    return "potential-data-loss";
  }
  if (/textarea|longtext/.test(s) && /text(?!area)|string|varchar/.test(t)) {
    return "potential-data-loss";
  }
  if (s !== t) return "transformation-required";
  return "ok";
}
