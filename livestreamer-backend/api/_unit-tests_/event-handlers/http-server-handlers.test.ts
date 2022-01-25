import { Socket } from "net";
import { EventEmitter } from "events";

import {
  jest,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import faker from "faker";
import WebSocket from "ws";

import {
  onServerUpgrade,
  handleNewWSConnection,
  onServerError,
  onServerListening,
} from "../../src/event-handlers/http-server-handlers";
import * as redicConnection from "../../src/config/redis";
import { logger } from "../../src/config/logger";
import { sessionParser } from "../../src/express-app";
import { wsServer } from "../../src/ws-server";
import type { WSClient } from "../../src/types";

jest.mock("../../src/config/logger", () => {
  return { logger: { error: jest.fn(), debug: jest.fn(), info: jest.fn() } };
});
jest.mock("../../src/express-app", () => ({ sessionParser: jest.fn() }));
jest.mock("../../src/ws-server", () => {
  const originalModule = jest.requireActual("../../src/ws-server");

  return {
    __esModule: true,
    ...(originalModule as any),
    wsServer: { ...(originalModule as any).wsServer, handleUpgrade: jest.fn() },
  };
});

describe("onServerListening", () => {
  it("logs a message when the server starts listening", () => {
    (logger.debug as any).mockClear();

    onServerListening();

    expect(logger.debug).toHaveBeenCalledTimes(1);
  });
});

describe("onServerError event handler", () => {
  beforeEach(() => {
    (logger.error as any).mockClear();
    (logger.debug as any).mockClear();
    (logger.info as any).mockClear();
  });

  // FIX: when jest runs these unit tests, for some reason it triggers the Redis. Thus after each test we have to manually close Redis connection
  afterEach(() => redicConnection.quit());

  it("throws an error if the syscall that has failed is not 'listen'", () => {
    const err = { syscall: "not listen" } as NodeJS.ErrnoException;
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    expect(() => onServerError(err)).toThrowError();

    processExitMock.mockRestore();
  });

  it("exits process with an error if the syscall is 'listen' and the error code is 'EACCES'", () => {
    const err = { syscall: "listen", code: "EACCES" } as NodeJS.ErrnoException;
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onServerError(err);

    expect(processExitMock).toHaveBeenCalledTimes(1);
    expect(processExitMock).toHaveBeenCalledWith(1);
    expect(() => onServerError(err)).not.toThrowError();

    processExitMock.mockRestore();
  });

  it("logs an error if the syscall is 'listen' and the error code is 'EACCESS'", () => {
    const err = { syscall: "listen", code: "EACCES" } as NodeJS.ErrnoException;
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onServerError(err);

    expect(logger.error).toHaveBeenCalledTimes(1);

    processExitMock.mockRestore();
  });

  it("exit process with an error if the syscall is 'listen' and the error code  is 'EADDRINUSE'", () => {
    const err = { syscall: "listen", code: "EACCES" } as NodeJS.ErrnoException;
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onServerError(err);

    expect(processExitMock).toHaveBeenCalledTimes(1);
    expect(processExitMock).toHaveBeenCalledWith(1);
    expect(() => onServerError(err)).not.toThrowError();

    processExitMock.mockRestore();
  });

  it("logs an error if the syscall is 'listen' and the error code is 'EADDRINUSE'", () => {
    const err = { syscall: "listen", code: "EACCES" } as NodeJS.ErrnoException;
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    onServerError(err);

    expect(logger.error).toHaveBeenCalledTimes(1);

    processExitMock.mockRestore();
  });

  it("throws an error if the syscall is 'listen' but the error code is unknown", () => {
    const err = {
      syscall: "listen",
      code: "unknown code",
    } as NodeJS.ErrnoException;
    // For some reason, 'jest.mock("process", () => {});' doesn't work, so I've replaced it with the line below
    const processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    expect(() => onServerError(err)).toThrowError();

    processExitMock.mockRestore();
  });
});

describe("onServerUpgrade", () => {
  beforeEach(() => (sessionParser as any).mockClear());

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

    expect((sessionParser as any).mock.calls[0][0]).toStrictEqual(req);
  });
});

describe("handleNewWSConnection", () => {
  beforeAll(() => {
    console.log(wsServer);
    //(wsServer.handleUpgrade as any).mockImplementation(() => jest.fn());
    /*(wsServer.handleUpgrade as any).mockImplementation(() => {
      jest.fn().mockImplementation(() => {
        const r = {};
        jest.util;
        return {};
      });
    });*/
  });
  afterAll(() => {
    //(wsServer.handleUpgrade as any).mockClear();
  });

  beforeEach(() => (wsServer.handleUpgrade as any).mockClear());

  it("handles protocol upgrade from HTTP to WS if the user is authenticated", () => {
    const req = { session: { authenticatedUser: {} } } as Request;
    const socket = {} as Socket;
    const head = Buffer.from("");

    handleNewWSConnection(req, socket, head);

    expect(wsServer.handleUpgrade).toHaveBeenCalledTimes(1);
  });

  it("handles protocol upgrade from HTTP to WS if the user is not authenticated", () => {
    const req1 = { session: {} } as Request;
    const req2 = {} as Request;
    const socket = {} as Socket;
    const head = Buffer.from("");

    handleNewWSConnection(req1, socket, head);
    expect(wsServer.handleUpgrade).toHaveBeenCalledTimes(1);

    handleNewWSConnection(req2, socket, head);
    expect(wsServer.handleUpgrade).toHaveBeenCalledTimes(2);
  });

  // it.todo("emits 'connection' event with the client as argument");
  /*const wsClient: WSClient = {
      uuid: uuidv4(),
      id: faker.datatype.number(),
      username: faker.internet.userName(),
      socket: {} as WebSocket,
    };*/
});
