import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import faker from "faker";

import {
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
} from "../../src/event-handlers/services-handlers";
import {
  send,
  sendToAll,
  sendToAllExceptSender,
  clientStore,
} from "../../src/services/ws/ws";
import {
  SanitizedWSChatClient,
  DeletedWSClient,
  WSClient,
  BroadcastDraft,
  BroadcastState,
} from "../../src/types";

jest.mock("../../src/services/ws/ws", () => {
  return {
    clientStore: { addClient: jest.fn(), clientCount: 0, clients: [] },
    send: jest.fn(),
    sendToAll: jest.fn(),
    sendToAllExceptSender: jest.fn(),
  };
});

const wsClient: WSClient = {
  uuid: uuidv4(),
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  socket: {} as WebSocket,
};

beforeEach(() => {
  (send as any).mockClear();
  (sendToAll as any).mockClear();
  (sendToAllExceptSender as any).mockClear();
});

describe("onAddClient", () => {
  it("sands the message to all clients", () => {
    const eventData: SanitizedWSChatClient = {
      uuid: uuidv4(),
      username: faker.internet.userName(),
    };

    onAddClient(eventData);

    expect(sendToAll).toHaveBeenCalledTimes(1);
    expect((sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:new_client",
      data: eventData,
    });
    expect((sendToAll as any).mock.calls[0][1]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onDeleteClient", () => {
  it("sends the message to all clients", () => {
    const eventData: DeletedWSClient = {
      uuid: uuidv4(),
      username: faker.internet.userName(),
      id: faker.datatype.number(),
    };

    onDeleteClient(eventData);

    expect(sendToAll).toHaveBeenCalledTimes(1);
    expect((sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:deleted_client",
      data: eventData,
    });
    expect((sendToAll as any).mock.calls[0][1]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onUpdateClientCount", () => {
  it("sends the message to all clients", () => {
    const eventData = faker.datatype.number();

    onUpdateClientCount(eventData);

    expect(sendToAll).toHaveBeenCalledTimes(1);
    expect((sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:client_count",
      data: { count: eventData },
    });
    expect((sendToAll as any).mock.calls[0][1]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onCreateChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      id: faker.datatype.number(),
      userUUID: uuidv4(),
      userId: faker.datatype.number(),
      username: faker.internet.userName(),
      createdAt: faker.date.past().toISOString(),
      message: faker.lorem.paragraph(),
      likedByUserId: [2, 8, 25, 48],
    };

    onCreateChatMsg(eventData);

    expect(sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect((sendToAllExceptSender as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:created_message",
      data: eventData,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][1]).toStrictEqual({
      senderUUID: eventData.userUUID,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][2]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onDestroyChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      id: faker.datatype.number(),
      userUUID: uuidv4(),
      userId: faker.datatype.number(),
    };

    onDestroyChatMsg(eventData);

    expect(sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect((sendToAllExceptSender as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:deleted_message",
      data: eventData,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][1]).toStrictEqual({
      senderUUID: eventData.userUUID,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][2]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onLikeChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      messageId: faker.datatype.number(),
      likedByUserId: faker.datatype.number(),
      likedByUserIds: [8, 58, 78, 9],
      likedByUserUUID: uuidv4(),
    };

    onLikeChatMsg(eventData);

    expect(sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect((sendToAllExceptSender as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:liked_message",
      data: eventData,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][1]).toStrictEqual({
      senderUUID: eventData.likedByUserUUID,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][2]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onUnlikeChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      messageId: faker.datatype.number(),
      unlikedByUserUUID: uuidv4(),
      unlikedByUserId: faker.datatype.number(),
      likedByUserIds: [45, 15, 1, 57],
    };

    onUnlikeChatMsg(eventData);

    expect(sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect((sendToAllExceptSender as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:unliked_message",
      data: eventData,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][1]).toStrictEqual({
      senderUUID: eventData.unlikedByUserUUID,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][2]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("sendClientsList", () => {
  function createClient(): SanitizedWSChatClient {
    return { uuid: uuidv4(), username: faker.internet.userName() };
  }

  it("sends the message to the client", () => {
    const allCurrentWSclients = [
      createClient(),
      createClient(),
      createClient(),
    ];

    sendClientsList(wsClient, allCurrentWSclients);

    expect(send).toHaveBeenCalledTimes(1);
    expect((send as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:client_list",
      data: allCurrentWSclients,
    });
    expect((send as any).mock.calls[0][1]).toStrictEqual(wsClient);
  });
});

describe("sendClientCount", () => {
  it("sends the message to the client", () => {
    const clientCount = faker.datatype.number();

    sendClientCount(wsClient, clientCount);

    expect(send).toHaveBeenCalledTimes(1);
    expect((send as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:client_count",
      data: { count: clientCount },
    });
    expect((send as any).mock.calls[0][1]).toStrictEqual(wsClient);
  });
});

describe("onStreamLike", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      broadcastId: faker.datatype.number(),
      likedByUserUUID: uuidv4(),
      likedByUserId: faker.datatype.number(),
      likedByUsername: faker.internet.userName(),
      likeCount: faker.datatype.number(),
    };

    onStreamLike(eventData);

    expect(sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect((sendToAllExceptSender as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:like",
      data: eventData,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][1]).toStrictEqual({
      senderUUID: eventData.likedByUserUUID,
    });
    expect((sendToAllExceptSender as any).mock.calls[0][2]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onStreamStart", () => {
  it("sends the message to all clients", () => {
    const eventData: BroadcastDraft = {
      id: faker.datatype.number(),
      title: faker.lorem.sentence(),
      startAt: faker.date.past().toISOString(),
      listenerPeakCount: faker.datatype.number(),
      likeCount: faker.datatype.number(),
    };

    onStreamStart(eventData);

    expect(sendToAll).toHaveBeenCalledTimes(1);
    expect((sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:state",
      data: { isOnline: true, broadcast: eventData },
    });
    expect((sendToAll as any).mock.calls[0][1]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("onStreamEnd", () => {
  it("sends the message to all clients", () => {
    onStreamEnd();

    expect(sendToAll).toHaveBeenCalledTimes(1);
    expect((sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:state",
      data: { isOnline: false },
    });
    expect((sendToAll as any).mock.calls[0][1]).toStrictEqual(
      clientStore.clients,
    );
  });
});

describe("sendBroadcastState", () => {
  it("sends the message to the client", () => {
    const broadcastState: BroadcastState = {
      isOnline: faker.datatype.boolean(),
      broadcast: {
        likeCount: faker.datatype.number(),
        id: faker.datatype.number(),
        title: faker.lorem.sentence(),
        startAt: faker.date.past().toISOString(),
        listenerPeakCount: faker.datatype.number(),
      },
    };

    sendBroadcastState(wsClient, broadcastState);

    expect(send).toHaveBeenCalledTimes(1);
    expect((send as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:state",
      data: broadcastState,
    });
    expect((send as any).mock.calls[0][1]).toStrictEqual(wsClient);
  });
});
