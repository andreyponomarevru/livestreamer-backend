import { wsService } from "../ws";
import {
  SanitizedWSChatClient,
  ClientCount,
  WSClient,
  ChatMsg,
  ChatMsgId,
  ChatMsgLike,
  ChatMsgUnlike,
  DeletedWSClient,
} from "../../types";

export function onCreateChatMsg(msg: ChatMsg & { userUUID: string }): void {
  wsService.sendToAllExceptSender(
    { event: "chat:created_message", data: msg },
    { senderUUID: msg.userUUID },
    wsService.clientStore.clients,
  );
}

export function onDestroyChatMsg(msg: ChatMsgId & { userUUID: string }): void {
  wsService.sendToAllExceptSender(
    { event: "chat:deleted_message", data: msg },
    { senderUUID: msg.userUUID },
    wsService.clientStore.clients,
  );
}

export function onLikeChatMsg(
  like: ChatMsgLike & { likedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender(
    { event: "chat:liked_message", data: like },
    { senderUUID: like.likedByUserUUID },
    wsService.clientStore.clients,
  );
}

export function onUnlikeChatMsg(
  unlike: ChatMsgUnlike & { unlikedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender(
    { event: "chat:unliked_message", data: unlike },
    { senderUUID: unlike.unlikedByUserUUID },
    wsService.clientStore.clients,
  );
}

export function onChatStart(client: WSClient) {
  wsService.send(
    { event: "chat:client_list", data: wsService.clientStore.sanitizedClients },
    client,
  );
  wsService.send<ClientCount>(
    {
      event: "chat:client_count",
      data: { count: wsService.clientStore.clientCount },
    },
    client,
  );
}

export function onAddClient(client: SanitizedWSChatClient): void {
  wsService.sendToAll<SanitizedWSChatClient>(
    { event: "chat:new_client", data: client },
    wsService.clientStore.clients,
  );
}

export function onDeleteClient(client: DeletedWSClient): void {
  wsService.sendToAll<DeletedWSClient>(
    { event: "chat:deleted_client", data: client },
    wsService.clientStore.clients,
  );
}

export function onUpdateClientCount(clientCount: number): void {
  wsService.sendToAll<ClientCount>(
    { event: "chat:client_count", data: { count: clientCount } },
    wsService.clientStore.clients,
  );
}
