import * as React from "react";

import { ChatMsg as ChatMsgType } from "../../../types";
import { sortMessages } from "../../../utils/sort-messages";
import { ChatMsg } from "../chat-msg/chat-msg";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  messages: ChatMsgType[];
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
}

function MsgsList(props: Props) {
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView();
  }
  const messagesEndRef = React.useRef<any>(null);
  React.useEffect(scrollToBottom, [props.messages]);

  return (
    <ul className="chat-page__messages-list">
      {props.messages.sort(sortMessages).map((msg, index) => {
        return (
          <ChatMsg
            message={msg}
            key={index}
            handleDeleteMessage={props.handleDeleteMessage}
          />
        );
      })}
      <li ref={messagesEndRef} />
    </ul>
  );
}

export { MsgsList };
