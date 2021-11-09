import * as db from "../../models/chat/queries";
import { ChatEmitter } from "./events";
import { ChatMsgId, NewChatMsg, ChatMsg } from "../../types";

export async function createMsg(
  msg: NewChatMsg & { userUUID: string },
): Promise<ChatMsg & { userUUID: string }> {
  const savedMsg = await db.createMsg(msg);
  if (savedMsg) events.createChatMsg({ ...savedMsg, userUUID: msg.userUUID });
  return { ...savedMsg, userUUID: msg.userUUID };
}

export async function destroyMsg(
  msg: ChatMsgId & { userUUID: string },
): Promise<void> {
  const destroyedMsg = await db.destroyMsg(msg);
  if (destroyedMsg)
    events.destroyChatMsg({ ...destroyedMsg, userUUID: msg.userUUID });
}

export async function readMsgsPaginated(
  limit: number,
  nextCursor?: string,
): Promise<{
  nextCursor: string | null;
  messages: {
    id: number;
    userId: number;
    username: string;
    createdAt: string;
    message: string;
    likedByUserId: number[];
  }[];
}> {
  const page = await db.readMsgsPaginated(limit, nextCursor);
  return {
    nextCursor: page.nextCursor,
    messages: page.items,
  };
}

export async function likeMsg(
  msg: ChatMsgId & { userUUID: string },
): Promise<void> {
  const like = await db.createMsgLike(msg);
  if (like) events.likeChatMsg({ ...like, likedByUserUUID: msg.userUUID });
}

export async function unlikeMsg(
  unlike: ChatMsgId & { userUUID: string },
): Promise<void> {
  const msg = await db.destroyMsgLike(unlike);
  if (msg) events.unlikeChatMsg({ ...msg, unlikedByUserUUID: unlike.userUUID });
}

export const events = new ChatEmitter();
