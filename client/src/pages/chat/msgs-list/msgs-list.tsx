import * as React from "react";
import { ChatMsg } from "../chat-msg/chat-msg";
import { ChatMsg as ChatMsgType } from "../../../types";
import { sortMessages } from "../../../utils/sort-messages";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMsgType[];
}

function MsgsList(props: Props) {
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const messagesEndRef = React.useRef<any>(null);
  React.useEffect(scrollToBottom, [props.messages]);

  return (
    <ul className={props.className || ""}>
      {props.messages.sort(sortMessages).map((msg, index) => {
        return (
          <ChatMsg
            key={index}
            username={msg.username}
            timestamp={new Date(msg.createdAt).toLocaleTimeString()}
            body={msg.message}
            likedByUserId={msg.likedByUserId}
            handleBtnClick={() => {}}
          />
        );
      })}
      <li ref={messagesEndRef} />
    </ul>
  );
}

export { MsgsList };
