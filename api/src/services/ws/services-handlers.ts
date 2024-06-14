import { sendToAll, sendToAllExceptSender, send, clientStore } from "./ws";
import {
  DeletedWSClient,
  SanitizedWSChatClient,
  ClientCount,
  BroadcastDraft,
  SavedBroadcastLike,
  WSClient,
  BroadcastState,
  ChatMsg,
  ChatMsgId,
  ChatMsgLike,
  ChatMsgUnlike,
} from "../../types";
import * as streamService from "../stream/stream";
import { logger } from "../../config/logger";

//
// WS Server (socket) events
//

export async function onConnection(client: WSClient): Promise<void> {
  client.socket.on("close", () => clientStore.deleteClient(client.uuid));
  sendBroadcastState(client, await streamService.readBroadcastState());
  clientStore.addClient(client);
  sendClientsList(client, clientStore.sanitizedClients);
  sendClientCount(client, clientStore.clientCount);
}

export function onClose(): void {
  logger.info(`${__filename}: WebSocket Server closed, bye.`);
}

//
// WS Service events (WS Client Store)
//

function onAddClient(client: SanitizedWSChatClient): void {
  sendToAll<SanitizedWSChatClient>(
    { event: "chat:new_client", data: client },
    clientStore.clients,
  );
}

function onDeleteClient(client: DeletedWSClient): void {
  sendToAll<DeletedWSClient>(
    { event: "chat:deleted_client", data: client },
    clientStore.clients,
  );
}

function onUpdateClientCount(clientCount: number): void {
  sendToAll<ClientCount>(
    { event: "chat:client_count", data: { count: clientCount } },
    clientStore.clients,
  );
}

//
// Chat Service Events
//

function onCreateChatMsg(msg: ChatMsg & { userUUID: string }): void {
  sendToAllExceptSender(
    { event: "chat:created_message", data: msg },
    { senderUUID: msg.userUUID },
    clientStore.clients,
  );
}

function onDestroyChatMsg(msg: ChatMsgId & { userUUID: string }): void {
  sendToAllExceptSender(
    { event: "chat:deleted_message", data: msg },
    { senderUUID: msg.userUUID },
    clientStore.clients,
  );
}

function onLikeChatMsg(like: ChatMsgLike & { likedByUserUUID: string }): void {
  sendToAllExceptSender(
    { event: "chat:liked_message", data: like },
    { senderUUID: like.likedByUserUUID },
    clientStore.clients,
  );
}

function onUnlikeChatMsg(
  unlike: ChatMsgUnlike & { unlikedByUserUUID: string },
): void {
  sendToAllExceptSender(
    { event: "chat:unliked_message", data: unlike },
    { senderUUID: unlike.unlikedByUserUUID },
    clientStore.clients,
  );
}

function sendClientsList(
  reciever: WSClient,
  clients: SanitizedWSChatClient[],
): void {
  send({ event: "chat:client_list", data: clients }, reciever);
}

function sendClientCount(reciever: WSClient, clientCount: number): void {
  send<ClientCount>(
    { event: "chat:client_count", data: { count: clientCount } },
    reciever,
  );
}

//
// Stream Service Events
//

function onStreamLike(
  like: SavedBroadcastLike & { likedByUserUUID: string },
): void {
  sendToAllExceptSender(
    { event: "stream:like", data: like },
    { senderUUID: like.likedByUserUUID },
    clientStore.clients,
  );
}

function onStreamStart(broadcast: BroadcastDraft): void {
  sendToAll(
    { event: "stream:state", data: { isOnline: true, broadcast } },
    clientStore.clients,
  );
}

function onStreamEnd(): void {
  sendToAll(
    { event: "stream:state", data: { isOnline: false } },
    clientStore.clients,
  );
}

function sendBroadcastState(
  reciever: WSClient,
  broadcastState: BroadcastState,
): void {
  send({ event: "stream:state", data: broadcastState }, reciever);
}

export {
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
};
