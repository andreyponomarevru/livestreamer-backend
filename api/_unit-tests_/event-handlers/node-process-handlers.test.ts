import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { logger } from "../../src/config/logger";

import {
  onWarning,
  onUncaughtException,
  onUnhandledRejection,
} from "../../src/event-handlers/node-process-handlers";
import * as postgresConnection from "../../src/config/postgres";
import * as redisConnection from "../../src/config/redis";

jest.mock("../../src/config/logger");
jest.mock("../../src/config/postgres");
jest.mock("../../src/config/redis");

const err = new Error("Test");

describe("onWarning", () => {
  beforeEach(() => (logger.warn as any).mockClear());

  it("logs warning", () => {
    onWarning(err);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(err.stack);
  });
});

describe("onUncaughtException", () => {
  beforeEach(() => {
    (logger.error as any).mockClear();
    (postgresConnection.close as any).mockClear();
    (redisConnection.quit as any).mockClear();
  });

  it("logs an error", () => {
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onUncaughtException(err);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(typeof (logger.error as any).mock.calls[0][0]).toBe("string");

    processExitMock.mockRestore();
  });

  it("closes PostgreSQL connection", () => {
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onUncaughtException(err);

    expect(postgresConnection.close).toHaveBeenCalledTimes(1);

    processExitMock.mockRestore();
  });

  it("closes Redis connection", () => {
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onUncaughtException(err);

    expect(redisConnection.quit).toHaveBeenCalledTimes(1);

    processExitMock.mockRestore();
  });

  it("exits process", () => {
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onUncaughtException(err);

    expect(processExitMock).toHaveBeenCalledTimes(1);
    expect(processExitMock).toHaveBeenCalledWith(1);

    processExitMock.mockRestore();
  });

  it.todo("exits process with error code");
});

describe("onUnhandledRejection", () => {
  beforeEach(() => {
    (logger.error as any).mockClear();
  });

  it("logs error", () => {
    onUnhandledRejection("reason", Promise.resolve(err));

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(typeof (logger.error as any).mock.calls[0][0]).toBe("string");
  });
});
