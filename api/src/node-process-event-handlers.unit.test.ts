import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { logger } from "./config/logger";

import {
  onWarning,
  onUncaughtException,
  onUnhandledRejection,
} from "./node-process-event-handlers";
import { dbConnection } from "./config/postgres";
import { redisConnection } from "./config/redis";

jest.mock("./config/logger");
jest.mock("./config/postgres");
jest.mock("./config/redis");

const err = new Error("Test");

describe("onWarning", () => {
  it("logs warning", () => {
    onWarning(err);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(err.stack);
  });
});

describe("onUncaughtException", () => {
  let processExitMock: jest.SpiedFunction<typeof process.exit>;

  beforeEach(() => {
    processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation(jest.fn<typeof process.exit>());
  });

  it("logs an error", () => {
    onUncaughtException(err);

    expect(logger.error).toHaveBeenCalledTimes(1);
    const calledWithArg = jest.mocked(logger.error).mock.calls[0][0];
    expect(typeof calledWithArg).toBe("string");

    processExitMock.mockRestore();
  });

  it("closes PostgreSQL connection", () => {
    onUncaughtException(err);

    expect(dbConnection.close).toHaveBeenCalledTimes(1);
  });

  it("closes Redis connection", () => {
    onUncaughtException(err);

    expect(redisConnection.quit).toHaveBeenCalledTimes(1);

    processExitMock.mockRestore();
  });

  it("exits process", () => {
    onUncaughtException(err);

    expect(processExitMock).toHaveBeenCalledTimes(1);
    expect(processExitMock).toHaveBeenCalledWith(1);

    processExitMock.mockRestore();
  });

  it.todo("exits process with error code");
});

describe("onUnhandledRejection", () => {
  it("logs error", () => {
    onUnhandledRejection("reason", Promise.resolve(err));

    expect(logger.error).toHaveBeenCalledTimes(1);
    const calledWithArg = jest.mocked(logger.error).mock.calls[0][0];
    expect(typeof calledWithArg).toBe("string");
  });
});
