import { randomUUID } from "node:crypto";
import {
  ChangeEventSchema,
  type ChangeEvent,
} from "@/domain";
import { appendChangeEvent } from "@/data/publishing/store";

export type RecordChangeEventInput = Omit<ChangeEvent, "id" | "detectedAt"> & {
  id?: string;
  detectedAt?: string;
};

export function recordChangeEvent(input: RecordChangeEventInput): ChangeEvent {
  const event = ChangeEventSchema.parse({
    ...input,
    id: input.id ?? randomUUID(),
    detectedAt: input.detectedAt ?? new Date().toISOString(),
  });
  appendChangeEvent(event);
  return event;
}
