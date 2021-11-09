import { Server } from "ws";

import WebSocket from "ws";

import { logger } from "./config/logger";
import { serverOptions } from "./config/ws-server";
import { WSClient, ClientCount } from "./types";
import {
  onCreateChatMsg,
  onDestroyChatMsg,
  onLikeChatMsg,
  onUnlikeChatMsg,
} from "./services/ws/event-handlers/chat-event-handlers";
import {
  onAddClient,
  onDeleteClient,
  onUpdateClientCount,
} from "./services/ws/event-handlers/ws-client-store-event-handlers";
import * as chatService from "./services/chat/chat";
import * as wsService from "./services/ws/ws";
import * as streamService from "./services/stream/stream";
import {
  onStreamEnd,
  onStreamLike,
  onStreamStart,
} from "./services/ws/event-handlers/stream-event-handlers";
import { clientStore } from "./services/ws/ws";

async function handleUpgrade(client: WSClient): Promise<void> {
  wsServer.emit("connection", client);
}

function addCloseSocketHandler(uuid: string, socket: WebSocket): void {
  socket.on("close", () => clientStore.deleteClient(uuid));
}

async function sendBroadcastState(client: WSClient) {
  wsService.send(
    { event: "stream:state", data: await streamService.readBroadcastState() },
    client,
  );
}

function sendClientCount(client: WSClient): void {
  wsService.send<ClientCount>(
    {
      event: "chat:client_count",
      data: { count: clientStore.clientCount },
    },
    client,
  );
}

function sendClientsList(client: WSClient): void {
  wsService.send(
    {
      event: "chat:client_list",
      data: clientStore.sanitizedClients,
    },
    client,
  );
}

async function onConnection(client: WSClient): Promise<void> {
  addCloseSocketHandler(client.uuid, client.socket);

  await sendBroadcastState(client);
  clientStore.addClient(client);
  sendClientsList(client);
  sendClientCount(client);
}

function onClose(): void {
  logger.info(`${__filename}: WebSocket Server closed, bye.`);
}

const wsServer = new Server(serverOptions);

wsServer.on("connection", onConnection);
wsServer.on("close", onClose);

clientStore.on("add_client", onAddClient);
clientStore.on("delete_client", onDeleteClient);
clientStore.on("update_client_count", onUpdateClientCount);
streamService.events.on("start", onStreamStart);
streamService.events.on("end", onStreamEnd);
streamService.events.on("like", onStreamLike);
chatService.events.on("create_message", onCreateChatMsg);
chatService.events.on("delete_message", onDestroyChatMsg);
chatService.events.on("like_message", onLikeChatMsg);
chatService.events.on("unlike_message", onUnlikeChatMsg);

export { wsServer, handleUpgrade };
