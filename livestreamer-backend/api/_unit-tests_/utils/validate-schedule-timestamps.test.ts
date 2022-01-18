import { describe, it, expect } from "@jest/globals";
import faker from "faker";

import { validateScheduleTimestamps } from "../../src/utils/validate-schedule-timestamps";

describe("validateScheduleTimestamps", () => {
  // now + 1sec
  const future1 = new Date().getTime() + 1000;
  const future2 = future1 + 1 * 60 * 60 * 1000;

  it("passes validation if both timestamps are set in the future and if an end timestamp is later than a start timestamp", () => {
    expect(() =>
      validateScheduleTimestamps(
        new Date(future1).toISOString(),
        new Date(future2).toISOString(),
      ),
    ).not.toThrow;
    expect(
      validateScheduleTimestamps(
        new Date(future1).toISOString(),
        new Date(future2).toISOString(),
      ),
    ).toEqual(true);
  });

  it("throws an error if any of timestamps is set to the current time", () => {
    expect(() =>
      validateScheduleTimestamps(
        new Date().toISOString(),
        new Date(future1).toISOString(),
      ),
    ).toThrow();

    expect(() =>
      validateScheduleTimestamps(
        new Date(future1).toISOString(),
        new Date().toISOString(),
      ),
    ).toThrow();
  });

  it("throws an error if a start timestamp is later than an end timestamp", () => {
    expect(() =>
      validateScheduleTimestamps(
        new Date(future2).toISOString(),
        new Date(future1).toISOString(),
      ),
    );
  });
});
