import EventEmitter from "events";
import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { onConnection } from "./event-handlers";
import {
  onUnlikeChatMsg,
  onLikeChatMsg,
  onDestroyChatMsg,
  onCreateChatMsg,
  onUpdateClientCount,
  onDeleteClient,
  onAddClient,
  onChatStart,
} from "../chat";
import {
  sendBroadcastState,
  onStreamEnd,
  onStreamLike,
  onStreamStart,
} from "../stream";
import { wsService } from "./service";
import {
  SanitizedWSChatClient,
  DeletedWSClient,
  WSClient,
  BroadcastDraft,
  BroadcastState,
} from "../../types";

jest.mock("../../services/ws/ws", () => {
  return {
    clientStore: {
      addClient: jest.fn(),
      clientCount: 0,
      clients: [],
      sanitizedClients: [],
    },
    send: jest.fn(),
    sendToAll: jest.fn(),
    sendToAllExceptSender: jest.fn(),
  };
});

jest.mock("../../services/stream/stream", () => {
  return {
    async readBroadcastState() {
      return { isOnline: false };
    },
  };
});

const wsClient: WSClient = {
  uuid: uuidv4(),
  id: faker.number.int(),
  username: faker.internet.userName(),
  socket: {} as WebSocket,
};

beforeEach(() => {
  jest.mocked(wsService.send).mockClear();
  jest.mocked(wsService.sendToAll).mockClear();
  jest.mocked(wsService.sendToAllExceptSender).mockClear();
});

describe("onConnection", () => {
  // TODO check whether this function is properly isolated, cause in old code, it has been mocking jest.mock("../../src/event-handlers/services-handlers");

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
    (wsService.clientStore.addClient as any).mockClear();
    (sendBroadcastState as any).mockClear();
    jest.mocked(onChatStart).mockClear(); // ??? delete if not needed
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

    expect(wsService.clientStore.addClient).toHaveBeenCalledTimes(1);
    expect(wsService.clientStore.addClient).toHaveBeenCalledWith(client);
  });
});

describe("onAddClient", () => {
  it("sands the message to all clients", () => {
    const eventData: SanitizedWSChatClient = {
      uuid: uuidv4(),
      username: faker.internet.userName(),
    };

    onAddClient(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);
    expect((wsService.sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:new_client",
      data: eventData,
    });
    expect((wsService.sendToAll as any).mock.calls[0][1]).toStrictEqual(
      wsService.clientStore.clients,
    );
  });
});

describe("onDeleteClient", () => {
  it("sends the message to all clients", () => {
    const eventData: DeletedWSClient = {
      uuid: uuidv4(),
      username: faker.internet.userName(),
      id: faker.number.int(),
    };

    onDeleteClient(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);
    expect((wsService.sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:deleted_client",
      data: eventData,
    });
    expect((wsService.sendToAll as any).mock.calls[0][1]).toStrictEqual(
      wsService.clientStore.clients,
    );
  });
});

describe("onUpdateClientCount", () => {
  it("sends the message to all clients", () => {
    const eventData = faker.number.int();

    onUpdateClientCount(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);
    expect((wsService.sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:client_count",
      data: { count: eventData },
    });
    expect((wsService.sendToAll as any).mock.calls[0][1]).toStrictEqual(
      wsService.clientStore.clients,
    );
  });
});

describe("onCreateChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      id: faker.number.int(),
      userUUID: uuidv4(),
      userId: faker.number.int(),
      username: faker.internet.userName(),
      createdAt: faker.date.past().toISOString(),
      message: faker.lorem.paragraph(),
      likedByUserId: [2, 8, 25, 48],
    };

    onCreateChatMsg(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][0],
    ).toStrictEqual({
      event: "chat:created_message",
      data: eventData,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][1],
    ).toStrictEqual({
      senderUUID: eventData.userUUID,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][2],
    ).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onDestroyChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      id: faker.number.int(),
      userUUID: uuidv4(),
      userId: faker.number.int(),
    };

    onDestroyChatMsg(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][0],
    ).toStrictEqual({
      event: "chat:deleted_message",
      data: eventData,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][1],
    ).toStrictEqual({
      senderUUID: eventData.userUUID,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][2],
    ).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onLikeChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      messageId: faker.number.int(),
      likedByUserId: faker.number.int(),
      likedByUserIds: [8, 58, 78, 9],
      likedByUserUUID: uuidv4(),
    };

    onLikeChatMsg(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][0],
    ).toStrictEqual({
      event: "chat:liked_message",
      data: eventData,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][1],
    ).toStrictEqual({
      senderUUID: eventData.likedByUserUUID,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][2],
    ).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onUnlikeChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      messageId: faker.number.int(),
      unlikedByUserUUID: uuidv4(),
      unlikedByUserId: faker.number.int(),
      likedByUserIds: [45, 15, 1, 57],
    };

    onUnlikeChatMsg(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][0],
    ).toStrictEqual({
      event: "chat:unliked_message",
      data: eventData,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][1],
    ).toStrictEqual({
      senderUUID: eventData.unlikedByUserUUID,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][2],
    ).toStrictEqual(wsService.clientStore.clients);
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

    expect(wsService.send).toHaveBeenCalledTimes(1);
    expect((wsService.send as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:client_list",
      data: allCurrentWSclients,
    });
    expect((wsService.send as any).mock.calls[0][1]).toStrictEqual(wsClient);
  });
});

describe("onChatStart", () => {
  it("sends the message to the client", () => {
    const clientCount = faker.number.int();
    jest.mocked(wsService.clientStore).clientCount ... ???// TODO 

    onChatStart(wsClient, clientCount);

    expect(wsService.send).toHaveBeenCalledTimes(1);
    expect((wsService.send as any).mock.calls[0][0]).toStrictEqual({
      event: "chat:client_count",
      data: { count: clientCount },
    });
    expect((wsService.send as any).mock.calls[0][1]).toStrictEqual(wsClient);
  });
});

describe("onStreamLike", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      broadcastId: faker.number.int(),
      likedByUserUUID: uuidv4(),
      likedByUserId: faker.number.int(),
      likedByUsername: faker.internet.userName(),
      likeCount: faker.number.int(),
    };

    onStreamLike(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][0],
    ).toStrictEqual({
      event: "stream:like",
      data: eventData,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][1],
    ).toStrictEqual({
      senderUUID: eventData.likedByUserUUID,
    });
    expect(
      (wsService.sendToAllExceptSender as any).mock.calls[0][2],
    ).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onStreamStart", () => {
  it("sends the message to all clients", () => {
    const eventData: BroadcastDraft = {
      id: faker.number.int(),
      title: faker.lorem.sentence(),
      startAt: faker.date.past().toISOString(),
      listenerPeakCount: faker.number.int(),
      likeCount: faker.number.int(),
    };

    onStreamStart(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);
    expect((wsService.sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:state",
      data: { isOnline: true, broadcast: eventData },
    });
    expect((wsService.sendToAll as any).mock.calls[0][1]).toStrictEqual(
      wsService.clientStore.clients,
    );
  });
});

describe("onStreamEnd", () => {
  it("sends the message to all clients", () => {
    onStreamEnd();

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);
    expect((wsService.sendToAll as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:state",
      data: { isOnline: false },
    });
    expect((wsService.sendToAll as any).mock.calls[0][1]).toStrictEqual(
      wsService.clientStore.clients,
    );
  });
});

describe("sendBroadcastState", () => {
  it("sends the message to the client", () => {
    const broadcastState: BroadcastState = {
      isOnline: faker.datatype.boolean(),
      broadcast: {
        likeCount: faker.number.int(),
        id: faker.number.int(),
        title: faker.lorem.sentence(),
        startAt: faker.date.past().toISOString(),
        listenerPeakCount: faker.number.int(),
      },
    };

    sendBroadcastState(wsClient, broadcastState);

    expect(wsService.send).toHaveBeenCalledTimes(1);
    expect((wsService.send as any).mock.calls[0][0]).toStrictEqual({
      event: "stream:state",
      data: broadcastState,
    });
    expect((wsService.send as any).mock.calls[0][1]).toStrictEqual(wsClient);
  });
});
