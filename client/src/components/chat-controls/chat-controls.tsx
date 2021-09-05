import React, { ReactElement } from "react";

import { HeartBtn } from "./heart-btn/heart-btn";
import { SendChatMsgBtn } from "./send-chat-msg-btn/send-chat-msg-btn";

import "./chat-controls.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
}

export function ChatControls(props: Props): ReactElement {
  return (
    <div className={`chat-controls ${props.className}`}>
      <input
        className="chat-controls__input"
        type="text"
        name="message"
        autoComplete="off"
        placeholder="Type a message here..."
      />
      <div className="chat-controls__btns">
        <SendChatMsgBtn handleBtnClick={() => {}} />
        <HeartBtn handleBtnClick={() => {}} />
      </div>
    </div>
  );
}
