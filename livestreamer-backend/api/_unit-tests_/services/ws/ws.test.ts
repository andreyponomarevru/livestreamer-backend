process.env.NODE_ENV = "test";

import { jest, describe, it, expect } from "@jest/globals";
import faker from "faker";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

import {
  send,
  sendToAll,
  sendToAllExceptSender,
} from "../../../src/services/ws/ws";
import { logger } from "../../../src/config/logger";
import type { WSMsg, WSClient } from "../../../src/types";

jest.mock("../../../src/config/logger");

const wsMessage: WSMsg = {
  event: "chat:new_client",
  data: { uuid: uuidv4(), username: faker.internet.userName() },
};

function createWSClient(): WSClient {
  return {
    uuid: uuidv4(),
    username: faker.internet.userName(),
    socket: { send: jest.fn() } as unknown as WebSocket,
  };
}

describe("send", () => {
  it("logs a message if the reciever exists", () => {
    const wsClient = createWSClient();
    const loggerSpy = jest.spyOn(logger, "info");

    send(wsMessage, wsClient);

    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(typeof loggerSpy.mock.calls[0][0]).toBe("string");

    loggerSpy.mockClear();
  });

  it("sends a message if the reciever exists", () => {
    const wsClient = createWSClient();

    send(wsMessage, wsClient);

    expect(wsClient.socket.send).toHaveBeenCalledTimes(1);
    expect(wsClient.socket.send).toHaveBeenLastCalledWith(
      JSON.stringify(wsMessage),
    );
  });
});

describe("sendToAll", () => {
  it("sends a message to all clients", () => {
    const message = JSON.stringify(wsMessage);
    const client1 = createWSClient();
    const client2 = createWSClient();
    const client3 = createWSClient();

    sendToAll(wsMessage, [client1, client2, client3]);

    expect(client1.socket.send).toHaveBeenCalledTimes(1);
    expect(client1.socket.send).toHaveBeenCalledWith(message);

    expect(client2.socket.send).toHaveBeenCalledTimes(1);
    expect(client2.socket.send).toHaveBeenCalledWith(message);

    expect(client3.socket.send).toHaveBeenCalledTimes(1);
    expect(client3.socket.send).toHaveBeenCalledWith(message);
  });
});

describe("sendToAllExceptSender", () => {
  it("sends a message to all clients except sender", () => {
    const message = JSON.stringify(wsMessage);
    const client1 = createWSClient();
    const client2 = createWSClient();
    const client3 = createWSClient();

    sendToAllExceptSender(wsMessage, { senderUUID: client2.uuid }, [
      client1,
      client2,
      client3,
    ]);

    expect(client2.socket.send).not.toBeCalled();
    expect(client1.socket.send).toBeCalledTimes(1);
    expect(client1.socket.send).toBeCalledWith(message);
    expect(client3.socket.send).toBeCalledTimes(1);
    expect(client3.socket.send).toBeCalledWith(message);
  });
});
