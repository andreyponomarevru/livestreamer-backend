import * as db from "../../models/chat/queries";

import chatEvents from "./chat-events";
import {
  CursorPagination,
  ChatMsgId,
  NewChatMsg,
  ChatMsg,
  PaginatedChatMsgs,
} from "../../types";

export async function createMsg(msg: NewChatMsg): Promise<ChatMsg> {
  const savedMsg = await db.createMsg(msg);
  chatEvents.createChatMsg(savedMsg);
  return savedMsg;
}

export async function destroyMsg(msg: ChatMsgId): Promise<void> {
  const destroyedMsg = await db.destroyMsg(msg);
  if (destroyedMsg) chatEvents.destroyChatMsg(destroyedMsg);
}

export async function readMsgsPaginated(
  page: CursorPagination,
): Promise<PaginatedChatMsgs> {
  return await db.readMsgsPaginated(page);
}

export async function likeMsg(msg: ChatMsgId): Promise<void> {
  const like = await db.createMsgLike(msg);
  chatEvents.likeChatMsg(like);
}

export async function unlikeMsg(unlike: ChatMsgId): Promise<void> {
  const msg = await db.destroyMsgLike(unlike);
  if (msg) chatEvents.unlikeChatMsg(msg);
}
