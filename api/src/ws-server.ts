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
  onClose,
  onConnection,
} from "./services/ws";
import * as chatService from "./services/chat";
import * as streamService from "./services/stream";
import * as wsService from "./services/ws";

const wsServer = new Server(serverOptions);

wsServer.on("connection", onConnection);
wsServer.on("close", onClose);

wsService.clientStore.on("add_client", onAddClient);
wsService.clientStore.on("delete_client", onDeleteClient);
wsService.clientStore.on("update_client_count", onUpdateClientCount);
streamService.events.on("start", onStreamStart);
streamService.events.on("end", onStreamEnd);
streamService.events.on("like", onStreamLike);
chatService.events.on("create_message", onCreateChatMsg);
chatService.events.on("delete_message", onDestroyChatMsg);
chatService.events.on("like_message", onLikeChatMsg);
chatService.events.on("unlike_message", onUnlikeChatMsg);

export { wsServer };
