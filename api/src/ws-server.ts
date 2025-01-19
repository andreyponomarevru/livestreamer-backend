import { Server } from "ws";
import { serverOptions } from "./config/ws-server";
import { onClose, onConnection } from "./services/ws/index";
import {
  chatService,
  onCreateChatMsg,
  onDestroyChatMsg,
  onLikeChatMsg,
  onUnlikeChatMsg,
  onAddClient,
  onDeleteClient,
  onUpdateClientCount,
  onChatStart,
} from "./services/chat";
import {
  streamService,
  onStreamEnd,
  onStreamLike,
  onStreamStart,
} from "./services/stream";
import { wsService } from "./services/ws";

export const wsServer = new Server(serverOptions);

wsServer.on("connection", onConnection);
wsServer.on("connection", onChatStart);
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
