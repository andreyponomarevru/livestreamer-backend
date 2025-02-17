import type { Socket } from "net";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request } from "express";
import {
  onServerUpgrade,
  handleNewWSConnection,
  onServerError,
  onServerListening,
} from "./http-server-event-handlers";
import { logger } from "./config/logger";
import { sessionParser } from "./express-app";
import { wsServer } from "./ws-server";
import { EventEmitter } from "stream";

jest.mock("./config/logger", () => {
  return { logger: { error: jest.fn(), debug: jest.fn(), info: jest.fn() } };
});
jest.mock("./express-app", () => ({ sessionParser: jest.fn() }));

jest.mock("./ws-server", () => {
  const originalModule =
    jest.requireActual<typeof import("./ws-server")>("./ws-server");

  return {
    ...originalModule,
    wsServer: { ...originalModule.wsServer, handleUpgrade: jest.fn() },
  };
});

describe("onServerListening", () => {
  it("logs a message when the server starts listening", () => {
    onServerListening();

    expect(logger.debug).toHaveBeenCalledTimes(1);

    jest.mocked(logger.debug).mockRestore();
  });
});

describe("onServerError", () => {
  let processExitMock: jest.SpiedFunction<typeof process.exit>;

  beforeEach(() => {
    processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation(jest.fn<typeof process.exit>());
  });

  it("throws an error if the syscall that has failed is not 'listen'", () => {
    const err = {
      message: "Test",
      syscall: "not listen",
    } as NodeJS.ErrnoException;

    expect(() => onServerError(err)).toThrowError(err.message);
  });

  it("exits process with an error if the syscall is 'listen' and the error code is 'EACCES'", () => {
    const err = { syscall: "listen", code: "EACCES" } as NodeJS.ErrnoException;

    expect(() => onServerError(err)).not.toThrowError();
    expect(processExitMock).toHaveBeenCalledTimes(1);
    expect(processExitMock).toHaveBeenCalledWith(1);
  });

  it("logs an error if the syscall is 'listen' and the error code is 'EACCESS'", () => {
    const logErrorMock = jest
      .spyOn(logger, "error")
      .mockImplementation(jest.fn<typeof logger.error>());

    onServerError({
      syscall: "listen",
      code: "EACCES",
    } as NodeJS.ErrnoException);

    expect(logErrorMock).toHaveBeenCalledTimes(1);
  });

  it("exit process with an error if the syscall is 'listen' and the error code  is 'EADDRINUSE'", () => {
    const err = { syscall: "listen", code: "EACCES" } as NodeJS.ErrnoException;

    expect(() => onServerError(err)).not.toThrowError();
    expect(processExitMock).toHaveBeenCalledTimes(1);
    expect(processExitMock).toHaveBeenCalledWith(1);
  });

  it("logs an error if the syscall is 'listen' and the error code is 'EADDRINUSE'", () => {
    onServerError({
      syscall: "listen",
      code: "EACCES",
    } as NodeJS.ErrnoException);

    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it("throws an error if the syscall is 'listen' but the error code is unknown", () => {
    const err = {
      message: "Test",
      syscall: "listen",
      code: "unknown code",
    } as NodeJS.ErrnoException;

    expect(() => onServerError(err)).toThrowError(err.message);
  });
});

describe("onServerUpgrade", () => {
  it("calls session parser", async () => {
    const req = {} as Request;
    const socket = {} as Socket;
    const head = Buffer.from("");

    await onServerUpgrade(req, socket, head);

    expect(sessionParser).toHaveBeenCalledTimes(1);
  });

  it("passes the request parser the request object", async () => {
    const req = {} as Request;
    const socket = {} as Socket;
    const head = Buffer.from("");

    await onServerUpgrade(req, socket, head);

    expect(jest.mocked(sessionParser).mock.calls[0][0]).toStrictEqual(req);
  });
});

describe("handleNewWSConnection", () => {
  it("handles protocol upgrade from HTTP to WS if the user is authenticated", () => {
    const req = { session: { authenticatedUser: {} } } as Request;
    const socket = {} as Socket;
    const head = Buffer.from("");

    handleNewWSConnection(req, socket, head);

    expect(jest.mocked(wsServer.handleUpgrade)).toHaveBeenCalledTimes(1);
  });

  it.only("handles protocol upgrade from HTTP to WS if the user is not authenticated", async () => {
    const req1 = { session: { authenticatedUser: {} } } as Request;
    const req2 = {} as Request;
    const socket = new EventEmitter() as Socket;
    const head = Buffer.from("");

    handleNewWSConnection(req1, socket, head);
    expect(wsServer.handleUpgrade).toHaveBeenCalledTimes(1);

    handleNewWSConnection(req2, socket, head);
    expect(wsServer.handleUpgrade).toHaveBeenCalledTimes(2);
  });
});
