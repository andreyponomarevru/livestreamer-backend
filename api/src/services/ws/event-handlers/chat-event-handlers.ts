import { sendToAllExceptSender } from "../ws";
import { clientStore } from "../ws";
import { ChatMsg, ChatMsgId, ChatMsgLike, ChatMsgUnlike } from "../../../types";

export function onCreateChatMsg(msg: ChatMsg & { userUUID: string }): void {
  sendToAllExceptSender(
    { event: "chat:created_message", data: msg },
    { senderUUID: msg.userUUID },
    clientStore.clients,
  );
}

export function onDestroyChatMsg(msg: ChatMsgId & { userUUID: string }): void {
  sendToAllExceptSender(
    { event: "chat:deleted_message", data: msg },
    { senderUUID: msg.userUUID },
    clientStore.clients,
  );
}

export function onLikeChatMsg(
  like: ChatMsgLike & { likedByUserUUID: string },
): void {
  sendToAllExceptSender(
    { event: "chat:liked_message", data: like },
    { senderUUID: like.likedByUserUUID },
    clientStore.clients,
  );
}

export function onUnlikeChatMsg(
  unlike: ChatMsgUnlike & { unlikedByUserUUID: string },
): void {
  sendToAllExceptSender(
    { event: "chat:unliked_message", data: unlike },
    { senderUUID: unlike.unlikedByUserUUID },
    clientStore.clients,
  );
}
