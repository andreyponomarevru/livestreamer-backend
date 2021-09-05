import React, { ReactElement } from "react";

import { LikeBtn } from "./like-btn/like-btn";

import "./chat-comment.scss";
import { DeleteBtn } from "./delete-btn/delete-btn";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  username: string;
  timestamp: string;
  body: string;
}

export function ChatComment(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <div className={`chat-comment ${className}`}>
      <header className="chat-comment__header">
        <span className="chat-comment__meta">
          <span className="chat-comment__username">{props.username}</span>
          <span className="chat-comment__timestamp">{props.timestamp}</span>
        </span>
      </header>

      <div className="chat-comment__like-box">
        <span className="chat-comment__like-counter">5</span>
        <LikeBtn handleBtnClick={() => {}} />
      </div>

      <div className="chat-comment__body">{props.body}</div>

      <DeleteBtn
        className="chat-comment__delete-btn"
        handleBtnClick={() => {}}
      />
    </div>
  );
}
