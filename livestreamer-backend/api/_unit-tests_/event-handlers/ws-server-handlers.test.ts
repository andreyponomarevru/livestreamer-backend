process.env.NODE_ENV = "test";

import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import faker from "faker";
import EventEmitter from "events";

import { onConnection } from "../../src/event-handlers/ws-server-handlers";
import type { WSClient, SanitizedWSChatClient } from "../../src/types";
import {
  sendBroadcastState,
  sendClientsList,
  sendClientCount,
} from "../../src/event-handlers/services-handlers";
import { clientStore } from "../../src/services/ws/ws";

jest.mock("../../src/services/stream/stream", () => {
  return {
    async readBroadcastState() {
      return { isOnline: false };
    },
  };
});
jest.mock("../../src/event-handlers/services-handlers");
jest.mock("../../src/services/ws/ws", () => {
  return {
    clientStore: {
      addClient: jest.fn(),
      clientCount: 0,
      sanitizedClients: [],
    },
  };
});

describe("onConnection event handler", () => {
  class WebSocketEmitter extends EventEmitter {
    public send: () => void;

    constructor() {
      super();

      this.send = jest.fn();
    }

    close() {
      this.emit("close");
    }
  }

  const client: WSClient = {
    uuid: uuidv4(),
    username: faker.internet.userName(),
    socket: new WebSocketEmitter() as unknown as WebSocket,
  };
  const sanitizedClientsList: SanitizedWSChatClient[] = [];

  const broadcastState = { isOnline: false };

  const clientCount = 0;

  //

  beforeEach(() => {
    (clientStore.addClient as any).mockClear();
    (sendBroadcastState as any).mockClear();
    (sendClientsList as any).mockClear();
    (sendClientCount as any).mockClear();
  });

  it("sets the 'close' event handler on the client's socket", async () => {
    await onConnection(client);

    expect(client.socket.listeners("close").length).toBe(1);
  });

  it("sends the broadcast state to the client", async () => {
    await onConnection(client);

    expect(sendBroadcastState).toHaveBeenCalledTimes(1);
    expect((sendBroadcastState as any).mock.calls[0][0]).toStrictEqual(client);
    expect((sendBroadcastState as any).mock.calls[0][1]).toStrictEqual(
      broadcastState,
    );
  });

  it("adds the client to the store", async () => {
    await onConnection(client);

    expect(clientStore.addClient).toHaveBeenCalledTimes(1);
    expect(clientStore.addClient).toHaveBeenCalledWith(client);
  });

  it("sends the client the client list", async () => {
    await onConnection(client);

    expect(sendClientsList).toHaveBeenCalledTimes(1);
    expect((sendClientsList as any).mock.calls[0][0]).toStrictEqual(client);
    expect((sendClientsList as any).mock.calls[0][1]).toStrictEqual(
      sanitizedClientsList,
    );
  });

  it("sends the client the current client count", async () => {
    await onConnection(client);

    expect(sendClientCount).toHaveBeenCalledTimes(1);
    expect((sendClientCount as any).mock.calls[0][0]).toStrictEqual(client);
    expect((sendClientCount as any).mock.calls[0][1]).toBe(clientCount);
  });
});
