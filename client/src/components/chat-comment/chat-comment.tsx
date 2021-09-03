import React, { ReactElement } from "react";

import { LikeBtn } from "../like-btn/like-btn";

import "./chat-comment.scss";

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
        <div className="chat-comment__controls">
          <LikeBtn handleBtnClick={() => {}} />
        </div>
      </header>
      <div className="chat-comment__body">{props.body}</div>
    </div>
  );
}
