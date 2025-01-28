import { afterEach, jest, describe, it, expect } from "@jest/globals";

import { IntervalScheduler } from "./scheduler";

const scheduler = new IntervalScheduler();

afterEach(() => scheduler.stop());

// TODO: finish when you will read how to test timers

describe("Scheduler class", () => {
  describe("start method", () => {
    it("sets the timer", () => {
      expect(1).toBe(2);
    } /*, () => {
      scheduler.start(() => {}, 1000);
      
      expect(typeof scheduler.timerId).toBe("object");
    }*/);

    it.todo(
      "invokes the provided callback in a given time interval" /* () => {
      scheduler.start(() =>{}, 1000);

      expect(scheduler.)
    }*/,
    );
  });

  describe("stop method", () => {
    it.todo("stops invoking the provided callback" /*, () => {}*/);

    it.todo("clears the timer" /*, () => {}*/);

    it.todo(
      "doesn't throw error if the scheduler has been stopped before starting" /*, () => {}*/,
    );
  });
});
