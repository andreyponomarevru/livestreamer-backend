import { jest, describe, it, beforeEach, expect } from "@jest/globals";

import {
  onClose,
  onConnection,
  sendBroadcastState,
  onStreamEnd,
  onStreamStart,
  onStreamLike,
  sendClientCount,
  sendClientsList,
  onUnlikeChatMsg,
  onLikeChatMsg,
  onDestroyChatMsg,
  onCreateChatMsg,
  onUpdateClientCount,
  onDeleteClient,
  onAddClient,
} from "../../src/event-handlers/ws-server";

describe("onConnection event handler", () => {
  it.todo("sets the 'close' event handler on the client's socket");

  it.todo("sends the broadcast state to the client");

  it.todo("adds the client to the store");

  it.todo("sends the client the client list");

  it.todo("sends the client the current client count");
});

describe("onAddClient", () => {
  it.todo("sands the message to all clients");
});

describe("onDeleteClient", () => {
  it.todo("sends the message to all clients");
});

describe("onUpdateClientCount", () => {
  it.todo("sends the message to all clients");
});

describe("onCreateChatMsg", () => {
  it.todo("sends the message to all except sender");
});

describe("onDestroyChatMsg", () => {
  it.todo("sends the message to all except sender");
});

describe("onLikeChatMsg", () => {
  it.todo("sends the message to all except sender");
});

describe("onUnlikeChatMsg", () => {
  it.todo("sends the message to all except sender");
});

describe("sendClientsList", () => {
  it.todo("sends the message to the client");
});

describe("sendClientCount", () => {
  it.todo("sends the message to the client");
});

describe("onStreamLike", () => {
  it.todo("sends the message to all except sender");
});

describe("onStreamStart", () => {
  it.todo("sends the message to all clients");
});

describe("onStreamEnd", () => {
  it.todo("sends the message to all clients");
});

describe("sendBroadcastState", () => {
  it.todo("sends the message to the client");
});
