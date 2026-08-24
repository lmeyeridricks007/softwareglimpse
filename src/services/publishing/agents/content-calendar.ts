import { writeContentCalendar } from "@/services/publishing/launches";

export function runContentCalendarAgent(): string {
  return writeContentCalendar();
}
