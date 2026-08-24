import { launchPublishingDefaults } from "@/data/config/publishing/launch-defaults";

export type ResolvedPublishInstant = {
  /** Canonical UTC ISO-8601 with Z */
  publishAtUtc: string;
  /** YYYY-MM-DD in the supplied timezone */
  localDate: string;
  /** HH:mm in the supplied timezone */
  localTime: string;
  timezone: string;
  /** Human label e.g. "15 Sep 2026 · 08:00 Europe/Amsterdam" */
  humanLabel: string;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Convert local date/time in an IANA timezone to UTC ISO.
 * Uses Intl — no implicit server-local timezone.
 */
export function localDateTimeToUtcIso(
  date: string,
  time: string,
  timeZone: string,
): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (
    [year, month, day, hour, minute].some((n) => Number.isNaN(n)) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(`Invalid local date/time: ${date} ${time}`);
  }

  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const targetKey =
    year * 1e10 + month * 1e8 + day * 1e6 + hour * 1e4 + minute;

  function keyFor(d: Date): number {
    const parts = Object.fromEntries(
      fmt.formatToParts(d).map((p) => [p.type, p.value]),
    );
    return (
      Number(parts.year) * 1e10 +
      Number(parts.month) * 1e8 +
      Number(parts.day) * 1e6 +
      Number(parts.hour) * 1e4 +
      Number(parts.minute)
    );
  }

  let lo = Date.UTC(year, month - 1, day, hour, minute, 0) - 14 * 3_600_000;
  let hi = lo + 28 * 3_600_000;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (keyFor(new Date(mid)) < targetKey) lo = mid + 1;
    else hi = mid;
  }

  return new Date(lo).toISOString();
}

export function formatHumanPublishLabel(input: {
  localDate: string;
  localTime: string;
  timezone: string;
}): string {
  const [y, m, d] = input.localDate.split("-").map(Number);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
  return `${d} ${month} ${y} · ${input.localTime} ${input.timezone}`;
}

export type PublishInstantInput = {
  publishAt?: string;
  publishDate?: string;
  publishTime?: string;
  timezone?: string;
};

/**
 * Resolve a publication instant from onboarding input.
 * Throws when date is missing or time cannot be resolved without inventing silently.
 */
export function resolvePublishInstant(
  input: PublishInstantInput,
): ResolvedPublishInstant {
  if (input.publishAt?.trim()) {
    const raw = input.publishAt.trim();
    const parsed = Date.parse(raw);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid publishAt: ${raw}`);
    }
    const d = new Date(parsed);
    const timezone = input.timezone?.trim() || "UTC";
    const localDate = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
    const localTime = `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
    return {
      publishAtUtc: d.toISOString(),
      localDate,
      localTime,
      timezone,
      humanLabel: d.toISOString(),
    };
  }

  const publishDate = input.publishDate?.trim();
  if (!publishDate) {
    throw new Error(
      "Publication date is required for scheduling (publishDate or publishAt)",
    );
  }

  const timezone =
    input.timezone?.trim() || launchPublishingDefaults.defaultTimezone;
  const publishTime =
    input.publishTime?.trim() || launchPublishingDefaults.defaultPublishTime;

  if (!input.publishTime?.trim()) {
    // Explicit default — not silent invention without config reference
    console.info(
      `[onboarding] Using configured default publish time ${publishTime} (${timezone})`,
    );
  }

  const publishAtUtc = localDateTimeToUtcIso(
    publishDate,
    publishTime,
    timezone,
  );

  return {
    publishAtUtc,
    localDate: publishDate,
    localTime: publishTime,
    timezone,
    humanLabel: formatHumanPublishLabel({
      localDate: publishDate,
      localTime: publishTime,
      timezone,
    }),
  };
}

export function buildLaunchId(productSlug: string, localDate: string): string {
  const ym = localDate.slice(0, 7);
  return `product-${productSlug}-${ym}`;
}
