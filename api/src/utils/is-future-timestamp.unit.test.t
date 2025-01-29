import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { isFutureTimestamp } from "../../src/utils/is-future-timestamp";

describe("isFutureTimestamp", () => {
  it("returns true if timestamp is set in the future", () => {
    expect(isFutureTimestamp(faker.date.future().toISOString())).toBe(true);
  });

  it("returns false if timestamp is set in the past", () => {
    expect(isFutureTimestamp(faker.date.past().toISOString())).toBe(false);
  });

  it("returns false if timestamp is set to current time", () => {
    expect(isFutureTimestamp(new Date().toISOString())).toBe(false);
  });
});
