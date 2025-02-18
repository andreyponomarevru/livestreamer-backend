import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { onUncaughtException } from "./node-process-event-handlers";
import { dbConnection } from "./config/postgres";
import { redisConnection } from "./config/redis";

jest.mock("./config/logger");
jest.mock("./config/postgres");
jest.mock("./config/redis");

describe("onUncaughtException", () => {
  const err = new Error();

  beforeEach(() => {
    jest
      .spyOn(process, "exit")
      .mockImplementation(jest.fn<typeof process.exit>());
  });

  it("closes PostgreSQL connection", () => {
    onUncaughtException(err);

    expect(dbConnection.close).toBeCalledTimes(1);
  });

  it("closes Redis connection", () => {
    onUncaughtException(err);

    expect(redisConnection.quit).toBeCalledTimes(1);
  });

  it("exits with error code", () => {
    onUncaughtException(err);

    expect(process.exit).toBeCalledTimes(1);
    expect(process.exit).toBeCalledWith(1);
  });
});
