import React, { ReactElement } from "react";

import icons from "./../../../icons.svg";
import "./send-chat-msg-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
}

export function SendChatMsgBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <button
      className={`send-chat-msg-btn ${className}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="chat-message"
      value=""
    >
      <svg className="send-chat-msg-btn__icon">
        <use href={`${icons}#arrow-right`} />
      </svg>
    </button>
  );
}
