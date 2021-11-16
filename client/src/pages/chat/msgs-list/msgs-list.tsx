import * as React from "react";
import { ChatMsg as ChatMsgType } from "../../../types";
import { sortMessages } from "../../../utils/sort-messages";
import { hasPermission } from "../../../utils/has-permission";
import { useAuthN } from "../../../hooks/use-authn";
import { ChatMsg } from "../chat-msg/chat-msg";
import { API_ROOT_URL } from "../../../config/env";
import { useWebSocketEvents } from "../../../hooks/use-ws-stream-like";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  messages: ChatMsgType[];
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
}

function MsgsList({ messages, handleDeleteMessage }: Props) {
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView();
  }
  const messagesEndRef = React.useRef<any>(null);
  React.useEffect(scrollToBottom, [messages]);

  return (
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
  );
}

export { MsgsList };
