import { isFutureTimestamp } from "./is-future-timestamp";

export function validateScheduleTimestamps(startAt: string, endAt: string) {
  if (!isFutureTimestamp(startAt) || !isFutureTimestamp(endAt)) {
    throw new Error("Timestamps must be in the future");
  } else if (startAt === endAt) {
    throw new Error("Start and end timestamps must be different");
  } else if (new Date(startAt).getTime() > new Date(endAt).getTime()) {
    throw new Error("End timestamp must be later than start timestamp");
  } else {
    return true;
  }
}
