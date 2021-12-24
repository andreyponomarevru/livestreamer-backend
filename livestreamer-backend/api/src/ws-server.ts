import { Server } from "ws";

import { logger } from "./config/logger";
import { serverOptions } from "./config/ws-server";
import { WSClient } from "./types";
import {
  onCreateChatMsg,
  onDestroyChatMsg,
  onLikeChatMsg,
  onUnlikeChatMsg,
  sendClientCount,
  sendClientsList,
  onStreamEnd,
  onStreamLike,
  onStreamStart,
  sendBroadcastState,
} from "./services/ws/ws-event-handlers";
import {
  onAddClient,
  onDeleteClient,
  onUpdateClientCount,
} from "./services/ws/ws-event-handlers";
import * as chatService from "./services/chat/chat";
import * as streamService from "./services/stream/stream";
import { clientStore } from "./services/ws/ws";

async function handleUpgrade(client: WSClient): Promise<void> {
  wsServer.emit("connection", client);
}

async function onConnection(client: WSClient): Promise<void> {
  client.socket.on("close", () => clientStore.deleteClient(client.uuid));
  sendBroadcastState(client, await streamService.readBroadcastState());
  clientStore.addClient(client);
  sendClientsList(client, clientStore.sanitizedClients);
  sendClientCount(client, clientStore.clientCount);
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
