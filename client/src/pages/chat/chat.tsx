import * as React from "react";

import { API_ROOT_URL } from "../../config/env";
import {
  ChatMsgsPageResponse,
  ChatMsg as ChatMsgType,
  BroadcastState,
  SavedBroadcastLike,
  ChatMsgLike,
  ChatMsgId,
  ChatMessageResponse,
} from "../../types";
import { useFetch } from "../../hooks/use-fetch";
import { Loader } from "../../lib/loader/loader";
import { ChatControls } from "./chat-controls/chat-controls";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Message } from "../../lib/message/message";
import { Page } from "../../lib/page/page";
import { sortMessages } from "../../utils/sort-messages";
import { ChatMsg } from "./chat-msg/chat-msg";
import { hasPermission } from "../../utils/has-permission";
import { useAuthN } from "../../hooks/use-authn";
import { useNavigate } from "react-router";
import { useWebSocketEvents } from "../../hooks/use-ws-stream-like";
import { MsgsList } from "./msgs-list/msgs-list";

import "./chat.scss";

function useChatHistory() {
  function addMessage(message: ChatMsgType) {
    setMessages((m) => [...m, message]);
  }

  function deleteMessage(id: number) {
    setMessages((m) => m.filter((m) => m.id !== id));
  }

  const auth = useAuthN();
  const isMounted = useIsMounted();
  // TODO: implement pagination using 'nextCursor'
  const [nextCursor, setNextCursor] = React.useState();
  const { state: getMessagesRes, fetchNow: gethMessagesReq } =
    useFetch<ChatMsgsPageResponse>();

  React.useEffect(() => {
    if (isMounted) {
      gethMessagesReq(
        `${API_ROOT_URL}/chat/messages?limit=50${
          nextCursor ? `&next_cursor=${nextCursor}` : ""
        }`,
        {
          method: "get",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
        }
      );
    }
  }, [isMounted, nextCursor]);

  const [messages, setMessages] = React.useState<ChatMsgType[]>([]);
  React.useEffect(() => {
    if (getMessagesRes.response?.body) {
      setMessages(getMessagesRes.response.body.results.messages);
    }
  }, [getMessagesRes]);

  return { messages, addMessage, deleteMessage };
}

function useDeleteMessage(deleteMessage: (id: number) => void) {
  function handleDeleteMessage(msg: { messageId: number; userId: number }) {
    const hasPermissionToDeleteAnyMsg = hasPermission(
      { resource: "any_chat_message", action: "delete" },
      auth.user
    );
    const hasPermissionToDeleteOwnMsg = hasPermission(
      { resource: "user_own_chat_message", action: "delete" },
      auth.user
    );

    if (hasPermissionToDeleteAnyMsg) {
      sendDeleteMessageReq(
        `${API_ROOT_URL}/admin/chat/messages/${msg.messageId}?user_id=${msg.userId}`,
        { method: "DELETE" }
      );
      setDeletedMessageId(msg.messageId);
    } else if (hasPermissionToDeleteOwnMsg) {
      sendDeleteMessageReq(`${API_ROOT_URL}/chat/messages/${msg.messageId}`, {
        method: "DELETE",
      });
      setDeletedMessageId(msg.messageId);
    }
  }

  const auth = useAuthN();

  const [deletedMessageId, setDeletedMessageId] = React.useState<number>();
  const { state: deleteMessageRes, fetchNow: sendDeleteMessageReq } =
    useFetch();
  React.useEffect(() => {
    if (deleteMessageRes.response && deletedMessageId) {
      deleteMessage(deletedMessageId);
    }
  }, [deleteMessageRes, deletedMessageId]);

  return handleDeleteMessage;
}

function useCreateMessageWSEvent(addMessage: (message: ChatMsgType) => void) {
  const newChatMessage = useWebSocketEvents<ChatMsgType | null>(
    "chat:created_message",
    null
  );
  React.useEffect(() => {
    if (newChatMessage) addMessage(newChatMessage);
  }, [newChatMessage]);
}

function useDeleteMessageWSEvent(deleteMessage: (id: number) => void) {
  const deleteMsgEvent = useWebSocketEvents<ChatMsgId | null>(
    "chat:deleted_message",
    null
  );
  React.useEffect(() => {
    if (deleteMsgEvent) deleteMessage(deleteMsgEvent.id);
  }, [deleteMsgEvent]);
}

function PagesChat(): React.ReactElement {
  const { messages, addMessage, deleteMessage } = useChatHistory();

  useCreateMessageWSEvent(addMessage);
  useDeleteMessageWSEvent(deleteMessage);
  const handleDeleteMessage = useDeleteMessage(deleteMessage);

  return (
    <Page className="chat-page">
      <MsgsList messages={messages} handleDeleteMessage={handleDeleteMessage} />
      <ChatControls handleAddMessage={addMessage} />
    </Page>
  );
}

export { PagesChat };
