import * as React from "react";

import { API_ROOT_URL } from "../../config/env";
import { ChatMsgsPageResponse, ChatMsg } from "../../types";
import { useFetch } from "../../hooks/use-fetch";
import { Loader } from "../../lib/loader/loader";
import { ChatControls } from "./chat-controls/chat-controls";
import { ChatMsg as ChatMessage } from "./chat-msg/chat-msg";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Message } from "../../lib/message/message";
import { WebSocketContext } from "../../ws-client";
import { useWSStreamState } from "../../hooks/use-ws-stream-state";
import { Page } from "../../lib/page/page";

import "./chat.scss";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function PagesChat(props: Props): React.ReactElement {
  function handleAddChatComment(chatComment: ChatMsg) {
    if (isMounted && chatMsgs) {
      setMessages((prevState) => [...prevState, chatComment]);
    }
  }

  // WebSocket
  const ws = React.useContext(WebSocketContext);
  if (!ws) throw new Error("WS context is `null`");
  const broadcastState = useWSStreamState(ws);

  //

  const [nextCursor, setNextCursor] = React.useState();
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);

  const messagesEndRef = React.useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const isMounted = useIsMounted();
  const { state: chatMsgs, fetchNow: fetchMessagesNow } =
    useFetch<ChatMsgsPageResponse>();
  React.useEffect(() => {
    if (isMounted) {
      fetchMessagesNow(
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

    scrollToBottom();
  }, [isMounted, nextCursor]);

  function sortComments(a: ChatMsg, b: ChatMsg) {
    return a.id - b.id;
  }

  return (
    <Page className="chat-page">
      {chatMsgs.isLoading && <Loader for="page" color="pink" />}

      {chatMsgs.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {chatMsgs.response?.body && (
        <React.Fragment>
          <ul className={`chat-page__messages-list ${props.className || ""}`}>
            {chatMsgs.response.body.results.messages
              .sort(sortComments)
              .map((msg, index) => {
                return (
                  <ChatMessage
                    key={index}
                    username={msg.username}
                    timestamp={new Date(msg.createdAt).toLocaleTimeString()}
                    body={msg.message}
                    likedByUserId={msg.likedByUserId}
                    handleBtnClick={() => {}}
                  />
                );
              })}
          </ul>
          <div ref={messagesEndRef} />
        </React.Fragment>
      )}

      <ChatControls
        handleAddChatComment={handleAddChatComment}
        broadcastState={broadcastState}
      />
    </Page>
  );
}
