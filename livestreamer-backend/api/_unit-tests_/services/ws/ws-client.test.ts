import { describe, it, beforeEach, expect } from "@jest/globals";
import faker from "faker";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

import { WSChatClient } from "../../../src/services/ws/ws-client";

describe("WSChatClient class", () => {
  describe("constructor", () => {
    it("returns a new client", () => {
      const clientDetails = {
        uuid: uuidv4(),
        username: faker.internet.userName(),
        socket: {} as WebSocket,
      };
      const client = new WSChatClient(clientDetails);

      expect(client.id).toBe(undefined);
      expect(client.uuid).toBe(clientDetails.uuid);
      expect(client.username).toBe(clientDetails.username);
      expect(client.socket).toStrictEqual(clientDetails.socket);
    });

    it("creates username from uuid if no username has been provided", () => {
      const clientDetails = { uuid: uuidv4(), socket: {} as WebSocket };
      const client = new WSChatClient(clientDetails);

      expect(client.username).toBe(clientDetails.uuid.substr(0, 8));
    });
  });
});
