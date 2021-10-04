import EventEmitter from "events";
import { ChatMsg, ChatMsgId, ChatMsgLike, ChatMsgUnlike } from "../../types";

class ChatEmitter extends EventEmitter {
  createChatMsg(msg: ChatMsg) {
    this.emit("createmessage", msg);
  }

  destroyChatMsg(msg: ChatMsgId) {
    this.emit("deletemessage", msg);
  }

  likeChatMsg(like: ChatMsgLike) {
    this.emit("likemessage", like);
  }

  unlikeChatMsg(unlike: ChatMsgUnlike) {
    this.emit("unlikemessage", unlike);
  }
}

export default new ChatEmitter();
