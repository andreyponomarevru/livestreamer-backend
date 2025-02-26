import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
import { sanitizeWSClient } from "./sanitize-ws-client";

describe("sanitizeWSClient", () => {
  const wsClient = {
    uuid: uuidv4(),
    username: faker.internet.username(),
    socket: {} as WebSocket,
  };

  it("returns client with sensitive data stripped out", () => {
    sanitizeWSClient(wsClient);

    expect(sanitizeWSClient(wsClient)).toStrictEqual({
      uuid: wsClient.uuid,
      username: wsClient.username,
    });
  });
});
