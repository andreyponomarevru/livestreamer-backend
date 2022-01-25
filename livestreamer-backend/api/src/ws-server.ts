import { Server } from "ws";

import { serverOptions } from "./config/ws-server";
import {
  onCreateChatMsg,
  onDestroyChatMsg,
  onLikeChatMsg,
  onUnlikeChatMsg,
  onStreamEnd,
  onStreamLike,
  onStreamStart,
  onAddClient,
  onDeleteClient,
  onUpdateClientCount,
} from "./event-handlers/services-handlers";
import * as chatService from "./services/chat/chat";
import * as streamService from "./services/stream/stream";
import { clientStore } from "./services/ws/ws";
import { onConnection, onClose } from "./event-handlers/ws-server-handlers";

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

export { wsServer };
