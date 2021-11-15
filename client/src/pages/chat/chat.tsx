import * as React from "react";

import { API_ROOT_URL } from "../../config/env";
import {
  ChatMsgsPageResponse,
  ChatMsg as ChatMsgType,
  BroadcastState,
  SavedBroadcastLike,
  ChatMsgLike,
  ChatMsgId,
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

import "./chat.scss";

type Props = React.HTMLAttributes<HTMLDivElement>;

function useChatMessages() {}

export function PagesChat(props: Props): React.ReactElement {
  function addMessage(newMessage: ChatMsgType) {
    setMessages((m) => [...m, newMessage]);
  }

  const auth = useAuthN();
  const isMounted = useIsMounted();

  // TODO: implement pagination using 'nextCursor'
  const [nextCursor, setNextCursor] = React.useState();
  const {
    state: getMessageHistoryResponse,
    fetchNow: gethMessageHistoryRequest,
  } = useFetch<ChatMsgsPageResponse>();
  React.useEffect(() => {
    if (isMounted) {
      gethMessageHistoryRequest(
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

  const newChatMessage = useWebSocketEvents<ChatMsgType | null>(
    "chat:created_message",
    null
  );
  React.useEffect(() => {
    if (newChatMessage) {
      console.log("NEW CHAT MESSAGW", newChatMessage);
      addMessage(newChatMessage);
    }
  }, [newChatMessage]);

  const deletedChatMessage = useWebSocketEvents<ChatMsgId | null>(
    "chat:deleted_message",
    null
  );
  React.useEffect(() => {
    if (deletedChatMessage) {
      setMessages((m) => m.filter((m) => m.id !== deletedChatMessage.id));
    }
  }, [deletedChatMessage]);

  //

  const [messages, setMessages] = React.useState<ChatMsgType[]>([]);
  React.useEffect(() => {
    if (getMessageHistoryResponse.response?.body) {
      setMessages(getMessageHistoryResponse.response.body.results.messages);
    }
  }, [getMessageHistoryResponse]);

  //

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView();
  }
  const messagesEndRef = React.useRef<any>(null);
  React.useEffect(scrollToBottom, [messages]);

  //

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
      deleteAnyMessageRequest(
        `${API_ROOT_URL}/admin/chat/messages/${msg.messageId}?user_id=${msg.userId}`,
        { method: "DELETE" }
      );
      setDeletedMsgId(msg.messageId);
    } else if (hasPermissionToDeleteOwnMsg) {
      deleteOwnMessageRequest(
        `${API_ROOT_URL}/chat/messages/${msg.messageId}`,
        { method: "DELETE" }
      );
      setDeletedMsgId(msg.messageId);
    }
  }

  const { state: deleteAnyMessageResponse, fetchNow: deleteAnyMessageRequest } =
    useFetch();
  const { state: deleteOwnMessageResponse, fetchNow: deleteOwnMessageRequest } =
    useFetch();
  const [deletedMsgId, setDeletedMsgId] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (
      (deleteAnyMessageResponse.response || deleteOwnMessageResponse) &&
      deletedMsgId
    ) {
      setMessages((m) => m.filter((m) => m.id !== deletedMsgId));
    }
  }, [deleteAnyMessageResponse, deleteOwnMessageResponse]);

  // TODO: subscribe here to chat DELETE event and filter out the deleted messsage when the event happens using the data from this WS message

  return (
    <Page className="chat-page">
      {getMessageHistoryResponse.isLoading && (
        <Loader for="page" color="pink" />
      )}

      {getMessageHistoryResponse.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {getMessageHistoryResponse.response?.body && (
        <ul className="chat-page__messages-list">
          {messages.sort(sortMessages).map((msg, index) => {
            return (
              <ChatMsg
                message={msg}
                key={index}
                handleDeleteMessage={handleDeleteMessage}
              />
            );
          })}
          <li ref={messagesEndRef} />
        </ul>
      )}

      <ChatControls handleAddChatMessage={addMessage} />
    </Page>
  );
}
