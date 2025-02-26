import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
import { WSChatClient } from "../../../src/services/ws/ws-client";

describe("WSChatClient class", () => {
  describe("constructor", () => {
    it("returns a new client", () => {
      const clientDetails = {
        id: undefined,
        uuid: uuidv4(),
        username: faker.internet.username(),
        socket: {} as WebSocket,
      };
      const client = new WSChatClient(clientDetails);

      expect(client).toEqual(clientDetails);
    });

    it("creates username from uuid if no username has been provided", () => {
      const clientDetails = { uuid: uuidv4(), socket: {} as WebSocket };
      const client = new WSChatClient(clientDetails);

      expect(client.username).toBe(clientDetails.uuid.substring(0, 8));
    });
  });
});
