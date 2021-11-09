import EventEmitter from "events";

import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

import { jest, expect, describe, it } from "@jest/globals";

import { WSClient, BroadcastState } from "../../src/types";
import * as wsService from "../../src/services/ws/ws";

class ClientSocket extends EventEmitter {
  close() {
    this.emit("close");
  }
}

function createWSClientMock() {
  return {
    uuid: uuidv4(),
    socket: new ClientSocket() as WebSocket,
  } as WSClient;
}

const client1 = createWSClientMock();

jest.mock("./../../src/services/ws/ws", () => {
  return {
    ...(jest.requireActual("./ws") as {}),
    clientStore: {
      sanitizedClients: [],
      addClient: jest.fn(),
      deleteClient: jest.fn(),
    },
    addCloseSocketHandler: jest.fn(),
    sendBroadcastState: jest.fn(),
    sendClientsList: jest.fn(),
  };
});
/*
jest.mock("./../stream/stream", () => {
  return {
    ...(jest.requireActual("./../stream/stream") as {}),
    readBroadcastState: () => {
      return {} as BroadcastState;
    },
  };
});*/

//import * as streamService from "../stream/stream";

describe("onConnection function", () => {
  it("attaches 'close' event listener to client's socket", async () => {
    //console.log(wsService);
    //await wsService.onConnection(createWSClientMock());
    //expect(user.socket.listeners("close")).toHaveLength(1);
    //redisConnection.end();
    //expect(closeSocketSpy).toBeCalled();
  });

  /*
      it("automatically deletes client from store when client's socket is closed", () => {
      const clientStore = new WSClientStoreService(new SchedulerMock());
      const user = {} as WSClient;
      clientStore.addClient(user);

      expect(clientStore.clients.length).toEqual(1);
      user.socket.close();
      expect(clientStore.clients.length).toEqual(0);
    });
    */
});
