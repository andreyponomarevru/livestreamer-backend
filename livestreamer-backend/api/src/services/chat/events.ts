import EventEmitter from "events";
import { ChatMsg, ChatMsgId, ChatMsgLike, ChatMsgUnlike } from "../../types";

export interface ChatEmitter {
  on(
    event: "create_message",
    listener: (msg: ChatMsg & { userUUID: string }) => void,
  ): this;
  on(
    event: "delete_message",
    listener: (msg: ChatMsgId & { userUUID: string }) => void,
  ): this;
  on(
    event: "like_message",
    listener: (msg: ChatMsgLike & { likedByUserUUID: string }) => void,
  ): this;
  on(
    event: "unlike_message",
    listener: (msg: ChatMsgUnlike & { unlikedByUserUUID: string }) => void,
  ): this;
}

export class ChatEmitter extends EventEmitter {
  createChatMsg(msg: ChatMsg & { userUUID: string }): void {
    this.emit("create_message", msg);
  }

  destroyChatMsg(msg: ChatMsgId & { userUUID: string }): void {
    this.emit("delete_message", msg);
  }

  likeChatMsg(like: ChatMsgLike & { likedByUserUUID: string }): void {
    this.emit("like_message", like);
  }

  unlikeChatMsg(unlike: ChatMsgUnlike & { unlikedByUserUUID: string }): void {
    this.emit("unlike_message", unlike);
  }
}
