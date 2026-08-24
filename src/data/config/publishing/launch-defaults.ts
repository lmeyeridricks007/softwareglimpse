/**
 * Default launch publication time when a date is supplied without an explicit time.
 * Do not change silently in agent code — reference this constant.
 */
export const launchPublishingDefaults = {
  /** Local time (HH:mm) applied when publishTime is omitted. */
  defaultPublishTime: "08:00",
  /** IANA timezone when timezone is omitted but local date parts are used. */
  defaultTimezone: "Europe/Amsterdam",
} as const;
