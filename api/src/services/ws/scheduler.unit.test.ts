import {
  afterEach,
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";
import fakeTimers from "@sinonjs/fake-timers";
import { IntervalScheduler } from "./scheduler";

const scheduler = new IntervalScheduler();

jest.mock("../../../src/config/logger");

describe("Scheduler", () => {
  const waitMs = 50000;
  let clock: fakeTimers.InstalledClock;

  beforeEach(() => {
    clock = fakeTimers.install();
  });
  afterEach(() => {
    clock = clock.uninstall() as unknown as fakeTimers.InstalledClock;
    scheduler.stop();
  });

  describe("start", () => {
    it("schedules the timer, invoking the provided callback with a set interval", () => {
      expect(scheduler.timerId).toBe(undefined);

      const callbackSpy = jest.fn();
      const setIntervalSpy = jest.spyOn(global, "setInterval");

      const timerId = scheduler.start(callbackSpy, waitMs);
      expect(scheduler.timerId).toBe(timerId);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);

      const calledWithArg1 = setIntervalSpy.mock.calls[0][0];
      const calledWithArg2 = setIntervalSpy.mock.calls[0][1];
      expect(calledWithArg1).toEqual(callbackSpy);
      expect(calledWithArg2).toEqual(waitMs);

      for (let t = 0; t < 50; t++) clock.tick(waitMs);
      expect(callbackSpy).toBeCalledTimes(50);
    });
  });

  describe("stop", () => {
    it("stops invoking the provided callback and clears the timer", () => {
      expect(scheduler.timerId).toBe(undefined);

      const callbackSpy = jest.fn();
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      const timerId = scheduler.start(callbackSpy, waitMs);
      for (let t = 0; t < 50; t++) clock.tick(waitMs);
      scheduler.stop();

      expect(clearIntervalSpy).toBeCalledTimes(1);
      expect(clearIntervalSpy).toBeCalledWith(timerId);
      expect(scheduler.timerId).toBe(undefined);

      for (let t = 0; t < 50; t++) clock.tick(waitMs);
      expect(callbackSpy).toBeCalledTimes(50);
    });

    it("doesn't clear the timer if the timer id is absent", () => {
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      expect(scheduler.timerId).toBe(undefined);

      scheduler.stop();

      expect(clearIntervalSpy).not.toBeCalled();
    });
  });
});
