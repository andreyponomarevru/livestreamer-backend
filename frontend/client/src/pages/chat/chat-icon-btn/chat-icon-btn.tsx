import React, { ReactElement } from "react";

import icons from "./../../../icons.svg";
import "./chat-icon-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  icon: "like" | "trash-can";
  isActive?: boolean;
}

function ChatIconBtn(props: Props): ReactElement {
  return (
    <button
      className={`chat-icon-btn ${props.className || ""}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="heart"
      value=""
    >
      <svg
        className={`chat-icon-btn__icon ${
          props.isActive ? "chat-icon-btn__icon_active" : ""
        }`}
      >
        <use href={`${icons}#${props.icon}`} />
      </svg>
    </button>
  );
}

export { ChatIconBtn };
